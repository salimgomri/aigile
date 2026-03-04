# AIgile Platform

The evolution of Agile for the AI Era - A Next.js platform featuring the AIgile Manifesto and intelligent agile tools.

## 🚀 Features

### AIgile Manifesto
- Modern, responsive landing page showcasing the 4 AIgile values
- 10 AIgile principles for the AI era
- Dual theme support (Sarah/Maya)
- Bilingual (English/French)

### AI Retro Tool
- **8-question diagnostic** to detect team dysfunction patterns
- **9 pattern detection system**:
  - P1: Low Psychological Safety
  - P2: Loss of Meaning / Unclear Direction
  - P3: Learned Helplessness (Actions Without Impact)
  - P4: Fragmentation / Lack of Cohesion
  - P5: Overload / Unsustainable Pressure
  - PA: Dysfunctional Agile Rituals (Scrum Theatre)
  - PB: Retro Facilitation Problems
  - PC: Open Conflict / Toxicity
  - PD: Technical / Delivery Problems
- **Personalized retrospective generation** with Retromat activities
- **5 Retromat phases**: Set the Stage, Gather Data, Generate Insights, Decide What to Do, Close the Retro

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **State Management**: React Context (Theme, Language)

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
│   ├── globals.css           # Global styles with theme variables
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home page (AIgile Manifesto)
│   └── retro/
│       ├── page.tsx           # Retro tool landing
│       ├── questionnaire/     # 8-question diagnostic
│       │   └── page.tsx
│       └── result/            # Personalized retro results
│           └── page.tsx
├── components/
│   ├── header.tsx             # Theme & language toggles
│   ├── theme-provider.tsx     # Theme context (Sarah/Maya)
│   ├── language-provider.tsx  # i18n context (EN/FR)
│   └── home/                  # Landing page components
│       ├── hero.tsx
│       ├── values.tsx
│       ├── principles.tsx
│       ├── cta.tsx
│       ├── about.tsx
│       └── footer.tsx
├── lib/
│   ├── utils.ts               # Utility functions
│   ├── translations.ts        # i18n translations
│   └── retro/                 # Retro tool core logic
│       ├── patterns.ts        # Pattern taxonomy
│       ├── questionnaire.ts   # 8 questions + answers
│       ├── pattern-detection.ts # Detection algorithm
│       └── activities.ts      # Retromat activities mapped to patterns
├── public/
│   └── aigileManifesto.pdf    # Downloadable manifesto
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
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

Based on `retro-tool-spec.md`:

1. **User answers 8 questions** (Q1-Q8)
2. **Pattern detection**:
   - Each answer has weighted pattern scores
   - Accumulate scores across all answers
   - Primary pattern = highest score
   - Secondary patterns = ≥50% of primary (max 2)
3. **Problem mapping**: Primary pattern → problem key
4. **Activity selection**: Filter activities by:
   - Problem key
   - Duration (30/45/60/90 min from Q8)
   - Trust level (low/medium/high)
   - Team size
5. **Generate retro**: One activity per phase, ensuring complete 5-phase structure

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

- Additional AIgile tools:
  - AP1 Questionnaire
  - Skills Matrix
  - Team Barometer
- Export retro as PDF
- Save/share retro links
- Analytics on pattern distribution
- More Retromat activities
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
