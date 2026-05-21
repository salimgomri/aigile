'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, ChevronRight, Sparkles, X } from 'lucide-react'

import type { CollectorItem } from '@/lib/intelligence/collector-format'
import {
  buildCollectorItemsFromFeedItemIds,
  buildCollectorItemsFromTierIds,
  COLLECTOR_DOCTRINE_MAX_FEED_IDS,
  countCollectorFeedIds,
  type CollectorFeedRow,
} from '@/lib/intelligence/collector-build-items'
import { intelFeedRowHasReadableBody } from '@/lib/intelligence/feed-readable-body'
import { tierCoverGradientClass } from '@/lib/intelligence/tier-visuals'
import { cn } from '@/lib/utils'
import type { IntelligenceSourcesFile } from '@/lib/intelligence/types'

type Props = {
  open: boolean
  onClose: () => void
  data: IntelligenceSourcesFile
  feedRows: CollectorFeedRow[]
  hideYoutube: boolean
  language: 'fr' | 'en'
  /** Clés `tierId:::groupName` pour pré-remplir depuis la sélection rapide sur les cartes */
  prefillGroupKeys: string[]
  analysisBusy?: boolean
  onAnalyzeSelection: (items: CollectorItem[]) => void | Promise<void>
  onOpenCollector: (items: CollectorItem[]) => void
}

