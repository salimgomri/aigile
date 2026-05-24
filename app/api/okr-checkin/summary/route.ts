import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { canPerformAction, consumeCredits } from '@/lib/credits/manager'
import { getCheckInById, saveCheckInAiSummary } from '@/lib/okr/checkin-store'
import { assertTeamMember } from '@/lib/okr/team-access'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const check = await canPerformAction(session.user.id, 'okr_checkin_summary')
    if (!check.allowed) {
      return NextResponse.json({ error: 'NO_CREDITS', message: 'Crédits insuffisants' }, { status: 402 })
    }

    const body = (await request.json()) as { teamId?: string; checkInId?: string }
    const { teamId, checkInId } = body
    if (!teamId || !checkInId) {
      return NextResponse.json({ error: 'teamId et checkInId requis' }, { status: 400 })
    }

    if (!(await assertTeamMember(session.user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const checkIn = await getCheckInById(teamId, checkInId)
    if (!checkIn) {
      return NextResponse.json({ error: 'Check-in introuvable' }, { status: 404 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
    }

    const prompt = `Tu es un coach agile. Synthétise ce OKR Check-in sprint en 2 paragraphes courts (max 120 mots), orientés décision manager.

Avancé: ${checkIn.avance}

Frein: ${checkIn.frein}

Ajustement décidé: ${checkIn.ajustement}

Mets en gras l'ajustement dans ta synthèse. Ton factuel, français.`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 280,
      }),
    })

    if (!res.ok) {
      console.error('[api/okr-checkin/summary] OpenAI:', await res.text())
      return NextResponse.json({ error: 'Erreur IA' }, { status: 502 })
    }

    const json = await res.json()
    const summary = json.choices?.[0]?.message?.content?.trim()
    if (!summary) {
      return NextResponse.json({ error: 'Réponse IA vide' }, { status: 502 })
    }

    await consumeCredits(session.user.id, 'okr_checkin_summary', {
      teamId,
      metadata: { check_in_id: checkInId, sprint_id: checkIn.sprint_id },
    })

    await saveCheckInAiSummary(checkInId, summary)

    return NextResponse.json({ summary })
  } catch (e) {
    console.error('[api/okr-checkin/summary]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
