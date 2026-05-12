'use client'

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { BookMarked, CalendarRange, Check, Copy, Download, X } from 'lucide-react'

import { useLanguage } from '@/components/language-provider'
import type { IntelligenceTier } from '@/lib/intelligence/types'
import { cn } from '@/lib/utils'

type FeedItem = {
  id: string
  tier_id: string
  source_label: string
  url: string
  url_kind: string
  status: 'pending' | 'analyzing' | 'ready' | 'error'
  content?: string | null
  transcript_text?: string | null
  rotation_day?: string | null
}

type FeedPayloadDay = {
  items: FeedItem[]
}

type FeedPayloadWeek = {
  rotationDaysQueried: string[]
  items: FeedItem[]
}

export type IntelligenceImmersiveMode = 'singleDay' | 'rollingWeek'

export type IntelligenceImmersiveTriggerLabels = { fr: string; en: string }

type Props = {
  tiers: IntelligenceTier[]
  mode?: IntelligenceImmersiveMode
  rotationDay?: string
  /** Fenêtre glissante en jours UTC si mode === rollingWeek */
  weekDays?: number
  triggerLabel?: IntelligenceImmersiveTriggerLabels
}

function primaryBody(item: FeedItem): string {
  const c = (item.content ?? '').trim()
  if (c.length > 0) return c
  return (item.transcript_text ?? '').trim()
}

function tierChipLabel(tier: IntelligenceTier, lang: 'fr' | 'en'): string {
  const raw = lang === 'fr' ? tier.title_fr : tier.title_en
  const seg = raw.split(/[—–-]/)[0]?.trim() ?? raw
  return seg.length > 30 ? `${seg.slice(0, 28)}…` : seg
}

