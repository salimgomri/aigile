/**
 * Rend tous les outils disponibles (fin de l'early access) sur Supabase prod.
 * Applique supabase/migrations/040_open_all_tools.sql puis affiche l'état des flags.
 * Run: npx tsx scripts/open-all-tools.ts
 */
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
    await pool.query(readFileSync(path.join(root, 'supabase/migrations/040_open_all_tools.sql'), 'utf8'))
    const { rows } = await pool.query(
      'SELECT slug, invite_only, launch_at, (launch_at <= now()) AS is_live FROM feature_flags ORDER BY slug'
    )
    console.log('--- feature_flags après mise à jour ---')
    console.table(rows)
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error('ERREUR:', e)
  process.exit(1)
})