export function IntelligenceCollectorScopeModal({
  open,
  onClose,
  data,
  feedRows,
  hideYoutube,
  language,
  prefillGroupKeys,
  analysisBusy = false,
  onAnalyzeSelection,
  onOpenCollector,
}: Props) {
  const fr = language === 'fr'
  const [tab, setTab] = useState<'tiers' | 'articles'>('tiers')
  const [tierIds, setTierIds] = useState<Set<string>>(() => new Set())
  const [articleIds, setArticleIds] = useState<Set<string>>(() => new Set())

  const prefillSig = prefillGroupKeys.join('\n')

  useEffect(() => {
    if (!open) return
    const gKeys = new Set(prefillGroupKeys)
    const nextTiers = new Set<string>()
    const nextArticles = new Set<string>()
    for (const tier of data.tiers) {
      for (const group of tier.groups) {
        const k = `${tier.id}:::${group.name}`
        if (!gKeys.has(k)) continue
        nextTiers.add(tier.id)
        for (const r of feedRows) {
          if (r.tier_id === tier.id && r.source_label === group.name) nextArticles.add(r.id)
        }
      }
    }
    setTierIds(nextTiers)
    setArticleIds(nextArticles)
    setTab(gKeys.size > 0 ? 'articles' : 'tiers')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ré-init à l’ouverture avec snapshot pré-remplissage
  }, [open, prefillSig, data.tiers, feedRows])

  const previewItems = useMemo(() => {
    if (tab === 'tiers') {
      return buildCollectorItemsFromTierIds(data, feedRows, tierIds, hideYoutube, language)
    }
    return buildCollectorItemsFromFeedItemIds(data, feedRows, articleIds, hideYoutube, language)
  }, [tab, data, feedRows, tierIds, articleIds, hideYoutube, language])

  const feedIdCount = countCollectorFeedIds(previewItems)
  const overLimit = feedIdCount > COLLECTOR_DOCTRINE_MAX_FEED_IDS

  const analyzeEligibleCount = useMemo(() => {
    const seen = new Set<string>()
    for (const it of previewItems) {
      if (!it.feedItemId || it.feedPending) continue
      const row = feedRows.find((r) => r.id === it.feedItemId)
      if (!row || row.url_kind === 'rss') continue
      seen.add(it.feedItemId)
    }
    return seen.size
  }, [previewItems, feedRows])

  function toggleTier(id: string) {
    setTierIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleArticle(id: string) {
    setArticleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function runAnalyze() {
    if (previewItems.length === 0 || analyzeEligibleCount === 0 || analysisBusy) return
    const snap = previewItems
    onClose()
    void onAnalyzeSelection(snap)
  }

  function openCollector() {
    if (previewItems.length === 0 || overLimit) return
    onOpenCollector(previewItems)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[190] flex items-end justify-center sm:items-center sm:p-5">
      <button type="button" aria-label={fr ? 'Fermer' : 'Close'} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="scope-gen-title"
        className="relative flex max-h-[min(90vh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-2xl sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-aigile-gold" aria-hidden />
            <span id="scope-gen-title" className="text-sm font-semibold text-foreground">
              {fr ? 'Générer les analyses' : 'Run analyses'}
            </span>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="border-b border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
          {fr
            ? 'Choisissez les paliers ou les lignes du flux du jour, puis lancez l’analyse (collecte texte / transcript). Le Collector (doctrine) reste disponible en option.'
            : 'Pick tiers or feed rows for today, then run analysis (text / transcript). Collector (doctrine) remains optional.'}
        </p>

        <div className="flex shrink-0 gap-1 border-b border-border px-4 py-2 sm:px-5">
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              tab === 'tiers' ? 'bg-aigile-gold text-black' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setTab('tiers')}
          >
            {fr ? 'Thématique complète' : 'Full tier'}
          </button>
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              tab === 'articles' ? 'bg-aigile-gold text-black' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setTab('articles')}
          >
            {fr ? 'Un ou plusieurs articles' : 'Pick articles'}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {tab === 'tiers' ? (
            <div className="space-y-6">
              <p className="text-xs text-muted-foreground">
                {fr
                  ? 'Cochez un ou plusieurs paliers pour lancer l’analyse sur toutes les lignes du flux du jour de ces thématiques (entrées RSS du digest exclues).'
                  : 'Select tiers to analyze every feed row for those themes today (digest RSS entries skipped).'}
              </p>
              {data.tiers.map((tier) => {
                const title = fr ? tier.title_fr : tier.title_en
                const tag = fr ? tier.tagline_fr : tier.tagline_en
                const on = tierIds.has(tier.id)
                const nRows = feedRows.filter((r) => r.tier_id === tier.id).length
                const nReadable = feedRows.filter((r) => r.tier_id === tier.id && intelFeedRowHasReadableBody(r)).length
                const grad = tierCoverGradientClass(tier.id)
                return (
                  <section key={tier.id} className="rounded-xl border border-border/80 bg-card/40">
                    <label className="flex cursor-pointer gap-3 p-4">
                      <input type="checkbox" className="mt-1 h-4 w-4 accent-aigile-gold" checked={on} onChange={() => toggleTier(tier.id)} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              'rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground',
                              grad.includes('gold') && 'border-aigile-gold/40 text-aigile-gold',
                            )}
                          >
                            {tier.rank}
                          </span>
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                          <span className="font-semibold text-foreground">{title}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{tag}</p>
                        <p className="mt-2 text-[11px] text-muted-foreground/90">
                          {fr
                            ? `${nReadable} analyse(s) avec texte exploitable · ${nRows} ligne(s) flux`
                            : `${nReadable} entries with body · ${nRows} feed row(s)`}
                        </p>
                      </div>
                    </label>
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xs text-muted-foreground">
                {fr
                  ? 'Cochez des lignes précises. Les cartes « + » peuvent pré-remplir la liste. Le badge « texte OK » indique déjà un corps exploitable.'
                  : 'Pick specific rows. Card quick-selection can pre-fill. « Body OK » means content already meets the readable threshold.'}
              </p>
              {data.tiers.map((tier) => {
                const title = fr ? tier.title_fr : tier.title_en
                const tierReadable = feedRows.filter((r) => r.tier_id === tier.id && intelFeedRowHasReadableBody(r)).length
                const tierRows = feedRows.filter((r) => r.tier_id === tier.id).length
                return (
                  <section key={tier.id} className="rounded-xl border border-border/80 bg-card/30">
                    <div className="border-b border-border/60 bg-muted/25 px-3 py-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{tier.rank}</span>
                      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {fr
                          ? `${tierReadable} avec texte · ${tierRows} ligne(s)`
                          : `${tierReadable} with body · ${tierRows} row(s)`}
                      </p>
                    </div>
                    <div className="divide-y divide-border/50">
                      {tier.groups.map((group) => {
                        const rows = feedRows.filter((r) => r.tier_id === tier.id && r.source_label === group.name)
                        if (rows.length === 0) {
                          return (
                            <div key={group.name} className="px-3 py-3">
                              <p className="text-xs font-medium text-foreground">{group.name}</p>
                              <p className="mt-1 text-[11px] text-amber-600/90 dark:text-amber-400/90">
                                {fr ? 'Pas encore dans le flux — synchronisez.' : 'Not on feed yet — run sync.'}
                              </p>
                            </div>
                          )
                        }
                        return (
                          <div key={group.name} className="px-3 py-2">
                            <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-foreground">
                              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
                              {group.name}
                            </p>
                            <ul className="space-y-1.5 pl-1">
                              {rows.map((r) => {
                                const checked = articleIds.has(r.id)
                                const label = r.summary?.trim() || r.preview_snippet?.trim() || r.url
                                const hasBody = intelFeedRowHasReadableBody(r)
                                return (
                                  <li key={r.id}>
                                    <label className="flex cursor-pointer gap-2 rounded-lg border border-transparent px-2 py-1.5 hover:border-border hover:bg-muted/30">
                                      <input
                                        type="checkbox"
                                        className="mt-0.5 h-4 w-4 shrink-0 accent-aigile-gold"
                                        checked={checked}
                                        onChange={() => toggleArticle(r.id)}
                                      />
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-[11px] font-medium text-aigile-gold">{r.url}</p>
                                        <p className="line-clamp-2 text-[11px] text-muted-foreground">{label}</p>
                                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                                          {r.url_kind} · {fr ? 'vitalité' : 'vitality'} {Math.round(r.vitality_score)} · {r.status}
                                          {hasBody ? (
                                            <span className="ml-1 rounded bg-emerald-500/15 px-1 py-px text-emerald-700 dark:text-emerald-400">
                                              {fr ? 'texte OK' : 'body OK'}
                                            </span>
                                          ) : null}
                                        </p>
                                      </div>
                                    </label>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-muted/20 px-4 py-4 sm:px-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground">
              {fr ? 'Sélection :' : 'Selection:'}{' '}
              <strong className="text-foreground">{previewItems.length}</strong>
              {' · '}
              {fr ? 'sources analysables (hors RSS) :' : 'analyzable (non-RSS):'}{' '}
              <strong className="text-foreground">{analyzeEligibleCount}</strong>
              {' · '}
              {fr ? 'IDs doctrine (max' : 'Doctrine IDs (max'}{' '}
              <strong className={cn(overLimit && 'text-red-500')}>{feedIdCount}</strong>
              {fr ? ` / ${COLLECTOR_DOCTRINE_MAX_FEED_IDS})` : ` / ${COLLECTOR_DOCTRINE_MAX_FEED_IDS})`}
            </span>
          </div>
          {overLimit ? (
            <p className="mb-3 text-xs font-medium text-amber-600 dark:text-amber-500">
              {fr
                ? `Doctrine IA : max ${COLLECTOR_DOCTRINE_MAX_FEED_IDS} lignes avec ID — réduisez la sélection pour ouvrir le Collector.`
                : `AI doctrine: max ${COLLECTOR_DOCTRINE_MAX_FEED_IDS} feed-backed rows — narrow selection for Collector.`}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted" onClick={onClose}>
              {fr ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="button"
              disabled={previewItems.length === 0 || analyzeEligibleCount === 0 || analysisBusy}
              onClick={runAnalyze}
              className="inline-flex items-center gap-2 rounded-full bg-aigile-gold px-5 py-2 text-sm font-semibold text-black hover:bg-aigile-gold/90 disabled:pointer-events-none disabled:opacity-40"
            >
              {fr ? 'Lancer les analyses' : 'Run analyses'}
            </button>
            <button
              type="button"
              disabled={previewItems.length === 0 || overLimit}
              onClick={openCollector}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              {fr ? 'Collector (doctrine)' : 'Collector (doctrine)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
