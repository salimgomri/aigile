/**
 * Auth health check - verifies DB connectivity
 * GET /api/auth/health - returns 200 if auth DB is reachable
 */
import { Pool } from 'pg'
import { getDatabaseUrl } from '@/lib/db'

export async function GET() {
  const pool = new Pool({ connectionString: getDatabaseUrl(), max: 1 })
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    await pool.end()
    return Response.json({ ok: true, database: 'connected' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[AUTH-HEALTH]', err)
    await pool.end().catch(() => {})
    return Response.json({ ok: false, error: message }, { status: 503 })
  }
}
