'use client'

import { useCallback, useEffect, useState } from 'react'
import { BookOpen, CheckCircle2, ExternalLink, Flame, Loader2, RefreshCw } from 'lucide-react'

import { IntelligenceSourceReaderModal } from '@/components/admin/intelligence-source-reader-modal'
import { useLanguage } from '@/components/language-provider'
import { faviconUrlForPageUrl, youtubeThumbnailUrlForPageUrl } from '@/lib/intelligence/media-metadata-shared'
import { tierCoverGradientClass } from '@/lib/intelligence/tier-visuals'
import type { SourceUrl } from '@/lib/intelligence/types'
import { cn } from '@/lib/utils'

type FeedItem = {
  id: string
  tier_id: string
  source_label: string
  url: string
  url_kind: string
  vitality_score: number
  empire_boost_applied: number
  status: 'pending' | 'analyzing' | 'ready' | 'error'
  preview_snippet: string | null
  transcript_error: string | null
  transcript_text?: string | null
  thumbnail_url?: string | null
  summary?: string | null
  content?: string | null
  rotation_day: string
}

type FeedPayload = {
  items: FeedItem[]
  retentionDays: number
  rotationHint: string | null
  rotationDayFilter?: string | null
}

function vitalityLabel(score: number): string {
  const n = Number(score)
  if (!Number.isFinite(n)) return '?'
  return Math.round(n).toString()
}

function tierTitleFromId(tierId: string): string {
  return tierId.replace(/_/g, ' ')
}

function feedItemToSourceUrl(item: FeedItem): SourceUrl {
  const k = item.url_kind
  const kind: SourceUrl['kind'] = k === 'youtube' ? 'youtube' : k === 'podcast' ? 'podcast' : 'web'
  return { href: item.url, kind }
}

function FeedCardCover({
  tierId,
  thumb,
  href,
}: {
  tierId: string
  thumb: string | null
  href: string
}) {
  const [broken, setBroken] = useState(false)
  const fallbackYt = youtubeThumbnailUrlForPageUrl(href)
  const fav = faviconUrlForPageUrl(href)
  const src = thumb?.trim() || fallbackYt || null
  const show = src && !broken

  return (
    <div
      className={cn(
        'relative -mx-4 -mt-4 mb-4 h-36 overflow-hidden sm:h-40',
        !show && !fav && tierCoverGradientClass(tierId),
      )}
    >
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : fav ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fav} alt="" className="h-16 w-16 rounded-xl border border-white/10 bg-black/40 object-contain p-2" />
        </div>
      ) : null}
    </div>
  )
}

