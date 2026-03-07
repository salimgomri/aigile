/*
 * Landing Page Hero - S.A.L.I.M System
 * Visually decoded acronym with clean, professional design
 * Accurate stats, clear CTAs, bilingual support
 */

'use client'

import { useLanguage } from '../language-provider'
import { ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'

const heroContent = {
  fr: {
    badge: "✦ Par Salim Gomri · Scrum Master & Coach Agile · 21 ans terrain",
    system: "Le système",
    acronym: "S.A.L.I.M",
    lines: [
      { letter: "S", rest: "crum Augmenté" },
      { letter: "A", rest: "ugmenté par l'IA" },
      { letter: "L", rest: "ivré" },
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
    acronym: "S.A.L.I.M",
    lines: [
      { letter: "S", rest: "crum Augmented" },
      { letter: "A", rest: "ugmented by AI" },
      { letter: "L", rest: "ead" },
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-aigile-dark">
      {/* Subtle brand gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,151,58,0.08),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(19,142,236,0.06),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Authority Badge - Unicode star, no SVG */}
          <div className="inline-flex items-center px-6 py-2 mb-8 rounded-full bg-aigile-gold/10 border border-aigile-gold/30">
            <span className="text-sm font-medium text-aigile-gold">
              {content.badge}
            </span>
          </div>

          {/* System Label */}
          <p className="text-base text-muted-foreground mb-4 uppercase tracking-widest">
            {content.system}
          </p>

          {/* S.A.L.I.M Acronym - Large & Bold */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 text-aigile-gold tracking-wider">
            {content.acronym}
          </h1>

          {/* Decoded Lines - Visual Reading */}
          <div className="mb-10 space-y-2 text-lg sm:text-xl lg:text-2xl">
            {content.lines.map((line, idx) => (
              <div key={idx} className="flex items-center justify-center space-x-2">
                <span className="font-bold text-aigile-gold">{line.letter}</span>
                <span className="text-white/90">· {line.rest}</span>
              </div>
            ))}
          </div>

          {/* Tagline - Main promise */}
          <p className="text-xl sm:text-2xl text-white mb-6 max-w-3xl mx-auto leading-relaxed">
            {content.tagline}
          </p>

          {/* Sub-tagline + AIgile positioning */}
          <p className="text-base text-muted-foreground mb-2">
            {content.subTagline}
          </p>
          <p className="text-base text-muted-foreground mb-12">
            {content.aigileLabel}{' '}
            <Link href="/manifesto" className="text-aigile-blue font-bold hover:underline">
              AIgile
            </Link>
          </p>

          {/* CTAs - Primary + Secondary */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* Primary CTA: Retro Tool (ONLY hover:scale-105) */}
            <Link
              href="/retro"
              className="group px-10 py-5 bg-aigile-gold hover:bg-aigile-gold/90 text-aigile-navy text-xl font-bold rounded-full shadow-lg shadow-aigile-gold/30 hover:shadow-xl hover:shadow-aigile-gold/40 hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span>{content.ctaPrimary}</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* Secondary CTA: Book Section */}
            <a
              href="#book"
              className="px-6 py-3 bg-transparent border border-white/40 text-white text-base font-medium rounded-full hover:border-aigile-gold hover:bg-aigile-gold/5 transition-colors duration-300 flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{content.ctaSecondary}</span>
            </a>
          </div>

          {/* Stats - Accurate & Verifiable */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {content.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl hover:border-aigile-gold hover:shadow-lg hover:shadow-aigile-gold/20 transition-all duration-300"
              >
                <div className="text-4xl font-bold text-aigile-gold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="mt-20">
            <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-aigile-gold rounded-full animate-bounce" />
            </div>
            <p className="text-xs text-muted-foreground mt-3 uppercase tracking-widest">
              {content.scrollLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
