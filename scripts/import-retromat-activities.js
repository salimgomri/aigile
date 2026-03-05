#!/usr/bin/env node

/**
 * Script to import Retromat activities from teammomentum project
 * Converts 146 activities from JSON to TypeScript format
 */

const fs = require('fs');
const path = require('path');

// Read the retromat raw data
const retromatPath = '/Volumes/T9/teammomentum/data/retromat-raw.json';
const retromatFrPath = '/Volumes/T9/teammomentum/data/retromat-raw-fr.json';

console.log('📚 Importing Retromat activities from teammomentum...\n');

const retromatEn = JSON.parse(fs.readFileSync(retromatPath, 'utf8'));
const retromatFr = JSON.parse(fs.readFileSync(retromatFrPath, 'utf8'));

console.log(`✅ Loaded ${retromatEn.meta.totalActivities} activities (EN)`);
console.log(`✅ Loaded ${retromatFr.meta.totalActivities} activities (FR)\n`);

// Group activities by pattern
const activitiesByPattern = {
  'silent-team': [],      // P1
  'lack-purpose': [],     // P2
  'repetitive-complaints': [], // P3
  'no-team': [],          // P4
  'burnout': [],          // P5
  'tensions': [],         // PC
};

// Map pattern codes to problem keys
const patternToProblem = {
  'P1': 'silent-team',
  'P2': 'lack-purpose',
  'P3': 'repetitive-complaints',
  'P4': 'no-team',
  'P5': 'burnout',
  'PA': 'silent-team',
  'PB': 'repetitive-complaints',
  'PC': 'tensions',
  'PD': 'burnout'
};

// Phase mapping
const phaseMap = {
  'Set the stage': 'set-stage',
  'Gather data': 'gather-data',
  'Generate insights': 'generate-insights',
  'Decide what to do': 'decide-what-to-do',
  'Close the retrospective': 'close'
};

// Convert activities
retromatEn.activities.forEach((activityEn, index) => {
  const activityFr = retromatFr.activities[index];
  
  if (!activityEn.patterns || !activityEn.patterns.primary || activityEn.patterns.primary.length === 0) {
    return; // Skip untagged activities
  }

  const primaryPattern = activityEn.patterns.primary[0];
  const problemKey = patternToProblem[primaryPattern];
  
  if (!problemKey) return;

  const activity = {
    id: `retromat-${activityEn.retromatId}`,
    phase: phaseMap[activityEn.phase] || 'gather-data',
    name: activityEn.title,
    nameFr: activityFr?.title || activityEn.title,
    summary: activityEn.summary,
    summaryFr: activityFr?.summary || activityEn.summary,
    duration: activityEn.duration.typical || 10,
    description: activityEn.description.substring(0, 500),
    descriptionFr: activityFr?.description?.substring(0, 500) || activityEn.description.substring(0, 500),
    tags: [
      ...activityEn.patterns.primary.map(p => `${p}-primary`),
      ...(activityEn.patterns.secondary || []).map(p => `${p}-secondary`)
    ],
    trustLevel: activityEn.stage === 'Forming' ? 'low' : 
                activityEn.stage === 'Storming' ? 'medium' : 'high',
    retromatUrl: activityEn.url
  };

  if (!activitiesByPattern[problemKey]) {
    activitiesByPattern[problemKey] = [];
  }
  
  activitiesByPattern[problemKey].push(activity);
});

// Generate TypeScript file
let output = `export type RetroPhase = 'set-stage' | 'gather-data' | 'generate-insights' | 'decide-what-to-do' | 'close'

export interface RetroActivity {
  id: string
  phase: RetroPhase
  name: string
  nameFr: string
  summary: string
  summaryFr: string
  duration: number
  description: string
  descriptionFr: string
  tags: string[]
  trustLevel?: 'low' | 'medium' | 'high'
  teamSizeMin?: number
  teamSizeMax?: number
  retromatUrl?: string
}

/**
 * ${retromatEn.meta.totalActivities} Retromat activities mapped to team dysfunction patterns
 * Source: ${retromatEn.meta.source}
 * Scraped: ${retromatEn.meta.scrapedAt}
 */
export const RETRO_ACTIVITIES: Record<string, RetroActivity[]> = {\n`;

