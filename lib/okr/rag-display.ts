export type RagLevel = 'vert' | 'ambre' | 'rouge' | 'na'

export const CADRAN_LABELS = [
  { key: 'on_time_score' as const, label: 'On Time' },
  { key: 'on_budget_score' as const, label: 'On Budget' },
  { key: 'on_scope_score' as const, label: 'On Scope' },
  { key: 'quality_score' as const, label: 'Qualité' },
  { key: 'maturity_score' as const, label: 'Maturité' },
  { key: 'wellbeing_score' as const, label: 'Bien-être' },
]

export function scoreToRag(score: number | null | undefined): RagLevel {
  if (score == null || Number.isNaN(Number(score))) return 'na'
  const n = Number(score)
  if (n >= 90) return 'vert'
  if (n >= 70) return 'ambre'
  return 'rouge'
}

export function ragStyles(rag: RagLevel): { bg: string; text: string; border: string } {
  switch (rag) {
    case 'vert':
      return { bg: 'rgba(22,163,74,0.15)', text: '#16a34a', border: 'rgba(22,163,74,0.35)' }
    case 'ambre':
      return { bg: 'rgba(217,119,6,0.15)', text: '#d97706', border: 'rgba(217,119,6,0.35)' }
    case 'rouge':
      return { bg: 'rgba(220,38,38,0.15)', text: '#dc2626', border: 'rgba(220,38,38,0.35)' }
    default:
      return { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.25)' }
  }
}
