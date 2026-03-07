# 📊 Analyse des Timings - Guide Rapide

## Visualisation Rapide

### Top 10 Activités les Plus Rapides (Set the Stage)

```bash
cd /Volumes/T9/aigile
node -e "
const data = require('./lib/retro/activity-timings-data.json');
const setStage = Object.values(data)
  .filter(t => t.phase === 'set-stage')
  .sort((a, b) => {
    const aTime = (Array.isArray(a.work) ? a.work[0] : a.work) + a.explanation + a.questions;
    const bTime = (Array.isArray(b.work) ? b.work[0] : b.work) + b.explanation + b.questions;
    return aTime - bTime;
  })
  .slice(0, 10);

console.log('🏃 TOP 10 Set the Stage - Les Plus Rapides\n');
setStage.forEach((t, i) => {
  const work = Array.isArray(t.work) ? t.work[0] : t.work;
  const total = t.explanation + t.questions + work;
  console.log(\`\${i+1}. \${t.activityName.padEnd(30)} \${total}min (scaling: \${t.scalingFactor})\`);
});
"
```

### Top 10 Activités les Plus Scalables (High Scaling)

```bash
node -e "
const data = require('./lib/retro/activity-timings-data.json');
const highScaling = Object.values(data)
  .filter(t => t.scalingFactor === 'high')
  .sort((a, b) => b.restitutionPerPerson - a.restitutionPerPerson)
  .slice(0, 10);

console.log('📈 TOP 10 Activités Scalables (High)\n');
highScaling.forEach((t, i) => {
  console.log(\`\${i+1}. \${t.activityName.padEnd(35)} \${t.phase.padEnd(20)} \${t.restitutionPerPerson}s/pers\`);
});
"
```

### Activités Complexes vs Simples

```bash
node -e "
const data = require('./lib/retro/activity-timings-data.json');
const stats = Object.values(data).reduce((acc, t) => {
  acc[t.setupComplexity] = (acc[t.setupComplexity] || 0) + 1;
  return acc;
}, {});

console.log('🎯 Répartition par Complexité\n');
Object.entries(stats).forEach(([complexity, count]) => {
  const pct = (count / 146 * 100).toFixed(1);
  console.log(\`\${complexity.padEnd(10)} : \${count} activités (\${pct}%)\`);
});
"
```

## Requêtes SQL-like sur les Timings

### Trouver activités idéales pour 30min + Grande équipe

```javascript
const data = require('./lib/retro/activity-timings-data.json');

const ideal30min = Object.values(data).filter(t => {
  const workMin = Array.isArray(t.work) ? t.work[0] : t.work;
  const totalMin = t.explanation + t.questions + workMin;
  
  return (
    totalMin <= 10 &&                    // Max 10min de base
    t.scalingFactor === 'high' &&       // Excellent scaling
    t.setupComplexity !== 'complex' &&  // Pas trop complexe
    t.restitutionPerPerson <= 45        // Partage court
  );
});

console.log(`✅ ${ideal30min.length} activités idéales pour 30min + grande équipe`);
ideal30min.forEach(t => {
  console.log(`  - ${t.activityName} (${t.phase})`);
});
```

### Activités avec Notes Coach par Phase

```javascript
const data = require('./lib/retro/activity-timings-data.json');

const byPhase = Object.values(data)
  .filter(t => t.coachNote)
  .reduce((acc, t) => {
    acc[t.phase] = (acc[t.phase] || []).concat(t);
    return acc;
  }, {});

Object.entries(byPhase).forEach(([phase, activities]) => {
  console.log(`\n${phase}: ${activities.length} avec notes`);
  activities.slice(0, 3).forEach(a => {
    console.log(`  - ${a.activityName}: ${a.coachNote}`);
  });
});
```

## Export pour Analyse Excel

### Créer un export enrichi avec calculs

