'use client'

import { useState } from 'react'
import { WESTRUM_QUESTIONS, type WestrumQuestionId } from '@/lib/westrum/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  recentWarningDate: string | null
  onComplete: (scores: Record<WestrumQuestionId, number>) => void
  submitting: boolean
}

export function WestrumForm({ recentWarningDate, onComplete, submitting }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Record<WestrumQuestionId, number>>>({})

  const q = WESTRUM_QUESTIONS[step]
  const selected = answers[q.id]
  const allAnswered = WESTRUM_QUESTIONS.every((item) => answers[item.id] != null)

  const pick = (value: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }))
  }

  const goNext = () => {
    if (selected == null) return
    if (step < WESTRUM_QUESTIONS.length - 1) setStep(step + 1)
    else if (allAnswered) {
      onComplete(answers as Record<WestrumQuestionId, number>)
    }
  }

  const goPrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const warningLabel = recentWarningDate
    ? new Date(recentWarningDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="mx-auto w-full max-w-xl">
      {warningLabel && (
        <div
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status"
        >
          Tu as déjà passé ce questionnaire le {warningLabel}. La mesure est plus fiable espacée
          dans le temps.
        </div>
      )}

      <p className="mb-6 text-center text-xs text-gray-500">
        Question {step + 1} / {WESTRUM_QUESTIONS.length}
      </p>

      <fieldset className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <legend className="sr-only">Question {step + 1}</legend>
        <p className="mb-8 text-base font-medium leading-relaxed text-[#0f2240] sm:text-lg">
          {q.text}
        </p>

        <div className="mb-4 flex justify-between text-[11px] font-medium uppercase tracking-wide text-gray-500">
          <span>Pas du tout d&apos;accord</span>
          <span>Tout à fait d&apos;accord</span>
        </div>

        <div className="flex justify-between gap-1 sm:gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const on = selected === n
            return (
              <button
                key={n}
                type="button"
                disabled={submitting}
                aria-pressed={on}
                aria-label={`Note ${n} sur 7`}
                onClick={() => pick(n)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition sm:h-12 sm:w-12 ${
                  on
                    ? 'border-[#FEBD10] bg-[#FEBD10] text-[#0f2240]'
                    : 'border-gray-200 bg-white text-[#0f2240] hover:border-[#FEBD10] hover:bg-[#FEBD10]/15'
                }`}
              >
                {n}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 0 || submitting}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={selected == null || submitting}
          className="inline-flex items-center gap-1 rounded-full bg-[#0f2240] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a3460] disabled:opacity-40"
        >
          {step === WESTRUM_QUESTIONS.length - 1 ? (submitting ? 'Calcul…' : 'Voir mon résultat') : 'Suivant'}
          {step < WESTRUM_QUESTIONS.length - 1 && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-gray-500">
        Mesure recommandée : une fois par trimestre maximum.
      </p>
    </div>
  )
}
