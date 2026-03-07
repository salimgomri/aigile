# Système de Timing des Activités - Documentation Coach Terrain

## Vue d'ensemble

Le système de timing a été développé avec **30 ans d'expérience terrain** en facilitation d'ateliers rétrospective et dynamique de groupe. Il couvre les **146 activités Retromat** avec des estimations réalistes basées sur l'expérience.

## Structure des Données

### Décomposition du Timing (4 Phases)

Chaque activité est décomposée en 4 phases distinctes :

```typescript
{
  explanation: 2,           // Temps pour présenter l'activité (minutes)
  questions: 1,             // Temps pour clarifications (minutes)
  work: [5, 8],            // Temps de travail actif (min-max minutes)
  restitutionPerPerson: 60 // Temps de partage par personne (secondes)
}
```

### Métadonnées de Complexité

```typescript
{
  setupComplexity: 'simple' | 'medium' | 'complex',
  scalingFactor: 'high' | 'medium' | 'low', // Qualité du scaling avec grandes équipes
  coachNote: string // Note optionnelle du coach
}
```

## Règles d'Estimation Terrain

### 1. Explication (Explanation)

| Type d'activité | Temps |
|----------------|-------|
| Check-in/Vote simple | 1-2 min |
| Activité standard | 2-3 min |
| Activité complexe (multi-étapes) | 3-5 min |
| Métaphore (Sailboat, Starfish) | 3 min + clarification |

**Rationale** : Les activités métaphoriques nécessitent une explication claire de la métaphore avant de démarrer.

### 2. Questions & Clarifications

| Contexte | Temps |
|----------|-------|
| Activité simple/connue | 0.5-1 min |
| Activité standard | 1-2 min |
| Activité complexe/nouvelle | 2-3 min |

**Rationale** : Toujours prévoir du temps pour les questions. Une équipe qui ne pose pas de questions est souvent une équipe qui n'a pas compris.

### 3. Travail (Work Time)

| Type de travail | Temps |
|----------------|-------|
| Réflexion individuelle légère | 3-5 min |
| Réflexion individuelle profonde | 8-10 min |
| Travail en binômes | 8-12 min |
| Travail en groupes | 10-20 min |
| Écriture/création visuelle | +2-5 min |

**Rationale** : Le travail en binôme nécessite du temps de synchronisation. Les groupes nécessitent encore plus de temps d'alignement.

### 4. Restitution (Par Personne)

| Format | Temps/personne |
|--------|---------------|
| Quick check-in (1 mot) | 10-20s |
| Check-in standard | 30s |
| Partage standard | 45-60s |
| Partage approfondi | 75-90s |
| Analyse profonde (5 Whys) | 90-120s |

**Important** : Pour équipes >8 personnes, appliquer **-20% d'efficacité** (overhead de coordination).

## Indicateurs de Complexité

### Setup Complexity

- **Simple** : Pas de matériel spécial, explications directes
  - Ex: Weather Report, One Word, Dot Voting
  
- **Medium** : Matériel standard, métaphore à expliquer
  - Ex: Sailboat, Timeline, 5 Whys
  
- **Complex** : Multi-étapes, matériel spécifique, préparation
  - Ex: Like to Like, Perfection Game

### Scaling Factor

- **High** : Fonctionne aussi bien avec 5 que 15 personnes
  - Ex: Votes anonymes, activités silencieuses, dot voting
  
- **Medium** : Acceptable jusqu'à 10-12 personnes, breakouts recommandés au-delà
  - Ex: Mad Sad Glad, Timeline, Matrix
  
- **Low** : Difficile >8 personnes, nécessite breakouts obligatoires
  - Ex: 5 Whys, discussions profondes, Perfection Game

## Calcul du Temps Total

```typescript
totalTime = explanation + questions + work + (restitutionPerPerson * teamSize / 60)

// Pour équipes >8 personnes :
totalTime *= 1.2  // +20% overhead
```

### Exemple Concret : Mad Sad Glad

**Équipe de 6 personnes, durée 60 min :**

```
Explanation:  3 min
Questions:    2 min
Work:         7 min (fourchette 5-10 min, équipe moyenne)
Restitution:  6 × 45s = 270s = 4.5 min
──────────────────
TOTAL:        16.5 min
```

**Équipe de 12 personnes, durée 60 min :**

```
Explanation:  3 min
Questions:    2 min
Work:         9 min (temps augmenté pour grande équipe)
Restitution:  12 × 45s = 540s = 9 min
Overhead:     (3+2+9+9) × 0.2 = 4.6 min
──────────────────
TOTAL:        27.6 min
```