export function IntelligenceVitalityFeedDeck({ rotationDay }: { rotationDay: string }) {
  const { language } = useLanguage()
  const langUi = language === 'fr' ? 'fr' : 'en'
  const [data, setData] = useState<FeedPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [analyzeId, setAnalyzeId] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [readerItem, setReaderItem] = useState<FeedItem | null>(null)

  const load = useCallback(async () => {
    setBanner(null)
    const q = encodeURIComponent(rotationDay)
    const res = await fetch(`/api/admin/intelligence/feed?rotationDay=${q}`)
    if (!res.ok) {
      setData(null)
      setLoading(false)
      setBanner('Impossible de charger le flux vitalité.')
      return
    }
    const json = (await res.json()) as FeedPayload
    setData(json)
    setLoading(false)
  }, [rotationDay])

  useEffect(() => {
    void load()
  }, [load])

  const analyzing = data?.items.some((i) => i.status === 'analyzing') ?? false

  useEffect(() => {
    if (!analyzing) return
    const t = window.setInterval(() => void load(), 5000)
    return () => window.clearInterval(t)
  }, [analyzing, load])

  async function sync() {
    setSyncing(true)
    setBanner(null)
    try {
      const res = await fetch('/api/admin/intelligence/feed/sync', { method: 'POST' })
      if (!res.ok) {
        setBanner('Échec de la synchronisation.')
        return
      }
      const summary = (await res.json()) as { rotationDay?: string; upserted?: number; youtubeJobsQueued?: number }
      setBanner(
        `Synchronisation · jour UTC ${summary.rotationDay ?? '—'} · ${summary.upserted ?? 0} lignes · ${summary.youtubeJobsQueued ?? 0} jobs YouTube.`,
      )
      await load()
    } finally {
      setSyncing(false)
    }
  }

  async function analyze(id: string) {
    setAnalyzeId(id)
    setBanner(null)
    try {
      const res = await fetch(`/api/admin/intelligence/feed/items/${id}/analyze`, { method: 'POST' })
      if (!res.ok) {
        setBanner("Impossible de lancer l'analyse.")
        return
      }
      await load()
    } finally {
      setAnalyzeId(null)
    }
  }

  const items = data?.items ?? []

  return (
    <section className="mb-12 rounded-2xl border border-border/80 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
            Flux opérationnel Intelligence
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Miniatures · transcripts YouTube · texte Web après analyse · jour UTC sélectionné :{' '}
            <span className="font-mono text-foreground/90">{rotationDay}</span>.
          </p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-aigile-gold/90">
            {langUi === 'fr'
              ? 'Lecture : sur chaque carte verte (prêt), utilisez le bouton doré « Lire le texte extrait ». La ligne « Prêt » seule n’ouvre rien — c’est un statut, pas un lien.'
              : 'Reading: on each green (ready) card, use the gold “Read extracted text” button. “Ready” alone is only a status — it does not open content.'}
          </p>
          {data?.rotationHint ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Dernière journée de rotation présente dans le flux :{' '}
              <span className="font-mono text-foreground/90">{data.rotationHint}</span>
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void sync()}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-lg border border-aigile-gold/50 bg-aigile-gold/10 px-4 py-2 text-sm font-medium text-aigile-gold hover:bg-aigile-gold/15 disabled:opacity-50"
        >
          {syncing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
          Synchroniser depuis YAML
        </button>
      </div>

      {banner ? (
        <p className="mb-4 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground/90">{banner}</p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Chargement du flux…
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-aigile-gold/40 bg-amber-950/15 px-6 py-14 text-center">
          <p className="max-w-md text-sm text-muted-foreground">
            Aucune ligne Supabase pour le <span className="font-mono text-foreground">{rotationDay}</span> UTC. Lancez
            une synchronisation pour ingérer les URLs YAML (scraping des métadonnées + file d’attente YouTube).
          </p>
          <button
            type="button"
            onClick={() => void sync()}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-aigile-gold/70 bg-aigile-gold px-8 py-3 text-base font-semibold text-black shadow-lg hover:bg-aigile-gold/90 disabled:opacity-50"
          >
            {syncing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <RefreshCw className="h-5 w-5" aria-hidden />}
            Lancer le scraping maintenant
          </button>
          <p className="text-xs text-muted-foreground">
            Équivalent au bouton « Synchroniser depuis YAML » ci-dessus — ingestion + jobs transcript selon les règles.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const summaryText = (item.summary ?? item.preview_snippet ?? '').trim()
            const contentLen = (item.content ?? '').trim().length
            const showBodySkeleton =
              item.status === 'analyzing' ||
              (item.status === 'pending' && item.url_kind === 'youtube' && contentLen < 40 && summaryText.length < 120)

            return (
              <li key={item.id}>
                <article
                  className={cn(
                    'flex h-full flex-col overflow-hidden rounded-xl border p-4 transition-colors',
                    item.status === 'ready' &&
                      'border-emerald-500/55 bg-emerald-950/15 shadow-[0_0_0_1px_rgba(16,185,129,0.12)]',
                    item.status === 'analyzing' && 'animate-pulse border-amber-500/70 bg-amber-950/20',
                    item.status === 'pending' && 'border-dashed border-muted-foreground/35 bg-muted/5',
                    item.status === 'error' && 'border-red-500/45 bg-red-950/15',
                  )}
                >
                  <FeedCardCover tierId={item.tier_id} thumb={item.thumbnail_url ?? null} href={item.url} />

                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.status === 'ready' ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                      ) : item.status === 'analyzing' ? (
                        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-amber-400" aria-hidden />
                      ) : null}
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.source_label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold tabular-nums text-foreground">
                      <Flame className="h-4 w-4 text-orange-400/90" aria-hidden />
                      {vitalityLabel(item.vitality_score)}
                      {Number(item.empire_boost_applied) >= 1.9 ? (
                        <span className="ml-1 rounded bg-aigile-gold/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-aigile-gold">
                          ×{Number(item.empire_boost_applied).toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-aigile-gold hover:underline"
                  >
                    <span className="truncate">{item.url}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                  </a>

                  <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {item.url_kind} · {item.tier_id.replace(/_/g, ' ')}
                  </p>

                  {showBodySkeleton ? (
                    <div className="mb-3 flex-1 space-y-2" aria-busy="true">
                      <div className="h-3 w-full animate-pulse rounded bg-muted/45" />
                      <div className="h-3 w-[92%] max-w-full animate-pulse rounded bg-muted/35" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-muted/30" />
                      <p className="text-[11px] text-muted-foreground">Collecte du contenu…</p>
                    </div>
                  ) : summaryText ? (
                    <p className="mb-3 line-clamp-4 flex-1 text-sm leading-snug text-foreground/85">{summaryText}</p>
                  ) : (
                    <div className="mb-3 flex-1" />
                  )}

                  {item.status === 'error' && item.transcript_error ? (
                    <p className="mb-3 line-clamp-3 text-xs text-red-300/90">{item.transcript_error}</p>
                  ) : null}

                  <div className="mt-auto flex flex-col gap-2 border-t border-border/40 pt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {item.status === 'ready' &&
                          (langUi === 'fr'
                            ? 'Statut : prêt — ouvrez avec le bouton ci-dessous'
                            : 'Status: ready — use the button below')}
                        {item.status === 'analyzing' &&
                          (langUi === 'fr' ? 'En cours d’analyse…' : 'Analyzing…')}
                        {item.status === 'pending' &&
                          (langUi === 'fr' ? 'En attente — lancez l’analyse' : 'Pending — run analysis')}
                        {item.status === 'error' &&
                          (langUi === 'fr'
                            ? 'Erreur — nouvelle tentative possible'
                            : 'Error — you can retry')}
                      </span>
                      {(item.status === 'pending' || item.status === 'error') && (
                        <button
                          type="button"
                          disabled={analyzeId === item.id}
                          onClick={() => void analyze(item.id)}
                          className="ml-auto rounded-md border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium hover:bg-muted/60 disabled:opacity-50"
                        >
                          {analyzeId === item.id ? '…' : langUi === 'fr' ? 'Analyser' : 'Analyze'}
                        </button>
                      )}
                    </div>
                    {item.status === 'ready' ? (
                      <button
                        type="button"
                        onClick={() => setReaderItem(item)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-aigile-gold/55 bg-aigile-gold/15 py-2.5 text-sm font-semibold text-aigile-gold transition-colors hover:bg-aigile-gold/25"
                      >
                        <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                        {langUi === 'fr' ? 'Lire le texte extrait' : 'Read extracted text'}
                      </button>
                    ) : null}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
      <IntelligenceSourceReaderModal
        open={readerItem !== null}
        onClose={() => setReaderItem(null)}
        tierTitle={readerItem ? tierTitleFromId(readerItem.tier_id) : ''}
        groupName={readerItem?.source_label ?? ''}
        urls={readerItem ? [feedItemToSourceUrl(readerItem)] : []}
        rows={
          readerItem
            ? [
                {
                  id: readerItem.id,
                  url: readerItem.url,
                  url_kind: readerItem.url_kind,
                  status: readerItem.status,
                  thumbnail_url: readerItem.thumbnail_url ?? null,
                  summary: readerItem.summary ?? readerItem.preview_snippet ?? null,
                  content: readerItem.content ?? null,
                  transcript_text: readerItem.transcript_text ?? null,
                },
              ]
            : []
        }
        language={langUi}
      />
    </section>
  )
}
