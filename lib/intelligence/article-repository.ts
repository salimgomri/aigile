import 'server-only'

import { digestDateToday } from '@/lib/intelligence/digest-calendar'
import { civilDateMinusDays } from '@/lib/intelligence/digest-calendar-shared'
import { supabaseAdmin } from '@/lib/supabase'

export type IntelArticleRow = {
  id: string
  digest_date: string
  tier_id: string
  source_label: string
  source_feed_url: string
  article_url: string
  title: string
  summary: string | null
  content: string | null
  published_at: string
  ingestion_kind: 'rss' | 'web_fallback'
  created_at: string
}

export type IntelArticleInsert = Omit<IntelArticleRow, 'id' | 'created_at'>

export async function intelArticlesPurgeOlderThanDays(days: number): Promise<void> {
  const cutoff = civilDateMinusDays(digestDateToday(), days)
  await supabaseAdmin.from('intel_feed_articles').delete().lt('digest_date', cutoff)
}

export async function intelArticlesDeleteForFeedAndDigest(sourceFeedUrl: string, digestDate: string): Promise<void> {
  await supabaseAdmin.from('intel_feed_articles').delete().eq('source_feed_url', sourceFeedUrl).eq('digest_date', digestDate)
}

export async function intelArticlesInsertBatch(rows: IntelArticleInsert[]): Promise<number> {
  if (rows.length === 0) return 0
  const payload = rows.map((r) => ({
    digest_date: r.digest_date,
    tier_id: r.tier_id,
    source_label: r.source_label,
    source_feed_url: r.source_feed_url,
    article_url: r.article_url,
    title: r.title,
    summary: r.summary,
    content: r.content,
    published_at: r.published_at,
    ingestion_kind: r.ingestion_kind,
  }))
  const { error } = await supabaseAdmin.from('intel_feed_articles').upsert(payload, {
    onConflict: 'source_feed_url,article_url,digest_date',
  })
  if (error) {
    console.error('[intel-articles insert]', error.message)
    return 0
  }
  return rows.length
}

export async function intelArticlesListByDigestDate(digestDate: string): Promise<IntelArticleRow[]> {
  const { data, error } = await supabaseAdmin
    .from('intel_feed_articles')
    .select('*')
    .eq('digest_date', digestDate)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[intel-articles list]', error.message)
    return []
  }
  return (data ?? []) as IntelArticleRow[]
}

export async function intelArticlesListByDigestDates(dates: string[]): Promise<IntelArticleRow[]> {
  const uniq = [...new Set(dates)].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
  if (uniq.length === 0) return []
  const { data, error } = await supabaseAdmin
    .from('intel_feed_articles')
    .select('*')
    .in('digest_date', uniq)
    .order('digest_date', { ascending: false })
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[intel-articles list multi]', error.message)
    return []
  }
  return (data ?? []) as IntelArticleRow[]
}
