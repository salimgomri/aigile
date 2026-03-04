## Outil de rétro IA – Spécification fonctionnelle & technique

Version initiale générée à partir du projet `teammomentum` (outil de rétro IA).

---

## 1. Objectif produit

- **But**: générer des rétrospectives agiles sur‑mesure à partir d’un mini‑questionnaire, en détectant des patterns de dysfonctionnement d’équipe et en mappant ces patterns à des activités Retromat pertinentes.
- **Cible**: Scrum / équipes produit, coachs agile, managers.
- **Positionnement dans `aigile`**: un des outils de la future suite `aigile.lu` (aux côtés d’un questionnaire AP1, d’une skills matrix, d’un baromètre d’équipe, etc.).

---

## 2. Taxonomie des patterns

### 2.1 Patterns racines (P1–P5)

- **P1 – Sécurité psychologique basse**  
  - Les gens n’osent pas dire ce qu’ils pensent, peur des conséquences.  
  - Symptômes: silence, 2–3 personnes qui monopolisent, faux consensus, éléphant dans la pièce, blâme externe.

- **P2 – Perte de sens / direction floue**  
  - L’équipe ne comprend pas pourquoi elle fait ce qu’elle fait ni où ça va.  
  - Symptômes: “on ne sait pas pourquoi on fait ça”, priorités changeantes, feature factory, cynisme, rituels vides.

- **P3 – Impuissance apprise (actions sans impact)**  
  - Les problèmes sont connus mais rien ne change vraiment.  
  - Symptômes: mêmes plaintes chaque sprint, actions jamais réalisées, “on a déjà essayé”, dépendances bloquantes, frustration.

- **P4 – Fragmentation / manque de cohésion**  
  - Groupe d’individus plus qu’une équipe.  
  - Symptômes: silos, pas d’entraide, objectifs individuels > collectifs, remote invisibles, sous‑groupes / clans.

- **P5 – Surcharge / pression insoutenable**  
  - Équipe en surchauffe permanente, pas de bande passante pour l’amélioration.  
  - Symptômes: burnout visible, mode urgence permanent, interruptions constantes, dette technique explosive, qualité dégradée.

### 2.2 Patterns secondaires (PA–PD)

- **PA – Rituels agile dysfonctionnels (Scrum Theatre)**  
  - Daily = rapport au chef, rétro “pour cocher la case”, plannings interminables.

- **PB – Problèmes de facilitation en rétro**  
  - Rétro ennuyeuse, format répétitif, 2–3 personnes dominent, actions vagues, on tourne en rond.

- **PC – Conflit ouvert / toxicité**  
  - Clashes interpersonnels, attaques personnelles, agressivité passive, guerres de territoires.

- **PD – Problèmes techniques / delivery**  
  - Bugs fréquents, incidents prod, dette technique ingérable, déploiements douloureux, pas de DoD, rework constant.

---

## 3. Questionnaire de détection (Q1–Q8)

### 3.1 Structure

- 8 questions, **single‑choice**.  
- But: déclencher des signaux sur les 9 patterns (P1–P5, PA–PD).  
- Q1, Q4, Q5 → pilier “socio‑comportemental”.  
- Q6, Q7 → pilier “delivery / qualité”.  
- Q8 → durée souhaitée (30/45/60/90 minutes).

### 3.2 Questions & réponses (FR simplifié)

- **Q1 – Ambiance en rétro**  
  1. Silencieuse, hésitation à parler (P1)  
  2. Conviviale mais superficielle (PA, PB)  
  3. Tendue, non‑dits/tensions (PC, P1)  
  4. Ennuyée, toujours la même chose (PB)  
  5. Énergique et constructive (aucun pattern)

- **Q2 – Réaction pendant la rétro à un sujet inconfortable**  
  1. On change de sujet / on minimise (P1, PA)  
  2. Conflit ou attaques personnelles (PC, P1)  
  3. On écoute poliment mais on ne creuse pas (PA, PB, P1)  
  4. Analyse calme et recherche de solutions (aucun pattern)  
  5. Une personne monopolise, les autres se taisent (PB, P1)

- **Q3 – Ce qui se passe entre les rétros quand un problème revient**  
  1. On n’en parle plus jusqu’à la prochaine rétro (P3, PB)  
  2. On essaie une action puis on abandonne si ça ne marche pas vite (P3)  
  3. On en parle partout mais rien ne change dans la façon de travailler (P3:2, PB:1)  
  4. On adapte réellement nos règles/process et le problème disparaît (aucun pattern)  
  5. On escalade presque tout au management sans agir nous‑mêmes (P3, P1)

