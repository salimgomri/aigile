/**
 * DORA adapter: transforms form input to chart-ready format.
 * Format for recharts: { date, deployment_frequency, lead_time, change_failure_rate, restore_time }
 */

export interface DoraFormInput {
  deployFreq: number
  leadTimeHours: number
  cfrPct: number
  mttrHours: number
}

export interface DoraChartPoint {
  date: string
  deployment_frequency: number
  lead_time: number
  change_failure_rate: number
  restore_time: number
}

export type DoraRank = 'elite' | 'high' | 'medium' | 'low'

export interface DoraRagResult {
  deployFreq: { value: number; display: string; rank: DoraRank }
  leadTime: { value: number; display: string; rank: DoraRank }
  cfr: { value: number; display: string; rank: DoraRank }
  mttr: { value: number; display: string; rank: DoraRank }
}

// DORA 2023 thresholds (Research)
const THRESHOLDS = {
  deployFreq: { elite: 7, high: 1, medium: 1 / 4 }, // per week: >1/day, 1/wk-1/day, 1/mo-1/wk
  leadTime: { elite: 1 / 24, high: 24 * 7, medium: 24 * 30 }, // hours: <1h, <1wk, <1mo
  cfr: { elite: 5, high: 10, medium: 15 }, // %
  mttr: { elite: 1, high: 24, medium: 24 * 7 }, // hours
}

function getDeployFreqRank(perWeek: number): DoraRank {
  const perDay = perWeek / 7
  if (perDay >= 1) return 'elite'
  if (perWeek >= 1) return 'high'
  if (perWeek >= 0.25) return 'medium'
  return 'low'
}

function getLeadTimeRank(hours: number): DoraRank {
  if (hours <= 1) return 'elite'
  if (hours <= 24 * 7) return 'high'
  if (hours <= 24 * 30) return 'medium'
  return 'low'
}

function getCfrRank(pct: number): DoraRank {
  if (pct < 5) return 'elite'
  if (pct < 10) return 'high'
  if (pct < 15) return 'medium'
  return 'low'
}

function getMttrRank(hours: number): DoraRank {
  if (hours <= 1) return 'elite'
  if (hours <= 24) return 'high'
  if (hours <= 24 * 7) return 'medium'
  return 'low'
}

export function computeRag(input: DoraFormInput): DoraRagResult {
  return {
    deployFreq: {
      value: input.deployFreq,
      display: `${input.deployFreq.toFixed(1)} / semaine`,
      rank: getDeployFreqRank(input.deployFreq),
    },
    leadTime: {
      value: input.leadTimeHours,
      display: input.leadTimeHours < 24 ? `${input.leadTimeHours}h` : `${(input.leadTimeHours / 24).toFixed(0)}j`,
      rank: getLeadTimeRank(input.leadTimeHours),
    },
    cfr: {
      value: input.cfrPct,
      display: `${input.cfrPct}%`,
      rank: getCfrRank(input.cfrPct),
    },
    mttr: {
      value: input.mttrHours,
      display: input.mttrHours < 24 ? `${input.mttrHours}h` : `${(input.mttrHours / 24).toFixed(0)}j`,
      rank: getMttrRank(input.mttrHours),
    },
  }
}

export function formToChartPoint(input: DoraFormInput, date: string): DoraChartPoint {
  return {
    date,
    deployment_frequency: input.deployFreq,
    lead_time: input.leadTimeHours,
    change_failure_rate: input.cfrPct,
    restore_time: input.mttrHours,
  }
}

export function getQualityScoreFromCfr(cfrPct: number): 'green' | 'amber' | 'red' {
  if (cfrPct < 5) return 'green'
  if (cfrPct < 15) return 'amber'
  return 'red'
}

export function getRankProgress(rank: DoraRank): number {
  switch (rank) {
    case 'elite': return 1
    case 'high': return 0.8
    case 'medium': return 0.5
    case 'low': return 0.2
    default: return 0
  }
}
