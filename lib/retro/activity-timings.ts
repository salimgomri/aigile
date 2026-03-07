/**
 * Activity Timing Breakdown - Coach Terrain (30 years experience)
 * Detailed timing for each Retromat activity based on field experience
 * 
 * Structure:
 * - explanation: Time to present the activity and explain instructions
 * - questions: Time for Q&A and clarifications
 * - work: Active participant work time
 * - restitution: Total sharing time (calculated from timePerPerson * teamSize)
 * - coachNote: Optional note for complex/variable activities
 */

export interface ActivityTiming {
  activityId: string
  activityName: string
  phase: string
  
  // Timing breakdown (in minutes)
  explanation: number | [number, number] // Single value or range [min, max]
  questions: number | [number, number]
  work: number | [number, number]
  restitutionPerPerson: number // seconds per person for sharing
  
  // Optional coach insights
  coachNote?: string
  
  // Complexity indicators
  setupComplexity: 'simple' | 'medium' | 'complex'
  scalingFactor?: 'high' | 'medium' | 'low' // How well it scales with team size
}

/**
 * TIMING ESTIMATION RULES (Terrain Experience):
 * 
 * EXPLANATION:
 * - Simple activities (check-in, voting): 1-2 min
 * - Standard activities: 2-3 min
 * - Complex activities (multiple steps): 3-5 min
 * 
 * QUESTIONS:
 * - Simple activities: 0.5-1 min
 * - Standard activities: 1-2 min
 * - Complex/new activities: 2-3 min
 * 
 * WORK TIME:
 * - Individual reflection: 3-10 min depending on depth
 * - Pair work: 5-15 min
 * - Group work: 10-20 min
 * - Writing/creating: Add 2-5 min
 * 
 * RESTITUTION (per person):
 * - Quick check-in: 20-30s
 * - Standard sharing: 45-60s
 * - Deep sharing: 90-120s
 * - Large teams (>8): -20% efficiency
 */

