import { DOWNLOAD_ASSET_LABELS, type DownloadAsset } from '@/lib/downloads/types'

export type DownloadEventRow = {
  asset: string
  user_id: string | null
  visitor_id: string | null
  source: string | null
  created_at: string
  user_email?: string | null
  user_name?: string | null
}

export type ToolPdfExportRow = {
  action: string
  user_id: string
  created_at: string
}

const TOOL_PDF_LABELS: Record<string, string> = {
  retro_pdf: 'Export PDF Rétro',
  dora_pdf: 'Export PDF DORA',
  scoring_pdf: 'Export PDF Scoring',
  dashboard_pdf: 'Export PDF Dashboard',
  skill_pdf: 'Export PDF Skill Matrix',
}

export type DownloadAssetStats = {
  asset: string
  label: string
  total_downloads: number
  unique_users: number
  unique_visitors: number
  last_download_at: string | null
}

export type DownloadInsights = {
  publicAssets: DownloadAssetStats[]
  toolPdfExports: DownloadAssetStats[]
  recentPublic: Array<{
    asset: string
    label: string
    user_email: string | null
    user_name: string | null
    source: string | null
    created_at: string
  }>
  totals: {
    publicDownloads: number
    toolPdfExports: number
    last7DaysPublic: number
    last30DaysPublic: number
  }
}

function uniqueCount(rows: DownloadEventRow[], key: 'user_id' | 'visitor_id') {
  return new Set(rows.map((r) => r[key]).filter(Boolean)).size
}

function aggregatePublicAsset(
  asset: string,
  rows: DownloadEventRow[]
): DownloadAssetStats {
  const label =
    DOWNLOAD_ASSET_LABELS[asset as DownloadAsset] ??
    TOOL_PDF_LABELS[asset] ??
    asset

  const sorted = [...rows].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return {
    asset,
    label,
    total_downloads: rows.length,
    unique_users: uniqueCount(rows, 'user_id'),
    unique_visitors: uniqueCount(rows, 'visitor_id'),
    last_download_at: sorted[0]?.created_at ?? null,
  }
}

export function aggregateDownloadInsights(
  publicRows: DownloadEventRow[],
  toolPdfRows: ToolPdfExportRow[]
): DownloadInsights {
  const now = Date.now()
  const day7 = now - 7 * 24 * 60 * 60 * 1000
  const day30 = now - 30 * 24 * 60 * 60 * 1000

  const byAsset = new Map<string, DownloadEventRow[]>()
  for (const row of publicRows) {
    const list = byAsset.get(row.asset) ?? []
    list.push(row)
    byAsset.set(row.asset, list)
  }

  const publicAssets = [...byAsset.entries()]
    .map(([asset, rows]) => aggregatePublicAsset(asset, rows))
    .sort((a, b) => b.total_downloads - a.total_downloads)

  const byPdfAction = new Map<string, ToolPdfExportRow[]>()
  for (const row of toolPdfRows) {
    const list = byPdfAction.get(row.action) ?? []
    list.push(row)
    byPdfAction.set(row.action, list)
  }

  const toolPdfExports = [...byPdfAction.entries()]
    .map(([action, rows]) =>
      aggregatePublicAsset(
        action,
        rows.map((r) => ({
          asset: action,
          user_id: r.user_id,
          visitor_id: null,
          source: null,
          created_at: r.created_at,
        }))
      )
    )
    .sort((a, b) => b.total_downloads - a.total_downloads)

  const recentPublic = [...publicRows]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12)
    .map((r) => ({
      asset: r.asset,
      label: DOWNLOAD_ASSET_LABELS[r.asset as DownloadAsset] ?? r.asset,
      user_email: r.user_email ?? null,
      user_name: r.user_name ?? null,
      source: r.source,
      created_at: r.created_at,
    }))

  return {
    publicAssets,
    toolPdfExports,
    recentPublic,
    totals: {
      publicDownloads: publicRows.length,
      toolPdfExports: toolPdfRows.length,
      last7DaysPublic: publicRows.filter(
        (r) => new Date(r.created_at).getTime() >= day7
      ).length,
      last30DaysPublic: publicRows.filter(
        (r) => new Date(r.created_at).getTime() >= day30
      ).length,
    },
  }
}
