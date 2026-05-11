import { NextResponse } from 'next/server'

import { syncIntelFeedFromYaml } from '@/lib/intelligence/sync-feed-from-yaml'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'

export async function POST() {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const result = await syncIntelFeedFromYaml()
    return NextResponse.json(result)
  } catch (e) {
    console.error('[intelligence-feed/sync]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
