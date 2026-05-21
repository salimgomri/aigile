import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { canPerformAction, consumeCredits } from '@/lib/credits/manager'
import { CADRANS } from '@/lib/dashboard-manager/cadrans'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const check = await canPerformAction(session.user.id, 'dashboard_narrative')
    if (!check.allowed) {
      return NextResponse.json({ error: 'NO_CREDITS', message: 'Insufficient credits' }, { status: 402 })
    }

    const body = await request.json()
    const {
      header,
      ragState,
      values,
      globalAuto,
      globalManual,
      velocity,
      okr,
      language = 'fr',
    } = body

    const cadranLines = CADRANS.map((c, i) => {
      const rag = ragState?.[i] ?? '—'
      const val = values?.[i] ?? ''
      return `- ${c.title}: RAG ${rag}${val ? `, valeur ${val}` : ''}`
    }).join('\n')

    const prompt = `Tu rédiges la narrative manager (Prompt P25) pour un dashboard sprint S.A.L.I.M.

Contexte:
- Équipe: ${header?.team ?? '—'}
- Sprint: ${header?.sprint ?? '—'}
- Période: ${header?.period ?? '—'}
- Scrum Master: ${header?.sm ?? '—'}

Cadrans:
${cadranLines}

Note globale auto: ${globalAuto?.score ?? '—'} / 6 — ${globalAuto?.word ?? ''} (V:${globalAuto?.v ?? 0} A:${globalAuto?.a ?? 0} R:${globalAuto?.r ?? 0})
Note manuelle: ${globalManual?.score ?? '—'} / 6 — RAG ${globalManual?.rag ?? '—'}
${globalManual?.comment ? `Commentaire SM: ${globalManual.comment}` : ''}

Vélocité (6 sprints): ${velocity?.points ?? '—'} | Moy. 3 sprints: ${velocity?.avg ?? '—'} | Tendance: ${velocity?.trend ?? '—'}

OKR:
- Objectif: ${okr?.objective ?? '—'}
- Avancé: ${okr?.advance ?? '—'}
- Frein: ${okr?.block ?? '—'}
- Ajustement: ${okr?.adjust ?? '—'}

Consignes:
- Exactement 3 paragraphes courts, maximum 200 mots au total.
- Ton factuel, non alarmiste, orienté action pour le management.
- Pas de listes à puces, pas de titre.
- Langue: ${language === 'en' ? 'anglais' : 'français'}.`

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 450,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[API] dashboard-manager narrative OpenAI:', err)
      return NextResponse.json({ error: 'AI request failed' }, { status: 502 })
    }

    const data = await res.json()
    const narrative = (data.choices?.[0]?.message?.content || '').trim()

    await consumeCredits(session.user.id, 'dashboard_narrative')

    return NextResponse.json({ narrative })
  } catch (err) {
    console.error('[API] dashboard-manager/narrative:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
