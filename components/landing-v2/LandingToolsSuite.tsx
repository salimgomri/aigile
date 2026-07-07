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
  Sparkles,
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
  const scoringDesc = sd
    ? (language === 'fr' ? sd.teaser_fr || sd.label_fr : sd.teaser_en || sd.label_en) ||
      t['tools-scoring-desc']
    : t['tools-scoring-desc']

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
          ? 'Cockpit manager — 6 cadrans RAG, vélocité, OKR, narrative P25'
          : 'Manager cockpit — 6 RAG dials, velocity, OKRs, P25 narrative',
      href: '/dashboard-manager',
      available: true,
      interactive: true,
    },
    {
      key: 'westrum',
      icon: HeartPulse,
      title: t['tools-westrum'],
      description:
        language === 'fr'
          ? 'Questionnaire DORA — culture pathologique, bureaucratique ou générative'
          : 'DORA survey — pathological, bureaucratic, or generative culture',
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
      description:
        salimQa
          ? (language === 'fr'
              ? salimQa.teaser_fr || salimQa.label_fr
              : salimQa.teaser_en || salimQa.label_en) || t['tools-salim-qa-desc']
          : t['tools-salim-qa-desc'],
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
          <span className="ld-tools-suite__eyebrow">
            <Sparkles size={14} aria-hidden />
            {language === 'fr' ? 'Suite Professionnelle' : 'Professional Suite'}
          </span>
          <h2>{t['tools-title']}</h2>
          <p>{t['tools-subtitle']}</p>
        </header>

        <div className="ld-tools-suite__flagships">
          <article className="ld-tools-flagship">
            <span className="ld-tools-flagship__tag">
              <Brain size={15} aria-hidden />
              {language === 'fr' ? 'Outil phare' : 'Flagship'}
            </span>
            <h3>{t['tools-retro-title']}</h3>
            <p>{t['tools-retro-desc']}</p>
            <div className="ld-tools-flagship__actions">
              <Link
                href="/retro"
                className="ld-btn ld-btn--gold ld-btn--tool"
                onClick={() => trackEvent('try_free_click', { source: 'landing_home_tools', value: 9.99, currency: 'EUR' })}
              >
                {t['tools-cta']}
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/parcours" className="ld-btn ld-btn--outline ld-btn--tool">
                {language === 'fr' ? 'Parcours' : 'Journey'}
              </Link>
            </div>
          </article>

          <article className="ld-tools-flagship">
            <span className="ld-tools-flagship__tag">
              <Package size={15} aria-hidden />
              {language === 'fr' ? 'Outil phare' : 'Flagship'}
            </span>
            <h3>{scoringTitle}</h3>
            <p>{scoringDesc}</p>
            <div className="ld-tools-flagship__actions ld-tools-flagship__actions--single">
              {scoringDirectCta ? (
                <Link
                  href="/scoring-deliverable"
                  className="ld-btn ld-btn--gold ld-btn--tool"
                  onClick={() => trackEvent('tools_suite_click', { tool: 'scoring_deliverable', cta: 'use_tool', source: 'landing_home' })}
                >
                  {t['tools-scoring-cta-use']}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              ) : scoringAccessLoading ? (
                <div className="ld-tools-flagship__loading" aria-busy aria-label={language === 'fr' ? 'Vérification…' : 'Checking…'} />
              ) : (
                <>
                  {sd?.is_live && scoringInviteOnly && scoringAuthenticated === false ? (
                    <Link
                      href={'/login?redirect=' + encodeURIComponent('/scoring-deliverable')}
                      className="ld-btn ld-btn--outline ld-btn--tool"
                    >
                      {t['tools-scoring-sign-in-invited']}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="ld-btn ld-btn--gold ld-btn--tool"
                    onClick={() => {
                      setEarlyAccessOpen(true)
                      trackEvent('tools_suite_click', { tool: 'scoring_deliverable', action: 'early_access_modal', source: 'landing_home' })
                    }}
                  >
                    {t['tools-scoring-request-access']}
                  </button>
                </>
              )}
            </div>
          </article>
        </div>

        <p className="ld-tools-suite__more-label">
          {language === 'fr' ? 'Autres outils' : 'More tools'}
        </p>

        <div className="ld-tools-suite__grid">
          {moreTools.map((tool) => {
            const Icon = tool.icon
            const card = (
              <div
                className={`ld-tools-card ${tool.interactive ? 'ld-tools-card--live' : 'ld-tools-card--soon'} ${!tool.available && tool.interactive ? 'ld-tools-card--preview' : ''}`}
              >
                <span className="ld-tools-card__icon">
                  <Icon size={20} strokeWidth={2} aria-hidden />
                </span>
                <div className="ld-tools-card__body">
                  <h4>
                    {tool.title}
                    {tool.key === 'dashboard' ? (
                      <DashboardManagerNewBadge language={language === 'fr' ? 'fr' : 'en'} />
                    ) : null}
                    {tool.key === 'westrum' ? <WestrumNewBadge language={language === 'fr' ? 'fr' : 'en'} /> : null}
                  </h4>
                  <p>{tool.description}</p>
                  <span className="ld-tools-card__status">{statusLabel(tool)}</span>
                </div>
              </div>
            )

            if (tool.interactive && tool.href !== '#') {
              return (
                <Link
                  key={tool.key}
                  href={tool.href}
                  className="ld-tools-card-link"
                  onClick={() => trackEvent('tools_suite_click', { tool: tool.key, source: 'landing_home' })}
                >
                  {card}
                </Link>
              )
            }

            return <div key={tool.key}>{card}</div>
          })}
        </div>
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
