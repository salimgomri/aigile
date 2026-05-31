'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, ExternalLink, Filter, Loader2, Plus, Search, Sparkles } from 'lucide-react'

import { IntelligenceCollectorModal } from '@/components/admin/intelligence-collector-modal'
import { IntelligenceCollectorScopeModal } from '@/components/admin/intelligence-collector-scope-modal'
import {
  IntelligenceSourceReaderModal,
  type ReaderFeedRow,
} from '@/components/admin/intelligence-source-reader-modal'
import { useLanguage } from '@/components/language-provider'
import type { CollectorItem } from '@/lib/intelligence/collector-format'
import { faviconUrlForPageUrl, youtubeThumbnailUrlForPageUrl } from '@/lib/intelligence/media-metadata-shared'
import { intelFeedRowHasReadableBody } from '@/lib/intelligence/feed-readable-body'
import { tierCoverGradientClass } from '@/lib/intelligence/tier-visuals'
import { cn } from '@/lib/utils'
import type {
  IntelligenceSourceGroup,
  IntelligenceSourcesFile,
  IntelligenceTier,
  SourceUrl,
} from '@/lib/intelligence/types'

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
  transcript_error: string | null
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
  if (layout.variant === 'visionnaires_gold_fine') {
    return (
      <span className="inline-flex items-center rounded-md border-[0.5px] border-aigile-gold/75 bg-black/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-aigile-gold shadow-[0_0_18px_rgba(254, 189, 16,0.22)]">
        Vision
      </span>
    )
  }
  if (layout.variant === 'empire_gold_black') {
    return (
      <span className="inline-flex items-center rounded-md border border-aigile-gold/70 bg-black px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-aigile-gold shadow-[0_0_24px_rgba(254, 189, 16,0.25)]">
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

function UrlThumbnailRow({ url, row }: { url: SourceUrl; row?: FeedApiItem }) {
  const yt = url.kind === 'youtube' ? youtubeThumbnailUrlForPageUrl(url.href) : null
  const thumb = row?.thumbnail_url?.trim() || yt || null
  const fav = faviconUrlForPageUrl(url.href)

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/55 bg-background/50 px-2 py-1.5">
      <div className="relative flex h-11 w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : fav ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fav} alt="" className="h-8 w-8 object-contain" />
        ) : (
          <span className="flex h-full items-center justify-center px-1 text-center text-[9px] leading-tight text-muted-foreground">
            {url.kind === 'youtube' ? 'YT' : url.kind === 'rss' ? 'RSS' : url.kind === 'podcast' ? 'POD' : 'WEB'}
          </span>
        )}
      </div>
      <a
        href={url.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="min-w-0 flex-1 truncate text-[11px] font-medium text-aigile-gold underline-offset-2 hover:underline"
      >
        {url.href}
      </a>
      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
    </div>
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
  groupFeedRows,
  tierTitleUi,
  language,
  onOpenReader,
}: {
  tier: IntelligenceTier
  group: IntelligenceSourceGroup
  query: string
  hideYoutube: boolean
  selected: boolean
  onToggleSelect: () => void
  coverImageUrl: string | null
  groupFeedRows: FeedApiItem[]
  tierTitleUi: string
  language: 'fr' | 'en'
  onOpenReader: (payload: {
    tierTitle: string
    groupName: string
    urls: SourceUrl[]
    rows: ReaderFeedRow[]
  }) => void
}) {
  const ok = matchesQuery(tier, group, query)
  const urls = filterUrls(group.urls, hideYoutube)

  const hint =
    language === 'fr'
      ? 'Cliquer pour lire le texte / transcript'
      : 'Click to read text / transcript'

  return (
    <article
      tabIndex={ok ? 0 : undefined}
      role={ok ? 'button' : undefined}
      aria-label={ok ? `${group.name} — ${hint}` : undefined}
      onClick={() => {
        if (!ok) return
        const rows: ReaderFeedRow[] = groupFeedRows.map((r) => ({
          id: r.id,
          url: r.url,
          url_kind: r.url_kind,
          status: r.status,
          thumbnail_url: r.thumbnail_url,
          summary: r.summary,
          content: r.content,
          transcript_text: r.transcript_text,
          transcript_error: r.transcript_error,
        }))
        onOpenReader({
          tierTitle: tierTitleUi,
          groupName: group.name,
          urls: group.urls,
          rows,
        })
      }}
      onKeyDown={(e) => {
        if (!ok) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          const rows: ReaderFeedRow[] = groupFeedRows.map((r) => ({
            id: r.id,
            url: r.url,
            url_kind: r.url_kind,
            status: r.status,
            thumbnail_url: r.thumbnail_url,
            summary: r.summary,
            content: r.content,
            transcript_text: r.transcript_text,
            transcript_error: r.transcript_error,
          }))
          onOpenReader({
            tierTitle: tierTitleUi,
            groupName: group.name,
            urls: group.urls,
            rows,
          })
        }
      }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border bg-card/80 shadow-sm transition-[filter,opacity,transform,box-shadow,border-color] duration-300 ease-out',
        ok && 'cursor-pointer hover:border-aigile-gold/40',
        tier.layout.variant === 'visionnaires_gold_fine' &&
          'border-[0.5px] border-aigile-gold/55 bg-gradient-to-b from-black/55 via-zinc-950/88 to-black/92 shadow-[0_0_0_0.5px_rgba(254, 189, 16,0.1)] md:min-h-[148px]',
        tier.layout.variant === 'empire_gold_black' &&
          'border-aigile-gold/35 bg-gradient-to-b from-zinc-950/90 to-black/80 md:min-h-[160px]',
        tier.layout.variant === 'wealth_hbr' && 'border-emerald-900/40 bg-emerald-950/10',
        tier.layout.variant !== 'empire_gold_black' &&
          tier.layout.variant !== 'visionnaires_gold_fine' &&
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
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect()
            }}
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
            'mb-2 pr-10 font-semibold leading-snug text-foreground',
            tier.layout.variant === 'visionnaires_gold_fine' &&
              'text-base text-aigile-gold/95 md:text-lg md:tracking-tight',
            tier.layout.variant === 'empire_gold_black' && 'text-lg md:text-2xl md:tracking-tight',
            tier.layout.variant === 'wealth_hbr' && 'font-serif text-base md:text-lg',
          )}
        >
          {group.name}
        </h3>
        {ok ? (
          <p className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">{hint}</p>
        ) : null}
        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()} role="presentation">
          {urls.map((u) => {
            const row = groupFeedRows.find((r) => r.url === u.href)
            return <UrlThumbnailRow key={u.href} url={u} row={row} />
          })}
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

