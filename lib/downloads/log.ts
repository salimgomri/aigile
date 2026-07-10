import 'server-only'

import { supabaseAdmin } from '@/lib/supabase'
import type { DownloadAsset } from './types'

export async function logDownloadEvent(input: {
  asset: DownloadAsset
  userId?: string | null
  visitorId?: string | null
  source?: string | null
  metadata?: Record<string, unknown> | null
}) {
  const { error } = await supabaseAdmin.from('download_events').insert({
    user_id: input.userId ?? null,
    visitor_id: input.visitorId ?? null,
    asset: input.asset,
    source: input.source ?? null,
    metadata: input.metadata ?? null,
  })

  if (error) {
    console.error('[downloads/log]', error)
  }
}
