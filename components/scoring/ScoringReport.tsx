'use client'

import Link from 'next/link'
import { useMemo, useState, type CSSProperties } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { ChevronDown, AlertTriangle, ArrowLeft, FileDown } from 'lucide-react'
import type { DimensionId, RAGStatus, ScoreResult, ScoringSession } from '@/types/scoring'
import type { ClientSafeModel } from '@/lib/scoring/schema'
import './scoring-print.css'

const DIM_ORDER: DimensionId[] = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']

const ACCENT_ORANGE = '#f5a623'

const SKIP_MARKDOWN_TITLES = new Set([
  'score global',
  'dimensions',
  'alertes critiques',
])

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

function globalScoreColor(rag: RAGStatus): string {
  if (rag === 'green') return 'text-green-400'
  if (rag === 'red') return 'text-red-400'
  if (rag === 'orange' || rag === 'capped_orange') return 'text-orange-400'
  return 'text-white/80'
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

  const markdownSections = useMemo(() => splitMarkdownH2(reportMarkdown), [reportMarkdown])
  const accordionSections = useMemo(
    () =>
      markdownSections.filter((s) => !SKIP_MARKDOWN_TITLES.has(s.title.toLowerCase().trim())),
    [markdownSections]
  )

  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggle = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key))
  }

  const glassCard = 'bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/50'
  const glassInner = 'bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10'

  return (
    <div className="w-full max-w-none text-white print:max-w-none">
      {/* Barre navigation — alignée Retro result */}
      <div
        data-no-print
        className="relative z-30 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-black/40 px-4 py-5 backdrop-blur-2xl md:rounded-2xl md:border md:border-white/10 md:px-6"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-gray-400 transition-all hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Accueil</span>
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-white/20"
          >
            <FileDown className="h-4 w-4" />
            Exporter PDF
          </button>
          <button
            type="button"
            onClick={onNewSession}
            className="min-h-[44px] rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02] hover:from-orange-400 hover:to-orange-500"
          >
            Nouvelle évaluation
          </button>
        </div>
      </div>

      {/* Hero — même principe que l’intro Retro (rounded-[3rem], glass) */}
      <section
        className={`mb-10 rounded-[3rem] p-8 md:p-12 lg:p-16 ${glassCard}`}
      >
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
                Score global
              </div>
              <p
                className={`font-semibold tabular-nums leading-none ${globalScoreColor(globalRag)}`}
                style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}
              >
                {scoreResult.score_global.toFixed(1)}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1.5 font-mono text-xs font-semibold ${ragPillClasses(globalRag)}`}
                >
                  {globalRag}
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
                Utilisez le radar et le tableau des dimensions pour prioriser les axes d&apos;amélioration.
                Le rapport détaillé en bas synthétise les recommandations par niveau de priorité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Radar */}
      <section className={`mb-10 rounded-[3rem] p-6 md:p-8 ${glassCard}`}>
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

      {/* Dimensions */}
      <section className={`mb-10 overflow-hidden rounded-[3rem] ${glassCard}`}>
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
                    {ds.rag}
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

      {orderedFlags.length > 0 && (
        <section
          className={`mb-10 rounded-[3rem] border border-red-500/20 border-l-4 border-l-red-500 bg-red-500/5 p-6 pl-5 backdrop-blur-xl md:p-8`}
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
        <section className="space-y-4">
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
                <div
                  key={key}
                  className={`overflow-hidden rounded-[2rem] ${glassCard}`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-5 text-left transition hover:bg-white/[0.03] md:px-8"
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
                  {open && (
                    <div className="border-t border-white/5 px-5 pb-5 pt-0 md:px-8 md:pb-8">
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
                              {line || '\u00A0'}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function ragBarClass(rag: RAGStatus): string {
  if (rag === 'green') return 'bg-green-500'
  if (rag === 'red') return 'bg-red-500'
  if (rag === 'orange' || rag === 'capped_orange') return 'bg-orange-500'
  return 'bg-white/30'
}
