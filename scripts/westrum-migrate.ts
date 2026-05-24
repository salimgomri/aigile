/**
 * Applique les migrations Westrum (037 + 038) sur Supabase prod.
 * Run: npx tsx scripts/westrum-migrate.ts
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
    for (const name of ['037_westrum_results.sql', '038_westrum_feature_flag.sql']) {
      await pool.query(readMigration(name))
      console.log(`${name}: OK`)
    }

    const [table, flag, view, count, cols, policies] = await Promise.all([
      pool.query("SELECT to_regclass('public.westrum_results') AS t"),
      pool.query("SELECT slug, invite_only, tool_path FROM feature_flags WHERE slug = 'westrum'"),
      pool.query("SELECT to_regclass('public.v_westrum_usage_with_user') AS v"),
      pool.query('SELECT count(*)::int AS n FROM westrum_results'),
      pool.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='westrum_results' ORDER BY ordinal_position"
      ),
      pool.query("SELECT policyname FROM pg_policies WHERE tablename = 'westrum_results'"),
    ])

    console.log('\n--- Vérification ---')
    console.log('Table westrum_results:', table.rows[0].t)
    console.log('Feature flag westrum:', flag.rows[0] ?? 'ABSENT')
    console.log('Vue v_westrum_usage_with_user:', view.rows[0].v)
    console.log('Lignes westrum_results:', count.rows[0].n)
    console.log(
      'Colonnes:',
      cols.rows.map((r) => `${r.column_name}:${r.data_type}`).join(', ')
    )
    console.log(
      'RLS policies:',
      policies.rows.map((r) => r.policyname).join(', ') || '(aucune)'
    )
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error('ERREUR:', e)
  process.exit(1)
})
