/*
 * Book Section - Le Système S.A.L.I.M
 * - Priority commercial feature
 * - 3D book mockup (placeholder)
 * - Clear benefits and CTA
 * - Premium Apple-style design
 */

'use client'

import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { BookOpen, CheckCircle, Sparkles } from 'lucide-react'

export default function BookSection() {
  const { language } = useLanguage()
  const t = translations[language]

  const benefits = [
    t['book-benefit-1'],
    t['book-benefit-2'],
    t['book-benefit-3'],
  ]

  return (
    <section id="book" className="relative py-24 overflow-hidden bg-background">
      {/* Subtle brand gradient background */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(201,151,58,0.1),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Book Mockup */}
          <div className="relative order-2 lg:order-1">
            {/* 3D Book Mockup - NO scale hover */}
            <div className="relative group">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-aigile-gold to-aigile-blue opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500" />
              
              {/* Book Image */}
              <div className="relative aspect-[3/4] max-w-md mx-auto bg-card/50 backdrop-blur-sm border border-border rounded-3xl shadow-2xl overflow-hidden hover:shadow-aigile-gold/20 transition-shadow duration-500">
                {/* Book Cover Design */}
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-aigile-navy to-black">
                  <div className="text-center space-y-6">
                    {/* Title on cover */}
                    <div className="space-y-2">
                      <h3 className="text-3xl sm:text-4xl font-bold text-white">
                        Le Système
                      </h3>
                      <h3 className="text-5xl sm:text-6xl font-bold text-aigile-gold">
                        S.A.L.I.M
                      </h3>
                    </div>
                    
                    {/* Subtitle */}
                    <p className="text-sm text-gray-300 max-w-xs mx-auto leading-relaxed">
                      {t['book-subtitle']}
                    </p>
                    
                    {/* Author */}
                    <p className="text-lg font-semibold text-gray-200">
                      Salim Gomri
                    </p>

                    {/* Icon */}
                    <div className="pt-4">
                      <BookOpen className="w-12 h-12 text-aigile-gold mx-auto" />
                    </div>
                  </div>
                </div>

                {/* "In Progress" ribbon */}
                <div className="absolute top-8 -right-12 bg-gradient-to-r from-aigile-gold to-aigile-blue text-white px-12 py-2 text-sm font-bold transform rotate-45 shadow-2xl">
                  {t['book-badge']}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-aigile-gold/10 backdrop-blur-sm rounded-full border border-aigile-gold/20">
              <Sparkles className="w-4 h-4 text-aigile-gold" />
              <span className="text-sm font-semibold text-aigile-gold uppercase tracking-wider">
                {language === 'fr' ? 'Priorité Commerciale' : 'Priority Release'}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                {t['book-title']}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t['book-subtitle']}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t['book-description']}
            </p>

            {/* Benefits */}
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-aigile-gold flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90 text-lg">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA - scale-105 for primary action only */}
            <div className="pt-4 space-y-4">
              <button className="px-8 py-4 bg-gradient-to-r from-aigile-gold to-aigile-blue text-white text-lg font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                {t['book-cta']}
              </button>
              <p className="text-sm text-muted-foreground">
                {t['book-price']}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