```bash
node -e "
const data = require('./lib/retro/activity-timings-data.json');
const fs = require('fs');

// Calcul temps minimum et maximum
const enriched = Object.values(data).map(t => {
  const workMin = Array.isArray(t.work) ? t.work[0] : t.work;
  const workMax = Array.isArray(t.work) ? t.work[1] : t.work;
  const expMin = Array.isArray(t.explanation) ? t.explanation[0] : t.explanation;
  const questMin = Array.isArray(t.questions) ? t.questions[0] : t.questions;
  
  const totalMin = expMin + questMin + workMin;
  const totalMax = expMin + questMin + workMax;
  
  // Temps total pour équipes de différentes tailles
  const time6p = totalMin + (6 * t.restitutionPerPerson / 60);
  const time8p = totalMin + (8 * t.restitutionPerPerson / 60);
  const time12p = (totalMin + (12 * t.restitutionPerPerson / 60)) * 1.2; // +20% overhead
  
  return {
    id: t.activityId,
    name: t.activityName,
    phase: t.phase,
    totalMin: Math.round(totalMin),
    totalMax: Math.round(totalMax),
    time6p: Math.round(time6p),
    time8p: Math.round(time8p),
    time12p: Math.round(time12p),
    complexity: t.setupComplexity,
    scaling: t.scalingFactor,
    hasNote: t.coachNote ? 'Yes' : 'No'
  };
});

const header = 'ID,Name,Phase,MinTime,MaxTime,Time6p,Time8p,Time12p,Complexity,Scaling,HasNote\n';
const rows = enriched.map(e => 
  \`\${e.id},\"\${e.name}\",\${e.phase},\${e.totalMin},\${e.totalMax},\${e.time6p},\${e.time8p},\${e.time12p},\${e.complexity},\${e.scaling},\${e.hasNote}\`
).join('\n');

fs.writeFileSync('lib/retro/activity-timings-enriched.csv', header + rows);
console.log('✅ Export enrichi créé: lib/retro/activity-timings-enriched.csv');
"
```

## Statistiques Avancées

### Distribution des temps de restitution

```javascript
const data = require('./lib/retro/activity-timings-data.json');

const restitutionBuckets = {
  '0s (silent)': 0,
  '1-30s': 0,
  '31-60s': 0,
  '61-90s': 0,
  '90s+': 0
};

Object.values(data).forEach(t => {
  if (t.restitutionPerPerson === 0) restitutionBuckets['0s (silent)']++;
  else if (t.restitutionPerPerson <= 30) restitutionBuckets['1-30s']++;
  else if (t.restitutionPerPerson <= 60) restitutionBuckets['31-60s']++;
  else if (t.restitutionPerPerson <= 90) restitutionBuckets['61-90s']++;
  else restitutionBuckets['90s+']++;
});

console.log('⏱️  Distribution des temps de restitution\n');
Object.entries(restitutionBuckets).forEach(([bucket, count]) => {
  const bar = '█'.repeat(count / 5);
  console.log(`${bucket.padEnd(15)} : ${bar} ${count}`);
});
```

### Recommandations par scénario

```javascript
const data = require('./lib/retro/activity-timings-data.json');

function recommend(scenario) {
  const activities = Object.values(data);
  
  let filtered = activities;
  
  if (scenario.duration === 30) {
    filtered = filtered.filter(t => {
      const workMin = Array.isArray(t.work) ? t.work[0] : t.work;
      const totalMin = t.explanation + t.questions + workMin;
      return totalMin <= 10 && t.setupComplexity !== 'complex';
    });
  }
  
  if (scenario.teamSize > 10) {
    filtered = filtered.filter(t => t.scalingFactor !== 'low');
  }
  
  if (scenario.phase) {
    filtered = filtered.filter(t => t.phase === scenario.phase);
  }
  
  return filtered.slice(0, 5);
}

// Exemples
console.log('🎯 Recommandations\n');

console.log('Scénario 1: 30min, 12 personnes, Set the Stage');
recommend({ duration: 30, teamSize: 12, phase: 'set-stage' })
  .forEach(a => console.log(`  - ${a.activityName}`));

console.log('\nScénario 2: 60min, 6 personnes, Generate Insights');
recommend({ duration: 60, teamSize: 6, phase: 'generate-insights' })
  .forEach(a => console.log(`  - ${a.activityName}`));
```

