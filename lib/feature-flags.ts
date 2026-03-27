import { supabaseAdmin } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'

export type FeatureFlagRow = {
  slug: string
  label_fr: string
  label_en: string
  teaser_fr: string | null
  teaser_en: string | null
  launch_at: string
  tool_path: string
  /** Si true : après lancement, seuls admins + emails invités accèdent à l’outil. */
  invite_only: boolean
  updated_at?: string
}

/** Flags exposés au client (landing, hero) — `invite_only` sert aux libellés CTA */
export type PublicFeatureFlag = FeatureFlagRow & {
  is_live: boolean
}

export function isLiveAt(launchAtIso: string, now: Date = new Date()): boolean {
  const t = new Date(launchAtIso).getTime()
  if (Number.isNaN(t)) return false
  return now.getTime() >= t
}

export async function getFeatureFlag(slug: string): Promise<FeatureFlagRow | null> {
  const { data, error } = await supabaseAdmin.from('feature_flags').select('*').eq('slug', slug).maybeSingle()
  if (error || !data) return null
  return data as FeatureFlagRow
}

export async function getAllFeatureFlags(): Promise<FeatureFlagRow[]> {
  const { data, error } = await supabaseAdmin.from('feature_flags').select('*').order('slug')
  if (error) return []
  return (data ?? []) as FeatureFlagRow[]
}

/** Payload public (landing / tools) — is_live sans bypass admin */
export async function getPublicFeatureFlagsPayload(): Promise<Record<string, PublicFeatureFlag>> {
  const rows = await getAllFeatureFlags()
  const out: Record<string, PublicFeatureFlag> = {}
  for (const r of rows) {
    out[r.slug] = {
      ...r,
      is_live: isLiveAt(r.launch_at),
    }
  }
  return out
}

/** Avant la date de lancement : écran coming soon (sauf admins). */
export async function shouldShowComingSoon(slug: string, email: string | null | undefined): Promise<boolean> {
  if (email && isAdminEmail(email)) return false
  const row = await getFeatureFlag(slug)
  if (!row) return true
  return !isLiveAt(row.launch_at)
}

/** Alias pratique (ex. landing) : outil « sorti » pour cet utilisateur. */
export async function isToolLiveForUser(slug: string, email: string | null | undefined): Promise<boolean> {
  return !(await shouldShowComingSoon(slug, email))
}
