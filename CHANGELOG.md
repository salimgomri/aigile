# Changelog

All notable changes to the AI Retro Tool will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-04

### Added

#### Core Features
- **Pattern Detection System**: 9 team dysfunction patterns (5 primary, 4 secondary)
- **8-Question Questionnaire**: Auto-validation on selection (no "Next" button)
- **146 Retromat Activities**: Complete scraped database with detailed metadata
- **Random Retro Generator**: Direct generation without questionnaire
- **Dual Theme System**: Sarah (violet) and Maya (blue) Apple-like gradients
- **Full i18n Support**: English and French translations for all pages
- **Static Export**: Next.js 15 configured for static site generation

#### Activity Selection Logic
- **Terrain-Based Selection**: 30 years field experience logic
- **Duration Optimization**: 30min (3 phases), 45min, 60min, 90min (5 phases)
- **Team Size Optimization**: 3-5p, 6-8p, 9-12p, 12+p with adapted techniques
- **Universal Activities System**: 45 activities across all phases
- **Smart Scoring**: +30 points boost for pattern-specific activities
- **Phase Coverage**: 100% guaranteed (all patterns have 5 phases)

#### Timing System
- **4-Phase Breakdown**: Explication, Questions/Réponses, Réflexion/Travail, Restitution
- **108 Coach Notes**: 74% coverage with field experience insights
- **Speaking Time Calculator**: Per-person time with team size scaling
- **Realistic Allocations**: 7+15+15+18+5 = 60 min for standard retro
- **Setup Complexity**: 22 activities with complexity indicators
- **Scaling Factors**: 21 activities with efficiency factors for large teams

#### Documentation
- `TIMING_SYSTEM.md`: Complete timing system documentation
- `TIMING_SUMMARY.md`: Statistics and executive summary
- `TIMING_ANALYSIS.md`: Advanced analysis guide
- `TIMING_COACH_RAPPORT.md`: Detailed coach report
- `TIMING_QUICK_REF.md`: Quick reference guide
- `UNIVERSAL_ACTIVITIES.md`: Universal activities system guide
- `INSTALLATION.md`: Installation troubleshooting
- `VERSION.md`: Release notes and roadmap
- `CHANGELOG.md`: This file

### Fixed

#### Critical Bugs
- **60-min Generation**: System was generating only 42 min instead of requested 60 min
  - Root cause: Used `calculatedTime` instead of `allocatedTime`
  - Solution: Strict use of predefined phase allocations

- **Missing "Decide" Phase**: Some patterns lacked "Decide what to do" activities
  - Root cause: `getActivitiesForProblem` returned only 5 activities (1 per phase)
  - Solution: Return all activities + universal activities system

- **Pattern-Specific Priority**: Universal activities were chosen before specific ones
  - Root cause: Equal scoring for all activities
  - Solution: +30 point boost for pattern-specific activities

#### UX Issues
- **Questionnaire Validation**: Required selection + "Next" button click
  - Solution: Auto-validation after 400ms delay

- **Cache Issues**: 404 errors and non-functional buttons
  - Solution: Clear `.next` cache and restart dev server

- **Footer Text**: Changed "logique terrain (30 ans coaching Agile)" to "ma logique terrain"

#### Technical Issues
- **Dependency Conflicts**: `lucide-react` incompatible with React 19
  - Solution: Downgrade to React 18.3.1

- **Inode Exhaustion**: `npm install` failed on external drive
  - Solution: Manual project creation, documented in INSTALLATION.md

- **Build Errors**: Various TypeScript and syntax errors
  - Solution: Fixed type mismatches, added proper imports, corrected component structure

### Changed

- **Activity Selection**: From pure pattern-based to terrain-based (duration + team size priority)
- **Total Duration Display**: Now respects allocated time instead of calculated time
- **getActivitiesForProblem**: Returns all activities instead of filtering to 5
- **Questionnaire UX**: Selection now equals validation (auto-advance)
- **Theme Toggle**: Enhanced with smooth transitions and gradient updates
- **Language Toggle**: Available on all `/retro/*` pages

### Technical Details

#### Stack
- Next.js 15.5.12 (App Router)
- React 18.3.1 (downgraded from 19 for compatibility)
- TypeScript 5.x
- TailwindCSS 3.x
- Lucide React (icons)

#### Architecture
- Client-side only (no backend needed)
- React Context API (theme + language state)
- Static export (`next.config.ts` configured)
- Component-based structure (15 components)
- Modular lib utilities (10 modules)

#### Performance
- Static generation (fast loading)
- Optimized images (unoptimized for static export)
- Minimal JavaScript bundle
- CSS-in-JS with Tailwind (minimal runtime)

### Statistics

- **146 activities** analyzed and integrated
- **108 coach notes** (74% coverage)
- **45 universal activities** (31% of total)
- **101 pattern-specific activities** (69% of total)
- **9 patterns** fully supported
- **100% phase coverage** for all patterns
- **~60+ hours** of activity time estimated
- **~25 TypeScript files** (~5,000+ lines)
- **~10 documentation files** (~15,000+ words)

---

## [Unreleased]

### Planned for v1.1
- [ ] Save generated retros locally
- [ ] Export retro plans (PDF/Markdown)
- [ ] Share by link
- [ ] Retro history

### Planned for v1.2
- [ ] Custom activity editor
- [ ] Activity templates
- [ ] Usage statistics
- [ ] Personalization options

### Planned for v1.3
- [ ] Multiplayer mode
- [ ] Real-time feedback
- [ ] Team voting on activities
- [ ] Online sync retros

### Planned for v2.0
- [ ] GPT-4 integration for personalized suggestions
- [ ] Sentiment analysis on responses
- [ ] ML-based recommendations from history
- [ ] Auto-generation of coach notes

---

[1.0.0]: https://github.com/yourusername/aigile/releases/tag/v1.0.0
