import {
  WESTRUM_QUESTIONS,
  type WestrumNiveau,
  type WestrumQuestionId,
  type WestrumScores,
} from './constants'

const QUESTION_IDS = WESTRUM_QUESTIONS.map((q) => q.id)

export function isValidWestrumScores(raw: unknown): raw is WestrumScores {
  if (!raw || typeof raw !== 'object') return false
  const o = raw as Record<string, unknown>
  for (const id of QUESTION_IDS) {
    const v = o[id]
    if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 7) return false
  }
  return true
}

export function computeWestrumScore(scores: WestrumScores): {
  scoreMoyen: number
  niveau: WestrumNiveau
} {
  const values = QUESTION_IDS.map((id) => scores[id])
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  const scoreMoyen = Math.round(avg * 10) / 10

  let niveau: WestrumNiveau
  if (scoreMoyen < 3.0) niveau = 'pathologique'
  else if (scoreMoyen >= 5.5) niveau = 'generative'
  else niveau = 'bureaucratique'

  return { scoreMoyen, niveau }
}

export function emptyWestrumScores(): Partial<Record<WestrumQuestionId, number>> {
  return {}
}
