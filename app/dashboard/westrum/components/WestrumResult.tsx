'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  WESTRUM_CONTEXT_MESSAGES,
  WESTRUM_LEVEL_COLORS,
  WESTRUM_LEVEL_LABELS,
  WESTRUM_TARGET_SCORE,
  type WestrumNiveau,
  type WestrumScores,
} from '@/lib/westrum/constants'
import { WestrumHistory } from './WestrumHistory'

export type WestrumResultData = {
  scoreMoyen: number
  niveau: WestrumNiveau
  scores: WestrumScores
  persisted: boolean
  isLoggedIn: boolean
}

type Props = {
  result: WestrumResultData
  onRestart: () => void
}

export function WestrumResult({ result, onRestart }: Props) {
  const [showDoraPlaceholder, setShowDoraPlaceholder] = useState(false)
  const color = WESTRUM_LEVEL_COLORS[result.niveau]
  const label = WESTRUM_LEVEL_LABELS[result.niveau]

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Score Westrum
        </p>
        <p
          className="mt-3 font-mono text-5xl font-bold tabular-nums sm:text-6xl"
          style={{ color }}
        >
          {result.scoreMoyen.toFixed(1)}
          <span className="text-2xl font-semibold text-gray-400 sm:text-3xl"> / 7</span>
        </p>
        <p
          className="mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold tracking-wide text-white"
          style={{ background: color }}
        >
          Culture {label}
        </p>
        <p className="mt-6 text-sm text-gray-600">
          Cible DORA : {WESTRUM_TARGET_SCORE} / 7 — Culture générative
        </p>
      </div>

      <div
        className="rounded-2xl border-l-4 bg-white p-6 shadow-sm"
        style={{ borderLeftColor: color }}
      >
        <p className="text-sm leading-relaxed text-[#0f2240]">
          {WESTRUM_CONTEXT_MESSAGES[result.niveau]}
        </p>
      </div>

      {!result.isLoggedIn && (
        <div className="rounded-xl border border-[#138eec]/30 bg-[#138eec]/5 px-4 py-3 text-sm text-[#0f2240]">
          Connecte-toi pour suivre ton évolution dans le temps.{' '}
          <Link href="/login?redirect=%2Fdashboard%2Fwestrum" className="font-semibold text-[#138eec] hover:underline">
            Se connecter
          </Link>
        </div>
      )}

      {result.isLoggedIn && !result.persisted && (
        <p className="text-center text-sm text-amber-700">
          Résultat affiché localement — enregistrement en base indisponible pour l&apos;instant.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <button
          type="button"
          onClick={() => setShowDoraPlaceholder(true)}
          className="rounded-full border-2 border-[#0f2240] px-5 py-2.5 text-sm font-semibold text-[#0f2240] transition hover:bg-[#0f2240] hover:text-white"
        >
          Comparer avec mon score DORA
        </button>
        <Link
          href="/dashboard/edmondson"
          className="rounded-full bg-[#c9973a] px-5 py-2.5 text-center text-sm font-semibold text-[#0f2240] transition hover:bg-[#b8872f]"
        >
          Passer le questionnaire Edmondson
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
        >
          Refaire le questionnaire
        </button>
      </div>

      {showDoraPlaceholder && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
          Fonctionnalité à venir — comparaison Westrum × métriques DORA.
        </div>
      )}

      {result.isLoggedIn && result.persisted && <WestrumHistory />}
    </div>
  )
}
