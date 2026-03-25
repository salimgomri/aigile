import type {
  CadrageAnswers,
  DetailLevel,
  DimensionId,
  RespondentRole,
  ScoreResult,
  ScoringSession,
} from '@/types/scoring'

const DIMS: DimensionId[] = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']

/**
 * Rapport simulé sans API : uniquement quand l’URL est localhost / 127.0.0.1
 * (y compris `next start` sur la machine — pas besoin de NODE_ENV=development).
 * Jamais sur un nom de domaine de prod.
 */
export function isScoringDevLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1'
}

/**
 * Rapport factice pour tester l’UI sans API ni connexion (localhost uniquement).
 */
export function buildLocalhostMockScoringResult(c: CadrageAnswers, teamName: string): {
  scoreResult: ScoreResult
  reportMarkdown: string
  session: ScoringSession
} {
  const rags = ['orange', 'green', 'red', 'orange', 'green', 'red', 'orange', 'green', 'red'] as const
  const dimension_scores = DIMS.map((id, i) => ({
    id,
    score: 58 + ((i * 3) % 35),
    rag: rags[i % rags.length],
    weight_effective: 1 / 9,
    excluded: false,
  }))

  const scoreResult: ScoreResult = {
    score_global: 67.2,
    rag_global: 'orange',
    blocking_rule_applied: false,
    blocking_criticals_count: 0,
    dimension_scores,
    critical_flags: [],
    weights_used: Object.fromEntries(DIMS.map((d) => [d, 1 / 9])) as ScoreResult['weights_used'],
  }

  const now = new Date().toISOString()
  const session: ScoringSession = {
    id: '00000000-0000-4000-8000-000000000001',
    user_id: 'dev-localhost',
    team_name: teamName || null,
    sprint_number: null,
    sprint_end_date: null,
    org_context: c.C2,
    scope: null,
    respondent_role: (
      { a: 'non-tech', b: 'intermediate', c: 'expert' } as const
    )[c.C4] as RespondentRole,
    detail_level: ({ a: 'short', b: 'medium', c: 'long' } as const)[c.C5] as DetailLevel,
    ia_cadrage_raw: c.C7,
    ia_dimension_active: c.C7 !== 'b',
    score_global: scoreResult.score_global,
    rag_global: scoreResult.rag_global,
    blocking_rule_applied: scoreResult.blocking_rule_applied,
    blocking_criticals_count: scoreResult.blocking_criticals_count,
    critical_flags: scoreResult.critical_flags,
    weights_used: scoreResult.weights_used,
    status: 'complete',
    created_at: now,
    completed_at: now,
  }

  const reportMarkdown = `## Mode développement (localhost)

**Simulation locale** — aucun appel API, aucun débit de crédits.

Score global affiché : **${scoreResult.score_global}** (données factices).

En production, le rapport est calculé à partir de vos réponses réelles.`

  return { scoreResult, reportMarkdown, session }
}
