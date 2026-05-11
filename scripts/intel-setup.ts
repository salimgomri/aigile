/**
 * Table + ligne seed Intelligence (Master).
 * Idempotent : table déjà là ou ligne déjà là → OK.
 *
 * Run: npx tsx scripts/intel-setup.ts
 */
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Pool } from 'pg'
import { getDatabaseUrl } from '../lib/db'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

config({ path: path.join(root, '.env.local') })

function readMigration(name: string) {
  return readFileSync(path.join(root, 'supabase/migrations', name), 'utf8')
}

async function main() {
  const pool = new Pool({ connectionString: getDatabaseUrl() })
  try {
    try {
      await pool.query(readMigration('030_intel_master_signals.sql'))
      console.log('030_intel_master_signals.sql: OK')
    } catch (e: unknown) {
      const err = e as { code?: string }
      if (err.code === '42P07') {
        console.log('030_intel_master_signals.sql: déjà appliquée (table existante)')
      } else {
        throw e
      }
    }

    await pool.query(readMigration('031_intel_master_signals_seed.sql'))
    console.log('031_intel_master_signals_seed.sql: OK')

    const { rows } = await pool.query(
      `SELECT source_key, vitality_score, read_at FROM intel_master_signals WHERE source_key = 'master'`,
    )
    console.log('État master:', rows[0] ?? '(aucune ligne — anormal)')
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
