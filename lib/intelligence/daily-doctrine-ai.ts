import 'server-only'

import type { IntelFeedRow } from '@/lib/intelligence/feed-repository'

/** Synthèse déterministe à partir des résumés issus de Supabase (sans IA). */
export function buildDoctrineFromFeedRows(rows: IntelFeedRow[], lang: 'fr' | 'en'): string {
  const summaries = rows
    .map((r) => (r.summary ?? r.preview_snippet ?? '').trim())
    .filter(Boolean)

  if (summaries.length === 0) {
    return lang === 'fr'
      ? 'Synchronisez et analysez des sources pour alimenter la doctrine avec du contenu réel.'
      : 'Sync and analyze sources to fuel doctrine with real content.'
  }

  if (summaries.length === 1) {
    const v = Number(rows[0]?.vitality_score)
    const scoreBit =
      Number.isFinite(v) && lang === 'fr'
        ? ` Vitalité ${Math.round(v)}.`
        : Number.isFinite(v)
          ? ` Vitality ${Math.round(v)}.`
          : ''
    return lang === 'fr'
      ? `${summaries[0]} — axe du jour.${scoreBit}`
      : `${summaries[0]} — today’s line.${scoreBit}`
  }

  const a = summaries[0]!
  const b = summaries[1]!
  if (lang === 'fr') {
    return `${a} · ${b}${summaries[2] ? ` · ${summaries[2]}` : ''} — convergence : reliez découverte utilisateur et exécution mesurable.`
  }
  return `${a} · ${b}${summaries[2] ? ` · ${summaries[2]}` : ''} — converge user discovery with measurable execution.`
}

type AiDoctrineLang = 'fr' | 'en'

async function openAiDoctrine(rows: IntelFeedRow[], lang: AiDoctrineLang): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return null

  const snippets = rows.map((r, i) => {
    const sum = (r.summary ?? r.preview_snippet ?? '').slice(0, 1200)
    const body = (r.content ?? r.transcript_text ?? '').slice(0, 2500)
    return `Source ${i + 1} (${r.source_label}, vitalité ${r.vitality_score}):\nRésumé: ${sum}\nExtrait contenu: ${body}`
  })

  const system =
    lang === 'fr'
      ? `Tu es un stratège éditorial. Réponds par UNE seule phrase percutante en français (max 280 caractères), style keynote Steve Jobs : pas de markdown, pas de guillemets.`
      : `You are an editorial strategist. Reply with ONE sharp sentence in English (max 280 chars), Steve Jobs keynote tone: no markdown, no quotes.`

  const user = `Synthétise ces sources en une doctrine du jour unique :\n\n${snippets.join('\n\n---\n\n')}`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_INTEL_DOCTRINE_MODEL?.trim() || 'gpt-4o-mini',
        temperature: 0.55,
        max_tokens: 220,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    })
    if (!res.ok) {
      console.error('[intel doctrine ai] OpenAI HTTP', res.status, await res.text().catch(() => ''))
      return null
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const text = data.choices?.[0]?.message?.content?.trim()
    return text && text.length > 0 ? text.slice(0, 400) : null
  } catch (e) {
    console.error('[intel doctrine ai]', e)
    return null
  }
}

async function anthropicDoctrine(rows: IntelFeedRow[], lang: AiDoctrineLang): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY?.trim()
  if (!key) return null

  const snippets = rows.map((r, i) => {
    const sum = (r.summary ?? r.preview_snippet ?? '').slice(0, 1200)
    const body = (r.content ?? r.transcript_text ?? '').slice(0, 2500)
    return `Source ${i + 1} (${r.source_label}, vitality ${r.vitality_score}):\nSummary: ${sum}\nExcerpt: ${body}`
  })

  const system =
    lang === 'fr'
      ? 'Une phrase française max 280 caractères, ton keynote percutant, sans markdown.'
      : 'One English sentence max 280 characters, keynote tone, no markdown.'

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_INTEL_DOCTRINE_MODEL?.trim() || 'claude-3-haiku-20240307',
        max_tokens: 220,
        system,
        messages: [{ role: 'user', content: `Daily doctrine synthesis:\n\n${snippets.join('\n\n---\n\n')}` }],
      }),
    })
    if (!res.ok) {
      console.error('[intel doctrine ai] Anthropic HTTP', res.status, await res.text().catch(() => ''))
      return null
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] }
    const text = data.content?.find((c) => c.type === 'text')?.text?.trim()
    return text && text.length > 0 ? text.slice(0, 400) : null
  } catch (e) {
    console.error('[intel doctrine ai] anthropic', e)
    return null
  }
}

export async function generateDailyDoctrineForRows(
  rows: IntelFeedRow[],
  lang: AiDoctrineLang,
): Promise<{ doctrine: string; source: 'openai' | 'anthropic' | 'heuristic' }> {
  const filtered = rows.filter(Boolean)
  if (filtered.length === 0) {
    return { doctrine: buildDoctrineFromFeedRows([], lang), source: 'heuristic' }
  }

  const oa = await openAiDoctrine(filtered, lang)
  if (oa) return { doctrine: oa, source: 'openai' }

  const claude = await anthropicDoctrine(filtered, lang)
  if (claude) return { doctrine: claude, source: 'anthropic' }

  return { doctrine: buildDoctrineFromFeedRows(filtered, lang), source: 'heuristic' }
}
