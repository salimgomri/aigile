import { RetroActivity } from './activities'

export type ActivityType = 'individual' | 'pairs' | 'group' | 'full-team'

/**
 * Team size optimization based on Scrum Master best practices
 * Adapts speaking time and activity format based on team size
 */

export interface TeamSizeRecommendation {
  useBreakouts: boolean
  facilitatorsNeeded: number
  speakingTimePerPerson: number // in seconds
  technique: string
  warning?: string
}

/**
 * Get speaking time per person based on activity type and team size
 * Following algo: baseParole adjusted for team size
 */
export function getSpeakingTime(
  teamSize: number,
  activityType: ActivityType
): number {
  // Base speaking time per person (in seconds)
  const baseTimes: Record<ActivityType, number> = {
    'individual': 30,  // Silent write + share
    'pairs': 60,       // 2 min per pair
    'group': 90,       // Groups of 4-6
    'full-team': 45    // Quick round or spokes
  }

  let speakingTime = baseTimes[activityType]

  // For teams > 8: -20% efficiency (more coordination overhead)
  if (teamSize > 8) {
    speakingTime *= 0.8
  }

  return speakingTime
}

/**
 * Get team size recommendations
 */
export function getTeamSizeRecommendations(teamSize: number): TeamSizeRecommendation {
  if (teamSize <= 5) {
    return {
      useBreakouts: false,
      facilitatorsNeeded: 1,
      speakingTimePerPerson: 90, // 1.5 min average
      technique: 'Full team discussions work well',
      warning: undefined
    }
  } else if (teamSize <= 8) {
    return {
      useBreakouts: false,
      facilitatorsNeeded: 1,
      speakingTimePerPerson: 60, // 1 min average
      technique: 'Consider pairs for some activities',
      warning: undefined
    }
  } else if (teamSize <= 12) {
    return {
      useBreakouts: true,
      facilitatorsNeeded: 1,
      speakingTimePerPerson: 45, // 45s average
      technique: 'Use breakouts (groups of 4-6) then spokes',
      warning: 'Large team: Use breakouts for Gather Data and Generate Insights'
    }
  } else if (teamSize <= 20) {
    return {
      useBreakouts: true,
      facilitatorsNeeded: 2,
      speakingTimePerPerson: 30, // 30s average
      technique: 'Multiple breakout rooms + 2 facilitators',
      warning: 'Very large team: Consider splitting into 2 retros or use Open Space format'
    }
  } else {
    return {
      useBreakouts: true,
      facilitatorsNeeded: 3,
      speakingTimePerPerson: 20, // 20s per person
      technique: 'Open Space or multi-room format required',
      warning: '⚠️ Team too large: Strongly recommend splitting into multiple retros (max 12/retro)'
    }
  }
}

/**
 * Check if an activity is suitable for team size
 */
export function isActivitySuitableForTeamSize(
  activity: RetroActivity,
  teamSize: number
): boolean {
  // Check teamSizeMin/Max if specified
  if (activity.teamSizeMin && teamSize < activity.teamSizeMin) {
    return false
  }
  if (activity.teamSizeMax && teamSize > activity.teamSizeMax) {
    return false
  }

  // Some activities don't scale well beyond certain sizes
  const activityName = activity.name.toLowerCase()
  
  // Activities that need individual sharing (don't scale >12)
  const individualSharingActivities = ['check-in', 'weather', 'esvp', 'happiness']
  if (teamSize > 12 && individualSharingActivities.some(name => activityName.includes(name))) {
    return false
  }

  return true
}

/**
 * Calculate total time needed for an activity with N people
 */
export function calculateActivityTime(
  activity: RetroActivity,
  teamSize: number,
  phaseDuration: number
): {
  estimatedTime: number
  fits: boolean
  recommendation?: string
} {
  // Determine activity type from name/description (simplified heuristic)
  const activityName = activity.name.toLowerCase()
  let activityType: ActivityType = 'full-team'
  
  if (activityName.includes('silent') || activityName.includes('write') || activityName.includes('anonymous')) {
    activityType = 'individual'
  } else if (activityName.includes('pair') || activityName.includes('1-2-4')) {
    activityType = 'pairs'
  } else if (activityName.includes('group') || activityName.includes('breakout')) {
    activityType = 'group'
  }

  const speakingTime = getSpeakingTime(teamSize, activityType)
  
  // Formula: speakingTime * N * 0.6 + buffer(20%)
  // 60% is speaking time, rest is setup/voting
  const totalTime = (speakingTime * teamSize * 0.6) / 60 + (activity.duration * 0.2)
  
  const fits = totalTime <= phaseDuration * 0.8 // Should use max 80% of phase time
  
  let recommendation
  if (!fits && teamSize > 8) {
    recommendation = 'Use breakouts (groups of 4-6) to reduce time'
  } else if (!fits) {
    recommendation = 'Consider a lighter activity or reduce speaking time'
  }

  return {
    estimatedTime: Math.ceil(totalTime),
    fits,
    recommendation
  }
}

/**
 * Get time allocation tips for team size
 */
export function getTimeAllocationTips(
  teamSize: number,
  duration: number
): string[] {
  const tips: string[] = []

  if (teamSize <= 5) {
    tips.push('✅ Ideal team size: full discussions possible in all phases')
    if (duration >= 60) {
      tips.push('💡 Consider doing deeper root cause analysis (5 Whys, Force Field)')
    }
  } else if (teamSize <= 8) {
    tips.push('✅ Good team size: use timebox 1-1.5 min per person')
    tips.push('💡 Use "pairs then share" for Gather Data to save time')
  } else if (teamSize <= 12) {
    tips.push('⚠️ Large team: use breakouts (groups of 4-6) for Gather Data')
    tips.push('💡 Use "spokes" technique: 1 person per group shares with full team')
    tips.push('⏱️ Strict timeboxing: max 1 min speaking time per person')
  } else if (teamSize <= 20) {
    tips.push('⚠️ Very large team: 2 facilitators recommended')
    tips.push('💡 Use digital tools (Miro/Mural) for async input')
    tips.push('⚠️ Breakouts mandatory: groups of 4-6 throughout')
    tips.push('⏱️ Ultra-strict timeboxing: 30-45s per person')
  } else {
    tips.push('🚨 Team too large for effective retro')
    tips.push('💡 Consider: Split into 2 separate retros (max 12 each)')
    tips.push('💡 Alternative: Use Open Space format or Lean Coffee')
    tips.push('⚠️ If forced to continue: 3+ facilitators, digital-first, breakouts only')
  }

  // Duration-specific tips
  if (duration === 30 && teamSize > 8) {
    tips.push('🚨 30 min + large team: Very challenging! Consider 45 min minimum')
  }

  return tips
}
