/**
 * Routage questions / tips — fonctions pures (serveur + client).
 * Aucun import de rules-loader.
 */
import type { DimensionType } from '@/types/scoring'
import type { CadrageAnswers } from '@/types/scoring'
import type { ClientSafeQuestion, QuestionDef, ScoringModel, TipsMap } from '@/lib/scoring/schema'
import { getRAGStatus } from '@/lib/scoring/engine'

export type RoutableQuestion = QuestionDef | ClientSafeQuestion

function detailLevelsForC5(c5: CadrageAnswers['C5']): Set<'short' | 'medium' | 'long'> {
  if (c5 === 'a') return new Set(['short'])
  if (c5 === 'b') return new Set(['short', 'medium'])
  return new Set(['short', 'medium', 'long'])
}

function passesDetailLevel(
  q: RoutableQuestion,
  allowed: Set<'short' | 'medium' | 'long'>
): boolean {
  return q.detail_level.some((dl) => allowed.has(dl))
}

function passesCadrageCondition(
  condition: RoutableQuestion['conditions'][number],
  cadrage: CadrageAnswers
): boolean {
  if (condition.type === 'cadrage_based') {
    const key = condition.question_id as keyof CadrageAnswers
    const val = cadrage[key] as string | undefined
    if (val === undefined) return false
    if (condition.not_in_values && condition.not_in_values.length > 0) {
      return !condition.not_in_values.includes(val)
    }
    return true
  }
  return true
}

function passesAnswerCondition(
  condition: RoutableQuestion['conditions'][number],
  currentAnswers: Record<string, string>
): boolean {
  if (condition.type !== 'answer_based') return true
  const v = currentAnswers[condition.question_id]
  if (v === undefined) return false
  return condition.in_values.includes(v)
}

/**
 * Filtre les questions actives selon cadrage + réponses courantes.
 */
export function getActiveQuestions(
  cadrage: CadrageAnswers,
  allQuestions: RoutableQuestion[],
  currentAnswers: Record<string, string>
): RoutableQuestion[] {
  const allowed = detailLevelsForC5(cadrage.C5)
  const out: RoutableQuestion[] = []

  for (const q of allQuestions) {
    if (q.dimension === 'd8' && cadrage.C7 === 'b') continue
    if (!passesDetailLevel(q, allowed)) continue

    let ok = true
    for (const c of q.conditions) {
      if (c.type === 'cadrage_based') {
        if (!passesCadrageCondition(c, cadrage)) ok = false
      } else if (c.type === 'answer_based') {
        if (!passesAnswerCondition(c, currentAnswers)) ok = false
      }
      if (!ok) break
    }
    if (ok) out.push(q)
  }
  return out
}

export function getNextQuestion(
  currentId: string | null,
  answers: Record<string, string>,
  activeQuestions: RoutableQuestion[]
): RoutableQuestion | null {
  for (const q of activeQuestions) {
    if (answers[q.id] === undefined || answers[q.id] === '') {
      return q
    }
  }
  return null
}

export function getConditionalTip(
  questionId: string,
  scoreValue: number,
  dimensionType: DimensionType,
  thresholds: ScoringModel['rag_thresholds'],
  tips: TipsMap
): string | null {
  const ragLevel = getRAGStatus(scoreValue, dimensionType, thresholds)
  if (ragLevel === 'na' || ragLevel === 'capped_orange') return null
  const row = tips[questionId]
  if (!row) return null
  return row[ragLevel] ?? null
}
