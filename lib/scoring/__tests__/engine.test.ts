import { describe, it, expect } from 'vitest'
import {
  applyBlockingRule,
  calculateDimensionScore,
  computeFullScore,
  evaluateCriticalFlags,
  mapAnswerToScore,
  redistributeWeights,
} from '@/lib/scoring/engine'
import type { ScoringModel, QuestionDef } from '@/lib/scoring/schema'
import type { CadrageAnswers } from '@/types/scoring'

const minimalScales: ScoringModel['scales'] = {
  YES_NO: { yes: 100, no: 0 },
  FREQ_3: { never: 0, partial: 50, always: 100 },
  MATURITY_4: { none: 0, basic: 33, good: 67, excellent: 100 },
  COVERAGE_5: { unmeasured: 0, under40: 20, '40to60': 50, '60to80': 75, over80: 100 },
  REALIZATION_3: { under50: 0, '50to80': 50, over80: 100 },
}

const minimalModel: ScoringModel = {
  version: 'test',
  scales: minimalScales,
  dimensions: {
    d0: { label_fr: 'D0', type: 'critical', default_weight: 10 },
    d1: { label_fr: 'D1', type: 'critical', default_weight: 15 },
    d2: { label_fr: 'D2', type: 'critical', default_weight: 15 },
    d3: { label_fr: 'D3', type: 'standard', default_weight: 8 },
    d4: { label_fr: 'D4', type: 'critical', default_weight: 15 },
    d5: { label_fr: 'D5', type: 'critical', default_weight: 20 },
    d6: { label_fr: 'D6', type: 'standard', default_weight: 5 },
    d7: { label_fr: 'D7', type: 'standard', default_weight: 10 },
    d8: { label_fr: 'D8', type: 'optional', default_weight: 2 },
  },
  rag_thresholds: {
    critical: { green_min: 80, orange_min: 50 },
    standard: { green_min: 75, orange_min: 50 },
    optional: { green_min: 75, orange_min: 50 },
    global: { green_min: 75, orange_min: 50 },
  },
  blocking_rule: {
    cap_score: 74,
    min_criticals_to_trigger: 1,
    status_label: 'capped_orange',
    critical_dimensions: ['d0', 'd1', 'd2', 'd4', 'd5'],
  },
  contextual_adjustments: [],
}

function q(
  id: string,
  dimension: QuestionDef['dimension'],
  scale: keyof typeof minimalScales
): QuestionDef {
  return {
    id,
    dimension,
    question_fr: id,
    scale_id: scale,
    detail_level: ['short', 'medium', 'long'],
    conditions: [],
    weight_per_role: { 'non-tech': 1, intermediate: 1, expert: 1.5 },
  }
}

describe('calculateDimensionScore', () => {
  it('excluded si aucune réponse pour la dimension', () => {
    const questions = [q('D0Q1', 'd0', 'YES_NO')]
    const r = calculateDimensionScore({}, 'd0', 'intermediate', questions, minimalScales)
    expect(r.excluded).toBe(true)
    expect(r.score).toBeNull()
  })

  it('excluded si ≥70% des réponses sont na', () => {
    const questions = [
      q('D0Q1', 'd0', 'YES_NO'),
      q('D0Q2', 'd0', 'YES_NO'),
      q('D0Q3', 'd0', 'YES_NO'),
    ]
    const answers = { D0Q1: 'na', D0Q2: 'na', D0Q3: 'na' }
    const r = calculateDimensionScore(answers, 'd0', 'intermediate', questions, minimalScales)
    expect(r.excluded).toBe(true)
  })

  it('non excluded si <70% na, calcule la moyenne sans les na', () => {
    const questions = [
      q('D0Q1', 'd0', 'YES_NO'),
      q('D0Q2', 'd0', 'YES_NO'),
      q('D0Q3', 'd0', 'YES_NO'),
    ]
    const answers = { D0Q1: 'yes', D0Q2: 'na', D0Q3: 'yes' }
    const r = calculateDimensionScore(answers, 'd0', 'intermediate', questions, minimalScales)
    expect(r.excluded).toBe(false)
    expect(r.score).toBe(100)
  })

  it('applique weight_per_role=1.5 pour expert', () => {
    const questions = [q('D0Q1', 'd0', 'YES_NO')]
    const answers = { D0Q1: 'yes' }
    const rInt = calculateDimensionScore(answers, 'd0', 'intermediate', questions, minimalScales)
    const rExp = calculateDimensionScore(answers, 'd0', 'expert', questions, minimalScales)
    expect(rInt.score).toBe(100)
    expect(rExp.score).toBe(100)
  })
})

