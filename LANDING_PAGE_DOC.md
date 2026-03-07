# 🎨 Landing Page Premium aigile.lu - Documentation Complète

**Date**: March 7, 2026  
**Version**: 2.0.0 - Premium Landing  
**Designer**: Apple-style Premium UX  
**Developer**: Next.js 15 + React 18 + TypeScript

---

## 🎯 Mission Accomplie

Nouvelle landing page premium Apple-style pour **aigile.lu** créée avec succès. L'ancienne page d'accueil (manifeste) a été déplacée vers `/manifesto`.

---

## 🚀 Accès Rapide

**Development Server**: http://localhost:3007

### Pages Disponibles

- **Landing Page**: http://localhost:3007 (nouvelle page premium)
- **Manifeste AIgile**: http://localhost:3007/manifesto (ancienne page d'accueil)
- **AI Retro Tool**: http://localhost:3007/retro
- **Start Scrum**: http://localhost:3007/start-scrum (placeholder)

---

## 📐 Architecture & Stack Technique

### Stack Choisi

```
Next.js 15.5.12 (App Router)
├── React 18.3.1
├── TypeScript 5.x
├── TailwindCSS 3.x
└── Lucide React (icons)
```

### Rationale

- **Next.js 15**: SSG/SSR optimal, excellent SEO, performance native
- **React 18**: Concurrent rendering, transitions fluides
- **TypeScript**: Type safety, meilleure DX, moins d'erreurs runtime
- **TailwindCSS**: Utility-first, cohérence design, mobile-first natif

### Alternatives Considérées (et rejetées)

- ❌ HTML/CSS/JS vanilla → Maintenance difficile, pas de composants
- ❌ Vue/Nuxt → Écosystème moins mature pour SSG
- ❌ SvelteKit → Moins de resources, smaller ecosystem

---

## 🎨 Sections Créées (Ordre Business Priority)

### 1. Hero Section ⭐
**Fichier**: `components/landing/hero.tsx`

**Contenu**:
- Titre principal: "Agile Augmenté par l'IA"
- Sous-titre: "L'écosystème professionnel pour les équipes Agile de l'ère IA"
- Tagline: "Scrum Augmenté. Rétrospectives Intelligentes. Intelligence d'Équipe."
- **2 CTAs**:
  - Primary: "Démarrer le Parcours" → `/retro`
  - Secondary: "Explorer les Outils" → `#tools`
- Scroll indicator animé
- Background avec gradient orbs

**Design**:
- Gradient text pour le titre (primary → secondary)
- Badge "by Salim Gomri" avec glassmorphism
- Min-height: 90vh (above the fold)

---

### 2. Livre "Le Système S.A.L.I.M" 🔥
**Fichier**: `components/landing/book-section.tsx`

**Priorité**: MAXIMALE (Commercial)

**Contenu**:
- Mockup 3D du livre (placeholder responsive)
- Badge "En Cours d'Écriture" (ribbon diagonal)
- Titre: "Le Système S.A.L.I.M"
- Sous-titre: "Transformez Votre Équipe avec l'Agile Augmenté"
- Description: 30 ans d'expérience terrain
- **3 Bénéfices**:
  1. Frameworks éprouvés pour l'intégration IA
  2. Cas d'usage réels
  3. Guide d'implémentation étape par étape
- **CTA**: "Pré-commander"
- Prix: "Printemps 2026"

**Design**:
- Grid 2 colonnes (book left, content right)
- Glow effect sur le mockup
- Hover: scale + rotate effect
- Badge "Priorité Commerciale"

---

### 3. Suite d'Outils AIgile Retro 🛠️
**Fichier**: `components/landing/tools-suite.tsx`

**Contenu**:
- Titre: "AIgile Retro Suite"
- Sous-titre: "Outils professionnels pour équipes performantes"

**Featured Tool** (AI Retro):
- Card mise en avant avec fond gradient
- Badge "Outil Phare"
- Description: "146 activités, logique terrain"
- **2 CTAs**:
  - "Commencer Gratuitement" → `/retro`
  - "Démarrer Votre Parcours Scrum" → `/start-scrum`
