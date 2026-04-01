/**
 * Stats produit (dashboard admin) : exclure l’équipe interne pour des métriques « clients ».
 */
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'

/** Toujours exclure cet email des stats outils (en plus de ADMIN_EMAILS). */
export const STATS_ALWAYS_EXCLUDED_EMAIL = 'salim.gomri@gmail.com'

/** Liste des emails à exclure (normalisés minuscules), sans doublons. */
export function getStatsExcludedEmailList(): string[] {
  const set = new Set<string>()
  set.add(STATS_ALWAYS_EXCLUDED_EMAIL.toLowerCase())
  const raw = process.env.ADMIN_EMAILS || ''
  for (const part of raw.split(',')) {
    const e = part.trim().toLowerCase()
    if (e) set.add(e)
  }
  return [...set]
}

export function shouldExcludeEmailFromToolStats(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false
  const e = email.trim().toLowerCase()
  if (e === STATS_ALWAYS_EXCLUDED_EMAIL.toLowerCase()) return true
  return isAdminEmail(email)
}

/**
 * IDs utilisateurs à exclure des agrégats (requêtes sur `user` par email).
 */
export async function getStatsExcludedUserIds(): Promise<Set<string>> {
  const emails = getStatsExcludedEmailList()
  const excluded = new Set<string>()
  for (const email of emails) {
    let { data } = await supabaseAdmin.from('user').select('id').eq('email', email).maybeSingle()
    if (!data?.id) {
      const r = await supabaseAdmin.from('user').select('id').ilike('email', email).maybeSingle()
      data = r.data
    }
    if (data?.id) excluded.add(data.id)
  }
  return excluded
}
