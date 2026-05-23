import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { computeWestrumScore, isValidWestrumScores } from '@/lib/westrum/score'
import { insertWestrumResult } from '@/lib/westrum/store'

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const scores = (body as { scores?: unknown })?.scores
    if (!isValidWestrumScores(scores)) {
      return NextResponse.json({ error: 'Réponses invalides (1 à 7 pour chaque question)' }, { status: 400 })
    }

    const { scoreMoyen, niveau } = computeWestrumScore(scores)

    const session = await auth.api.getSession({ headers: await headers() })
    let persisted = false

    if (session?.user?.id) {
      const row = await insertWestrumResult(session.user.id, scores, scoreMoyen, niveau)
      persisted = !!row
    }

    return NextResponse.json({
      scoreMoyen,
      niveau,
      scores,
      persisted,
    })
  } catch (e) {
    console.error('[api/westrum/submit]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
