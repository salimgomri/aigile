import type { DownloadAsset } from './types'

const VISITOR_KEY = 'aigile_visitor_id'

export function getDownloadVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

/** Fire-and-forget — ne bloque pas le téléchargement navigateur. */
export function logDownload(
  asset: DownloadAsset,
  options?: { source?: string; metadata?: Record<string, unknown> }
) {
  void fetch('/api/downloads/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      asset,
      source: options?.source ?? null,
      visitorId: getDownloadVisitorId(),
      metadata: options?.metadata ?? null,
    }),
  }).catch(() => {})
}
