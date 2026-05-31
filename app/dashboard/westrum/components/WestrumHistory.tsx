'use client'

import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { WESTRUM_TARGET_SCORE } from '@/lib/westrum/constants'

type HistoryPoint = {
  id: string
  score_moyen: number
  niveau: string
  created_at: string
}

export function WestrumHistory() {
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/westrum/history', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d: { history?: HistoryPoint[] }) => {
        if (!cancelled) setHistory(d.history ?? [])
      })
      .catch(() => {
        if (!cancelled) setHistory([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const chartData = useMemo(
    () =>
      history.map((row) => ({
        id: row.id,
        label: format(new Date(row.created_at), 'MMM yyyy', { locale: fr }),
        score: row.score_moyen,
        niveau: row.niveau,
      })),
    [history]
  )

  if (loading) {
    return (
      <div className="h-48 animate-pulse rounded-2xl bg-gray-100" aria-busy aria-label="Chargement historique" />
    )
  }

  if (chartData.length < 2) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
        Passe le questionnaire au moins deux fois (espacées dans le temps) pour voir l&apos;évolution
        de ton score Westrum.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#0f2240]">
        Évolution de ton score Westrum
      </h3>
      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis domain={[0, 7]} ticks={[0, 1, 2, 3, 4, 5, 6, 7]} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip
              formatter={(value) => [
                `${Number(value ?? 0).toFixed(1)} / 7`,
                'Score',
              ]}
              labelFormatter={(label) => String(label)}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <ReferenceLine
              y={WESTRUM_TARGET_SCORE}
              stroke="#16a34a"
              strokeDasharray="4 4"
              label={{ value: 'Cible 5.5', position: 'insideTopRight', fill: '#16a34a', fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#FEBD10"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#FEBD10', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
