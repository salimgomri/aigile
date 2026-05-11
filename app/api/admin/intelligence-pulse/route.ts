import { NextResponse } from 'next/server'
import { acknowledgeMasterIntelSignal, getIntelligencePulsePayload } from '@/lib/admin/intelligence-vitality'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'

export async function GET() {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const payload = await getIntelligencePulsePayload()
    return NextResponse.json(payload)
  } catch (e) {
    console.error('[intelligence-pulse GET]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST() {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    await acknowledgeMasterIntelSignal()
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[intelligence-pulse POST]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
