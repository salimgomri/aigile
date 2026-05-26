'use client'

import { type RefObject } from 'react'
import { CountdownBanner } from '@/components/countdown-banner'
import { useInView } from '@/hooks/use-in-view'
import { CounterStat } from './counter-stat'

export function SalimHero() {
  const { ref, inView } = useInView(0.3)

  return (
    <section ref={ref as RefObject<HTMLElement>} className="hero">
      <div className="hero-inner">
        <h1>On mesure la vélocité. Jamais la solidité.</h1>
        <p className="hero-subtext">
          22 ans de terrain. 300 rétrospectives facilitées. Un seul système.
        </p>
        <div className="hero-stats">
          <div>
            <span className="hero-stat-number">
              <CounterStat target={22} active={inView} />
            </span>
            <span className="hero-stat-label">de terrain</span>
          </div>
          <div>
            <span className="hero-stat-number">
              <CounterStat target={300} active={inView} suffix="+" />
            </span>
            <span className="hero-stat-label">rétrospectives</span>
          </div>
          <div>
            <span className="hero-stat-number">
              <CounterStat target={415} active={inView} />
            </span>
            <span className="hero-stat-label">pages</span>
          </div>
        </div>
        <CountdownBanner />
      </div>
    </section>
  )
}