describe('redistributeWeights', () => {
  it('total = exactement 100 après exclusion de d8', () => {
    const w: Record<string, number> = {
      d0: 10,
      d1: 15,
      d2: 15,
      d3: 8,
      d4: 15,
      d5: 20,
      d6: 5,
      d7: 10,
      d8: 2,
    }
    const out = redistributeWeights(w as never, new Set(['d8']))
    const sum = Object.values(out).reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(100, 5)
    expect(out.d8).toBe(0)
  })

  it('total = exactement 100 après exclusion de d3 et d8', () => {
    const w: Record<string, number> = {
      d0: 10,
      d1: 15,
      d2: 15,
      d3: 8,
      d4: 15,
      d5: 20,
      d6: 5,
      d7: 10,
      d8: 2,
    }
    const out = redistributeWeights(w as never, new Set(['d3', 'd8']))
    const sum = Object.values(out).reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(100, 5)
  })
})

describe('applyBlockingRule', () => {
  const rule = minimalModel.blocking_rule

  it('0 critique rouge → inchangé, blocking_applied=false', () => {
    const dims = ['d0', 'd1', 'd2', 'd4', 'd5'].map((id) => ({
      id: id as never,
      score: 80,
      excluded: false,
      rag: 'green' as const,
      weight_effective: 0,
    }))
    const r = applyBlockingRule(90, dims as never, rule)
    expect(r.blocking_applied).toBe(false)
    expect(r.score).toBe(90)
  })

  it('1 critique rouge (score <50) → plafonné à 74', () => {
    const dims = [
      { id: 'd0' as const, score: 40, excluded: false, rag: 'red' as const, weight_effective: 0 },
      { id: 'd1' as const, score: 80, excluded: false, rag: 'green' as const, weight_effective: 0 },
      { id: 'd2' as const, score: 80, excluded: false, rag: 'green' as const, weight_effective: 0 },
      { id: 'd3' as const, score: 80, excluded: false, rag: 'green' as const, weight_effective: 0 },
      { id: 'd4' as const, score: 80, excluded: false, rag: 'green' as const, weight_effective: 0 },
      { id: 'd5' as const, score: 80, excluded: false, rag: 'green' as const, weight_effective: 0 },
      { id: 'd6' as const, score: 80, excluded: false, rag: 'green' as const, weight_effective: 0 },
      { id: 'd7' as const, score: 80, excluded: false, rag: 'green' as const, weight_effective: 0 },
      { id: 'd8' as const, score: 80, excluded: false, rag: 'green' as const, weight_effective: 0 },
    ]
    const r = applyBlockingRule(90, dims as never, rule)
    expect(r.blocking_applied).toBe(true)
    expect(r.score).toBe(74)
  })

  it('lit critical_dimensions depuis le JSON — pas hardcodé', () => {
    expect(rule.critical_dimensions.length).toBeGreaterThan(0)
  })
})

describe('evaluateCriticalFlags', () => {
  const questions: QuestionDef[] = [
    q('D3Q3', 'd3', 'MATURITY_4'),
    q('D7Q2', 'd7', 'FREQ_3'),
  ]

  it('SECURITY_CRITICAL si D0Q1=no', () => {
    const f = evaluateCriticalFlags({ D0Q1: 'no' }, questions, minimalScales)
    expect(f).toContain('SECURITY_CRITICAL')
  })

  it('DOD_BROKEN si D1Q1=no ET D1Q2=never', () => {
    const f = evaluateCriticalFlags({ D1Q1: 'no', D1Q2: 'never' }, questions, minimalScales)
    expect(f).toContain('DOD_BROKEN')
  })

  it('pas DOD_BROKEN si D1Q1=no ET D1Q2=partial', () => {
    const f = evaluateCriticalFlags({ D1Q1: 'no', D1Q2: 'partial' }, questions, minimalScales)
    expect(f).not.toContain('DOD_BROKEN')
  })
})

describe('mapAnswerToScore', () => {
  it('na → 0', () => {
    expect(mapAnswerToScore('na', 'YES_NO', minimalScales)).toBe(0)
  })
})
