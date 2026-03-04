import { PATTERNS, PatternCode, PatternDetectionResult, PatternScore } from './patterns'
import { QUESTIONNAIRE, QuestionId } from './questionnaire'

/**
 * Detect patterns from questionnaire answers
 * Based on algorithm from retro-tool-spec.md section 4
 */
export function detectPatterns(answers: Record<QuestionId, string>): PatternDetectionResult {
  // Initialize scores to 0
  const scores: Record<PatternCode, number> = {
    P1: 0, P2: 0, P3: 0, P4: 0, P5: 0,
    PA: 0, PB: 0, PC: 0, PD: 0
  }

  // Calculate scores from answers
  Object.entries(answers).forEach(([questionId, answerId]) => {
    const question = QUESTIONNAIRE.find(q => q.id === questionId)
    if (!question) return

    const answer = question.answers.find(a => a.id === answerId)
    if (!answer) return

    // Add pattern points
    Object.entries(answer.patterns).forEach(([patternCode, points]) => {
      scores[patternCode as PatternCode] += points
    })
  })

  // Sort patterns by score (descending)
  const sortedPatterns = (Object.keys(scores) as PatternCode[])
    .map(code => ({
      code,
      score: scores[code],
      name: PATTERNS[code].name,
      nameFr: PATTERNS[code].nameFr
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)

  if (sortedPatterns.length === 0) {
    // Default to P3 if no patterns detected (shouldn't happen with proper questionnaire)
    return {
      primary: {
        code: 'P3',
        score: 0,
        name: PATTERNS.P3.name,
        nameFr: PATTERNS.P3.nameFr
      },
      secondary: [],
      allScores: scores
    }
  }

  const primary = sortedPatterns[0]
  const threshold = primary.score * 0.5

  // Secondary patterns: score >= 50% of primary (max 2)
  const secondary = sortedPatterns
    .slice(1)
    .filter(p => p.score >= threshold)
    .slice(0, 2)

  return {
    primary,
    secondary,
    allScores: scores
  }
}

/**
 * Map primary pattern to problem key for activity selection
 */
export function getProblemKeyFromPattern(primaryPattern: PatternCode): string {
  const mapping: Record<PatternCode, string> = {
    P1: 'silent-team',
    P2: 'lack-purpose',
    P3: 'repetitive-complaints',
    P4: 'no-team',
    P5: 'burnout',
    PA: 'silent-team', // Falls back to P1-like activities
    PB: 'repetitive-complaints', // Facilitation issues
    PC: 'tensions',
    PD: 'burnout' // Technical issues often come with overload
  }

  return mapping[primaryPattern] || 'repetitive-complaints'
}
