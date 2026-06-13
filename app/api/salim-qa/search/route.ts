import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { canReadFullAnswer, canUnlockAnswer } from '@/lib/salim-qa/access'
import { getUnlockedQuestionIds, logSalimQaActivity } from '@/lib/salim-qa/activity'
import { filterSalimQaQuestions, getSalimQaFacets } from '@/lib/salim-qa/loader'
import { publicFicheMeta } from '@/lib/salim-qa/fiches-security'
import { previewAnswer } from '@/lib/salim-qa/preview'
import type { SalimQaQuestionPublic } from '@/lib/salim-qa/types'
import { getCreditStatus } from '@/lib/credits/manager'
import { CREDIT_ACTIONS } from '@/lib/credits/actions'

const COST = CREDIT_ACTIONS.salim_qa_answer.cost

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
      }
    }

    const unlocked = userId ? await getUnlockedQuestionIds(userId) : new Set<string>()
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
      const isUnlocked = unlocked.has(item.id)
      const canReadFull = canReadFullAnswer(access, isUnlocked)
      const ficheMeta = publicFicheMeta(item.ficheLiee, item.ficheDestineeA)
      return {
        id: item.id,
        role: item.role,
        question: item.question,
        douleur: item.douleur,
        dimensions: item.dimensions,
        answerPreview: previewAnswer(item.reponse),
        isUnlocked,
        canReadFull,
        answerFull: canReadFull ? item.reponse : undefined,
        chapter: item.chapter,
        chapterTitle: item.chapterTitle,
        partie: item.partie,
        partieName: item.partieName,
        cible: item.cible,
        ficheLiee: ficheMeta.ficheLiee,
        ficheDestineeA: ficheMeta.ficheDestineeA,
        hasFiche: ficheMeta.hasFiche || item.schemasLies.length > 0,
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
        hasEntitlement: canUnlockAnswer(access, COST),
        cost: COST,
      },
    })
  } catch (e) {
    console.error('[salim-qa/search]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
