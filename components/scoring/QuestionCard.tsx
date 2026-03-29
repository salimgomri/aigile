'use client'

import { useEffect, useState } from 'react'
import type { ClientSafeQuestion } from '@/lib/scoring/schema'
import { cn } from '@/lib/utils'

const SCALE_BUTTONS: Record<
  string,
  { key: string; label: string }[]
> = {
  YES_NO: [
    { key: 'yes', label: 'Oui' },
    { key: 'no', label: 'Non' },
  ],
  FREQ_3: [
    { key: 'never', label: 'Jamais' },
    { key: 'partial', label: 'Partiellement' },
    { key: 'always', label: 'Systématique' },
  ],
  MATURITY_4: [
    { key: 'none', label: 'Aucun' },
    { key: 'basic', label: 'Basique' },
    { key: 'good', label: 'Bon' },
    { key: 'excellent', label: 'Excellent' },
  ],
  COVERAGE_5: [
    { key: 'unmeasured', label: 'Non mesurée' },
    { key: 'under40', label: '< 40 %' },
    { key: '40to60', label: '40–60 %' },
    { key: '60to80', label: '60–80 %' },
    { key: 'over80', label: '> 80 %' },
  ],
  REALIZATION_3: [
    { key: 'under50', label: '< 50 %' },
    { key: '50to80', label: '50–80 %' },
    { key: 'over80', label: '> 80 %' },
  ],
}

interface QuestionCardProps {
  question: ClientSafeQuestion
  onAnswer: (answerKey: string, scoreValue: number) => void
  /** Valeurs numériques depuis scoringModel.scales[question.scale_id] */
  resolveScore: (answerKey: string) => number
  currentAnswer?: string
  tipText?: string
  variant?: 'default' | 'retro'
}

export function QuestionCard({
  question,
  onAnswer,
  resolveScore,
  currentAnswer,
  tipText,
  variant = 'default',
}: QuestionCardProps) {
  const [visible, setVisible] = useState(true)
  const buttons = SCALE_BUTTONS[question.scale_id]

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [question.id])

  if (!buttons) {
    return (
      <p className={cn('text-sm', variant === 'retro' ? 'text-red-400' : 'text-destructive')}>
        Échelle inconnue : {question.scale_id}
      </p>
    )
  }

  const retro = variant === 'retro'

  return (
    <div
      className={cn(
        'transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="mb-6 space-y-3">
        <h2
          className={cn(
            'text-xl font-semibold leading-snug',
            retro ? 'text-white' : 'text-foreground'
          )}
        >
          {question.question_fr}
        </h2>
        <p
          className={cn(
            'text-[15px] font-normal leading-relaxed',
            retro ? 'text-white/65' : 'text-muted-foreground'
          )}
          lang="en"
        >
          {question.question_en}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {buttons.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onAnswer(key, resolveScore(key))}
            className={cn(
              'min-h-[44px] px-5 rounded-xl border text-sm font-medium transition-colors',
              retro
                ? currentAnswer === key
                  ? 'border-orange-500 bg-orange-500/20 text-white shadow-lg shadow-orange-500/20'
                  : 'border-white/20 bg-white/5 text-white/90 hover:border-orange-500/50 hover:bg-white/10'
                : currentAnswer === key
                  ? 'border-aigile-gold bg-aigile-gold/15 text-foreground'
                  : 'border-border bg-card hover:border-aigile-gold/50 hover:bg-muted/50'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {currentAnswer && tipText && (
        <p
          className={cn(
            'mt-6 text-sm border-l-4 pl-4 py-2 rounded-r-lg',
            retro
              ? 'text-white/70 border-orange-500/60 bg-white/5'
              : 'text-muted-foreground border-aigile-blue bg-muted/30'
          )}
        >
          {tipText}
        </p>
      )}
    </div>
  )
}
