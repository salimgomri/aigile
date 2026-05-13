import 'server-only'

import {
  intelArticlesDeleteForFeedAndDigest,
  intelArticlesInsertBatch,
  type IntelArticleInsert,
} from '@/lib/intelligence/article-repository'
import { isPublishedOnDigestDay } from '@/lib/intelligence/digest-calendar'
import { parseFeedXmlItems } from '@/lib/intelligence/rss-parse-feed'

const FETCH_MS = 22_000
const MAX_ITEMS_PER_FEED = 80

export async function fetchFeedXml(url: string): Promise<{ xml: string; error?: string }> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), FETCH_MS)
    const res = await fetch(url.trim(), {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36 AIgileIntelBot/1.3 (+https://aigile.lu)',
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*;q=0.8',
      },
    })
    clearTimeout(t)
    if (!res.ok) return { xml: '', error: `HTTP ${res.status}` }
    const xml = await res.text()
    return { xml }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { xml: '', error: msg.slice(0, 240) }
  }
}

export type IngestRssResult = {
  inserted: number
  skippedNoPubDate: number
  skippedWrongDay: number
  error?: string
}

/** Ré-ingère un flux pour un digest donné : uniquement les items dont pubDate tombe sur digest_date (fuseau digest). */
export async function ingestRssFeedForDigestDay(args: {
  feedUrl: string
  digestDate: string
  tierId: string
  sourceLabel: string
}): Promise<IngestRssResult> {
  const { feedUrl, digestDate, tierId, sourceLabel } = args

  await intelArticlesDeleteForFeedAndDigest(feedUrl, digestDate)

  const { xml, error } = await fetchFeedXml(feedUrl)
  if (error || !xml.trim()) {
    return { inserted: 0, skippedNoPubDate: 0, skippedWrongDay: 0, error: error ?? 'empty body' }
  }

  const items = parseFeedXmlItems(xml)
  let skippedNoPubDate = 0
  let skippedWrongDay = 0
  const batch: IntelArticleInsert[] = []

  for (const it of items.slice(0, MAX_ITEMS_PER_FEED)) {
    if (!it.publishedAt) {
      skippedNoPubDate++
      continue
    }
    if (!isPublishedOnDigestDay(it.publishedAt, digestDate)) {
      skippedWrongDay++
      continue
    }
    batch.push({
      digest_date: digestDate,
      tier_id: tierId,
      source_label: sourceLabel,
      source_feed_url: feedUrl,
      article_url: it.link,
      title: it.title.slice(0, 500),
      summary: it.summaryText.length > 0 ? it.summaryText : null,
      content: null,
      published_at: it.publishedAt.toISOString(),
      ingestion_kind: 'rss',
    })
  }

  const inserted = await intelArticlesInsertBatch(batch)
  return { inserted, skippedNoPubDate, skippedWrongDay }
}
