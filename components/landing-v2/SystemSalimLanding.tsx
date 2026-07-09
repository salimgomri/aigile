'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Compass, ShoppingCart } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { useInView } from '@/hooks/use-in-view'
import { getBookLandingCopy } from '@/lib/landing/book-landing-copy'
import { trackEvent } from '@/lib/gtag'
import {
  LandingBookFinalCta,
  LandingBookInside,
  LandingBookProof,
  LandingBookStats,
  LandingFrameworkBridge,
  LandingProblemSolution,
} from './LandingBookConversion'
import { LandingAnalytics } from './LandingAnalytics'
import { LandingBookPricing } from './LandingBookPricing'
import { AigileLogo } from '@/components/brand/AigileLogo'
import { LandingBuyButton } from './LandingBuyButton'
import { LandingNavbar } from './LandingNavbar'
import { LandingToolsSuite } from './LandingToolsSuite'

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div ref={ref} className={`ld-reveal ${inView ? 'is-in' : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}

export function SystemSalimLanding() {
  const { language } = useLanguage()
  const t = getBookLandingCopy(language)
  const heroTitleLines = t.heroTitle.split('\n')

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="ld-page">
      <LandingAnalytics />
      <LandingNavbar onNav={scrollTo} />

      <section id="hero" className="ld-hero">
        <div className="ld-hero__inner">
          <div className="ld-hero__visual" aria-hidden>
            <Image
              src="/images/system-salim-hero-detoure.png"
              alt=""
              width={1086}
              height={1448}
              priority
              className="ld-hero__book"
            />
          </div>

          <Reveal className="ld-hero__copy">
            <p className="ld-kicker">{t.heroEyebrow}</p>
            <h1>
              {heroTitleLines.map((line, i) => (
                <span key={line}>
                  {i > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </h1>
            <p className="ld-lead">{t.heroSubtitle}</p>

            <LandingBookPricing className="ld-price ld-price--hero" />

            <div className="ld-hero__cta">
              <LandingBuyButton className="ld-btn ld-btn--gold ld-btn--hero ld-btn--shine" source="landing_home_hero">
                <ShoppingCart size={17} strokeWidth={2.2} aria-hidden />
                <span>{t.heroCta}</span>
                <ArrowRight size={17} strokeWidth={2.2} aria-hidden />
              </LandingBuyButton>

              <Link
                href="/framework"
                className="ld-btn ld-btn--outline"
                onClick={() => trackEvent('hero_explore_framework', { source: 'landing_home' })}
              >
                <Compass size={17} strokeWidth={2.2} aria-hidden />
                <span>{t.heroSecondary}</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <LandingProblemSolution />
      <LandingBookInside />
      <LandingBookStats />
      <LandingBookProof />
      <LandingFrameworkBridge />

      <Reveal>
        <LandingToolsSuite />
      </Reveal>

      <LandingBookFinalCta />

      <Reveal>
        <Link
          href="/manifesto"
          id="manifesto"
          className="ld-manifesto"
          onClick={() => trackEvent('landing_manifesto_click', { source: 'landing_home' })}
        >
          <div className="ld-manifesto__inner">
            <div className="ld-manifesto__brand">
              <AigileLogo size="md" className="ld-manifesto__logo" />
              <span className="ld-manifesto__label">{t.manifestoLabel}</span>
            </div>
            <div className="ld-manifesto__text">
              <span className="ld-manifesto__kicker">{t.manifestoKicker}</span>
              <p>{t.manifestoQuote}</p>
            </div>
            <span className="ld-link ld-link--dark">
              {t.learnMore} <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      </Reveal>

      <footer className="ld-footer">
        <div className="ld-footer__brand">
          <AigileLogo size="md" />
        </div>
        <p>{t.footerRights}</p>
      </footer>

      <div className="ld-sticky">
        <LandingBuyButton className="ld-btn ld-btn--gold ld-btn--sticky" source="landing_home_sticky" showPrice>
          <ShoppingCart size={16} aria-hidden />
          <span>{t.stickyCta}</span>
        </LandingBuyButton>
      </div>
    </div>
  )
}
