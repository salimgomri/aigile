import 'server-only'

import type { UrlKind } from '@/lib/intelligence/types'
import {
  intelFeedGetById,
  intelFeedPatch,
  intelFeedPurgeOlderThanDays,
  intelFeedPurgeRotationDay,
  intelFeedUpsertItem,
  utcTodayDateString,
  type IntelFeedRow,
} from '@/lib/intelligence/feed-repository'
import { loadIntelligenceSources } from '@/lib/intelligence/load-sources'
import { resolveIntelThumbnailUrl } from '@/lib/intelligence/media-metadata-server'
import { enqueueYoutubeTranscriptJob } from '@/lib/intelligence/transcript-job'
import { fetchWebPagePlainText } from '@/lib/intelligence/web-page-text-server'
import {
  computeVitalityScore,
  isDemoPaulArticlesUrl,
  TRANSCRIPT_AUTO_THRESHOLD,
} from '@/lib/intelligence/vitality-compute'

const DEMO_PG_SUMMARY =
  'Bibliothèque d’essais Paul Graham — synchronisez puis « Analyser » pour extraire le HTML réel de cette page (liste d’articles).'

/** Seuil aligné sur fetchWebPagePlainText (caractères utiles minimum). */
const WEB_BODY_OK_CHARS = 80

/** Même logique que l’action « Analyser » pour Web/Podcast (réutilisée à la sync si vitalité > seuil). */
async function computeWebPodcastIntelPayload(args: {
  url: string
  sourceLabel: string
  urlKind: 'web' | 'podcast'
  vitalityScore: number
}): Promise<{
  preview_snippet: string | null
  summary: string | null
  content: string | null
  transcript_text: string | null
  transcript_error: string | null
}> {
  const fetched = await fetchWebPagePlainText(args.url)
  const scoreLabel = Number.isFinite(args.vitalityScore) ? args.vitalityScore.toFixed(0) : '?'
  const baseSnippet = `${args.sourceLabel} · ${args.urlKind === 'podcast' ? 'Podcast' : 'Web'} · Vitalité ${scoreLabel}`

  if (fetched.text.length >= WEB_BODY_OK_CHARS) {
    const summaryLine = fetched.title ? `${fetched.title} — ${baseSnippet}` : baseSnippet
    return {
      preview_snippet: summaryLine.slice(0, 500),
      summary: summaryLine.slice(0, 2000),
      content: fetched.text,
      transcript_text: fetched.text,
      transcript_error: null,
    }
  }

  const errNote = fetched.error ? ` (${fetched.error})` : ''
  const snippet = `${baseSnippet} — extraction texte courte ou bloquée${errNote}. Ouvrir l’URL source pour lire l’article.`
  return {
    preview_snippet: snippet.slice(0, 500),
    summary: snippet.slice(0, 2000),
    content: fetched.text.length > 0 ? fetched.text : null,
    transcript_text: fetched.text.length > 0 ? fetched.text : null,
    transcript_error: fetched.error ?? null,
  }
}

export type SyncIntelFeedResult = {
  rotationDay: string
  upserted: number
  youtubeJobsQueued: number
  webPodcastAutoScraped: number
}

