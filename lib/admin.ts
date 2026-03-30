/**
 * Mode admin — aucune restriction (crédits illimités, accès tous outils)
 * Activé via ADMIN_EMAILS dans .env.local (emails séparés par des virgules)
 */

import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
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
