'use client'

import { Fragment, useState } from 'react'
import Image from 'next/image'
import { Download } from 'lucide-react'
import { AigileLogo } from '@/components/brand/AigileLogo'
import { useLanguage } from '@/components/language-provider'
import { trackEvent } from '@/lib/gtag'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { FRAMEWORK_SUB_NAV } from '@/lib/navigation/site-nav'
import {
  CORE_MESSAGE,
  FRAMEWORK_GUIDE_PDF_EN,
  FRAMEWORK_GUIDE_PDF_FR,
  FRAMEWORK_META,
  FRAMEWORK_POSTER_DOWNLOAD_NAME,
  FRAMEWORK_POSTER_IMAGE,
  PHASE_ICONS,
  PHASES,
  ROLE_ICONS,
  ROLES,
  STATE_ICONS,
  STRINGS,
  SUMMARY_CARDS,
  SUMMARY_ICONS,
  WORKFLOW_STATES,
} from '@/lib/framework/framework-data'
import type { FrameworkArticle } from '@/lib/framework/framework-articles'
import { PhaseCard, RoleCard } from './PhaseRoleCards'
import { FrameworkArticlesSection } from './FrameworkArticlesSection'
import { StateDetailPanel } from './StateDetailPanel'
import { SummaryCard } from './SummaryCard'
import { WorkflowConnector, WorkflowNode } from './WorkflowNode'

type FrameworkAppProps = {
  articles: {
    fr: FrameworkArticle[]
    en: FrameworkArticle[]
  }
}

