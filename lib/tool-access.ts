/**
 * Accès aux outils « gated » :
 * - admins (email ADMIN_EMAILS ou userId → email admin)
 * - mode invite-only : tool_credit_promo_grants + tool_invites donnent accès **même avant** launch_at (early adopter)
 * - hors invite-only : accès pour tous une fois launch_at atteinte
 */
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminEmail, isAdminUserId } from '@/lib/admin'
import { getToolCreditPromoGrant } from '@/lib/credits/tool-promo'
import { getFeatureFlag, isLiveAt } from '@/lib/feature-flags'

function normEmail(email: string) {
  return email.trim().toLowerCase()
}

export type CanAccessToolOptions = {
  /** Contourne les cas où l’email de session diffère du compte (admin = userId → email admin en base). */
  userId?: string | null
}

/** Utilisateur autorisé à l’outil (admin, liste invités, promo early adopter, ou grand public après lancement si pas invite-only). */
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

  const inviteOnly = row.invite_only ?? true
  const live = isLiveAt(row.launch_at)

  /** Pas d’invitation : ouvert à tous après la date de lancement. */
  if (!inviteOnly) {
    return live
  }

  /** Invite-only : promos (early adopter) et tool_invites — y compris avant launch_at. */
  const promo = await getToolCreditPromoGrant(email, slug)
  if (promo) return true

  const { data } = await supabaseAdmin
    .from('tool_invites')
    .select('id')
    .eq('tool_slug', slug)
    .eq('email', normEmail(email))
    .maybeSingle()
  if (data) return true

  /** Invité-only et pas sur liste : pas d’accès. */
  return false
}

export type ShouldShowComingSoonOptions = {
  userId?: string | null
}

/** Page « coming soon » : avant launch_at, sauf droits déjà valides (admin, invite, promo). */
export async function shouldShowComingSoon(
  slug: string,
  email: string | null | undefined,
  options?: ShouldShowComingSoonOptions
): Promise<boolean> {
  const row = await getFeatureFlag(slug)
  if (!row) return true
  if (isLiveAt(row.launch_at)) return false
  const can = await canAccessTool(slug, email, { userId: options?.userId ?? undefined })
  return !can
}

export async function isToolLiveForUser(
  slug: string,
  email: string | null | undefined,
  options?: ShouldShowComingSoonOptions
): Promise<boolean> {
  return !(await shouldShowComingSoon(slug, email, options))
}
