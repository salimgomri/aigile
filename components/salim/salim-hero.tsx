'use client'

import { useEffect, useState } from 'react'
import { CountdownBanner } from '@/components/countdown-banner'
import { useInView } from '@/hooks/use-in-view'
import { BUNDLE_SALE_CENTIMES, formatBookPrice } from '@/lib/book-config'
import { trackEvent } from '@/lib/gtag'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import type { Product } from '@/lib/payments/catalog'
import { getSalimYearsExperience } from '@/lib/salim-experience'
import { CounterStat } from './counter-stat'

export function SalimHero({ bundle }: { bundle: Product | null }) {
  const yearsExperience = getSalimYearsExperience()
  const { ref, inView } = useInView(0.05)
  const [countersActive, setCountersActive] = useState(false)

  useEffect(() => {
    setCountersActive(true)
  }, [])

  const active = countersActive || inView

  return (
    <section ref={ref} className="hero">
      <div className="hero-inner">
        <h1>On mesure la vélocité. Jamais la solidité.</h1>
        <p className="hero-subtext">
          {yearsExperience} ans de terrain. 300 rétrospectives facilitées. Un seul système.
        </p>
        <div className="hero-stats">
          <div>
            <span className="hero-stat-number">
              <CounterStat target={yearsExperience} active={active} />
            </span>
            <span className="hero-stat-label">de terrain</span>
          </div>
          <div>
            <span className="hero-stat-number">
              <CounterStat target={300} active={active} suffix="+" />
            </span>
            <span className="hero-stat-label">rétrospectives</span>
          </div>
          <div>
            <span className="hero-stat-number">
              <CounterStat target={415} active={active} />
            </span>
            <span className="hero-stat-label">pages</span>
          </div>
        </div>

        <div className="hero-cta">
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
                    source: 'salim_hero',
                  })
                }
                className="hero-cta-primary"
              >
                Commander la Collection · {formatBookPrice(BUNDLE_SALE_CENTIMES)}
              </button>
            }
          />
          <a
            href="#salim-offres"
            className="hero-cta-secondary"
            onClick={() => trackEvent('hero_compare_formats', { source: 'salim_hero' })}
          >
            Comparer les 3 formats →
          </a>
        </div>
        <p className="hero-cta-reassurance">
          Livre + cahier + Scoring Deliverable · Expédié sous 48h · Paiement sécurisé
        </p>

        <CountdownBanner />
      </div>
    </section>
  )
}
