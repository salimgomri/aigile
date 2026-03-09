import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { canPerformAction, consumeCredits } from '@/lib/credits/manager'

const DORA_ROLES = ['manager', 'scrum_master', 'product_owner', 'agile_coach']

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { deployFreq, leadTimeHours, cfrPct, mttrHours } = body

    if (
      typeof deployFreq !== 'number' ||
      typeof leadTimeHours !== 'number' ||
      typeof cfrPct !== 'number' ||
      typeof mttrHours !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const check = await canPerformAction(session.user.id, 'dora_ai_reco')
    if (!check.allowed) {
      return NextResponse.json({ error: 'NO_CREDITS', message: 'Insufficient credits' }, { status: 402 })
    }

    const prompt = `Tu es un expert DORA. L'équipe a ces métriques :
- Deployment Frequency: ${deployFreq} / semaine
- Lead Time: ${leadTimeHours}h
- Change Failure Rate: ${cfrPct}%
- MTTR: ${mttrHours}h

Donne 3 recommandations concrètes prioritaires pour améliorer leur score le plus faible.
Format : 3 blocs, chacun avec Titre + Pourquoi + Action concrète. Maximum 250 mots total.

Réponds en français.`

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
        max_tokens: 500,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[API] OpenAI error:', err)
      return NextResponse.json({ error: 'AI request failed' }, { status: 502 })
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || ''

    // Consommer 2 crédits (dora_ai_reco)
    await consumeCredits(session.user.id, 'dora_ai_reco')

    return NextResponse.json({ recommendations: text })
  } catch (err) {
    console.error('[API] dora/recommendations error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
