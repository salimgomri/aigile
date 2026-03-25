/**
 * Moteur de scoring — fonctions pures (serveur + client).
 * Aucun import de rules-loader.
 */
import type {
  CriticalFlag,
  DimensionId,
  DimensionScore,
  DimensionType,
  RAGStatus,
  RespondentRole,
  ScoreResult,
} from '@/types/scoring'
import type { CadrageAnswers } from '@/types/scoring'
import type { BlockingRule, QuestionDef, ScoringModel } from '@/lib/scoring/schema'

const ALL_DIMS: DimensionId[] = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']

export function mapAnswerToScore(answerKey: string, scaleId: string, scales: ScoringModel['scales']): number {
  if (answerKey === 'na') return 0
  const scale = scales[scaleId]
  if (!scale) throw new Error(`Unknown scale_id: ${scaleId}`)
  const v = scale[answerKey]
  if (v === undefined) throw new Error(`Unknown answer_key "${answerKey}" for scale ${scaleId}`)
  return v
}

export function calculateDimensionScore(
  answers: Record<string, string>,
  dimId: DimensionId,
  role: RespondentRole,
  questions: QuestionDef[],
  scales: ScoringModel['scales'],
  naThreshold = 0.7
): { score: number | null; excluded: boolean } {
  const dimQs = questions.filter((q) => q.dimension === dimId)
  if (dimQs.length === 0) return { score: null, excluded: true }

  const totalQ = dimQs.length
  let naCount = 0
  let num = 0
  let den = 0

  for (const q of dimQs) {
    const key = answers[q.id]
    if (key === undefined || key === '') {
      return { score: null, excluded: true }
    }
    if (key === 'na') {
      naCount += 1
      continue
    }
    const w = q.weight_per_role[role]
    const sv = mapAnswerToScore(key, q.scale_id, scales)
    num += sv * w
    den += w
  }

  if (naCount / totalQ >= naThreshold) {
    return { score: null, excluded: true }
  }

  if (den === 0) {
    return { score: null, excluded: true }
  }

  const score = Math.round((num / den) * 10) / 10
  return { score, excluded: false }
}

export function applyContextualWeightAdjustments(
  adjustments: ScoringModel['contextual_adjustments'],
  cadrage: CadrageAnswers,
  weights: Record<DimensionId, number>
): Record<DimensionId, number> {
  const out = { ...weights }
  for (const adj of adjustments) {
    const keys = Object.keys(adj.when) as (keyof CadrageAnswers)[]
    const match = keys.every((k) => cadrage[k] === adj.when[k])
    if (!match) continue
    for (const action of adj.actions) {
      if ('delta' in action && action.delta !== undefined) {
        out[action.dimension] = (out[action.dimension] ?? 0) + action.delta
      }
    }
  }
  return out
}

export function collectExcludedDimensionsFromAdjustments(
  adjustments: ScoringModel['contextual_adjustments'],
  cadrage: CadrageAnswers
): DimensionId[] {
  const excluded: DimensionId[] = []
  for (const adj of adjustments) {
    const keys = Object.keys(adj.when) as (keyof CadrageAnswers)[]
    const match = keys.every((k) => cadrage[k] === adj.when[k])
    if (!match) continue
    for (const action of adj.actions) {
      if ('exclude' in action && action.exclude === true) {
        excluded.push(action.dimension)
      }
    }
  }
  return excluded
}

export function redistributeWeights(
  weights: Record<DimensionId, number>,
  excluded: Set<DimensionId>
): Record<DimensionId, number> {
  const active = ALL_DIMS.filter((d) => !excluded.has(d))
  const out = {} as Record<DimensionId, number>
  for (const d of ALL_DIMS) {
    out[d] = excluded.has(d) ? 0 : 0
  }
  if (active.length === 0) return out

  const sum = active.reduce((s, d) => s + (weights[d] ?? 0), 0)
  if (sum === 0) {
    const eq = Math.floor((100 / active.length) * 100) / 100
    let remaining = 100
    for (let i = 0; i < active.length; i++) {
      const d = active[i]
      if (i === active.length - 1) {
        out[d] = Math.round(remaining * 100) / 100
      } else {
        out[d] = eq
        remaining -= eq
      }
    }
    return out
  }

  const parts = active.map((d) => {
    const w = weights[d] ?? 0
    return { d, raw: (w / sum) * 100 }
  })
  let acc = 0
  for (let i = 0; i < parts.length; i++) {
    const { d, raw } = parts[i]
    if (i === parts.length - 1) {
      out[d] = Math.round((100 - acc) * 100) / 100
    } else {
      const rounded = Math.round(raw * 100) / 100
      out[d] = rounded
      acc += rounded
    }
  }
  return out
}

export function calculateGlobalScore(
  dimensionScores: Pick<DimensionScore, 'id' | 'score' | 'excluded'>[],
  weights: Record<DimensionId, number>
): number {
  let sum = 0
  for (const ds of dimensionScores) {
    if (ds.excluded || ds.score === null) continue
    const w = weights[ds.id] ?? 0
    sum += (ds.score * w) / 100
  }
  return Math.round(sum * 10) / 10
}

export function applyBlockingRule(
  rawScore: number,
  dimensionScores: DimensionScore[],
  rule: BlockingRule
): { score: number; blocking_applied: boolean; blocking_count: number } {
  const criticalDims = rule.critical_dimensions
  let blocking_count = 0
  for (const dim of criticalDims) {
    const ds = dimensionScores.find((d) => d.id === dim)
    if (!ds || ds.excluded) continue
    if (ds.score !== null && ds.score < 50) blocking_count += 1
  }
  if (blocking_count >= rule.min_criticals_to_trigger) {
    return {
      score: Math.min(rawScore, rule.cap_score),
      blocking_applied: true,
      blocking_count,
    }
  }
  return { score: rawScore, blocking_applied: false, blocking_count: 0 }
}