Object.entries(activitiesByPattern).forEach(([problemKey, activities]) => {
  output += `  // ${problemKey} (${activities.length} activities)\n`;
  output += `  '${problemKey}': [\n`;
  
  activities.forEach(activity => {
    output += `    {\n`;
    output += `      id: '${activity.id}',\n`;
    output += `      phase: '${activity.phase}',\n`;
    output += `      name: '${activity.name.replace(/'/g, "\\'")}',\n`;
    output += `      nameFr: '${activity.nameFr.replace(/'/g, "\\'")}',\n`;
    output += `      summary: '${activity.summary.replace(/'/g, "\\'")}',\n`;
    output += `      summaryFr: '${activity.summaryFr.replace(/'/g, "\\'")}',\n`;
    output += `      duration: ${activity.duration},\n`;
    output += `      description: \`${activity.description.replace(/`/g, '\\`')}\`,\n`;
    output += `      descriptionFr: \`${activity.descriptionFr.replace(/`/g, '\\`')}\`,\n`;
    output += `      tags: ${JSON.stringify(activity.tags)},\n`;
    output += `      trustLevel: '${activity.trustLevel}',\n`;
    output += `      retromatUrl: '${activity.retromatUrl}'\n`;
    output += `    },\n`;
  });
  
  output += `  ],\n\n`;
});

output += `}

/**
 * Get activities for a specific problem and filters
 */
export function getActivitiesForProblem(
  problemKey: string,
  duration: number = 60,
  trustLevel: 'low' | 'medium' | 'high' = 'medium',
  teamSize: number = 7
): RetroActivity[] {
  const activities = RETRO_ACTIVITIES[problemKey] || RETRO_ACTIVITIES['repetitive-complaints']
  
  // Filter by trust level
  let filtered = activities.filter(a => {
    if (!a.trustLevel) return true
    if (trustLevel === 'low') return a.trustLevel === 'low'
    if (trustLevel === 'medium') return a.trustLevel === 'low' || a.trustLevel === 'medium'
    return true
  })

  // Ensure we have at least one activity per phase
  const phases: RetroPhase[] = ['set-stage', 'gather-data', 'generate-insights', 'decide-what-to-do', 'close']
  const selected: RetroActivity[] = []
  
  phases.forEach(phase => {
    const phaseActivities = filtered.filter(a => a.phase === phase)
    if (phaseActivities.length > 0) {
      // Pick first activity for this phase (could be randomized later)
      selected.push(phaseActivities[0])
    }
  })

  return selected
}

/**
 * Get all available activities (for browsing)
 */
export function getAllActivities(): RetroActivity[] {
  return Object.values(RETRO_ACTIVITIES).flat()
}

/**
 * Get activities count by problem
 */
export function getActivitiesStats(): Record<string, number> {
  return Object.entries(RETRO_ACTIVITIES).reduce((acc, [key, activities]) => {
    acc[key] = activities.length
    return acc
  }, {} as Record<string, number>)
}
`;

// Write output file
const outputPath = path.join(__dirname, '../lib/retro/activities.ts');
fs.writeFileSync(outputPath, output, 'utf8');

console.log('✅ Generated activities.ts\n');

// Show stats
Object.entries(activitiesByPattern).forEach(([key, activities]) => {
  console.log(`  ${key.padEnd(25)} : ${activities.length} activities`);
});

const total = Object.values(activitiesByPattern).reduce((sum, arr) => sum + arr.length, 0);
console.log(`\n📊 Total: ${total} activities imported`);
console.log(`📝 File: ${outputPath}`);
console.log('\n✨ Done!\n');
