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
  rotationDay: string
}): Promise<IntelFeedRow | null> {
  const now = new Date().toISOString()
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
        transcript_error: null,
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

export async function intelFeedGetById(id: string): Promise<IntelFeedRow | null> {
  const { data, error } = await supabaseAdmin.from('intel_feed_items').select('*').eq('id', id).maybeSingle()
  if (error) return null
  return data as IntelFeedRow | null
}

export async function intelFeedPatch(
  id: string,
  patch: Partial<Pick<IntelFeedRow, 'status' | 'transcript_text' | 'transcript_error' | 'preview_snippet' | 'analyst_started_at' | 'ready_at'>>,
): Promise<boolean> {
  const now = new Date().toISOString()
  const { error } = await supabaseAdmin
    .from('intel_feed_items')
    .update({ ...patch, updated_at: now })
    .eq('id', id)
  return !error
}
