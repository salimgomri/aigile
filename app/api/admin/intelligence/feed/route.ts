import { NextResponse } from 'next/server'

import { intelFeedListRecent } from '@/lib/intelligence/feed-repository'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'

export async function GET() {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const items = await intelFeedListRecent(160)
    const rotationHint = items.length ? items.reduce((a, r) => (r.rotation_day > a ? r.rotation_day : a), items[0]!.rotation_day) : null
    return NextResponse.json({
      items,
      retentionDays: 7,
      rotationHint,
    })
  } catch (e) {
    console.error('[intelligence-feed GET]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
