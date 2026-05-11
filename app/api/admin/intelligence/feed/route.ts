import { NextResponse } from 'next/server'

import {
  intelFeedListByRotationDay,
  intelFeedListRecent,
  sortIntelFeedRowsForAdmin,
} from '@/lib/intelligence/feed-repository'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'

export async function GET(req: Request) {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const day = searchParams.get('rotationDay')?.trim() ?? ''
    const raw =
      /^\d{4}-\d{2}-\d{2}$/.test(day) ? await intelFeedListByRotationDay(day) : await intelFeedListRecent(240)
    const items = sortIntelFeedRowsForAdmin(raw)
    const rotationHint = items.length
      ? items.reduce((a, r) => (r.rotation_day > a ? r.rotation_day : a), items[0]!.rotation_day)
      : null
    return NextResponse.json({
      items,
      retentionDays: 7,
      rotationHint,
      rotationDayFilter: /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null,
    })
  } catch (e) {
    console.error('[intelligence-feed GET]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