export const ACTIVITY_TIMINGS: Record<string, ActivityTiming> = {
  // ===== SET THE STAGE =====
  
  'retromat-1': {
    activityId: 'retromat-1',
    activityName: 'ESVP',
    phase: 'set-stage',
    explanation: 2,
    questions: 1,
    work: 1, // Anonymous voting
    restitutionPerPerson: 0, // Anonymous, no individual sharing
    setupComplexity: 'simple',
    scalingFactor: 'high',
    coachNote: 'Résultats présentés en agrégé uniquement. Temps constant quelle que soit la taille.'
  },
  
  'retromat-2': {
    activityId: 'retromat-2',
    activityName: 'Weather Report',
    phase: 'set-stage',
    explanation: 1.5,
    questions: 0.5,
    work: 1, // Mark on flipchart
    restitutionPerPerson: 15, // Quick comment per person
    setupComplexity: 'simple',
    scalingFactor: 'medium',
    coachNote: 'Chacun vient marquer au tableau puis commente brièvement.'
  },
  
  'retromat-3': {
    activityId: 'retromat-3',
    activityName: 'Check In - Quick Question',
    phase: 'set-stage',
    explanation: 1,
    questions: 0.5,
    work: 0.5, // Thinking time
    restitutionPerPerson: 30, // One word or short answer
    setupComplexity: 'simple',
    scalingFactor: 'low',
    coachNote: 'Format tour de table classique. Peut être long avec grandes équipes (>10).'
  },
  
  'retromat-6': {
    activityId: 'retromat-6',
    activityName: 'Like to like',
    phase: 'gather-data',
    explanation: 3,
    questions: 2,
    work: [15, 20], // Matching cards to proposals
    restitutionPerPerson: 90, // Explain matches
    setupComplexity: 'complex',
    scalingFactor: 'medium',
    coachNote: 'Préparation matérielle importante (cartes qualité). Temps de travail varie selon nombre de propositions.'
  },
  
  'retromat-7': {
    activityId: 'retromat-7',
    activityName: 'Mad Sad Glad',
    phase: 'gather-data',
    explanation: 2,
    questions: 1,
    work: [5, 8], // Write on post-its
    restitutionPerPerson: 45, // Share items
    setupComplexity: 'simple',
    scalingFactor: 'high',
    coachNote: 'Activité ultra-classique. Fonctionne bien en breakouts pour grandes équipes.'
  },
  
  'retromat-8': {
    activityId: 'retromat-8',
    activityName: 'Locate Strengths',
    phase: 'gather-data',
    explanation: 2,
    questions: 1,
    work: [5, 8],
    restitutionPerPerson: 60,
    setupComplexity: 'simple',
    scalingFactor: 'medium'
  },
  
  'retromat-9': {
    activityId: 'retromat-9',
    activityName: 'Appreciations',
    phase: 'gather-data',
    explanation: 2,
    questions: 1,
    work: [3, 5], // Think of appreciations
    restitutionPerPerson: 45,
    setupComplexity: 'simple',
    scalingFactor: 'medium',
    coachNote: 'Nécessite niveau de confiance élevé dans l\'équipe.'
  },
  
  'retromat-11': {
    activityId: 'retromat-11',
    activityName: 'Return on Time Invested',
    phase: 'close',
    explanation: 2,
    questions: 1,
    work: 1, // Vote on scale
    restitutionPerPerson: 20,
    setupComplexity: 'simple',
    scalingFactor: 'high',
    coachNote: 'Excellent feedback rapide pour le facilitateur.'
  },
  
  'retromat-12': {
    activityId: 'retromat-12',
    activityName: 'Feedback Door - Numbers',
    phase: 'close',
    explanation: 1.5,
    questions: 0.5,
    work: 0.5, // Mark number
    restitutionPerPerson: 0, // Silent voting
    setupComplexity: 'simple',
    scalingFactor: 'high'
  },
  
  'retromat-14': {
    activityId: 'retromat-14',
    activityName: '5 Why\'s',
    phase: 'generate-insights',
    explanation: 3,
    questions: 2,
    work: [10, 15], // Deep analysis
    restitutionPerPerson: 90,
    setupComplexity: 'medium',
    scalingFactor: 'low',
    coachNote: 'Analyse profonde. Difficile avec grandes équipes, privilégier breakouts.'
  },
  
  'retromat-16': {
    activityId: 'retromat-16',
    activityName: 'Dot Voting',
    phase: 'decide-what-to-do',
    explanation: 2,
    questions: 1,
    work: 2, // Place dots
    restitutionPerPerson: 0, // Visual result
    setupComplexity: 'simple',
    scalingFactor: 'high',
    coachNote: 'Méthode de priorisation rapide et efficace.'
  },
  
  'retromat-17': {
    activityId: 'retromat-17',
    activityName: 'Circle of Questions',
    phase: 'generate-insights',
    explanation: 2.5,
    questions: 1.5,
    work: [8, 12],
    restitutionPerPerson: 60,
    setupComplexity: 'medium',
    scalingFactor: 'medium'
  },
  
  'retromat-18': {
    activityId: 'retromat-18',
    activityName: 'Offer Appreciations',
    phase: 'close',
    explanation: 1.5,
    questions: 0.5,
    work: 2,
    restitutionPerPerson: 45,
    setupComplexity: 'simple',
    scalingFactor: 'medium',
    coachNote: 'Clôture positive. Attention au temps avec grandes équipes.'
  },
  
  'retromat-19': {
    activityId: 'retromat-19',
    activityName: 'Helped, Hindered, Hypothesis',
    phase: 'gather-data',
    explanation: 2,
    questions: 1,
    work: [6, 10],
    restitutionPerPerson: 60,
    setupComplexity: 'simple',
    scalingFactor: 'medium'
  },
  
  'retromat-20': {
    activityId: 'retromat-20',
    activityName: 'One Word',
    phase: 'close',
    explanation: 1,
    questions: 0.5,
    work: 0.5,
    restitutionPerPerson: 10, // Just one word
    setupComplexity: 'simple',
    scalingFactor: 'high',
    coachNote: 'Clôture ultra-rapide. Idéal pour respecter le timing.'
  },
  
  'retromat-21': {
    activityId: 'retromat-21',
    activityName: 'Sailboat',
    phase: 'gather-data',
    explanation: 3,
    questions: 1.5,
    work: [8, 12], // Draw and place items
    restitutionPerPerson: 75,
    setupComplexity: 'medium',
    scalingFactor: 'medium',
    coachNote: 'Métaphore visuelle forte. Nécessite explication claire de la métaphore.'
  },
  
  'retromat-22': {
    activityId: 'retromat-22',
    activityName: 'Happiness Histogram',
    phase: 'close',
    explanation: 2,
    questions: 1,
    work: 1,
    restitutionPerPerson: 30,
    setupComplexity: 'simple',
    scalingFactor: 'high'
  },
  
  'retromat-23': {
    activityId: 'retromat-23',
    activityName: 'Timeline',
    phase: 'gather-data',
    explanation: 2.5,
    questions: 1,
    work: [8, 12], // Create timeline collaboratively
    restitutionPerPerson: 45,
    setupComplexity: 'medium',
    scalingFactor: 'medium',
    coachNote: 'Excellente activité pour reconstituer les événements. Marche bien en grand groupe.'
  },
  
  'retromat-24': {
    activityId: 'retromat-24',
    activityName: 'Take a Stand - Line Dance',
    phase: 'gather-data',
    explanation: 2,
    questions: 1,
    work: [5, 8], // Physical positioning
    restitutionPerPerson: 30,
    setupComplexity: 'simple',
    scalingFactor: 'high',
    coachNote: 'Activité physique. Nécessite espace suffisant.'
  },
  
  'retromat-25': {
    activityId: 'retromat-25',
    activityName: 'Learning Matrix',
    phase: 'gather-data',
    explanation: 2.5,
    questions: 1.5,
    work: [8, 12], // Fill 4 quadrants
    restitutionPerPerson: 60,
    setupComplexity: 'simple',
    scalingFactor: 'medium',
    coachNote: 'Matrice 2x2 classique et efficace. 4 catégories à explorer.'
  },
  
  'retromat-26': {
    activityId: 'retromat-26',
    activityName: 'Perfection Game',
    phase: 'decide-what-to-do',
    explanation: 3,
    questions: 2,
    work: [10, 15],
    restitutionPerPerson: 90,
    setupComplexity: 'complex',
    scalingFactor: 'low',
    coachNote: 'Format structuré : score + ce qui l\'améliorerait. Intense, mieux en petits groupes.'
  },
  
  'retromat-27': {
    activityId: 'retromat-27',
    activityName: 'Plus & Delta',
    phase: 'gather-data',
    explanation: 1.5,
    questions: 0.5,
    work: [5, 8],
    restitutionPerPerson: 45,
    setupComplexity: 'simple',
    scalingFactor: 'high',
    coachNote: 'Format simple et rapide. Fonctionne toujours.'
  },
  
  'retromat-28': {
    activityId: 'retromat-28',
    activityName: 'Analyze Stories',
    phase: 'generate-insights',
    explanation: 2.5,
    questions: 1.5,
    work: [12, 18], // Review stories in detail
    restitutionPerPerson: 75,
    setupComplexity: 'medium',
    scalingFactor: 'low',
    coachNote: 'Nécessite accès aux stories. Peut prendre du temps selon le nombre.'
  },
  
  'retromat-29': {
    activityId: 'retromat-29',
    activityName: 'Lean Coffee',
    phase: 'gather-data',
    explanation: 3,
    questions: 2,
    work: [15, 25], // Time-boxed discussions
    restitutionPerPerson: 0, // Built into format
    setupComplexity: 'medium',
    scalingFactor: 'medium',
    coachNote: 'Format flexible et démocratique. Temps variable selon sujets. Très adapté remote.'
  },
  
  'retromat-30': {
    activityId: 'retromat-30',
    activityName: 'Speedboat',
    phase: 'gather-data',
    explanation: 3,
    questions: 1.5,
    work: [10, 15],
    restitutionPerPerson: 75,
    setupComplexity: 'medium',
    scalingFactor: 'medium',
    coachNote: 'Métaphore du bateau : ancres (freins) et moteurs (leviers).'
  },
  
  'retromat-31': {
    activityId: 'retromat-31',
    activityName: 'Keep, Drop, Add',
    phase: 'decide-what-to-do',
    explanation: 2,
    questions: 1,
    work: [8, 12],
    restitutionPerPerson: 60,
    setupComplexity: 'simple',
    scalingFactor: 'medium',
    coachNote: '3 catégories simples et actionnables.'
  },
  
  'retromat-32': {
    activityId: 'retromat-32',
    activityName: 'Constellation',
    phase: 'gather-data',
    explanation: 2.5,
    questions: 1.5,
    work: [5, 8], // Physical positioning
    restitutionPerPerson: 45,
    setupComplexity: 'medium',
    scalingFactor: 'high',
    coachNote: 'Activité spatiale/physique. Visuellement puissant pour voir les alignements.'
  },

  // DEFAULT TIMING TEMPLATE for remaining activities
  // Use this as baseline and adjust per activity specifics
}

