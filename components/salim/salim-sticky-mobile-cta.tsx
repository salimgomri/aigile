'use client'

import { useEffect, useState } from 'react'
import { formatBookPrice, BUNDLE_SALE_CENTIMES } from '@/lib/book-config'
import { trackEvent } from '@/lib/gtag'

const OFFERS_SECTION_ID = 'salim-offres'

export function SalimStickyMobileCta() {
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
      <button
        type="submit"
        form="salim-bundle-form"
        onClick={() =>
          trackEvent('bundle_order_click', {
            product: 'bundle-salim',
            value: 100,
            currency: 'EUR',
            source: 'salim_landing_sticky',
          })
        }
      >
        Commander · {formatBookPrice(BUNDLE_SALE_CENTIMES)}
      </button>
    </div>
  )
}
