/**
 * Accès aux outils « gated » :
 * - admins (email ADMIN_EMAILS ou userId → email admin)
 * - promo outil active (tool_credit_promo_grants) : early adopter / illimité crédits = même accès qu’une invite
 * - liste tool_invites
 * - public après lancement si invite_only = false
 */
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminEmail, isAdminUserId } from '@/lib/admin'
import { getToolCreditPromoGrant } from '@/lib/credits/tool-promo'
import { getFeatureFlag, isLiveAt } from '@/lib/feature-flags'

function normEmail(email: string) {
  return email.trim().toLowerCase()
}

export type CanAccessToolOptions = {
  /** Contourne les cas où l’email de session diffère du compte (admin = userId → email en base). */
  userId?: string | null
}

/** Utilisateur autorisé à voir l’outil complet (après lancement, ou admin en preview). */
export async function canAccessTool(
  slug: string,
  email: string | null | undefined,
  options?: CanAccessToolOptions
): Promise<boolean> {
  if (options?.userId && (await isAdminUserId(options.userId))) return true
  if (!email) return false
  if (isAdminEmail(email)) return true
  const row = await getFeatureFlag(slug)
  if (!row) return false
  if (!isLiveAt(row.launch_at)) return false
  const inviteOnly = row.invite_only ?? true
  if (!inviteOnly) return true
  const promo = await getToolCreditPromoGrant(email, slug)
  if (promo) return true
  const { data } = await supabaseAdmin
    .from('tool_invites')
    .select('id')
    .eq('tool_slug', slug)
    .eq('email', normEmail(email))
    .maybeSingle()
  return !!data
}
