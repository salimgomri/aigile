/** Run: npx tsx scripts/okr-checkin-migrate.ts */
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Pool } from 'pg'
import { getDatabaseUrl } from '../lib/db'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

async function main() {
  const pool = new Pool({ connectionString: getDatabaseUrl() })
  try {
    await pool.query(readFileSync(path.join(root, 'supabase/migrations/039_okr_checkin.sql'), 'utf8'))
    console.log('039_okr_checkin.sql: OK')
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
