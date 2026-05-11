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
import { enqueueYoutubeTranscriptJob } from '@/lib/intelligence/transcript-job'
import {
  computeVitalityScore,
  isDemoPaulArticlesUrl,
  TRANSCRIPT_AUTO_THRESHOLD,
} from '@/lib/intelligence/vitality-compute'

const DEMO_PG_SNIPPET =
  'Paul Graham — Essays · Vitalité 94 · lecture immédiate (liste sur paulgraham.com/articles).'

const DEMO_PG_TRANSCRIPT = `Sprint 3 · Démo « prêt instantané » : la page liste les essais fondateurs de Paul Graham (ex. Founder Mode, équipes produit, startups). Ouvrir paulgraham.com/articles pour une lecture immédiate sans attente de transcription vidéo.`

export type SyncIntelFeedResult = {
  rotationDay: string
  upserted: number
  youtubeJobsQueued: number
}

export async function syncIntelFeedFromYaml(): Promise<SyncIntelFeedResult> {
  const rotationDay = utcTodayDateString()
  await intelFeedPurgeOlderThanDays(7)
  await intelFeedPurgeRotationDay(rotationDay)

  const data = loadIntelligenceSources()
  let upserted = 0
  let youtubeJobsQueued = 0

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

        if (isDemoPaulArticlesUrl(u.href)) {
          status = 'ready'
          previewSnippet = DEMO_PG_SNIPPET
          transcriptText = DEMO_PG_TRANSCRIPT
        } else if (urlKind === 'youtube') {
          const autoTranscript = score > TRANSCRIPT_AUTO_THRESHOLD
          status = autoTranscript ? 'analyzing' : 'pending'
          previewSnippet = `${group.name} · YouTube · Vitalité ${score}`
        } else if (urlKind === 'podcast') {
          previewSnippet = `${group.name} · Podcast · Vitalité ${score}`
        } else {
          previewSnippet = `${group.name} · Web · Vitalité ${score}`
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
          rotationDay,
        })

        upserted++

        if (row && urlKind === 'youtube' && score > TRANSCRIPT_AUTO_THRESHOLD) {
          enqueueYoutubeTranscriptJob(row.id, u.href, { skipAnalyzingBootstrap: true })
          youtubeJobsQueued++
        }
      }
    }
  }

  return { rotationDay, upserted, youtubeJobsQueued }
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
    const score = Number(row.vitality_score)
    const scoreLabel = Number.isFinite(score) ? score.toFixed(0) : '?'
    const now = new Date().toISOString()
    await intelFeedPatch(row.id, {
      status: 'ready',
      preview_snippet: `Source marquée prête · Vitalité ${scoreLabel} — ${row.url}`,
      ready_at: now,
    })
    return { ok: true }
  }

  return { ok: false, error: 'unsupported' }
}
