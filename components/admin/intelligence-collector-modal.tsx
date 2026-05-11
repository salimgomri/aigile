'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, Check, ClipboardCopy, Loader2, Send, Sparkles, X } from 'lucide-react'
import { Literata } from 'next/font/google'

import type { CollectorItem } from '@/lib/intelligence/collector-format'
import {
  buildDailyDoctrineHeuristic,
  formatSmartCopyForGpt,
  humanTimeNow,
  keyPointsForSmartCopy,
} from '@/lib/intelligence/collector-format'
import { cn } from '@/lib/utils'
import { playCollectorCopyBurst } from '@/components/admin/collector-copy-burst'

const readerSerif = Literata({
  subsets: ['latin'],
  display: 'swap',
})

type Props = {
  open: boolean
  onClose: () => void
  items: CollectorItem[]
  language: 'fr' | 'en'
}

function CollectorReaderBlock({ item, lang }: { item: CollectorItem; lang: 'fr' | 'en' }) {
  const rawBody = (item.content ?? '').trim()
  const fallbackSnippet = (item.summary ?? '').trim()
  const displayBody =
    rawBody.length >= 40 ? rawBody : rawBody.length > 0 ? rawBody : fallbackSnippet

  const showSkeleton =
    !displayBody &&
    (item.feedPending || item.feedStatus === 'pending' || item.feedStatus === 'analyzing')

  const bullets = keyPointsForSmartCopy(item, lang)

  const charterStack = {
    fontFamily: `Charter, 'Bitstream Charter', ${readerSerif.style.fontFamily}, Georgia, serif`,
  } as const

  const linkUrls = item.primaryUrl ? [{ href: item.primaryUrl }] : item.urls

  const emptyHint =
    lang === 'fr'
      ? 'Aucun texte brut stocké : dans le flux Intelligence, cliquez « Analyser » sur cette URL (Web = extraction HTML, YouTube = transcript).'
      : 'No stored raw text: open the Intelligence feed and click Analyze for this URL (Web = HTML extract, YouTube = transcript).'

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 px-4 py-4 shadow-sm">
      <p className="font-semibold text-foreground">{item.groupName}</p>
      {typeof item.vitality_score === 'number' && Number.isFinite(item.vitality_score) ? (
        <p className="mt-1 text-[11px] text-muted-foreground/90">
          {lang === 'fr' ? 'Vitalité' : 'Vitality'} · {Math.round(item.vitality_score)} ·{' '}
          {item.feedStatus ?? '—'}
        </p>
      ) : null}

      <p className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {lang === 'fr' ? 'Points clés (aperçu)' : 'Key points (preview)'}
      </p>
      <ul
        className={cn(
          readerSerif.className,
          'mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/95',
        )}
        style={charterStack}
      >
        {bullets.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {lang === 'fr' ? 'Texte brut (article ou transcript)' : 'Raw text (article or transcript)'}
      </p>
      {displayBody ? (
        <div
          className={cn(
            readerSerif.className,
            'max-h-[min(480px,52vh)] overflow-y-auto whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/95',
          )}
          style={charterStack}
        >
          {displayBody}
        </div>
      ) : showSkeleton ? (
        <div className="space-y-2 pt-1" aria-busy="true">
          <div className="h-3 w-full animate-pulse rounded bg-muted/45" />
          <div className="h-3 w-[92%] animate-pulse rounded bg-muted/35" />
          <p className="text-xs text-muted-foreground">
            {lang === 'fr' ? 'Collecte ou analyse en cours…' : 'Fetching or analyzing…'}
          </p>
        </div>
      ) : (
        <p className={cn(readerSerif.className, 'text-sm text-amber-200/90')} style={charterStack}>
          {emptyHint}
        </p>
      )}

      <ul className="mt-4 space-y-1.5 border-t border-border/40 pt-3">
        {linkUrls.map((u) => (
          <li key={u.href}>
            <a
              href={u.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                readerSerif.className,
                'break-all text-sm text-aigile-gold underline-offset-2 hover:underline',
              )}
              style={charterStack}
            >
              {u.href}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function IntelligenceCollectorModal({ open, onClose, items, language }: Props) {
  const lang = language === 'fr' ? 'fr' : 'en'
  const copyBtnRef = useRef<HTMLButtonElement>(null)
  const [copied, setCopied] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [exportMsg, setExportMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [doctrineLoading, setDoctrineLoading] = useState(false)
  const [doctrineText, setDoctrineText] = useState('')
  const [doctrineSource, setDoctrineSource] = useState<'openai' | 'anthropic' | 'heuristic' | null>(null)

  const grouped = useMemo(() => {
    const order: string[] = []
    const map = new Map<string, CollectorItem[]>()
    for (const it of items) {
      if (!map.has(it.tierTitle)) order.push(it.tierTitle)
      const arr = map.get(it.tierTitle) ?? []
      arr.push(it)
      map.set(it.tierTitle, arr)
    }
    return { order, map }
  }, [items])

  useEffect(() => {
    if (!open) {
      setCopied(false)
      setExportLoading(false)
      setExportMsg(null)
      setDoctrineLoading(false)
      setDoctrineText('')
      setDoctrineSource(null)
      return
    }

    const heuristic = buildDailyDoctrineHeuristic(items, lang)
    const ids = items.map((i) => i.feedItemId).filter((x): x is string => !!x)

    if (ids.length === 0) {
      setDoctrineText(heuristic)
      setDoctrineSource('heuristic')
      return
    }

    let cancelled = false
    setDoctrineLoading(true)
    void (async () => {
      try {
        const res = await fetch('/api/admin/intelligence/collector/doctrine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemIds: ids, lang }),
        })
        if (!res.ok) {
          if (!cancelled) {
            setDoctrineText(heuristic)
            setDoctrineSource('heuristic')
          }
          return
        }
        const data = (await res.json()) as { doctrine?: string; source?: string }
        if (cancelled) return
        setDoctrineText(data.doctrine ?? heuristic)
        setDoctrineSource(
          data.source === 'openai' || data.source === 'anthropic' || data.source === 'heuristic'
            ? data.source
            : 'heuristic',
        )
      } catch {
        if (!cancelled) {
          setDoctrineText(heuristic)
          setDoctrineSource('heuristic')
        }
      } finally {
        if (!cancelled) setDoctrineLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [open, items, lang])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const copyGpt = useCallback(async () => {
    const doctrine =
      doctrineText.trim().length > 0 ? doctrineText : buildDailyDoctrineHeuristic(items, lang)
    const text = formatSmartCopyForGpt(items, lang, doctrine)
    try {
      await navigator.clipboard.writeText(text)
      playCollectorCopyBurst(copyBtnRef.current)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }, [items, lang, doctrineText])

  const sendFutureSelf = useCallback(async () => {
    const doctrine =
      doctrineText.trim().length > 0 ? doctrineText : buildDailyDoctrineHeuristic(items, lang)
    const smartCopy = formatSmartCopyForGpt(items, lang, doctrine)
    setExportLoading(true)
    setExportMsg(null)
    try {
      const res = await fetch('/api/admin/intelligence/collector/export', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctrine, smartCopy, lang }),
      })
      let data: { ok?: boolean; errors?: string[]; error?: string } = {}
      try {
        data = (await res.json()) as typeof data
      } catch {
        /* ignore */
      }
      if (!res.ok) {
        const errText = Array.isArray(data.errors)
          ? data.errors.join(' ')
          : typeof data.error === 'string'
            ? data.error
            : `${res.status}`
        setExportMsg({ type: 'err', text: errText })
        return
      }
      setExportMsg({
        type: 'ok',
        text:
          lang === 'fr'
            ? 'Envoyé vers votre webhook (Notion/Slack selon config serveur).'
            : 'Sent to your webhook (Notion/Slack per server config).',
      })
    } catch {
      setExportMsg({
        type: 'err',
        text: lang === 'fr' ? 'Échec réseau.' : 'Network error.',
      })
    } finally {
      setExportLoading(false)
    }
  }, [items, lang, doctrineText])

  if (!open) return null

  const doctrineTitle = lang === 'fr' ? 'Doctrine du jour' : 'Daily doctrine'
  const subtitle =
    lang === 'fr'
      ? 'Synthèse à partir des contenus sélectionnés (IA si clés API configurées).'
      : 'Synthesis from selected content (AI when API keys are set).'

  const humanLabel = humanTimeNow(lang)

  const sourceBadge =
    doctrineSource === 'openai' || doctrineSource === 'anthropic'
      ? lang === 'fr'
        ? ' · IA'
        : ' · AI'
      : ''

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={lang === 'fr' ? 'Fermer le collector' : 'Close collector'}
        className="absolute inset-0 bg-black/45 backdrop-blur-[20px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="collector-doctrine-title"
        className="relative flex max-h-[min(92vh,920px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-gradient-to-b from-zinc-950/98 via-background to-background shadow-[0_-12px_60px_rgba(0,0,0,0.55)] sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-aigile-gold" aria-hidden />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              {lang === 'fr' ? 'Collector Intelligence' : 'Intelligence Collector'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="shrink-0 bg-gradient-to-r from-amber-950/50 via-zinc-900/80 to-emerald-950/35 px-5 py-5">
          <p
            id="collector-doctrine-title"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-aigile-gold/90"
          >
            {doctrineTitle}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>
          <div className="relative mt-4 min-h-[3rem]">
            {doctrineLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-aigile-gold" aria-hidden />
                <span className="text-sm">
                  {lang === 'fr' ? 'Génération de la doctrine…' : 'Generating doctrine…'}
                </span>
              </div>
            ) : (
              <p
                className={cn(
                  readerSerif.className,
                  'text-lg font-medium leading-snug text-foreground sm:text-xl',
                )}
                style={{
                  fontFamily: `Charter, 'Bitstream Charter', ${readerSerif.style.fontFamily}, Georgia, serif`,
                }}
              >
                {doctrineText}
                <span className="text-xs font-normal text-muted-foreground">{sourceBadge}</span>
              </p>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground/90">{humanLabel}</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                ref={copyBtnRef}
                type="button"
                onClick={() => void copyGpt()}
                className="inline-flex items-center gap-2 rounded-full border border-aigile-gold/45 bg-aigile-gold/10 px-4 py-2 text-sm font-medium text-aigile-gold transition-colors hover:bg-aigile-gold/15"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden />
                ) : (
                  <ClipboardCopy className="h-4 w-4" aria-hidden />
                )}
                {lang === 'fr' ? 'Copier pour GPT' : 'Copy for GPT'}
              </button>
              <button
                type="button"
                disabled={exportLoading || items.length === 0}
                onClick={() => void sendFutureSelf()}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-500/15 disabled:pointer-events-none disabled:opacity-45',
                )}
              >
                {exportLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-300" aria-hidden />
                ) : (
                  <Send className="h-4 w-4 text-emerald-300" aria-hidden />
                )}
                {lang === 'fr' ? 'Envoyer à mon futur moi' : 'Send to my future self'}
              </button>
              <span className="text-xs text-muted-foreground">
                {lang === 'fr'
                  ? 'Format copie : [Source] | Heure humaine | Points clés · Webhook : INTEL_EXPORT_WEBHOOK_URL / INTEL_SLACK_WEBHOOK_URL.'
                  : 'Copy format: [Source] | Human time | Key points · Webhooks: INTEL_EXPORT_WEBHOOK_URL / INTEL_SLACK_WEBHOOK_URL.'}
              </span>
            </div>
            {exportMsg ? (
              <p
                className={cn(
                  'text-xs',
                  exportMsg.type === 'ok' ? 'text-emerald-400/95' : 'text-red-400/95',
                )}
                role="status"
              >
                {exportMsg.text}
              </p>
            ) : null}
          </div>

          {grouped.order.map((tierTitle) => (
            <section key={tierTitle} className="mb-8 last:mb-2">
              <div className="mb-3 flex items-center gap-2 border-b border-border/50 pb-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden />
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{tierTitle}</h3>
              </div>
              <div className="space-y-4">
                {(grouped.map.get(tierTitle) ?? []).map((item) => {
                  const key = item.feedItemId ?? `${item.tierId}:::${item.groupName}:::${item.primaryUrl ?? ''}`
                  return <CollectorReaderBlock key={key} item={item} lang={lang} />
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
