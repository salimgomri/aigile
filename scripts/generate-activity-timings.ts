/**
 * Script to generate timing data for all Retromat activities
 * Based on 30 years of field coaching experience
 */

import { RETRO_ACTIVITIES, RetroActivity } from '../lib/retro/activities'
import { ActivityTiming } from '../lib/retro/activity-timings'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Analyze activity characteristics and generate timing
 */
function generateTimingForActivity(activity: RetroActivity): ActivityTiming {
  const name = activity.name.toLowerCase()
  const description = activity.description.toLowerCase()
  const phase = activity.phase
  
  // Default values
  let explanation: number | [number, number] = 2
  let questions: number | [number, number] = 1
  let work: number | [number, number] = [5, 8]
  let restitutionPerPerson = 60 // seconds
  let setupComplexity: 'simple' | 'medium' | 'complex' = 'medium'
  let scalingFactor: 'high' | 'medium' | 'low' = 'medium'
  let coachNote: string | undefined
  
  // PHASE-BASED DEFAULTS
  if (phase === 'set-stage') {
    explanation = 1.5
    questions = 0.5
    work = [1, 2]
    restitutionPerPerson = 30
    setupComplexity = 'simple'
    scalingFactor = 'high'
  } else if (phase === 'close') {
    explanation = 1.5
    questions = 0.5
    work = [1, 3]
    restitutionPerPerson = 30
    setupComplexity = 'simple'
    scalingFactor = 'high'
  } else if (phase === 'generate-insights') {
    explanation = 2.5
    questions = 1.5
    work = [10, 15]
    restitutionPerPerson = 75
    setupComplexity = 'medium'
    scalingFactor = 'low'
  } else if (phase === 'decide-what-to-do') {
    explanation = 2
    questions = 1
    work = [8, 12]
    restitutionPerPerson = 60
    setupComplexity = 'medium'
    scalingFactor = 'medium'
  }
  
  // ACTIVITY TYPE DETECTION
  
  // Quick check-in / voting
  if (name.includes('check') || name.includes('vote') || name.includes('dot') || 
      name.includes('fist') || name.includes('thumb')) {
    explanation = 1
    questions = 0.5
    work = [0.5, 2]
    restitutionPerPerson = 15
    setupComplexity = 'simple'
    scalingFactor = 'high'
    coachNote = 'Format rapide de vote ou check-in.'
  }
  
  // One word / short answer
  if (name.includes('one word') || name.includes('word')) {
    restitutionPerPerson = 10
    scalingFactor = 'high'
  }
  
  // Writing activities
  if (description.includes('write') || description.includes('post-it') || 
      description.includes('sticky')) {
    work = [5, 10]
    restitutionPerPerson = 45
  }
  
  // Metaphor activities (sailboat, speedboat, starfish, etc.)
  if (name.includes('boat') || name.includes('star') || name.includes('fish') ||
      name.includes('mountain') || name.includes('journey')) {
    explanation = 3
    questions = 1.5
    work = [10, 15]
    setupComplexity = 'medium'
    coachNote = 'Métaphore visuelle. Nécessite explication claire.'
  }
  
  // Timeline activities
  if (name.includes('timeline') || name.includes('history')) {
    explanation = 2.5
    work = [10, 15]
    restitutionPerPerson = 45
    setupComplexity = 'medium'
    scalingFactor = 'medium'
    coachNote = 'Activité collaborative de reconstruction temporelle.'
  }
  
  // 5 Whys / Root cause
  if (name.includes('why') || name.includes('root') || name.includes('cause')) {
    explanation = 3
    questions = 2
    work = [12, 18]
    restitutionPerPerson = 90
    setupComplexity = 'medium'
    scalingFactor = 'low'
    coachNote = 'Analyse profonde. Mieux en petits groupes ou breakouts.'
  }
  
  // Appreciation / kudos
  if (name.includes('appreciation') || name.includes('kudo') || 
      name.includes('thank') || name.includes('praise')) {
    restitutionPerPerson = 45
    coachNote = 'Nécessite niveau de confiance élevé.'
  }
  
  // Matrix / quadrant activities
  if (name.includes('matrix') || description.includes('quadrant') || 
      description.includes('4 categories')) {
    explanation = 2.5
    work = [8, 12]
    setupComplexity = 'simple'
    coachNote = 'Format structuré en catégories.'
  }
  
  // Physical / movement activities
  if (description.includes('stand up') || description.includes('move') || 
      description.includes('walk') || name.includes('stand')) {
    coachNote = 'Activité physique. Nécessite espace suffisant.'
    scalingFactor = 'high'
  }
  
  // Silent / anonymous activities
  if (name.includes('silent') || name.includes('anonymous') || 
      description.includes('anonymously')) {
    restitutionPerPerson = 0 // No individual sharing
    scalingFactor = 'high'
    coachNote = 'Format anonyme ou silencieux.'
  }
  
  // Pair / duo activities
  if (name.includes('pair') || description.includes('pairs') || 
      description.includes('duo')) {
    work = [8, 12]
    restitutionPerPerson = 60
    scalingFactor = 'medium'
    coachNote = 'Travail en binômes puis restitution.'
  }
  
  // Brainstorming activities
  if (name.includes('brain') || name.includes('idea') || 
      description.includes('brainstorm')) {
    work = [8, 15]
    restitutionPerPerson = 45
  }
  
  // Complex multi-step activities
  if (description.length > 400 || description.includes('step 1') || 
      description.includes('first,')) {
    explanation = 3
    questions = 2
    setupComplexity = 'complex'
    if (!coachNote) {
      coachNote = 'Activité en plusieurs étapes. Bien expliquer la séquence.'
    }
  }
  
  // Lean Coffee / Open Space
  if (name.includes('lean') || name.includes('coffee') || 
      name.includes('open space')) {
    explanation = 3
    questions = 2
    work = [15, 25]
    restitutionPerPerson = 0 // Built into format
    setupComplexity = 'medium'
    coachNote = 'Format flexible et démocratique. Temps variable.'
  }
  
  // Happiness / mood activities
  if (name.includes('happiness') || name.includes('mood') || 
      name.includes('weather') || name.includes('temperature')) {
    explanation = 1.5
    questions = 0.5
    work = 1
    restitutionPerPerson = 20
    setupComplexity = 'simple'
    scalingFactor = 'high'
  }
  
  // SMART goals / action plans
  if (name.includes('smart') || name.includes('action') || 
      name.includes('commit')) {
    explanation = 2.5
    work = [10, 15]
    restitutionPerPerson = 75
    setupComplexity = 'medium'
    coachNote = 'Focus sur actions concrètes et mesurables.'
  }
  
  return {
    activityId: activity.id,
    activityName: activity.name,
    phase: activity.phase,
    explanation,
    questions,
    work,
    restitutionPerPerson,
    setupComplexity,
    scalingFactor,
    coachNote
  }
}

