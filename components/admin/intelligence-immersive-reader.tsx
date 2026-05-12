'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { BookMarked, Check, Copy, X } from 'lucide-react'

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
}

type FeedPayload = {
  items: FeedItem[]
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

type Props = {
  rotationDay: string
  tiers: IntelligenceTier[]
}

export function IntelligenceImmersiveReader({ rotationDay, tiers }: Props) {
  const { language } = useLanguage()
  const langUi = language === 'fr' ? 'fr' : 'en'
  const fr = langUi === 'fr'

  const [mounted, setMounted] = useState(false)
  const exitingRef = useRef(false)
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<FeedItem[]>([])
  const [fetchErr, setFetchErr] = useState<string | null>(null)
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
    try {
      const q = encodeURIComponent(rotationDay)
      const res = await fetch(`/api/admin/intelligence/feed?rotationDay=${q}`)
      if (!res.ok) {
        setFetchErr(fr ? 'Flux inaccessible.' : 'Feed unavailable.')
        setItems([])
        return
      }
      const json = (await res.json()) as FeedPayload
      setItems(json.items ?? [])
    } catch {
      setFetchErr(fr ? 'Erreur réseau.' : 'Network error.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [rotationDay, fr])

  const closeWithAnimation = useCallback(() => {
    if (exitingRef.current) return
    const backdrop = backdropRef.current
    const panel = panelRef.current
    exitingRef.current = true

    const finish = () => {
      exitingRef.current = false
      setMounted(false)
    }

    if (!backdrop || !panel) {
      finish()
      return
    }

    const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (mq?.matches) {
      finish()
      return
    }

    try {
      const tl = gsap.timeline({ onComplete: finish })
      tl.to(panel, { opacity: 0, y: 36, scale: 0.96, duration: 0.4, ease: 'power3.in' }, 0)
      tl.to(backdrop, { opacity: 0, duration: 0.34, ease: 'power2.in' }, 0.08)
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
    const backdrop = backdropRef.current
    const panel = panelRef.current
    if (!backdrop || !panel) return

    const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (mq?.matches) {
      gsap.set(backdrop, { opacity: 1 })
      gsap.set(panel, { opacity: 1, y: 0, scale: 1 })
      return
    }

    try {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.42, ease: 'power2.out' })
      gsap.fromTo(
        panel,
        { opacity: 0, y: 52, scale: 0.93 },
        { opacity: 1, y: 0, scale: 1, duration: 0.68, ease: 'power3.out', delay: 0.06 },
      )
    } catch {
      gsap.set(backdrop, { opacity: 1 })
      gsap.set(panel, { opacity: 1, y: 0, scale: 1 })
    }
  }, [mounted])

  const blocks = useMemo(() => {
    const out: {
      id: string
      tierId: string
      tierLabel: string
      sourceLabel: string
      url: string
      body: string
    }[] = []

    for (const item of items) {
      if (item.status !== 'ready') continue
      if (!includedTierIds.has(item.tier_id)) continue
      const body = primaryBody(item)
      if (body.length < 1) continue
      const tier = tierMeta.get(item.tier_id)
      const tierLabel = tier ? tierChipLabel(tier, langUi) : item.tier_id.replace(/_/g, ' ')
      out.push({
        id: item.id,
        tierId: item.tier_id,
        tierLabel,
        sourceLabel: item.source_label,
        url: item.url,
        body,
      })
    }
    return out
  }, [items, includedTierIds, tierMeta, langUi])

  const concatenated = useMemo(() => {
    return blocks
      .map((b) => `${b.tierLabel} · ${b.sourceLabel}\n${b.url}\n\n${b.body}`)
      .join(`\n\n${fr ? '―' : '—'}\n\n`)
  }, [blocks, fr])

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
          stagger: 0.065,
          ease: 'power2.out',
          delay: 0.08,
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

  const open = () => {
    exitingRef.current = false
    setMounted(true)
  }

  const portal =
    mounted && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={backdropRef}
            className="fixed inset-0 z-[10025] flex items-center justify-center bg-black/72 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-xl"
            role="presentation"
          >
            <button
              type="button"
              aria-label={fr ? 'Fermer la lecture' : 'Close reader'}
              className="absolute inset-0 cursor-default"
              onClick={() => closeWithAnimation()}
            />

            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="intel-immersive-title"
              className={cn(
                'relative flex max-h-[min(94vh,920px)] w-full max-w-[min(100%,40rem)] flex-col overflow-hidden rounded-[26px]',
                'border border-white/[0.09] bg-[#0c0c0e] shadow-[0_40px_120px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.05]',
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="shrink-0 border-b border-white/[0.07] bg-[#0c0c0e]/95 px-4 py-3 sm:px-5">
                <div className="flex flex-wrap items-center gap-2 gap-y-2">
                  <BookMarked className="h-5 w-5 shrink-0 text-[#d4b96a]" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <h2
                      id="intel-immersive-title"
                      className="font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[15px] font-semibold tracking-[-0.02em] text-white"
                    >
                      {fr ? 'Lecture immersive' : 'Immersive reading'}
                    </h2>
                    <p className="text-[11px] font-medium tracking-wide text-white/45">
                      {fr ? 'Jour UTC' : 'UTC day'}{' '}
                      <span className="font-mono text-white/70">{rotationDay}</span>
                      {loading ? ` · ${fr ? 'chargement…' : 'loading…'}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copyText()}
                    disabled={!concatenated.length}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-white/90 transition-colors hover:bg-white/[0.1] disabled:pointer-events-none disabled:opacity-35"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                    {copied ? (fr ? 'Copié' : 'Copied') : fr ? 'Copier tout' : 'Copy all'}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeWithAnimation()}
                    className="rounded-full p-2 text-white/55 transition-colors hover:bg-white/[0.08] hover:text-white"
                    aria-label={fr ? 'Quitter le mode lecture' : 'Exit reading mode'}
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
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
              </header>

              <div
                ref={scrollAreaRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-7"
              >
                {fetchErr ? (
                  <p className="text-center text-sm text-red-300/90">{fetchErr}</p>
                ) : includedTierIds.size === 0 ? (
                  <p className="text-center text-sm text-white/50">
                    {fr ? 'Choisis au moins une section.' : 'Pick at least one section.'}
                  </p>
                ) : blocks.length === 0 ? (
                  <p className="max-w-md mx-auto text-center text-sm leading-relaxed text-white/50">
                    {fr
                      ? 'Aucun texte « prêt » pour les sections sélectionnées ce jour-là. Lance une synchronisation ou des analyses, puis réessaie.'
                      : 'No ready text for the selected sections on this day. Run sync or analyses, then try again.'}
                  </p>
                ) : (
                  <div className="mx-auto max-w-[62ch] space-y-14 font-[ui-serif,Georgia,Cambria,'Times_New_Roman',serif]">
                    {blocks.map((b) => {
                      const paras = splitReadingBody(b.body)
                      return (
                        <article
                          key={b.id}
                          className="scroll-mt-6 border-b border-white/[0.06] pb-14 last:border-b-0 last:pb-4"
                        >
                          <header className="mb-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9a73a]/85">
                              {b.tierLabel}
                            </p>
                            <h3 className="mt-1 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-white">
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
                          <div className="space-y-4 text-[16px] leading-[1.72] text-[#e8e6e3]">
                            {paras.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </div>

              <footer className="shrink-0 border-t border-white/[0.06] bg-[#09090b]/98 px-4 py-3 text-center sm:px-5">
                <button
                  type="button"
                  onClick={() => closeWithAnimation()}
                  className="text-[12px] font-medium text-white/45 underline-offset-4 hover:text-[#c9a73a] hover:underline"
                >
                  {fr ? '← Retour au tableau Intelligence' : '← Back to Intelligence dashboard'}
                </button>
              </footer>
            </div>
          </div>,
          document.body,
        )
      : null

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
        <BookMarked className="h-4 w-4 shrink-0" aria-hidden />
        {fr ? 'Tout lire (immersif)' : 'Read all (immersive)'}
      </button>
      {portal}
    </>
  )
}
