'use client'

import { useEffect, useState } from 'react'
import { formatBookPrice, BUNDLE_SALE_CENTIMES } from '@/lib/book-config'
import { trackEvent } from '@/lib/gtag'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import type { Product } from '@/lib/payments/catalog'

const OFFERS_SECTION_ID = 'salim-offres'

export function SalimStickyMobileCta({ bundle }: { bundle: Product | null }) {
  const [scrollReady, setScrollReady] = useState(false)
  const [timeReady, setTimeReady] = useState(false)
  const [offersInView, setOffersInView] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setTimeReady(true), 3000)

    const onScroll = () => {
      setScrollReady(window.scrollY > 400)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const offersEl = document.getElementById(OFFERS_SECTION_ID)
    let observer: IntersectionObserver | undefined

    if (offersEl) {
      observer = new IntersectionObserver(
        ([entry]) => setOffersInView(entry.isIntersecting),
        { threshold: 0.15 }
      )
      observer.observe(offersEl)
    }

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  const visible = scrollReady && timeReady && !offersInView

  return (
    <div className={`sticky-mobile-cta md:hidden ${visible ? 'visible' : ''}`}>
      <span className="text-sm font-medium">Collection S.A.L.I.M.</span>
      <CheckoutSheet
        product={bundle}
        checkoutSource="salim_landing"
        trigger={
          <button
            type="button"
            onClick={() =>
              trackEvent('bundle_order_click', {
                product: 'bundle-salim',
                value: 110,
                currency: 'EUR',
                source: 'salim_landing_sticky',
              })
            }
          >
            Commander · {formatBookPrice(BUNDLE_SALE_CENTIMES)}
          </button>
        }
      />
    </div>
  )
}
