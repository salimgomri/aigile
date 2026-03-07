# Version 1.0.0

**Release Date:** March 4, 2026

## 🎯 Vue d'ensemble

Version initiale complète de l'AI Retro Tool avec logique terrain basée sur 30 ans d'expérience en coaching Agile.

## ✨ Fonctionnalités principales

### 1. Système de Pattern Detection
- **9 patterns de dysfonctionnement** (5 primaires + 4 secondaires)
- **Questionnaire en 8 questions** avec validation automatique
- **Détection intelligente** basée sur des poids calibrés
- **Analyse multi-critères** (primaire + secondaire)

### 2. Base d'Activités Retromat
- **146 activités complètes** scrapées et intégrées
- **Timings détaillés** avec décomposition 4 phases :
  - Explication (présentation)
  - Questions/Réponses (clarifications)
  - Réflexion/Travail (action)
  - Restitution (calcul par personne)
- **108 coach notes** (74% des activités)
- **Métadonnées riches** (durée, participants, trust level, etc.)

### 3. Système d'Activités Universelles
- **45 activités universelles** identifiées par phase :
  - Set the Stage: 7 activités
  - Gather Data: 8 activités
  - Generate Insights: 5 activités
  - Decide What to Do: 12 activités
  - Close the Retro: 8 activités
- **Scoring prioritaire** : +30 points pour activités spécifiques au pattern
- **Couverture garantie** : toutes les phases pour tous les patterns

### 4. Logique de Sélection Terrain
- **Optimisation durée** : 30min (3 phases), 45min, 60min, 90min (5 phases)
- **Optimisation taille équipe** : 3-5p, 6-8p, 9-12p, 12+p
- **Temps de parole** calculé par personne avec scaling
- **Techniques de facilitation** adaptées (pairs, breakouts, etc.)
- **Time allocation** réaliste et respectée (7+15+15+18+5 = 60 min)

### 5. Générateur de Retro
- **Mode questionnaire** : détection de pattern puis génération ciblée
- **Mode aléatoire** : génération directe avec sélection durée/taille équipe
- **Plan complet** avec :
  - Activités par phase
  - Temps alloué et calculé
  - Temps de parole par personne
  - Instructions détaillées
  - Techniques de facilitation
  - Conseils terrain

### 6. Interface Utilisateur
- **Design moderne** Apple-like avec gradients
- **Dual theme** : Sarah (violet) et Maya (bleu)
- **i18n complet** : Français et Anglais
- **Navigation fluide** avec auto-validation
- **Responsive** et optimisé mobile
- **Animations** douces et professionnelles

### 7. Documentation
- **TIMING_SYSTEM.md** : système de timing complet
- **TIMING_SUMMARY.md** : statistiques et résumé
- **TIMING_ANALYSIS.md** : guide d'analyse avancée
- **TIMING_COACH_RAPPORT.md** : rapport coach détaillé
- **TIMING_QUICK_REF.md** : référence rapide
- **UNIVERSAL_ACTIVITIES.md** : système d'activités universelles
- **INSTALLATION.md** : guide d'installation
- **README.md** : vue d'ensemble du projet

## 🔧 Technical Stack

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : TailwindCSS
- **Icons** : Lucide React
- **State** : React Context API
- **Export** : Static Site Generation
- **Build** : Webpack

## 📊 Statistiques

### Activités
- **Total** : 146 activités
- **Coach notes** : 108 (74%)
- **Activités universelles** : 45 (31%)
- **Activités pattern-spécifiques** : 101 (69%)

### Timing
- **Temps total analysé** : ~60+ heures d'activités
- **Breakdown** : 4 phases (explication, Q/R, travail, restitution)
- **Scaling factors** : 21 activités avec facteur de scaling
- **Setup complexity** : 22 activités avec complexité notée

### Patterns
- **Primaires** : 5 patterns
- **Secondaires** : 4 patterns
- **Couverture** : 100% (5 phases pour tous)

### Code
- **TypeScript files** : ~25 fichiers
- **Components** : ~15 composants React
- **Lib functions** : ~10 modules utilitaires
- **Documentation** : ~10 fichiers markdown

## 🐛 Bug Fixes

