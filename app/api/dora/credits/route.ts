import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ credits: 0 })
    }

    const { data: credits } = await supabaseAdmin
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', session.user.id)
      .single()

    const remaining = credits?.credits_remaining ?? 10
    return NextResponse.json({ credits: remaining })
  } catch (err) {
    console.error('[API] dora/credits error:', err)
    return NextResponse.json({ credits: 0 })
  }
}
