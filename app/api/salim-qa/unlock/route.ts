import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { canPerformAction, consumeCredits, getCreditStatus } from '@/lib/credits/manager'
import type { CreditAction } from '@/lib/credits/actions'
import { canReadAnswer, canReadFiche, hasFullSalimQaAccess } from '@/lib/salim-qa/access'
import {
  getQuestionUnlockState,
  logSalimQaActivity,
  recordQuestionUnlock,
} from '@/lib/salim-qa/activity'
import { countFicheAssets } from '@/lib/salim-qa/fiches'
import { getSalimQaQuestionById } from '@/lib/salim-qa/loader'
import { previewAnswer } from '@/lib/salim-qa/preview'
import {
  computeUnlockCost,
  creditActionsForScope,
  flagsAfterUnlock,
  type SalimQaUnlockScope,
} from '@/lib/salim-qa/unlock-scope'

function parseScope(raw: unknown): SalimQaUnlockScope | null {
  if (raw === 'answer' || raw === 'fiche' || raw === 'all') return raw
  return null
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const questionId = (body as { questionId?: unknown })?.questionId
    const visitorId = (body as { visitorId?: unknown })?.visitorId
    const scope = parseScope((body as { scope?: unknown })?.scope ?? 'answer')

    if (typeof questionId !== 'string' || !questionId.trim()) {
      return NextResponse.json({ error: 'questionId required' }, { status: 400 })
    }
    if (!scope) {
      return NextResponse.json({ error: 'Invalid scope' }, { status: 400 })
    }

    const question = getSalimQaQuestionById(questionId)
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const hasViewableFiche = countFicheAssets(question) > 0

    await logSalimQaActivity({
      action: 'unlock_attempt',
      userId: userId ?? null,
      visitorId: typeof visitorId === 'string' ? visitorId : null,
      questionId,
      metadata: { scope },
    })

    if (!userId) {
      await logSalimQaActivity({
        action: 'unlock_denied',
        visitorId: typeof visitorId === 'string' ? visitorId : null,
        questionId,
        metadata: { reason: 'not_authenticated', scope },
      })
      return NextResponse.json(
        {
          error: 'Authentication required',
          code: 'AUTH_REQUIRED',
          answerPreview: previewAnswer(question.reponse),
        },
        { status: 401 }
      )
    }

    const status = await getCreditStatus(userId)
    const access = {
      isLoggedIn: true,
      creditsRemaining: status?.creditsRemaining ?? 0,
      isUnlimited: !!status?.isUnlimited,
      isAdmin: !!status?.isAdmin,
    }

    let unlockState = await getQuestionUnlockState(userId, questionId)
    const cost = computeUnlockCost(scope, unlockState, hasViewableFiche)

    if (cost === 0 || hasFullSalimQaAccess(access)) {
      unlockState = flagsAfterUnlock(scope, unlockState, hasViewableFiche)
      if (hasFullSalimQaAccess(access)) {
        unlockState = { answer: true, fiche: hasViewableFiche ? true : unlockState.fiche }
      }
      await recordQuestionUnlock(userId, questionId, unlockState)
      await logSalimQaActivity({
        action: 'unlock_success',
        userId,
        questionId,
        metadata: { scope, alreadyUnlocked: true },
      })
      return NextResponse.json(buildUnlockResponse(question, unlockState, access, hasViewableFiche, null))
    }

    const actions = creditActionsForScope(scope, unlockState, hasViewableFiche)
    for (const action of actions) {
      const check = await canPerformAction(userId, action)
      if (!check.allowed) {
        await logSalimQaActivity({
          action: 'unlock_denied',
          userId,
          questionId,
          metadata: { reason: check.reason ?? 'no_credits', scope },
        })
        return NextResponse.json(
          {
            error: 'Insufficient credits',
            code: 'NO_CREDITS',
            answerPreview: previewAnswer(question.reponse),
            cost,
          },
          { status: 403 }
        )
      }
    }

    let creditsRemaining: number | null = status?.creditsRemaining ?? null
    for (const action of actions) {
      const result = await consumeCredits(userId, action as CreditAction, {
        metadata: { salim_qa_question_id: questionId, salim_qa_scope: scope },
      })
      creditsRemaining = result.creditsRemaining
    }

    unlockState = flagsAfterUnlock(scope, unlockState, hasViewableFiche)
    await recordQuestionUnlock(userId, questionId, unlockState)

    await logSalimQaActivity({
      action: 'unlock_success',
      userId,
      questionId,
      metadata: { scope, creditsRemaining, cost },
    })

    return NextResponse.json(
      buildUnlockResponse(question, unlockState, access, hasViewableFiche, creditsRemaining)
    )
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    if (msg === 'Insufficient credits') {
      return NextResponse.json({ error: 'Insufficient credits', code: 'NO_CREDITS' }, { status: 403 })
    }
    console.error('[salim-qa/unlock]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

function buildUnlockResponse(
  question: ReturnType<typeof getSalimQaQuestionById>,
  unlockState: { answer: boolean; fiche: boolean },
  access: { isLoggedIn: boolean; creditsRemaining: number | null; isUnlimited: boolean; isAdmin?: boolean },
  hasViewableFiche: boolean,
  creditsRemaining: number | null
) {
  if (!question) return {}
  const canAnswer = canReadAnswer(access, unlockState)
  const canFiche = canReadFiche(access, unlockState, hasViewableFiche)
  return {
    answerFull: canAnswer ? question.reponse : undefined,
    isAnswerUnlocked: unlockState.answer,
    isFicheUnlocked: unlockState.fiche,
    canReadAnswer: canAnswer,
    canReadFiche: canFiche,
    creditsRemaining,
  }
}

/** États de déblocage pour l'utilisateur connecté */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ unlocks: {} })
    }

    const { getUnlockStatesByUser } = await import('@/lib/salim-qa/activity')
    const states = await getUnlockStatesByUser(session.user.id)
    const unlocks: Record<string, { answer: boolean; fiche: boolean }> = {}
    for (const [id, state] of states) {
      unlocks[id] = state
    }
    return NextResponse.json({ unlocks })
  } catch (e) {
    console.error('[salim-qa/unlock GET]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
