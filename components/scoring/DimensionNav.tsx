'use client'

import { Check } from 'lucide-react'
import type { DimensionId, DimensionType, RAGStatus, ScoringAnswer } from '@/types/scoring'
import type { ClientSafeModel, ClientSafeQuestion } from '@/lib/scoring/schema'
import { RAG_BG, RAG_COLORS } from '@/lib/scoring/colors'
import { cn } from '@/lib/utils'

const DIMENSION_ORDER: DimensionId[] = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']

function localRAG(score: number, type: DimensionType, model: ClientSafeModel): RAGStatus {
  const t = model.rag_thresholds[type]
  if (score >= t.green_min) return 'green'
  if (score >= t.orange_min) return 'orange'
  return 'red'
}

function preliminaryDimensionScore(
  dim: DimensionId,
  answers: ScoringAnswer[],
  activeQuestions: ClientSafeQuestion[]
): number | null {
  const ids = new Set(activeQuestions.filter((q) => q.dimension === dim).map((q) => q.id))
  if (ids.size === 0) return null
  const relevant = answers.filter((a) => ids.has(a.question_id))
  if (relevant.length === 0) return null
  const sum = relevant.reduce((s, a) => s + a.score_value, 0)
  return Math.round((sum / relevant.length) * 10) / 10
}

function dimensionProgress(
  dim: DimensionId,
  answers: ScoringAnswer[],
  activeQuestions: ClientSafeQuestion[]
): { total: number; answered: number; pct: number; complete: boolean } {
  const inDim = activeQuestions.filter((q) => q.dimension === dim)
  const total = inDim.length
  const answeredIds = new Set(answers.map((a) => a.question_id))
  const answered = inDim.filter((q) => answeredIds.has(q.id)).length
  const pct = total > 0 ? answered / total : 0
  const complete = total > 0 && answered === total
  return { total, answered, pct, complete }
}

interface DimensionNavProps {
  currentDimension: DimensionId | null
  answers: ScoringAnswer[]
  activeQuestions: ClientSafeQuestion[]
  scoringModel: ClientSafeModel
  onNavigate: (dim: DimensionId) => void
  variant?: 'default' | 'retro'
  /**
   * Si false (défaut) : pas de couleurs RAG sur les dimensions (neutre, progression seulement).
   * À activer seulement quand la session serveur existe (crédits déjà engagés), ex. brouillon repris.
   */
  showRagPreview?: boolean
}

const RAG_BG_RETRO: Record<RAGStatus, string> = {
  red: 'rgba(239, 68, 68, 0.22)',
  orange: 'rgba(245, 158, 11, 0.22)',
  capped_orange: 'rgba(245, 158, 11, 0.22)',
  green: 'rgba(16, 185, 129, 0.22)',
  na: 'rgba(255, 255, 255, 0.08)',
}

export function DimensionNav({
  currentDimension,
  answers,
  activeQuestions,
  scoringModel,
  onNavigate,
  variant = 'default',
  showRagPreview = false,
}: DimensionNavProps) {
  const retro = variant === 'retro'

  return (
    <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
      {DIMENSION_ORDER.map((dim) => {
        const meta = scoringModel.dimensions[dim]
        const pre = preliminaryDimensionScore(dim, answers, activeQuestions)
        const hasAny = activeQuestions.some((q) => q.dimension === dim)
        const rag: RAGStatus | null =
          showRagPreview && pre !== null ? localRAG(pre, meta.type, scoringModel) : null
        const isCurrent = currentDimension === dim
        const { total, answered, pct, complete } = dimensionProgress(dim, answers, activeQuestions)

        const bg = (() => {
          if (!showRagPreview) {
            if (!hasAny) return retro ? RAG_BG_RETRO.na : '#F3F4F6'
            return retro ? 'rgba(255, 255, 255, 0.09)' : '#E8EAED'
          }
          return retro
            ? !hasAny || rag === null
              ? RAG_BG_RETRO.na
              : RAG_BG_RETRO[rag]
            : !hasAny || rag === null
              ? '#F3F4F6'
              : RAG_BG[rag]
        })()

        const fg = (() => {
          if (!showRagPreview) {
            if (!hasAny) return retro ? 'rgba(255,255,255,0.45)' : '#9CA3AF'
            return retro ? 'rgba(255,255,255,0.72)' : '#374151'
          }
          return !hasAny || rag === null
            ? retro
              ? 'rgba(255,255,255,0.45)'
              : '#9CA3AF'
            : RAG_COLORS[rag]
        })()

        return (
          <button
            key={dim}
            type="button"
            onClick={() => onNavigate(dim)}
            title={`${meta.label_fr} — ${answered}/${total} question${total > 1 ? 's' : ''}`}
            className={cn(
              'relative rounded-lg px-1 pt-2 pb-1 text-[10px] sm:text-xs font-medium leading-tight text-center min-h-[56px] sm:min-h-[60px] transition-all border overflow-hidden flex flex-col justify-between gap-0.5',
              isCurrent
                ? retro
                  ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-black'
                  : 'ring-2 ring-aigile-gold ring-offset-2'
                : 'border-transparent'
            )}
            style={{ backgroundColor: bg, color: fg }}
          >
            {complete && hasAny && (
              <span
                className={cn(
                  'absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full',
                  retro ? 'bg-emerald-500/90 text-white' : 'bg-emerald-600 text-white'
                )}
                aria-hidden
              >
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            )}

            <span className="block font-bold opacity-80">D{dim.slice(1)}</span>
            <span className="block line-clamp-2 mt-0.5 px-0.5">{meta.label_fr.split(' ')[0]}</span>

            {hasAny && total > 0 && (
              <span
                className={cn(
                  'tabular-nums text-[9px] sm:text-[10px] mt-0.5',
                  retro ? 'text-white/55' : 'text-muted-foreground'
                )}
              >
                {answered}/{total}
              </span>
            )}

            {hasAny && total > 0 && (
              <div
                className={cn(
                  'mt-1 h-1 w-full rounded-full overflow-hidden',
                  retro ? 'bg-white/15' : 'bg-black/10'
                )}
                aria-hidden
              >
                <div
                  className={cn('h-full rounded-full transition-[width] duration-300', retro ? 'bg-orange-400' : 'bg-aigile-gold')}
                  style={{ width: `${Math.round(pct * 100)}%` }}
                />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