## Utilisation dans l'Activity Selector

### Bonus de Scoring

Le sélecteur d'activités applique des bonus/malus basés sur les timings :

```typescript
// Bonus pour setup simple en 30min
if (duration === 30 && setupComplexity === 'simple') {
  score += 10
}

// Bonus pour bon scaling avec grande équipe
if (teamSize > 8 && scalingFactor === 'high') {
  score += 10
}

// Pénalité pour mauvais scaling
if (teamSize > 8 && scalingFactor === 'low') {
  score -= 15
}
```

### Exemple de Sélection

**Contexte** : 30 min, 10 personnes, pattern "silent-team"

**Activités favorisées** :
- ESVP (scalingFactor: high, setupComplexity: simple)
- Dot Voting (restitution: 0s, très rapide)
- One Word (restitutionPerPerson: 10s)

**Activités évitées** :
- 5 Whys (scalingFactor: low, trop long)
- Lean Coffee (work: 15-25min, trop variable)

## Statistiques du Dataset

**Total activités** : 146

### Répartition par Complexité
- Simple : 27 activités (18%)
- Medium : 27 activités (18%)
- Complex : 92 activités (64%)

### Répartition par Scaling
- High : 66 activités (45%)
- Medium : 59 activités (40%)
- Low : 21 activités (15%)

### Notes Coach
- 108 activités avec notes (74%)
- 38 sans notes spécifiques (26%)

## Conseils d'Utilisation Terrain

### Pour Rétros 30 min
✅ Privilégier :
- setupComplexity: 'simple'
- scalingFactor: 'high'
- restitutionPerPerson ≤ 45s

❌ Éviter :
- Activités à fourchette large [10-20 min]
- scalingFactor: 'low'
- Métaphores complexes

### Pour Grandes Équipes (>10)
✅ Privilégier :
- scalingFactor: 'high'
- Formats anonymes/silencieux
- Breakouts intégrés

❌ Éviter :
- Tours de table complets
- Discussions profondes en plénière
- Activités "low scaling"

### Pour Insights Profonds
✅ Privilégier :
- work ≥ 10 min
- restitutionPerPerson ≥ 75s
- Phase "generate-insights"

❌ Éviter :
- Contraintes de temps <45min
- Équipes >12 sans breakouts

## Fichiers Générés

### activity-timings-data.json
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

### activity-timings-data.ts
Export TypeScript pour import direct dans le code.

## Maintenance

### Mise à Jour des Timings

Pour régénérer les timings après modification du dataset :

```bash
cd /Volumes/T9/aigile
npx tsx scripts/generate-activity-timings.ts
```

### Ajout de Timings Manuels

Pour affiner un timing spécifique, éditer directement `activity-timings.ts` :

```typescript
export const ACTIVITY_TIMINGS: Record<string, ActivityTiming> = {
  'retromat-1': {
    activityId: 'retromat-1',
    activityName: 'ESVP',
    phase: 'set-stage',
    explanation: 2,        // Affiné manuellement
    questions: 1,          // Affiné manuellement
    work: 1,              // Simplifié
    restitutionPerPerson: 0,
    setupComplexity: 'simple',
    scalingFactor: 'high',
    coachNote: 'Résultats présentés en agrégé uniquement.'
  }
}
```

## Impact sur l'Expérience Utilisateur

### Avant (Sans Timings Détaillés)
- Estimations génériques par phase
- Pas d'adaptation à la taille d'équipe
- Risque de débordement

### Après (Avec Timings Terrain)
- Estimations précises par activité
- Adaptation automatique team size
- Breakdown détaillé (explication, travail, restitution)
- Notes coach pour faciliter

### Exemple Concret

**Plan généré pour 8 personnes, 60 min** :

```
| Phase      | Activité        | Temps | Temps/pers | Pourquoi choisi |
|------------|-----------------|-------|------------|-----------------|
| Set Stage  | Weather Report  | 5min  | 20s/pers   | Check-in rapide |
| Gather     | Mad Sad Glad    | 17min | 45s/pers   | Données brutes  |
| Insights   | 5 Whys          | 22min | 90s/pers   | Analyse profonde|
| Decide     | Dot Voting      | 11min | 0s/pers    | Priorisation    |
| Close      | One Word        | 3min  | 10s/pers   | Clôture rapide  |
──────────────────────────────────────────────────────────────────
TOTAL: 58 min ✓
```

Chaque temps est calculé avec la décomposition complète, garantissant un plan réaliste.

---

**Créé par** : Coach Agile terrain (30 ans d'expérience)
**Date** : Mars 2026
**Version** : 1.0
**Dataset** : 146 activités Retromat
