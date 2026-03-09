import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

type MoodsResponse = {
  members: { id: string; userId: string; name: string; role: string }[]
  days: string[]
  moods: Record<string, number>
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sprintId = searchParams.get('sprintId')

    if (!teamId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing teamId, startDate, or endDate' },
        { status: 400 }
      )
    }

    // Verify user is team member
    const { data: membership } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', session.user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch team members
    const { data: members, error: membersError } = await supabaseAdmin
      .from('team_members')
      .select('id, user_id, role')
      .eq('team_id', teamId)
      .order('created_at', { ascending: true })

    if (membersError || !members) {
      return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
    }

    const userIds = members.map((m: { user_id: string }) => m.user_id)
    const { data: users } = await supabaseAdmin
      .from('user')
      .select('id, name, firstName, lastName')
      .in('id', userIds)

    const userMap = new Map(
      (users || []).map((u: { id: string; name?: string; firstName?: string; lastName?: string }) => [
        u.id,
        u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.name || 'Membre',
      ])
    )

    const membersList = members.map((m: { id: string; user_id: string; role: string }) => ({
      id: m.id,
      userId: m.user_id,
      name: userMap.get(m.user_id) || 'Membre',
      role: m.role,
    }))

    // Fetch moods in date range
    let query = supabaseAdmin
      .from('daily_moods')
      .select('member_id, date, mood')
      .eq('team_id', teamId)
      .gte('date', startDate)
      .lte('date', endDate)

    if (sprintId) {
      query = query.eq('sprint_id', sprintId)
    }

    const { data: moodsData, error: moodsError } = await query

    if (moodsError) {
      return NextResponse.json({ error: 'Failed to fetch moods' }, { status: 500 })
    }

    const moods: Record<string, number> = {}
    for (const row of moodsData || []) {
      moods[`${row.member_id}_${row.date}`] = row.mood
    }

    // Build days array (startDate to endDate inclusive)
    const days: string[] = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().slice(0, 10))
    }

    const response: MoodsResponse = {
      members: membersList,
      days,
      moods,
    }
    return NextResponse.json(response)
  } catch (err) {
    console.error('[API] niko-niko/moods GET error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { teamId, memberId, date, mood, sprintId } = body

    if (!teamId || !memberId || !date || mood === undefined) {
      return NextResponse.json(
        { error: 'Missing teamId, memberId, date, or mood' },
        { status: 400 }
      )
    }

    if (![1, 2, 3].includes(Number(mood))) {
      return NextResponse.json({ error: 'Mood must be 1, 2, or 3' }, { status: 400 })
    }

    const userId = session.user.id

    // Get user's role and membership
    const { data: myMembership } = await supabaseAdmin
      .from('team_members')
      .select('id, role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single()

    if (!myMembership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // dev_team can only edit own memberId
    if (myMembership.role === 'dev_team' && myMembership.id !== memberId) {
      return NextResponse.json({ error: 'Forbidden: dev_team can only edit own mood' }, { status: 403 })
    }

    // Verify memberId belongs to this team
    const { data: targetMember } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('id', memberId)
      .eq('team_id', teamId)
      .single()

    if (!targetMember) {
      return NextResponse.json({ error: 'Invalid member' }, { status: 400 })
    }

    const upsert: Record<string, unknown> = {
      member_id: memberId,
      team_id: teamId,
      date,
      mood: Number(mood),
    }
    if (sprintId) upsert.sprint_id = sprintId

    const { error } = await supabaseAdmin
      .from('daily_moods')
      .upsert(upsert, {
        onConflict: 'member_id,date',
      })

    if (error) {
      console.error('[API] niko-niko/moods POST error:', error)
      return NextResponse.json({ error: 'Failed to save mood' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] niko-niko/moods POST error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const memberId = searchParams.get('memberId')
    const date = searchParams.get('date')

    if (!teamId || !memberId || !date) {
      return NextResponse.json(
        { error: 'Missing teamId, memberId, or date' },
        { status: 400 }
      )
    }

    const userId = session.user.id

    const { data: myMembership } = await supabaseAdmin
      .from('team_members')
      .select('id, role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single()

    if (!myMembership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (myMembership.role === 'dev_team' && myMembership.id !== memberId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('daily_moods')
      .delete()
      .eq('member_id', memberId)
      .eq('team_id', teamId)
      .eq('date', date)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete mood' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] niko-niko/moods DELETE error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
