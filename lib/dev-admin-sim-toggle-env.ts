/**
 * Active la simulation admin localhost (bouton navbar + cookie / routes associées).
 * À définir dans `.env.local` uniquement quand tu veux cet outil de dev : par ex.
 * NEXT_PUBLIC_AIGILE_DEV_ADMIN_SIM=true
 */
const RAW = process.env.NEXT_PUBLIC_AIGILE_DEV_ADMIN_SIM

export function isAigileDevAdminSimEnabled(): boolean {
  if (!RAW) return false
  const v = RAW.trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}