/**
 * Calculate total activity time including all phases
 */
export function calculateTotalTime(
  timing: ActivityTiming,
  teamSize: number,
  selectedWorkTime?: number // Override work time if range
): number {
  const explanation = Array.isArray(timing.explanation) 
    ? timing.explanation[0] 
    : timing.explanation
  
  const questions = Array.isArray(timing.questions)
    ? timing.questions[0]
    : timing.questions
  
  const work = selectedWorkTime || (Array.isArray(timing.work)
    ? timing.work[0]
    : timing.work)
  
  const restitution = (timing.restitutionPerPerson * teamSize) / 60 // Convert to minutes
  
  // Apply efficiency reduction for large teams
  const efficiencyFactor = teamSize > 8 ? 1.2 : 1 // +20% overhead for large teams
  
  return Math.round((explanation + questions + work + restitution) * efficiencyFactor)
}

/**
 * Get timing for an activity by ID
 */
export function getActivityTiming(activityId: string): ActivityTiming | null {
  return ACTIVITY_TIMINGS[activityId] || null
}

/**
 * Calculate smart work time based on team size
 */
export function getOptimalWorkTime(
  timing: ActivityTiming,
  teamSize: number
): number {
  if (!Array.isArray(timing.work)) {
    return timing.work
  }
  
  const [min, max] = timing.work
  
  // Smaller teams: use minimum
  // Larger teams: scale up
  if (teamSize <= 5) return min
  if (teamSize <= 8) return min + (max - min) * 0.4
  if (teamSize <= 12) return min + (max - min) * 0.7
  return max
}
