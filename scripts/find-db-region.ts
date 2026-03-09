/**
 * Find the correct Supabase pooler region for your project.
 * Run: npx tsx scripts/find-db-region.ts
 */
import { config } from 'dotenv'
import { Pool } from 'pg'

config({ path: '.env.local' })

const REGIONS = [
  'us-east-1',
  'us-west-1',
  'eu-west-1',
  'eu-central-1',
  'ap-southeast-1',
  'ap-northeast-1',
  'ca-central-1',
]

async function tryRegion(region: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const password = process.env.SUPABASE_DB_PASSWORD
  if (!url || !password) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD')
    process.exit(1)
  }
  const ref = url.replace('https://', '').split('.')[0]
  const connStr = `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:5432/postgres`
  const pool = new Pool({ connectionString: connStr, connectionTimeoutMillis: 5000 })
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    await pool.end()
    return true
  } catch (err) {
    await pool.end().catch(() => {})
    return false
  }
}

async function main() {
  console.log('Testing Supabase pooler regions...\n')
  for (const region of REGIONS) {
    process.stdout.write(`  ${region}... `)
    const ok = await tryRegion(region)
    console.log(ok ? '✓ OK' : '✗')
    if (ok) {
      console.log(`\n→ Set SUPABASE_DB_REGION=${region} in .env.local`)
      process.exit(0)
    }
  }
  console.log('\nNo region worked. Get the Session pooler URL from:')
  console.log('  Supabase Dashboard > Connect > Session mode')
  console.log('Then set DATABASE_URL to that URL in .env.local')
  process.exit(1)
}

main()