### Version 1.0.0
1. **Fixed 60-min generation** : Le système générait uniquement 42 min au lieu de 60 min
   - Cause : Utilisation du `calculatedTime` au lieu de `allocatedTime`
   - Fix : Utilisation stricte des allocations prédéfinies (7+15+15+18+5)

2. **Fixed missing "Decide" phase** : Certains patterns n'avaient pas de phase "Decide what to do"
   - Cause : `getActivitiesForProblem` retournait seulement 5 activités (1 par phase)
   - Fix : Retour de toutes les activités + système d'activités universelles

3. **Fixed pattern-specific priority** : Les activités universelles étaient choisies avant les spécifiques
   - Cause : Scoring égal pour toutes les activités
   - Fix : Boost de +30 points pour activités spécifiques au pattern

4. **Fixed questionnaire UX** : Nécessitait sélection + clic "Next"
   - Fix : Auto-validation après 400ms (sélection = validation)

5. **Fixed cache issues** : Erreurs 404 et boutons non fonctionnels
   - Fix : Clear `.next` cache et restart dev server

## 🚀 Installation & Démarrage

```bash
# Installation
cd /Volumes/T9/aigile
npm install

# Développement
npm run dev
# → http://localhost:3000

# Build production
npm run build
npm run start

# Export statique
npm run build
# → out/ folder ready for deployment
```

## 📁 Structure du Projet

```
/Volumes/T9/aigile/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── retro/
│   │   ├── page.tsx                # Retro tool landing
│   │   ├── questionnaire/page.tsx  # 8-question form
│   │   ├── random/page.tsx         # Random retro generator
│   │   └── result/page.tsx         # Retro plan display
├── components/
│   ├── header.tsx                  # Main header with theme/lang
│   ├── theme-provider.tsx          # Theme context
│   ├── language-provider.tsx       # i18n context
│   └── home/                       # Landing page components
├── lib/
│   ├── translations.ts             # EN/FR translations
│   └── retro/
│       ├── patterns.ts             # Pattern definitions
│       ├── questionnaire.ts        # Questions & weights
│       ├── pattern-detection.ts    # Detection algorithm
│       ├── activities.ts           # 146 Retromat activities
│       ├── activity-selector.ts    # Terrain-based selection
│       ├── activity-timings.ts     # Timing utilities
│       ├── activity-timings-data.ts # Generated timing data
│       ├── team-size-optimizer.ts  # Team size logic
│       └── duration-optimizer.ts   # Duration logic (legacy)
├── scripts/
│   └── generate-activity-timings.ts # Timing generator
└── docs/
    ├── TIMING_SYSTEM.md
    ├── TIMING_SUMMARY.md
    ├── TIMING_ANALYSIS.md
    ├── TIMING_COACH_RAPPORT.md
    ├── TIMING_QUICK_REF.md
    ├── UNIVERSAL_ACTIVITIES.md
    ├── INSTALLATION.md
    └── VERSION.md (this file)
```

## 🎯 Prochaines Étapes (Roadmap)

### v1.1 - Améliorations UX
- [ ] Sauvegarde des retros générées
- [ ] Export PDF/Markdown
- [ ] Partage par lien
- [ ] Historique des retros

### v1.2 - Fonctionnalités Avancées
- [ ] Personnalisation des activités
- [ ] Création d'activités custom
- [ ] Templates de retro
- [ ] Statistiques d'utilisation

### v1.3 - Collaboration
- [ ] Mode multi-joueur
- [ ] Feedback en temps réel
- [ ] Vote d'équipe sur activités
- [ ] Retro en ligne (sync)

### v2.0 - AI Enhancement
- [ ] GPT-4 pour suggestions personnalisées
- [ ] Analyse sentiment des réponses
- [ ] Recommandations ML basées sur historique
- [ ] Auto-génération de coach notes

## 🙏 Remerciements

- **Retromat.org** pour la base d'activités
- **30 ans d'expérience terrain** pour la logique de sélection
- **Communauté Agile** pour les patterns de dysfonctionnement

## 📝 License

MIT License - voir LICENSE.md

---

**Version** : 1.0.0  
**Date** : March 4, 2026  
**Auteur** : Team AIgile  
**Status** : ✅ Production Ready
