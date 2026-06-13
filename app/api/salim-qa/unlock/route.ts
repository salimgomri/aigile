import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { canPerformAction, consumeCredits } from '@/lib/credits/manager'
import {
  getUnlockedQuestionIds,
  isQuestionUnlocked,
  logSalimQaActivity,
  recordQuestionUnlock,
} from '@/lib/salim-qa/activity'
import { getSalimQaQuestionById } from '@/lib/salim-qa/loader'
import { previewAnswer } from '@/lib/salim-qa/preview'

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

    if (typeof questionId !== 'string' || !questionId.trim()) {
      return NextResponse.json({ error: 'questionId required' }, { status: 400 })
    }

    const question = getSalimQaQuestionById(questionId)
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    await logSalimQaActivity({
      action: 'unlock_attempt',
      userId: userId ?? null,
      visitorId: typeof visitorId === 'string' ? visitorId : null,
      questionId,
    })

    if (!userId) {
      await logSalimQaActivity({
        action: 'unlock_denied',
        visitorId: typeof visitorId === 'string' ? visitorId : null,
        questionId,
        metadata: { reason: 'not_authenticated' },
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

    const alreadyUnlocked = await isQuestionUnlocked(userId, questionId)
    if (alreadyUnlocked) {
      await logSalimQaActivity({
        action: 'unlock_success',
        userId,
        questionId,
        metadata: { alreadyUnlocked: true },
      })
      return NextResponse.json({
        answerFull: question.reponse,
        isUnlocked: true,
        creditsRemaining: null,
        alreadyUnlocked: true,
      })
    }

    const check = await canPerformAction(userId, 'salim_qa_answer')
    if (!check.allowed) {
      await logSalimQaActivity({
        action: 'unlock_denied',
        userId,
        questionId,
        metadata: { reason: check.reason ?? 'no_credits' },
      })
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          code: 'NO_CREDITS',
          answerPreview: previewAnswer(question.reponse),
        },
        { status: 403 }
      )
    }

    const result = await consumeCredits(userId, 'salim_qa_answer', {
      metadata: { salim_qa_question_id: questionId },
    })

    await recordQuestionUnlock(userId, questionId)

    await logSalimQaActivity({
      action: 'unlock_success',
      userId,
      questionId,
      metadata: { creditsRemaining: result.creditsRemaining },
    })

    return NextResponse.json({
      answerFull: question.reponse,
      isUnlocked: true,
      creditsRemaining: result.creditsRemaining,
      alreadyUnlocked: false,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    if (msg === 'Insufficient credits') {
      return NextResponse.json({ error: 'Insufficient credits', code: 'NO_CREDITS' }, { status: 403 })
    }
    console.error('[salim-qa/unlock]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

/** Liste des IDs déjà débloqués pour l'utilisateur connecté */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ unlockedIds: [] })
    }

    const unlocked = await getUnlockedQuestionIds(session.user.id)
    return NextResponse.json({ unlockedIds: [...unlocked] })
  } catch (e) {
    console.error('[salim-qa/unlock GET]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
