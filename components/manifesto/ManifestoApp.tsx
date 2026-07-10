'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Brain,
  Clock,
  Cog,
  Eye,
  FileText,
  Flag,
  GitBranch,
  Globe,
  Handshake,
  Linkedin,
  Mail,
  Network,
  RefreshCw,
  Rocket,
  RotateCcw,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { getAboutBioHtml } from '@/lib/salim-experience'
import { AigileLogo } from '@/components/brand/AigileLogo'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { MANIFESTO_SUB_NAV } from '@/lib/navigation/site-nav'
import { logDownload } from '@/lib/downloads/client'
import { type TranslationKey } from '@/lib/translations'
import { useInView } from '@/hooks/use-in-view'

const valueIcons = [Users, Cog, Handshake, RefreshCw]
const principleIcons = [TrendingUp, Brain, GitBranch, RotateCcw, Flag, Eye, Clock, Rocket, Network, Target]

const valueKeys = [
  { bold: 'value-1-bold', over: 'value-1-over', regular: 'value-1-regular' },
  { bold: 'value-2-bold', over: 'value-2-over', regular: 'value-2-regular' },
  { bold: 'value-3-bold', over: 'value-3-over', regular: 'value-3-regular' },
  { bold: 'value-4-bold', over: 'value-4-over', regular: 'value-4-regular' },
] as const

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
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

