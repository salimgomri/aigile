/*
 * Landing Page Hero Section
 * - Apple-style premium design
 * - Clear value proposition
 * - Strong CTAs
 * - Smooth animations (to be added in animation layer)
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-black/50 backdrop-blur-lg rounded-full border border-gray-200 dark:border-gray-800 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t['hero-author']}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            {t['landing-hero-title']}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto font-light">
          {t['landing-hero-subtitle']}
        </p>

        {/* Tagline */}
        <p className="text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto">
          {t['landing-hero-tagline']}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            href="/retro"
            className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <span>{t['landing-hero-cta-primary']}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <Link
            href="#tools"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-lg font-semibold rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t['landing-hero-cta-secondary']}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20">
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-full mx-auto flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