export function IntelligenceSourcesMatrix({
  data,
  rotationDay,
}: {
  data: IntelligenceSourcesFile
  rotationDay: string
}) {
  const { language } = useLanguage()
  const [query, setQuery] = useState('')
  const [hideYoutube, setHideYoutube] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set())
  const [scopeOpen, setScopeOpen] = useState(false)
  const [scopePrefillKeys, setScopePrefillKeys] = useState<string[]>([])
  const [collectorOpen, setCollectorOpen] = useState(false)
  const [collectorItems, setCollectorItems] = useState<CollectorItem[]>([])
  const [feedRows, setFeedRows] = useState<FeedApiItem[]>([])
  const [analysisBusy, setAnalysisBusy] = useState(false)
  const [analyzeBanner, setAnalyzeBanner] = useState<string | null>(null)

  const langUi = language === 'fr' ? 'fr' : 'en'

  const reloadFeed = useCallback(async () => {
    const q = encodeURIComponent(rotationDay)
    try {
      const res = await fetch(`/api/admin/intelligence/feed?rotationDay=${q}`)
      if (!res.ok) return
      const json = (await res.json()) as { items?: FeedApiItem[] }
      if (json.items) setFeedRows(json.items)
    } catch {
      /* ignore */
    }
  }, [rotationDay])

  useEffect(() => {
    void reloadFeed()
  }, [reloadFeed])

  const rowsCountByTier = useMemo(() => {
    const m: Record<string, number> = {}
    for (const t of data.tiers) m[t.id] = 0
    for (const r of feedRows) {
      m[r.tier_id] = (m[r.tier_id] ?? 0) + 1
    }
    return m
  }, [feedRows, data.tiers])

  const readableCountByTier = useMemo(() => {
    const m: Record<string, number> = {}
    for (const t of data.tiers) m[t.id] = 0
    for (const r of feedRows) {
      if (intelFeedRowHasReadableBody(r)) m[r.tier_id] = (m[r.tier_id] ?? 0) + 1
    }
    return m
  }, [feedRows, data.tiers])

  const [reader, setReader] = useState<{
    tierTitle: string
    groupName: string
    urls: SourceUrl[]
    rows: ReaderFeedRow[]
  } | null>(null)

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

  function openGenerateScope(prefillKeys: string[]) {
    if (analysisBusy) return
    setAnalyzeBanner(null)
    setScopePrefillKeys(prefillKeys)
    setScopeOpen(true)
  }

  function openCollectorFromScope(items: CollectorItem[]) {
    setCollectorItems(items)
    setCollectorOpen(true)
  }

  async function runAnalysisFromScope(items: CollectorItem[]) {
    const ids = new Set<string>()
    for (const it of items) {
      if (!it.feedItemId || it.feedPending) continue
      const row = feedRows.find((r) => r.id === it.feedItemId)
      if (!row || row.url_kind === 'rss') continue
      ids.add(it.feedItemId)
    }
    const list = [...ids]
    if (list.length === 0) {
      setAnalyzeBanner(
        language === 'fr'
          ? 'Aucune source analysable dans cette sélection (hors RSS ou non présente dans le flux).'
          : 'Nothing to analyze in this selection (non-feed or RSS skipped).',
      )
      return
    }
    setAnalysisBusy(true)
    setAnalyzeBanner(null)
    let ok = 0
    let ko = 0
    for (const id of list) {
      try {
        const res = await fetch(`/api/admin/intelligence/feed/items/${id}/analyze`, { method: 'POST' })
        if (res.ok) ok++
        else ko++
      } catch {
        ko++
      }
    }
    await reloadFeed()
    setAnalysisBusy(false)
    setAnalyzeBanner(
      language === 'fr'
        ? `Analyses · ${ok} réussie(s)${ko ? ` · ${ko} échec(s)` : ''} sur ${list.length} envoyée(s).`
        : `Analysis · ${ok} OK${ko ? ` · ${ko} failed` : ''} of ${list.length} sent.`,
    )
  }

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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch lg:items-end">
          <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted/30 lg:max-w-sm">
            <Filter className="h-4 w-4 shrink-0 text-aigile-gold/90" aria-hidden />
            <span className="leading-snug">{filterLabel}</span>
            <input
              type="checkbox"
              className="ml-auto h-4 w-4 accent-aigile-gold"
              checked={hideYoutube}
              onChange={(e) => setHideYoutube(e.target.checked)}
            />
          </label>
          <button
            type="button"
            disabled={analysisBusy}
            onClick={() => openGenerateScope([])}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-aigile-gold/45 bg-aigile-gold/10 px-5 py-3 text-sm font-semibold text-aigile-gold hover:bg-aigile-gold/18 disabled:pointer-events-none disabled:opacity-50"
          >
            {analysisBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
            {language === 'fr' ? 'Générer' : 'Generate'}
          </button>
        </div>
      </div>

      {analysisBusy ? (
        <p className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/25 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-aigile-gold" aria-hidden />
          {language === 'fr' ? 'Analyses en cours sur les sources sélectionnées…' : 'Running analyses on selected sources…'}
        </p>
      ) : null}
      {analyzeBanner ? (
        <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100/95">
          {analyzeBanner}
        </p>
      ) : null}

      {data.tiers.map((tier) => {
        const title = language === 'fr' ? tier.title_fr : tier.title_en
        const tagline = language === 'fr' ? tier.tagline_fr : tier.tagline_en
        const span = tier.layout.bento_column_span >= 2 ? 'md:col-span-2' : 'md:col-span-1'

        return (
          <section key={tier.id} className="space-y-4">
            <div
              className={cn(
                'flex flex-wrap items-center gap-3 border-b border-border/60 pb-4',
                tier.layout.variant === 'visionnaires_gold_fine' && 'border-b-[0.5px] border-aigile-gold/38',
                tier.layout.variant === 'empire_gold_black' && 'border-aigile-gold/25',
              )}
            >
              <TierBadge tier={tier} />
              <div className="min-w-0 flex-1">
                <h2
                  className={cn(
                    'font-bold text-foreground',
                    tier.layout.variant === 'visionnaires_gold_fine' &&
                      'bg-gradient-to-r from-aigile-gold/95 via-foreground to-aigile-gold/80 bg-clip-text text-xl text-transparent md:text-2xl',
                    tier.layout.variant === 'empire_gold_black' && 'text-2xl md:text-3xl',
                    tier.layout.variant === 'wealth_hbr' && 'font-serif text-xl md:text-2xl',
                    !['empire_gold_black', 'wealth_hbr', 'visionnaires_gold_fine'].includes(tier.layout.variant) &&
                      'text-xl md:text-2xl',
                  )}
                >
                  {title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
                <p className="mt-2 text-xs tabular-nums text-muted-foreground/95">
                  {language === 'fr' ? (
                    <>
                      <span className="font-medium text-foreground">{readableCountByTier[tier.id] ?? 0}</span>
                      {' analyse(s) avec texte exploitable'}
                      {' · '}
                      <span className="font-medium text-foreground">{rowsCountByTier[tier.id] ?? 0}</span>
                      {' ligne(s) dans le flux du jour'}
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-foreground">{readableCountByTier[tier.id] ?? 0}</span>
                      {' non-empty bodies'}
                      {' · '}
                      <span className="font-medium text-foreground">{rowsCountByTier[tier.id] ?? 0}</span>
                      {' feed row(s)'}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div
              className={cn(
                'grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5',
                tier.layout.variant === 'visionnaires_gold_fine' &&
                  'rounded-3xl border-[0.5px] border-aigile-gold/42 bg-gradient-to-b from-amber-950/18 via-black/45 to-zinc-950/55 p-4 shadow-[inset_0_1px_0_rgba(254, 189, 16,0.07)] md:p-6',
                tier.layout.variant === 'empire_gold_black' &&
                  'rounded-3xl border border-aigile-gold/20 bg-gradient-to-br from-black/80 via-zinc-950/70 to-zinc-950/40 p-4 md:p-6',
              )}
            >
              {tier.groups.map((group) => {
                const groupFeedRows = feedRows.filter(
                  (r) => r.tier_id === tier.id && r.source_label === group.name,
                )
                return (
                  <div key={group.name} className={span}>
                    <SourceCard
                      tier={tier}
                      group={group}
                      query={query}
                      hideYoutube={hideYoutube}
                      selected={selectedKeys.has(selectionKey(tier.id, group.name))}
                      onToggleSelect={() => toggleKey(tier.id, group.name)}
                      coverImageUrl={pickCoverForGroup(tier.id, group.name, feedRows)}
                      groupFeedRows={groupFeedRows}
                      tierTitleUi={title}
                      language={langUi}
                      onOpenReader={setReader}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      <p className="text-center text-[11px] text-muted-foreground/85">
        {language === 'fr'
          ? `Flux filtré : jour UTC ${rotationDay}. « Générer » lance les analyses sur la sélection ; le Collector (doctrine) reste disponible depuis la même fenêtre.`
          : `Feed: UTC day ${rotationDay}. « Generate » runs analyses on your selection; Collector (doctrine) is optional in the same dialog.`}
      </p>

      <IntelligenceSourceReaderModal
        open={reader !== null}
        onClose={() => setReader(null)}
        tierTitle={reader?.tierTitle ?? ''}
        groupName={reader?.groupName ?? ''}
        urls={reader?.urls ?? []}
        rows={reader?.rows ?? []}
        language={langUi}
      />

      <IntelligenceCollectorScopeModal
        open={scopeOpen}
        onClose={() => setScopeOpen(false)}
        data={data}
        feedRows={feedRows}
        hideYoutube={hideYoutube}
        language={langUi}
        prefillGroupKeys={scopePrefillKeys}
        analysisBusy={analysisBusy}
        onAnalyzeSelection={runAnalysisFromScope}
        onOpenCollector={openCollectorFromScope}
      />

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
            disabled={analysisBusy}
            onClick={() => openGenerateScope(Array.from(selectedKeys))}
            className="rounded-full bg-aigile-gold px-4 py-1.5 text-sm font-semibold text-black hover:bg-aigile-gold/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {language === 'fr' ? 'Générer' : 'Generate'}
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
