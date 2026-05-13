import { NextResponse } from 'next/server'

import { sortIntelFeedRowsWeekly } from '@/lib/intelligence/feed-repository'
import { loadWeeklyRecap } from '@/lib/intelligence/weekly-recap'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'

/** Agrège le flux Intelligence sur N jours calendaires (fuseau digest, défaut 7). */
export async function GET(req: Request) {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const raw = searchParams.get('days')
    const n = raw ? parseInt(raw, 10) : 7
    const days = Number.isFinite(n) ? Math.min(Math.max(n, 1), 31) : 7

    const format = searchParams.get('format')
    const recap = await loadWeeklyRecap(days)

    if (format === 'txt') {
      const newest = recap.rotationDaysQueried[0] ?? 'week'
      const oldest = recap.rotationDaysQueried[recap.rotationDaysQueried.length - 1] ?? newest
      const filename = `aigile-intelligence-recap_${oldest}_${newest}.txt`
      return new NextResponse(recap.plainText || '(vide)', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

    const sortedItems = sortIntelFeedRowsWeekly(recap.items)
    const liteArticles = (recap.articles ?? []).map((a) => ({
      id: a.id,
      digest_date: a.digest_date,
      tier_id: a.tier_id,
      source_label: a.source_label,
      source_feed_url: a.source_feed_url,
      article_url: a.article_url,
      title: a.title,
      summary: a.summary,
      published_at: a.published_at,
      ingestion_kind: a.ingestion_kind,
    }))
    const liteItems = sortedItems.map((r) => ({
      id: r.id,
      tier_id: r.tier_id,
      source_label: r.source_label,
      url: r.url,
      url_kind: r.url_kind,
      status: r.status,
      content: r.content,
      transcript_text: r.transcript_text,
      rotation_day: r.rotation_day,
      vitality_score: r.vitality_score,
      empire_boost_applied: r.empire_boost_applied,
      preview_snippet: r.preview_snippet,
      summary: r.summary,
      thumbnail_url: r.thumbnail_url,
      transcript_error: r.transcript_error,
    }))

    return NextResponse.json({
      rotationDaysQueried: recap.rotationDaysQueried,
      itemCount: recap.itemCount,
      articleCount: recap.articleCount,
      plainText: recap.plainText,
      items: liteItems,
      articles: liteArticles,
    })
  } catch (e) {
    console.error('[intelligence-feed/weekly-recap]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
