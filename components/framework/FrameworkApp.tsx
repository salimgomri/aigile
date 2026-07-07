'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { trackEvent } from '@/lib/gtag'
import {
  CORE_MESSAGE,
  FRAMEWORK_GUIDE_PDF,
  FRAMEWORK_META,
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
import { PhaseCard, RoleCard } from './PhaseRoleCards'
import { StateDetailPanel } from './StateDetailPanel'
import { SummaryCard } from './SummaryCard'
import { WorkflowConnector, WorkflowNode } from './WorkflowNode'

function FrameworkHeader({ subtitle }: { subtitle: string }) {
  const { language, setLanguage } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fw-header ${scrolled ? 'fw-header--scrolled' : ''}`}>
      <Link href="/" className="fw-header__brand">
        <span className="fw-header__mark">A</span>
        <span className="fw-header__name">AIGILE</span>
      </Link>
      <span className="fw-header__sub">{subtitle}</span>
      <div className="ld-lang" role="group" aria-label="Language">
        <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')}>
          EN
        </button>
        <button type="button" className={language === 'fr' ? 'is-active' : ''} onClick={() => setLanguage('fr')}>
          FR
        </button>
      </div>
    </header>
  )
}

export function FrameworkApp() {
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
    <div className="fw-page">
      <FrameworkHeader subtitle={meta.subtitle} />

      <section className="fw-hero fw-animate">
        <span className="fw-eyebrow">{t.uiEyebrowFramework}</span>
        <h1>
          <span className="fw-hero__gold">The AIgile</span>
          <br />
          Framework
        </h1>
        <p className="fw-hero__lead">{meta.manifesto}</p>
        <div className="fw-hero__actions">
          <a
            href={FRAMEWORK_GUIDE_PDF}
            download
            className="fw-btn fw-btn--gold"
            onClick={() => trackEvent('framework_guide_download', { source: 'framework_page' })}
          >
            <Download size={17} strokeWidth={2.2} aria-hidden />
            {t.downloadGuide}
          </a>
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

      <section className="fw-cycle">
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

      <section className="fw-phases">
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