export async function syncIntelFeedFromYaml(): Promise<SyncIntelFeedResult> {
  const rotationDay = utcTodayDateString()
  await intelFeedPurgeOlderThanDays(7)
  await intelFeedPurgeRotationDay(rotationDay)

  const data = loadIntelligenceSources()
  let upserted = 0
  let youtubeJobsQueued = 0
  let webPodcastAutoScraped = 0

  for (const tier of data.tiers) {
    for (const group of tier.groups) {
      for (const u of group.urls) {
        const urlKind = u.kind as UrlKind
        const { score, empireBoostApplied } = computeVitalityScore({
          tierId: tier.id,
          url: u.href,
          urlKind,
        })

        let status: IntelFeedRow['status'] = 'pending'
        let previewSnippet: string | null = `${group.name} · Vitalité ${score}`
        let transcriptText: string | null = null
        let contentBody: string | null = null
        let summaryOverride: string | undefined
        let transcriptErrorPass: string | null | undefined

        const thumbnailUrl = await resolveIntelThumbnailUrl(u.href, urlKind)

        if (isDemoPaulArticlesUrl(u.href)) {
          const fetched = await fetchWebPagePlainText(u.href)
          if (fetched.text.length >= WEB_BODY_OK_CHARS) {
            status = 'ready'
            const head = fetched.title?.slice(0, 200) ?? 'Paul Graham — articles'
            previewSnippet = `${head} · Vitalité ${score}`
            transcriptText = fetched.text
            contentBody = fetched.text
            summaryOverride = fetched.title ? fetched.title.slice(0, 500) : previewSnippet ?? undefined
          } else {
            status = 'pending'
            previewSnippet = DEMO_PG_SUMMARY
            transcriptText = null
            contentBody = null
          }
        } else if (urlKind === 'youtube') {
          const autoTranscript = score >= TRANSCRIPT_AUTO_THRESHOLD
          status = autoTranscript ? 'analyzing' : 'pending'
          previewSnippet = `${group.name} · YouTube · Vitalité ${score}`
        } else if (urlKind === 'podcast') {
          previewSnippet = `${group.name} · Podcast · Vitalité ${score}`
          if (score >= TRANSCRIPT_AUTO_THRESHOLD) {
            webPodcastAutoScraped += 1
            const payload = await computeWebPodcastIntelPayload({
              url: u.href,
              sourceLabel: group.name,
              urlKind: 'podcast',
              vitalityScore: score,
            })
            status = 'ready'
            previewSnippet = payload.preview_snippet
            transcriptText = payload.transcript_text
            contentBody = payload.content
            summaryOverride = payload.summary ?? undefined
            transcriptErrorPass = payload.transcript_error
          }
        } else {
          previewSnippet = `${group.name} · Web · Vitalité ${score}`
          if (score >= TRANSCRIPT_AUTO_THRESHOLD) {
            webPodcastAutoScraped += 1
            const payload = await computeWebPodcastIntelPayload({
              url: u.href,
              sourceLabel: group.name,
              urlKind: 'web',
              vitalityScore: score,
            })
            status = 'ready'
            previewSnippet = payload.preview_snippet
            transcriptText = payload.transcript_text
            contentBody = payload.content
            summaryOverride = payload.summary ?? undefined
            transcriptErrorPass = payload.transcript_error
          }
        }

        const row = await intelFeedUpsertItem({
          tierId: tier.id,
          sourceLabel: group.name,
          url: u.href,
          urlKind,
          vitalityScore: score,
          empireBoostApplied,
          status,
          previewSnippet,
          transcriptText,
          thumbnailUrl,
          summary: summaryOverride ?? previewSnippet ?? undefined,
          content: contentBody ?? transcriptText,
          transcriptError: transcriptErrorPass ?? null,
          rotationDay,
        })

        upserted++

        if (row && urlKind === 'youtube' && score >= TRANSCRIPT_AUTO_THRESHOLD) {
          enqueueYoutubeTranscriptJob(row.id, u.href, { skipAnalyzingBootstrap: true })
          youtubeJobsQueued++
        }
      }
    }
  }

  return { rotationDay, upserted, youtubeJobsQueued, webPodcastAutoScraped }
}

export async function requestIntelFeedAnalysis(itemId: string): Promise<{ ok: boolean; error?: string }> {
  const row = await intelFeedGetById(itemId)
  if (!row) return { ok: false, error: 'not_found' }

  if (row.status === 'analyzing') return { ok: true }

  if (row.url_kind === 'youtube') {
    if (row.status === 'ready') return { ok: true }
    const now = new Date().toISOString()
    await intelFeedPatch(row.id, {
      status: 'analyzing',
      analyst_started_at: now,
      transcript_error: null,
    })
    enqueueYoutubeTranscriptJob(row.id, row.url, { skipAnalyzingBootstrap: true })
    return { ok: true }
  }

  if (row.url_kind === 'web' || row.url_kind === 'podcast') {
    const now = new Date().toISOString()

    await intelFeedPatch(row.id, {
      status: 'analyzing',
      analyst_started_at: now,
      transcript_error: null,
    })

    const payload = await computeWebPodcastIntelPayload({
      url: row.url,
      sourceLabel: row.source_label,
      urlKind: row.url_kind,
      vitalityScore: Number(row.vitality_score),
    })

    await intelFeedPatch(row.id, {
      status: 'ready',
      preview_snippet: payload.preview_snippet,
      summary: payload.summary,
      content: payload.content,
      transcript_text: payload.transcript_text,
      transcript_error: payload.transcript_error,
      ready_at: new Date().toISOString(),
    })
    return { ok: true }
  }

  return { ok: false, error: 'unsupported' }
}
