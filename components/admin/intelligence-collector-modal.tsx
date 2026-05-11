'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { BookOpen, Check, ChevronDown, ClipboardCopy, Sparkles, X } from 'lucide-react'
import { Literata } from 'next/font/google'

import type { CollectorItem } from '@/lib/intelligence/collector-format'
import { buildDailyDoctrine, formatSmartCopyForGpt, humanTimeNow } from '@/lib/intelligence/collector-format'
import { getCollectorTheme } from '@/lib/intelligence/collector-themes'
import { cn } from '@/lib/utils'

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

function CollectorReaderSection({
  item,
  lang,
  expanded,
  onToggle,
}: {
  item: CollectorItem
  lang: 'fr' | 'en'
  expanded: boolean
  onToggle: () => void
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const openedOnce = useRef(false)
  const theme = getCollectorTheme(item.groupName)
  const thesis = lang === 'fr' ? theme.thesisFr : theme.thesisEn
  const keys = lang === 'fr' ? theme.keyPointsFr : theme.keyPointsEn

  useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return

    const mq =
      typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (mq?.matches) {
      el.style.overflow = 'hidden'
      el.style.height = expanded ? 'auto' : '0px'
      el.style.opacity = expanded ? '1' : '0'
      return
    }

    gsap.killTweensOf(el)
    el.style.overflow = 'hidden'

    if (!openedOnce.current) {
      openedOnce.current = true
      gsap.set(el, { height: 0, opacity: 0 })
      return
    }

    if (expanded) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' },
      )
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: 'power2.in' })
    }
  }, [expanded])

  const charterStack = {
    fontFamily: `Charter, 'Bitstream Charter', ${readerSerif.style.fontFamily}, Georgia, serif`,
  } as const

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 px-4 py-3 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{item.groupName}</p>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{thesis}</p>
        </div>
        <ChevronDown
          className={cn(
            'mt-1 h-5 w-5 shrink-0 text-aigile-gold transition-transform duration-300',
            expanded && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      <div ref={innerRef}>
        <div className="mt-4 border-t border-border/50 pt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {lang === 'fr' ? 'Points clés (mode lecture)' : 'Key points (reader mode)'}
          </p>
          <ul
            className={cn(
              readerSerif.className,
              'list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/95',
            )}
            style={charterStack}
          >
            {keys.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <ul className="mt-4 space-y-1.5">
            {item.urls.map((u) => (
              <li key={u.href}>
                <a
                  href={u.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    readerSerif.className,
                    'text-sm text-aigile-gold underline-offset-2 hover:underline',
                  )}
                  style={charterStack}
                >
                  {u.href}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function IntelligenceCollectorModal({ open, onClose, items, language }: Props) {
  const lang = language === 'fr' ? 'fr' : 'en'
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const doctrine = useMemo(() => buildDailyDoctrine(items, lang), [items, lang])

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
      setExpandedKey(null)
      setCopied(false)
    }
  }, [open])

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
    const text = formatSmartCopyForGpt(items, lang)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }, [items, lang])

  if (!open) return null

  const doctrineTitle = lang === 'fr' ? 'Doctrine du jour' : 'Daily doctrine'
  const subtitle =
    lang === 'fr'
      ? 'Synthèse Steve Jobs — une phrase pour orienter la journée.'
      : 'Steve Jobs-style synthesis — one line to steer the day.'

  const humanLabel = humanTimeNow(lang)

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
          <p
            className={cn(
              readerSerif.className,
              'mt-4 text-lg font-medium leading-snug text-foreground sm:text-xl',
            )}
            style={{
              fontFamily: `Charter, 'Bitstream Charter', ${readerSerif.style.fontFamily}, Georgia, serif`,
            }}
          >
            {doctrine}
          </p>
          <p className="mt-3 text-xs text-muted-foreground/90">{humanLabel}</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
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
            <span className="text-xs text-muted-foreground">
              {lang === 'fr'
                ? 'Format : [Source] | Heure humaine | Points clés'
                : 'Format: [Source] | Human time | Key points'}
            </span>
          </div>

          {grouped.order.map((tierTitle) => (
            <section key={tierTitle} className="mb-8 last:mb-2">
              <div className="mb-3 flex items-center gap-2 border-b border-border/50 pb-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden />
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{tierTitle}</h3>
              </div>
              <div className="space-y-3">
                {(grouped.map.get(tierTitle) ?? []).map((item) => {
                  const key = `${item.tierId}:::${item.groupName}`
                  const ex = expandedKey === key
                  return (
                    <CollectorReaderSection
                      key={key}
                      item={item}
                      lang={lang}
                      expanded={ex}
                      onToggle={() => setExpandedKey((prev) => (prev === key ? null : key))}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
