/**
 * Shared database URL for PostgreSQL (Supabase).
 * Direct connection uses IPv6 only → ECONNREFUSED on IPv4-only networks.
 * Fix: set SUPABASE_USE_POOLER=true + SUPABASE_DB_REGION (e.g. eu-west-1, us-east-1)
 * Or: set DATABASE_URL to Session pooler URL from Dashboard > Connect > Session mode
 */
export function getDatabaseUrl(): string {
  const explicit = process.env.DATABASE_URL
  if (explicit?.includes('pooler.supabase.com')) return explicit

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const password = process.env.SUPABASE_DB_PASSWORD
  const usePooler = process.env.SUPABASE_USE_POOLER === 'true'
  const region = process.env.SUPABASE_DB_REGION || 'eu-west-1'

  if (supabaseUrl && password) {
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0]
    if (usePooler) {
      return `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:5432/postgres`
    }
    return `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`
  }

  if (explicit) return explicit
  throw new Error(
    'Missing DATABASE_URL or (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD). ' +
      'If ECONNREFUSED on IPv6, get Session pooler URL from Dashboard > Connect > Session mode'
  )
}
