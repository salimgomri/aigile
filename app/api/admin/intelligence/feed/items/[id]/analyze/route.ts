import { NextResponse } from 'next/server'

import { requestIntelFeedAnalysis } from '@/lib/intelligence/sync-feed-from-yaml'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(_req: Request, ctx: RouteParams) {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: 'Identifiant manquant' }, { status: 400 })
  }

  try {
    const result = await requestIntelFeedAnalysis(id)
    if (!result.ok && result.error === 'not_found') {
      return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    }
    if (!result.ok) {
      return NextResponse.json({ error: result.error ?? 'Refusé' }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[intelligence-feed/analyze]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
