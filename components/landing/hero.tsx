/*
 * Landing Page Hero - S.A.L.I.M System
 * 2-column layout: Left (content) + Right (book cover)
 * Decoded acronym in 2 horizontal lines (exact match with book cover)
 * Accurate stats, clear CTAs, bilingual support
 */

'use client'

import { useLanguage } from '../language-provider'
import { trackEvent } from '@/lib/gtag'
import { ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import { getBookCtaLabel } from '@/lib/book-config'
import { useBookProduct } from '@/lib/book-product-context'

const heroContent = {
  fr: {
    badge: "✦ Par Salim Gomri · Scrum Master & Coach Agile · 21 ans terrain",
    system: "Le système",
    acronym: "S·A·L·I·M",
    // 2 horizontal lines like on the book cover
    line1: [
      { letter: "S", rest: "crum" },
      { letter: "A", rest: "ugmenté" },
      { letter: "L", rest: "ivré" },
    ],
    line2: [
      { letter: "I", rest: "ncrémental &" },
      { letter: "M", rest: "esurable" },
    ],
    tagline: "Le seul système qui te guide pas à pas sur le terrain — avec l'IA et des outils adaptés à ta réalité d'équipe.",
    subTagline: "Scrum Augmenté par l'IA · Rétros intelligentes · Métriques qui parlent",
    aigileLabel: "Bienvenue dans l'ère",
    ctaPrimary: "Essayer Rétro IA gratuitement",
    ctaSecondary: "Découvrir le Système S.A.L.I.M",
    stats: [
      { value: "21", label: "ans sur le terrain" },
      { value: "9", label: "patterns de dysfonction" },
      { value: "6", label: "outils intégrés" },
    ],
    scrollLabel: "Découvrir",
  },
  en: {
    badge: "✦ By Salim Gomri · Scrum Master & Agile Coach · 21 years in the field",
    system: "The System",
    acronym: "S·A·L·I·M",
    line1: [
      { letter: "S", rest: "crum" },
      { letter: "A", rest: "ugmented" },
      { letter: "L", rest: "ead" },
    ],
    line2: [
      { letter: "I", rest: "ncrease &" },
      { letter: "M", rest: "easure" },
    ],
    tagline: "The only system that guides you step by step in the field — with AI and tools built for your team's reality.",
    subTagline: "AI-Augmented Scrum · Smart Retrospectives · Metrics that matter",
    aigileLabel: "Welcome to the",
    ctaPrimary: "Try Retro AI for free",
    ctaSecondary: "Discover the S.A.L.I.M System",
    stats: [
      { value: "21", label: "years in the field" },
      { value: "9", label: "dysfunction patterns" },
      { value: "6", label: "integrated tools" },
    ],
    scrollLabel: "Discover",
  },
}

export default function LandingHero() {
  const { language } = useLanguage()
  const content = heroContent[language]
  const { product: bookProduct } = useBookProduct()
  const bookBadge = bookProduct ? getBookCtaLabel(language) : null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-aigile-dark">
      {/* Subtle brand gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,151,58,0.08),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(19,142,236,0.06),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT COLUMN: Content */}
          <div className="space-y-8">
            {/* Authority Badge */}
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-aigile-gold/10 border border-aigile-gold/30">
              <span className="text-sm font-medium text-aigile-gold">
                {content.badge}
              </span>
            </div>

            {/* System Label */}
            <p className="text-base text-muted-foreground uppercase tracking-widest">
              {content.system}
            </p>

            {/* S·A·L·I·M Acronym with dots */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-aigile-gold tracking-wide">
              {content.acronym}
            </h1>

            {/* Decoded - 2 horizontal lines like book cover */}
            <div className="space-y-3 text-xl sm:text-2xl lg:text-3xl">
              {/* Line 1: Scrum Augmenté Livré */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {content.line1.map((word, idx) => (
                  <span key={idx} className="inline-flex items-baseline">
                    <span className="font-bold text-aigile-gold">{word.letter}</span>
                    <span className="text-white/90">{word.rest}</span>
                  </span>
                ))}
              </div>

              {/* Line 2: Incrémental & Mesurable */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {content.line2.map((word, idx) => (
                  <span key={idx} className="inline-flex items-baseline">
                    <span className="font-bold text-aigile-gold">{word.letter}</span>
                    <span className="text-white/90">{word.rest}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              {content.tagline}
            </p>

            {/* Sub-tagline + AIgile */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {content.subTagline}
              </p>
              <p className="text-sm text-muted-foreground">
                {content.aigileLabel}{' '}
                <Link href="/manifesto" className="text-aigile-blue font-bold hover:underline">
                  AIgile
                </Link>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
              {/* Primary CTA */}
              <Link
                href="/retro"
                onClick={() => trackEvent('try_free_click', { value: 9.99, currency: 'EUR' })}
                className="group px-8 py-4 bg-aigile-gold hover:bg-aigile-gold/90 text-aigile-navy text-lg font-bold rounded-full shadow-lg shadow-aigile-gold/30 hover:shadow-xl hover:shadow-aigile-gold/40 hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <span>{content.ctaPrimary}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              {/* Secondary CTA */}
              <a
                href="#book"
                onClick={() => trackEvent('cta_book_discover')}
                className="px-6 py-3 bg-transparent border border-white/40 text-white text-base font-medium rounded-full hover:border-aigile-gold hover:bg-aigile-gold/5 transition-colors duration-300 flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>{content.ctaSecondary}</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {content.stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl font-bold text-aigile-gold mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Book Cover */}
          <div className="relative lg:order-2">
            <div className="relative max-w-md mx-auto lg:mx-0 lg:ml-auto">
              {/* Glow effect animated */}
              <div className="absolute inset-0 bg-gradient-to-br from-aigile-gold to-aigile-blue opacity-20 blur-3xl animate-pulse" />
              
              {/* Book Cover Image with micro-animations */}
              <div className="relative aspect-[3/4] -rotate-2 hover:rotate-0 hover:scale-110 transition-all duration-700 ease-out shadow-2xl hover:shadow-aigile-gold/40 rounded-lg overflow-hidden group">
                <Image
                  src="/images/book-cover.jpg"
                  alt="Le Système S.A.L.I.M - Salim Gomri"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                
                {/* Overlay effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-aigile-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Bouton d'achat: Précommander / Commander selon lib/book-config.ts */}
              {bookProduct ? (
                <CheckoutSheet
                  product={bookProduct}
                  trigger={
                    <div
                      onClick={() => trackEvent('preorder_book', { product: 's-a-l-i-m', value: 35 })}
                      className="absolute -bottom-6 -left-6 bg-gradient-to-r from-book-orange to-aigile-gold text-white px-6 py-3 rounded-full shadow-2xl font-bold animate-bounce-slow cursor-pointer hover:scale-105 hover:shadow-aigile-gold/40 transition-all duration-300"
                    >
                      {bookBadge ?? getBookCtaLabel(language)}
                    </div>
                  }
                />
              ) : (
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-book-orange to-aigile-gold text-white px-6 py-3 rounded-full shadow-2xl font-bold animate-bounce-slow">
                  {bookBadge ?? getBookCtaLabel(language)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator - centered below */}
        <div className="mt-20 text-center">
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full mx-auto flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-aigile-gold rounded-full animate-bounce" />
          </div>
          <p className="text-xs text-muted-foreground mt-3 uppercase tracking-widest">
            {content.scrollLabel}
          </p>
        </div>
      </div>
    </section>
  )
}
