import type { RagColor } from './cadrans'

export type GlobalScoreResult = {
  counts: { vert: number; ambre: number; rouge: number; empty: number }
  filled: number
  scoreRounded: number | '--'
  autoRag: Exclude<RagColor, ''> | ''
  autoWord: string
}

export function computeGlobalScore(ragState: RagColor[]): GlobalScoreResult {
  const counts = { vert: 0, ambre: 0, rouge: 0, empty: 0 }
  for (const r of ragState) {
    if (r === 'vert' || r === 'ambre' || r === 'rouge') counts[r]++
    else counts.empty++
  }
  const filled = counts.vert + counts.ambre + counts.rouge
  const score = counts.vert + counts.ambre * 0.5
  const scoreRounded = filled > 0 ? Math.round(score * 10) / 10 : ('--' as const)

  let autoRag: Exclude<RagColor, ''> | '' = ''
  let autoWord = 'Aucun cadran renseigné'
  if (filled > 0) {
    const ratio = score / filled
    if (counts.rouge >= 2 || ratio < 0.4) {
      autoRag = 'rouge'
      autoWord = 'Attention requise'
    } else if (counts.rouge >= 1 || ratio < 0.7) {
      autoRag = 'ambre'
      autoWord = 'Points de vigilance'
    } else {
      autoRag = 'vert'
      autoWord = 'Situation normale'
    }
  }

  return { counts, filled, scoreRounded, autoRag, autoWord }
}

export function computeVelocityTrend(sparkData: (number | null)[]): string {
  const all = sparkData.filter((v): v is number => v !== null)
  if (all.length < 2) return '--'
  const d = all[all.length - 1] - all[0]
  const last = all[all.length - 1]
  if (d > last * 0.1) return 'en hausse'
  if (d < -last * 0.1) return 'en baisse'
  return 'stable'
}

export function computeVelocityAvg(sparkData: (number | null)[]): string {
  const l3 = sparkData.slice(3).filter((v): v is number => v !== null)
  if (!l3.length) return '--'
  const m = Math.round(l3.reduce((a, b) => a + b, 0) / l3.length)
  return `${m} pts`
}
