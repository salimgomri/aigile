'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import type {
  CadrageAnswers,
  DimensionId,
  ScoreResult,
  ScoringAnswer,
  ScoringSession,
} from '@/types/scoring'
import type { CadrageItem, ClientSafeModel, ClientSafeQuestion } from '@/lib/scoring/schema'
import { QuestionCard } from '@/components/scoring/QuestionCard'
import { DimensionNav } from '@/components/scoring/DimensionNav'
import { ScoringReport } from '@/components/scoring/ScoringReport'
import { ScoringHistory } from '@/components/scoring/ScoringHistory'
import { SprintDateField } from '@/components/scoring/SprintDateField'
import { ScoringCompletionGate } from '@/components/scoring/ScoringCompletionGate'
import { ScoringRagAmbient } from '@/components/scoring/ScoringRagAmbient'
import { SCORING_DELIVERABLE_COST } from '@/lib/credits/costs'
import {
  buildLocalhostMockScoringResult,
  isScoringDevLocalhost,
} from '@/lib/scoring/dev-localhost-mock'

const PENDING_FINALIZE_KEY = 'scoring-pending-finalize-v1'

type PendingFinalizePayload = {
  v: 1
  cadrageAnswers: CadrageAnswers
  answers: Array<{
    dimension_id: DimensionId
    question_id: string
    answer_key: string
    score_value: number
  }>
  teamName: string
  sprintNumber: string
  sprintEndDate: string
}

function filterActiveQuestions(
  cadrage: CadrageAnswers,
  all: ClientSafeQuestion[],
  currentAnswers: ScoringAnswer[]
): ClientSafeQuestion[] {
  const levelMap = { a: 'short', b: 'medium', c: 'long' } as const
  const level = levelMap[cadrage.C5]
  return all.filter((q) => {
    if (!q.detail_level.includes(level)) return false
    if (q.dimension === 'd8' && cadrage.C7 === 'b') return false
    return (q.conditions ?? []).every((c) => {
      if (c.type === 'cadrage_based') {
        const vals = c.not_in_values
        if (!vals?.length) return true
        const key = c.question_id as keyof CadrageAnswers
        return !vals.includes(cadrage[key])
      }
      if (c.type === 'answer_based') {
        const a = currentAnswers.find((x) => x.question_id === c.question_id)
        return a ? c.in_values.includes(a.answer_key) : false
      }
      return true
    })
  })
}

function upsertAnswer(prev: ScoringAnswer[], next: ScoringAnswer): ScoringAnswer[] {
  const i = prev.findIndex((a) => a.question_id === next.question_id)
  if (i === -1) return [...prev, next]
  const copy = [...prev]
  copy[i] = next
  return copy
}

function firstUnanswered(
  active: ClientSafeQuestion[],
  answers: ScoringAnswer[]
): ClientSafeQuestion | null {
  const answered = new Set(answers.map((a) => a.question_id))
  return active.find((q) => !answered.has(q.id)) ?? null
}

function allAnswered(active: ClientSafeQuestion[], answers: ScoringAnswer[]): boolean {
  if (active.length === 0) return false
  const answered = new Set(answers.map((a) => a.question_id))
  return active.every((q) => answered.has(q.id))
}

function progressLabel(
  active: ClientSafeQuestion[],
  current: ClientSafeQuestion | null,
  model: ClientSafeModel
): string {
  if (!current) return ''
  const dimsOrder = [...new Set(active.map((q) => q.dimension))]
  const dimIdx = dimsOrder.indexOf(current.dimension) + 1
  const dimLabel = model.dimensions[current.dimension].label_fr
  const inDim = active.filter((q) => q.dimension === current.dimension)
  const qIdx = inDim.findIndex((q) => q.id === current.id) + 1
  return `Dimension ${dimIdx}/${dimsOrder.length} — ${dimLabel} · Question ${qIdx}/${inDim.length}`
}

function pendingToAnswers(p: PendingFinalizePayload): ScoringAnswer[] {
  return p.answers.map((a) => ({
    session_id: '',
    dimension_id: a.dimension_id,
    question_id: a.question_id,
    answer_key: a.answer_key,
    score_value: a.score_value,
  }))
}

export interface ScoringWizardProps {
  allQuestions: ClientSafeQuestion[]
  scoringModel: ClientSafeModel
  cadrageItems: CadrageItem[]
}

