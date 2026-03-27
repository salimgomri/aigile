'use client'

import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  FileDown,
  FileText,
  LayoutGrid,
  Lightbulb,
  Radar as RadarIcon,
  Sparkles,
  Table2,
} from 'lucide-react'
import type { DimensionId, RAGStatus, ScoreResult, ScoringSession } from '@/types/scoring'
import type { ClientSafeModel } from '@/lib/scoring/schema'
import { collectActionTips } from '@/lib/scoring/collect-tips'
import { CREDIT_ACTIONS } from '@/lib/credits/actions'
import { useCredits } from '@/lib/credits/CreditContext'
import UpgradeModal from '@/components/credits/UpgradeModal'
import './scoring-print.css'

const DIM_ORDER: DimensionId[] = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']

const ACCENT_ORANGE = '#f5a623'

const SKIP_MARKDOWN_TITLES = new Set([
  'score global',
  'dimensions',
  'alertes critiques',
])

type NavKey = 'hero' | 'radar' | 'dimensions' | 'tips' | 'alerts' | 'report'

function splitMarkdownH2(md: string): { title: string; body: string }[] {
  const t = md.trim()
  if (!t) return []
  const chunks = t.split(/^## /m).filter((c) => c.trim())
  return chunks.map((chunk) => {
    const lines = chunk.split('\n')
    const title = (lines[0] ?? '').trim()
    const body = lines.slice(1).join('\n').trim()
    return { title, body }
  })
}

function parseRecommendationLines(body: string): { code: string; text: string }[] {
  const out: { code: string; text: string }[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/^\s*[-*]\s*\*\*([^*]+)\*\*\s*:\s*(.+)$/)
    if (m) {
      out.push({ code: m[1].trim(), text: m[2].trim() })
      continue
    }
    const m2 = line.match(/^\s*[-*]\s*(.+)$/)
    if (m2 && m2[1].trim()) {
      out.push({ code: '', text: m2[1].trim() })
    }
  }
  return out
}

/** Anciens rapports : `_—_` ou italiques markdown bruts dans l’accordéon */
function formatPlainReportLine(line: string): string {
  const t = line.trim()
  if (t === '_—_' || t === '_—' || t === '_–_') return '—'
  const onlyItalic = t.match(/^_([^_]+)_$/)
  if (onlyItalic) return onlyItalic[1]
  return t
}

function globalScoreColor(rag: RAGStatus): string {
  if (rag === 'green') return 'text-green-100'
  if (rag === 'red') return 'text-red-100'
  if (rag === 'orange' || rag === 'capped_orange') return 'text-orange-100'
  return 'text-white/80'
}

/** Fond derrière le score global pour lier visuellement au RAG (ex. fond vert si synthèse verte) */
function globalScorePanelClass(rag: RAGStatus): string {
  if (rag === 'green') {
    return 'rounded-2xl bg-emerald-600/45 px-5 py-3 shadow-inner ring-1 ring-emerald-400/40'
  }
  if (rag === 'red') {
    return 'rounded-2xl bg-red-600/35 px-5 py-3 shadow-inner ring-1 ring-red-400/35'
  }
  if (rag === 'orange' || rag === 'capped_orange') {
    return 'rounded-2xl bg-orange-600/35 px-5 py-3 shadow-inner ring-1 ring-orange-400/35'
  }
  return 'rounded-2xl bg-white/5 px-5 py-3 ring-1 ring-white/10'
}

function heroCircleClass(rag: RAGStatus): string {
  if (rag === 'green') {
    return 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-2xl shadow-green-500/70'
  }
  if (rag === 'red') {
    return 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-2xl shadow-red-500/50'
  }
  return 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 shadow-2xl shadow-orange-500/70'
}

function ragPillClasses(rag: RAGStatus): string {
  if (rag === 'green') return 'border border-green-500/30 bg-green-500/15 text-green-400'
  if (rag === 'red') return 'border border-red-500/30 bg-red-500/15 text-red-400'
  if (rag === 'orange' || rag === 'capped_orange') {
    return 'border border-orange-500/30 bg-orange-500/15 text-orange-400'
  }
  return 'border border-white/10 bg-white/5 text-white/50'
}

/** Libellé RAG lisible (pas de raw capped_orange) */
function ragLabelFr(rag: RAGStatus): string {
  if (rag === 'green') return 'Vert'
  if (rag === 'red') return 'Rouge'
  if (rag === 'orange') return 'Orange'
  if (rag === 'capped_orange') return 'Orange (plafonné)'
  return String(rag)
}

