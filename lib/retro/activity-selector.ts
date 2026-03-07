/**
 * Activity Selection Logic - Terrain-based (30+ years Agile coaching)
 * Prioritizes DURATION + TEAM_SIZE over patterns
 */

import { RetroActivity, getActivitiesForProblem } from './activities'
import { ACTIVITY_TIMINGS_DATA } from './activity-timings-data'
import { calculateTotalTime, getOptimalWorkTime } from './activity-timings'

export type RetroPhase = 'Set the stage' | 'Gather data' | 'Generate insights' | 'Decide what to do' | 'Close the retro'

export interface ActivitySelection {
  phase: RetroPhase
  activity: RetroActivity
  allocatedTime: number // minutes
  timePerPerson: number // seconds
  reasoning: string
}

export interface RetroPlan {
  duration: number
  teamSize: number
  activities: ActivitySelection[]
  totalTime: number
  guaranteedActions: number
}

/**
 * DECISION CRITERIA (HIERARCHY):
 * 
 * 1. **30min** = RAW RESULTS (80% Decide, 20% Gather)
 *    - Skip deep Insights/analysis
 *    - 1 SMART action mandatory
 *    - Gather = MadSadGlad OR Timeline (≤10min)
 *    - Close = Fist5 (≤3min)
 * 
 * 2. **45min** = RESULTS + 1 LIGHT INSIGHT
 *    - Gather 25%, Insights 15%, Decide 45%
 *    - Insights = "What comes up often" (grouping)
 * 
 * 3. **60min+** = 5 BALANCED PHASES
 *    - Set Stage MINIMUM psychological safety
 *    - Insights = 5Whys or patterns
 */

/**
 * Time per person based on team size
 */
function getTimePerPerson(teamSize: number): number {
  if (teamSize <= 5) return 120 // 2min/person (direct round)
  if (teamSize <= 8) return 90  // 1min30/person (pairs→2spokes)
  if (teamSize <= 12) return 60 // 1min/person (breakouts 4-6p)
  return 45 // 45s/person (async+vote)
}

/**
 * Get facilitation technique based on team size
 */
export function getFacilitationTechnique(teamSize: number, language: 'en' | 'fr' = 'en'): string {
  if (teamSize <= 5) {
    return language === 'fr' ? 'Tour direct' : 'Direct round'
  }
  if (teamSize <= 8) {
    return language === 'fr' ? 'Pairs puis 2 porte-paroles' : 'Pairs then 2 spokes'
  }
  if (teamSize <= 12) {
    return language === 'fr' ? 'Breakouts (groupes de 4-6)' : 'Breakouts (groups of 4-6)'
  }
  return language === 'fr' ? 'Async + vote' : 'Async + vote'
}

/**
 * Check if activity is universal (works for all patterns)
 */
function isUniversalActivity(activityId: string): boolean {
  const universalIds = [
    // Set the Stage
    'retromat-1', 'retromat-2', 'retromat-3', 'retromat-22', 'retromat-32', 'retromat-42', 'retromat-57',
    // Gather Data
    'retromat-7', 'retromat-23', 'retromat-27', 'retromat-33', 'retromat-19', 'retromat-8', 'retromat-25', 'retromat-9',
    // Generate Insights
    'retromat-14', 'retromat-17', 'retromat-28', 'retromat-64', 'retromat-86',
    // Decide
    'retromat-16', 'retromat-26', 'retromat-31', 'retromat-38', 'retromat-48', 'retromat-63', 'retromat-72', 
    'retromat-88', 'retromat-99', 'retromat-100', 'retromat-117', 'retromat-124',
    // Close
    'retromat-11', 'retromat-12', 'retromat-15', 'retromat-18', 'retromat-20', 'retromat-22', 'retromat-34', 'retromat-101'
  ]
  return universalIds.includes(activityId)
}

/**
 * Score activities based on duration and team size
 * IMPORTANT: Pattern-specific activities get priority over universal ones
 */
