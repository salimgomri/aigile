/*
 * Landing Page Hero - CLEAN & SIMPLE
 * Priority: BOOK CTA visible immediately
 * No heavy animations, just subtle and professional
 */

'use client'

import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { ArrowRight, Sparkles, BookOpen, Target, Users } from 'lucide-react'
import Link from 'next/link'

export default function LandingHero() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Simple gradient background - NO heavy animations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.1),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.08),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge - Simple */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-muted/50 rounded-full border border-border mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">
              {t['hero-author']}
            </span>
          </div>

          {/* Title - White with warm glow */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white aigile-text">
            {t['landing-hero-title']}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            {t['landing-hero-subtitle']}
          </p>

          {/* Tagline */}
          <p className="text-lg text-muted-foreground/70 mb-12 max-w-2xl mx-auto">
            {t['landing-hero-tagline']}
          </p>

          {/* CTA - Single primary action: Retro Tool */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* CTA Primary: Retro Tool - Orange */}
            <Link
              href="/retro"
              className="group px-10 py-5 bg-primary hover:bg-primary/90 text-black text-xl font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span>{t['tools-cta']}</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* CTA Secondary: Book - Subtle */}
            <a
              href="#book"
              className="px-6 py-3 bg-transparent border border-white/40 text-white text-base font-medium rounded-full hover:border-white/80 hover:bg-white/5 transition-all duration-300 flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'fr' ? 'Le Livre' : 'The Book'}</span>
            </a>
          </div>

          {/* Stats - Accurate, verifiable numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card border border-border rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">9</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {language === 'fr' ? 'Patterns Détectés' : 'Patterns Detected'}
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">8</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {language === 'fr' ? 'Questions Diagnostiques' : 'Diagnostic Questions'}
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">21</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {language === 'fr' ? 'Ans Scrum Master' : 'Years Scrum Master'}
              </div>
            </div>
          </div>

          {/* Scroll indicator - Orange accent */}
          <div className="mt-20">
            <div className="w-6 h-10 border-2 border-muted-foreground rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
            </div>
            <p className="text-xs text-muted-foreground mt-3 uppercase tracking-widest">
              {language === 'fr' ? 'Découvrir' : 'Discover'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