## Validation des Timings

### Vérifier la cohérence

```javascript
const data = require('./lib/retro/activity-timings-data.json');

const issues = [];

Object.values(data).forEach(t => {
  // Vérifier que explanation + questions + work > 2min
  const workMin = Array.isArray(t.work) ? t.work[0] : t.work;
  const totalMin = t.explanation + t.questions + workMin;
  
  if (totalMin < 2) {
    issues.push(`⚠️  ${t.activityName}: Temps total trop court (${totalMin}min)`);
  }
  
  // Vérifier cohérence scaling vs restitution
  if (t.scalingFactor === 'low' && t.restitutionPerPerson < 60) {
    issues.push(`⚠️  ${t.activityName}: Low scaling mais restitution courte?`);
  }
  
  // Vérifier que complexe = plus de temps
  if (t.setupComplexity === 'complex' && t.explanation < 2) {
    issues.push(`⚠️  ${t.activityName}: Complex mais explication courte`);
  }
});

if (issues.length === 0) {
  console.log('✅ Tous les timings sont cohérents!');
} else {
  console.log(`⚠️  ${issues.length} incohérences détectées:\n`);
  issues.forEach(i => console.log(i));
}
```

## Génération de Rapports

### Rapport par Phase

```bash
node -e "
const data = require('./lib/retro/activity-timings-data.json');

const phases = ['set-stage', 'gather-data', 'generate-insights', 'decide-what-to-do', 'close'];

phases.forEach(phase => {
  const activities = Object.values(data).filter(t => t.phase === phase);
  
  const avgWork = activities.reduce((sum, t) => {
    const work = Array.isArray(t.work) ? (t.work[0] + t.work[1]) / 2 : t.work;
    return sum + work;
  }, 0) / activities.length;
  
  const avgRest = activities.reduce((sum, t) => sum + t.restitutionPerPerson, 0) / activities.length;
  
  console.log(\`\n📊 \${phase}\`);
  console.log(\`   Activités: \${activities.length}\`);
  console.log(\`   Travail moyen: \${avgWork.toFixed(1)}min\`);
  console.log(\`   Restitution moyenne: \${avgRest.toFixed(0)}s/pers\`);
  console.log(\`   Simple: \${activities.filter(a => a.setupComplexity === 'simple').length}\`);
  console.log(\`   Complex: \${activities.filter(a => a.setupComplexity === 'complex').length}\`);
});
"
```

---

## 🚀 Utilisation dans le Code

### Import et usage basique

```typescript
import { ACTIVITY_TIMINGS_DATA } from '@/lib/retro/activity-timings-data'
import { calculateTotalTime, getOptimalWorkTime } from '@/lib/retro/activity-timings'

// Get timing for specific activity
const timing = ACTIVITY_TIMINGS_DATA['retromat-7']

// Calculate total time for 8 people
const totalTime = calculateTotalTime(timing, 8)

// Get optimal work time based on team size
const workTime = getOptimalWorkTime(timing, 8)
```

### Filtrage intelligent

```typescript
// Find activities suitable for 30min + large team
const suitable = Object.values(ACTIVITY_TIMINGS_DATA).filter(timing => {
  const workMin = Array.isArray(timing.work) ? timing.work[0] : timing.work
  const baseTime = timing.explanation + timing.questions + workMin
  
  return (
    baseTime <= 10 &&
    timing.scalingFactor === 'high' &&
    timing.setupComplexity !== 'complex'
  )
})
```

---

**Ces outils d'analyse permettent d'exploiter pleinement les 146 timings terrain ! 📊**
