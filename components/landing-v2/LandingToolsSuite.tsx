'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  HeartPulse,
  Layout,
  Package,
  Smile,
  Target,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { EarlyAccessRequestModal } from '@/components/landing/EarlyAccessRequestModal'
import { DashboardManagerNewBadge } from '@/components/tools/DashboardManagerNewBadge'
import { WestrumNewBadge } from '@/components/tools/WestrumNewBadge'
import type { PublicFeatureFlag } from '@/lib/feature-flags'
import { trackEvent } from '@/lib/gtag'
import { translations } from '@/lib/translations'
import { useSession } from '@/lib/auth-client'

type ToolItem = {
  key: string
  icon: typeof Brain
  title: string
  description: string
  href: string
  available: boolean
  interactive: boolean
  wide?: boolean
}

export function LandingToolsSuite() {
  const { language } = useLanguage()
  const t = translations[language]
  const { data: session } = useSession()
  const [flags, setFlags] = useState<Record<string, PublicFeatureFlag>>({})
  const [scoringAccess, setScoringAccess] = useState<boolean | null>(null)
  const [scoringAuthenticated, setScoringAuthenticated] = useState<boolean | null>(null)
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false)

  useEffect(() => {
    fetch('/api/feature-flags')
      .then((r) => r.json())
      .then((d: { flags?: Record<string, PublicFeatureFlag> }) => {
        if (d.flags) setFlags(d.flags)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const sd = flags.scoring_deliverable
    if (!sd) {
      setScoringAccess(null)
      setScoringAuthenticated(null)
      return
    }
    const fullyPublic = sd.is_live === true && !(sd.invite_only ?? true)
    if (fullyPublic) {
      setScoringAccess(null)
      setScoringAuthenticated(null)
      return
    }
    let cancelled = false
    fetch('/api/tool-access?slug=scoring_deliverable', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d: { authenticated?: boolean; canAccess?: boolean }) => {
        if (cancelled) return
        setScoringAuthenticated(!!d.authenticated)
        setScoringAccess(!!d.canAccess)
      })
      .catch(() => {
        if (cancelled) return
        setScoringAuthenticated(false)
        setScoringAccess(false)
      })
    return () => {
      cancelled = true
    }
  }, [flags, session?.user?.id])

  const sm = flags.skill_matrix
  const westrum = flags.westrum
  const salimQa = flags.salim_qa
  const sd = flags.scoring_deliverable

  const scoringInviteOnly = sd?.invite_only ?? true
  const scoringFullyPublic = !!(sd?.is_live && !scoringInviteOnly)
  const scoringDirectCta = scoringFullyPublic || scoringAccess === true
  const scoringAccessLoading = !!sd && !scoringFullyPublic && scoringAccess === null

  const scoringTitle =
    sd && (language === 'fr' ? sd.label_fr : sd.label_en)
      ? language === 'fr'
        ? sd.label_fr
        : sd.label_en
      : t['tools-scoring-title']
  const scoringDesc = (() => {
    const raw = sd
      ? (language === 'fr' ? sd.teaser_fr || sd.label_fr : sd.teaser_en || sd.label_en) || t['tools-scoring-desc']
      : t['tools-scoring-desc']
    return raw.replace(/\s*—\s*/g, ' · ').replace(/\s*–\s*/g, ' · ')
  })()

  const skillTitle =
    sm && (language === 'fr' ? sm.label_fr : sm.label_en)
      ? language === 'fr'
        ? sm.label_fr
        : sm.label_en
      : t['tools-skills']
  const skillDesc = sm
    ? (language === 'fr' ? sm.teaser_fr || sm.label_fr : sm.teaser_en || sm.label_en) ||
      (language === 'fr' ? 'Cartographie compétences' : 'Skills mapping')
    : language === 'fr'
      ? 'Cartographie compétences'
      : 'Skills mapping'

  const moreTools: ToolItem[] = [
    {
      key: 'dashboard',
      icon: Layout,
      title: t['tools-dashboard-manager'],
      description:
        language === 'fr'
          ? 'Cockpit manager · 6 cadrans RAG, vélocité, OKR, narrative P25'
          : 'Manager cockpit · 6 RAG dials, velocity, OKRs, P25 narrative',
      href: '/dashboard-manager',
      available: true,
      interactive: true,
      wide: true,
    },
    {
      key: 'westrum',
      icon: HeartPulse,
      title: t['tools-westrum'],
      description:
        language === 'fr'
          ? 'Questionnaire DORA · culture pathologique, bureaucratique ou générative'
          : 'DORA survey · pathological, bureaucratic, or generative culture',
      href: '/dashboard/westrum',
      available: westrum?.is_live ?? true,
      interactive: true,
    },
    {
      key: 'salim_qa',
      icon: BookOpen,
      title:
        salimQa && (language === 'fr' ? salimQa.label_fr : salimQa.label_en)
          ? language === 'fr'
            ? salimQa.label_fr
            : salimQa.label_en
          : t['tools-salim-qa'],
      description: t['tools-salim-qa-desc'],
      href: '/salim-qa',
      available: salimQa?.is_live ?? true,
      interactive: true,
    },
    {
      key: 'skill_matrix',
      icon: Users,
      title: skillTitle,
      description: skillDesc,
      href: '/skill-matrix',
      available: !!sm?.is_live,
      interactive: true,
    },
    {
      key: 'niko',
      icon: Smile,
      title: t['tools-nikoni'],
      description: language === 'fr' ? 'Humeur quotidienne & Happiness Index' : 'Daily mood & Happiness Index',
      href: '#',
      available: false,
      interactive: false,
    },
    {
      key: 'dora',
      icon: BarChart3,
      title: t['tools-dora'],
      description: language === 'fr' ? 'Performance élite & métriques DORA' : 'Elite performance & DORA metrics',
      href: '#',
      available: false,
      interactive: false,
    },
    {
      key: 'okr',
      icon: Target,
      title: t['tools-okr'],
      description: language === 'fr' ? 'Alignement OKR' : 'OKR alignment',
      href: '#',
      available: false,
      interactive: false,
    },
  ].sort((a, b) => Number(b.available) - Number(a.available))

  const liveTools = moreTools.filter((tool) => tool.available && tool.interactive)
  const roadmapTools = moreTools.filter((tool) => !tool.available || !tool.interactive)

  const statusLabel = (tool: ToolItem) => {
    if (!tool.interactive) {
      return language === 'fr' ? 'Bientôt' : 'Coming soon'
    }
    if (tool.available) {
      return language === 'fr' ? 'Disponible' : 'Available'
    }
    return language === 'fr' ? 'Bientôt · Aperçu' : 'Coming soon · Preview'
  }

  return (
    <section id="tools" className="ld-tools-suite">
      <div className="ld-shell">
        <header className="ld-tools-suite__head">
          <span className="ld-kicker">{language === 'fr' ? 'Suite professionnelle' : 'Professional suite'}</span>
          <h2 className="ld-section-title ld-tools-suite__title">{t['tools-title']}</h2>
          <p className="ld-tools-suite__lead">{t['tools-subtitle']}</p>
        </header>

        <div className="ld-tools-suite__flagships">
          <Link
            href="/retro"
            className="ld-tools-feature ld-tools-feature--retro ld-tools-feature--link"
            onClick={() => trackEvent('try_free_click', { source: 'landing_home_tools', value: 9.99, currency: 'EUR' })}
          >
            <div className="ld-tools-feature__head">
              <span className="ld-tools-feature__index" aria-hidden>
                01
              </span>
              <span className="ld-tools-feature__icon" aria-hidden>
                <Brain size={22} strokeWidth={1.75} />
              </span>
            </div>
            <h3>{t['tools-retro-title']}</h3>
            <p>{t['tools-retro-desc']}</p>
            <span className="ld-tools-tile__cta">
              {t['tools-cta']}
              <ArrowRight size={14} aria-hidden />
            </span>
          </Link>

          {scoringDirectCta ? (
            <Link
              href="/scoring-deliverable"
              className="ld-tools-feature ld-tools-feature--scoring ld-tools-feature--link"
              onClick={() => trackEvent('tools_suite_click', { tool: 'scoring_deliverable', cta: 'use_tool', source: 'landing_home' })}
            >
              <div className="ld-tools-feature__head">
                <span className="ld-tools-feature__index" aria-hidden>
                  02
                </span>
                <span className="ld-tools-feature__icon" aria-hidden>
                  <Package size={22} strokeWidth={1.75} />
                </span>
              </div>
              <h3>{scoringTitle}</h3>
              <p>{scoringDesc}</p>
              <span className="ld-tools-tile__cta">
                {t['tools-scoring-cta-use']}
                <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
          ) : scoringAccessLoading ? (
            <div className="ld-tools-feature ld-tools-feature--scoring" aria-busy aria-label={language === 'fr' ? 'Vérification…' : 'Checking…'}>
              <div className="ld-tools-feature__head">
                <span className="ld-tools-feature__index" aria-hidden>
                  02
                </span>
                <span className="ld-tools-feature__icon" aria-hidden>
                  <Package size={22} strokeWidth={1.75} />
                </span>
              </div>
              <h3>{scoringTitle}</h3>
              <p>{scoringDesc}</p>
              <div className="ld-tools-feature__loading" />
            </div>
          ) : sd?.is_live && scoringInviteOnly && scoringAuthenticated === false ? (
            <Link
              href={'/login?redirect=' + encodeURIComponent('/scoring-deliverable')}
              className="ld-tools-feature ld-tools-feature--scoring ld-tools-feature--link"
            >
              <div className="ld-tools-feature__head">
                <span className="ld-tools-feature__index" aria-hidden>
                  02
                </span>
                <span className="ld-tools-feature__icon" aria-hidden>
                  <Package size={22} strokeWidth={1.75} />
                </span>
              </div>
              <h3>{scoringTitle}</h3>
              <p>{scoringDesc}</p>
              <span className="ld-tools-tile__cta">
                {t['tools-scoring-sign-in-invited']}
                <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
          ) : (
            <div
              className="ld-tools-feature ld-tools-feature--scoring ld-tools-feature--link ld-tools-feature--interactive"
              role="button"
              tabIndex={0}
              onClick={() => {
                setEarlyAccessOpen(true)
                trackEvent('tools_suite_click', { tool: 'scoring_deliverable', action: 'early_access_modal', source: 'landing_home' })
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setEarlyAccessOpen(true)
                  trackEvent('tools_suite_click', { tool: 'scoring_deliverable', action: 'early_access_modal', source: 'landing_home' })
                }
              }}
            >
              <div className="ld-tools-feature__head">
                <span className="ld-tools-feature__index" aria-hidden>
                  02
                </span>
                <span className="ld-tools-feature__icon" aria-hidden>
                  <Package size={22} strokeWidth={1.75} />
                </span>
              </div>
              <h3>{scoringTitle}</h3>
              <p>{scoringDesc}</p>
              <span className="ld-tools-tile__cta">
                {t['tools-scoring-request-access']}
                <ArrowRight size={14} aria-hidden />
              </span>
            </div>
          )}
        </div>

        <div className="ld-tools-tiles">
            {liveTools.map((tool) => {
              const Icon = tool.icon
              const inner = (
                <>
                  <div className="ld-tools-tile__top">
                    <span className="ld-tools-tile__icon">
                      <Icon size={20} strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="ld-tools-tile__live" aria-hidden />
                  </div>
                  <h4>
                    {tool.title}
                    {tool.key === 'dashboard' ? (
                      <DashboardManagerNewBadge language={language === 'fr' ? 'fr' : 'en'} />
                    ) : null}
                    {tool.key === 'westrum' ? <WestrumNewBadge language={language === 'fr' ? 'fr' : 'en'} /> : null}
                  </h4>
                  <p>{tool.description}</p>
                  <span className="ld-tools-tile__cta">
                    {language === 'fr' ? 'Ouvrir' : 'Open'}
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </>
              )

              return (
                <Link
                  key={tool.key}
                  href={tool.href}
                  className={`ld-tools-tile${tool.wide ? ' ld-tools-tile--wide' : ''}`}
                  onClick={() => trackEvent('tools_suite_click', { tool: tool.key, source: 'landing_home' })}
                >
                  {inner}
                </Link>
              )
            })}
          </div>

        {roadmapTools.length > 0 ? (
          <div className="ld-tools-suite__roadmap">
            <div className="ld-tools-suite__catalog-head">
              <h3 className="ld-tools-suite__catalog-title">
                {language === 'fr' ? 'En préparation' : 'On the roadmap'}
              </h3>
            </div>
            <div className="ld-tools-roadmap">
              {roadmapTools.map((tool) => {
                const Icon = tool.icon
                const content = (
                  <>
                    <span className="ld-tools-roadmap__icon" aria-hidden>
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <div>
                      <strong>{tool.title}</strong>
                      <span>{tool.description}</span>
                    </div>
                    <em>{statusLabel(tool)}</em>
                  </>
                )

                if (tool.interactive && tool.href !== '#') {
                  return (
                    <Link
                      key={tool.key}
                      href={tool.href}
                      className="ld-tools-roadmap__item ld-tools-roadmap__item--link"
                      onClick={() => trackEvent('tools_suite_click', { tool: tool.key, source: 'landing_home' })}
                    >
                      {content}
                    </Link>
                  )
                }

                return (
                  <div key={tool.key} className="ld-tools-roadmap__item">
                    {content}
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      <EarlyAccessRequestModal
        open={earlyAccessOpen}
        onClose={() => setEarlyAccessOpen(false)}
        language={language}
        toolSlug="scoring_deliverable"
      />
    </section>
  )
}
