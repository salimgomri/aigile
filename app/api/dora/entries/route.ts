import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

const DORA_ROLES = ['manager', 'scrum_master', 'product_owner', 'agile_coach']

async function getUserTeamRole(userId: string) {
  const { data } = await supabaseAdmin
    .from('team_members')
    .select('role')
    .eq('user_id', userId)
    .limit(1)
    .single()
  return data?.role as string | null
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ entries: [] })
    }

    const role = await getUserTeamRole(session.user.id)
    if (!role || !DORA_ROLES.includes(role)) {
      return NextResponse.json({ entries: [] })
    }

    const { data: memberships } = await supabaseAdmin
      .from('team_members')
      .select('team_id')
      .eq('user_id', session.user.id)

    if (!memberships?.length) return NextResponse.json({ entries: [] })

    const { data: entries, error } = await supabaseAdmin
      .from('dora_entries')
      .select('id, team_id, sprint_id, deploy_freq, lead_time_hours, cfr_pct, mttr_hours, created_at')
      .eq('created_by', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[API] dora/entries GET error:', error)
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }

    return NextResponse.json({ entries: entries || [] })
  } catch (err) {
    console.error('[API] dora/entries error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = await getUserTeamRole(session.user.id)
    if (!role || !DORA_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { teamId, sprintId, deployFreq, leadTimeHours, cfrPct, mttrHours } = body

    if (
      typeof deployFreq !== 'number' ||
      typeof leadTimeHours !== 'number' ||
      typeof cfrPct !== 'number' ||
      typeof mttrHours !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { data: entry, error } = await supabaseAdmin
      .from('dora_entries')
      .insert({
        team_id: teamId || null,
        sprint_id: sprintId || null,
        deploy_freq: deployFreq,
        lead_time_hours: leadTimeHours,
        cfr_pct: cfrPct,
        mttr_hours: mttrHours,
        created_by: session.user.id,
      })
      .select('id, team_id, sprint_id, deploy_freq, lead_time_hours, cfr_pct, mttr_hours, created_at')
      .single()

    if (error) {
      console.error('[API] dora/entries POST error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ entry })
  } catch (err) {
    console.error('[API] dora/entries error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