- Mockup placeholder + badge "146 Activités"

**Autres Outils** (grid 3 colonnes):
1. Niko-Niko (Smile icon)
2. DORA Metrics (BarChart3 icon)
3. OKR Check-in (Target icon)
4. Team Dashboard (Layout icon)
5. Skills Matrix (Users icon)

**Tous marqués**: "Bientôt disponible"

**Design**:
- Featured card avec gradient background
- Tools grid avec hover effects
- Icons colorés (primary gradient)
- Bottom CTA: "Gratuite pour les équipes"

---

### 4. Manifeste AIgile 📄
**Fichier**: `components/landing/manifesto-section.tsx`

**Contenu**:
- Titre: "Le Manifeste AIgile"
- Sous-titre: "L'évolution du Manifeste Agile de 2001 pour l'ère de l'IA"
- Description: "4 valeurs, 10 principes, une révolution"
- Preview card avec les 4 valeurs
- Badge "Document Fondateur"
- **2 CTAs**:
  - "Lire le Manifeste" → `/manifesto`
  - "Télécharger PDF" → `/aigileManifesto.pdf`
- Badge flottant: "4 Valeurs • 10 Principes"

**Design**:
- Grid 2 colonnes (content left, preview right)
- Manifesto card aspect-ratio 3/4
- Hover: scale + rotate effect
- Preview avec les 4 valeurs en cards glassmorphism

---

### 5. Jeu de Cartes Rétro 🎴
**Fichier**: `components/landing/cards-section.tsx`

**Contenu**:
- Titre: "Cartes de Patterns Rétro"
- Sous-titre: "L'outil ultime de facilitation"
- Description: "146 activités, 9 patterns de dysfonctionnement"
- Badge "Produit Physique"
- **4 Features**:
  1. 146 activités sélectionnées
  2. 9 patterns de dysfonctionnement
  3. Conseils de facilitation inclus
  4. Impression qualité premium
- **Prix**: 49€ + frais de port
- **CTA**: "Commander"
- Mentions: "Livraison mondiale • Impression premium • Garantie satisfaction"

