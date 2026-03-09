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
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const body = await request.json()
    const { teamId, email, role = 'dev_team' } = body

    if (!teamId || !email?.trim()) {
      return NextResponse.json({ error: 'teamId et email requis' }, { status: 400 })
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

    const emailNorm = email.trim().toLowerCase()
    const roleNorm = VALID_ROLES.includes(role) ? role : 'dev_team'

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
      .eq('email', emailNorm)
      .limit(1)

    if (users?.length) {
      const { data: alreadyInTeam } = await supabaseAdmin
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', users[0].id)
        .limit(1)
      if (alreadyInTeam?.length) {
        return NextResponse.json({ error: 'Cette personne est déjà membre' }, { status: 400 })
      }
    }

    const { data: pendingInvite } = await supabaseAdmin
      .from('invitations')
      .select('id')
      .eq('team_id', teamId)
      .eq('email', emailNorm)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .limit(1)

    if (pendingInvite?.length) {
      return NextResponse.json({ error: 'Une invitation est déjà en attente pour cet email' }, { status: 400 })
    }

    const { data: inv } = await supabaseAdmin
      .from('invitations')
      .insert({
        team_id: teamId,
        email: emailNorm,
        role: roleNorm,
        invited_by: userId,
      })
      .select('token')
      .single()

    if (!inv?.token) {
      return NextResponse.json({ error: 'Erreur création invitation' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
    const url = `${baseUrl}/invite/${inv.token}`
    void sendInvitationEmail({
      to: emailNorm,
      url,
      inviterName,
      teamName: team.name,
      role: ROLE_LABELS[roleNorm] || roleNorm,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] team invite error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
