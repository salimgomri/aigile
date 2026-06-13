import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { logSalimQaActivity } from '@/lib/salim-qa/activity'
import type { SalimQaActivityAction } from '@/lib/salim-qa/types'

const VALID_ACTIONS = new Set<SalimQaActivityAction>([
  'search',
  'question_view',
  'unlock_attempt',
  'unlock_success',
  'unlock_denied',
  'recharge_click',
  'book_click',
])

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id ?? null

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const action = (body as { action?: unknown })?.action
    if (typeof action !== 'string' || !VALID_ACTIONS.has(action as SalimQaActivityAction)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const questionId = (body as { questionId?: unknown })?.questionId
    const query = (body as { query?: unknown })?.query
    const visitorId = (body as { visitorId?: unknown })?.visitorId
    const metadata = (body as { metadata?: unknown })?.metadata

    await logSalimQaActivity({
      action: action as SalimQaActivityAction,
      userId,
      visitorId: typeof visitorId === 'string' ? visitorId : null,
      questionId: typeof questionId === 'string' ? questionId : null,
      query: typeof query === 'string' ? query : null,
      metadata:
        metadata && typeof metadata === 'object' && !Array.isArray(metadata)
          ? (metadata as Record<string, unknown>)
          : null,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[salim-qa/activity]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
