import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { ensureUserCredits } from '@/lib/credits/manager'

const VALID_ROLES = ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest']

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'org'
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organizationName, teamName, role } = body

    if (!organizationName?.trim() || !teamName?.trim() || !role) {
      return NextResponse.json(
        { error: 'organizationName, teamName et role sont requis' },
        { status: 400 }
      )
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
    }

    const userId = session.user.id
    const user = session.user as { firstName?: string; lastName?: string; name?: string }

    const { data: existing } = await supabaseAdmin
      .from('team_members')
      .select('team_id')
      .eq('user_id', userId)
      .limit(1)

    if (existing && existing.length > 0) {
      const { data: team } = await supabaseAdmin
        .from('teams')
        .select('id, invite_code')
        .eq('id', existing[0].team_id)
        .single()
      await supabaseAdmin.from('user').update({ onboarding_completed: true }).eq('id', userId)
      return NextResponse.json({
        teamId: team?.id,
        inviteCode: team?.invite_code,
        alreadyExists: true,
      })
    }

    const baseSlug = slugify(organizationName.trim())
    let slug = baseSlug
    let attempts = 0
    while (attempts < 10) {
      const { data: conflict } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('slug', slug)
        .limit(1)
      if (!conflict?.length) break
      slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`
      attempts++
    }

    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: organizationName.trim(),
        slug,
        owner_id: userId,
        plan: 'free',
      })
      .select('id')
      .single()

    if (orgError || !org) {
      console.error('[API] onboarding create-space org:', orgError)
      return NextResponse.json({ error: 'Erreur création organisation' }, { status: 500 })
    }

    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .insert({
        name: teamName.trim(),
        organization_id: org.id,
      })
      .select('id, invite_code')
      .single()

    if (teamError || !team) {
      console.error('[API] onboarding create-space team:', teamError)
      return NextResponse.json({ error: 'Erreur création équipe' }, { status: 500 })
    }

    const { error: memberError } = await supabaseAdmin
      .from('team_members')
      .insert({
        user_id: userId,
        team_id: team.id,
        role,
      })

    if (memberError) {
      console.error('[API] onboarding create-space member:', memberError)
      return NextResponse.json({ error: 'Erreur ajout membre' }, { status: 500 })
    }

    await supabaseAdmin.from('organization_members').insert({
      user_id: userId,
      organization_id: org.id,
      role: 'owner',
    })

    const updates: Record<string, unknown> = {
      role,
      onboarding_completed: true,
    }
    if (!user.firstName && user.name) {
      const parts = (user.name as string).trim().split(/\s+/)
      updates.firstName = parts[0] || ''
      updates.lastName = parts.slice(1).join(' ') || ''
    }

    await supabaseAdmin.from('user').update(updates).eq('id', userId)
    await ensureUserCredits(userId)

    return NextResponse.json({
      teamId: team.id,
      inviteCode: team.invite_code,
    })
  } catch (err) {
    console.error('[API] onboarding create-space error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
