/*
 * Landing Page Hero Section
 * - WOW Effect Premium with animated mesh gradients
 * - Floating orbs with 3D depth
 * - Glassmorphism cards
 * - Premium animations
 */

'use client'

import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LandingHero() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden luxury-mesh-hero">
      {/* Animated Floating Orbs - WOW Effect */}
      <div className="luxury-orbs">
        <div className="luxury-orb luxury-orb-1" />
        <div className="luxury-orb luxury-orb-2" />
        <div className="luxury-orb luxury-orb-3" />
      </div>

      {/* Noise texture overlay for premium feel */}
      <div className="absolute inset-0 luxury-noise opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge with glassmorphism */}
        <div className="inline-flex items-center space-x-2 px-5 py-2.5 luxury-glass-card rounded-full mb-8 luxury-hover-lift">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t['hero-author']}
          </span>
        </div>

        {/* Main Title with premium gradient animation */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="luxury-text-premium block">
            {t['landing-hero-title']}
          </span>
        </h1>

        {/* Subtitle with subtle glow */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto font-light luxury-text-glow">
          {t['landing-hero-subtitle']}
        </p>

        {/* Tagline */}
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          {t['landing-hero-tagline']}
        </p>

        {/* CTAs with premium effects */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <Link
            href="/retro"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white text-lg font-semibold rounded-full overflow-hidden luxury-hover-lift luxury-animated-border"
          >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 luxury-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center space-x-2">
              <span>{t['landing-hero-cta-primary']}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>

          <Link
            href="#tools"
            className="px-8 py-4 luxury-glass-card text-gray-200 text-lg font-semibold rounded-full border-2 border-primary/30 hover:border-primary/60 luxury-hover-lift luxury-spotlight transition-all duration-300"
          >
            {t['landing-hero-cta-secondary']}
          </Link>
        </div>

        {/* Premium stats cards with glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { number: '146', label: language === 'fr' ? 'Activités' : 'Activities', icon: '🎯' },
            { number: '1000+', label: language === 'fr' ? 'Agilistes' : 'Agilists', icon: '👥' },
            { number: '30 ans', label: language === 'fr' ? 'Expérience' : 'Experience', icon: '🏆' },
          ].map((stat, index) => (
            <div
              key={index}
              className="luxury-glass-card luxury-hover-lift luxury-card-3d p-6 rounded-2xl group"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold luxury-text-premium mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator with animation */}
        <div className="mt-20">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full mx-auto flex items-start justify-center p-2 luxury-glow">
            <div className="w-1.5 h-3 bg-gradient-to-b from-primary to-secondary rounded-full animate-bounce" />
          </div>
          <p className="text-xs text-gray-500 mt-3 uppercase tracking-widest">
            {language === 'fr' ? 'Découvrir' : 'Discover'}
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
