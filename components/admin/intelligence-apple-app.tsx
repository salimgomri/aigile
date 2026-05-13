'use client'

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'

import { IntelligenceSourcesMatrix } from '@/components/admin/intelligence-sources-matrix'
import { useLanguage } from '@/components/language-provider'
import { civilDateMinusDays } from '@/lib/intelligence/digest-calendar-shared'
import {
  digestWeekOffsetsMonFirst,
  digestTodayUi,
  INTEL_DIGEST_UI_TZ,
  labelDigestIso,
} from '@/lib/intelligence/digest-calendar-ui'
import { tierAccentHex } from '@/lib/intelligence/tier-visuals'
import type { IntelligenceSourcesFile, IntelligenceTier } from '@/lib/intelligence/types'
import { cn } from '@/lib/utils'

const LS_KEYS = {
  accent: 'intelApple.accent',
  density: 'intelApple.density',
  font: 'intelApple.font',
}

export type AppleFeedItem = {
  id: string
  tier_id: string
  source_label: string
  url: string
  url_kind: string
  vitality_score: number
  empire_boost_applied?: number
  status: 'pending' | 'analyzing' | 'ready' | 'error'
  preview_snippet: string | null
  transcript_error?: string | null
  transcript_text?: string | null
  thumbnail_url?: string | null
  summary?: string | null
  content?: string | null
  rotation_day: string
}

export type AppleArticleRow = {
  id: string
  digest_date: string
  tier_id: string
  source_label: string
  source_feed_url: string
  article_url: string
  title: string
  summary: string | null
  published_at: string
  ingestion_kind: string
}

const ACCENT_PRESETS = ['#0b1220', '#b08544', '#1d6cf0', '#0a7d4b', '#b91c5c']

function hostFromUrl(url: string): string {
  try {
    return new URL(url.trim()).hostname.replace(/^www\./, '')
  } catch {
    return '…'
  }
}

function tierTitle(tiers: IntelligenceTier[], tierId: string, fr: boolean): string {
  const t = tiers.find((x) => x.id === tierId)
  return fr ? (t?.title_fr ?? tierId.replace(/_/g, ' ')) : (t?.title_en ?? tierId.replace(/_/g, ' '))
}

function sortFeedLikeAdmin(rows: AppleFeedItem[]): AppleFeedItem[] {
  const order: Record<AppleFeedItem['status'], number> = {
    ready: 0,
    analyzing: 1,
    pending: 2,
    error: 3,
  }
  return [...rows].sort((a, b) => {
    const sa = order[a.status] ?? 99
    const sb = order[b.status] ?? 99
    if (sa !== sb) return sa - sb
    return Number(b.vitality_score) - Number(a.vitality_score)
  })
}

function cardHeadline(item: AppleFeedItem): string {
  const raw = (item.summary ?? item.preview_snippet ?? '').trim()
  if (raw.length > 0) {
    const first = raw.split(/(?<=[.!?])\s/)[0] ?? raw
    return first.slice(0, 140)
  }
  return item.source_label
}

function cardDeck(item: AppleFeedItem): string {
  const raw = (item.summary ?? item.preview_snippet ?? '').trim()
  if (raw.length > 80) return raw.slice(80, 360).trim()
  if (item.status !== 'ready') {
    return item.status === 'analyzing'
      ? 'Collecte en cours…'
      : item.status === 'error'
        ? (item.transcript_error ?? 'Erreur de collecte.')
        : 'En attente — lancez « Analyser » ou synchronisez depuis YAML.'
  }
  return raw.slice(0, 280)
}

function articleBody(item: AppleFeedItem): string {
  const c = (item.content ?? '').trim()
  if (c.length > 0) return c
  return (item.transcript_text ?? '').trim()
}

function splitParagraphs(body: string): string[] {
  if (!body) return []
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 220)
}

function pendingForAnalyze(items: AppleFeedItem[]): AppleFeedItem[] {
  return items.filter((i) => (i.status === 'pending' || i.status === 'error') && i.url_kind !== 'rss')
}