/**
 * Generate timings for all activities and save to JSON
 */
function generateAllTimings() {
  const allTimings: Record<string, ActivityTiming> = {}
  let totalActivities = 0
  
  // Process all problem categories
  for (const [problemKey, activities] of Object.entries(RETRO_ACTIVITIES)) {
    console.log(`\nProcessing ${problemKey}: ${activities.length} activities`)
    
    for (const activity of activities) {
      const timing = generateTimingForActivity(activity)
      allTimings[activity.id] = timing
      totalActivities++
      
      // Log sample
      if (totalActivities <= 5 || totalActivities % 30 === 0) {
        console.log(`  ✓ ${activity.id}: ${activity.name}`)
        console.log(`    Explanation: ${timing.explanation}min, Work: ${Array.isArray(timing.work) ? `${timing.work[0]}-${timing.work[1]}` : timing.work}min`)
        console.log(`    Restitution: ${timing.restitutionPerPerson}s/pers, Complexity: ${timing.setupComplexity}`)
        if (timing.coachNote) {
          console.log(`    Note: ${timing.coachNote}`)
        }
      }
    }
  }
  
  console.log(`\n✅ Generated timings for ${totalActivities} activities`)
  
  // Save to JSON file
  const outputPath = path.join(__dirname, '../lib/retro/activity-timings-data.json')
  fs.writeFileSync(
    outputPath,
    JSON.stringify(allTimings, null, 2),
    'utf-8'
  )
  console.log(`\n📁 Saved to: ${outputPath}`)
  
  // Generate TypeScript file with exported data
  const tsContent = `/**
 * AUTO-GENERATED: Activity Timing Data
 * Generated by scripts/generate-activity-timings.ts
 * Based on 30 years field coaching experience
 * 
 * Total activities: ${totalActivities}
 */

import { ActivityTiming } from './activity-timings'

export const ACTIVITY_TIMINGS_DATA: Record<string, ActivityTiming> = ${JSON.stringify(allTimings, null, 2)}
`
  
  const tsOutputPath = path.join(__dirname, '../lib/retro/activity-timings-data.ts')
  fs.writeFileSync(tsOutputPath, tsContent, 'utf-8')
  console.log(`📁 TypeScript file: ${tsOutputPath}`)
  
  // Generate summary stats
  console.log('\n📊 STATS:')
  const complexities = { simple: 0, medium: 0, complex: 0 }
  const scaling = { high: 0, medium: 0, low: 0 }
  let withNotes = 0
  
  for (const timing of Object.values(allTimings)) {
    complexities[timing.setupComplexity]++
    if (timing.scalingFactor) scaling[timing.scalingFactor]++
    if (timing.coachNote) withNotes++
  }
  
  console.log(`Complexity: Simple=${complexities.simple}, Medium=${complexities.medium}, Complex=${complexities.complex}`)
  console.log(`Scaling: High=${scaling.high}, Medium=${scaling.medium}, Low=${scaling.low}`)
  console.log(`Activities with coach notes: ${withNotes}`)
  
  return allTimings
}

// Run if executed directly
if (require.main === module) {
  console.log('🎯 Generating activity timings based on field experience...\n')
  generateAllTimings()
  console.log('\n✅ Done!')
}

export { generateAllTimings }
