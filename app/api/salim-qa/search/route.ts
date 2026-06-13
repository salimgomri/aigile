import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { canReadAnswer, canReadFiche, canUnlockWithCredits } from '@/lib/salim-qa/access'
import { getUnlockStatesByUser, logSalimQaActivity } from '@/lib/salim-qa/activity'
import { filterSalimQaQuestions, getSalimQaFacets } from '@/lib/salim-qa/loader'
import { publicFicheMeta } from '@/lib/salim-qa/fiches-security'
import { countFicheAssets } from '@/lib/salim-qa/fiches'
import { previewAnswer } from '@/lib/salim-qa/preview'
import type { SalimQaQuestionPublic } from '@/lib/salim-qa/types'
import { getCreditStatus } from '@/lib/credits/manager'
import { CREDIT_ACTIONS } from '@/lib/credits/actions'

const ANSWER_COST = CREDIT_ACTIONS.salim_qa_answer.cost
const BUNDLE_COST = CREDIT_ACTIONS.salim_qa_bundle.cost

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chipsRaw = searchParams.get('chips') ?? ''
    const draft = searchParams.get('q') ?? ''
    const chips = chipsRaw ? chipsRaw.split('|').filter(Boolean) : []
    const terms = [...chips, ...(draft.trim() ? [draft.trim()] : [])]
    const role = searchParams.get('role') ?? ''
    const cible = searchParams.get('cible') ?? 'all'
    const fiche = (searchParams.get('fiche') ?? 'all') as 'all' | 'avec' | 'sans'
    const dimension = searchParams.get('dim') ?? ''
    const chapter = searchParams.get('chap') ?? ''
    const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? 12), 1), 50)
    const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0)
    const visitorId = searchParams.get('visitorId')

    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id ?? null

    let access = null
    if (userId) {
      const status = await getCreditStatus(userId)
      access = {
        isLoggedIn: true,
        creditsRemaining: status?.creditsRemaining ?? 0,
        isUnlimited: !!status?.isUnlimited,
        isAdmin: !!status?.isAdmin,
      }
    }

    const unlockMap = userId ? await getUnlockStatesByUser(userId) : new Map()
    const { items, total } = filterSalimQaQuestions({
      terms,
      role,
      cible,
      fiche,
      dimension,
      chapter,
      limit,
      offset,
    })

    if (terms.join('').length >= 3) {
      await logSalimQaActivity({
        action: 'search',
        userId,
        visitorId,
        query: terms.join(' '),
        metadata: { role, cible, fiche, resultCount: total },
      })
    }

    const questions: SalimQaQuestionPublic[] = items.map((item) => {
      const unlock = unlockMap.get(item.id) ?? { answer: false, fiche: false }
      const ficheCount = countFicheAssets(item)
      const hasViewableFiche = ficheCount > 0
      const ficheMeta = publicFicheMeta(
        item.ficheLiees,
        item.schemasLies,
        item.ficheDestineeA,
        ficheCount
      )
      const readAnswer = canReadAnswer(access, unlock)
      const readFiche = canReadFiche(access, unlock, hasViewableFiche)
      return {
        id: item.id,
        role: item.role,
        question: item.question,
        douleur: item.douleur,
        dimensions: item.dimensions,
        answerPreview: previewAnswer(item.reponse),
        isAnswerUnlocked: unlock.answer,
        isFicheUnlocked: unlock.fiche,
        canReadAnswer: readAnswer,
        canReadFiche: readFiche,
        answerFull: readAnswer ? item.reponse : undefined,
        chapter: item.chapter,
        chapterTitle: item.chapterTitle,
        partie: item.partie,
        partieName: item.partieName,
        cible: item.cible,
        ficheDestineeA: ficheMeta.ficheDestineeA,
        hasFiche: ficheMeta.hasFiche,
        ficheCount: ficheMeta.ficheCount,
        statutReponse: item.statutReponse,
        page: item.page,
      }
    })

    return NextResponse.json({
      questions,
      total,
      facets: getSalimQaFacets(),
      limit,
      offset,
      access: {
        isLoggedIn: !!userId,
        creditsRemaining: access?.creditsRemaining ?? null,
        isUnlimited: access?.isUnlimited ?? false,
        hasEntitlement: canUnlockWithCredits(access, ANSWER_COST),
        costAnswer: ANSWER_COST,
        costFiche: CREDIT_ACTIONS.salim_qa_fiche.cost,
        costBundle: BUNDLE_COST,
      },
    })
  } catch (e) {
    console.error('[salim-qa/search]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
