export type RAGStatus = 'red' | 'orange' | 'green' | 'capped_orange' | 'na'
export type DimensionId = 'd0' | 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' | 'd7' | 'd8'
export type DimensionType = 'critical' | 'standard' | 'optional'
export type SessionStatus = 'draft' | 'complete' | 'archived'
export type RespondentRole = 'non-tech' | 'intermediate' | 'expert'
export type DetailLevel = 'short' | 'medium' | 'long'

export type CriticalFlag =
  | 'SECURITY_CRITICAL'
  | 'REGRESSION_IN_PROD'
  | 'DOD_BROKEN'
  | 'NO_METRICS'

/** C7 stocké tel quel — ne pas dériver en booléen seul (perd la valeur 'c'=partial). */
export interface CadrageAnswers {
  C2: 'a' | 'b' | 'c'
  C4: 'a' | 'b' | 'c'
  C5: 'a' | 'b' | 'c'
  C7: 'a' | 'b' | 'c'
}

export interface DimensionScore {
  id: DimensionId
  score: number | null
  rag: RAGStatus
  weight_effective: number
  excluded: boolean
}

export interface ScoreResult {
  score_global: number
  rag_global: RAGStatus
  blocking_rule_applied: boolean
  blocking_criticals_count: number
  dimension_scores: DimensionScore[]
  critical_flags: CriticalFlag[]
  weights_used: Record<DimensionId, number>
}

export interface ScoringSession {
  id: string
  user_id: string
  team_name: string | null
  sprint_number: string | null
  /** ISO date (YYYY-MM-DD) depuis la DB */
  sprint_end_date?: string | null
  org_context: string | null
  scope?: string | null
  respondent_role: RespondentRole | null
  detail_level: DetailLevel | null
  ia_cadrage_raw: string | null
  ia_dimension_active: boolean
  score_global: number | null
  rag_global: RAGStatus | null
  blocking_rule_applied: boolean
  blocking_criticals_count: number
  critical_flags: CriticalFlag[]
  weights_used?: Record<DimensionId, number> | null
  excluded_dimensions?: string[] | null
  report_markdown?: string | null
  status: SessionStatus
  created_at: string
  completed_at: string | null
  score_d0?: number | null
  score_d1?: number | null
  score_d2?: number | null
  score_d3?: number | null
  score_d4?: number | null
  score_d5?: number | null
  score_d6?: number | null
  score_d7?: number | null
  score_d8?: number | null
  rag_d0?: RAGStatus | null
  rag_d1?: RAGStatus | null
  rag_d2?: RAGStatus | null
  rag_d3?: RAGStatus | null
  rag_d4?: RAGStatus | null
  rag_d5?: RAGStatus | null
  rag_d6?: RAGStatus | null
  rag_d7?: RAGStatus | null
  rag_d8?: RAGStatus | null
}

export interface ScoringAnswer {
  id?: string
  session_id: string
  dimension_id: DimensionId
  question_id: string
  answer_key: string
  score_value: number
  created_at?: string
}

export interface SessionSummary {
  id: string
  teamName: string | null
  sprintNumber: string | null
  scoreGlobal: number
  ragGlobal: RAGStatus
  blockingRuleApplied: boolean
  completedAt: string
}
