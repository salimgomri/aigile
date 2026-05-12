import { supabaseAdmin } from '@/lib/supabase'
import type { UrlKind } from '@/lib/intelligence/types'

export type IntelFeedRow = {
  id: string
  tier_id: string
  source_label: string
  url: string
  url_kind: string
  vitality_score: number
  empire_boost_applied: number
  status: 'pending' | 'analyzing' | 'ready' | 'error'
  preview_snippet: string | null
  transcript_text: string | null
  transcript_error: string | null
  analyst_started_at: string | null
  ready_at: string | null
  rotation_day: string
  created_at: string
  updated_at: string
  thumbnail_url: string | null
  summary: string | null
  content: string | null
}

const INTEL_FEED_STATUS_ORDER: Record<IntelFeedRow['status'], number> = {
  ready: 0,
  analyzing: 1,
  pending: 2,
  error: 3,
}

const ROTATION_DAY_RE = /^\d{4}-\d{2}-\d{2}$/

/** Prêt (lisible) en tête, puis vitalité décroissante. */
export function sortIntelFeedRowsForAdmin(rows: IntelFeedRow[]): IntelFeedRow[] {
  return [...rows].sort((a, b) => {
    const sa = INTEL_FEED_STATUS_ORDER[a.status] ?? 99
    const sb = INTEL_FEED_STATUS_ORDER[b.status] ?? 99
    if (sa !== sb) return sa - sb
    const va = Number(a.vitality_score)
    const vb = Number(b.vitality_score)
    if (vb !== va) return vb - va
    return (b.updated_at ?? '').localeCompare(a.updated_at ?? '')
  })
}

export function utcTodayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function intelFeedPurgeOlderThanDays(days: number): Promise<void> {
  const cutoff = new Date()
  cutoff.setUTCDate(cutoff.getUTCDate() - days)
  const d = cutoff.toISOString().slice(0, 10)
  await supabaseAdmin.from('intel_feed_items').delete().lt('rotation_day', d)
}

export async function intelFeedPurgeRotationDay(rotationDay: string): Promise<void> {
  await supabaseAdmin.from('intel_feed_items').delete().eq('rotation_day', rotationDay)
}

export async function intelFeedUpsertItem(input: {
  tierId: string
  sourceLabel: string
  url: string
  urlKind: UrlKind
  vitalityScore: number
  empireBoostApplied: number
  status: IntelFeedRow['status']
  previewSnippet?: string | null
  transcriptText?: string | null
  thumbnailUrl?: string | null
  summary?: string | null
  content?: string | null
  transcriptError?: string | null
  rotationDay: string
}): Promise<IntelFeedRow | null> {
  const now = new Date().toISOString()
  const summaryVal = input.summary ?? input.previewSnippet ?? null
  const contentVal = input.content ?? input.transcriptText ?? null
  const { data, error } = await supabaseAdmin
    .from('intel_feed_items')
    .upsert(
      {
        tier_id: input.tierId,
        source_label: input.sourceLabel,
        url: input.url,
        url_kind: input.urlKind,
        vitality_score: input.vitalityScore,
        empire_boost_applied: input.empireBoostApplied,
        status: input.status,
        preview_snippet: input.previewSnippet ?? null,
        transcript_text: input.transcriptText ?? null,
        transcript_error: input.transcriptError ?? null,
        summary: summaryVal,
        content: contentVal,
        thumbnail_url: input.thumbnailUrl ?? null,
        analyst_started_at: input.status === 'analyzing' ? now : null,
        ready_at: input.status === 'ready' ? now : null,
        rotation_day: input.rotationDay,
        updated_at: now,
      },
      { onConflict: 'tier_id,url,rotation_day' },
    )
    .select()
    .maybeSingle()

  if (error) {
    console.error('[intel-feed upsert]', error.message)
    return null
  }
  return data as IntelFeedRow | null
}

/** Tri pour récap multi-jours : jour décroissant, puis statut / vitalité. */
export function sortIntelFeedRowsWeekly(rows: IntelFeedRow[]): IntelFeedRow[] {
  return [...rows].sort((a, b) => {
    const dayCmp = b.rotation_day.localeCompare(a.rotation_day)
    if (dayCmp !== 0) return dayCmp
    const sa = INTEL_FEED_STATUS_ORDER[a.status] ?? 99
    const sb = INTEL_FEED_STATUS_ORDER[b.status] ?? 99
    if (sa !== sb) return sa - sb
    const va = Number(a.vitality_score)
    const vb = Number(b.vitality_score)
    if (vb !== va) return vb - va
    return (b.updated_at ?? '').localeCompare(a.updated_at ?? '')
  })
}

export async function intelFeedListByRotationDays(days: string[]): Promise<IntelFeedRow[]> {
  const uniq = [...new Set(days)].filter((d) => ROTATION_DAY_RE.test(d))
  if (uniq.length === 0) return []
  const { data, error } = await supabaseAdmin.from('intel_feed_items').select('*').in('rotation_day', uniq)

  if (error) {
    console.error('[intel-feed list by rotation days]', error.message)
    return []
  }
  return sortIntelFeedRowsWeekly((data ?? []) as IntelFeedRow[])
}

export async function intelFeedListRecent(limit = 120): Promise<IntelFeedRow[]> {
  const { data, error } = await supabaseAdmin
    .from('intel_feed_items')
    .select('*')
    .order('vitality_score', { ascending: false })
    .order('rotation_day', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[intel-feed list]', error.message)
    return []
  }
  return (data ?? []) as IntelFeedRow[]
}

export async function intelFeedListByRotationDay(rotationDay: string): Promise<IntelFeedRow[]> {
  if (!ROTATION_DAY_RE.test(rotationDay)) return []
  const { data, error } = await supabaseAdmin
    .from('intel_feed_items')
    .select('*')
    .eq('rotation_day', rotationDay)
    .order('vitality_score', { ascending: false })

  if (error) {
    console.error('[intel-feed list by day]', error.message)
    return []
  }
  return (data ?? []) as IntelFeedRow[]
}

export async function intelFeedGetById(id: string): Promise<IntelFeedRow | null> {
  const { data, error } = await supabaseAdmin.from('intel_feed_items').select('*').eq('id', id).maybeSingle()
  if (error) return null
  return data as IntelFeedRow | null
}

export async function intelFeedGetByIds(ids: string[]): Promise<IntelFeedRow[]> {
  const uniq = [...new Set(ids)].filter(Boolean)
  if (uniq.length === 0) return []
  const { data, error } = await supabaseAdmin.from('intel_feed_items').select('*').in('id', uniq)
  if (error) {
    console.error('[intel-feed getByIds]', error.message)
    return []
  }
  return (data ?? []) as IntelFeedRow[]
}

export async function intelFeedPatch(
  id: string,
  patch: Partial<
    Pick<
      IntelFeedRow,
      | 'status'
      | 'transcript_text'
      | 'transcript_error'
      | 'preview_snippet'
      | 'analyst_started_at'
      | 'ready_at'
      | 'thumbnail_url'
      | 'summary'
      | 'content'
    >
  >,
): Promise<boolean> {
  const now = new Date().toISOString()
  const { error } = await supabaseAdmin
    .from('intel_feed_items')
    .update({ ...patch, updated_at: now })
    .eq('id', id)
  return !error
}
