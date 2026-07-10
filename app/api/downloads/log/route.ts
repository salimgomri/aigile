import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { logDownloadEvent } from '@/lib/downloads/log'
import { DOWNLOAD_ASSETS, type DownloadAsset } from '@/lib/downloads/types'

const VALID_ASSETS = new Set<string>(DOWNLOAD_ASSETS)

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id ?? null

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const asset = (body as { asset?: unknown })?.asset
    if (typeof asset !== 'string' || !VALID_ASSETS.has(asset)) {
      return NextResponse.json({ error: 'Invalid asset' }, { status: 400 })
    }

    const source = (body as { source?: unknown })?.source
    const visitorId = (body as { visitorId?: unknown })?.visitorId
    const metadata = (body as { metadata?: unknown })?.metadata

    await logDownloadEvent({
      asset: asset as DownloadAsset,
      userId,
      visitorId: typeof visitorId === 'string' ? visitorId : null,
      source: typeof source === 'string' ? source : null,
      metadata:
        metadata && typeof metadata === 'object' && !Array.isArray(metadata)
          ? (metadata as Record<string, unknown>)
          : null,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[downloads/log]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