function typeBadgeClasses(t: string): string {
  const x = t.toLowerCase()
  if (x === 'critical')
    return 'border border-red-500/20 bg-red-500/10 text-red-400'
  if (x === 'standard')
    return 'border border-blue-500/20 bg-blue-500/10 text-blue-400'
  return 'border border-white/10 bg-white/5 text-white/40'
}

interface ScoringReportProps {
  session: ScoringSession
  scoreResult: ScoreResult
  reportMarkdown: string
  scoringModel: ClientSafeModel
  onNewSession: () => void
}

export function ScoringReport({
  session,
  scoreResult,
  reportMarkdown,
  scoringModel,
  onNewSession,
}: ScoringReportProps) {
  const { refresh: refreshCredits } = useCredits()
  const criticalSet = useMemo(
    () => new Set(scoringModel.blocking_rule.critical_dimensions),
    [scoringModel.blocking_rule.critical_dimensions]
  )

  const radarData = useMemo(() => {
    return DIM_ORDER.map((id) => {
      const ds = scoreResult.dimension_scores.find((d) => d.id === id)
      const label = `D${id.slice(1)}`
      return {
        subject: label,
        score: ds?.score ?? 0,
        fullMark: 100,
      }
    })
  }, [scoreResult.dimension_scores])

  const orderedFlags = useMemo(() => {
    const f = [...scoreResult.critical_flags]
    f.sort((a, b) => {
      if (a === 'SECURITY_CRITICAL') return -1
      if (b === 'SECURITY_CRITICAL') return 1
      return a.localeCompare(b)
    })
    return f
  }, [scoreResult.critical_flags])

  const globalRag = scoreResult.rag_global
  const dimensionRows = useMemo(() => {
    const map = new Map(scoreResult.dimension_scores.map((d) => [d.id, d]))
    return DIM_ORDER.map((id) => map.get(id)).filter(Boolean) as typeof scoreResult.dimension_scores
  }, [scoreResult.dimension_scores])

  const actionTips = useMemo(
    () => collectActionTips(scoreResult, scoringModel),
    [scoreResult, scoringModel]
  )
  const tipsCount = actionTips.red.length + actionTips.orange.length

  const markdownSections = useMemo(() => splitMarkdownH2(reportMarkdown), [reportMarkdown])
  const accordionSections = useMemo(
    () =>
      markdownSections.filter((s) => !SKIP_MARKDOWN_TITLES.has(s.title.toLowerCase().trim())),
    [markdownSections]
  )

  const [openSection, setOpenSection] = useState<string | null>(null)
  const documentTitleRef = useRef<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [activeNav, setActiveNav] = useState<NavKey>('hero')

  const pdfCost = CREDIT_ACTIONS.scoring_pdf.cost

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handlePdfExport = useCallback(async () => {
    setPdfLoading(true)
    try {
      const res = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scoring_pdf' }),
      })
      if (!res.ok) {
        if (res.status === 403) setShowUpgrade(true)
        return
      }
      await refreshCredits()
      window.print()
    } finally {
      setPdfLoading(false)
    }
  }, [refreshCredits])

  useEffect(() => {
    documentTitleRef.current = document.title
    const onBefore = () => {
      document.title = 'Scoring livraison — Rapport | AIgile'
    }
    const onAfter = () => {
      if (documentTitleRef.current != null) document.title = documentTitleRef.current
    }
    window.addEventListener('beforeprint', onBefore)
    window.addEventListener('afterprint', onAfter)
    return () => {
      window.removeEventListener('beforeprint', onBefore)
      window.removeEventListener('afterprint', onAfter)
    }
  }, [])

  useEffect(() => {
    const sectionIds: { id: string; key: NavKey }[] = [
      { id: 'scoring-hero', key: 'hero' },
      { id: 'scoring-radar', key: 'radar' },
      { id: 'scoring-dimensions', key: 'dimensions' },
      { id: 'scoring-tips', key: 'tips' },
    ]
    if (orderedFlags.length > 0) {
      sectionIds.push({ id: 'scoring-alerts', key: 'alerts' })
    }
    if (accordionSections.length > 0) {
      sectionIds.push({ id: 'scoring-report-full', key: 'report' })
    }

    const tick = () => {
      const vh = window.innerHeight * 0.35
      const mid = window.innerHeight * 0.45
      for (const { id, key } of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top < mid && r.bottom > vh) {
          setActiveNav(key)
          return
        }
      }
    }
    const interval = setInterval(tick, 160)
    window.addEventListener('scroll', tick, { passive: true })
    tick()
    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', tick)
    }
  }, [orderedFlags.length, accordionSections.length])

  const toggle = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key))
  }

  const glassCard = 'bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/50'
  const glassInner = 'bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10'

  const navBtn = (key: NavKey, icon: ReactNode, label: string, onClick: () => void) => {
    const active = activeNav === key
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
        title={label}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
            active
              ? 'scale-110 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/40'
              : 'border border-white/15 bg-white/10 hover:bg-white/20'
          }`}
        >
          <span className={active ? 'text-white' : 'text-white/70'}>{icon}</span>
        </div>
        <span className={`max-w-[4.5rem] text-center text-[10px] font-medium leading-tight ${active ? 'text-orange-300' : 'text-white/40'}`}>
          {label}
        </span>
      </button>
    )
  }

  return (
    <div className="relative w-full max-w-none text-white print:max-w-none lg:pr-[4.75rem]">
      {/* Dock droit — navigation + PDF (comme /retro/result) */}
      <div
        data-no-print
        className="fixed right-8 top-1/2 z-40 hidden max-h-[85vh] -translate-y-1/2 flex-col items-center gap-2 overflow-y-auto rounded-3xl border border-white/10 bg-black/65 p-4 shadow-2xl backdrop-blur-2xl lg:flex"
      >
        <div className="flex flex-col items-center gap-1 pb-2">
          <button
            type="button"
            onClick={() => void handlePdfExport()}
            disabled={pdfLoading}
            className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 transition hover:scale-110 hover:from-orange-400 hover:to-orange-500 disabled:opacity-60"
            title={`Exporter PDF — ${pdfCost} crédit${pdfCost > 1 ? 's' : ''}`}
          >
            <FileDown className="h-7 w-7 text-white" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wide text-orange-300">PDF</span>
          <span className="text-[9px] text-white/45">
            {pdfCost} crédit{pdfCost > 1 ? 's' : ''}
          </span>
        </div>
        <div className="h-px w-10 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {navBtn('hero', <Sparkles className="h-5 w-5" />, 'Synthèse', () => scrollTo('scoring-hero'))}
        {navBtn('radar', <RadarIcon className="h-5 w-5" />, 'Radar', () => scrollTo('scoring-radar'))}
        {navBtn('dimensions', <Table2 className="h-5 w-5" />, 'Dimensions', () => scrollTo('scoring-dimensions'))}
        {navBtn('tips', <Lightbulb className="h-5 w-5" />, 'Conseils', () => scrollTo('scoring-tips'))}
        {orderedFlags.length > 0 &&
          navBtn('alerts', <AlertTriangle className="h-5 w-5" />, 'Alertes', () => scrollTo('scoring-alerts'))}
        {accordionSections.length > 0 &&
          navBtn('report', <FileText className="h-5 w-5" />, 'Rapport', () => scrollTo('scoring-report-full'))}
      </div>

      <div
        data-no-print
        className="relative z-30 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-black/40 px-4 py-5 backdrop-blur-2xl md:rounded-2xl md:border md:border-white/10 md:px-6"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-gray-400 transition-all hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Accueil</span>
        </Link>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          <button
            type="button"
            onClick={() => void handlePdfExport()}
            disabled={pdfLoading}
            className="group relative flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/35 transition-transform hover:scale-[1.02] hover:from-orange-400 hover:to-orange-500 disabled:opacity-60 lg:hidden"
          >
            <FileDown className="h-5 w-5 shrink-0" />
            {pdfLoading ? 'Préparation…' : `Exporter PDF · ${pdfCost} crédit${pdfCost > 1 ? 's' : ''}`}
          </button>
          <button
            type="button"
            onClick={onNewSession}
            className="min-h-[44px] rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20"
          >
            Nouvelle évaluation
          </button>
        </div>
      </div>

      <section id="scoring-hero" className={`scroll-mt-28 mb-10 rounded-[3rem] p-8 md:p-12 lg:p-16 ${glassCard}`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 lg:col-span-5">
            <div className="flex items-start gap-6">
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full md:h-24 md:w-24 ${heroCircleClass(globalRag)}`}
              >
                <span className="text-3xl font-bold tabular-nums text-white">
                  {scoreResult.score_global.toFixed(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-white/40">
                  Résultat
                </p>
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
                  Scoring livraison
                </h1>
              </div>
            </div>
            <p className="text-lg font-light leading-relaxed text-white/60 md:text-xl">
              {session.team_name && <span>{session.team_name}</span>}
              {session.team_name && session.sprint_number && ' · '}
              {session.sprint_number && <span>Sprint {session.sprint_number}</span>}
              {session.team_name || session.sprint_number ? ' — ' : null}
              Score global pondéré sur 9 dimensions, avec règles de quality gate si applicable.
            </p>
            <div className={`p-6 ${glassInner}`}>
              <div className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
                Score global · synthèse RAG
              </div>
              <p
                data-rag-panel={globalRag}
                className={`inline-block font-semibold tabular-nums leading-none ${globalScorePanelClass(globalRag)} ${globalScoreColor(globalRag)}`}
                title="Score pondéré — niveau RAG (rouge / orange / vert)"
                style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}
              >
                {scoreResult.score_global.toFixed(1)}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${ragPillClasses(globalRag)}`}
                >
                  {ragLabelFr(globalRag)}
                </span>
                {scoreResult.blocking_rule_applied && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-300"
                    title="≥1 dimension critique en rouge — score plafonné"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    PLAFONNÉ
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-widest text-white/40">
                  Dimensions
                </div>
                <div className="text-xl font-semibold text-white">9</div>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-widest text-white/40">
                  Alertes
                </div>
                <div className="text-xl font-semibold text-white">{orderedFlags.length}</div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                <span className="text-orange-400">→</span> Lecture rapide
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Le fond reflète la synthèse RAG (vert / orange / rouge). Section{' '}
                <strong className="text-white/90">Conseils</strong> pour des actions prioritaires, puis le rapport
                détaillé.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="scoring-radar" className={`scroll-mt-28 mb-10 rounded-[3rem] p-6 md:p-8 ${glassCard}`}>
        <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">Vue radar — 9 dimensions</h2>
        <div className="h-[320px] w-full md:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                stroke="rgba(255,255,255,0.08)"
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke={ACCENT_ORANGE}
                fill={ACCENT_ORANGE}
                fillOpacity={0.15}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section id="scoring-dimensions" className={`scroll-mt-28 mb-10 overflow-hidden rounded-[3rem] ${glassCard}`}>
        <h2 className="border-b border-white/10 px-6 py-5 text-xl font-semibold text-white md:px-8 md:text-2xl">
          Tableau des dimensions
        </h2>
        <div className="divide-y divide-white/5">
          {dimensionRows.map((ds, idx) => {
            const meta = scoringModel.dimensions[ds.id]
            const isCrit = criticalSet.has(ds.id)
            const rowBg = idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.05]'
            const pct = ds.score === null ? 0 : Math.min(100, Math.max(0, ds.score))
            return (
              <div
                key={ds.id}
                className={`grid gap-4 px-6 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-center md:px-8 ${rowBg}`}
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-white">{meta.label_fr}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${typeBadgeClasses(meta.type)}`}
                    >
                      {meta.type === 'critical'
                        ? 'Critical'
                        : meta.type === 'standard'
                          ? 'Standard'
                          : 'Optional'}
                    </span>
                    {isCrit && (
                      <span className="text-xs font-bold uppercase text-red-400">Critique</span>
                    )}
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all ${ds.excluded ? 'bg-white/20' : ragBarClass(ds.rag)}`}
                      style={{ width: `${pct}%` } as CSSProperties}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right font-mono text-sm tabular-nums text-white">
                    {ds.score === null ? '—' : ds.score.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 md:flex-col md:items-end">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ragPillClasses(ds.rag)}`}
                  >
                    {ragLabelFr(ds.rag)}
                  </span>
                  <span className="font-mono text-xs text-white/40">
                    {(ds.weight_effective <= 1 ? ds.weight_effective * 100 : ds.weight_effective).toFixed(1)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section id="scoring-tips" className={`scroll-mt-28 mb-10 rounded-[3rem] p-6 md:p-10 ${glassCard}`}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
              <LayoutGrid className="h-6 w-6 text-orange-400" aria-hidden />
              Conseils pour progresser
            </h2>
            <p className="max-w-2xl text-sm text-white/60 md:text-base">
              Extraits des fiches{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/80">tips</code> par priorité
              (rouge puis orange). Le détail complet reste dans le rapport ci‑dessous.
            </p>
          </div>
          {tipsCount > 0 && (
            <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300">
              {tipsCount} conseil{tipsCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {tipsCount === 0 ? (
          <p className="text-sm text-white/55">
            Aucun conseil prioritaire affiché ici : les dimensions en difficulté n’ont pas de fiche tip associée,
            ou tout est déjà au vert. Consultez le{' '}
            <button
              type="button"
              onClick={() => scrollTo('scoring-report-full')}
              className="font-medium text-orange-400 underline decoration-orange-500/40 underline-offset-2 hover:text-orange-300"
            >
              rapport complet
            </button>{' '}
            pour les synthèses.
          </p>
        ) : (
          <div className="space-y-8">
            {actionTips.red.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" aria-hidden />
                  Priorité rouge
                </h3>
                <div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  role="list"
                  aria-label="Conseils priorité rouge"
                >
                  {actionTips.red.map((row, i) => (
                    <article
                      key={`${row.qid}-${i}`}
                      role="listitem"
                      className="flex min-h-0 flex-col rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-relaxed text-white/90 shadow-lg shadow-black/20"
                    >
                      <p className="mb-2 text-xs font-semibold text-red-300">
                        {row.dimLabel} · {row.qid}
                      </p>
                      <p className="min-w-0 flex-1">{row.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
            {actionTips.orange.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-orange-500" aria-hidden />
                  Priorité orange
                </h3>
                <div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  role="list"
                  aria-label="Conseils priorité orange"
                >
                  {actionTips.orange.map((row, i) => (
                    <article
                      key={`${row.qid}-${i}`}
                      role="listitem"
                      className="flex min-h-0 flex-col rounded-2xl border border-orange-500/25 bg-orange-500/10 p-4 text-sm leading-relaxed text-white/90 shadow-lg shadow-black/20"
                    >
                      <p className="mb-2 text-xs font-semibold text-orange-200/90">
                        {row.dimLabel} · {row.qid}
                      </p>
                      <p className="min-w-0 flex-1">{row.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {orderedFlags.length > 0 && (
        <section
          id="scoring-alerts"
          className={`scroll-mt-28 mb-10 rounded-[3rem] border border-red-500/20 border-l-4 border-l-red-500 bg-red-500/5 p-6 pl-5 backdrop-blur-xl md:p-8`}
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-red-400 md:text-xl">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
            Alertes critiques
          </h2>
          <ul className="space-y-2">
            {orderedFlags.map((f) => (
              <li key={f} className="flex items-start gap-2 font-mono text-sm text-red-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {accordionSections.length > 0 && (
        <section id="scoring-report-full" className="scroll-mt-28 space-y-4">
          <h2 className="text-2xl font-bold text-white">Rapport complet</h2>
          <p className="text-sm text-white/60 md:text-base">
            Recommandations et détails — développez chaque bloc.
          </p>
          <div className="space-y-3">
            {accordionSections.map((sec) => {
              const key = sec.title
              const open = openSection === key
              const items = parseRecommendationLines(sec.body)
              return (
                <div key={key} className={`overflow-hidden rounded-[2rem] ${glassCard}`}>
                  <h3 className="hidden border-b border-gray-200 px-8 py-4 text-lg font-bold text-gray-900 print:block">
                    {sec.title}
                    {items.length > 0 ? (
                      <span className="ml-2 text-sm font-normal text-gray-500">({items.length})</span>
                    ) : null}
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-5 text-left transition hover:bg-white/[0.03] print:hidden md:px-8"
                    aria-expanded={open}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="text-base font-semibold text-white md:text-lg">{sec.title}</span>
                      {items.length > 0 && (
                        <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                          {items.length}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`border-t border-white/5 px-5 pb-5 pt-0 md:px-8 md:pb-8 print:!block ${open ? 'block' : 'hidden'}`}
                  >
                    {items.length > 0 ? (
                      <ul className="divide-y divide-white/5">
                        {items.map((item, i) => (
                          <li key={i} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:gap-4">
                            {item.code ? (
                              <span className="shrink-0 rounded-md bg-orange-500/15 px-2 py-0.5 font-mono text-xs text-orange-400">
                                {item.code}
                              </span>
                            ) : null}
                            <span className="text-sm leading-relaxed text-white/80">{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                        <div className="max-w-none pt-3 text-sm leading-relaxed text-white/80">
                          {sec.body.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0">
                              {formatPlainReportLine(line) || '\u00A0'}
                            </p>
                          ))}
                        </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {showUpgrade && <UpgradeModal open onClose={() => setShowUpgrade(false)} />}
    </div>
  )
}

function ragBarClass(rag: RAGStatus): string {
  if (rag === 'green') return 'bg-green-500'
  if (rag === 'red') return 'bg-red-500'
  if (rag === 'orange' || rag === 'capped_orange') return 'bg-orange-500'
  return 'bg-white/30'
}
