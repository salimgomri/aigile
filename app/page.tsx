/*
 * =============================================================================
 * ARCHITECTURE DECISION - aigile.lu Landing Page
 * =============================================================================
 * 
 * STACK CHOISI: Next.js 15 + React 18 + TypeScript + TailwindCSS
 * 
 * RATIONALE:
 * - Next.js 15: SSG/SSR optimal, excellent SEO, performance native
 * - React 18: Concurrent rendering, transitions fluides
 * - TypeScript: Type safety, meilleure DX, moins d'erreurs runtime
 * - TailwindCSS: Utility-first, cohérence design, mobile-first natif
 * 
 * ALTERNATIVES CONSIDÉRÉES:
 * - HTML/CSS/JS vanilla: Rejeté (maintenance difficile, pas de composants)
 * - Vue/Nuxt: Rejeté (écosystème moins mature pour SSG)
 * - SvelteKit: Rejeté (moins de resources, smaller ecosystem)
 * 
 * PHILOSOPHIE DESIGN:
 * - Apple Premium: Épuré, spacieux, micro-animations subtiles
 * - Mobile-first: Responsive dès le départ
 * - Performance: Static export, images optimisées, lazy loading
 * - Accessibility: Semantic HTML, ARIA labels, keyboard navigation
 * 
 * SECTION ORDER (Business Priority):
 * 1. Hero - Value proposition
 * 2. Book - Primary commercial objective (in progress)
 * 3. Tools Suite - Retro AI Tool flagship + ecosystem
 * 4. Manifesto - Reference document
 * 5. Cards - E-commerce product
 * 6. Newsletter + Contact - Lead generation
 * 7. Floating Coaching Button - Always visible CTA
 * 
 * AUTHENTICATION STRATEGY:
 * - Phase 1 (current): UI placeholders ready
 * - Phase 2 (future): Choose between:
 *   * Firebase Auth (recommended: easy, scalable, free tier)
 *   * Supabase (open-source, Postgres-backed)
 *   * Auth0 (enterprise-grade)
 *   * NextAuth.js (self-hosted, flexible)
 * 
 * CODE ORGANIZATION:
 * - Base structure (this file): Clean, commented by section
 * - Animation layer (to be added): Separate concerns
 * - Reusable components: Premium Navbar, Footer, Floating Button
 * - Section components: Modular, isolated, testable
 * 
 * =============================================================================
 */

import type { Metadata } from 'next'
import PremiumNavbar from '@/components/premium-navbar'
import LandingHero from '@/components/landing/hero'

