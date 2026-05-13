import 'server-only'

import type { IntelArticleRow } from '@/lib/intelligence/article-repository'
import { intelArticlesListByDigestDates } from '@/lib/intelligence/article-repository'
import { digestDateToday } from '@/lib/intelligence/digest-calendar'
import { civilDateMinusDays } from '@/lib/intelligence/digest-calendar-shared'
import type { IntelFeedRow } from '@/lib/intelligence/feed-repository'
import { intelFeedListByRotationDays, sortIntelFeedRowsWeekly } from '@/lib/intelligence/feed-repository'

/** Jours digest les plus récents en premier : aujourd’hui (fuseau digest), puis −1, … */
export function digestRollingDayStrings(newestFirst: boolean, daysCount: number): string[] {
  const today = digestDateToday()
  const n = Math.min(Math.max(daysCount, 1), 31)
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    out.push(civilDateMinusDays(today, i))
  }
  return newestFirst ? out : out.reverse()
}

function readableBody(r: IntelFeedRow): string {
  const c = (r.content ?? '').trim()
  if (c.length > 0) return c
  return (r.transcript_text ?? '').trim()
}

/** Bloc texte pour les entrées RSS stockées par article (intel_feed_articles). */
export function buildArticlesDigestPlainText(articles: IntelArticleRow[]): string {
  const sorted = [...articles].sort((a, b) => {
    const d = String(b.digest_date).localeCompare(String(a.digest_date))
    if (d !== 0) return d
    return String(b.published_at).localeCompare(String(a.published_at))
  })
  const lines: string[] = []
  let curDay = ''
  const sepBlock = '\n\n―\n\n'

  for (const a of sorted) {
    const dd = String(a.digest_date).slice(0, 10)
    if (dd !== curDay) {
      curDay = dd
      lines.push(`\n=== Articles RSS · ${curDay} ===\n`)
    }
    const tier = a.tier_id.replace(/_/g, ' ')
    const sum = (a.summary ?? '').trim().slice(0, 800)
    lines.push(`${tier} · ${a.source_label}\n${a.article_url}\n${a.title}\n${sum}`)
  }

  return lines.join(sepBlock).trimStart()
}

/** Texte brut pour export / fichier — entrées prêtes avec corps + articles RSS. */
export function buildWeeklyDigestPlainText(rows: IntelFeedRow[], articles: IntelArticleRow[]): string {
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
      lines.push(`\n=== ${curDay} ===\n`)
    }
    const tier = r.tier_id.replace(/_/g, ' ')
    lines.push(`${tier} · ${r.source_label}\n${r.url}\n\n${body}`)
  }

  const feedBlock = lines.join(sepBlock).trimStart()
  const artBlock = buildArticlesDigestPlainText(articles)
  if (!feedBlock && !artBlock) return ''
  if (!feedBlock) return artBlock
  if (!artBlock) return feedBlock
  return `${feedBlock}\n\n${artBlock}`
}

export type WeeklyRecapPayload = {
  rotationDaysQueried: string[]
  itemCount: number
  articleCount: number
  plainText: string
  items: IntelFeedRow[]
  articles: IntelArticleRow[]
}

/** Agrège feed + articles RSS pour une fenêtre glissante de `daysCount` jours (calendrier digest). */
export async function loadWeeklyRecap(daysCount = 7): Promise<WeeklyRecapPayload> {
  const rotationDaysQueried = digestRollingDayStrings(true, daysCount)
  const [items, articles] = await Promise.all([
    intelFeedListByRotationDays(rotationDaysQueried),
    intelArticlesListByDigestDates(rotationDaysQueried),
  ])
  const plainText = buildWeeklyDigestPlainText(items, articles)
  return {
    rotationDaysQueried,
    itemCount: items.length,
    articleCount: articles.length,
    plainText,
    items,
    articles,
  }
}