function scoreActivity(
  activity: RetroActivity,
  duration: number,
  teamSize: number,
  phase: RetroPhase,
  isPatternSpecific: boolean = true
): number {
  let score = 50 // base score
  
  // PRIORITY BOOST: Pattern-specific activities get +30 points
  if (isPatternSpecific && !isUniversalActivity(activity.id)) {
    score += 30
  }

  // Duration-based scoring
  if (duration === 30) {
    // 30min: Favor quick, result-oriented activities
    if (phase === 'Gather data') {
      if (activity.name.match(/Mad.*Sad.*Glad|Timeline|Temperature/i)) score += 30
      if (activity.duration <= 10) score += 20
    }
    if (phase === 'Decide what to do') {
      if (activity.name.match(/Action|SMART|Commitment/i)) score += 40
      if (activity.duration >= 10) score += 20
    }
    if (phase === 'Close the retro') {
      if (activity.name.match(/Fist|Plus.*Delta|One Word/i)) score += 30
      if (activity.duration <= 5) score += 20
    }
    // Penalize long activities in 30min
    if (activity.duration > 15) score -= 30
  } else if (duration === 45) {
    // 45min: Balanced, with light insights
    if (phase === 'Gather data') {
      if (activity.duration <= 12) score += 15
    }
    if (phase === 'Generate insights') {
      if (activity.name.match(/Group|Pattern|5.*Why|Circle/i)) score += 25
      if (activity.duration <= 8) score += 15
    }
    if (phase === 'Decide what to do') {
      if (activity.duration >= 12 && activity.duration <= 20) score += 20
    }
  } else {
    // 60min+: Full 5 phases, balanced
    if (phase === 'Set the stage') {
      if (activity.name.match(/Check.*in|Weather|Superpow|ESVP/i)) score += 25
      if (activity.duration <= 8) score += 15
    }
    if (phase === 'Generate insights') {
      if (activity.name.match(/5.*Why|Fish|Impact|Circle|Patterns/i)) score += 30
      if (activity.duration >= 10) score += 15
    }
  }

  // Team size scoring
  if (teamSize <= 5) {
    // Small team: favor discussion-heavy activities
    if (activity.name.match(/Discussion|Share|Round/i)) score += 15
  } else if (teamSize <= 8) {
    // Medium team: favor pair work
    if (activity.name.match(/Pair|Partner|Group/i)) score += 15
  } else if (teamSize <= 12) {
    // Large team: favor breakouts
    if (activity.name.match(/Breakout|Group|Vote|Silent/i)) score += 20
    if (activity.name.match(/long.*discussion/i)) score -= 20
  } else {
    // Very large team: favor async, voting, silent activities
    if (activity.name.match(/Vote|Dot|Silent|Write|Async/i)) score += 25
    if (activity.name.match(/Discussion|Share|Speak/i)) score -= 25
  }

  // Trust level scoring (prefer medium-high trust)
  if (activity.trustLevel === 'high') score += 15
  if (activity.trustLevel === 'medium') score += 10

  // Prefer activities with clear tags
  if (activity.tags && activity.tags.length > 0) score += 5

  // Bonus for activities with detailed timing data
  const timingData = ACTIVITY_TIMINGS_DATA[activity.id]
  if (timingData) {
    score += 5
    
    // Bonus for simple setup in time-constrained scenarios
    if (duration === 30 && timingData.setupComplexity === 'simple') {
      score += 10
    }
    
    // Bonus for good scaling in large teams
    if (teamSize > 8 && timingData.scalingFactor === 'high') {
      score += 10
    }
    
    // Penalty for poor scaling in large teams
    if (teamSize > 8 && timingData.scalingFactor === 'low') {
      score -= 15
    }
  }

  return score
}

/**
 * Get phase string from RetroPhase type for filtering activities
 */
function getPhaseString(phase: RetroPhase): string {
  const map: Record<RetroPhase, string> = {
    'Set the stage': 'set-stage',
    'Gather data': 'gather-data',
    'Generate insights': 'generate-insights',
    'Decide what to do': 'decide-what-to-do',
    'Close the retro': 'close'
  }
  return map[phase]
}

