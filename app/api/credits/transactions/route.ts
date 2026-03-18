import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { CREDIT_ACTIONS, CREDIT_ADDITIONS, type CreditAction, type CreditAddition } from '@/lib/credits/actions'

function getLabel(action: string, delta: number | null): string {
  if (CREDIT_ADDITIONS[action as CreditAddition]) {
    return CREDIT_ADDITIONS[action as CreditAddition].label
  }
  return CREDIT_ACTIONS[action as CreditAction]?.label ?? action
}

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
      .select('id, action, cost, delta, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    const items = (data ?? []).map((t) => ({
      ...t,
      label: getLabel(t.action, t.delta),
      delta: t.delta ?? (t.cost > 0 ? -t.cost : t.cost),
    }))

    return NextResponse.json({ transactions: items })
  } catch (err) {
    console.error('[API] credits transactions error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