**Design**:
- Grid 2 colonnes (cards left, content right)
- Card stack effect (3 cartes superposées avec rotation)
- Top card: Design complet (Pattern #P2 - Équipe Silencieuse)
- Hover: scale + rotate inverse
- Badge "146 Cartes" flottant

---

### 6. Newsletter + Contact 📧
**Fichier**: `components/landing/newsletter-contact.tsx`

**Newsletter (gauche)**:
- Titre: "Restez AIgile"
- Sous-titre: "Insights hebdomadaires sur Agile, IA et intelligence d'équipe"
- Form: Email input + bouton "S'abonner"
- Message: "Pas de spam. Désabonnement à tout moment."
- Social proof: "Plus de 1 000 agilistes reçoivent nos insights"
- Avatars mockup (4 cercles)

**Contact (droite)**:
- Titre: "Contactez-nous"
- Sous-titre: "Questions ? Demande de coaching ? Parlons-en."
- Form: Nom, Email, Message
- **Action**: Ouvre client email avec `mailto:salim.gomri@gmail.com`
- Email visible en bas: salim.gomri@gmail.com
- États: Success feedback après envoi

**Design**:
- Grid 2 colonnes (desktop), stack (mobile)
- Forms avec style unifié (rounded-xl inputs)
- Success states avec CheckCircle icon
- Glassmorphism badges

---

## 🧩 Composants Réutilisables Créés

### 1. PremiumNavbar
**Fichier**: `components/premium-navbar.tsx`

**Features**:
- Glassmorphism on scroll (bg-white/80 backdrop-blur-xl)
- Logo AIgile avec gradient badge
- Navigation links: Home, Manifesto, Tools, Book, Cards
- **Language switcher**: FR/EN (pills style)
- **Auth buttons**: "Se connecter" + "S'inscrire" (gradients)
- Mobile menu: Full-screen drawer
- Scroll detection pour background transition

**Ready for Auth Integration**:
```typescript
// TODO: Integrate authentication provider
// Options: Firebase Auth, Supabase Auth, Auth0, NextAuth.js
// Current: Placeholder buttons ready for integration
```

**Responsive**:
- Desktop: Full navbar with all elements
- Mobile: Hamburger menu + drawer

---

### 2. FloatingCoachingButton
**Fichier**: `components/floating-coaching-button.tsx`

**Features**:
- Position: Fixed bottom-right (z-index: 40)
- Calendly integration ready
- **Text**:
  - Desktop: "Réserver une Session de Coaching"
  - Mobile: "Coaching"
- Glow effect (blur-xl gradient)
- Pulse animation (animate-ping)
- Hover: scale + shadow intensification

**TODO**: Remplacer l'URL Calendly placeholder

```typescript
const calendlyUrl = 'https://calendly.com/salim-gomri' // TODO: URL réelle
```

**Options d'intégration**:
1. Ouvrir dans nouvel onglet (actuel)
2. Modal embed avec iframe (code ready, commenté)

---

### 3. PremiumFooter
**Fichier**: `components/landing/premium-footer.tsx`

**Structure** (4 colonnes):

1. **Brand**:
   - Logo AIgile (gradient badge)
   - Description: "L'écosystème professionnel pour les équipes Agile de l'ère IA"

2. **Product**:
   - AI Retro Tool
   - Start Scrum Journey
   - Tools

3. **Resources**:
   - Manifesto
   - Book
   - Cards

4. **Company**:
   - Contact
   - gomri.coach
   - LinkedIn

**Bottom Bar**:
- Copyright: "© 2026 Salim Gomri. AIgile. Tous droits réservés."
- Social links: LinkedIn, Twitter (hover effects)

**Responsive**:
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column stack

---

## 🌍 Internationalisation (i18n)

### Nouvelles Traductions Ajoutées

**Fichier**: `lib/translations.ts`

**Catégories ajoutées**:

1. **Navigation**:
   - nav-manifesto, nav-book, nav-cards
   - nav-signin, nav-signup

2. **Landing Hero**:
   - landing-hero-title, landing-hero-subtitle, landing-hero-tagline
   - landing-hero-cta-primary, landing-hero-cta-secondary

3. **Book Section**:
   - book-badge, book-title, book-subtitle, book-description
   - book-benefit-1/2/3, book-cta, book-price

4. **Tools Suite**:
   - tools-title, tools-subtitle, tools-retro-title, tools-retro-desc
   - tools-nikoni, tools-dora, tools-okr, tools-dashboard, tools-charts, tools-skills
   - tools-cta, tools-start-journey

5. **Manifesto Section**:
   - manifesto-title, manifesto-subtitle, manifesto-desc
   - manifesto-cta-view, manifesto-cta-download

6. **Cards Section**:
   - cards-title, cards-subtitle, cards-description
   - cards-feature-1/2/3/4, cards-cta, cards-price

7. **Newsletter + Contact**:
   - newsletter-title/subtitle/placeholder/cta/privacy
   - contact-title/subtitle/name/email/message/cta

8. **Coaching Button**:
   - coaching-float, coaching-float-short

**Total**: ~60 nouvelles clés de traduction (FR + EN)

---

## 📱 Responsive Design

### Breakpoints TailwindCSS

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet portrait */
lg:  1024px  /* Tablet landscape / Small desktop */
xl:  1280px  /* Desktop */
2xl: 1536px  /* Large desktop */
```

### Mobile-First Approach

Tous les composants sont conçus mobile-first:

1. **Stack vertical par défaut** (1 colonne)
2. **Grid desktop** via `lg:grid-cols-2` ou `lg:grid-cols-3`
3. **Text sizes responsive**: `text-4xl sm:text-5xl lg:text-7xl`
4. **Spacing adaptatif**: `px-4 sm:px-6 lg:px-8`
5. **Hide/Show elements**: `hidden lg:flex` ou `lg:hidden`

### Sections Testées

✅ Hero: Stack vertical → Centré  
✅ Book: 1 col → 2 cols (lg)  
✅ Tools: 1 col → 2 cols → 3 cols (sm → lg)  
✅ Manifesto: 1 col → 2 cols (lg)  
✅ Cards: 1 col → 2 cols (lg)  
✅ Newsletter/Contact: 1 col → 2 cols (lg)  
✅ Footer: 1 col → 2 cols → 4 cols (md → lg)  
✅ Navbar: Hamburger menu (mobile) → Full nav (lg)

---

## 🎭 Design System

### Palette de Couleurs

Le système utilise les variables CSS existantes:

```css
--primary: Theme-specific (Sarah blue / Maya purple)
--secondary: Theme-specific (Sarah cyan / Maya orange)
```

**Dual Theme**:
- **Sarah** (défaut): Blue (#0066cc) → Cyan (#00a0b0)
- **Maya** (Apple-like): Orange (#FF6B35) → Purple (#A855F7)

### Typographie

**Font**: Inter (Google Fonts, déjà configuré)

**Hiérarchie**:
- H1: `text-5xl sm:text-6xl lg:text-7xl font-bold`
- H2: `text-4xl sm:text-5xl font-bold`
- H3: `text-3xl sm:text-4xl font-bold`
- Body Large: `text-xl sm:text-2xl`
- Body: `text-lg`
- Small: `text-sm`

**Weights**:
- Bold: `font-bold` (titres)
- Semibold: `font-semibold` (CTAs, labels)
- Medium: `font-medium` (navigation)
- Light: `font-light` (taglines)

### Spacing

**Section Padding**: `py-24` (96px vertical)  
**Container Max-Width**: `max-w-7xl` (1280px)  
**Content Padding**: `px-4 sm:px-6 lg:px-8`

### Effets & Animations

**Glassmorphism**:
```css
bg-white/80 backdrop-blur-xl
```

**Gradients**:
```css
bg-gradient-to-r from-primary to-secondary
bg-gradient-to-br from-primary/5 to-secondary/5
```

**Shadows**:
- Card: `shadow-2xl`
- Hover: `hover:shadow-3xl`
- Button: `shadow-lg`

**Transitions**:
```css
transition-all duration-300
hover:scale-105
hover:rotate-2
```

**Animations** (TailwindCSS native):
- Bounce: `animate-bounce` (scroll indicator)
- Ping: `animate-ping` (coaching button pulse)

---

## 🎬 Animations Premium (TODO)

### Phase 1: Base Structure ✅ TERMINÉ

Toutes les sections créées avec structure propre et commentée.

### Phase 2: Animation Layer 🔜 À VENIR

**Micro-animations à ajouter**:

#### 1. Scroll-triggered animations

```typescript
// Framer Motion ou Intersection Observer API
- Fade-in on section entry
- Slide-up on cards
- Parallax sur background orbs
- Counter animations (146 activités, 1000+ users)
```

#### 2. Hover effects avancés

```css
- Card lift avec transform: translateY(-8px)
- Button glow intensification
- Link underline animations (from-left)
- Image zoom subtil (scale: 1.05)
```

#### 3. Page transitions

```typescript
// Framer Motion page transitions
- Fade entre pages
- Slide navigation
- Smooth scroll to anchors (#tools, #book, etc.)
```

#### 4. Loading states

```typescript
- Skeleton loaders pour dynamic content
- Form submission spinners
- Progressive image loading (blur-up)
```

### Libraries Recommandées

**Option 1: Framer Motion** (Recommandé)
```bash
npm install framer-motion
```
- React-first, excellent DX
- Animations déclaratives
- Scroll animations natives
- Page transitions built-in

**Option 2: GSAP** (Si animations complexes)
```bash
npm install gsap
```
- Plus puissant mais plus complexe
- Timeline-based animations
- Scroll triggers avancés

**Option 3: Intersection Observer API** (Natif)
- Pas de dépendance
- Léger et performant
- Idéal pour scroll reveals simples

### Performance Guidelines

✅ **À faire**:
- Use `transform` & `opacity` (GPU-accelerated)
- Debounce scroll listeners
- Lazy load images below fold
- Code-split animations (dynamic imports)
- Respect `prefers-reduced-motion`

❌ **À éviter**:
- Width/height animations
- Box-shadow transitions (lourdes)
- Trop d'animations simultanées
- Animations sur scroll non-debounced

### Implementation Strategy

```typescript
// 1. Installer Framer Motion
npm install framer-motion

// 2. Créer wrapper component
// components/animations/fade-in.tsx
import { motion } from 'framer-motion'

export const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
)

// 3. Wrapper les sections
<FadeIn>
  <BookSection />
</FadeIn>

// 4. Ajouter hover states
<motion.div whileHover={{ scale: 1.05 }}>
  <Card />
</motion.div>
```

---

## 🔐 Authentification (TODO)

### État Actuel

**UI Ready**: Boutons "Se connecter" et "S'inscrire" placés dans:
- Navbar desktop (top-right)
- Navbar mobile (menu drawer)

**Fonctionnel**: Placeholder (non-fonctionnels)

### Options d'Intégration

#### Option 1: Firebase Auth (Recommandé)

**Pourquoi**:
✅ Gratuit jusqu'à 50K MAU  
✅ Setup rapide (< 1 heure)  
✅ Social auth (Google, GitHub, etc.)  
✅ Email/password built-in  
✅ Excellent pour Next.js

**Setup**:
```bash
npm install firebase react-firebase-hooks
```

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  // Config from Firebase Console
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
```

#### Option 2: Supabase

**Pourquoi**:
✅ Open-source  
✅ Postgres-backed  
✅ Row-level security  
✅ Réaltimeout of the box

```bash
npm install @supabase/supabase-js @supabase/auth-ui-react
```

#### Option 3: Auth0

**Pourquoi**:
✅ Enterprise-grade  
✅ Advanced features  
❌ Payant après 7K MAU

#### Option 4: NextAuth.js

**Pourquoi**:
✅ Self-hosted  
✅ Très flexible  
✅ Multiple providers  
❌ Plus de setup

### Plan d'Implémentation

**Phase 1**: Choisir provider (recommandation: Firebase)  
**Phase 2**: Créer context `AuthProvider`  
**Phase 3**: Protéger routes (middleware Next.js)  
**Phase 4**: Intégrer dans navbar  
**Phase 5**: Créer pages `/signin` et `/signup`

**Prompt pour Phase Auth** (à utiliser plus tard):

```
"Intègre Firebase Auth dans le projet aigile.lu:
1. Configuration Firebase (firebaseConfig fourni)
2. AuthProvider context avec useAuth hook
3. Pages /signin et /signup Apple-style
4. Middleware pour protéger /retro/* (require auth)
5. Update navbar avec user avatar + dropdown
6. Logout functionality
Stack: Next.js 15, TypeScript, TailwindCSS
Design: Apple premium, cohérent avec landing existante"
```

---

## 📂 Structure des Fichiers

```
/Volumes/T9/aigile/
├── app/
│   ├── page.tsx                           # 🆕 NEW Landing Page
│   ├── layout.tsx                          # Root layout (inchangé)
│   ├── globals.css                         # Global styles (inchangé)
│   ├── manifesto/
│   │   └── page.tsx                       # 🆕 MOVED from app/page.tsx
│   ├── retro/                              # AI Retro Tool (inchangé)
│   │   ├── page.tsx
│   │   ├── questionnaire/page.tsx
│   │   ├── random/page.tsx
│   │   └── result/page.tsx
│   └── start-scrum/
│       └── page.tsx                       # 🆕 NEW Placeholder page
├── components/
│   ├── premium-navbar.tsx                 # 🆕 NEW Reusable navbar
│   ├── floating-coaching-button.tsx       # 🆕 NEW Coaching CTA
│   ├── header.tsx                          # OLD (theme toggles, kept)
│   ├── theme-provider.tsx                  # Inchangé
│   ├── language-provider.tsx               # Inchangé
│   ├── home/                               # OLD manifesto components
│   │   ├── hero.tsx
│   │   ├── values.tsx
│   │   ├── principles.tsx
│   │   ├── cta.tsx
│   │   ├── about.tsx
│   │   └── footer.tsx
│   └── landing/                            # 🆕 NEW Landing components
│       ├── hero.tsx                       # Hero section
│       ├── book-section.tsx               # Le Système S.A.L.I.M
│       ├── tools-suite.tsx                # AIgile Retro Suite
│       ├── manifesto-section.tsx          # Manifesto preview
│       ├── cards-section.tsx              # Retro cards product
│       ├── newsletter-contact.tsx         # Newsletter + Contact
│       └── premium-footer.tsx             # Footer réutilisable
├── lib/
│   ├── translations.ts                     # 🔧 UPDATED (+60 keys)
│   ├── utils.ts                            # Inchangé
│   └── retro/                              # AI Retro logic (inchangé)
├── public/
│   └── aigileManifesto.pdf                 # Inchangé
├── package.json                            # Inchangé
├── tsconfig.json                           # Inchangé
├── tailwind.config.ts                      # Inchangé
├── next.config.ts                          # Inchangé
└── README.md                               # To be updated

🆕 = Nouveau fichier
🔧 = Fichier modifié
```

**Fichiers créés**: 11  
**Fichiers modifiés**: 1 (translations.ts)  
**Total lignes**: ~2,500 lignes de code premium

---

## ✅ Checklist Complète

### Pages

- [x] Landing Page (`/`)
- [x] Manifesto moved to `/manifesto`
- [x] Start Scrum placeholder (`/start-scrum`)
- [x] AI Retro Tool intact (`/retro/*`)

### Composants Réutilisables

- [x] PremiumNavbar (bilingual, auth-ready)
- [x] FloatingCoachingButton (Calendly-ready)
- [x] PremiumFooter (4-column layout)

### Sections Landing

- [x] Hero (value proposition)
- [x] Book Section (priority commercial)
- [x] Tools Suite (6 tools + featured)
- [x] Manifesto (preview + CTAs)
- [x] Cards (e-commerce)
- [x] Newsletter + Contact (forms)

### Design & UX

- [x] Apple-style premium design
- [x] Mobile-first responsive
- [x] Glassmorphism effects
- [x] Gradient backgrounds
- [x] Hover transitions
- [x] Smooth scroll anchor links
- [ ] Advanced micro-animations (Phase 2)

### i18n

- [x] 60 nouvelles clés FR/EN
- [x] Language switcher in navbar
- [x] All sections translated

### Technical

- [x] TypeScript strict mode
- [x] TailwindCSS utility classes
- [x] Next.js static export compatible
- [x] Build successful (10 routes)
- [x] Dev server running (port 3007)

### Documentation

- [x] Code comments (architecture)
- [x] Section comments (purpose)
- [x] TODO markers (auth, animations)
- [x] This comprehensive doc

---

## 🚧 TODOs & Next Steps

### Priorité 1 - Critical

- [ ] **Calendly URL**: Remplacer l'URL placeholder dans `FloatingCoachingButton`
- [ ] **Book Mockup**: Créer vrai mockup 3D du livre S.A.L.I.M
- [ ] **Cards Mockup**: Améliorer le design des cartes (vraies photos)
- [ ] **AI Retro Screenshot**: Ajouter screenshot réel de l'outil

### Priorité 2 - Important

- [ ] **Animations**: Implémenter Framer Motion (voir section dédiée)
- [ ] **Newsletter Integration**: Mailchimp/ConvertKit
- [ ] **Contact Form**: Backend pour email notifications
- [ ] **E-commerce**: Stripe/Shopify pour cartes

### Priorité 3 - Nice to Have

- [ ] **Authentication**: Firebase Auth (prompt ready)
- [ ] **Analytics**: Google Analytics / Plausible
- [ ] **SEO**: Metadata, Open Graph, sitemap
- [ ] **Performance**: Image optimization, lazy loading

### Priorité 4 - Future

- [ ] **Blog**: Section articles AIgile
- [ ] **Testimonials**: Section témoignages clients
- [ ] **Video**: Embed vidéos explicatives
- [ ] **A/B Testing**: Optimisation conversion

---

## 📊 Performance & SEO

### Build Output

```
Route (app)                              Size    First Load JS
┌ ○ /                                    6.56 kB     121 kB
├ ○ /manifesto                           4.75 kB     116 kB
├ ○ /retro                                 174 B     111 kB
├ ○ /start-scrum                           186 B     114 kB
└ ... (autres routes)
```

**Observations**:
✅ Landing page: 6.56 kB (très léger)  
✅ Total JS: ~121 kB (acceptable)  
✅ Static export: Compatible

### Recommandations SEO

**À ajouter**:

```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: 'AIgile - Agile Augmenté par l\'IA | Salim Gomri',
  description: 'L\'écosystème professionnel pour les équipes Agile de l\'ère IA. Scrum Augmenté, Rétrospectives Intelligentes, Intelligence d\'Équipe.',
  keywords: 'Agile, Scrum, IA, AI, Retrospective, Coaching, Salim Gomri',
  authors: [{ name: 'Salim Gomri' }],
  openGraph: {
    title: 'AIgile - Agile Augmenté par l\'IA',
    description: 'L\'écosystème professionnel pour les équipes Agile de l\'ère IA',
    url: 'https://aigile.lu',
    siteName: 'AIgile',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIgile - Agile Augmenté par l\'IA',
    description: 'L\'écosystème professionnel pour les équipes Agile de l\'ère IA',
    creator: '@salimgomri',
    images: ['/twitter-image.jpg'],
  }
}
```

---

## 🎨 Customisation Facile

### Changer les Couleurs

**Fichier**: `app/globals.css`

```css
/* Theme Sarah (default) */
--primary: #0066cc;
--secondary: #00a0b0;

/* Theme Maya (Apple-like) */
--primary: #FF6B35;
--secondary: #A855F7;
```

### Changer la Typographie

**Fichier**: `app/layout.tsx`

```typescript
// Option 1: Autre Google Font
import { Poppins } from 'next/font/google'
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700'] 
})

// Option 2: Custom Font
import localFont from 'next/font/local'
const myFont = localFont({ 
  src: './fonts/MyFont.woff2' 
})
```

### Ajouter une Section

**Template**:

```typescript
// components/landing/new-section.tsx
'use client'

import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'

export default function NewSection() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section id="new" className="relative py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content here */}
      </div>
    </section>
  )
}
```

**Intégrer** dans `app/page.tsx`:

```typescript
import NewSection from '@/components/landing/new-section'

// Dans le JSX
<NewSection />
```

---

## 📞 Support & Contact

### Développeur

**Email**: salim.gomri@gmail.com  
**Website**: https://gomri.coach  
**LinkedIn**: https://www.linkedin.com/in/salimgomri/

### Documentation Technique

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **TailwindCSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

### Design Inspiration

- **Apple**: https://www.apple.com
- **Linear**: https://linear.app
- **Stripe**: https://stripe.com
- **Vercel**: https://vercel.com

---

## 🎉 Conclusion

### Mission Accomplie ✅

La landing page premium Apple-style pour **aigile.lu** est maintenant **opérationnelle** avec:

✅ 7 sections premium (Hero, Book, Tools, Manifesto, Cards, Newsletter, Contact)  
✅ 3 composants réutilisables (Navbar, Footer, Coaching Button)  
✅ Design responsive mobile-first  
✅ Bilingual FR/EN complet  
✅ Build réussi (10 routes)  
✅ Dev server running (http://localhost:3007)

### Prochaines Étapes

1. **Tester la landing** sur http://localhost:3007
2. **Remplacer les mockups** par vraies images (book, cards, retro)
3. **Configurer Calendly** URL dans `FloatingCoachingButton`
4. **Ajouter animations** Framer Motion (voir section dédiée)
5. **Intégrer newsletter** (Mailchimp/ConvertKit)
6. **Setup authentification** (Firebase recommended)

### URLs Clés

- 🏠 Landing: http://localhost:3007
- 📄 Manifesto: http://localhost:3007/manifesto
- 🧠 AI Retro: http://localhost:3007/retro
- 🚀 Start Scrum: http://localhost:3007/start-scrum

---

**Version**: 2.0.0 - Premium Landing  
**Date**: March 7, 2026  
**Status**: ✅ Production Ready (base structure)  
**Next**: 🎬 Animation Layer

Made with ❤️ and 30 years of Agile coaching experience by Salim Gomri
