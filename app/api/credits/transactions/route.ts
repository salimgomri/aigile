import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { CREDIT_ACTIONS, type CreditAction } from '@/lib/credits/actions'

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 20)

    const { data } = await supabaseAdmin
      .from('credit_transactions')
      .select('id, action, cost, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    const items = (data ?? []).map((t) => ({
      ...t,
      label: CREDIT_ACTIONS[t.action as CreditAction]?.label ?? t.action,
    }))

    return NextResponse.json({ transactions: items })
  } catch (err) {
    console.error('[API] credits transactions error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