function splitReadingBody(text: string): string[] {
  const n = text.replace(/\r\n/g, '\n').trim()
  if (!n) return []
  const blocks = n
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (blocks.length > 1) return blocks
  return n
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function utcRangeLabel(daysIso: string[]): string {
  const u = [...new Set(daysIso)].filter(Boolean).sort()
  if (u.length === 0) return ''
  if (u.length === 1) return u[0]!
  return `${u[0]} → ${u[u.length - 1]}`
}

export function IntelligenceImmersiveReader({
  tiers,
  mode = 'singleDay',
  rotationDay,
  weekDays = 7,
  triggerLabel,
}: Props) {
  const { language } = useLanguage()
  const langUi = language === 'fr' ? 'fr' : 'en'
  const fr = langUi === 'fr'

  const isWeek = mode === 'rollingWeek'

  const defaultTrigger = isWeek
    ? { fr: 'Récap 7 jours (immersif)', en: '7-day recap (immersive)' }
    : { fr: 'Tout lire (immersif)', en: 'Read all (immersive)' }

  const labelOpen = triggerLabel ?? defaultTrigger

  const [mounted, setMounted] = useState(false)
  const exitingRef = useRef(false)
  const shellRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<FeedItem[]>([])
  const [fetchErr, setFetchErr] = useState<string | null>(null)
  const [weekUtcRange, setWeekUtcRange] = useState<string | null>(null)
  const [includedTierIds, setIncludedTierIds] = useState<Set<string>>(() => new Set(tiers.map((t) => t.id)))
  const [copied, setCopied] = useState(false)

  const tierMeta = useMemo(() => {
    const m = new Map<string, IntelligenceTier>()
    for (const t of tiers) m.set(t.id, t)
    return m
  }, [tiers])

  const loadFeed = useCallback(async () => {
    setLoading(true)
    setFetchErr(null)
    setWeekUtcRange(null)
    try {
      if (isWeek) {
        const d = Math.min(Math.max(weekDays, 1), 31)
        const res = await fetch(`/api/admin/intelligence/feed/weekly-recap?days=${d}`)
        if (!res.ok) {
          setFetchErr(fr ? 'Récap indisponible.' : 'Weekly recap unavailable.')
          setItems([])
          return
        }
        const json = (await res.json()) as FeedPayloadWeek
        setItems(json.items ?? [])
        setWeekUtcRange(utcRangeLabel(json.rotationDaysQueried ?? []))
        return
      }

      if (!rotationDay) {
        setFetchErr(fr ? 'Jour manquant.' : 'Missing day.')
        setItems([])
        return
      }

      const q = encodeURIComponent(rotationDay)
      const res = await fetch(`/api/admin/intelligence/feed?rotationDay=${q}`)
      if (!res.ok) {
        setFetchErr(fr ? 'Flux inaccessible.' : 'Feed unavailable.')
        setItems([])
        return
      }
      const json = (await res.json()) as FeedPayloadDay
      setItems(json.items ?? [])
    } catch {
      setFetchErr(fr ? 'Erreur réseau.' : 'Network error.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [fr, isWeek, rotationDay, weekDays])

  const closeWithAnimation = useCallback(() => {
    if (exitingRef.current) return
    const shell = shellRef.current
    exitingRef.current = true

    const finish = () => {
      exitingRef.current = false
      setMounted(false)
    }

    if (!shell) {
      finish()
      return
    }

    const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (mq?.matches) {
      finish()
      return
    }

    try {
      gsap.to(shell, {
        opacity: 0,
        y: 14,
        duration: 0.38,
        ease: 'power3.in',
        onComplete: finish,
      })
    } catch {
      finish()
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    void loadFeed()
  }, [mounted, loadFeed])

  useEffect(() => {
    if (!mounted) return
    setIncludedTierIds(new Set(tiers.map((t) => t.id)))
  }, [mounted, tiers])

  useEffect(() => {
    if (!mounted || typeof document === 'undefined') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWithAnimation()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, closeWithAnimation])

  useLayoutEffect(() => {
    if (!mounted) return
    const shell = shellRef.current
    if (!shell) return

    const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (mq?.matches) {
      gsap.set(shell, { opacity: 1, y: 0 })
      return
    }

    try {
      gsap.fromTo(
        shell,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      )
    } catch {
      gsap.set(shell, { opacity: 1, y: 0 })
    }
  }, [mounted])

  type ReaderBlock = {
    id: string
    tierId: string
    tierLabel: string
    sourceLabel: string
    url: string
    body: string
    rotationUtc: string | null
  }

  const blocks = useMemo((): ReaderBlock[] => {
    const out: ReaderBlock[] = []

    for (const item of items) {
      if (item.status !== 'ready') continue
      if (!includedTierIds.has(item.tier_id)) continue
      const body = primaryBody(item)
      if (body.length < 1) continue
      const tier = tierMeta.get(item.tier_id)
      const tierLabel = tier ? tierChipLabel(tier, langUi) : item.tier_id.replace(/_/g, ' ')
      const rotationUtc = item.rotation_day?.trim() || null
      out.push({
        id: item.id,
        tierId: item.tier_id,
        tierLabel,
        sourceLabel: item.source_label,
        url: item.url,
        body,
        rotationUtc,
      })
    }
    return out
  }, [items, includedTierIds, tierMeta, langUi])

  const concatenated = useMemo(() => {
    const sep = `\n\n${fr ? '―' : '—'}\n\n`
    return blocks
      .map((b) => {
        const dayLine =
          isWeek && b.rotationUtc ? `${fr ? 'Jour UTC' : 'UTC day'} ${b.rotationUtc}\n` : ''
        return `${dayLine}${b.tierLabel} · ${b.sourceLabel}\n${b.url}\n\n${b.body}`
      })
      .join(sep)
  }, [blocks, fr, isWeek])

  useLayoutEffect(() => {
    if (!mounted || loading || fetchErr) return
    const root = scrollAreaRef.current
    if (!root) return
    const arts = root.querySelectorAll('article')
    if (!arts.length) return

    const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (mq?.matches) {
      gsap.set(arts, { opacity: 1, y: 0 })
      return
    }
    try {
      gsap.killTweensOf(arts)
      gsap.fromTo(
        arts,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.48,
          stagger: 0.055,
          ease: 'power2.out',
          delay: 0.06,
        },
      )
    } catch {
      gsap.set(arts, { opacity: 1, y: 0 })
    }
  }, [mounted, loading, fetchErr, blocks])

  const toggleTier = (tierId: string) => {
    setIncludedTierIds((prev) => {
      const next = new Set(prev)
      if (next.has(tierId)) next.delete(tierId)
      else next.add(tierId)
      return next
    })
  }

  const selectAllTiers = () => setIncludedTierIds(new Set(tiers.map((t) => t.id)))

  const copyText = async () => {
    if (!concatenated.length) return
    try {
      await navigator.clipboard.writeText(concatenated)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const downloadTxt = () => {
    if (!concatenated.length) return
    const blob = new Blob([concatenated], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = isWeek ? (weekUtcRange?.replace(/\s/g, '') ?? `rolling-${weekDays}d`) : (rotationDay ?? 'day')
    a.href = url
    a.download = `aigile-intelligence-${isWeek ? 'recap' : 'jour'}_${stamp}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const open = () => {
    exitingRef.current = false
    setMounted(true)
  }

  const subtitlePrimary = isWeek
    ? `${fr ? 'Fenêtre UTC' : 'UTC window'} (${weekDays}j)${weekUtcRange ? ` · ${weekUtcRange}` : ''}`
    : `${fr ? 'Jour UTC' : 'UTC day'} · ${rotationDay ?? '—'}`

  const portal =
    mounted && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={shellRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="intel-immersive-title"
            className={cn(
              'fixed inset-0 z-[10025] flex flex-col bg-[#080809]',
              'font-[system-ui,-apple-system,BlinkMacSystemFont,"Segoe_UI",sans-serif]',
            )}
          >
            <header className="sticky top-0 z-20 shrink-0 border-b border-white/[0.08] bg-[#080809]/95 backdrop-blur-md">
              <div className="mx-auto flex w-full max-w-6xl flex-wrap items-start gap-3 px-4 py-3 sm:items-center sm:gap-4 sm:px-6">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  {isWeek ? (
                    <CalendarRange className="mt-0.5 h-6 w-6 shrink-0 text-[#d4b96a]" aria-hidden />
                  ) : (
                    <BookMarked className="mt-0.5 h-6 w-6 shrink-0 text-[#d4b96a]" aria-hidden />
                  )}
                  <div className="min-w-0">
                    <h2
                      id="intel-immersive-title"
                      className="text-[17px] font-semibold tracking-[-0.02em] text-white"
                    >
                      {isWeek
                        ? fr
                          ? 'Récap hebdomadaire — lecture immersive'
                          : 'Weekly recap — immersive reading'
                        : fr
                          ? 'Lecture immersive'
                          : 'Immersive reading'}
                    </h2>
                    <p className="mt-0.5 text-[12px] font-medium tracking-wide text-white/45">
                      <span className="font-mono text-white/65">{subtitlePrimary}</span>
                      {loading ? ` · ${fr ? 'chargement…' : 'loading…'}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void copyText()}
                    disabled={!concatenated.length}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/[0.07] px-3 py-2 text-[12px] font-semibold text-white/92 transition-colors hover:bg-white/[0.11] disabled:pointer-events-none disabled:opacity-35"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {copied ? (fr ? 'Copié' : 'Copied') : fr ? 'Copier tout' : 'Copy all'}
                  </button>
                  <button
                    type="button"
                    onClick={downloadTxt}
                    disabled={!concatenated.length}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/[0.05] px-3 py-2 text-[12px] font-semibold text-white/85 transition-colors hover:bg-white/[0.09] disabled:pointer-events-none disabled:opacity-35"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden />
                    {fr ? 'Télécharger .txt' : 'Download .txt'}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeWithAnimation()}
                    className="rounded-full border border-white/15 p-2 text-white/60 transition-colors hover:border-[#c9a73a]/40 hover:bg-white/[0.06] hover:text-white"
                    aria-label={fr ? 'Quitter le mode lecture' : 'Exit reading mode'}
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>

              <div className="mx-auto w-full max-w-6xl border-t border-white/[0.05] px-4 py-3 sm:px-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    {fr ? 'Sections' : 'Sections'}
                  </span>
                  {tiers.map((t) => {
                    const on = includedTierIds.has(t.id)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTier(t.id)}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-200',
                          on
                            ? 'border-[#c9a73a]/55 bg-[#c9a73a]/14 text-[#f0e6c8]'
                            : 'border-white/12 bg-transparent text-white/45 hover:border-white/25 hover:text-white/75',
                        )}
                      >
                        {tierChipLabel(t, langUi)}
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    onClick={selectAllTiers}
                    className="rounded-full border border-dashed border-white/18 px-2.5 py-1 text-[11px] text-white/50 hover:border-[#c9a73a]/35 hover:text-[#e8d9a8]"
                  >
                    {fr ? 'Tout' : 'All'}
                  </button>
                </div>
              </div>
            </header>

            <div
              ref={scrollAreaRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-8 sm:px-8"
            >
              <div className="mx-auto max-w-[min(100%,52rem)] pb-24">
                {fetchErr ? (
                  <p className="text-center text-sm text-red-300/90">{fetchErr}</p>
                ) : includedTierIds.size === 0 ? (
                  <p className="text-center text-sm text-white/50">
                    {fr ? 'Choisis au moins une section.' : 'Pick at least one section.'}
                  </p>
                ) : blocks.length === 0 ? (
                  <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-white/50">
                    {fr
                      ? isWeek
                        ? 'Aucun texte « prêt » sur cette fenêtre UTC pour les paliers sélectionnés. Vérifie les jours de rotation avec du contenu analysé.'
                        : 'Aucun texte « prêt » pour les sections sélectionnées ce jour-là. Lance une synchronisation ou des analyses, puis réessaie.'
                      : isWeek
                        ? 'No ready text in this UTC window for the selected tiers. Ensure analyzed content exists for recent rotation days.'
                        : 'No ready text for the selected sections on this day. Run sync or analyses, then try again.'}
                  </p>
                ) : (
                  <div className="space-y-12 font-[ui-serif,Georgia,Cambria,'Times_New_Roman',serif]">
                    {blocks.map((b, i) => {
                      const paras = splitReadingBody(b.body)
                      const showDayBand =
                        isWeek &&
                        b.rotationUtc &&
                        (i === 0 || blocks[i - 1]?.rotationUtc !== b.rotationUtc)
                      return (
                        <Fragment key={b.id}>
                          {showDayBand ? (
                            <div className="sticky top-0 z-10 -mx-1 mb-2 border-y border-[#c9a73a]/25 bg-[#121214]/95 px-3 py-2 backdrop-blur-sm">
                              <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4b96a]/95">
                                {fr ? 'Jour UTC' : 'UTC day'} ·{' '}
                                <span className="font-mono">{b.rotationUtc}</span>
                              </p>
                            </div>
                          ) : null}
                          <article className="border-b border-white/[0.06] pb-12 last:border-b-0">
                            <header className="mb-5">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9a73a]/85">
                                {b.tierLabel}
                              </p>
                              <h3 className="mt-1 text-[21px] font-semibold leading-snug tracking-[-0.02em] text-white">
                                {b.sourceLabel}
                              </h3>
                              <a
                                href={b.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block max-w-full break-all text-[13px] text-[#9ab8ff] underline-offset-2 hover:underline"
                              >
                                {b.url}
                              </a>
                            </header>
                            <div className="space-y-4 text-[17px] leading-[1.75] text-[#eae8e5]">
                              {paras.map((p, j) => (
                                <p key={j}>{p}</p>
                              ))}
                            </div>
                          </article>
                        </Fragment>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <footer className="shrink-0 border-t border-white/[0.07] bg-[#060607]/98 px-4 py-4">
              <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <p className="text-center text-[11px] text-white/38">
                  {fr
                    ? 'Combine les entrées « prêt » avec corps texte. Export .txt pour archiver ta veille hebdomadaire.'
                    : 'Combines ready rows with body text. Use .txt export to archive your weekly digest.'}
                </p>
                <button
                  type="button"
                  onClick={() => closeWithAnimation()}
                  className="text-[13px] font-semibold text-[#c9a73a] underline-offset-4 hover:underline"
                >
                  {fr ? '← Quitter le mode immersif' : '← Exit immersive mode'}
                </button>
              </div>
            </footer>
          </div>,
          document.body,
        )
      : null

  const TriggerIcon = isWeek ? CalendarRange : BookMarked

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border border-[#c9a73a]/45 bg-[#c9a73a]/12 px-4 py-2.5 text-sm font-semibold text-[#e8d9a8]',
          'transition-all hover:border-[#c9a73a]/65 hover:bg-[#c9a73a]/18',
        )}
      >
        <TriggerIcon className="h-4 w-4 shrink-0" aria-hidden />
        {langUi === 'fr' ? labelOpen.fr : labelOpen.en}
      </button>
      {portal}
    </>
  )
}
