'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import type { WestrumQuestionId } from '@/lib/westrum/constants'
import { WestrumForm } from './WestrumForm'
import { WestrumResult, type WestrumResultData } from './WestrumResult'

const RECENT_DAYS = 60

export function WestrumSurvey() {
  const { data: session } = useSession()
  const [phase, setPhase] = useState<'form' | 'result'>('form')
  const [result, setResult] = useState<WestrumResultData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [recentWarningDate, setRecentWarningDate] = useState<string | null>(null)

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

  const handleComplete = async (scores: Record<WestrumQuestionId, number>) => {
    setSubmitting(true)
    try {
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
        isLoggedIn: !!session?.user,
      })
      setPhase('result')
    } finally {
      setSubmitting(false)
    }
  }

  const restart = () => {
    setPhase('form')
    setResult(null)
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
      ) : result ? (
        <WestrumResult result={result} onRestart={restart} />
      ) : null}
    </div>
  )
}
