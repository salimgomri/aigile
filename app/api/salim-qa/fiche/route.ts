import fs from 'fs'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { canReadFullAnswer } from '@/lib/salim-qa/access'
import { isQuestionUnlocked } from '@/lib/salim-qa/activity'
import {
  getFicheSvgForQuestion,
  isValidSalimQaQuestionId,
} from '@/lib/salim-qa/fiches'
import { getSalimQaQuestionById } from '@/lib/salim-qa/loader'
import { getCreditStatus } from '@/lib/credits/manager'

/** Réponse vide — ne révèle pas l'existence de la fiche */
function emptyFicheResponse() {
  return new NextResponse('', {
    status: 204,
    headers: {
      'Cache-Control': 'private, no-store',
    },
  })
}

/**
 * GET /api/salim-qa/fiche?q=P4-CH13-SM-01&i=0
 * - `q` = id question (jamais le nom du fichier FP-*)
 * - `i` = index optionnel si plusieurs assets liés
 * Accès : connecté + (question débloquée ou Pro/Day Pass/admin)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const questionId = (searchParams.get('q') ?? '').trim()
    const index = Math.max(0, Number.parseInt(searchParams.get('i') ?? '0', 10) || 0)

    if (!questionId || !isValidSalimQaQuestionId(questionId)) {
      return emptyFicheResponse()
    }

    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    if (!userId) return emptyFicheResponse()

    const question = getSalimQaQuestionById(questionId)
    if (!question) return emptyFicheResponse()

    const status = await getCreditStatus(userId)
    const access = {
      isLoggedIn: true,
      creditsRemaining: status?.creditsRemaining ?? 0,
      isUnlimited: !!status?.isUnlimited,
      isAdmin: !!status?.isAdmin,
    }
    const isUnlocked = await isQuestionUnlocked(userId, questionId)
    if (!canReadFullAnswer(access, isUnlocked)) {
      return emptyFicheResponse()
    }

    const filePath = getFicheSvgForQuestion(question, index)
    if (!filePath) return emptyFicheResponse()

    const svg = fs.readFileSync(filePath, 'utf8')
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Referrer-Policy': 'same-origin',
      },
    })
  } catch (e) {
    console.error('[salim-qa/fiche]', e)
    return emptyFicheResponse()
  }
}
