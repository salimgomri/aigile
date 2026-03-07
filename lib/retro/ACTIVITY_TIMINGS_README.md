# Activity Timings - README

## 📁 Structure des Fichiers

```
lib/retro/
├── activity-timings.ts              # Types et utilitaires TypeScript
├── activity-timings-data.ts         # Export des 146 timings (auto-généré)
├── activity-timings-data.json       # Données brutes JSON (auto-généré)
└── activity-timings.csv             # Export CSV pour analyse (auto-généré)

scripts/
└── generate-activity-timings.ts     # Script de génération

docs/
├── TIMING_SYSTEM.md                 # Documentation complète
├── TIMING_SUMMARY.md                # Résumé exécutif
├── TIMING_ANALYSIS.md               # Guide d'analyse
└── TIMING_MISSION_COMPLETE.md       # Rapport final
```

## 🚀 Quick Start

### Utiliser les timings dans le code

```typescript
import { ACTIVITY_TIMINGS_DATA } from '@/lib/retro/activity-timings-data'
import { calculateTotalTime, getOptimalWorkTime } from '@/lib/retro/activity-timings'

// Get timing for an activity
const timing = ACTIVITY_TIMINGS_DATA['retromat-7']

// Calculate total time for a team
const totalMinutes = calculateTotalTime(timing, teamSize)

// Get optimal work time based on team size
const workTime = getOptimalWorkTime(timing, teamSize)
```

### Régénérer les timings

```bash
npx tsx scripts/generate-activity-timings.ts
```

### Analyser les données

```bash
# CSV
open lib/retro/activity-timings.csv

# JSON
cat lib/retro/activity-timings-data.json | jq
```

## 📖 Documentation

- **[TIMING_SYSTEM.md](../TIMING_SYSTEM.md)** : Documentation complète du système
- **[TIMING_SUMMARY.md](../TIMING_SUMMARY.md)** : Résumé exécutif et statistiques
- **[TIMING_ANALYSIS.md](../TIMING_ANALYSIS.md)** : Guide d'analyse avancée
- **[TIMING_MISSION_COMPLETE.md](../TIMING_MISSION_COMPLETE.md)** : Rapport final de mission

## 📊 Statistiques

- **146 activités** analysées (100% du dataset Retromat)
- **4 phases** de timing par activité
- **108 notes coach** (74%)
- **3 niveaux** de complexité (Simple, Medium, Complex)
- **3 facteurs** de scaling (High, Medium, Low)

## 🎯 Principes Clés

### Décomposition en 4 Phases

1. **Explication** : Présentation et consignes
2. **Questions** : Clarifications
3. **Travail** : Temps actif des participants
4. **Restitution** : Partage (temps par personne)

### Adaptation Team Size

- **≤8 personnes** : Temps standard
- **>8 personnes** : +20% overhead (coordination)
- **Scaling Factor** : High/Medium/Low selon adaptabilité

### Métadonnées

- **Setup Complexity** : Simple/Medium/Complex
- **Scaling Factor** : High/Medium/Low
- **Coach Note** : Conseils terrain optionnels

## 💡 Exemples d'Utilisation

### Filtrer activités pour 30min + grande équipe

```typescript
const suitable = Object.values(ACTIVITY_TIMINGS_DATA).filter(t => {
  const workMin = Array.isArray(t.work) ? t.work[0] : t.work
  const baseTime = t.explanation + t.questions + workMin
  
  return (
    baseTime <= 10 &&
    t.scalingFactor === 'high' &&
    t.setupComplexity !== 'complex'
  )
})
```

### Calculer temps pour différentes tailles d'équipe

```typescript
const timing = ACTIVITY_TIMINGS_DATA['retromat-7']

const time6p = calculateTotalTime(timing, 6)   // ~18 min
const time8p = calculateTotalTime(timing, 8)   // ~21 min
const time12p = calculateTotalTime(timing, 12) // ~29 min (avec overhead)
```

### Scorer activités selon contexte

```typescript
function scoreActivity(timing, duration, teamSize) {
  let score = 50
  
  if (duration === 30 && timing.setupComplexity === 'simple') score += 10
  if (teamSize > 8 && timing.scalingFactor === 'high') score += 10
  if (teamSize > 8 && timing.scalingFactor === 'low') score -= 15
  
  return score
}
```

## 🔧 Maintenance

### Mettre à jour un timing manuellement

Éditer `activity-timings.ts` et ajouter/modifier dans `ACTIVITY_TIMINGS` :

```typescript
'retromat-1': {
  activityId: 'retromat-1',
  activityName: 'ESVP',
  phase: 'set-stage',
  explanation: 2,           // Ajusté manuellement
  questions: 1,
  work: 1,
  restitutionPerPerson: 0,
  setupComplexity: 'simple',
  scalingFactor: 'high',
  coachNote: 'Résultats agrégés uniquement.'
}
```

### Régénérer après modification du dataset

```bash
cd /Volumes/T9/aigile
npx tsx scripts/generate-activity-timings.ts
```

Cela régénère :
- `activity-timings-data.json`
- `activity-timings-data.ts`
- `activity-timings.csv`

## 📈 Format des Données

### JSON Structure

```json
{
  "retromat-1": {
    "activityId": "retromat-1",
    "activityName": "ESVP",
    "phase": "set-stage",
    "explanation": 3,
    "questions": 2,
    "work": [1, 2],
    "restitutionPerPerson": 0,
    "setupComplexity": "complex",
    "scalingFactor": "high",
    "coachNote": "Format anonyme ou silencieux."
  }
}
```

### CSV Columns

```
ID, Name, Phase, Explanation(min), Questions(min), Work(min),
RestitutionPerPerson(s), SetupComplexity, ScalingFactor, HasCoachNote
```

## 🎓 Règles d'Estimation

### Explication

| Type | Temps |
|------|-------|
| Simple (check-in, vote) | 1-2 min |
| Standard | 2-3 min |
| Complexe (métaphore, multi-étapes) | 3-5 min |

### Questions

| Type | Temps |
|------|-------|
| Simple/connue | 0.5-1 min |
| Standard | 1-2 min |
| Nouvelle/complexe | 2-3 min |

### Travail

| Type | Temps |
|------|-------|
| Check-in rapide | 0.5-2 min |
| Réflexion légère | 3-5 min |
| Réflexion profonde | 8-10 min |
| Binômes | 8-12 min |
| Groupes | 10-20 min |

### Restitution

| Type | Temps/pers |
|------|------------|
| One word | 10s |
| Quick check-in | 20-30s |
| Standard | 45-60s |
| Approfondi | 75-90s |
| Deep dive | 90-120s |
| Anonyme | 0s |

## 🏆 Qualité

- ✅ **100% couverture** : Les 146 activités Retromat
- ✅ **Basé terrain** : 30 ans d'expérience coaching
- ✅ **Adaptatif** : Team size + duration + complexity
- ✅ **Documenté** : Notes coach + règles claires
- ✅ **Exploitable** : JSON + TypeScript + CSV

## 📧 Support

Pour questions ou suggestions :
1. Consulter la documentation (`TIMING_*.md`)
2. Analyser les données (`activity-timings.csv`)
3. Tester les calculs (voir exemples ci-dessus)

## 🎉 Contribution

Ce système a été développé avec l'expérience terrain d'un coach Agile de 30 ans. Les timings reflètent la réalité des rétros : temps morts, clarifications, moments de flottement inclus.

**Principe** : Il vaut mieux terminer 5 min plus tôt qu'avoir une activité bâclée ! ⏱️

---

**Version** : 1.0  
**Date** : Mars 2026  
**Statut** : Production-ready 🚀
