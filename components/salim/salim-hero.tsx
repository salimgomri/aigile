'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useInView } from '@/hooks/use-in-view'
import { getSalimYearsExperience } from '@/lib/salim-experience'
import { SALIM_EXCERPT_PATH, SALIM_PRICE_LABEL, SALIM_PURCHASE_PATH } from '@/lib/salim/fiche'
import { CounterStat } from './counter-stat'

export function SalimHero() {
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
          <Link href={SALIM_PURCHASE_PATH} className="hero-cta-primary">
            Acheter le livre · {SALIM_PRICE_LABEL}
          </Link>
          <Link href={SALIM_EXCERPT_PATH} className="hero-cta-secondary">
            Lire l’extrait
          </Link>
        </div>
        <p className="hero-cta-reassurance">Un livre. Prix total livré, port compris. Paiement sécurisé.</p>
      </div>
    </section>
  )
}