- **Q4 – Collaboration dans l’équipe**  
  1. Silos, peu d’entraide (P4)  
  2. Clans, personnes qui ne se parlent pas (PC, P4)  
  3. Déséquilibrée: certains portent tout, d’autres le minimum (P5, P4)  
  4. Superficielle, on travaille ensemble sans vraie connexion (PA, P2)  
  5. Fluide et solidaire (aucun pattern)

- **Q5 – Défi principal actuel (5 options)**  
  1. Manque de confiance pour dire les choses (P1)  
  2. Perte de sens: “Pourquoi on fait ça ?” (P2)  
  3. Sentiment que “rien ne change” malgré les rétros (P3)  
  4. Surcharge de travail, burnout imminent (P5)  
  5. Conflits ou tensions interpersonnelles (PC)

- **Q6 – Gestion de la charge de travail**  
  1. Débordée (trop de WIP, deadlines impossibles) (P5)  
  2. Inefficace (beaucoup d’efforts, peu de résultats) (P3, PD)  
  3. Inégale (certains surchargés, d’autres désœuvrés) (P4)  
  4. Bâclée (aller vite au détriment de la qualité) (PD, P5)  
  5. Équilibrée et soutenable (aucun pattern)

- **Q7 – Qualité du travail**  
  1. Dette technique croissante, qualité en baisse (PD)  
  2. Bugs fréquents, incidents prod (PD, P5)  
  3. “Fait” mais pas “bien fait” (PD)  
  4. Qualité variable selon les personnes (P4)  
  5. Bonne qualité, équipe fière du travail (aucun pattern)

- **Q8 – Durée souhaitée**  
  - 30 min / 45 min / 60 min / 90 min (durée utilisée pour filtrer les activités).

---

## 4. Mécanisme de scoring & détection

- Chaque réponse a un objet `patterns` du type:

```json
{
  "P3": 2,
  "PB": 1
}
```

- **Algorithme (`lib/pattern-detection.js`)**:
  - Initialise les scores à 0 pour chaque pattern (P1–P5, PA–PD).  
  - Pour chaque réponse choisie, ajoute les points correspondants.  
  - Trie les patterns par score décroissant.  
  - **Pattern primaire**: score maximum.  
  - **Patterns secondaires**: ceux avec score ≥ 50 % du primaire (max 2).  
  - Retourne:

```json
{
  "primary": { "code": "P3", "score": 9, "name": "..." },
  "secondary": [
    { "code": "P5", "score": 6, "name": "..." }
  ],
  "allScores": { "P1": 3, "P2": 0, ... }
}
```

- **Durée**: déterminée uniquement par Q8 (30/45/60/90).

---

## 5. Mapping patterns → problèmes → activités

### 5.1 Problèmes “rétro” (retro-data)

Chaque problème correspond à un pattern primaire et alimente un template de rétrospective:

- `silent-team` → P1 (sécurité psychologique basse)  
- `repetitive-complaints` → P3 (impuissance)  
- `tensions` → PC (conflits)  
- `lack-purpose` → P2 (sens)  
- `no-team` → P4 (cohésion)  
- `burnout` → P5 (surcharge, + PD en secondaire)

Ces clés servent à indexer les templates dans `lib/retro-data.js` (liste d’activités, phases, durées).

### 5.2 Service de patterns (`lib/retro-patterns-service.js`)

Principales responsabilités:

- **`getPatternsForProblem(problemKey)`**  
  - Retourne: pattern primaire, secondaires, tags utiles (ex: `P1-silence`, `PB-dominance`).

- **`getRecommendedActivities(problemKey, teamSize, duration, trustLevel)`**  
  - Charge les activités du template correspondant.  
  - Filtre par tags (patterns), taille d’équipe, niveau de confiance, durée.  
  - S’assure que toutes les phases Retromat sont présentes:
    - Set the Stage  
    - Gather Data  
    - Generate Insights  
    - Decide What to Do  
    - Close the Retro

- **`generateRetroVariants(...)`**  
  - Génère plusieurs variantes de rétro (différentes combinaisons d’activités) respectant la durée demandée.

- **`getPatternDescription(code)`**  
  - Donne nom, définition, symptômes, causes racines, tags pour un pattern donné.

---

## 6. Architecture technique côté `teammomentum`

(Référence pour une future intégration dans `aigile.lu`)

