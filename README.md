# AIgile Platform

The evolution of Agile for the AI Era - A Next.js platform featuring the AIgile Manifesto and intelligent agile tools.

**Current Version:** v1.0.0 🎉  
**Release Date:** March 4, 2026  
**Status:** ✅ Production Ready

## 🚀 Features

### AIgile Manifesto
- Modern, responsive landing page showcasing the 4 AIgile values
- 10 AIgile principles for the AI era
- Dual theme support (Sarah/Maya)
- Bilingual (English/French)

### AI Retro Tool ⭐ NEW v1.0.0

#### Pattern Detection
- **8-question diagnostic** with auto-validation (no "Next" button!)
- **9 pattern detection system** (5 primary + 4 secondary):
  - P1: Low Psychological Safety
  - P2: Loss of Meaning / Unclear Direction  
  - P3: Learned Helplessness (Actions Without Impact)
  - P4: Fragmentation / Lack of Cohesion
  - P5: Overload / Unsustainable Pressure
  - PA: Dysfunctional Agile Rituals (Scrum Theatre)
  - PB: Retro Facilitation Problems
  - PC: Open Conflict / Toxicity
  - PD: Technical / Delivery Problems

#### Activity Database
- **146 Retromat activities** fully integrated with:
  - Detailed 4-phase timing breakdown (Explication, Q/R, Travail, Restitution)
  - 108 coach notes (74% coverage) with field experience insights
  - Complete metadata (duration, participants, trust level, etc.)
  - **45 universal activities** applicable to all patterns

#### Intelligent Selection
- **Terrain-based logic** from 30 years Agile coaching experience
- **Duration optimization**: 30min (3 phases), 45min, 60min, 90min (5 phases)
- **Team size optimization**: 3-5p, 6-8p, 9-12p, 12+p
- **Smart scoring**: +30 points boost for pattern-specific activities
- **Speaking time calculator**: Per-person time with team size scaling
- **Facilitation techniques**: Pairs, breakouts, multiple facilitators

#### Generation Modes
- **Questionnaire Mode**: Pattern detection → Targeted retro generation
- **Random Mode**: Direct generation with duration/team size selectors

#### Results Display
- **Complete 5-phase plan**: Set the Stage, Gather Data, Generate Insights, Decide What to Do, Close the Retro
- **Detailed activity cards**: Instructions, timings, techniques, coach notes
- **Time allocations**: Allocated vs calculated time with per-person breakdown
- **Facilitation tips**: Team size recommendations and scaling techniques
- **Terrain badges**: "ma logique terrain" powered generation

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.12 (App Router)
- **Language**: TypeScript 5.x
- **React**: React 18.3.1 (downgraded for compatibility)
- **Styling**: TailwindCSS 3.x
- **Icons**: Lucide React
- **State Management**: React Context (Theme, Language)
- **Export**: Static Site Generation
- **Build**: Webpack

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Activities** | 146 Retromat activities |
| **Coach Notes** | 108 (74% coverage) |
| **Universal Activities** | 45 (31% of total) |
| **Pattern-Specific Activities** | 101 (69% of total) |
| **Patterns** | 9 (5 primary + 4 secondary) |
| **Phase Coverage** | 100% (all patterns) |
| **Estimated Activity Time** | ~60+ hours |
| **TypeScript Files** | ~25 files (~5,000+ lines) |
| **Documentation** | ~10 files (~15,000+ words) |

## 📦 Installation

Due to inode limitations on the current disk, we've created a manual setup. To install dependencies:

```bash
npm install
```

