import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setDate(1)
  nextMonth.setHours(0, 0, 0, 0)

  const { error } = await supabaseAdmin
    .from('user_credits')
    .update({
      credits_remaining: 10,
      monthly_reset_at: nextMonth.toISOString(),
    })
    .eq('plan', 'free')
    .lte('monthly_reset_at', new Date().toISOString())

  if (error) {
    console.error('[CRON] reset-credits error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
