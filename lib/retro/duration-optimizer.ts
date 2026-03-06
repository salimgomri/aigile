import { RetroActivity, RetroPhase } from './activities'

/**
 * Get activities adapted to duration (following Agile best practices)
 * 
 * Duration guidelines:
 * - 30 min: 3 phases (Set Stage, Gather Data, Decide What To Do) - core for quick impact
 * - 45 min: 5 phases (all phases, lightweight)
 * - 60 min: 5 phases (standard, balanced)
 * - 90 min: 5 phases (deep, with root cause analysis)
 */
export function getActivitiesByDuration(
  activities: RetroActivity[],
  duration: number
): RetroActivity[] {
  let requiredPhases: RetroPhase[]
  
  // Adapt phases based on duration (Scrum Master best practices)
  if (duration <= 30) {
    // 30 min: Core phases only (Set, Gather, Decide)
    requiredPhases = ['set-stage', 'gather-data', 'decide-what-to-do']
  } else {
    // 45-90 min: All 5 phases
    requiredPhases = ['set-stage', 'gather-data', 'generate-insights', 'decide-what-to-do', 'close']
  }

  const selected: RetroActivity[] = []
  
  // Select one activity per required phase
  requiredPhases.forEach(phase => {
    const phaseActivities = activities.filter(a => a.phase === phase)
    if (phaseActivities.length > 0) {
      // For now, pick first activity (can be randomized or scored later)
      selected.push(phaseActivities[0])
    }
  })

  return selected
}

/**
 * Get recommended time allocation per phase based on total duration
 */
export function getPhaseTimeAllocation(duration: number): Record<RetroPhase, number> {
  if (duration <= 30) {
    return {
      'set-stage': 2,
      'gather-data': 8,
      'generate-insights': 0, // Skip
      'decide-what-to-do': 15,
      'close': 5
    }
  } else if (duration <= 45) {
    return {
      'set-stage': 5,
      'gather-data': 10,
      'generate-insights': 10,
      'decide-what-to-do': 10,
      'close': 10
    }
  } else if (duration <= 60) {
    return {
      'set-stage': 5,
      'gather-data': 15,
      'generate-insights': 15,
      'decide-what-to-do': 15,
      'close': 10
    }
  } else {
    // 90 min
    return {
      'set-stage': 10,
      'gather-data': 20,
      'generate-insights': 25,
      'decide-what-to-do': 25,
      'close': 10
    }
  }
}
