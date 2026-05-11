/**
 * Migrations SQL Intelligence : Master (`030`/`031`) + flux vitalité (`032`/`033`).
 * Idempotent où possible (ré-exécution sans erreur si déjà appliqué).
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

    try {
      await pool.query(readMigration('032_intel_feed_items.sql'))
      console.log('032_intel_feed_items.sql: OK')
    } catch (e: unknown) {
      const err = e as { code?: string }
      if (err.code === '42P07' || err.code === '42710') {
        console.log('032_intel_feed_items.sql: déjà appliquée (table ou enum existante)')
      } else {
        throw e
      }
    }

    try {
      await pool.query(readMigration('033_intel_feed_items_media.sql'))
      console.log('033_intel_feed_items_media.sql: OK')
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string }
      if (err.code === '42701' || (err.message ?? '').includes('already exists')) {
        console.log('033_intel_feed_items_media.sql: déjà appliquée')
      } else {
        throw e
      }
    }
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
