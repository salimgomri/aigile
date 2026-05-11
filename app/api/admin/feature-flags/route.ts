import { NextResponse } from 'next/server'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'
import { getAllFeatureFlags } from '@/lib/feature-flags'

export async function GET() {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }
  const rows = await getAllFeatureFlags()
  return NextResponse.json({ flags: rows })
}
