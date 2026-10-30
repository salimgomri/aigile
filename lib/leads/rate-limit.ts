import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

const WINDOW_MINUTES = 15
const MAX_PER_WINDOW = 5

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

export function getClientIp(request: Request): string {
  const xf = request.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]?.trim() || '0.0.0.0'
  return request.headers.get('x-real-ip') || '0.0.0.0'
}

export async function checkRateLimit(ip: string, endpoint: string): Promise<boolean> {
  const ipHash = hashIp(ip)
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString()

  const { count, error } = await supabaseAdmin
    .from('lead_rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart)

  if (error) {
    console.warn('[leads] rate-limit read failed', error.message)
    return true
  }
  if ((count ?? 0) >= MAX_PER_WINDOW) return false

  await supabaseAdmin.from('lead_rate_limits').insert({
    ip_hash: ipHash,
    endpoint,
  })
  return true
}
