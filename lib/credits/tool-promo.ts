/**
 * Promos crédits illimités par outil (jusqu’à expires_at), tag early adopter.
 */
import { supabaseAdmin } from '@/lib/supabase'
import { getToolSlugForAction, type CreditAction } from './actions'

function normEmail(email: string) {
  return email.trim().toLowerCase()
}

/** Aligne le slug d’action (/skill-matrix) avec feature_flags.slug (skill_matrix). */
export function creditActionToFeatureToolSlug(action: CreditAction): string | null {
  const pathSlug = getToolSlugForAction(action)
  if (!pathSlug) return null
  return pathSlug.replace(/-/g, '_')
}

export type ToolCreditPromoInfo = {
  toolSlug: string
  expiresAt: string
  earlyAdopter: boolean
  note: string | null
}

export async function getToolCreditPromoGrant(
  email: string | null | undefined,
  featureToolSlug: string
): Promise<ToolCreditPromoInfo | null> {
  if (!email) return null
  const { data } = await supabaseAdmin
    .from('tool_credit_promo_grants')
    .select('tool_slug, expires_at, early_adopter, note')
    .eq('email', normEmail(email))
    .eq('tool_slug', featureToolSlug)
    .maybeSingle()

  if (!data) return null
  if (new Date(data.expires_at).getTime() <= Date.now()) return null

  return {
    toolSlug: data.tool_slug,
    expiresAt: data.expires_at,
    earlyAdopter: data.early_adopter,
    note: data.note,
  }
}

export async function hasActiveToolCreditPromoForAction(
  email: string | null | undefined,
  action: CreditAction
): Promise<boolean> {
  const slug = creditActionToFeatureToolSlug(action)
  if (!slug) return false
  const g = await getToolCreditPromoGrant(email, slug)
  return g !== null
}

export async function listActiveToolCreditPromos(email: string | null | undefined): Promise<ToolCreditPromoInfo[]> {
  if (!email) return []
  const { data, error } = await supabaseAdmin
    .from('tool_credit_promo_grants')
    .select('tool_slug, expires_at, early_adopter, note')
    .eq('email', normEmail(email))
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: true })

  if (error || !data) return []

  return data.map((row) => ({
    toolSlug: row.tool_slug,
    expiresAt: row.expires_at,
    earlyAdopter: row.early_adopter,
    note: row.note,
  }))
}
