'use client'

import { useMemo, useState, type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import { Sparkles, Target, TrendingUp, Users, BarChart3, Layers, Calendar } from 'lucide-react'
import type { RetroInsights, ScoringInsights } from '@/lib/admin/aggregate-tool-insights'
import { PATTERNS, type PatternCode } from '@/lib/retro/patterns'

const GOLD = '#c9973a'
const GOLD_DIM = 'rgba(201, 151, 58, 0.35)'
const TEAL = '#0d9488'

const RETRO_ACTION_LABELS: Record<string, string> = {
  retro_ai_plan: 'Plan rétro IA',
  retro_random: 'Rétro aléatoire',
  retro_pdf: 'Export PDF',
}

const RAG_LABELS: Record<string, string> = {
  red: 'Rouge',
  orange: 'Orange',
  green: 'Vert',
  capped_orange: 'Plafonné',
  na: 'N/A',
  '—': '—',
}

function patternLabelFr(code: string): string {
  const c = code as PatternCode
  return PATTERNS[c]?.nameFr ?? code
}

type Props = {
  retro: RetroInsights
  scoring: ScoringInsights
}

export function AdminToolInsights({ retro, scoring }: Props) {
  const [tab, setTab] = useState<'retro' | 'scoring'>('retro')

  const maxPattern = useMemo(
    () => Math.max(1, ...retro.patternCounts.map((p) => p.count)),
    [retro.patternCounts]
  )

  const maxRag = useMemo(
    () => Math.max(1, ...scoring.ragCounts.map((r) => r.count)),
    [scoring.ragCounts]
  )

  const maxBucket = useMemo(
    () => Math.max(1, ...scoring.scoreBuckets.map((b) => b.count)),
    [scoring.scoreBuckets]
  )

  return (
    <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
      <div className="border-b border-border/80 bg-muted/20 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-aigile-gold" />
              Insights détaillés
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Rétro IA et Score livraison — volumes, patterns et distribution des scores.
            </p>
          </div>
          <div className="flex rounded-xl border border-border bg-background/80 p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setTab('retro')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === 'retro'
                  ? 'bg-aigile-gold text-black shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              Rétro IA
            </button>
            <button
              type="button"
              onClick={() => setTab('scoring')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === 'scoring'
                  ? 'bg-aigile-gold text-black shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Target className="h-4 w-4 shrink-0" />
              Score livraison
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {tab === 'retro' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi
                icon={<BarChart3 className="h-4 w-4" />}
                label="Utilisations (toutes actions)"
                value={retro.totalUses}
                hint="Débits crédits liés à l’outil Rétro"
              />
              <Kpi
                icon={<Users className="h-4 w-4" />}
                label="Utilisateurs distincts"
                value={retro.uniqueUsers}
              />
              <Kpi
                icon={<TrendingUp className="h-4 w-4" />}
                label="Crédits enregistrés"
                value={retro.totalCreditsRecorded}
                hint="Somme des coûts enregistrés (hors illimité = 0)"
              />
              <Kpi
                icon={<Calendar className="h-4 w-4" />}
                label="Moy. / jour (30 j.)"
                value={retro.avgUsesPerDayLast30.toFixed(1)}
                hint={`${retro.activeDaysLast30} jours actifs sur 30`}
              />
            </div>

            {retro.plansAiTotal > 0 && retro.plansWithPatternRecorded < retro.plansAiTotal && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-900 dark:text-amber-100/90">
                <strong className="font-semibold">Patterns :</strong> détail enregistré pour{' '}
                {retro.plansWithPatternRecorded} / {retro.plansAiTotal} plans IA — les générations
                antérieures au déploiement du suivi peuvent ne pas avoir de code pattern.
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Répartition par action</h3>
                <div className="space-y-3">
                  {retro.byAction.map((row) => {
                    const pct = retro.totalUses > 0 ? Math.round((row.count / retro.totalUses) * 100) : 0
                    return (
                      <div key={row.action}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-medium text-foreground">
                            {RETRO_ACTION_LABELS[row.action] ?? row.action}
                          </span>
                          <span className="text-muted-foreground">
                            {row.count} · {row.uniqueUsers} util. · {pct}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-aigile-gold to-amber-600 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  {retro.byAction.length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucune donnée.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Patterns détectés (plan IA)
                </h3>
                {retro.patternCounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun pattern enregistré pour l’instant — les prochains débits « plan IA »
                    alimenteront ce graphique.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {retro.patternCounts.map((p) => {
                      const pct = Math.round((p.count / maxPattern) * 100)
                      return (
                        <div key={p.code}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-medium text-foreground">
                              <span className="font-mono text-aigile-gold">{p.code}</span>{' '}
                              <span className="text-muted-foreground">
                                — {patternLabelFr(p.code)}
                              </span>
                            </span>
                            <span className="text-muted-foreground">{p.count}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">Fréquence (30 derniers jours)</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Nombre d’utilisations par jour (toutes actions Rétro confondues).
              </p>
              <div className="h-[220px] w-full rounded-xl border border-border/80 bg-muted/10 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retro.dailyLast30} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                      interval={4}
                      stroke="hsl(var(--border))"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      stroke="hsl(var(--border))"
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted) / 0.25)' }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const p = payload[0].payload as (typeof retro.dailyLast30)[0]
                        return (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                            <div className="font-medium">{p.date}</div>
                            <div className="text-muted-foreground">{p.count} utilisation(s)</div>
                          </div>
                        )
                      }}
                    />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                      {retro.dailyLast30.map((_, i) => (
                        <Cell key={i} fill={i % 7 === 5 || i % 7 === 6 ? GOLD_DIM : GOLD} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'scoring' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Kpi
                icon={<BarChart3 className="h-4 w-4" />}
                label="Sessions terminées"
                value={scoring.completedSessions}
              />
              <Kpi
                icon={<Users className="h-4 w-4" />}
                label="Utilisateurs distincts"
                value={scoring.uniqueUsers}
              />
              <Kpi
                icon={<Target className="h-4 w-4" />}
                label="Score min"
                value={scoring.scoreMin != null ? scoring.scoreMin.toFixed(1) : '—'}
                variant="cool"
              />
              <Kpi
                icon={<TrendingUp className="h-4 w-4" />}
                label="Score moyen"
                value={scoring.scoreAvg != null ? scoring.scoreAvg.toFixed(1) : '—'}
              />
              <Kpi
                icon={<Sparkles className="h-4 w-4" />}
                label="Score max"
                value={scoring.scoreMax != null ? scoring.scoreMax.toFixed(1) : '—'}
                variant="warm"
              />
            </div>

            {scoring.scoreMedian != null && (
              <div className="rounded-xl border border-border bg-muted/15 px-4 py-3 text-center text-sm">
                <span className="text-muted-foreground">Médiane : </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {scoring.scoreMedian.toFixed(1)}
                </span>
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">RAG global</h3>
                {scoring.ragCounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune session complétée.</p>
                ) : (
                  <div className="space-y-3">
                    {scoring.ragCounts.map((r) => {
                      const pct = Math.round((r.count / maxRag) * 100)
                      const color =
                        r.rag === 'green'
                          ? 'from-emerald-600 to-emerald-400'
                          : r.rag === 'orange' || r.rag === 'capped_orange'
                            ? 'from-amber-600 to-amber-400'
                            : r.rag === 'red'
                              ? 'from-rose-600 to-rose-400'
                              : 'from-slate-500 to-slate-400'
                      return (
                        <div key={r.rag}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-medium capitalize text-foreground">
                              {RAG_LABELS[r.rag] ?? r.rag}
                            </span>
                            <span className="text-muted-foreground">{r.count}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${color}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Distribution des scores globaux
                </h3>
                {scoring.completedSessions === 0 ? (
                  <p className="text-sm text-muted-foreground">Pas encore de scores.</p>
                ) : (
                  <div className="space-y-3">
                    {scoring.scoreBuckets.map((b) => {
                      const pct = Math.round((b.count / maxBucket) * 100)
                      return (
                        <div key={b.range}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-mono text-foreground">{b.range}</span>
                            <span className="text-muted-foreground">{b.count}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">Activité (30 derniers jours)</h3>
              <p className="mb-3 text-xs text-muted-foreground">Sessions complétées par jour.</p>
              <div className="h-[220px] w-full rounded-xl border border-border/80 bg-muted/10 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scoring.dailyLast30}
                    margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                      interval={4}
                      stroke="hsl(var(--border))"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      stroke="hsl(var(--border))"
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted) / 0.25)' }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const p = payload[0].payload as (typeof scoring.dailyLast30)[0]
                        return (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                            <div className="font-medium">{p.date}</div>
                            <div className="text-muted-foreground">{p.count} session(s)</div>
                          </div>
                        )
                      }}
                    />
                    <Bar dataKey="count" fill={TEAL} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {scoring.monthlyCompleted.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Volumes par mois</h3>
                <div className="flex flex-wrap gap-2">
                  {scoring.monthlyCompleted.map((m) => (
                    <div
                      key={m.month}
                      className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs"
                    >
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="ml-2 font-semibold tabular-nums text-foreground">{m.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Kpi({
  icon,
  label,
  value,
  hint,
  variant = 'default',
}: {
  icon: ReactNode
  label: string
  value: string | number
  hint?: string
  variant?: 'default' | 'cool' | 'warm'
}) {
  const ring =
    variant === 'cool'
      ? 'ring-teal-500/20'
      : variant === 'warm'
        ? 'ring-orange-500/20'
        : 'ring-aigile-gold/15'
  return (
    <div
      className={`rounded-xl border border-border bg-card/80 p-4 shadow-sm ring-1 ${ring} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2 text-aigile-gold">{icon}</div>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">{value}</p>
      <p className="text-xs font-medium leading-snug text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-[10px] text-muted-foreground/80">{hint}</p>}
    </div>
  )
}
