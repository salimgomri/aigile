'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Sparkles } from 'lucide-react'
import { OKR_QUESTIONS } from '@/lib/okr/checkin-schema'
import type { OkrCheckInRow, TeamDashboardRag } from '@/lib/okr/checkin-store'
import { CADRAN_LABELS, ragStyles, scoreToRag } from '@/lib/okr/rag-display'

type Props = {
  teamId: string
  checkIn: OkrCheckInRow
  rag: TeamDashboardRag | null
}

export function CheckInDetail({ teamId, checkIn, rag }: Props) {
  const [summary, setSummary] = useState(checkIn.ai_summary ?? '')
  const [loading, setLoading] = useState(false)
  const [creditError, setCreditError] = useState<string | null>(null)

  const sprintNum = checkIn.sprint?.number ?? '?'
  const dateLabel = format(new Date(checkIn.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })

  const generateSummary = async () => {
    setLoading(true)
    setCreditError(null)
    try {
      const res = await fetch('/api/okr-checkin/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, checkInId: checkIn.id }),
      })
      const data = await res.json()
      if (res.status === 402) {
        setCreditError('Crédits insuffisants — 1 crédit requis pour la synthèse IA.')
        return
      }
      if (!res.ok) {
        setCreditError(data.error ?? 'Erreur')
        return
      }
      setSummary(data.summary)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FEBD10]">OKR Check-in</p>
        <h1 className="mt-1 text-2xl font-bold text-[#0f2240]">Sprint {sprintNum}</h1>
        <p className="mt-1 text-sm text-gray-500">{dateLabel}</p>
      </header>

      {rag ? (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
            Cadrans RAG du sprint (lecture seule)
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CADRAN_LABELS.map(({ key, label }) => {
              const score = rag[key]
              const level = scoreToRag(score)
              const style = ragStyles(level)
              return (
                <div
                  key={key}
                  className="rounded-lg border px-3 py-2"
                  style={{ background: style.bg, borderColor: style.border }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
                  <p className="font-mono text-lg font-bold" style={{ color: style.text }}>
                    {score != null ? `${score}%` : '—'}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Pas de cadrans RAG enregistrés pour ce sprint — le check-in reste valide sans ancrage métriques.
        </p>
      )}

      <section className="space-y-4">
        {(['avance', 'frein', 'ajustement'] as const).map((key) => (
          <div
            key={key}
            className={
              key === 'ajustement'
                ? 'rounded-xl border-2 border-[#0ba4a0]/40 bg-[#0ba4a0]/5 p-5'
                : 'rounded-xl border border-gray-200 bg-white p-5'
            }
          >
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {key === 'avance' ? 'Avancé' : key === 'frein' ? 'Frein' : 'Ajustement'}
            </h3>
            <p className="mt-1 text-xs text-gray-500">{OKR_QUESTIONS[key]}</p>
            <p
              className={`mt-3 whitespace-pre-wrap text-sm leading-relaxed ${
                key === 'ajustement' ? 'font-semibold text-[#0f2240]' : 'text-gray-700'
              }`}
            >
              {checkIn[key]}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[#138eec]/25 bg-[#138eec]/5 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#0f2240]">
            <Sparkles className="h-4 w-4 text-[#138eec]" />
            Synthèse IA manager
          </h2>
          <button
            type="button"
            onClick={generateSummary}
            disabled={loading}
            className="rounded-full bg-[#138eec] px-4 py-2 text-xs font-bold text-white hover:bg-[#0f7ad4] disabled:opacity-50"
          >
            {loading ? 'Génération…' : summary ? 'Régénérer (1 cr.)' : 'Générer (1 crédit)'}
          </button>
        </div>
        {creditError ? <p className="mb-2 text-sm text-red-600">{creditError}</p> : null}
        {summary ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{summary}</p>
        ) : (
          <p className="text-sm text-gray-500">
            Synthèse optionnelle pour le manager — 1 crédit par génération, tracée dans l&apos;admin.
          </p>
        )}
      </section>
    </div>
  )
}
