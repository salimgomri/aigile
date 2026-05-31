'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import type { WestrumQuestionId } from '@/lib/westrum/constants'
import { WestrumForm } from './WestrumForm'
import { WestrumResult, type WestrumResultData } from './WestrumResult'

const RECENT_DAYS = 60
const PENDING_KEY = 'westrum_pending_scores'
const LOGIN_REDIRECT = '/login?redirect=%2Fdashboard%2Fwestrum'
const REGISTER_REDIRECT = '/register?redirect=%2Fdashboard%2Fwestrum'

export function WestrumSurvey() {
  const { data: session } = useSession()
  const [phase, setPhase] = useState<'form' | 'gate' | 'result'>('form')
  const [result, setResult] = useState<WestrumResultData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [recentWarningDate, setRecentWarningDate] = useState<string | null>(null)

  const submitScores = useCallback(async (scores: Record<WestrumQuestionId, number>) => {
    const res = await fetch('/api/westrum/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores }),
      credentials: 'same-origin',
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      alert((j as { error?: string }).error || 'Erreur lors de la soumission.')
      return
    }
    const data = await res.json()
    setResult({
      scoreMoyen: data.scoreMoyen,
      niveau: data.niveau,
      scores: data.scores,
      persisted: !!data.persisted,
      isLoggedIn: true,
    })
    setPhase('result')
  }, [])

  const loadRecent = useCallback(async () => {
    if (!session?.user) {
      setRecentWarningDate(null)
      return
    }
    try {
      const res = await fetch('/api/westrum/history', { credentials: 'same-origin' })
      const data = await res.json()
      const latest = data.latest as { created_at: string } | null
      if (!latest?.created_at) {
        setRecentWarningDate(null)
        return
      }
      const diffMs = Date.now() - new Date(latest.created_at).getTime()
      const diffDays = diffMs / (1000 * 60 * 60 * 24)
      setRecentWarningDate(diffDays < RECENT_DAYS ? latest.created_at : null)
    } catch {
      setRecentWarningDate(null)
    }
  }, [session?.user])

  useEffect(() => {
    loadRecent()
  }, [loadRecent])

  // Après connexion : si des réponses sont en attente (saisies avant login), on affiche
  // directement le résultat — sans redemander de refaire le questionnaire.
  useEffect(() => {
    if (!session?.user || typeof window === 'undefined') return
    const pending = sessionStorage.getItem(PENDING_KEY)
    if (!pending) return
    sessionStorage.removeItem(PENDING_KEY)
    try {
      const scores = JSON.parse(pending) as Record<WestrumQuestionId, number>
      setSubmitting(true)
      submitScores(scores).finally(() => setSubmitting(false))
    } catch {
      /* réponses corrompues : on ignore, l'utilisateur peut refaire le test */
    }
  }, [session?.user, submitScores])

  const handleComplete = async (scores: Record<WestrumQuestionId, number>) => {
    // Parcours sans compte autorisé : on garde les réponses et on invite à se connecter
    // gratuitement pour consulter le résultat (cohérent avec les autres outils).
    if (!session?.user) {
      try {
        sessionStorage.setItem(PENDING_KEY, JSON.stringify(scores))
      } catch {
        /* sessionStorage indisponible : on continue, le gate reste affiché */
      }
      setPhase('gate')
      return
    }
    setSubmitting(true)
    try {
      await submitScores(scores)
    } finally {
      setSubmitting(false)
    }
  }

  const restart = () => {
    setPhase('form')
    setResult(null)
    try {
      sessionStorage.removeItem(PENDING_KEY)
    } catch {
      /* noop */
    }
    loadRecent()
  }

  return (
    <div className="bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      {phase === 'form' ? (
        <WestrumForm
          recentWarningDate={recentWarningDate}
          onComplete={handleComplete}
          submitting={submitting}
        />
      ) : phase === 'gate' ? (
        <WestrumResultGate />
      ) : result ? (
        <WestrumResult result={result} onRestart={restart} />
      ) : null}
    </div>
  )
}

/** Fin de parcours sans compte : invitation positive à se connecter pour voir le résultat. */
function WestrumResultGate() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEBD10]/15 text-2xl">
        🎉
      </div>
      <h2 className="text-xl font-bold text-[#0f2240] sm:text-2xl">Tes résultats sont prêts</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
        Connecte-toi gratuitement pour découvrir ton score Westrum et le diagnostic de ta culture
        organisationnelle. Tes réponses sont conservées — pas besoin de recommencer.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={LOGIN_REDIRECT}
          className="rounded-full bg-[#FEBD10] px-6 py-3 text-sm font-bold text-[#0f2240] transition hover:brightness-105"
        >
          Voir mes résultats — connexion gratuite
        </Link>
        <Link
          href={REGISTER_REDIRECT}
          className="rounded-full border-2 border-[#0f2240] px-6 py-3 text-sm font-semibold text-[#0f2240] transition hover:bg-[#0f2240] hover:text-white"
        >
          Créer un compte gratuit
        </Link>
      </div>
    </div>
  )
}
