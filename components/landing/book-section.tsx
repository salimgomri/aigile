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
import { trackEvent } from '@/lib/gtag'
import { translations } from '@/lib/translations'
import { CheckCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import { getBookCtaLabel } from '@/lib/book-config'
import { useBookProduct } from '@/lib/book-product-context'

export default function BookSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const { product: bookProduct, fichesProduct } = useBookProduct()
  const [pricingMeta, setPricingMeta] = useState<{
    priceFormatted: string
    compareAtFormatted: string
  } | null>(null)
  const [fichesPricingMeta, setFichesPricingMeta] = useState<{
    priceFormatted: string
    compareAtFormatted: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/book/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        if (d.priceFormatted) {
          setPricingMeta({
            priceFormatted: d.priceFormatted,
            compareAtFormatted: d.compareAtFormatted,
          })
        }
        if (d.fiches?.priceFormatted) {
          setFichesPricingMeta({
            priceFormatted: d.fiches.priceFormatted,
            compareAtFormatted: d.fiches.compareAtFormatted,
          })
        }
      })
      .catch(() => {})
  }, [])

  const benefits = [
    t['book-benefit-1'],
    t['book-benefit-2'],
    t['book-benefit-3'],
  ]

  const fichesBenefits =
    language === 'fr'
      ? [
          'Toutes les fiches terrain du système',
          'Format outil : à garder ouvert sur le bureau pendant un sprint',
          'Complémentaire au livre, utilisable seul',
        ]
      : [
          'All field worksheets from the system',
          'Tool format: keep open on your desk during a sprint',
          'Complements the book, usable on its own',
        ]

  return (
    <section id="book" className="relative py-24 overflow-hidden bg-background">
      {/* Subtle brand gradient background */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(254, 189, 16,0.1),transparent_70%)]" />

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

              {/* Badge Commander / Buy selon lib/book-config.ts */}
              <div className="absolute top-8 -right-12 bg-gradient-to-r from-book-orange to-aigile-gold text-white px-12 py-2 text-sm font-bold transform rotate-45 shadow-2xl animate-pulse">
                {getBookCtaLabel(language)}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Badge with book-orange accent */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-book-orange/10 backdrop-blur-sm rounded-full border border-book-orange/30">
              <Sparkles className="w-4 h-4 text-book-orange" />
              <span className="text-sm font-semibold text-book-orange uppercase tracking-wider">
                {language === 'fr' ? 'Disponible' : 'Available now'}
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
              {pricingMeta && (
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-lg text-muted-foreground line-through">
                    {pricingMeta.compareAtFormatted}
                  </span>
                  <span className="text-2xl font-bold text-foreground">{pricingMeta.priceFormatted}</span>
                  <span className="text-sm text-muted-foreground w-full">
                    {language === 'fr' ? 'Prix direct aigile.lu' : 'Direct price on aigile.lu'}
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {bookProduct ? (
                  <CheckoutSheet
                    product={bookProduct}
                    trigger={
                      <button
                        onClick={() => trackEvent('book_order_click', { product: 's-a-l-i-m', value: 65 })}
                        className="px-8 py-4 bg-gradient-to-r from-book-orange to-aigile-gold text-white text-lg font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
                      >
                        {getBookCtaLabel(language)} · {pricingMeta?.priceFormatted ?? '65,00 €'}
                      </button>
                    }
                  />
                ) : (
                  <button disabled className="px-8 py-4 bg-muted text-muted-foreground text-lg font-bold rounded-full cursor-not-allowed">
                    {getBookCtaLabel(language)}
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
                {pricingMeta ? (
                  <>
                    <span className="line-through">{pricingMeta.compareAtFormatted}</span>{' '}
                    {pricingMeta.priceFormatted}
                    {language === 'fr'
                      ? ' · Livraison ou retrait en main propre (voir checkout).'
                      : ' · Shipping or in-person pickup (see checkout).'}
                  </>
                ) : (
                  t['book-price']
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Fiches pratiques */}
        <div className="mt-20 pt-16 border-t border-border/40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative group max-w-sm mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-aigile-gold to-book-orange opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500" />
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-aigile-gold/30 transition-all duration-500">
                  <Image
                    src="/images/book-cover-fiche.png"
                    alt={
                      language === 'fr'
                        ? 'Le Système S.A.L.I.M. — Fiches pratiques'
                        : 'The S.A.L.I.M System — Practical Worksheets'
                    }
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 384px"
                  />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-aigile-gold/10 backdrop-blur-sm rounded-full border border-aigile-gold/30">
                <Sparkles className="w-4 h-4 text-aigile-gold" />
                <span className="text-sm font-semibold text-aigile-gold uppercase tracking-wider">
                  {language === 'fr' ? 'Cahier terrain' : 'Field workbook'}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {language === 'fr'
                    ? 'Le Système S.A.L.I.M. — Fiches pratiques'
                    : 'The S.A.L.I.M System — Practical Worksheets'}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {language === 'fr'
                    ? 'Le compagnon de sprint. À garder ouvert pendant la facilitation.'
                    : 'Your sprint companion. Keep it open while you facilitate.'}
                </p>
              </div>

              <ul className="space-y-4">
                {fichesBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-aigile-gold flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 space-y-4">
                {fichesPricingMeta && (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-lg text-muted-foreground line-through">
                      {fichesPricingMeta.compareAtFormatted}
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      {fichesPricingMeta.priceFormatted}
                    </span>
                    <span className="text-sm text-muted-foreground w-full">
                      {language === 'fr' ? 'Prix direct aigile.lu' : 'Direct price on aigile.lu'}
                    </span>
                  </div>
                )}
                {fichesProduct ? (
                  <CheckoutSheet
                    product={fichesProduct}
                    trigger={
                      <button
                        onClick={() =>
                          trackEvent('fiches_order_click', { product: 'fiches-salim', value: 35 })
                        }
                        className="px-8 py-4 bg-aigile-navy text-white text-lg font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
                      >
                        {language === 'fr' ? 'Commander les fiches' : 'Order worksheets'} ·{' '}
                        {fichesPricingMeta?.priceFormatted ?? '35,00 €'}
                      </button>
                    }
                  />
                ) : (
                  <button
                    disabled
                    className="px-8 py-4 bg-muted text-muted-foreground text-lg font-bold rounded-full cursor-not-allowed"
                  >
                    {language === 'fr' ? 'Commander les fiches' : 'Order worksheets'}
                  </button>
                )}
                <p className="text-sm text-muted-foreground">
                  {fichesPricingMeta ? (
                    <>
                      <span className="line-through">{fichesPricingMeta.compareAtFormatted}</span>{' '}
                      {fichesPricingMeta.priceFormatted}
                      {language === 'fr'
                        ? ' · Livraison ou retrait en main propre (voir checkout).'
                        : ' · Shipping or in-person pickup (see checkout).'}
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
