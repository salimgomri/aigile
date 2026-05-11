'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, ExternalLink, Filter, Plus, Search, Sparkles } from 'lucide-react'

import { IntelligenceCollectorModal } from '@/components/admin/intelligence-collector-modal'
import { useLanguage } from '@/components/language-provider'
import type { CollectorItem } from '@/lib/intelligence/collector-format'
import { youtubeThumbnailUrlForPageUrl } from '@/lib/intelligence/media-metadata-shared'
import { tierCoverGradientClass } from '@/lib/intelligence/tier-visuals'
import { cn } from '@/lib/utils'
import type {
  IntelligenceSourceGroup,
  IntelligenceSourcesFile,
  IntelligenceTier,
  SourceUrl,
} from '@/lib/intelligence/types'

function normalizeHost(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, '')
  } catch {
    return u
  }
}

function matchesQuery(tier: IntelligenceTier, group: IntelligenceSourceGroup, q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const hay = [
    tier.title_fr,
    tier.title_en,
    tier.tagline_fr,
    tier.tagline_en,
    group.name,
    ...group.urls.map((x) => x.href),
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(needle)
}

function filterUrls(urls: SourceUrl[], hideYoutube: boolean): SourceUrl[] {
  if (!hideYoutube) return urls
  return urls.filter((u) => u.kind !== 'youtube')
}

type FeedApiItem = {
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

function pickCoverForGroup(tierId: string, groupName: string, rows: FeedApiItem[]): string | null {
  const matches = rows.filter((r) => r.tier_id === tierId && r.source_label === groupName)
  const thumb = matches.map((r) => r.thumbnail_url).find((u) => !!u?.trim())
  if (thumb) return thumb
  for (const r of matches) {
    const u = youtubeThumbnailUrlForPageUrl(r.url)
    if (u) return u
  }
  return null
}

function BentoCover({ tierId, src }: { tierId: string; src: string | null }) {
  const [broken, setBroken] = useState(false)
  const showImg = !!src && !broken

  return (
    <div
      className={cn(
        'relative mb-3 h-28 w-full overflow-hidden rounded-xl md:h-32',
        !showImg && tierCoverGradientClass(tierId),
      )}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : null}
    </div>
  )
}

function TierBadge({ tier }: { tier: IntelligenceTier }) {
  const { layout, rank } = tier
  if (layout.variant === 'empire_gold_black') {
    return (
      <span className="inline-flex items-center rounded-md border border-aigile-gold/70 bg-black px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-aigile-gold shadow-[0_0_24px_rgba(201,151,58,0.25)]">
        Empire
      </span>
    )
  }
  if (layout.variant === 'wealth_hbr') {
    return (
      <span className="inline-flex items-center rounded-sm border border-emerald-800/60 bg-emerald-950/40 px-2 py-0.5 font-serif text-[10px] font-semibold uppercase tracking-wider text-emerald-100">
        ROI
      </span>
    )
  }
  return (
    <span className="rounded-md border border-border/80 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
      {rank}
    </span>
  )
}

function UrlChip({ url }: { url: SourceUrl }) {
  const host = normalizeHost(url.href)
  const kindClass =
    url.kind === 'youtube'
      ? 'border-red-500/35 bg-red-500/10 text-red-100/95'
      : url.kind === 'podcast'
        ? 'border-violet-500/35 bg-violet-500/10 text-violet-100/95'
        : 'border-aigile-gold/30 bg-aigile-gold/5 text-foreground/95'

  return (
    <a
      href={url.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group/chip inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors hover:border-aigile-gold/50 hover:bg-aigile-gold/10',
        kindClass,
      )}
    >
      <span className="truncate">{host}</span>
      <ExternalLink className="h-3 w-3 shrink-0 opacity-60 group-hover/chip:opacity-100" aria-hidden />
    </a>
  )
}

