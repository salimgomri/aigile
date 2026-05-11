/**
 * Mode admin — aucune restriction (crédits illimités, accès tous outils)
 * Activé via ADMIN_EMAILS dans .env.local (emails séparés par des virgules)
 */

import { supabaseAdmin } from '@/lib/supabase'
import { isAigileDevAdminSimEnabled } from '@/lib/dev-admin-sim-toggle-env'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/** Cookie posé uniquement par POST /api/dev/admin-sim si NEXT_PUBLIC_AIGILE_DEV_ADMIN_SIM est activée + localhost. */
export const DEV_ADMIN_SIM_COOKIE_NAME = 'aigile_dev_admin_sim'

export function hasDevLocalAdminSimCookie(cookieHeader: string | null | undefined): boolean {
  if (!isAigileDevAdminSimEnabled()) return false
  if (!cookieHeader) return false
  return cookieHeader.split(';').some((part) => part.trim().startsWith(`${DEV_ADMIN_SIM_COOKIE_NAME}=1`))
}

/** Admin réel (email) ou simulation dev localhost (cookie). */
export function isAdminAccessAllowed(
  email: string | null | undefined,
  cookieHeader: string | null | undefined,
): boolean {
  return isAdminEmail(email) || hasDevLocalAdminSimCookie(cookieHeader)
}

export async function isAdminUserId(userId: string): Promise<boolean> {
  if (!userId || ADMIN_EMAILS.length === 0) return false
  const { data, error } = await supabaseAdmin
    .from('user')
    .select('email')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data?.email) return false
  return isAdminEmail(data.email)
}

export async function getEmailForUserId(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin.from('user').select('email').eq('id', userId).maybeSingle()
  const e = data?.email
  if (!e || typeof e !== 'string') return null
  return e.trim().toLowerCase()
}
