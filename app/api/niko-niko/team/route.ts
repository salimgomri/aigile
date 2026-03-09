import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { ensureUserCredits } from '@/lib/credits/manager'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user has a team
    const { data: memberships, error: membersError } = await supabaseAdmin
      .from('team_members')
      .select('id, team_id, role')
      .eq('user_id', userId)

    if (membersError) {
      console.error('[API] niko-niko/team members error:', membersError)
      return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
    }

    await ensureUserCredits(userId)

    if (memberships && memberships.length > 0) {
      const first = memberships[0]
      const { data: team, error: teamError } = await supabaseAdmin
        .from('teams')
        .select('id, name, organization_id')
        .eq('id', first.team_id)
        .single()

      if (teamError || !team) {
        return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
      }

      const { data: org } = await supabaseAdmin
        .from('organizations')
        .select('name')
        .eq('id', team.organization_id)
        .single()

      return NextResponse.json({
        team: {
          id: team.id,
          name: team.name,
          organizationId: team.organization_id,
          organizationName: org?.name ?? team.name,
        },
        memberId: first.id,
        role: first.role,
      })
    }

    // Create default: 1 org "Mon équipe", 1 team, user as manager (P02b)
    const slug = `org-${userId.slice(0, 8)}`
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({ name: 'Mon équipe', slug, owner_id: userId, plan: 'free' })
      .select('id')
      .single()

    if (orgError || !org) {
      console.error('[API] niko-niko/team create org error:', orgError)
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
    }

    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .insert({ name: 'Mon équipe', organization_id: org.id })
      .select('id')
      .single()

    if (teamError || !team) {
      console.error('[API] niko-niko/team create team error:', teamError)
      return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from('team_members')
      .insert({
        user_id: userId,
        team_id: team.id,
        role: 'manager',
      })
      .select('id')
      .single()

    if (memberError || !member) {
      console.error('[API] niko-niko/team create member error:', memberError)
      return NextResponse.json({ error: 'Failed to add user to team' }, { status: 500 })
    }

    // Add to organization_members
    await supabaseAdmin.from('organization_members').insert({
      user_id: userId,
      organization_id: org.id,
      role: 'owner',
    })

    return NextResponse.json({
      team: {
        id: team.id,
        name: 'Mon équipe',
        organizationId: org.id,
        organizationName: 'Mon équipe',
      },
      memberId: member.id,
      role: 'manager',
    })
  } catch (err) {
    console.error('[API] niko-niko/team error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
