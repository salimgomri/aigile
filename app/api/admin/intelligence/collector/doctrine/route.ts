import { NextResponse } from 'next/server'

import { generateDailyDoctrineForRows } from '@/lib/intelligence/daily-doctrine-ai'
import { intelFeedGetByIds } from '@/lib/intelligence/feed-repository'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'

type Body = {
  itemIds?: string[]
  lang?: 'fr' | 'en'
}

export async function POST(req: Request) {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const ids = Array.isArray(body.itemIds) ? body.itemIds.filter((x): x is string => typeof x === 'string') : []
  if (ids.length === 0) {
    return NextResponse.json({ error: 'itemIds requis' }, { status: 400 })
  }
  if (ids.length > 24) {
    return NextResponse.json({ error: 'Trop de sources (max 24)' }, { status: 400 })
  }

  const lang = body.lang === 'en' ? 'en' : 'fr'

  try {
    const rows = await intelFeedGetByIds(ids)
    const { doctrine, source } = await generateDailyDoctrineForRows(rows, lang)
    return NextResponse.json({ doctrine, source })
  } catch (e) {
    console.error('[collector/doctrine]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