/**
 * Select best activity for a phase
 */
function selectActivityForPhase(
  allActivities: RetroActivity[],
  phase: RetroPhase,
  duration: number,
  teamSize: number,
  excludeIds: string[]
): RetroActivity | null {
  const phaseString = getPhaseString(phase)
  const candidates = allActivities.filter(
    (a) => a.phase === phaseString && !excludeIds.includes(a.id)
  )

  if (candidates.length === 0) return null

  // Score all candidates
  const scored = candidates.map((activity) => ({
    activity,
    score: scoreActivity(activity, duration, teamSize, phase)
  }))

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score)

  return scored[0].activity
}

/**
 * Get phase number (1-5) from phase name
 */
function getPhaseNumber(phase: RetroPhase): number {
  const map: Record<RetroPhase, number> = {
    'Set the stage': 1,
    'Gather data': 2,
    'Generate insights': 3,
    'Decide what to do': 4,
    'Close the retro': 5
  }
  return map[phase]
}

/**
 * Get phase name from number
 */
function getPhaseName(phaseNum: number): RetroPhase {
  const map: Record<number, RetroPhase> = {
    1: 'Set the stage',
    2: 'Gather data',
    3: 'Generate insights',
    4: 'Decide what to do',
    5: 'Close the retro'
  }
  return map[phaseNum] || 'Gather data'
}

/**
 * Generate reasoning for activity selection
 */
function generateReasoning(
  activity: RetroActivity,
  phase: RetroPhase,
  duration: number,
  teamSize: number,
  language: 'en' | 'fr' = 'en'
): string {
  const reasons: string[] = []

  if (duration === 30) {
    if (phase === 'Gather data') {
      reasons.push(language === 'fr' ? 'Collecte rapide de données brutes' : 'Quick raw data collection')
    }
    if (phase === 'Decide what to do') {
      reasons.push(language === 'fr' ? 'Orientation résultat immédiat' : 'Immediate result focus')
    }
    if (phase === 'Close the retro') {
      reasons.push(language === 'fr' ? 'Clôture rapide avec mesure' : 'Quick close with measurement')
    }
  } else if (duration === 45) {
    if (phase === 'Generate insights') {
      reasons.push(language === 'fr' ? 'Insight léger sans analyse profonde' : 'Light insight without deep analysis')
    }
  } else {
    if (phase === 'Set the stage') {
      reasons.push(language === 'fr' ? 'Sécurité psychologique minimum' : 'Minimum psychological safety')
    }
    if (phase === 'Generate insights') {
      reasons.push(language === 'fr' ? 'Analyse profonde des patterns' : 'Deep pattern analysis')
    }
  }

  // Team size reasoning
  if (teamSize <= 5) {
    reasons.push(language === 'fr' ? 'Adapté petite équipe (discussion directe)' : 'Adapted for small team (direct discussion)')
  } else if (teamSize <= 8) {
    reasons.push(language === 'fr' ? 'Travail en binômes pour équité temps' : 'Pair work for time equity')
  } else if (teamSize <= 12) {
    reasons.push(language === 'fr' ? 'Breakouts pour engager tous' : 'Breakouts to engage everyone')
  } else {
    reasons.push(language === 'fr' ? 'Async/vote pour grande équipe' : 'Async/vote for large team')
  }

  // Activity-specific reasoning
  if (activity.duration <= 5) {
    reasons.push(language === 'fr' ? 'Court et efficace' : 'Short and effective')
  }
  if (activity.trustLevel === 'high') {
    reasons.push(language === 'fr' ? 'Haute confiance d\'équipe' : 'High team trust')
  }

  return reasons.join(', ')
}

/**
 * Generate complete retro plan based on duration and team size
 */
