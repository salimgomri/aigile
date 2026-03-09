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

    const { data: sprints, error } = await supabaseAdmin
      .from('sprints')
      .select('id, number, start_date, end_date, status')
      .eq('team_id', teamId)
      .order('number', { ascending: false })
      .limit(6)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 })
    }

    return NextResponse.json({ sprints: sprints || [] })
  } catch (err) {
    console.error('[API] niko-niko/sprints error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
