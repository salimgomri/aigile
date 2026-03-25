'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { SessionSummary } from '@/types/scoring'

const LINE_ORANGE = '#f5a623'

type HistoryState = {
  sessions: SessionSummary[]
  hasMore: boolean
}

export function ScoringHistory() {
  const [data, setData] = useState<HistoryState>({ sessions: [], hasMore: false })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [teamName, setTeamName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (before?: string, append = false) => {
      const params = new URLSearchParams()
      if (before) params.set('before', before)
      if (teamName) params.set('teamName', teamName)
      const url = `/api/scoring/history?${params.toString()}`
      const res = await fetch(url)
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Erreur chargement historique')
      }
      const json = (await res.json()) as HistoryState
      if (append) {
        setData((d) => ({
          sessions: [...d.sessions, ...json.sessions],
          hasMore: json.hasMore,
        }))
      } else {
        setData(json)
      }
    },
    [teamName]
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    load(undefined, false)
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [load])

  const teamOptions = useMemo(() => {
    const s = new Set<string>()
    for (const row of data.sessions) {
      if (row.teamName) s.add(row.teamName)
    }
    return [...s].sort()
  }, [data.sessions])

  const chartData = useMemo(() => {
    const chronological = [...data.sessions].sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    )
    return chronological.map((row, i) => ({
      index: i + 1,
      label: row.sprintNumber ? `S${row.sprintNumber}` : `#${i + 1}`,
      score: row.scoreGlobal,
      blocking: row.blockingRuleApplied,
      completedAt: row.completedAt,
      teamName: row.teamName,
    }))
  }, [data.sessions])

  const lastCursor = data.sessions.length
    ? data.sessions[data.sessions.length - 1].completedAt
    : null

  const onLoadMore = async () => {
    if (!data.hasMore || !lastCursor || loadingMore) return
    setLoadingMore(true)
    try {
      await load(lastCursor, true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60 backdrop-blur-xl">
        Chargement de l&apos;historique…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
        {error}
      </div>
    )
  }

  if (data.sessions.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60 backdrop-blur-xl">
        Aucune session terminée pour l&apos;instant.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Tendance des scores</h2>
          {teamOptions.length > 1 && (
            <label className="flex items-center gap-2 text-sm">
              <span className="text-white/50">Équipe</span>
              <select
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#1e293b] px-3 py-2 text-sm text-white"
              >
                <option value="">Toutes</option>
                {teamOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <p className="text-xs text-white/50">
          Historique des évaluations terminées (rapport généré, crédits débités). Connecté uniquement — une ligne
          par session complétée.
        </p>
        {data.sessions.length === 1 && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
            Une seule session pour l&apos;instant : la courbe affiche un point. À partir de la prochaine
            évaluation terminée, vous verrez l&apos;évolution du score global dans le temps.
          </div>
        )}
      </div>

      <div className="h-[280px] w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }} stroke="rgba(255,255,255,0.1)" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }} stroke="rgba(255,255,255,0.1)" />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const p = payload[0].payload as (typeof chartData)[0]
                return (
                  <div className="rounded-lg border border-white/10 bg-[#1e293b] px-3 py-2 text-xs shadow-lg text-white">
                    <div className="font-semibold">Score {p.score.toFixed(1)}</div>
                    {p.teamName && <div className="text-white/80">{p.teamName}</div>}
                    <div className="text-white/50">
                      {new Date(p.completedAt).toLocaleString('fr-FR')}
                    </div>
                    {p.blocking && (
                      <div className="mt-1 font-medium text-orange-400">PLAFONNÉ</div>
                    )}
                  </div>
                )
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={LINE_ORANGE}
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props
                const blocking = (payload as { blocking?: boolean }).blocking
                if (blocking) {
                  return (
                    <rect
                      x={(cx ?? 0) - 5}
                      y={(cy ?? 0) - 5}
                      width={10}
                      height={10}
                      fill={LINE_ORANGE}
                    />
                  )
                }
                return <circle cx={cx} cy={cy} r={5} fill={LINE_ORANGE} />
              }}
              activeDot={{ r: 7, fill: LINE_ORANGE }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-white/50">
        Carrés orange = session avec quality gate (plafonnement). Ronds = sinon.
      </p>

      {data.hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loadingMore}
          className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#1e293b] text-sm font-medium text-white/90 transition hover:bg-[#334155] disabled:opacity-50"
        >
          {loadingMore ? 'Chargement…' : 'Charger plus'}
        </button>
      )}
    </div>
  )
}
