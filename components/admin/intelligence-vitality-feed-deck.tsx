'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, ExternalLink, Flame, Loader2, RefreshCw } from 'lucide-react'

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
  rotation_day: string
}

type FeedPayload = {
  items: FeedItem[]
  retentionDays: number
  rotationHint: string | null
}

function vitalityLabel(score: number): string {
  const n = Number(score)
  if (!Number.isFinite(n)) return '?'
  return Math.round(n).toString()
}

export function IntelligenceVitalityFeedDeck() {
  const [data, setData] = useState<FeedPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [analyzeId, setAnalyzeId] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const load = useCallback(async () => {
    setBanner(null)
    const res = await fetch('/api/admin/intelligence/feed')
    if (!res.ok) {
      setData(null)
      setLoading(false)
      setBanner('Impossible de charger le flux vitalité.')
      return
    }
    const json = (await res.json()) as FeedPayload
    setData(json)
    setLoading(false)
  }, [])

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
            Moteur vitalité (Sprint 3)
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Rotation {data?.retentionDays ?? 7} jours · purge du jour courant avant resync · transcription auto YouTube si vitalité &gt; 90 · démo Paul Graham « prêt » après synchro.
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
        <p className="text-sm text-muted-foreground">
          Aucune entrée. Lancez une synchronisation pour peupler le flux (dont la carte Paul Graham prête à lire).
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <article
                className={cn(
                  'flex h-full flex-col rounded-xl border p-4 transition-colors',
                  item.status === 'ready' &&
                    'border-emerald-500/55 bg-emerald-950/15 shadow-[0_0_0_1px_rgba(16,185,129,0.12)]',
                  item.status === 'analyzing' && 'animate-pulse border-amber-500/70 bg-amber-950/20',
                  item.status === 'pending' && 'border-dashed border-muted-foreground/35 bg-muted/5',
                  item.status === 'error' && 'border-red-500/45 bg-red-950/15',
                )}
              >
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

                {item.preview_snippet ? (
                  <p className="mb-3 line-clamp-4 flex-1 text-sm leading-snug text-foreground/85">{item.preview_snippet}</p>
                ) : (
                  <div className="mb-3 flex-1" />
                )}

                {item.status === 'error' && item.transcript_error ? (
                  <p className="mb-3 line-clamp-3 text-xs text-red-300/90">{item.transcript_error}</p>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
                  <span className="text-xs text-muted-foreground">
                    {item.status === 'ready' && 'Prêt · lecture immédiate'}
                    {item.status === 'analyzing' && 'En cours d’analyse'}
                    {item.status === 'pending' && 'Analyser à la demande'}
                    {item.status === 'error' && 'Erreur — nouvelle tentative possible'}
                  </span>
                  {(item.status === 'pending' || item.status === 'error') && (
                    <button
                      type="button"
                      disabled={analyzeId === item.id}
                      onClick={() => void analyze(item.id)}
                      className="ml-auto rounded-md border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium hover:bg-muted/60 disabled:opacity-50"
                    >
                      {analyzeId === item.id ? '…' : 'Analyser'}
                    </button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