export const metadata: Metadata = {
  title: 'AIgile | Outils AI Agile Coaching France Belgique Luxembourg',
  description:
    'Retro AI gratuit + méthode S.A.L.I.M | Coaching agile Luxembourg/France/Belgique - 21 ans expertise Salim Gomri',
  openGraph: {
    title: 'AIgile | Coaching Agile AI Luxembourg France',
    description: 'Outils Retro AI, Niko-Niko, DORA Metrics pour Scrum Masters FR/Lux/BE',
  },
  alternates: { canonical: 'https://aigile.lu/' },
}
import BookSection from '@/components/landing/book-section'
import PricingSection from '@/components/landing/PricingSection'
import ToolsSuiteSection from '@/components/landing/tools-suite'
import ManifestoSection from '@/components/landing/manifesto-section'
import CardsSection from '@/components/landing/cards-section'
import NewsletterContactSection from '@/components/landing/newsletter-contact'
import PremiumFooter from '@/components/landing/premium-footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* 
        NAVIGATION
        - Premium Apple-style navbar
        - Glassmorphism on scroll
        - Bilingual (FR/EN)
        - Auth buttons ready for integration
        - Reusable across all pages
      */}
      <PremiumNavbar />

      {/* 
        SECTION 1: HERO
        - Above the fold value proposition
        - Clear headline: "Agile Augmented by AI"
        - Dual CTA: Start Journey + Explore Tools
        - Gradient orbs background
        - Scroll indicator
      */}
      <LandingHero />

      {/* 
        SECTION 2: BOOK "Le Système S.A.L.I.M"
        - PRIORITY COMMERCIAL FEATURE
        - 3D book mockup (placeholder ready for real design)
        - "In Progress" badge
        - Clear benefits (3 bullet points)
        - Strong CTA: Pre-order
        - Price: Coming Spring 2026
      */}
      <BookSection />

      {/* 
        SECTION 2b: PRICING
        - Tarifs Day Pass | Pro | Free
        - Toggle mensuel/annuel
        - CTA vers CheckoutSheet ou /register
      */}
      <PricingSection />

      {/* 
        SECTION 3: TOOLS SUITE
        - AIgile Retro Suite presentation
        - AI Retro Tool as flagship (featured card)
        - 6 tools grid (Retro, Niko-Niko, DORA, OKR, Dashboard, Skills)
        - Links: /retro (start) + /start-scrum (journey)
        - "Free for teams" messaging
      */}
      <ToolsSuiteSection />

      {/* 
        SECTION 4: MANIFESTO
        - Reference document showcase
        - Preview card with 4 values
        - Dual CTA: Read online + Download PDF
        - Link to /manifesto page
        - "4 Values • 10 Principles" badge
      */}
      <ManifestoSection />

      {/* 
        SECTION 5: RETRO PATTERN CARDS
        - E-commerce product section
        - Card stack visual (3D mockup placeholder)
        - 146 cards badge
        - 4 features with checkmarks
        - Price: $49/€49 + shipping
        - Strong CTA: Order Now
      */}
      <CardsSection />

      {/* 
        SECTION 6: NEWSLETTER + CONTACT
        - Side-by-side layout (desktop)
        - Newsletter: Email signup form
        - Contact: Full form (name, email, message)
        - Contact sends to: salim.gomri@gmail.com
        - Social proof: "1,000+ agilists"
      */}
      <NewsletterContactSection />

      {/* 
        FOOTER
        - Premium Apple-style design
        - 4-column layout: Brand, Product, Resources, Company
        - Social links (LinkedIn, Twitter)
        - Copyright © 2026 Salim Gomri
        - Reusable across all pages
      */}
      <PremiumFooter />

      {/* FloatingBottomBar (Feedback, Buy a coffee, Calendly) — dans layout.tsx */}
    </main>
  )
}

/*
 * =============================================================================
 * NEXT STEPS (Animation Layer)
 * =============================================================================
 * 
 * MICRO-ANIMATIONS TO ADD:
 * 1. Scroll-triggered animations:
 *    - Fade-in on section entry (Intersection Observer)
 *    - Parallax on background orbs
 *    - Counter animations (146 activities, 1000+ users)
 * 
 * 2. Hover effects:
 *    - Card lift on hover (transform: translateY)
 *    - Button glow intensification
 *    - Link underline animations
 * 
 * 3. Transitions:
 *    - Page transitions (Framer Motion)
 *    - Smooth scroll to anchors
 *    - Navbar color change on scroll
 * 
 * 4. Loading states:
 *    - Skeleton loaders for dynamic content
 *    - Form submission feedback
 *    - Progressive image loading
 * 
 * LIBRARIES RECOMMANDÉES:
 * - Framer Motion: React animation library (recommended)
 * - GSAP: Advanced animations (if needed)
 * - Intersection Observer API: Native, no dependency
 * - CSS Transitions: For simple effects (already in place)
 * 
 * PERFORMANCE GUIDELINES:
 * - Use transform & opacity for animations (GPU-accelerated)
 * - Debounce scroll listeners
 * - Lazy load images below fold
 * - Code-split animations (dynamic imports)
 * - Reduce motion for accessibility (prefers-reduced-motion)
 * 
 * =============================================================================
 */
