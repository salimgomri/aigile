/*
 * Tools Suite Section - AIgile Retro Suite
 * - Showcases the complete toolset
 * - Retro AI Tool as flagship
 * - Professional presentation
 * - Links to /retro and start-scrum page
 */

'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useLanguage } from '../language-provider'
import { trackEvent } from '@/lib/gtag'
import { translations } from '@/lib/translations'
import type { PublicFeatureFlag } from '@/lib/feature-flags'
import { Brain, Smile, BarChart3, Target, Layout, Users, ArrowRight, Sparkles, Package } from 'lucide-react'
import Link from 'next/link'
import { EarlyAccessRequestModal } from '@/components/landing/EarlyAccessRequestModal'
import { useSession } from '@/lib/auth-client'

type ToolItem = {
  key: string
  icon: typeof Brain
  title: string
  description: string
  featured: boolean
  href: string
  available: boolean
}

export default function ToolsSuiteSection({ children }: { children?: ReactNode }) {
  const { language } = useLanguage()
  const t = translations[language]
  const { data: session } = useSession()
  const [flags, setFlags] = useState<Record<string, PublicFeatureFlag>>({})
  /** null = chargement ; true = admin / invité / promo — CTA direct comme accès public */
  const [scoringAccess, setScoringAccess] = useState<boolean | null>(null)
  /** null tant que la requête invite-only n’a pas répondu (pour masquer « Se connecter » si déjà connecté) */
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
    /** Outil ouvert à tous (live + pas invite-only) : pas besoin d’appeler l’API */
    const fullyPublic = sd.is_live === true && !(sd.invite_only ?? true)
    if (fullyPublic) {
      setScoringAccess(null)
      setScoringAuthenticated(null)
      return
    }
    /** Sinon : admin / invité / promo — y compris avant is_live (aperçu admin) */
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
  const skillTitle =
    sm && (language === 'fr' ? sm.label_fr : sm.label_en)
      ? language === 'fr'
        ? sm.label_fr
        : sm.label_en
      : t['tools-skills']
  const skillDesc = sm
    ? (language === 'fr'
        ? sm.teaser_fr || sm.label_fr
        : sm.teaser_en || sm.label_en) ||
      (language === 'fr' ? 'Cartographie compétences' : 'Skills mapping')
    : language === 'fr'
      ? 'Cartographie compétences'
      : 'Skills mapping'

  const sd = flags.scoring_deliverable
  const scoringInviteOnly = sd?.invite_only ?? true
  const scoringFullyPublic = !!(sd?.is_live && !scoringInviteOnly)
  /** Accès public total OU droits explicites (admin, invité, early adopter…) */
  const scoringDirectCta = scoringFullyPublic || scoringAccess === true
  const scoringAccessLoading =
    !!sd && !scoringFullyPublic && scoringAccess === null
  const scoringTitle =
    sd && (language === 'fr' ? sd.label_fr : sd.label_en)
      ? language === 'fr'
        ? sd.label_fr
        : sd.label_en
      : t['tools-scoring-title']
  const scoringDesc = sd
    ? (language === 'fr'
        ? sd.teaser_fr || sd.label_fr
        : sd.teaser_en || sd.label_en) ||
      t['tools-scoring-desc']
    : t['tools-scoring-desc']

  const tools: ToolItem[] = [
    {
      key: 'retro',
      icon: Brain,
      title: t['tools-retro-title'],
      description: t['tools-retro-desc'],
      featured: true,
      href: '/retro',
      available: true,
    },
    {
      key: 'scoring_deliverable',
      icon: Package,
      title: scoringTitle,
      description: scoringDesc,
      featured: false,
      href: '/scoring-deliverable',
      available: !!sd?.is_live,
    },
    {
      key: 'niko',
      icon: Smile,
      title: t['tools-nikoni'],
      description: language === 'fr' ? 'Humeur quotidienne & Happiness Index' : 'Daily mood & Happiness Index',
      featured: false,
      href: '#',
      available: false,
    },
    {
      key: 'dora',
      icon: BarChart3,
      title: t['tools-dora'],
      description: language === 'fr' ? 'Performance élite & métriques DORA' : 'Elite performance & DORA metrics',
      featured: false,
      href: '#',
      available: false,
    },
    {
      key: 'okr',
      icon: Target,
      title: t['tools-okr'],
      description: language === 'fr' ? 'Alignement OKR' : 'OKR alignment',
      featured: false,
      href: '#',
      available: false,
    },
    {
      key: 'dashboard',
      icon: Layout,
      title: t['tools-dashboard'],
      description: language === 'fr' ? "Santé d'équipe & outils" : 'Team health & tools',
      featured: false,
      href: '#',
      available: false,
    },
    {
      key: 'skill_matrix',
      icon: Users,
      title: skillTitle,
      description: skillDesc,
      featured: false,
      href: '/skill-matrix',
      available: !!sm?.is_live,
    },
  ]

  return (
    <section id="tools" className="relative py-24 bg-background">
      {/* Subtle separator (landing style) */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,rgba(19,142,236,0.1),transparent_60%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — micro-animation fade-in */}
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-aigile-blue/10 backdrop-blur-sm rounded-full border border-aigile-blue/20 mb-4 hover:border-aigile-blue/40 transition-colors duration-300">
            <Sparkles className="w-4 h-4 text-aigile-blue" />
            <span className="text-sm font-semibold text-aigile-blue uppercase tracking-wider">
              {language === 'fr' ? 'Suite Professionnelle' : 'Professional Suite'}
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            {t['tools-title']}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t['tools-subtitle']}
          </p>
        </div>

        {/* Deux outils phares — moitié de page chacun (desktop) */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
          {/* Retro */}
          <div className="flex min-h-[min(520px,70vh)] flex-col justify-between rounded-3xl border border-aigile-gold/25 bg-gradient-to-br from-aigile-gold/5 to-aigile-blue/5 p-8 sm:p-10 shadow-xl shadow-black/5 transition-all hover:border-aigile-gold/40">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 rounded-full border border-aigile-gold/25 bg-aigile-gold/10 px-3 py-1">
                <Brain className="h-5 w-5 text-aigile-gold" />
                <span className="text-xs font-bold uppercase tracking-wide text-aigile-gold">
                  {language === 'fr' ? 'Outil phare' : 'Flagship'}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground sm:text-4xl">{t['tools-retro-title']}</h3>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{t['tools-retro-desc']}</p>
              <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card/60 to-muted/40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-28 w-28 text-aigile-gold/25 sm:h-36 sm:w-36" />
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/retro"
                onClick={() => trackEvent('try_free_click', { source: 'tools_suite', value: 9.99, currency: 'EUR' })}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-aigile-gold px-6 py-3 text-center text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-book-orange hover:shadow-lg"
              >
                <span>{t['tools-cta']}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/parcours"
                className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:border-aigile-gold hover:bg-aigile-gold/10"
              >
                {language === 'fr' ? 'Parcours' : 'Journey'}
              </Link>
            </div>
          </div>

          {/* Scoring Deliverable */}
          <div className="flex min-h-[min(520px,70vh)] flex-col justify-between rounded-3xl border border-[#c9973a]/35 bg-gradient-to-br from-[#c9973a]/10 via-aigile-blue/5 to-background p-8 sm:p-10 shadow-xl shadow-[#c9973a]/10 ring-1 ring-[#e8961e]/20 transition-all hover:border-[#e8961e]/50">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 rounded-full border border-[#c9973a]/35 bg-[#c9973a]/10 px-3 py-1">
                <Package className="h-5 w-5 text-[#c9973a]" />
                <span className="text-xs font-bold uppercase tracking-wide text-[#c9973a]">
                  {language === 'fr' ? 'Outil phare' : 'Flagship'}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground sm:text-4xl">{scoringTitle}</h3>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{scoringDesc}</p>
              <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl border border-[#c9973a]/20 bg-gradient-to-br from-[#07111f] to-[#0a0a0f]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-28 w-28 text-[#c9973a]/30 sm:h-36 sm:w-36" />
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {scoringDirectCta ? (
                <Link
                  href="/scoring-deliverable"
                  onClick={() => trackEvent('tools_suite_click', { tool: 'scoring_deliverable', cta: 'use_tool' })}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] hover:from-orange-400 hover:to-orange-500"
                >
                  {t['tools-scoring-cta-use']}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : scoringAccessLoading ? (
                <div
                  className="h-11 w-full animate-pulse rounded-full bg-muted"
                  aria-busy
                  aria-label={language === 'fr' ? 'Vérification de l’accès…' : 'Checking access…'}
                />
              ) : (
                <>
                  {sd?.is_live && scoringInviteOnly && scoringAuthenticated === false ? (
                    <Link
                      href={'/login?redirect=' + encodeURIComponent('/scoring-deliverable')}
                      className="mb-2 block w-full rounded-full border border-border bg-background py-2.5 text-center text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      {t['tools-scoring-sign-in-invited']}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setEarlyAccessOpen(true)
                      trackEvent('tools_suite_click', { tool: 'scoring_deliverable', action: 'early_access_modal' })
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] hover:from-orange-400 hover:to-orange-500"
                  >
                    {t['tools-scoring-request-access']}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {language === 'fr' ? 'Autres outils' : 'More tools'}
        </p>

        {/* Other Tools Grid — staggered fade-in */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools
            .filter((tool) => tool.key !== 'retro' && tool.key !== 'scoring_deliverable')
            .map((tool, index) => {
            const Icon = tool.icon
            const isInteractiveTool = tool.key === 'skill_matrix'
            const interactive = isInteractiveTool && tool.href !== '#'
            const live = tool.available

            const cardClass = interactive
              ? live
                ? 'group p-6 bg-card/40 backdrop-blur-sm rounded-2xl border border-aigile-gold/25 hover:border-aigile-gold/50 hover:shadow-lg cursor-pointer animate-fade-in-up transition-all duration-300'
                : 'group p-6 bg-gradient-to-br from-aigile-gold/5 to-aigile-blue/5 backdrop-blur-sm rounded-2xl border border-aigile-gold/30 hover:border-aigile-gold/50 cursor-pointer animate-fade-in-up transition-all duration-300'
              : 'group p-6 bg-card/20 backdrop-blur-sm rounded-2xl border border-border opacity-60 cursor-not-allowed animate-fade-in-up hover:border-border/80 transition-colors duration-300'

            const inner = (
              <>
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl transition-colors duration-300 ${
                      interactive ? 'bg-aigile-gold/10 group-hover:bg-aigile-gold/20' : 'bg-muted/50 group-hover:bg-muted/70'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${interactive ? 'text-aigile-gold' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-bold mb-2 ${interactive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {tool.title}
                    </h4>
                    <p className={`text-sm ${interactive ? 'text-muted-foreground' : 'text-muted-foreground/80'}`}>
                      {tool.description}
                    </p>
                    <span
                      className={`inline-block mt-3 text-xs font-semibold uppercase tracking-wider ${
                        interactive
                          ? live
                            ? 'text-aigile-gold'
                            : 'text-aigile-gold'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {interactive
                        ? live
                          ? language === 'fr'
                            ? 'Disponible'
                            : 'Available'
                          : language === 'fr'
                            ? 'Bientôt · Aperçu'
                            : 'Coming soon · Preview'
                        : language === 'fr'
                          ? 'Bientôt'
                          : 'Coming soon'}
                    </span>
                  </div>
                </div>
              </>
            )

            return (
              <div
                key={tool.key}
                className={cardClass}
                style={{ animationFillMode: 'forwards', animationDelay: `${0.2 + index * 0.05}s` }}
              >
                {interactive ? (
                  <Link href={tool.href} className="block h-full" onClick={() => trackEvent('tools_suite_click', { tool: tool.key })}>
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </div>
            )
          })}
        </div>

        {children}

        {/* Bottom CTA - Removed duplicate "Start for Free" */}
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
