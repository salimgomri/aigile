import type { CollectorItem } from '@/lib/intelligence/collector-format'
import type {
  IntelligenceSourceGroup,
  IntelligenceSourcesFile,
  IntelligenceTier,
  SourceUrl,
} from '@/lib/intelligence/types'

/** Limite alignée sur `/api/admin/intelligence/collector/doctrine` */
export const COLLECTOR_DOCTRINE_MAX_FEED_IDS = 24

export type CollectorFeedRow = {
  id: string
  tier_id: string
  source_label: string
  url: string
  url_kind: string
  vitality_score: number
  status: 'pending' | 'analyzing' | 'ready' | 'error'
  preview_snippet: string | null
  transcript_text: string | null
  thumbnail_url: string | null
  summary: string | null
  content: string | null
}

function filterUrls(urls: SourceUrl[], hideYoutube: boolean): SourceUrl[] {
  if (!hideYoutube) return urls
  return urls.filter((u) => u.kind !== 'youtube')
}

function pushGroupItems(
  out: CollectorItem[],
  tier: IntelligenceTier,
  group: IntelligenceSourceGroup,
  tierTitle: string,
  rows: CollectorFeedRow[],
  hideYoutube: boolean,
): void {
  const urls = filterUrls(group.urls, hideYoutube)

  if (rows.length === 0) {
    out.push({
      tierId: tier.id,
      tierTitle,
      groupName: group.name,
      urls,
      feedPending: true,
    })
    return
  }

  for (const row of rows) {
    const matchUrls = urls.filter((u) => u.href === row.url)
    const kind = row.url_kind as SourceUrl['kind']
    const safeKind: SourceUrl['kind'] =
      kind === 'youtube' || kind === 'podcast' || kind === 'web' || kind === 'rss' ? kind : 'web'
    out.push({
      tierId: tier.id,
      tierTitle,
      groupName: group.name,
      urls: matchUrls.length ? matchUrls : [{ href: row.url, kind: safeKind }],
      feedItemId: row.id,
      vitality_score: Number(row.vitality_score),
      summary: row.summary ?? row.preview_snippet,
      content: row.content ?? row.transcript_text,
      thumbnail_url: row.thumbnail_url,
      primaryUrl: row.url,
      feedStatus: row.status,
      feedPending: false,
    })
  }
}

/** Sélection matrice historique : clés `tierId:::groupName`. */
export function buildCollectorItemsFromGroupKeys(
  data: IntelligenceSourcesFile,
  feedRows: CollectorFeedRow[],
  selectedKeys: Set<string>,
  hideYoutube: boolean,
  langUi: 'fr' | 'en',
  groupKey: (tierId: string, groupName: string) => string,
): CollectorItem[] {
  const out: CollectorItem[] = []
  for (const tier of data.tiers) {
    const tierTitle = langUi === 'fr' ? tier.title_fr : tier.title_en
    for (const group of tier.groups) {
      if (!selectedKeys.has(groupKey(tier.id, group.name))) continue
      const rows = feedRows.filter((r) => r.tier_id === tier.id && r.source_label === group.name)
      pushGroupItems(out, tier, group, tierTitle, rows, hideYoutube)
    }
  }
  return out
}

export function buildCollectorItemsFromTierIds(
  data: IntelligenceSourcesFile,
  feedRows: CollectorFeedRow[],
  tierIds: Set<string>,
  hideYoutube: boolean,
  langUi: 'fr' | 'en',
): CollectorItem[] {
  const out: CollectorItem[] = []
  for (const tier of data.tiers) {
    if (!tierIds.has(tier.id)) continue
    const tierTitle = langUi === 'fr' ? tier.title_fr : tier.title_en
    for (const group of tier.groups) {
      const rows = feedRows.filter((r) => r.tier_id === tier.id && r.source_label === group.name)
      pushGroupItems(out, tier, group, tierTitle, rows, hideYoutube)
    }
  }
  return out
}

export function buildCollectorItemsFromFeedItemIds(
  data: IntelligenceSourcesFile,
  feedRows: CollectorFeedRow[],
  feedItemIds: Set<string>,
  hideYoutube: boolean,
  langUi: 'fr' | 'en',
): CollectorItem[] {
  const rowById = new Map(feedRows.map((r) => [r.id, r]))
  const out: CollectorItem[] = []

  for (const id of feedItemIds) {
    const row = rowById.get(id)
    if (!row) continue
    const tier = data.tiers.find((t) => t.id === row.tier_id)
    if (!tier) continue
    const group = tier.groups.find((g) => g.name === row.source_label)
    if (!group) continue
    const tierTitle = langUi === 'fr' ? tier.title_fr : tier.title_en
    pushGroupItems(out, tier, group, tierTitle, [row], hideYoutube)
  }

  const seen = new Set<string>()
  return out.filter((item) => {
    const k = item.feedItemId ?? `${item.tierId}:::${item.groupName}:::pending`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export function countCollectorFeedIds(items: CollectorItem[]): number {
  return items.filter((i) => !!i.feedItemId).length
}
