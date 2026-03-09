import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { canInviteRealMember } from '@/lib/team-limits'
import { sendInvitationEmail } from '@/lib/email'

const VALID_ROLES = ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest']
const ROLE_LABELS: Record<string, string> = {
  manager: 'Manager',
  scrum_master: 'Scrum Master',
  product_owner: 'Product Owner',
  agile_coach: 'Coach Agile',
  dev_team: 'Développeur',
  guest: 'Invité',
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { teamId, realMembers = [], ghostMembers = [] } = body

    if (!teamId) {
      return NextResponse.json({ error: 'teamId requis' }, { status: 400 })
    }

    const userId = session.user.id
    const inviterName =
      (session.user as { firstName?: string }).firstName ||
      session.user.name?.split(' ')[0] ||
      'Un collègue'

    const { data: membership } = await supabaseAdmin
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single()

    const { data: team } = await supabaseAdmin
      .from('teams')
      .select('id, name, organization_id')
      .eq('id', teamId)
      .single()

    if (!team) {
      return NextResponse.json({ error: 'Équipe introuvable' }, { status: 404 })
    }

    const canInvite =
      membership?.role && ['manager', 'scrum_master'].includes(membership.role)
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('owner_id')
      .eq('id', team.organization_id)
      .single()
    const isOwner = org?.owner_id === userId
    if (!canInvite && !isOwner) {
      return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'

    for (const m of realMembers) {
      const email = (m.email || '').trim().toLowerCase()
      const role = VALID_ROLES.includes(m.role) ? m.role : 'dev_team'
      if (!email) continue

      const check = await canInviteRealMember(supabaseAdmin, teamId)
      if (!check.allowed) {
        return NextResponse.json(
          { error: check.reason || 'Quota atteint', ...check },
          { status: 403 }
        )
      }

      const { data: users } = await supabaseAdmin
        .from('user')
        .select('id')
        .eq('email', email)
        .limit(1)

      if (users?.length) {
        const { data: alreadyInTeam } = await supabaseAdmin
          .from('team_members')
          .select('id')
          .eq('team_id', teamId)
          .eq('user_id', users[0].id)
          .limit(1)
        if (alreadyInTeam?.length) continue
      }

      const { data: pendingInvite } = await supabaseAdmin
        .from('invitations')
        .select('id')
        .eq('team_id', teamId)
        .eq('email', email)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .limit(1)

      if (pendingInvite?.length) continue

      const { data: inv } = await supabaseAdmin
        .from('invitations')
        .insert({
          team_id: teamId,
          email,
          role,
          invited_by: userId,
        })
        .select('token')
        .single()

      if (inv?.token) {
        const url = `${baseUrl}/invite/${inv.token}`
        void sendInvitationEmail({
          to: email,
          url,
          inviterName,
          teamName: team.name,
          role: ROLE_LABELS[role] || role,
        })
      }
    }

    for (const g of ghostMembers) {
      const displayName = (g.displayName || g.display_name || '').trim()
      if (!displayName) continue

      await supabaseAdmin.from('ghost_members').insert({
        team_id: teamId,
        display_name: displayName,
        added_by: userId,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] onboarding invite error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
