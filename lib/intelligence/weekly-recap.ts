import 'server-only'

import type { IntelFeedRow } from '@/lib/intelligence/feed-repository'
import { intelFeedListByRotationDays, sortIntelFeedRowsWeekly } from '@/lib/intelligence/feed-repository'

/** Jours UTC les plus récents en premier : today, today-1, … */
export function utcRollingDayStrings(newestFirst: boolean, daysCount: number): string[] {
  const n = Math.min(Math.max(daysCount, 1), 31)
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    out.push(d.toISOString().slice(0, 10))
  }
  return newestFirst ? out : out.reverse()
}

function readableBody(r: IntelFeedRow): string {
  const c = (r.content ?? '').trim()
  if (c.length > 0) return c
  return (r.transcript_text ?? '').trim()
}

/** Texte brut pour export / fichier — entrées prêtes avec corps uniquement. */
export function buildWeeklyDigestPlainText(rows: IntelFeedRow[]): string {
  const sorted = sortIntelFeedRowsWeekly(rows)
  const lines: string[] = []
  let curDay = ''
  const sepBlock = '\n\n―\n\n'

  for (const r of sorted) {
    if (r.status !== 'ready') continue
    const body = readableBody(r)
    if (!body) continue
    if (r.rotation_day !== curDay) {
      curDay = r.rotation_day
      lines.push(`\n=== ${curDay} (UTC) ===\n`)
    }
    const tier = r.tier_id.replace(/_/g, ' ')
    lines.push(`${tier} · ${r.source_label}\n${r.url}\n\n${body}`)
  }

  return lines.join(sepBlock).trimStart()
}

export type WeeklyRecapPayload = {
  rotationDaysQueried: string[]
  itemCount: number
  plainText: string
  items: IntelFeedRow[]
}

/** Agrège les lignes feed pour une fenêtre glissante de `daysCount` jours UTC. */
export async function loadWeeklyRecap(daysCount = 7): Promise<WeeklyRecapPayload> {
  const rotationDaysQueried = utcRollingDayStrings(true, daysCount)
  const items = await intelFeedListByRotationDays(rotationDaysQueried)
  const plainText = buildWeeklyDigestPlainText(items)
  return {
    rotationDaysQueried,
    itemCount: items.length,
    plainText,
    items,
  }
}