export function ScoringWizard({ allQuestions, scoringModel, cadrageItems }: ScoringWizardProps) {
  const router = useRouter()
  const { data: authSession } = useSession()
  const pendingFinalizeRan = useRef(false)

  const [step, setStep] = useState<'cadrage' | 'questions' | 'result'>('cadrage')
  const [cadrageAnswers, setCadrage] = useState<CadrageAnswers>({
    C2: 'a',
    C4: 'b',
    C5: 'c',
    C7: 'a',
  })
  const [activeQuestions, setActiveQuestions] = useState<ClientSafeQuestion[]>([])
  const [answers, setAnswers] = useState<ScoringAnswer[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [draftSession, setDraft] = useState<ScoringSession | null>(null)
  const [isCalculating, setCalculating] = useState(false)
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [reportMarkdown, setReport] = useState<string | null>(null)
  const [sessionForReport, setSessionForReport] = useState<ScoringSession | null>(null)
  const [showLowCreditModal, setShowLowCreditModal] = useState(false)
  const [creditBalance, setCreditBalance] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [teamName, setTeamName] = useState('')
  const [sprintNumber, setSprintNumber] = useState('')
  const [sprintEndDate, setSprintEndDate] = useState('')
  const [jumpTarget, setJumpTarget] = useState<string | null>(null)

  const currentQuestion = useMemo(() => {
    if (jumpTarget) {
      const q = activeQuestions.find((x) => x.id === jumpTarget)
      if (q) return q
    }
    return firstUnanswered(activeQuestions, answers)
  }, [activeQuestions, answers, jumpTarget])

  const answersByQuestionId = useMemo(
    () => Object.fromEntries(answers.map((a) => [a.question_id, a.answer_key])),
    [answers]
  )

  const currentDim: DimensionId | null = currentQuestion?.dimension ?? null

  useEffect(() => {
    if (!authSession?.user) return
    let cancelled = false
    ;(async () => {
      const res = await fetch('/api/scoring/sessions/draft')
      if (res.status === 401) return
      if (!res.ok) return
      const { session } = (await res.json()) as { session: ScoringSession | null }
      if (!cancelled && session) setDraft(session)
    })()
    return () => {
      cancelled = true
    }
  }, [authSession?.user?.id])

  const resolveScore = useCallback(
    (q: ClientSafeQuestion, answerKey: string) => {
      const scale = scoringModel.scales[q.scale_id]
      const v = scale?.[answerKey]
      return typeof v === 'number' ? v : 0
    },
    [scoringModel.scales]
  )

  const startNewSession = useCallback(() => {
    pendingFinalizeRan.current = false
    setStep('cadrage')
    setCadrage({ C2: 'a', C4: 'b', C5: 'c', C7: 'a' })
    setAnswers([])
    setSessionId(null)
    setScoreResult(null)
    setReport(null)
    setSessionForReport(null)
    setActiveQuestions([])
    setDraft(null)
    setJumpTarget(null)
    setErrorMessage(null)
    setCreditBalance(0)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(PENDING_FINALIZE_KEY)
    }
  }, [])

  const resumeDraft = async () => {
    const s = draftSession
    if (!s) return
    const res = await fetch(`/api/scoring/session/${s.id}`)
    if (res.status === 401) {
      router.push('/login?redirect=' + encodeURIComponent('/scoring-deliverable'))
      return
    }
    if (!res.ok) return
    const { session: fullSession, answers: existingAnswers } = (await res.json()) as {
      session: ScoringSession
      answers: ScoringAnswer[]
    }
    const restoredCadrage: CadrageAnswers = {
      C2: fullSession.org_context as CadrageAnswers['C2'],
      C4: {
        'non-tech': 'a',
        intermediate: 'b',
        expert: 'c',
      }[fullSession.respondent_role!] as CadrageAnswers['C4'],
      C5: {
        short: 'a',
        medium: 'b',
        long: 'c',
      }[fullSession.detail_level!] as CadrageAnswers['C5'],
      C7: fullSession.ia_cadrage_raw as CadrageAnswers['C7'],
    }
    setCadrage(restoredCadrage)
    setAnswers(
      existingAnswers.map((a) => ({
        ...a,
        session_id: fullSession.id,
      }))
    )
    setSessionId(fullSession.id)
    setTeamName(fullSession.team_name ?? '')
    setSprintNumber(fullSession.sprint_number ?? '')
    setSprintEndDate(fullSession.sprint_end_date ?? '')
    setActiveQuestions(filterActiveQuestions(restoredCadrage, allQuestions, existingAnswers))
    setJumpTarget(null)
    setStep('questions')
    setDraft(null)
  }

  const goToQuestionsFromCadrage = (c: CadrageAnswers) => {
    setErrorMessage(null)
    setCadrage(c)
    setSessionId(null)
    setAnswers([])
    setActiveQuestions(filterActiveQuestions(c, allQuestions, []))
    setJumpTarget(null)
    setStep('questions')
  }

  const applyCalculateResult = useCallback(
    async (
      sid: string,
      c: CadrageAnswers,
      meta: { teamName: string; sprintNumber: string; sprintEndDate: string }
    ) => {
      const res = await fetch(`/api/scoring/session/${sid}/calculate`, { method: 'POST' })
      if (res.status === 401) {
        router.push('/login?redirect=' + encodeURIComponent('/scoring-deliverable'))
        return
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert((j as { error?: string }).error || 'Erreur de calcul')
        return
      }
      const { scoreResult: sr, reportMarkdown: md } = (await res.json()) as {
        scoreResult: ScoreResult
        reportMarkdown: string
      }
      const sRes = await fetch(`/api/scoring/session/${sid}`)
      let full: ScoringSession | null = null
      if (sRes.ok) {
        full = ((await sRes.json()) as { session: ScoringSession }).session
      }
      setScoreResult(sr)
      setReport(md)
      setSessionForReport(
        full ?? {
          id: sid,
          user_id: '',
          team_name: meta.teamName || null,
          sprint_number: meta.sprintNumber || null,
          sprint_end_date: meta.sprintEndDate || null,
          org_context: c.C2,
          scope: null,
          respondent_role: (
            { a: 'non-tech', b: 'intermediate', c: 'expert' } as const
          )[c.C4],
          detail_level: ({ a: 'short', b: 'medium', c: 'long' } as const)[c.C5],
          ia_cadrage_raw: c.C7,
          ia_dimension_active: c.C7 !== 'b',
          score_global: sr.score_global,
          rag_global: sr.rag_global,
          blocking_rule_applied: sr.blocking_rule_applied,
          blocking_criticals_count: sr.blocking_criticals_count,
          critical_flags: sr.critical_flags,
          weights_used: sr.weights_used,
          status: 'complete',
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        }
      )
      setSessionId(sid)
      setStep('result')
    },
    [router]
  )

  const saveAnswersAndCalculate = useCallback(
    async (
      sid: string,
      opts: {
        cadrage: CadrageAnswers
        answers: ScoringAnswer[]
        teamName: string
        sprintNumber: string
        sprintEndDate: string
      }
    ) => {
      const saveRes = await fetch(`/api/scoring/session/${sid}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: opts.answers.map((a) => ({
            questionId: a.question_id,
            dimensionId: a.dimension_id,
            answerKey: a.answer_key,
            scoreValue: a.score_value,
          })),
        }),
      })
      if (!saveRes.ok) {
        const j = await saveRes.json().catch(() => ({}))
        console.error('save answers failed', j)
        alert((j as { error?: string }).error || 'Erreur lors de l’enregistrement des réponses.')
        return
      }
      await applyCalculateResult(sid, opts.cadrage, {
        teamName: opts.teamName,
        sprintNumber: opts.sprintNumber,
        sprintEndDate: opts.sprintEndDate,
      })
    },
    [applyCalculateResult]
  )

  const finalizeScoringOnServer = useCallback(
    async (opts: {
      cadrage: CadrageAnswers
      answers: ScoringAnswer[]
      teamName: string
      sprintNumber: string
      sprintEndDate: string
    }) => {
      const body = {
        teamName: opts.teamName || undefined,
        sprintNumber: opts.sprintNumber || undefined,
        sprintEndDate: opts.sprintEndDate || undefined,
        cadrage: opts.cadrage,
      }

      const postSession = () =>
        fetch('/api/scoring/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

      let res = await postSession()

      if (res.status === 401) {
        router.push('/login?redirect=' + encodeURIComponent('/scoring-deliverable'))
        return
      }
      if (res.status === 402) {
        const j = (await res.json().catch(() => ({}))) as { current?: number }
        if (typeof j.current === 'number') setCreditBalance(j.current)
        setShowLowCreditModal(true)
        return
      }
      if (res.status === 503) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const retry = await postSession()
        if (retry.status === 401) {
          router.push('/login?redirect=' + encodeURIComponent('/scoring-deliverable'))
          return
        }
        if (retry.status === 402) {
          const j = (await retry.json().catch(() => ({}))) as { current?: number }
          if (typeof j.current === 'number') setCreditBalance(j.current)
          setShowLowCreditModal(true)
          return
        }
        if (!retry.ok) {
          setErrorMessage('Impossible de démarrer. Réessaye dans quelques secondes.')
          return
        }
        const { sessionId: sid } = (await retry.json()) as { sessionId: string }
        await saveAnswersAndCalculate(sid, opts)
        return
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setErrorMessage((j as { error?: string }).error || 'Erreur inattendue. Réessaye.')
        return
      }

      const { sessionId: sid } = (await res.json()) as { sessionId: string }
      await saveAnswersAndCalculate(sid, opts)
    },
    [router, saveAnswersAndCalculate]
  )

  const finalizeScoringRef = useRef(finalizeScoringOnServer)
  finalizeScoringRef.current = finalizeScoringOnServer

  useEffect(() => {
    if (!authSession?.user?.id) return
    if (typeof window === 'undefined') return
    if (pendingFinalizeRan.current) return
    const raw = sessionStorage.getItem(PENDING_FINALIZE_KEY)
    if (!raw) return

    pendingFinalizeRan.current = true
    sessionStorage.removeItem(PENDING_FINALIZE_KEY)

    let p: PendingFinalizePayload
    try {
      p = JSON.parse(raw) as PendingFinalizePayload
      if (p.v !== 1 || !p.cadrageAnswers || !Array.isArray(p.answers)) {
        pendingFinalizeRan.current = false
        return
      }
    } catch {
      pendingFinalizeRan.current = false
      return
    }

    const restored = pendingToAnswers(p)
    setCadrage(p.cadrageAnswers)
    setAnswers(restored)
    setTeamName(p.teamName ?? '')
    setSprintNumber(p.sprintNumber ?? '')
    setSprintEndDate(p.sprintEndDate ?? '')
    setActiveQuestions(filterActiveQuestions(p.cadrageAnswers, allQuestions, restored))
    setSessionId(null)
    setStep('questions')
    setJumpTarget(null)

    void (async () => {
      setCalculating(true)
      try {
        await finalizeScoringRef.current({
          cadrage: p.cadrageAnswers,
          answers: restored,
          teamName: p.teamName ?? '',
          sprintNumber: p.sprintNumber ?? '',
          sprintEndDate: p.sprintEndDate ?? '',
        })
      } finally {
        setCalculating(false)
      }
    })()
  }, [authSession?.user?.id, allQuestions])

  const onAnswer = async (q: ClientSafeQuestion, answerKey: string, scoreValue: number) => {
    const newAnswer: ScoringAnswer = {
      session_id: sessionId ?? '',
      dimension_id: q.dimension,
      question_id: q.id,
      answer_key: answerKey,
      score_value: scoreValue,
    }
    const nextAnswers = upsertAnswer(answers, newAnswer)
    setAnswers(nextAnswers)

    if (sessionId) {
      const saveRes = await fetch(`/api/scoring/session/${sessionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: [
            {
              questionId: q.id,
              dimensionId: q.dimension,
              answerKey,
              scoreValue,
            },
          ],
        }),
      })
      if (!saveRes.ok) {
        const j = await saveRes.json().catch(() => ({}))
        console.error('autosave failed', j)
      }
    }

    setActiveQuestions(filterActiveQuestions(cadrageAnswers, allQuestions, nextAnswers))
    setJumpTarget(null)
  }

  const persistPendingFinalize = useCallback(() => {
    const payload: PendingFinalizePayload = {
      v: 1,
      cadrageAnswers,
      answers: answers.map((a) => ({
        dimension_id: a.dimension_id,
        question_id: a.question_id,
        answer_key: a.answer_key,
        score_value: a.score_value,
      })),
      teamName,
      sprintNumber,
      sprintEndDate,
    }
    sessionStorage.setItem(PENDING_FINALIZE_KEY, JSON.stringify(payload))
  }, [answers, cadrageAnswers, sprintEndDate, sprintNumber, teamName])

  const runCalculate = async () => {
    if (!allAnswered(activeQuestions, answers)) return
    setErrorMessage(null)

    if (isScoringDevLocalhost()) {
      setCalculating(true)
      try {
        const { scoreResult: sr, reportMarkdown: md, session: sess } = buildLocalhostMockScoringResult(
          cadrageAnswers,
          teamName
        )
        setScoreResult(sr)
        setReport(md)
        setSessionForReport(sess)
        setStep('result')
      } finally {
        setCalculating(false)
      }
      return
    }

    if (!authSession?.user) {
      persistPendingFinalize()
      router.push('/login?redirect=' + encodeURIComponent('/scoring-deliverable'))
      return
    }

    try {
      const r = await fetch('/api/credits/balance')
      if (r.status === 401) {
        persistPendingFinalize()
        router.push('/login?redirect=' + encodeURIComponent('/scoring-deliverable'))
        return
      }
      const d = (await r.json()) as { credits?: number }
      const balance = typeof d.credits === 'number' ? d.credits : 0
      setCreditBalance(balance)
      if (balance < SCORING_DELIVERABLE_COST) {
        setShowLowCreditModal(true)
        return
      }
    } catch {
      // serveur = protection réelle
    }

    setCalculating(true)
    try {
      await finalizeScoringOnServer({
        cadrage: cadrageAnswers,
        answers,
        teamName,
        sprintNumber,
        sprintEndDate,
      })
    } finally {
      setCalculating(false)
    }
  }

  const onNavigateDim = (dim: DimensionId) => {
    const inDim = activeQuestions.filter((q) => q.dimension === dim)
    const answered = new Set(answers.map((a) => a.question_id))
    const next = inDim.find((q) => !answered.has(q.id)) ?? inDim[0]
    if (next) setJumpTarget(next.id)
  }

  const labelClass = 'font-medium text-white mb-3'
  const optionLabelClass =
    'flex items-center gap-3 min-h-[44px] px-4 rounded-xl border border-white/15 cursor-pointer hover:bg-white/5 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/15'
  const inputClass =
    'w-full rounded-lg border border-white/15 bg-white/5 text-white placeholder:text-white/40 px-3 py-2 min-h-[44px]'
  const mutedClass = 'text-white/60 block mb-1'

  const cadrageForm = (
    <div className="max-w-xl space-y-8">
      {cadrageItems.map((item) => (
        <div key={item.id}>
          <p className={labelClass}>{item.question_fr}</p>
          <p className="mb-3 text-sm font-normal leading-relaxed text-white/60" lang="en">
            {item.question_en}
          </p>
          <div className="flex flex-col gap-2">
            {(Object.entries(item.options) as [string, string][]).map(([key, label]) => (
              <label key={key} className={optionLabelClass}>
                <input
                  type="radio"
                  name={item.id}
                  value={key}
                  className="accent-orange-500"
                  checked={
                    cadrageAnswers[item.id as keyof CadrageAnswers] ===
                    (key as CadrageAnswers[keyof CadrageAnswers])
                  }
                  onChange={() =>
                    setCadrage((prev) => ({ ...prev, [item.id]: key } as CadrageAnswers))
                  }
                />
                <span className="text-sm text-white/90">
                  <span className="block">{label}</span>
                  {item.options_en?.[key] ? (
                    <span className="mt-1 block text-xs font-normal text-white/50" lang="en">
                      {item.options_en[key]}
                    </span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className={mutedClass}>Équipe (optionnel)</span>
          <input className={inputClass} value={teamName} onChange={(e) => setTeamName(e.target.value)} />
        </label>
        <label className="text-sm">
          <span className={mutedClass}>Sprint (optionnel)</span>
          <input
            className={inputClass}
            value={sprintNumber}
            onChange={(e) => setSprintNumber(e.target.value)}
          />
        </label>
        <div className="text-sm sm:col-span-2 space-y-1">
          <span className={mutedClass}>Fin de sprint (optionnel)</span>
          <SprintDateField value={sprintEndDate} onChange={setSprintEndDate} />
        </div>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="button"
        className="min-h-[48px] w-full sm:w-auto px-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:from-orange-400 hover:to-orange-500 transition-all"
        onClick={() => {
          try {
            goToQuestionsFromCadrage(cadrageAnswers)
          } catch (e) {
            console.error('[scoring] goToQuestionsFromCadrage', e)
            setErrorMessage('Impossible de passer au questionnaire. Réessaie ou rafraîchis la page.')
          }
        }}
      >
        Continuer vers le questionnaire
      </button>
    </div>
  )

  return (
    <div
      className={`relative z-10 mx-auto space-y-8 px-4 py-8 text-white md:py-10 ${
        step === 'result' ? 'max-w-7xl' : 'max-w-4xl'
      }`}
    >
      {draftSession && step === 'cadrage' && authSession?.user && (
        <div
          className="rounded-xl border border-orange-500/40 bg-orange-500/10 p-4 flex flex-wrap items-center justify-between gap-4"
          data-no-print
        >
          <p className="text-sm text-white/90">
            Reprendre votre évaluation en cours ?
          </p>
          <button
            type="button"
            onClick={() => void resumeDraft()}
            className="min-h-[44px] px-5 rounded-xl bg-orange-500 text-white font-medium"
          >
            Reprendre
          </button>
        </div>
      )}

      {showLowCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6 max-w-md shadow-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Crédits insuffisants</h3>
            <p className="text-sm text-white/70 mb-4">
              Il vous faut {SCORING_DELIVERABLE_COST} crédits pour obtenir le rapport. Votre solde
              actuel : {creditBalance} crédit(s).
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-white/20 text-sm"
                onClick={() => setShowLowCreditModal(false)}
              >
                Annuler
              </button>
              <a
                href="/pricing"
                className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium inline-flex items-center justify-center min-h-[40px]"
              >
                Acheter des crédits
              </a>
            </div>
          </div>
        </div>
      )}

      {step === 'cadrage' && (
        <>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white/90">Cadrage</h2>
            <p className="text-white/60 text-sm max-w-2xl">
              Répondez au cadrage puis au questionnaire. Une fois terminé, connectez-vous pour
              générer le rapport — les crédits sont alors débités.
            </p>
          </div>
          {cadrageForm}
        </>
      )}

      {step === 'questions' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <Link
              href="/"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              ← Accueil
            </Link>
            <p className="text-sm text-orange-400/90 tabular-nums">
              {progressLabel(activeQuestions, currentQuestion, scoringModel)}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">Questionnaire</h2>
          </div>

          <DimensionNav
            variant="retro"
            currentDimension={currentDim}
            answers={answers}
            activeQuestions={activeQuestions}
            scoringModel={scoringModel}
            onNavigate={onNavigateDim}
            showRagPreview={Boolean(sessionId)}
          />

          <div id="question-anchor-wrap" className="space-y-8 pt-4">
            {currentQuestion ? (
              <div id={`question-anchor-${currentQuestion.id}`}>
                <QuestionCard
                  variant="retro"
                  question={currentQuestion}
                  resolveScore={(key) => resolveScore(currentQuestion, key)}
                  currentAnswer={answers.find((a) => a.question_id === currentQuestion.id)?.answer_key}
                  onAnswer={(key, sv) => void onAnswer(currentQuestion, key, sv)}
                />
              </div>
            ) : allAnswered(activeQuestions, answers) ? null : (
              <p className="text-white/50">Chargement…</p>
            )}
          </div>

          {allAnswered(activeQuestions, answers) && (
            <ScoringCompletionGate
              devLocalhost={isScoringDevLocalhost()}
              isLoggedIn={Boolean(authSession?.user)}
              isCalculating={isCalculating}
              errorMessage={errorMessage}
              creditCost={SCORING_DELIVERABLE_COST}
              onFinalize={() => void runCalculate()}
              onPersistPendingAndGoLogin={() => {
                persistPendingFinalize()
                router.push('/login?redirect=' + encodeURIComponent('/scoring-deliverable'))
              }}
              onPersistPendingAndGoRegister={() => {
                persistPendingFinalize()
                router.push('/register?from=scoring_deliverable')
              }}
            />
          )}
        </>
      )}

      {step === 'result' && scoreResult && reportMarkdown && sessionForReport && (
        <>
          <ScoringRagAmbient rag={scoreResult.rag_global} />
          <div
            className="relative z-10 w-full space-y-10 pb-8 md:space-y-12"
            data-scoring-report-print
          >
          <ScoringReport
            session={sessionForReport}
            scoreResult={scoreResult}
            reportMarkdown={reportMarkdown}
            scoringModel={scoringModel}
            answersByQuestionId={answersByQuestionId}
            activeQuestions={activeQuestions}
            onNewSession={startNewSession}
          />
          {sessionForReport.user_id !== 'dev-localhost' && (
            <div className="bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent p-6 shadow-2xl shadow-black/50 backdrop-blur-3xl md:p-10 border border-white/10 rounded-[3rem]">
              <ScoringHistory />
            </div>
          )}
          </div>
        </>
      )}
    </div>
  )
}