export function ManifestoApp() {
  const { t, language } = useLanguage()

  return (
    <div className="ld-page mf-page ld-page--subnav">
      <SiteChrome
        subNav={{
          contextFr: 'Manifeste',
          contextEn: 'Manifesto',
          items: MANIFESTO_SUB_NAV,
        }}
        buySource="manifesto_nav"
      />

      <section className="mf-hero">
        <div className="ld-shell mf-hero__inner">
          <Reveal className="mf-hero__cover">
            <div className="mf-cover-card" aria-hidden>
              <p className="mf-cover-card__eyebrow">{language === 'fr' ? 'Document fondateur' : 'Founding document'}</p>
              <p className="mf-cover-card__title">
                <AigileLogo size="md" className="mf-cover-card__wordmark" />
              </p>
              <p className="mf-cover-card__kind">{language === 'fr' ? 'Manifeste' : 'Manifesto'}</p>
              <ul className="mf-cover-card__values">
                <li>{language === 'fr' ? 'Interactions' : 'Interactions'}</li>
                <li>{language === 'fr' ? 'Logiciel livré' : 'Working software'}</li>
                <li>{language === 'fr' ? 'Collaboration client' : 'Customer collaboration'}</li>
                <li>{language === 'fr' ? 'Adaptation au changement' : 'Responding to change'}</li>
              </ul>
              <p className="mf-cover-card__author">Salim Gomri</p>
              <p className="mf-cover-card__meta">4 · 10 · 2025</p>
            </div>
          </Reveal>

          <Reveal className="mf-hero__copy" delay={80}>
            <p className="ld-kicker">{language === 'fr' ? 'Manifeste' : 'Manifesto'}</p>
            <h1 className="mf-hero__title">
              <AigileLogo size="hero" className="mf-hero__wordmark" priority />
              <span className="mf-hero__word">{language === 'fr' ? 'Manifeste' : 'Manifesto'}</span>
            </h1>
            <p className="mf-hero__author">{t('hero-author')}</p>
            <p className="mf-hero__subtitle">{t('hero-subtitle')}</p>
            <div className="mf-hero__actions">
              <a href="#values" className="ld-btn ld-btn--gold">
                {language === 'fr' ? 'Lire les valeurs' : 'Read the values'}
              </a>
              <a
                href="/aigileManifesto.pdf"
                download
                className="ld-btn ld-btn--outline"
                onClick={() => logDownload('manifesto_pdf', { source: 'manifesto_page', metadata: { placement: 'hero' } })}
              >
                <FileText size={17} aria-hidden />
                {t('cta-download')}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="values" className="mf-values">
        <div className="ld-shell">
          <Reveal>
            <h2 className="ld-section-title mf-section-title--center">{t('values-title')}</h2>
            <p className="mf-intro">{t('values-intro')}</p>
          </Reveal>

          <div className="mf-values__list">
            {valueKeys.map((value, index) => {
              const Icon = valueIcons[index]
              return (
                <Reveal key={value.bold} delay={index * 60}>
                  <article className="mf-value-card">
                    <div className="mf-value-card__num">{index + 1}</div>
                    <Icon className="mf-value-card__icon" size={28} strokeWidth={1.75} aria-hidden />
                    <div className="mf-value-card__text">
                      <strong>{t(value.bold)}</strong>
                      <em>{t(value.over)}</em>
                      <span>{t(value.regular)}</span>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={280}>
            <p className="mf-note">{t('values-note')}</p>
          </Reveal>
        </div>
      </section>

      <section id="principles" className="mf-principles">
        <div className="ld-shell">
          <Reveal>
            <h2 className="ld-section-title mf-section-title--center">{t('principles-title')}</h2>
            <p className="mf-intro">{t('principles-intro')}</p>
          </Reveal>

          <div className="mf-principles__grid">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
              const Icon = principleIcons[num - 1]
              return (
                <Reveal key={num} delay={(num % 4) * 50}>
                  <article className="mf-principle-card">
                    <div className="mf-principle-card__num">{num}</div>
                    <Icon className="mf-principle-card__icon" size={22} strokeWidth={1.75} aria-hidden />
                    <p>{t(`principle-${num}` as TranslationKey)}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mf-cta">
        <div className="ld-shell">
          <Reveal>
            <div className="mf-cta__card">
              <h2 className="mf-cta__title">{t('cta-title')}</h2>
              <p className="mf-cta__subtitle" dangerouslySetInnerHTML={{ __html: t('cta-subtitle') }} />
              <div className="mf-cta__actions">
                <a
                  href="/aigileManifesto.pdf"
                  download
                  className="ld-btn ld-btn--outline mf-cta__btn mf-cta__btn--light"
                  onClick={() => logDownload('manifesto_pdf', { source: 'manifesto_page', metadata: { placement: 'cta' } })}
                >
                  <FileText size={17} aria-hidden />
                  {t('cta-download')}
                </a>
                <Link href="/retro" className="ld-btn ld-btn--gold mf-cta__btn">
                  <Rocket size={17} aria-hidden />
                  {t('cta-try-retro')}
                </Link>
                <Link href="/#hero" className="ld-btn ld-btn--outline mf-cta__btn mf-cta__btn--light">
                  {language === 'fr' ? 'Le livre S.A.L.I.M.' : 'The S.A.L.I.M. book'}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="about" className="mf-about">
        <div className="ld-shell mf-about__grid">
          <Reveal className="mf-about__visual">
            <div className="mf-about__photo-wrap">
              <Image
                src="/images/salim-gomri.jpg"
                alt="Salim Gomri"
                width={400}
                height={500}
                className="mf-about__photo"
              />
            </div>
          </Reveal>

          <div className="mf-about__content">
            <Reveal>
              <h2 className="ld-section-title">{t('about-name')}</h2>
              <p className="mf-about__role">{t('about-role')}</p>
              <p className="mf-about__founding">{t('about-founding')}</p>
              <div className="mf-about__bio" dangerouslySetInnerHTML={{ __html: getAboutBioHtml(language) }} />
            </Reveal>

            <Reveal delay={80}>
              <div className="mf-about__panel">
                <h3>{t('about-credentials-title')}</h3>
                <ul>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <li key={num} dangerouslySetInnerHTML={{ __html: t(`about-cred-${num}` as TranslationKey) }} />
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="mf-about__panel">
                <h3>{t('about-contact-title')}</h3>
                <div className="mf-about__links">
                  <a href="https://www.linkedin.com/in/salimgomri/" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={18} aria-hidden />
                    {t('linkedin-profile')}
                  </a>
                  <a href="https://www.linkedin.com/in/salimgomri/recent-activity/articles/" target="_blank" rel="noopener noreferrer">
                    <FileText size={18} aria-hidden />
                    {t('weekly-articles')}
                  </a>
                  <a href="mailto:edition.malis@gmail.com">
                    <Mail size={18} aria-hidden />
                    {t('email-contact')}
                  </a>
                  <a href="https://gomri.coach" target="_blank" rel="noopener noreferrer">
                    <Globe size={18} aria-hidden />
                    {t('website-link')}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="ld-footer">
        <div className="ld-footer__brand">
          <AigileLogo size="md" />
        </div>
        <p>{t('footer-copyright')}</p>
      </footer>
    </div>
  )
}