export function getRAGStatus(
  score: number | null,
  dimensionType: DimensionType | 'global',
  thresholds: ScoringModel['rag_thresholds']
): RAGStatus {
  if (score === null) return 'na'
  const t = thresholds[dimensionType]
  if (!t) return 'orange'
  if (score >= t.green_min) return 'green'
  if (score >= t.orange_min) return 'orange'
  return 'red'
}

function scoreForQuestionId(
  questionId: string,
  answers: Record<string, string>,
  questions: QuestionDef[],
  scales: ScoringModel['scales']
): number | null {
  const q = questions.find((x) => x.id === questionId)
  if (!q) return null
  const key = answers[questionId]
  if (key === undefined) return null
  return mapAnswerToScore(key, q.scale_id, scales)
}

export function evaluateCriticalFlags(
  answers: Record<string, string>,
  questions: QuestionDef[],
  scales: ScoringModel['scales']
): CriticalFlag[] {
  const flags: CriticalFlag[] = []
  const get = (id: string) => answers[id]

  if (get('D0Q1') === 'no' || get('D0Q3') === 'no') {
    flags.push('SECURITY_CRITICAL')
  }

  if (get('D5Q1') === 'yes' && get('D5Q3') === 'unmeasured') {
    flags.push('REGRESSION_IN_PROD')
  }

  if (get('D1Q1') === 'no' && get('D1Q2') === 'never') {
    flags.push('DOD_BROKEN')
  }

  const sD3Q3 = scoreForQuestionId('D3Q3', answers, questions, scales)
  const sD7Q2 = scoreForQuestionId('D7Q2', answers, questions, scales)
  if (sD3Q3 !== null && sD7Q2 !== null && sD3Q3 < 33 && sD7Q2 < 33) {
    flags.push('NO_METRICS')
  }

  return flags
}

export function computeFullScore(
  answers: Record<string, string>,
  cadrage: CadrageAnswers,
  role: RespondentRole,
  model: ScoringModel,
  activeQuestions: QuestionDef[]
): ScoreResult {
  const scales = model.scales
  const dimMeta = model.dimensions

  const defaultWeights = ALL_DIMS.reduce((acc, d) => {
    acc[d] = dimMeta[d].default_weight
    return acc
  }, {} as Record<DimensionId, number>)

  const dimensionRaw: { id: DimensionId; score: number | null; excluded: boolean }[] = []
  for (const dimId of ALL_DIMS) {
    const { score, excluded } = calculateDimensionScore(answers, dimId, role, activeQuestions, scales)
    dimensionRaw.push({ id: dimId, score, excluded })
  }

  let adjustedWeights = applyContextualWeightAdjustments(model.contextual_adjustments, cadrage, defaultWeights)
  const contextualExcluded = new Set(
    collectExcludedDimensionsFromAdjustments(model.contextual_adjustments, cadrage)
  )

  const excludedDims = new Set<DimensionId>()
  for (const d of ALL_DIMS) {
    const dr = dimensionRaw.find((x) => x.id === d)
    if (!dr) continue
    if (dr.excluded) excludedDims.add(d)
  }
  for (const d of contextualExcluded) excludedDims.add(d)

  const redistributed = redistributeWeights(adjustedWeights, excludedDims)

  const forBlocking: DimensionScore[] = dimensionRaw.map((dr) => ({
    id: dr.id,
    score: dr.score,
    excluded: dr.excluded,
    rag: 'na',
    weight_effective: 0,
  }))

  const dimensionScoresForGlobal: Pick<DimensionScore, 'id' | 'score' | 'excluded'>[] = dimensionRaw.map((dr) => {
    const excl = dr.excluded || contextualExcluded.has(dr.id)
    return {
      id: dr.id,
      score: excl ? null : dr.score,
      excluded: excl,
    }
  })

  const rawGlobal = calculateGlobalScore(dimensionScoresForGlobal, redistributed)

  const { score: scoreAfterBlock, blocking_applied, blocking_count } = applyBlockingRule(
    rawGlobal,
    forBlocking,
    model.blocking_rule
  )

  const dimensionScores: DimensionScore[] = dimensionRaw.map((dr) => {
    const excl = dr.excluded || contextualExcluded.has(dr.id)
    const type = dimMeta[dr.id].type
    const rag = excl ? 'na' : getRAGStatus(dr.score, type, model.rag_thresholds)
    return {
      id: dr.id,
      score: excl ? null : dr.score,
      rag,
      weight_effective: redistributed[dr.id] ?? 0,
      excluded: excl,
    }
  })

  const critical_flags = evaluateCriticalFlags(answers, activeQuestions, scales)

  let rag_global: RAGStatus
  if (blocking_applied && model.blocking_rule.status_label === 'capped_orange') {
    rag_global = 'capped_orange'
  } else {
    rag_global = getRAGStatus(scoreAfterBlock, 'global', model.rag_thresholds)
  }

  return {
    score_global: scoreAfterBlock,
    rag_global,
    blocking_rule_applied: blocking_applied,
    blocking_criticals_count: blocking_count,
    dimension_scores: dimensionScores,
    critical_flags,
    weights_used: redistributed,
  }
}