function IntelligenceAppleReader({
  items,
  startIndex,
  tiers,
  onClose,
}: {
  items: AppleFeedItem[]
  startIndex: number
  tiers: IntelligenceTier[]
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  const [fontStep, setFontStep] = useState(0)
  const [surface, setSurface] = useState<'paper' | 'sepia' | 'dark'>('paper')
  const item = items[idx]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(items.length - 1, i + 1))
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1))
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [items.length, onClose])

  useEffect(() => {
    setIdx(startIndex)
  }, [startIndex])

  if (!item) return null

  const tierLab = tierTitle(tiers, item.tier_id, true)
  const accent = tierAccentHex(item.tier_id)
  const body = articleBody(item)
  const paras = splitParagraphs(body)
  const sizes = [15, 17, 19, 22]
  const fontSize = sizes[fontStep + 1] ?? 17

  async function copyAll() {
    const header = `${tierLab} · ${item.source_label}\n${item.url}\n\n`
    try {
      await navigator.clipboard.writeText(header + body)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={cn('ia-reader', surface !== 'paper' && `ia-reader--${surface}`)} role="dialog" aria-modal="true">
      <header className="ia-reader__bar">
        <button type="button" className="ia-reader__close" onClick={onClose}>
          ✕ Fermer
        </button>
        <div className="ia-reader__progress">
          <button
            type="button"
            className="ia-reader__nav"
            disabled={idx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            aria-label="Précédent"
          >
            ←
          </button>
          <span className="ia-reader__counter">
            {idx + 1} <span>/ {items.length}</span>
          </span>
          <button
            type="button"
            className="ia-reader__nav"
            disabled={idx === items.length - 1}
            onClick={() => setIdx((i) => Math.min(items.length - 1, i + 1))}
            aria-label="Suivant"
          >
            →
          </button>
        </div>
        <div className="ia-reader__tools">
          <div className="ia-reader__group" role="group" aria-label="Fond">
            <button type="button" className={surface === 'paper' ? 'on' : ''} onClick={() => setSurface('paper')}>
              A
            </button>
            <button type="button" className={surface === 'sepia' ? 'on' : ''} onClick={() => setSurface('sepia')}>
              A
            </button>
            <button type="button" className={surface === 'dark' ? 'on' : ''} onClick={() => setSurface('dark')}>
              A
            </button>
          </div>
          <div className="ia-reader__group" role="group" aria-label="Taille">
            <button type="button" onClick={() => setFontStep((s) => Math.max(-1, s - 1))}>
              A−
            </button>
            <button type="button" onClick={() => setFontStep((s) => Math.min(2, s + 1))}>
              A+
            </button>
          </div>
          <button type="button" className="ia-btn ia-btn--primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => void copyAll()}>
            Copier
          </button>
          <a className="ia-btn" style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none' }} href={item.url} target="_blank" rel="noopener noreferrer">
            Source ↗
          </a>
        </div>
      </header>

      <article className="ia-reader__article" style={{ fontSize }}>
        <div style={{ marginBottom: 16, fontSize: 13, letterSpacing: '0.02em' }}>
          <span className="ia-card__theme" style={{ color: accent }}>
            <span className="ia-dot" style={{ background: accent }} /> {tierLab} · {item.source_label}
          </span>
        </div>
        <h1 className="ia-reader__title">{cardHeadline(item)}</h1>
        <p className="ia-reader__lede">{cardDeck(item)}</p>
        <div className="ia-reader__byline">
          <span>{item.url_kind.toUpperCase()}</span>
          <span>·</span>
          <span>{hostFromUrl(item.url)}</span>
          <span>·</span>
          <span>Vitalité {Math.round(Number(item.vitality_score))}</span>
          <span>·</span>
          <span>{item.rotation_day} UTC</span>
        </div>
        {body.length > 0 ? (
          paras.map((p, i) => (
            <p key={i} className="ia-reader__p">
              {p}
            </p>
          ))
        ) : (
          <p className="ia-reader__p" style={{ opacity: 0.6 }}>
            Aucun texte brut pour cette entrée — utilisez « Analyser » ou ouvrez la source.
          </p>
        )}
        <hr className="ia-reader__rule" />
        <p className="ia-reader__meta">Statut : {item.status}</p>
      </article>
    </div>
  )
}

function SyncSheet({
  open,
  onClose,
  rotationDay,
  onLaunch,
  syncing,
}: {
  open: boolean
  onClose: () => void
  rotationDay: string
  onLaunch: () => void
  syncing: boolean
}) {
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (open) setStep(1)
  }, [open])

  if (!open) return null

  return (
    <div className="ia-modal" role="presentation" onClick={onClose}>
      <div className="ia-sheet" onClick={(e) => e.stopPropagation()}>
        <header className="ia-sheet__hdr">
          <div>
            <h2>Synchroniser Intelligence</h2>
            <p className="ia-sheet__sub">
              Ingestion depuis `sources.yml` · jour UTC affiché : <strong>{rotationDay}</strong>
            </p>
          </div>
          <button type="button" className="ia-iconbtn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>
        <div className="ia-sheet__steps">
          <button type="button" className={cn('ia-step', step === 1 && 'ia-step--on')} onClick={() => setStep(1)}>
            1 · Contexte
          </button>
          <button type="button" className={cn('ia-step', step === 2 && 'ia-step--on')} onClick={() => setStep(2)}>
            2 · Lancer
          </button>
        </div>
        <div className="ia-sheet__body">
          {step === 1 ? (
            <>
              <p className="ia-hint">
                La synchronisation reconstruit les lignes `intel_feed_items` pour le jour UTC courant : métadonnées,
                miniatures, files transcript YouTube si vitalité ≥ 80, scraping Web/Podcast automatique au même seuil.
              </p>
              <p className="ia-hint">Les sources suivies sont celles définies dans la configuration YAML du projet.</p>
            </>
          ) : (
            <p className="ia-hint">
              Prêt à lancer — cette opération peut prendre une minute si plusieurs transcripts sont mis en file.
            </p>
          )}
        </div>
        <footer className="ia-sheet__foot">
          <span className="ia-sheet__summary">{syncing ? 'Synchronisation en cours…' : 'Prêt'}</span>
          <div className="ia-sheet__btns">
            {step === 1 ? (
              <button type="button" className="ia-btn" onClick={() => setStep(2)}>
                Continuer →
              </button>
            ) : (
              <button type="button" className="ia-btn" onClick={() => setStep(1)}>
                ← Retour
              </button>
            )}
            <button type="button" className="ia-btn ia-btn--primary" disabled={syncing || step < 2} onClick={onLaunch}>
              Lancer la synchronisation
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

function GenOverlay({
  open,
  tiers,
  progressByTier,
}: {
  open: boolean
  tiers: IntelligenceTier[]
  progressByTier: Record<string, number>
}) {
  if (!open) return null
  return (
    <aside className="ia-gen">
      <header className="ia-gen__hdr">
        <div>
          <span className="ia-gen__eyebrow">Synchronisation</span>
          <h3>Récupération des sources…</h3>
        </div>
      </header>
      <div className="ia-gen__bars">
        {tiers.slice(0, 8).map((t) => (
          <div key={t.id}>
            <div className="ia-gbar__row">
              <span>{t.title_fr}</span>
              <span>{Math.round((progressByTier[t.id] ?? 0) * 100)}%</span>
            </div>
            <div className="ia-gbar__track">
              <div
                className="ia-gbar__fill"
                style={{
                  width: `${Math.round((progressByTier[t.id] ?? 0) * 100)}%`,
                  background: tierAccentHex(t.id),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

function TweaksFloating({
  open,
  onToggle,
  accent,
  setAccent,
  density,
  setDensity,
  fontChoice,
  setFontChoice,
}: {
  open: boolean
  onToggle: () => void
  accent: string
  setAccent: (v: string) => void
  density: 'compact' | 'comfortable'
  setDensity: (v: 'compact' | 'comfortable') => void
  fontChoice: 'inter' | 'ibm' | 'georgia'
  setFontChoice: (v: 'inter' | 'ibm' | 'georgia') => void
}) {
  return (
    <>
      <button type="button" className="ia-iconbtn" style={{ position: 'fixed', left: 20, bottom: 24, zIndex: 44 }} onClick={onToggle} aria-label="Réglages affichage">
        ⚙
      </button>
      {open ? (
        <div className="ia-tw-panel">
          <div className="ia-tw-hd">
            <span>Tweaks</span>
            <button type="button" className="ia-linkbtn" onClick={onToggle}>
              ✕
            </button>
          </div>
          <div className="ia-tw-body">
            <div className="ia-tw-row">
              <label>Accent</label>
              <div className="ia-tw-swatches">
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn('ia-tw-swatch', accent === c && 'ia-tw-swatch--on')}
                    style={{ background: c }}
                    aria-label={c}
                    onClick={() => setAccent(c)}
                  />
                ))}
              </div>
            </div>
            <div className="ia-tw-row">
              <label>Densité</label>
              <div className="ia-tw-seg">
                <button type="button" className={density === 'compact' ? 'on' : ''} onClick={() => setDensity('compact')}>
                  Compact
                </button>
                <button type="button" className={density === 'comfortable' ? 'on' : ''} onClick={() => setDensity('comfortable')}>
                  Confort
                </button>
              </div>
            </div>
            <div className="ia-tw-row">
              <label>Typographie</label>
              <select
                className="ia-chip"
                style={{ width: '100%', cursor: 'pointer' }}
                value={fontChoice}
                onChange={(e) => setFontChoice(e.target.value as 'inter' | 'ibm' | 'georgia')}
              >
                <option value="inter">Inter</option>
                <option value="ibm">IBM Plex Sans</option>
                <option value="georgia">Georgia</option>
              </select>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function articlePubLabel(iso: string): string {
  try {
    return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return ''
  }
}

function NewsArticleApple({
  row,
  tiers,
}: {
  row: AppleArticleRow
  tiers: IntelligenceTier[]
}) {
  const accent = tierAccentHex(row.tier_id)
  const tierLab = tierTitle(tiers, row.tier_id, true)
  const sum = (row.summary ?? '').trim()
  return (
    <article className="ia-card ia-card--article">
      <div className="ia-card__meta">
        <span className="ia-card__theme" style={{ color: accent }}>
          <span className="ia-dot" style={{ background: accent }} /> {tierLab}
        </span>
        <span className="ia-card__sep">·</span>
        <span>{row.source_label}</span>
        <span className="ia-card__sep">·</span>
        <span className="ia-card__rsspill">RSS</span>
      </div>
      <h3 className="ia-card__title">{row.title}</h3>
      <p className="ia-card__summary">{sum.length > 0 ? sum.slice(0, 280) : row.article_url}</p>
      <div className="ia-card__foot">
        <span className="ia-card__src">{articlePubLabel(row.published_at)}</span>
        <span className="ia-card__host">{hostFromUrl(row.article_url)}</span>
        <a className="ia-card__read" href={row.article_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
          Ouvrir →
        </a>
      </div>
    </article>
  )
}

function NewsCardApple({
  item,
  large,
  tiers,
  onOpen,
}: {
  item: AppleFeedItem
  large?: boolean
  tiers: IntelligenceTier[]
  onOpen: () => void
}) {
  const accent = tierAccentHex(item.tier_id)
  const tierLab = tierTitle(tiers, item.tier_id, true)
  return (
    <article className={cn('ia-card', large && 'ia-card--lg')} role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <div className="ia-card__meta">
        <span className="ia-card__theme" style={{ color: accent }}>
          <span className="ia-dot" style={{ background: accent }} /> {tierLab}
        </span>
        <span className="ia-card__sep">·</span>
        <span>{item.source_label}</span>
        <span className="ia-card__sep">·</span>
        <span>{item.status}</span>
      </div>
      <h3 className="ia-card__title">{cardHeadline(item)}</h3>
      <p className="ia-card__summary">{cardDeck(item)}</p>
      <div className="ia-card__foot">
        <span className="ia-card__src">{item.url_kind}</span>
        <span className="ia-card__host">{hostFromUrl(item.url)}</span>
        <span className="ia-card__read">Lire →</span>
      </div>
    </article>
  )
}

export function IntelligenceAppleApp({ sources }: { sources: IntelligenceSourcesFile }) {
  const { language } = useLanguage()
  const fr = language === 'fr'

  const [pageTab, setPageTab] = useState<'feed' | 'sources'>('feed')
  const [weekView, setWeekView] = useState(false)
  const [rotationDay, setRotationDay] = useState(() => digestTodayUi())
  const [tierFilter, setTierFilter] = useState<string>('all')

  const [itemsDay, setItemsDay] = useState<AppleFeedItem[]>([])
  const [itemsWeek, setItemsWeek] = useState<AppleFeedItem[]>([])
  const [articlesDay, setArticlesDay] = useState<AppleArticleRow[]>([])
  const [articlesWeek, setArticlesWeek] = useState<AppleArticleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [banner, setBanner] = useState<string | null>(null)

  const [syncSheet, setSyncSheet] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [genOpen, setGenOpen] = useState(false)
  const [fakeProg, setFakeProg] = useState<Record<string, number>>({})

  const [reader, setReader] = useState<{ items: AppleFeedItem[]; index: number } | null>(null)
  const [analyzeId, setAnalyzeId] = useState<string | null>(null)

  const [tweakOpen, setTweakOpen] = useState(false)
  const [accent, setAccent] = useState('#0b1220')
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable')
  const [fontChoice, setFontChoice] = useState<'inter' | 'ibm' | 'georgia'>('inter')

  useEffect(() => {
    try {
      const a = localStorage.getItem(LS_KEYS.accent)
      const d = localStorage.getItem(LS_KEYS.density) as 'compact' | 'comfortable' | null
      const f = localStorage.getItem(LS_KEYS.font) as 'inter' | 'ibm' | 'georgia' | null
      if (a) setAccent(a)
      if (d === 'compact' || d === 'comfortable') setDensity(d)
      if (f === 'inter' || f === 'ibm' || f === 'georgia') setFontChoice(f)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.accent, accent)
      localStorage.setItem(LS_KEYS.density, density)
      localStorage.setItem(LS_KEYS.font, fontChoice)
    } catch {
      /* ignore */
    }
  }, [accent, density, fontChoice])

  const fontStack = useMemo(() => {
    if (fontChoice === 'ibm') return `var(--font-ibm-intel), 'IBM Plex Sans', system-ui, sans-serif`
    if (fontChoice === 'georgia') return `Georgia, 'Times New Roman', serif`
    return `var(--font-inter-intel), 'Inter', system-ui, sans-serif`
  }, [fontChoice])

  const loadDay = useCallback(async () => {
    setBanner(null)
    const q = encodeURIComponent(rotationDay)
    const res = await fetch(`/api/admin/intelligence/feed?rotationDay=${q}`)
    if (!res.ok) {
      setItemsDay([])
      setArticlesDay([])
      setLoading(false)
      setBanner('Impossible de charger le flux.')
      return
    }
    const json = (await res.json()) as { items: AppleFeedItem[]; articles?: AppleArticleRow[] }
    setItemsDay(sortFeedLikeAdmin(json.items ?? []))
    setArticlesDay(json.articles ?? [])
    setLoading(false)
  }, [rotationDay])

  const loadWeek = useCallback(async () => {
    setBanner(null)
    const res = await fetch('/api/admin/intelligence/feed/weekly-recap?days=7')
    if (!res.ok) {
      setItemsWeek([])
      setArticlesWeek([])
      setLoading(false)
      setBanner('Impossible de charger la semaine.')
      return
    }
    const json = (await res.json()) as { items: AppleFeedItem[]; articles?: AppleArticleRow[] }
    setItemsWeek(json.items ?? [])
    setArticlesWeek(json.articles ?? [])
    setLoading(false)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    if (weekView) await loadWeek()
    else await loadDay()
  }, [weekView, loadDay, loadWeek])

  useEffect(() => {
    void load()
  }, [load])

  const rawItems = weekView ? itemsWeek : itemsDay
  const analyzing = rawItems.some((i) => i.status === 'analyzing')

  useEffect(() => {
    if (!analyzing) return
    const t = window.setInterval(() => void load(), 5000)
    return () => window.clearInterval(t)
  }, [analyzing, load])

  const rawArticles = weekView ? articlesWeek : articlesDay

  const filteredArticles = useMemo(() => {
    if (tierFilter === 'all') return rawArticles
    return rawArticles.filter((a) => a.tier_id === tierFilter)
  }, [rawArticles, tierFilter])

  const filtered = useMemo(() => {
    if (tierFilter === 'all') return rawItems
    return rawItems.filter((i) => i.tier_id === tierFilter)
  }, [rawItems, tierFilter])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rawItems.length + rawArticles.length }
    for (const t of sources.tiers) {
      c[t.id] =
        rawItems.filter((i) => i.tier_id === t.id).length + rawArticles.filter((a) => a.tier_id === t.id).length
    }
    return c
  }, [rawItems, rawArticles, sources.tiers])

  const todayDigest = digestTodayUi()
  const lede = labelDigestIso(weekView ? todayDigest : rotationDay, todayDigest)

  async function runSync() {
    setSyncing(true)
    setGenOpen(true)
    setFakeProg({})
    const tierIds = sources.tiers.map((t) => t.id)
    const iv = window.setInterval(() => {
      setFakeProg((prev) => {
        const next: Record<string, number> = { ...prev }
        for (const id of tierIds) {
          next[id] = Math.min(1, (next[id] ?? 0) + 0.055)
        }
        return next
      })
    }, 420)

    try {
      const res = await fetch('/api/admin/intelligence/feed/sync', { method: 'POST' })
      if (!res.ok) setBanner('Échec synchronisation.')
      else {
        const summary = (await res.json()) as {
          rotationDay?: string
          upserted?: number
          rssArticlesInserted?: number
        }
        setBanner(
          `Sync OK · ${summary.rotationDay ?? '—'} · ${summary.upserted ?? 0} lignes · RSS ${summary.rssArticlesInserted ?? 0} articles.`,
        )
      }
      await load()
    } finally {
      clearInterval(iv)
      setSyncing(false)
      setFakeProg(Object.fromEntries(tierIds.map((id) => [id, 1])))
      window.setTimeout(() => setGenOpen(false), 900)
      setSyncSheet(false)
    }
  }

  async function analyze(id: string) {
    setAnalyzeId(id)
    try {
      await fetch(`/api/admin/intelligence/feed/items/${id}/analyze`, { method: 'POST' })
      await load()
    } finally {
      setAnalyzeId(null)
    }
  }

  const groupedByDay = useMemo(() => {
    if (!weekView) return null
    const m = new Map<string, AppleFeedItem[]>()
    for (const it of filtered) {
      const arr = m.get(it.rotation_day) ?? []
      arr.push(it)
      m.set(it.rotation_day, arr)
    }
    const artByDay = new Map<string, AppleArticleRow[]>()
    for (const a of filteredArticles) {
      const dd = String(a.digest_date).slice(0, 10)
      const arr = artByDay.get(dd) ?? []
      arr.push(a)
      artByDay.set(dd, arr)
    }
    const keys = new Set([...m.keys(), ...artByDay.keys()])
    return [...keys]
      .sort((a, b) => b.localeCompare(a))
      .map((k) => ({
        day: k,
        items: m.get(k) ?? [],
        articles: artByDay.get(k) ?? [],
      }))
      .filter((g) => g.items.length > 0 || g.articles.length > 0)
  }, [filtered, filteredArticles, weekView])

  const openReader = useCallback(
    (item: AppleFeedItem) => {
      const ix = Math.max(0, filtered.findIndex((x) => x.id === item.id))
      setReader({ items: filtered.length ? filtered : [item], index: ix })
    },
    [filtered],
  )

  const weekStrip = digestWeekOffsetsMonFirst(INTEL_DIGEST_UI_TZ)

  return (
    <div
      className="intelligence-apple"
      data-density={density}
      style={
        {
          '--ia-accent': accent,
          '--ia-font': fontStack,
        } as CSSProperties
      }
    >
      <div className="ia-app">
        <header className="ia-hdr">
          <div className="ia-hdr__row">
            <div className="ia-brand">
              <span className="ia-brand__mark">◐</span>
              <span className="ia-brand__name">Intelligence</span>
            </div>
            <nav className="ia-hdr__nav" aria-label="Sections">
              <button type="button" className={cn('ia-tab', pageTab === 'feed' && 'ia-tab--on')} onClick={() => setPageTab('feed')}>
                {fr ? 'Veille' : 'Feed'}
              </button>
              <button type="button" className={cn('ia-tab', pageTab === 'sources' && 'ia-tab--on')} onClick={() => setPageTab('sources')}>
                {fr ? 'Sources' : 'Sources'}
              </button>
            </nav>
            <div className="ia-hdr__actions">
              {pageTab === 'feed' ? (
                <>
                  <button type="button" className={cn('ia-tab', !weekView && 'ia-tab--on')} onClick={() => setWeekView(false)}>
                    {fr ? 'Jour' : 'Day'}
                  </button>
                  <button type="button" className={cn('ia-tab', weekView && 'ia-tab--on')} onClick={() => setWeekView(true)}>
                    {fr ? 'Semaine' : 'Week'}
                  </button>
                </>
              ) : null}
              <button type="button" className="ia-btn ia-btn--primary" onClick={() => setSyncSheet(true)}>
                + {fr ? 'Synchroniser' : 'Sync'}
              </button>
            </div>
          </div>

          {pageTab === 'feed' && !weekView ? (
            <div className="ia-daystrip" role="tablist">
              {weekStrip.map((offset) => {
                const iso = civilDateMinusDays(todayDigest, offset)
                const lbl = labelDigestIso(iso, todayDigest)
                const isOn = iso === rotationDay
                const isToday = iso === todayDigest
                return (
                  <button
                    key={iso}
                    type="button"
                    role="tab"
                    aria-selected={isOn}
                    disabled={lbl.isFuture}
                    className={cn('ia-day', isOn && 'ia-day--on', lbl.isFuture && 'ia-day--future', isToday && 'ia-day--today')}
                    onClick={() => !lbl.isFuture && setRotationDay(iso)}
                  >
                    <span className="ia-day__wd">{isToday ? (fr ? 'Aujourd’hui' : 'Today') : lbl.weekday}</span>
                    <span className="ia-day__num">{lbl.day}</span>
                    <span className="ia-day__mo">{lbl.month}</span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </header>

        {pageTab === 'feed' ? (
          <main className="ia-main">
            <div className="ia-main__lede">
              <h1 className="ia-lede__title">
                {weekView ? (fr ? 'Sept jours (fuseau digest)' : 'Rolling 7 days (digest TZ)') : fr ? 'Veille' : 'Digest'}
                <span className="ia-lede__date">
                  {lede.day} {lede.month} {Number((weekView ? todayDigest : rotationDay).slice(0, 4))}
                </span>
              </h1>
              <p className="ia-lede__sub">
                {weekView
                  ? fr
                    ? `Sources et articles RSS agrégés par jour (${INTEL_DIGEST_UI_TZ}).`
                    : `Sources and RSS articles grouped by day (${INTEL_DIGEST_UI_TZ}).`
                  : fr
                    ? `Jour calendaire ${rotationDay} (${INTEL_DIGEST_UI_TZ}). Cartes flux + articles RSS du même jour.`
                    : `Calendar day ${rotationDay} (${INTEL_DIGEST_UI_TZ}). Feed cards + RSS articles for that day.`}
              </p>
            </div>

            {banner ? (
              <p className="ia-hint" style={{ marginBottom: 16 }}>
                {banner}
              </p>
            ) : null}

            <nav className="ia-dock" aria-label={fr ? 'Filtres par palier' : 'Tier filters'}>
              <div className="ia-dock__inner">
                <button
                  type="button"
                  className={cn('ia-dockitem', tierFilter === 'all' && 'ia-dockitem--on')}
                  onClick={() => setTierFilter('all')}
                >
                  {fr ? 'Tous' : 'All'}
                  <span className="ia-dockitem__count">{counts.all}</span>
                </button>
                <span className="ia-dock__sep" aria-hidden />
                {sources.tiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={cn('ia-dockitem', tierFilter === t.id && 'ia-dockitem--on')}
                    style={
                      tierFilter === t.id
                        ? ({ '--ia-dock-theme': tierAccentHex(t.id) } as CSSProperties)
                        : undefined
                    }
                    onClick={() => setTierFilter(t.id)}
                  >
                    <span className="ia-dockitem__icon" style={{ background: tierAccentHex(t.id) }} />
                    <span className="ia-dockitem__label">{fr ? t.title_fr.split(/[—–-]/)[0]?.trim() : t.title_en.split(/[—–-]/)[0]?.trim()}</span>
                    <span className="ia-dockitem__count">{counts[t.id] ?? 0}</span>
                  </button>
                ))}
              </div>
            </nav>

            {loading ? (
              <div className="ia-empty">{fr ? 'Chargement…' : 'Loading…'}</div>
            ) : weekView && groupedByDay ? (
              <div className="ia-feed">
                {groupedByDay.map(({ day, items, articles }) => {
                  const dl = labelDigestIso(day, todayDigest)
                  const total = items.length + articles.length
                  return (
                    <section key={day} className="ia-weekgroup">
                      <header className="ia-weekgroup__hdr">
                        <h2>
                          {dl.weekday} <span className="ia-weekgroup__date">{dl.day} {dl.month}</span>
                        </h2>
                        <span className="ia-weekgroup__count">
                          {total} {fr ? 'entrées' : 'entries'}
                        </span>
                      </header>
                      {articles.length > 0 ? (
                        <>
                          <p className="ia-rss-hint">{fr ? 'Articles RSS du jour' : 'RSS articles'}</p>
                          <div className="ia-feed__grid">
                            {articles.slice(0, 24).map((row) => (
                              <NewsArticleApple key={row.id} row={row} tiers={sources.tiers} />
                            ))}
                          </div>
                        </>
                      ) : null}
                      {items.length > 0 ? (
                        <>
                          <p className="ia-rss-hint">{fr ? 'Sources (flux)' : 'Sources (feed)'}</p>
                          <div className="ia-feed__grid">
                            {items.slice(0, 12).map((it) => (
                              <NewsCardApple key={it.id} item={it} tiers={sources.tiers} onOpen={() => openReader(it)} />
                            ))}
                          </div>
                        </>
                      ) : null}
                      {pendingForAnalyze(items).length > 0 ? (
                        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {pendingForAnalyze(items).map((it) => (
                            <button key={it.id} type="button" className="ia-btn" disabled={analyzeId === it.id} onClick={() => void analyze(it.id)}>
                              {analyzeId === it.id ? '…' : fr ? `Analyser · ${it.source_label}` : `Analyze · ${it.source_label}`}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </section>
                  )
                })}
                {groupedByDay.length === 0 ? <div className="ia-empty">{fr ? 'Aucune donnée.' : 'No data.'}</div> : null}
              </div>
            ) : (
              <div className="ia-feed">
                {filtered.length === 0 && filteredArticles.length === 0 ? (
                  <div className="ia-empty">{fr ? 'Aucune entrée pour cette journée.' : 'No entries for this day.'}</div>
                ) : (
                  <>
                    {filtered.length > 0 ? (
                      <>
                        <div className="ia-feed__hero">
                          <NewsCardApple item={filtered[0]!} large tiers={sources.tiers} onOpen={() => openReader(filtered[0]!)} />
                        </div>
                        <div className="ia-feed__grid">
                          {filtered.slice(1).map((it) => (
                            <NewsCardApple key={it.id} item={it} tiers={sources.tiers} onOpen={() => openReader(it)} />
                          ))}
                        </div>
                      </>
                    ) : null}
                    {filteredArticles.length > 0 ? (
                      <>
                        <p className="ia-rss-hint" style={{ marginTop: filtered.length > 0 ? 28 : 0 }}>
                          {fr ? 'Articles RSS du jour' : 'RSS articles'}
                        </p>
                        <div className="ia-feed__grid">
                          {filteredArticles.map((row) => (
                            <NewsArticleApple key={row.id} row={row} tiers={sources.tiers} />
                          ))}
                        </div>
                      </>
                    ) : null}
                    <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {filtered
                        .filter((i) => (i.status === 'pending' || i.status === 'error') && i.url_kind !== 'rss')
                        .map((it) => (
                          <button key={it.id} type="button" className="ia-btn" disabled={analyzeId === it.id} onClick={() => void analyze(it.id)}>
                            {analyzeId === it.id ? '…' : fr ? `Analyser · ${it.source_label}` : `Analyze · ${it.source_label}`}
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        ) : (
          <div className="ia-sources-wrap">
            <IntelligenceSourcesMatrix data={sources} rotationDay={rotationDay} />
          </div>
        )}

        <SyncSheet open={syncSheet} onClose={() => setSyncSheet(false)} rotationDay={rotationDay} onLaunch={() => void runSync()} syncing={syncing} />
        <GenOverlay open={genOpen} tiers={sources.tiers} progressByTier={fakeProg} />
        <TweaksFloating
          open={tweakOpen}
          onToggle={() => setTweakOpen((v) => !v)}
          accent={accent}
          setAccent={setAccent}
          density={density}
          setDensity={setDensity}
          fontChoice={fontChoice}
          setFontChoice={setFontChoice}
        />
        {reader ? (
          <IntelligenceAppleReader items={reader.items} startIndex={reader.index} tiers={sources.tiers} onClose={() => setReader(null)} />
        ) : null}
      </div>
    </div>
  )
}