export function FrameworkApp({ articles }: FrameworkAppProps) {
  const { language } = useLanguage()
  const lang = language === 'fr' ? 'fr' : 'en'
  const t = STRINGS[lang]
  const meta = FRAMEWORK_META[lang]
  const [activeId, setActiveId] = useState<string | null>(null)

  const states = WORKFLOW_STATES[lang]
  const active = activeId ? states.find((s) => s.id === activeId) : null
  const mainStates = states.filter((s) => !s.lateral)
  const lateralStates = states.filter((s) => s.lateral)

  return (
    <div className="fw-page ld-page--subnav">
      <SiteChrome
        subNav={{
          contextFr: 'Framework',
          contextEn: 'Framework',
          items: FRAMEWORK_SUB_NAV,
        }}
        buySource="framework_nav"
      />

      <section id="fw-hero" className="fw-hero fw-animate">
        <div className="fw-hero__inner">
          <div className="fw-hero__visual">
            <Image
              src={FRAMEWORK_POSTER_IMAGE}
              alt={lang === 'fr' ? 'Affiche AIgile Framework' : 'AIgile Framework poster'}
              width={1080}
              height={1350}
              priority
              className="fw-hero__poster"
            />
            <a
              href={FRAMEWORK_POSTER_IMAGE}
              download={FRAMEWORK_POSTER_DOWNLOAD_NAME}
              className="fw-btn fw-btn--outline fw-hero__poster-dl"
              onClick={() =>
                trackEvent('framework_poster_download', { source: 'framework_page', lang })
              }
            >
              <Download size={17} strokeWidth={2.2} aria-hidden />
              {t.downloadPoster}
            </a>
          </div>

          <div className="fw-hero__copy">
            <span className="fw-eyebrow">{t.uiEyebrowFramework}</span>
            <p className="fw-hero__meta">{meta.subtitle}</p>
            <h1 className="fw-hero__title">
              <AigileLogo size="hero" className="fw-hero__wordmark" priority />
              <span className="fw-hero__framework">Framework</span>
            </h1>
            <p className="fw-hero__lead">{meta.manifesto}</p>
            <div className="fw-hero__actions">
              <a
                href={FRAMEWORK_GUIDE_PDF_FR}
                download
                className="fw-btn fw-btn--gold"
                onClick={() =>
                  trackEvent('framework_guide_download', { source: 'framework_page', lang: 'fr' })
                }
              >
                <Download size={17} strokeWidth={2.2} aria-hidden />
                {t.downloadGuideFr}
              </a>
              <a
                href={FRAMEWORK_GUIDE_PDF_EN}
                download
                className="fw-btn fw-btn--gold"
                onClick={() =>
                  trackEvent('framework_guide_download', { source: 'framework_page', lang: 'en' })
                }
              >
                <Download size={17} strokeWidth={2.2} aria-hidden />
                {t.downloadGuideEn}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="fw-section">
        <div className="fw-summary-grid">
          {SUMMARY_CARDS[lang].map((c, i) => (
            <SummaryCard key={c.eyebrow} eyebrow={c.eyebrow} title={c.title} index={String(i + 1).padStart(2, '0')} icon={SUMMARY_ICONS[i]}>
              {c.body}
            </SummaryCard>
          ))}
        </div>
      </section>

      <FrameworkArticlesSection articles={articles[lang]} lang={lang} t={t} />

      <section id="fw-cycle" className="fw-cycle">
        <span className="fw-eyebrow">{t.uiEyebrowCycle}</span>
        <h2>{t.uiCycleTitle}</h2>
        <p className="fw-cycle__intro">{t.uiCycleIntro}</p>

        <div className="fw-workflow-rail">
          {mainStates.map((s, i, arr) => (
            <Fragment key={s.id}>
              <WorkflowNode
                state={s}
                index={i}
                active={activeId === s.id}
                onClick={(st) => setActiveId(st.id)}
                icon={STATE_ICONS[s.id]}
                stateLabel={t.uiStateLabel}
                lateralLabel={t.uiLateralExit}
              />
              {i < arr.length - 1 ? <WorkflowConnector /> : null}
            </Fragment>
          ))}
        </div>

        <div className="fw-workflow-lateral">
          <div className="fw-workflow-lateral__dash" aria-hidden />
          <span className="fw-workflow-lateral__label">{t.uiAnytime}</span>
          {lateralStates.map((s) => (
            <WorkflowNode
              key={s.id}
              state={s}
              index={0}
              active={activeId === s.id}
              onClick={(st) => setActiveId(st.id)}
              icon={STATE_ICONS[s.id]}
              stateLabel={t.uiStateLabel}
              lateralLabel={t.uiLateralExit}
            />
          ))}
        </div>
      </section>

      <section id="fw-phases" className="fw-phases">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="fw-eyebrow">{t.uiEyebrowFramework}</span>
        </div>
        <div className="fw-phases__grid">
          <div>
            <span className="fw-eyebrow">{t.uiEyebrowPhases}</span>
            <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'var(--text-h1)', margin: 'var(--space-3) 0 var(--space-4)' }}>
              {t.uiPhasesTitle}
            </h2>
            {PHASES[lang].map((p, i) => (
              <PhaseCard key={p.name} index={String(i + 1).padStart(2, '0')} name={p.name} who={p.who} icon={PHASE_ICONS[i]}>
                {p.body}
              </PhaseCard>
            ))}

            <div className="fw-core-message">
              <span className="fw-eyebrow">{t.uiEyebrowMessage}</span>
              <p>{CORE_MESSAGE[lang]}</p>
            </div>
          </div>

          <div>
            <span className="fw-eyebrow">{t.uiEyebrowRoles}</span>
            <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'var(--text-h1)', margin: 'var(--space-3) 0 var(--space-4)' }}>
              {t.uiRolesTitle}
            </h2>
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {ROLES[lang].map((r, i) => (
                <RoleCard key={r.name} name={r.name} icon={ROLE_ICONS[i]}>
                  {r.body}
                </RoleCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="fw-footer">
        <p>{t.footer}</p>
      </footer>

      {active && (
        <StateDetailPanel state={active} onClose={() => setActiveId(null)} icon={STATE_ICONS[active.id]} t={t} />
      )}
    </div>
  )
}
