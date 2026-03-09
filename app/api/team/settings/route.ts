import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const { data: membership } = await supabaseAdmin
      .from('team_members')
      .select('team_id, role')
      .eq('user_id', session.user.id)
      .limit(1)
      .single()

    if (!membership || !['manager', 'scrum_master'].includes(membership.role)) {
      return NextResponse.json({ error: 'Accès réservé aux managers et Scrum Masters' }, { status: 403 })
    }

    const { data: team } = await supabaseAdmin
      .from('teams')
      .select('id, name, invite_code, organization_id')
      .eq('id', membership.team_id)
      .single()

    if (!team) {
      return NextResponse.json({ error: 'Équipe introuvable' }, { status: 404 })
    }

    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('plan')
      .eq('id', team.organization_id)
      .single()

    const plan = (org?.plan as string) || 'free'
    const { data: realMembers } = await supabaseAdmin
      .from('team_members')
      .select('id, user_id, role, joined_at')
      .eq('team_id', team.id)
      .order('joined_at', { ascending: true })

    const { data: ghostMembers } = await supabaseAdmin
      .from('ghost_members')
      .select('id, display_name, created_at, merged_into')
      .eq('team_id', team.id)
      .is('merged_into', null)
      .order('created_at', { ascending: true })

    const { data: invitations } = await supabaseAdmin
      .from('invitations')
      .select('id, email, role, expires_at, created_at')
      .eq('team_id', team.id)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: true })

    const membersWithUser = await Promise.all(
      (realMembers ?? []).map(async (m) => {
        const { data: u } = await supabaseAdmin
          .from('user')
          .select('id, name, email, firstName')
          .eq('id', m.user_id)
          .single()
        return {
          ...m,
          userName: u?.firstName || u?.name?.split(' ')[0] || u?.email?.split('@')[0] || '—',
          userEmail: u?.email,
        }
      })
    )

    const maxReal = plan === 'free' ? 3 : Infinity
    const currentReal = membersWithUser.length

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        inviteCode: team.invite_code,
        plan,
      },
      realMembers: membersWithUser,
      ghostMembers: ghostMembers ?? [],
      invitations: invitations ?? [],
      quota: { current: currentReal, max: maxReal },
    })
  } catch (err) {
    console.error('[API] team settings error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
