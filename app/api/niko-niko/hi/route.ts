import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    if (!teamId) {
      return NextResponse.json({ error: 'Missing teamId' }, { status: 400 })
    }

    const { data: membership } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', session.user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: sprints } = await supabaseAdmin
      .from('sprints')
      .select('id, number, start_date, end_date')
      .eq('team_id', teamId)
      .order('number', { ascending: false })
      .limit(6)

    if (!sprints || sprints.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const result: { sprintId: string; sprintNumber: number; hi: number }[] = []

    for (const sprint of sprints) {
      const { data: moods } = await supabaseAdmin
        .from('daily_moods')
        .select('mood')
        .eq('team_id', teamId)
        .gte('date', sprint.start_date)
        .lte('date', sprint.end_date)

      if (!moods || moods.length === 0) {
        result.push({ sprintId: sprint.id, sprintNumber: sprint.number, hi: 0 })
      } else {
        const avg = moods.reduce((s, m) => s + m.mood, 0) / moods.length
        result.push({ sprintId: sprint.id, sprintNumber: sprint.number, hi: Math.round(avg * 10) / 10 })
      }
    }

    return NextResponse.json({ data: result.reverse() })
  } catch (err) {
    console.error('[API] niko-niko/hi error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
