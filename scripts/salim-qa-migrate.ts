/**
 * Applique les migrations S.A.L.I.M. Q&A Lab (042 + 043) sur Supabase prod.
 * Run: npx tsx scripts/salim-qa-migrate.ts
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
    for (const name of ['042_salim_qa.sql', '043_salim_qa_lab_rename.sql', '044_salim_qa_split_unlocks.sql']) {
      await pool.query(readMigration(name))
      console.log(`${name}: OK`)
    }

    const [unlocks, activities, flag, policies] = await Promise.all([
      pool.query("SELECT to_regclass('public.salim_qa_unlocks') AS t"),
      pool.query("SELECT to_regclass('public.salim_qa_activities') AS t"),
      pool.query(
        "SELECT slug, label_fr, label_en, tool_path, invite_only FROM feature_flags WHERE slug = 'salim_qa'"
      ),
      pool.query(
        "SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('salim_qa_unlocks', 'salim_qa_activities') ORDER BY tablename"
      ),
    ])

    console.log('\n--- Vérification ---')
    console.log('Table salim_qa_unlocks:', unlocks.rows[0].t)
    console.log('Table salim_qa_activities:', activities.rows[0].t)
    console.log('Feature flag salim_qa:', flag.rows[0] ?? 'ABSENT')
    console.log(
      'RLS policies:',
      policies.rows.map((r) => `${r.tablename}.${r.policyname}`).join(', ') || '(aucune)'
    )
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error('ERREUR:', e)
  process.exit(1)
})
