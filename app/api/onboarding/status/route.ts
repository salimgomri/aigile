import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: members } = await supabaseAdmin
      .from('team_members')
      .select('team_id')
      .eq('user_id', session.user.id)
      .limit(1)

    const hasTeam = !!members?.length

    const { data: user } = await supabaseAdmin
      .from('user')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .single()

    const onboardingCompleted = !!user?.onboarding_completed

    return NextResponse.json({ hasTeam, onboardingCompleted })
  } catch (err) {
    console.error('[API] onboarding status error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
