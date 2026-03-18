# Architecture : tracking utilisation des outils par user

## Objectif

- Nombre de générations par outil (retro questionnaire, retro aléatoire, DORA, etc.)
- Crédits consommés par action, avec datetime
- Évolutif : ajouter un outil = mapping simple dans un seul fichier

## État actuel

- **credit_transactions** : `user_id`, `action`, `cost`, `plan_at_time`, `team_id`, `sprint_id`, `created_at`
- **CREDIT_ACTIONS** : mapping action → cost, label, tool (path)
- Chaque `consumeCredits()` insère une ligne dans credit_transactions

**Limite** : pas de regroupement par outil, stats difficiles (action = rétro_ai_plan vs retro_random, même outil /retro).

---

## Solution A : Évolution de credit_transactions (tool_slug)

### Principe

- Ajouter colonne `tool_slug` à `credit_transactions` (retro, dora, okr, skill-matrix, dashboard)
- À chaque insert, déduire `tool_slug` de `CREDIT_ACTIONS[action].tool` → `/retro` → `retro`
- Vues SQL pour stats par user, par outil, par période

### Schéma

```
credit_transactions
  + tool_slug TEXT  -- retro | dora | okr | skill-matrix | dashboard
```

### Mapping (dans lib/credits/actions.ts)

```ts
// tool: '/retro' → tool_slug: 'retro'
// tool: '/skill-matrix' → tool_slug: 'skill-matrix'
```

### Avantages

- Une seule table, une seule source de vérité
- Pas de duplication
- Ajout outil = ajouter dans CREDIT_ACTIONS avec `tool: '/nouveau'`
- Migration légère, backfill possible

### Inconvénients

- tool_slug dérivé de action (couplage)
- Si une action n'a pas de tool dans CREDIT_ACTIONS, tool_slug = null

---

## Solution B : Table tool_usage séparée

### Principe

- Nouvelle table `tool_usage` dédiée analytics
- `consumeCredits` écrit dans `credit_transactions` (comptabilité) ET `tool_usage` (stats)
- `tool_slug` = premier citoyen, `action_slug` = détail

### Schéma

```
tool_usage
  id UUID
  user_id TEXT
  tool_slug TEXT NOT NULL      -- retro, dora, okr, skill-matrix, dashboard
  action_slug TEXT NOT NULL    -- retro_ai_plan, retro_random, ...
  credits_cost INT NOT NULL
  plan_at_time TEXT
  team_id UUID
  sprint_id UUID
  created_at TIMESTAMPTZ
```

### Avantages

- Découplage analytics / comptabilité
- tool_slug explicite, table dédiée aux stats
- Peut évoluer (metadata JSONB, etc.) sans toucher credit_transactions

### Inconvénients

- Duplication : 2 points d'insert à maintenir
- Risque de désync si un insert échoue

---

## Choix : Solution A

**Raisons :**

1. **Simplicité** : une table, un point d'insert, pas de désync
2. **Évolutivité** : CREDIT_ACTIONS est déjà le registry ; ajouter `tool: '/x'` suffit
3. **Cohérence** : credit_transactions reste la source de vérité pour tout ce qui touche aux crédits
4. **Coût** : migration légère vs nouvelle table + double écriture

La Solution B aurait du sens si on voulait tracker des **tentatives** (échecs par manque de crédits) ou des **événements gratuits** sans lien aux crédits. Pour l'instant, on tracke uniquement les utilisations effectives (consommation réussie).

---

## Implémentation (Solution A)

### Fichiers modifiés

- `lib/credits/actions.ts` : `getToolSlugForAction(action)` → extrait slug du path
- `lib/credits/manager.ts` : `consumeCredits` insère `tool_slug` à chaque insert
- `supabase/migrations/020_tool_usage_tracking.sql` : colonne + vues

### Vues disponibles

| Vue | Usage |
|-----|-------|
| `v_tool_usage_by_user` | Par user : usage_count, credits_spent, first/last_used_at par tool_slug |
| `v_tool_usage_detail` | Détail ligne par ligne (user, tool, action, cost, created_at) |
| `v_tool_usage_global` | Stats admin : total_uses, total_credits_spent, unique_users par outil/action |

### Ajouter un nouvel outil

1. Dans `lib/credits/actions.ts`, ajouter l'action avec `tool: '/nouveau-tool'`
2. Le `tool_slug` sera automatiquement `nouveau-tool`
3. Si besoin, ajouter le mapping dans le backfill de la migration (pour les anciennes données)