export function generateRetroPlan(
  duration: number,
  teamSize: number,
  problemKey: string,
  language: 'en' | 'fr' = 'en'
): RetroPlan {
  // Get all available activities for this problem
  const allActivities = getActivitiesForProblem(problemKey)
  const timePerPerson = getTimePerPerson(teamSize)
  
  const selections: ActivitySelection[] = []
  const usedIds: string[] = []

  // Determine phases based on duration
  const phases: RetroPhase[] = 
    duration === 30
      ? ['Gather data', 'Decide what to do', 'Close the retro']
      : duration === 45
      ? ['Gather data', 'Generate insights', 'Decide what to do', 'Close the retro']
      : ['Set the stage', 'Gather data', 'Generate insights', 'Decide what to do', 'Close the retro']

  // Time allocation per phase based on duration
  const timeAllocations: Record<number, Record<RetroPhase, number>> = {
    30: {
      'Set the stage': 0,
      'Gather data': 10,
      'Generate insights': 0,
      'Decide what to do': 17,
      'Close the retro': 3
    },
    45: {
      'Set the stage': 0,
      'Gather data': 12,
      'Generate insights': 8,
      'Decide what to do': 20,
      'Close the retro': 5
    },
    60: {
      'Set the stage': 7,
      'Gather data': 15,
      'Generate insights': 15,
      'Decide what to do': 18,
      'Close the retro': 5
    },
    90: {
      'Set the stage': 10,
      'Gather data': 20,
      'Generate insights': 25,
      'Decide what to do': 28,
      'Close the retro': 7
    }
  }

  const allocation = timeAllocations[duration] || timeAllocations[60]

  // Select activities for each phase
  for (const phase of phases) {
    const activity = selectActivityForPhase(allActivities, phase, duration, teamSize, usedIds)
    
    if (activity) {
      // Get detailed timing data if available
      const timingData = ACTIVITY_TIMINGS_DATA[activity.id]
      
      // Always use allocation as base time (respects duration constraint)
      let allocatedTime = allocation[phase]
      let actualTimePerPerson = timePerPerson
      
      // Use timing data only for restitution per person
      if (timingData) {
        actualTimePerPerson = timingData.restitutionPerPerson
      }
      
      const reasoning = generateReasoning(activity, phase, duration, teamSize, language)
      
      selections.push({
        phase,
        activity,
        allocatedTime,
        timePerPerson: actualTimePerPerson,
        reasoning
      })
      
      usedIds.push(activity.id)
    } else {
      // Log when no activity found for debugging
      console.warn(`⚠️ No activity found for phase: ${phase}, problemKey: ${problemKey}, available activities: ${allActivities.length}`)
    }
  }

  const totalTime = selections.reduce((sum, s) => sum + s.allocatedTime, 0)

  return {
    duration,
    teamSize,
    activities: selections,
    totalTime,
    guaranteedActions: 1
  }
}

/**
 * Get recommended time allocation tips
 */
export function getTimeAllocationTips(duration: number, teamSize: number, language: 'en' | 'fr' = 'en'): string[] {
  const tips: string[] = []

  if (duration === 30) {
    tips.push(
      language === 'fr'
        ? '⚠️ 30min = Focus RÉSULTAT : 1 action SMART obligatoire, pas de discussion longue'
        : '⚠️ 30min = RESULT focus: 1 SMART action required, no long discussions'
    )
    tips.push(
      language === 'fr'
        ? '🎯 80% du temps sur Decide, 20% sur Gather, skip Insights'
        : '🎯 80% time on Decide, 20% on Gather, skip Insights'
    )
  }

  if (duration === 45) {
    tips.push(
      language === 'fr'
        ? '💡 45min = RÉSULTAT + 1 insight léger (grouping/patterns)'
        : '💡 45min = RESULTS + 1 light insight (grouping/patterns)'
    )
  }

  if (teamSize >= 9) {
    tips.push(
      language === 'fr'
        ? '👥 Grande équipe : utilisez breakouts (4-6 personnes) pour toutes les discussions'
        : '👥 Large team: use breakouts (4-6 people) for all discussions'
    )
  }

  if (teamSize >= 12) {
    tips.push(
      language === 'fr'
        ? '⚡ Équipe très grande : favorisez vote/async, limitez tours de parole'
        : '⚡ Very large team: favor voting/async, limit speaking rounds'
    )
  }

  return tips
}
