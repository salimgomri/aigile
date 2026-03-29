/**
 * Formes JSON (scoring_model, question_bank, tips) — alignées sur lib/scoring/data/*.json
 */
import type { CadrageAnswers, DimensionId, DimensionType, RespondentRole } from '@/types/scoring'

export type ScaleId = keyof ScoringModel['scales']

export type QuestionCondition =
  | { type: 'cadrage_based'; question_id: string; not_in_values?: string[] }
  | { type: 'answer_based'; question_id: string; in_values: string[] }

export interface QuestionDef {
  id: string
  dimension: DimensionId
  question_fr: string
  /** Libellé anglais (affiché sous le FR pour lisibilité internationale) */
  question_en: string
  scale_id: ScaleId
  detail_level: ('short' | 'medium' | 'long')[]
  conditions: QuestionCondition[]
  weight_per_role: Record<'non-tech' | 'intermediate' | 'expert', number>
}

export interface CadrageItem {
  id: keyof CadrageAnswers | string
  question_fr: string
  question_en: string
  options: Record<string, string>
  /** Même clés que `options` (a, b, c…) */
  options_en: Record<string, string>
}

export interface QuestionBank {
  version: string
  cadrage: CadrageItem[]
  questions: QuestionDef[]
}

export interface RagThresholdRow {
  green_min: number
  orange_min: number
}

export interface BlockingRule {
  cap_score: number
  min_criticals_to_trigger: number
  status_label: string
  critical_dimensions: DimensionId[]
}

export interface ContextualAdjustment {
  id: string
  when: Partial<Record<keyof CadrageAnswers, string>>
  actions: Array<
    | { dimension: DimensionId; delta: number }
    | { dimension: DimensionId; exclude: true }
  >
}

export interface DimensionMeta {
  label_fr: string
  type: DimensionType
  default_weight: number
}

export interface ScoringModel {
  version: string
  scales: Record<string, Record<string, number>>
  dimensions: Record<DimensionId, DimensionMeta>
  rag_thresholds: Record<DimensionType | 'global', RagThresholdRow>
  blocking_rule: BlockingRule
  contextual_adjustments: ContextualAdjustment[]
}

export type TipsMap = Record<string, Partial<Record<'red' | 'orange' | 'green', string>>>

export type ClientSafeQuestion = Omit<QuestionDef, 'weight_per_role'>

export interface ClientSafeModel {
  rag_thresholds: ScoringModel['rag_thresholds']
  dimensions: ScoringModel['dimensions']
  blocking_rule: BlockingRule
  /** Poids des réponses par échelle — requis pour score_value (autosave API) */
  scales: ScoringModel['scales']
}
