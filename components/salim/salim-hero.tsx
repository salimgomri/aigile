'use client'

import { useEffect, useState } from 'react'
import { CountdownBanner } from '@/components/countdown-banner'
import { useInView } from '@/hooks/use-in-view'
import { CounterStat } from './counter-stat'

export function SalimHero() {
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
          22 ans de terrain. 300 rétrospectives facilitées. Un seul système.
        </p>
        <div className="hero-stats">
          <div>
            <span className="hero-stat-number">
              <CounterStat target={22} active={active} />
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
        <CountdownBanner />
      </div>
    </section>
  )
}
