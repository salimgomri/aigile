/*
 * Book Section - Le Système S.A.L.I.M
 * - Real book cover image
 * - Orange accent from book cover
 * - Clear benefits and CTA
 * - Prix dynamique depuis /api/book/pricing
 */

'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { CheckCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import type { Product } from '@/lib/payments/catalog'

type PricingData = {
  product: Product
  priceFormatted: string
  isPreorder: boolean
  daysLeft: number
}

export default function BookSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [pricing, setPricing] = useState<PricingData | null>(null)

  useEffect(() => {
    fetch('/api/book/pricing')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setPricing(d))
      .catch(() => {})
  }, [])

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
          {/* Left: Real Book Cover */}
          <div className="relative order-2 lg:order-1">
            <div className="relative group">
              {/* Glow effect animated */}
              <div className="absolute inset-0 bg-gradient-to-br from-book-orange to-aigile-gold opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500 animate-pulse" />
              
              {/* Book Cover Image with zoom effect */}
              <div className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-book-orange/30 transition-all duration-500">
                <Image
                  src="/images/book-cover.jpg"
                  alt="Le Système S.A.L.I.M - Salim Gomri"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  priority
                />
                
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-book-orange/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* "In Progress" ribbon with book-orange accent */}
              <div className="absolute top-8 -right-12 bg-gradient-to-r from-book-orange to-aigile-gold text-white px-12 py-2 text-sm font-bold transform rotate-45 shadow-2xl animate-pulse">
                {t['book-badge']}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Badge with book-orange accent */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-book-orange/10 backdrop-blur-sm rounded-full border border-book-orange/30">
              <Sparkles className="w-4 h-4 text-book-orange" />
              <span className="text-sm font-semibold text-book-orange uppercase tracking-wider">
                {language === 'fr' ? 'Sortie Prioritaire' : 'Priority Release'}
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
              <div className="flex flex-col sm:flex-row gap-4">
                {pricing?.product ? (
                  <CheckoutSheet
                    product={pricing.product}
                    trigger={
                      <button className="px-8 py-4 bg-gradient-to-r from-book-orange to-aigile-gold text-white text-lg font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        {t['book-cta']} — {pricing.priceFormatted}
                      </button>
                    }
                  />
                ) : (
                  <button disabled className="px-8 py-4 bg-muted text-muted-foreground text-lg font-bold rounded-full cursor-not-allowed">
                    {t['book-cta']}
                  </button>
                )}
                <Link
                  href="/parcours"
                  className="px-8 py-4 border-2 border-aigile-gold/50 text-foreground font-semibold rounded-full hover:border-aigile-gold hover:bg-aigile-gold/10 transition-all duration-300 text-center"
                >
                  {language === 'fr' ? 'Découvrir mon parcours' : 'Discover my journey'}
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                {pricing ? (
                  <>
                    {pricing.isPreorder && pricing.daysLeft > 0 && (
                      <span className="text-book-orange font-medium">
                        {language === 'fr' ? `Il reste ${pricing.daysLeft} jours` : `${pricing.daysLeft} days left`} —{' '}
                      </span>
                    )}
                    {pricing.isPreorder && pricing.daysLeft > 0 && (
                      <span className="line-through text-muted-foreground/70">40,00 €</span>
                    )}
                    {pricing.isPreorder && pricing.daysLeft > 0 && ' → '}
                    {pricing.priceFormatted}
                    {!pricing.isPreorder && pricing.daysLeft === 0 && (
                      <span> {language === 'fr' ? '(prix de vente)' : '(sale price)'}</span>
                    )}
                  </>
                ) : (
                  t['book-price']
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
