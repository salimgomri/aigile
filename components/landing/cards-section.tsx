/*
 * Cards Section - Retro Pattern Cards
 * - E-commerce section
 * - Premium product presentation
 * - Clear pricing and CTA
 */

'use client'

import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { Package, CheckCircle, Sparkles, ShoppingCart } from 'lucide-react'

export default function CardsSection() {
  const { language } = useLanguage()
  const t = translations[language]

  const features = [
    t['cards-feature-1'],
    t['cards-feature-2'],
    t['cards-feature-3'],
    t['cards-feature-4'],
  ]

  return (
    <section id="cards" className="relative py-24 bg-background">
      {/* Subtle separator */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_70%_50%,rgba(201,151,58,0.1),transparent_60%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual - NO scale hover */}
          <div className="relative order-2 lg:order-1">
            {/* Cards Stack Mockup */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-aigile-gold to-aigile-blue opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500" />
              
              {/* Card Stack */}
              <div className="relative">
                {/* Card 3 (bottom) */}
                <div className="absolute top-8 left-8 w-full aspect-[3/4] bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm rounded-2xl shadow-xl transform rotate-6 border border-border" />
                
                {/* Card 2 (middle) */}
                <div className="absolute top-4 left-4 w-full aspect-[3/4] bg-gradient-to-br from-card/90 to-muted/40 backdrop-blur-sm rounded-2xl shadow-xl transform rotate-3 border border-border" />
                
                {/* Card 1 (top) - NO scale */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-card/80 to-muted/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform hover:-rotate-1 transition-transform duration-500 border border-border">
                  {/* Card Design */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    {/* Top: Pattern Icon */}
                    <div>
                      <div className="w-16 h-16 bg-gradient-to-br from-aigile-gold to-aigile-blue rounded-xl flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-foreground mb-2">
                        {language === 'fr' ? 'Équipe Silencieuse' : 'Silent Team'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Pattern #P2
                      </p>
                    </div>

                    {/* Bottom: Activity Sample */}
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 backdrop-blur-sm rounded-lg border border-border/50">
                        <p className="text-xs font-semibold text-foreground">
                          {language === 'fr' ? 'Activité Recommandée' : 'Recommended Activity'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === 'fr' ? 'Roue de la Sécurité Psychologique' : 'Psychological Safety Wheel'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>15-30 min</span>
                        <span>3-12 {language === 'fr' ? 'personnes' : 'people'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-aigile-gold/5 via-transparent to-aigile-blue/5 pointer-events-none" />
                </div>
              </div>

              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-aigile-gold to-aigile-blue text-white px-6 py-3 rounded-full shadow-xl font-bold z-10">
                11 {language === 'fr' ? 'Cartes' : 'Cards'}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-aigile-gold/10 backdrop-blur-sm rounded-full border border-aigile-gold/20">
              <Sparkles className="w-4 h-4 text-aigile-gold" />
              <span className="text-sm font-semibold text-aigile-gold uppercase tracking-wider">
                {language === 'fr' ? 'Produit Physique' : 'Physical Product'}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                {t['cards-title']}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t['cards-subtitle']}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t['cards-description']}
            </p>

            {/* Features */}
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-aigile-gold flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90 text-lg">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Price & CTA - scale-105 for primary action */}
            <div className="pt-4">
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {t['cards-price']}
                </span>
                <span className="text-lg text-muted-foreground">
                  + {language === 'fr' ? 'frais de port' : 'shipping'}
                </span>
              </div>

              <button className="group px-8 py-4 bg-gradient-to-r from-aigile-gold to-aigile-blue text-white text-lg font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto">
                <ShoppingCart className="w-5 h-5" />
                <span>{t['cards-cta']}</span>
              </button>

              <p className="mt-4 text-sm text-muted-foreground">
                {language === 'fr' 
                  ? 'Livraison mondiale • Impression premium • Garantie satisfaction' 
                  : 'Worldwide shipping • Premium print • Satisfaction guaranteed'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