- **Framework**: Next.js (App Router), React, TailwindCSS, shadcn/ui.  
- **Racines fonctionnelles**:
  - `app/retro/page.js` – landing de l’outil.  
  - `app/retro/questionnaire/page.js` – questionnaire (utilise `getQuestions`, `detectPatterns`, `getDurationFromAnswers`).  
  - `app/retro/resultat/[id]/page.js` – génération de la rétro, rendu des activités et explications.  
- **APIs**:
  - `app/api/retro/random/route.js` – rétro aléatoire (“Flash Retro”).  
  - `app/api/retro/activities/route.js` – données d’activités.  
  - `app/api/retro/auth/route.js`, `app/api/use-retro/route.js` – tracking / auth (optionnel).

Pour `aigile.lu` (site statique aujourd’hui), le plus simple à court terme est:

1. **Conserver ce document comme spec de référence**.  
2. Quand un backend frontend plus riche sera prêt pour `aigile` (React/Next ou autre),  
   - créer un module `retro-core` (patterns, questionnaire, scoring, mapping),  
   - réimplémenter l’UI dans le style `aigile` (thème Apple‑like déjà présent dans `index.html`),  
   - exposer `/outils/retro` dans la navigation.

---

## 7. Points importants pour future intégration `aigile.lu`

- **Look & feel**:  
  - Garder le style “premium” Apple‑like déjà présent dans `index.html` (fond dégradé sombre, typos, animations subtiles).  
  - Réutiliser les patterns visuels: gradients, cartes, labels de section.

- **Extensibilité outils**:  
  - Prévoir une future section “Outils AIgile” regroupant:
    - Outil de rétro IA (ce module)  
    - Questionnaire AP1  
    - Skills Matrix  
    - Team Barometer  
  - Mutualiser: header, thème, toggle langue, footer.

- **Données & contenu**:  
  - Ce document + les fichiers JSON du projet `teammomentum` (`questionnaire-patterns.json`, `retro-patterns-taxonomy.json`, `retro-explanations.json`) suffisent à reconstituer toute la logique de l’outil.

---

## 8. Scripts de maintenance (référence)

Dans `teammomentum/scripts`, plusieurs scripts Node servent à **préparer et maintenir les données de l’outil de rétro**. En cas de recréation dans `aigile`, ils peuvent être réimplémentés si tu veux rafraîchir les données ou enrichir les explications.

- **Alimentation des activités Retromat**
  - `scrape-retromat.js` : récupère les données brutes Retromat (EN/FR) et produit `data/retromat-raw*.json`.
  - `integrate-retromat.js` : transforme les données taggées en `lib/retro-data.js` (templates de rétro par problème).

- **Qualité & enrichissement des explications**
  - `improve-explanations.js`, `add-missing-materials.js`, `add-action-verbs.js`, `add-action-verbs-v2.js` : enrichissent les textes d’explication (verbes d’action, matériel, etc.).
  - `enrich-explanations-with-metadata.js` : ajoute métadonnées (patterns, niveaux, etc.) dans `retro-explanations.json`.
  - `generate-why-for-all-activities.js` : génère le “pourquoi” pédagogique de chaque activité.

- **Corrections linguistiques FR/EN**
  - `fix-fr-en-proper-translation.js`, `fix-fr-en-manual-translation.js`, `fix-fr-en-inconsistencies.js`, `fix-all-fr-en-final.js`, `fix-franglais-final.js`, `fix-franglais-restants.js`, `identifier-vrais-problemes-franglais.js` : scripts successifs de nettoyage FR/EN et de correction du franglais.
  - `fix-html-entities.js` : corrige les entités HTML.

- **Audits & rapports qualité**
  - `quality-audit-explanations.js`, `audit-complet.js`, `generate-clarity-check.js` : audits automatiques de clarté/qualité des explications.
  - `fix-corruptions-urgent.js`, `fix-and-integrate-perplexity.js`, `verify-perplexity-corrections.js`, `apply-all-manual-translations.js`, `apply-translations.js` : pipeline de correction basé sur Perplexity + validations manuelles.
  - `generate-recapitulatif.js` : génère `RECAPITULATIF_PATTERNS_ACTIVITES.md` (vue globale patterns ↔ activités ↔ explications).

Ces scripts ne sont **pas nécessaires à l’exécution** de l’outil, mais constituent un **outillage utile** si tu veux:

- resynchroniser les données avec Retromat,  
- améliorer la qualité éditoriale,  
- (re)générer les documents de synthèse et d’audit.

