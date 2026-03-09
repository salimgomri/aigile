import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { consumeCredits } from '@/lib/credits/manager'
import { CREDIT_ACTIONS, type CreditAction } from '@/lib/credits/actions'
import { PATTERNS, type PatternCode } from '@/lib/retro/patterns'

const VALID_ACTIONS = Object.keys(CREDIT_ACTIONS) as CreditAction[]
const VALID_PATTERN_CODES = ['P1', 'P2', 'P3', 'P4', 'P5', 'PA', 'PB', 'PC', 'PD'] as const

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, teamId, sprintId, patternCode } = body

    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const result = await consumeCredits(session.user.id, action, { teamId, sprintId })

    if (result.ok && action === 'retro_ai_plan' && patternCode && VALID_PATTERN_CODES.includes(patternCode)) {
      const pattern = PATTERNS[patternCode as PatternCode]
      return NextResponse.json({
        ...result,
        pattern: {
          name: pattern.name,
          nameFr: pattern.nameFr,
          description: pattern.description,
          descriptionFr: pattern.descriptionFr,
        },
      })
    }

    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    if (msg === 'Insufficient credits') {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
    }
    console.error('[API] credits consume error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
