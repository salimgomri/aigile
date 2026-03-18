'use client'

import { usePathname } from 'next/navigation'
import { useLanguage } from './language-provider'
import { trackEvent } from '@/lib/gtag'
import { translations } from '@/lib/translations'
import { getBookCtaLabel } from '@/lib/book-config'
import { useBookProduct } from '@/lib/book-product-context'
import { Calendar, BookOpen } from 'lucide-react'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'

const CALENDLY_URL = 'https://calendly.com/salimdulux/30min'

/** Barre flottante — 2 CTA principaux : Coaching (Calendly) + Livre. Les autres (Feedback, Buy a coffee) sont dans le footer. */
export default function FloatingBottomBar() {
  const { language } = useLanguage()
  const pathname = usePathname()
  const t = translations[language]
  const { product: bookProduct } = useBookProduct()

  const btnClass =
    'flex items-center gap-2 px-5 py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105'
  const iconClass = 'w-5 h-5 flex-shrink-0'

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 sm:gap-4"
      role="group"
    >
      {/* Livre S.A.L.I.M */}
      {bookProduct ? (
        <CheckoutSheet
          product={bookProduct}
          trigger={
            <button
              type="button"
              onClick={() => trackEvent('cta_book_float', { from: pathname })}
              className={`${btnClass} bg-book-orange/20 hover:bg-book-orange/30 border border-book-orange/50 text-book-orange`}
              aria-label={t['nav-book']}
            >
              <BookOpen className={iconClass} />
              <span className="font-medium text-sm whitespace-nowrap">{getBookCtaLabel(language)}</span>
            </button>
          }
        />
      ) : (
        <button
          type="button"
          disabled
          className={`${btnClass} bg-book-orange/10 border border-book-orange/30 text-book-orange/70 cursor-not-allowed`}
          aria-label={t['nav-book']}
          title={language === 'fr' ? 'Chargement...' : 'Loading...'}
        >
          <BookOpen className={`${iconClass} animate-pulse`} />
          <span className="font-medium text-sm whitespace-nowrap">{getBookCtaLabel(language)}</span>
        </button>
      )}

      {/* Coaching — CTA principal */}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnClass} bg-aigile-gold hover:bg-book-orange text-black font-semibold`}
        aria-label={t['coaching-float']}
      >
        <Calendar className={iconClass} />
        <span className="text-sm whitespace-nowrap">{t['coaching-float-short']}</span>
      </a>
    </div>
  )
}
