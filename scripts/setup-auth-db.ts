#!/usr/bin/env npx tsx
/**
 * Setup Better Auth database tables
 * Usage: npx tsx scripts/setup-auth-db.ts
 * Requires: npm install -D tsx dotenv
 *
 * Loads .env.local from project root. Or run SQL manually in Supabase SQL Editor.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config() // fallback to .env
import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (url) return url

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const password = process.env.SUPABASE_DB_PASSWORD
  if (!supabaseUrl || !password) {
    throw new Error(
      'Set DATABASE_URL in .env.local (Supabase Dashboard > Settings > Database > Connection string URI).'
    )
  }
  const projectRef = supabaseUrl.replace('https://', '').split('.')[0]
  // Direct connection (db.xxx.supabase.co) - works regardless of region
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`
}

async function main() {
  const dbUrl = getDatabaseUrl()
  const pool = new Pool({ connectionString: dbUrl })

  console.log('Connecting to database...')
  const client = await pool.connect()

  try {
    const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
    const files = ['000_better_auth_base.sql', '001_add_user_additional_fields.sql']

    for (const file of files) {
      const path = join(migrationsDir, file)
      console.log(`Running ${file}...`)
      const sql = readFileSync(path, 'utf-8')
      await client.query(sql)
      console.log(`  ✓ ${file}`)
    }

    console.log('\nAuth database setup complete.')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

main()