## 🏃 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
/Volumes/T9/aigile/
├── app/
│   ├── globals.css              # Global styles with theme variables
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (AIgile Manifesto)
│   └── retro/
│       ├── page.tsx             # Retro tool landing
│       ├── questionnaire/       # 8-question diagnostic (auto-validation)
│       │   └── page.tsx
│       ├── random/              # Random retro generator
│       │   └── page.tsx
│       └── result/              # Personalized retro results
│           └── page.tsx
├── components/
│   ├── header.tsx               # Theme & language toggles
│   ├── theme-provider.tsx       # Theme context (Sarah/Maya)
│   ├── language-provider.tsx    # i18n context (EN/FR)
│   └── home/                    # Landing page components
│       ├── hero.tsx
│       ├── values.tsx
│       ├── principles.tsx
│       ├── cta.tsx
│       ├── about.tsx
│       └── footer.tsx
├── lib/
│   ├── utils.ts                 # Utility functions
│   ├── translations.ts          # i18n translations
│   └── retro/                   # Retro tool core logic
│       ├── patterns.ts          # Pattern taxonomy
│       ├── questionnaire.ts     # 8 questions + answers
│       ├── pattern-detection.ts # Detection algorithm
│       ├── activities.ts        # 146 Retromat activities + universal system
│       ├── activity-selector.ts # Terrain-based selection logic
│       ├── activity-timings.ts  # Timing utilities
│       ├── activity-timings-data.ts   # Generated timing data
│       ├── activity-timings-data.json # JSON export
│       ├── team-size-optimizer.ts     # Team size logic
│       └── duration-optimizer.ts      # Duration logic (legacy)
├── scripts/
│   └── generate-activity-timings.ts   # Timing data generator
├── public/
│   └── aigileManifesto.pdf      # Downloadable manifesto
├── docs/                        # 📚 Complete documentation
│   ├── VERSION.md               # Version notes
│   ├── CHANGELOG.md             # Change history
│   ├── RELEASE_NOTES.md         # Release summary
│   ├── TIMING_SYSTEM.md         # Timing system guide
│   ├── TIMING_SUMMARY.md        # Statistics
│   ├── TIMING_ANALYSIS.md       # Analysis guide
│   ├── TIMING_COACH_RAPPORT.md  # Coach report
│   ├── TIMING_QUICK_REF.md      # Quick reference
│   ├── UNIVERSAL_ACTIVITIES.md  # Universal activities guide
│   └── INSTALLATION.md          # Installation troubleshooting
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md                    # This file
```

## 🎨 Themes

- **Sarah (Default)**: Blue gradient theme (#0066cc, #00a0b0)
- **Maya (Apple-like)**: Orange/Purple gradient (#FF6B35, #A855F7)

## 🌍 Languages

- English (EN)
- French (FR)

All content is fully translated, including:
- Manifesto values and principles
- Retro tool questions and activities
- UI labels and navigation

## 📊 Retro Tool Algorithm

Based on `retro-tool-spec.md` with v1.0.0 enhancements:

### Questionnaire Mode
1. **User answers 8 questions** (Q1-Q8) with auto-validation
2. **Pattern detection**:
   - Each answer has weighted pattern scores
   - Accumulate scores across all answers
   - Primary pattern = highest score
   - Secondary patterns = ≥50% of primary (max 2)
3. **Problem mapping**: Primary pattern → problem key
4. **Activity selection** (terrain-based):
   - Duration optimization (30/45/60/90 min from Q8)
   - Team size optimization (from Q7)
   - Pattern-specific activities (+30 score boost)
   - Universal activities as backup (45 activities)
   - Trust level filtering (low/medium/high)
5. **Generate retro**: Complete 5-phase structure guaranteed

### Random Mode
1. **User selects**:
   - Duration (30/45/60/90 min)
   - Team size (3-5 / 6-8 / 9-12 / 12+)
2. **Direct generation**:
   - No pattern detection
   - Universal activities prioritized
   - Terrain-based selection logic
   - Complete 5-phase structure

### Scoring System (v1.0.0)
- **Base score**: Duration match + Team size match + Phase availability
- **Pattern boost**: +30 points for pattern-specific activities
- **Trust level**: Filtered based on team trust
- **Result**: Optimal mix of specific + universal activities

### Timing System (v1.0.0)
- **4-phase breakdown**: Explication, Q/R, Travail, Restitution
- **Per-person calculation**: Based on team size with scaling
- **Allocation-based**: Respects requested duration (7+15+15+18+5 = 60 min)
- **Realistic estimates**: From 30 years field experience

## 📚 Documentation

Complete documentation available in project:

- **VERSION.md**: Detailed release notes and roadmap
- **CHANGELOG.md**: Complete change history
- **RELEASE_NOTES.md**: User-friendly release summary
- **TIMING_SYSTEM.md**: Complete timing system documentation
- **TIMING_SUMMARY.md**: Statistics and executive summary
- **TIMING_ANALYSIS.md**: Advanced analysis guide
- **TIMING_COACH_RAPPORT.md**: Detailed coach report
- **TIMING_QUICK_REF.md**: Quick reference guide
- **UNIVERSAL_ACTIVITIES.md**: Universal activities system
- **INSTALLATION.md**: Installation troubleshooting

## 🔧 Configuration

### Static Export

The site is configured for static export (suitable for GitHub Pages, Netlify, Vercel):

```typescript
// next.config.ts
export default {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}
```

### Build

```bash
npm run build
```

Output will be in `out/` directory.

## 📝 Future Enhancements

See **VERSION.md** and **CHANGELOG.md** for complete roadmap.

### v1.1 - UX Improvements
- [ ] Save generated retros locally
- [ ] Export retro plans (PDF/Markdown)
- [ ] Share by link
- [ ] Retro history

### v1.2 - Advanced Features
- [ ] Custom activity editor
- [ ] Activity templates
- [ ] Usage statistics
- [ ] Personalization options

### v1.3 - Collaboration
- [ ] Multiplayer mode
- [ ] Real-time feedback
- [ ] Team voting on activities
- [ ] Online sync retros

### v2.0 - AI Enhancement
- [ ] GPT-4 for personalized suggestions
- [ ] Sentiment analysis on responses
- [ ] ML-based recommendations from history
- [ ] Auto-generation of coach notes

### Other AIgile Tools
- AP1 Questionnaire
- Skills Matrix
- Team Barometer
- Additional languages (DE, ES, PT)

## 👤 Author

**Salim Gomri**
- Founder of AIgile Manifesto - April 2025
- Professional Certified Coach & Agile Coach
- 20+ years coaching digital transformation

**Connect:**
- LinkedIn: [linkedin.com/in/salimgomri](https://www.linkedin.com/in/salimgomri/)
- Website: [gomri.coach](https://gomri.coach)
- Email: Salim.gomri@gmail.com

## 📄 License

© 2025 Salim Gomri. AIgile Manifesto. All rights reserved.

---

Made with ❤️ for agile teams navigating the AI era

**Version**: v1.0.0 | **Release**: March 4, 2026 | **Status**: ✅ Production Ready

🚀 **Ready to start?** ➡️ http://localhost:3000/retro
