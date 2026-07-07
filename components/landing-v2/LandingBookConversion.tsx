'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Check, Quote, ShoppingCart } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { useInView } from '@/hooks/use-in-view'
import { getBookLandingCopy } from '@/lib/landing/book-landing-copy'
import { trackEvent } from '@/lib/gtag'
import { LandingBookPricing } from './LandingBookPricing'
import { LandingBuyButton } from './LandingBuyButton'

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView(0.08)
  return (
    <div
      ref={ref}
      className={`ld-reveal ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export function LandingProblemSolution() {
  const { language } = useLanguage()
  const t = getBookLandingCopy(language)

  return (
    <section className="ld-band ld-band--split" aria-labelledby="ld-problem-title">
      <div className="ld-shell ld-band__grid">
        <Reveal className="ld-band__card ld-band__card--problem">
          <span className="ld-band__label">{t.problemTitle}</span>
          <p id="ld-problem-title">{t.problemBody}</p>
        </Reveal>
        <Reveal className="ld-band__card ld-band__card--solution" delay={80}>
          <span className="ld-band__label ld-band__label--gold">{t.solutionTitle}</span>
          <p>{t.solutionBody}</p>
        </Reveal>
      </div>
    </section>
  )
}

export function LandingBookInside() {
  const { language } = useLanguage()
  const t = getBookLandingCopy(language)

  return (
    <section id="inside" className="ld-inside">
      <div className="ld-shell ld-inside__grid">
        <Reveal className="ld-inside__visual">
          <div className="ld-inside__cover-wrap">
            <Image
              src="/images/book-cover.jpg"
              alt={language === 'fr' ? 'Le système S.A.L.I.M.' : 'The S.A.L.I.M. System'}
              width={420}
              height={560}
              className="ld-inside__cover"
            />
          </div>
        </Reveal>

        <div className="ld-inside__content">
          <Reveal>
            <span className="ld-kicker">{t.insideEyebrow}</span>
            <h2 className="ld-section-title">{t.insideTitle}</h2>
            <p className="ld-section-lead">{t.insideLead}</p>
          </Reveal>

          <ul className="ld-inside__list">
            {t.insideBullets.map((item, i) => (
              <Reveal key={item} delay={i * 60}>
                <li>
                  <Check size={16} strokeWidth={2.5} aria-hidden />
                  <span>{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={240}>
            <LandingBuyButton className="ld-btn ld-btn--gold" source="landing_home_inside" showPrice>
              <ShoppingCart size={17} aria-hidden />
              <span>{t.heroCta}</span>
            </LandingBuyButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function LandingBookStats() {
  const { language } = useLanguage()
  const t = getBookLandingCopy(language)

  return (
    <section className="ld-stats" aria-label={language === 'fr' ? 'Chiffres clés' : 'Key figures'}>
      <div className="ld-shell ld-stats__grid">
        {t.stats.map((stat, i) => (
          <Reveal key={stat.label} className="ld-stat" delay={i * 50}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function LandingBookProof() {
  const { language } = useLanguage()
  const t = getBookLandingCopy(language)

  return (
    <section className="ld-proof">
      <div className="ld-shell">
        <Reveal className="ld-proof__card">
          <Quote size={28} className="ld-proof__icon" aria-hidden />
          <blockquote>{t.proofQuote}</blockquote>
          <cite>{t.proofAuthor}</cite>
        </Reveal>
      </div>
    </section>
  )
}

export function LandingFrameworkBridge() {
  const { language } = useLanguage()
  const t = getBookLandingCopy(language)

  return (
    <section id="framework" className="ld-bridge">
      <div className="ld-shell ld-bridge__inner">
        <Reveal className="ld-bridge__copy">
          <span className="ld-kicker">{t.frameworkEyebrow}</span>
          <h2 className="ld-section-title">{t.frameworkTitle}</h2>
          <p className="ld-section-lead">{t.frameworkDesc}</p>
          <Link
            href="/framework"
            className="ld-btn ld-btn--outline ld-btn--inline"
            onClick={() => trackEvent('landing_framework_learn_more', { source: 'landing_home' })}
          >
            <BookOpen size={16} aria-hidden />
            {t.frameworkCta}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
        <Reveal className="ld-bridge__visual" delay={100}>
          <Link
            href="/framework"
            className="ld-bridge__img-link"
            onClick={() => trackEvent('landing_framework_preview', { source: 'landing_home' })}
          >
            <Image
              src="/images/aigile-framework.png"
              alt="AIgile framework"
              width={480}
              height={480}
              className="ld-bridge__img"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export function LandingBookFinalCta() {
  const { language } = useLanguage()
  const t = getBookLandingCopy(language)

  return (
    <section id="buy" className="ld-final">
      <div className="ld-shell ld-final__card">
        <Reveal className="ld-final__visual">
          <Image
            src="/images/system-salim-hero.png"
            alt=""
            width={600}
            height={800}
            className="ld-final__book"
            aria-hidden
          />
        </Reveal>
        <div className="ld-final__copy">
          <Reveal>
            <span className="ld-kicker">{t.finalEyebrow}</span>
            <h2 className="ld-section-title ld-section-title--light">{t.finalTitle}</h2>
            <p className="ld-section-lead ld-section-lead--light">{t.finalLead}</p>
          </Reveal>
          <Reveal delay={80}>
            <LandingBookPricing className="ld-price ld-price--light" />
            <p className="ld-final__note">{t.deliveryNote}</p>
          </Reveal>
          <Reveal delay={140}>
            <LandingBuyButton className="ld-btn ld-btn--gold ld-btn--final" source="landing_home_final" showPrice={false}>
              <ShoppingCart size={18} aria-hidden />
              <span>{t.finalCta}</span>
              <ArrowRight size={18} aria-hidden />
            </LandingBuyButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