function SourceCard({
  tier,
  group,
  query,
  hideYoutube,
  selected,
  onToggleSelect,
  coverImageUrl,
}: {
  tier: IntelligenceTier
  group: IntelligenceSourceGroup
  query: string
  hideYoutube: boolean
  selected: boolean
  onToggleSelect: () => void
  coverImageUrl: string | null
}) {
  const ok = matchesQuery(tier, group, query)
  const urls = filterUrls(group.urls, hideYoutube)

  return (
    <article
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border bg-card/80 shadow-sm transition-[filter,opacity,transform,box-shadow] duration-500 ease-out',
        tier.layout.variant === 'empire_gold_black' &&
          'border-aigile-gold/35 bg-gradient-to-b from-zinc-950/90 to-black/80 md:min-h-[160px]',
        tier.layout.variant === 'wealth_hbr' && 'border-emerald-900/40 bg-emerald-950/10',
        tier.layout.variant !== 'empire_gold_black' &&
          tier.layout.variant !== 'wealth_hbr' &&
          'border-border/80',
        !ok && 'pointer-events-none blur-[8px] opacity-[0.22] saturate-[0.35]',
        ok && selected && 'ring-2 ring-aigile-gold/70 ring-offset-2 ring-offset-background',
      )}
    >
      <div className="relative p-4 md:p-5">
        {ok ? (
          <button
            type="button"
            onClick={onToggleSelect}
            aria-pressed={selected}
            title={selected ? 'Retirer du collector' : 'Ajouter au collector'}
            className={cn(
              'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[11px] transition-colors',
              selected
                ? 'border-aigile-gold bg-aigile-gold/25 text-aigile-gold'
                : 'border-border/70 bg-background/70 text-muted-foreground hover:border-aigile-gold/45 hover:text-aigile-gold',
            )}
          >
            {selected ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          </button>
        ) : null}
        {ok ? <BentoCover tierId={tier.id} src={coverImageUrl} /> : null}
        <h3
          className={cn(
            'mb-3 pr-10 font-semibold leading-snug text-foreground',
            tier.layout.variant === 'empire_gold_black' && 'text-lg md:text-2xl md:tracking-tight',
            tier.layout.variant === 'wealth_hbr' && 'font-serif text-base md:text-lg',
          )}
        >
          {group.name}
        </h3>
        <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()} role="presentation">
          {urls.map((u) => (
            <UrlChip key={u.href} url={u} />
          ))}
          {urls.length === 0 && hideYoutube && group.urls.some((u) => u.kind === 'youtube') ? (
            <p className="text-xs italic text-muted-foreground">
              Liens YouTube masqués — filtre qualité (≥ durée configurée à l’ingestion).
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function IntelligenceSourcesMatrix({ data }: { data: IntelligenceSourcesFile }) {
  const { language } = useLanguage()
  const [query, setQuery] = useState('')
  const [hideYoutube, setHideYoutube] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set())
  const [collectorOpen, setCollectorOpen] = useState(false)
  const [feedRows, setFeedRows] = useState<FeedApiItem[]>([])

  const langUi = language === 'fr' ? 'fr' : 'en'

  useEffect(() => {
    let cancelled = false
    void fetch('/api/admin/intelligence/feed')
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { items?: FeedApiItem[] } | null) => {
        if (cancelled || !json?.items) return
        setFeedRows(json.items)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  function selectionKey(tierId: string, groupName: string) {
    return `${tierId}:::${groupName}`
  }

  function toggleKey(tierId: string, groupName: string) {
    const k = selectionKey(tierId, groupName)
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  const collectorItems: CollectorItem[] = useMemo(() => {
    const out: CollectorItem[] = []
    for (const tier of data.tiers) {
      const tierTitle = langUi === 'fr' ? tier.title_fr : tier.title_en
      for (const group of tier.groups) {
        if (!selectedKeys.has(selectionKey(tier.id, group.name))) continue
        const urls = filterUrls(group.urls, hideYoutube)
        const rows = feedRows.filter((r) => r.tier_id === tier.id && r.source_label === group.name)

        if (rows.length === 0) {
          out.push({
            tierId: tier.id,
            tierTitle,
            groupName: group.name,
            urls,
            feedPending: true,
          })
          continue
        }

        for (const row of rows) {
          const matchUrls = urls.filter((u) => u.href === row.url)
          const kind = row.url_kind as SourceUrl['kind']
          const safeKind: SourceUrl['kind'] =
            kind === 'youtube' || kind === 'podcast' || kind === 'web' ? kind : 'web'
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
    }
    return out
  }, [data.tiers, selectedKeys, hideYoutube, langUi, feedRows])

  const searchPlaceholder =
    language === 'fr' ? 'Recherche profonde — nom, domaine, créateur…' : 'Deep search — name, domain, creator…'

  const filterLabel =
    language === 'fr'
      ? `Masquer les flux YouTube (règle ingestion ≥ ${data.youtube_min_duration_minutes} min)`
      : `Hide YouTube feeds (ingestion rule ≥ ${data.youtube_min_duration_minutes} min)`

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div
          className={cn(
            'relative flex-1 overflow-hidden rounded-2xl border border-aigile-gold/15 bg-gradient-to-br from-amber-950/25 via-card/90 to-background p-[1px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
          )}
        >
          <div className="flex items-center gap-3 rounded-[15px] bg-background/55 px-4 py-3 backdrop-blur-[14px]">
            <Search className="h-5 w-5 shrink-0 text-aigile-gold/80" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/65 focus:outline-none"
              aria-label={language === 'fr' ? 'Recherche dans les sources' : 'Search sources'}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted/30 lg:max-w-sm">
          <Filter className="h-4 w-4 shrink-0 text-aigile-gold/90" aria-hidden />
          <span className="leading-snug">{filterLabel}</span>
          <input
            type="checkbox"
            className="ml-auto h-4 w-4 accent-aigile-gold"
            checked={hideYoutube}
            onChange={(e) => setHideYoutube(e.target.checked)}
          />
        </label>
      </div>

      {data.tiers.map((tier) => {
        const title = language === 'fr' ? tier.title_fr : tier.title_en
        const tagline = language === 'fr' ? tier.tagline_fr : tier.tagline_en
        const span = tier.layout.bento_column_span >= 2 ? 'md:col-span-2' : 'md:col-span-1'

        return (
          <section key={tier.id} className="space-y-4">
            <div
              className={cn(
                'flex flex-wrap items-center gap-3 border-b border-border/60 pb-4',
                tier.layout.variant === 'empire_gold_black' && 'border-aigile-gold/25',
              )}
            >
              <TierBadge tier={tier} />
              <div className="min-w-0 flex-1">
                <h2
                  className={cn(
                    'font-bold text-foreground',
                    tier.layout.variant === 'empire_gold_black' && 'text-2xl md:text-3xl',
                    tier.layout.variant === 'wealth_hbr' && 'font-serif text-xl md:text-2xl',
                    !['empire_gold_black', 'wealth_hbr'].includes(tier.layout.variant) && 'text-xl md:text-2xl',
                  )}
                >
                  {title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
              </div>
            </div>

            <div
              className={cn(
                'grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5',
                tier.layout.variant === 'empire_gold_black' &&
                  'rounded-3xl border border-aigile-gold/20 bg-gradient-to-br from-black/80 via-zinc-950/70 to-zinc-950/40 p-4 md:p-6',
              )}
            >
              {tier.groups.map((group) => (
                <div key={group.name} className={span}>
                  <SourceCard
                    tier={tier}
                    group={group}
                    query={query}
                    hideYoutube={hideYoutube}
                    selected={selectedKeys.has(selectionKey(tier.id, group.name))}
                    onToggleSelect={() => toggleKey(tier.id, group.name)}
                    coverImageUrl={pickCoverForGroup(tier.id, group.name, feedRows)}
                  />
                </div>
              ))}
            </div>
          </section>
        )
      })}

      <p className="text-center text-[11px] text-muted-foreground/85">
        {language === 'fr'
          ? 'Synchronisez le flux vitalité pour miniatures réelles et Collector branché sur Supabase. Démo : recherchez « Naval » ou « Cagan », sélectionnez les cartes visibles, ouvrez le Collector.'
          : 'Sync the vitality feed for real thumbnails and Supabase-backed Collector. Demo: search “Naval” or “Cagan”, pick visible cards, open Collector.'}
      </p>

      <IntelligenceCollectorModal
        open={collectorOpen}
        onClose={() => setCollectorOpen(false)}
        items={collectorItems}
        language={langUi}
      />

      {selectedKeys.size > 0 ? (
        <div className="fixed bottom-6 left-1/2 z-[120] flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-full border border-aigile-gold/35 bg-background/90 px-5 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <Sparkles className="h-4 w-4 shrink-0 text-aigile-gold" aria-hidden />
          <span className="text-sm font-medium text-foreground">
            {selectedKeys.size} source{selectedKeys.size > 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => setCollectorOpen(true)}
            className="rounded-full bg-aigile-gold px-4 py-1.5 text-sm font-semibold text-black hover:bg-aigile-gold/90"
          >
            {language === 'fr' ? 'Ouvrir le Collector' : 'Open Collector'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedKeys(new Set())}
            className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {language === 'fr' ? 'Vider' : 'Clear'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
