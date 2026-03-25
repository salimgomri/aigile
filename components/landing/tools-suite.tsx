/*
 * Tools Suite Section - AIgile Retro Suite
 * - Showcases the complete toolset
 * - Retro AI Tool as flagship
 * - Professional presentation
 * - Links to /retro and start-scrum page
 */

'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '../language-provider'
import { trackEvent } from '@/lib/gtag'
import { translations } from '@/lib/translations'
import type { PublicFeatureFlag } from '@/lib/feature-flags'
import { Brain, Smile, BarChart3, Target, Layout, Users, ArrowRight, Sparkles, Package } from 'lucide-react'
import Link from 'next/link'

type ToolItem = {
  key: string
  icon: typeof Brain
  title: string
  description: string
  featured: boolean
  href: string
  available: boolean
}

export default function ToolsSuiteSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [flags, setFlags] = useState<Record<string, PublicFeatureFlag>>({})

  useEffect(() => {
    fetch('/api/feature-flags')
      .then((r) => r.json())
      .then((d: { flags?: Record<string, PublicFeatureFlag> }) => {
        if (d.flags) setFlags(d.flags)
      })
      .catch(() => {})
  }, [])

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

        {/* Featured Tool - AI Retro — micro-animation + hover */}
        <div className="mb-12 bg-gradient-to-br from-aigile-gold/5 to-aigile-blue/5 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-aigile-gold/20 hover:border-aigile-gold/30 transition-all duration-500 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.15s' }}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-aigile-gold/10 rounded-full border border-aigile-gold/20">
                <Brain className="w-5 h-5 text-aigile-gold" />
                <span className="text-sm font-bold text-aigile-gold uppercase">
                  {language === 'fr' ? 'Outil Phare' : 'Flagship Tool'}
                </span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                {t['tools-retro-title']}
              </h3>
              
              <p className="text-lg text-muted-foreground">
                {t['tools-retro-desc']}
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/retro"
                  onClick={() => trackEvent('try_free_click', { source: 'tools_suite', value: 9.99, currency: 'EUR' })}
                  className="group px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>{t['tools-cta']}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link
                  href="/parcours"
                  className="group/parcours px-6 py-3 bg-transparent text-foreground font-semibold rounded-full border-2 border-border hover:border-aigile-gold hover:bg-aigile-gold/10 hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-2"
                >
                  {language === 'fr' ? 'Découvrir le Parcours' : 'Discover Journey'}
                  <span className="group-hover/parcours:translate-x-0.5 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>

            {/* Mockup/Visual — Apple-style hover */}
            <div className="relative group/mockup">
              <div className="aspect-square bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-border group-hover/mockup:shadow-aigile-gold/20 group-hover/mockup:scale-[1.02] transition-all duration-500">
                {/* Placeholder for AI Retro Tool screenshot/mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-32 h-32 text-aigile-gold/20 group-hover/mockup:scale-110 transition-transform duration-700" />
                </div>
                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-gradient-to-tr from-aigile-gold/10 via-transparent to-aigile-blue/10 opacity-0 group-hover/mockup:opacity-100 transition-opacity duration-500" />
              </div>
              {/* Floating badge — subtle pulse */}
              <div className="absolute -top-4 -right-4 bg-aigile-gold text-black px-6 py-3 rounded-full shadow-xl font-bold animate-pulse-slow">
                {language === 'fr' ? 'Logique Terrain' : 'Field Logic'}
              </div>
            </div>
          </div>
        </div>

        {/* Other Tools Grid — staggered fade-in */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.slice(1).map((tool, index) => {
            const Icon = tool.icon
            const isInteractiveTool =
              tool.key === 'skill_matrix' || tool.key === 'scoring_deliverable'
            const interactive = isInteractiveTool && tool.href !== '#'
            const live = tool.available
            const isScoring = tool.key === 'scoring_deliverable'
            const scoringCardLive =
              'group relative overflow-hidden p-6 rounded-2xl cursor-pointer animate-fade-in-up transition-all duration-300 border border-[#c9973a]/45 bg-gradient-to-br from-[#c9973a]/[0.2] via-[#07111f] to-[#0a0a0f] shadow-[0_16px_48px_-12px_rgba(201,151,58,0.45)] ring-1 ring-[#e8961e]/30 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_95%_65%_at_100%_0%,rgba(232,150,30,0.25),transparent_58%)] hover:border-[#e8961e]/60 hover:shadow-[0_22px_60px_-8px_rgba(201,151,58,0.55)]'
            const scoringCardPreview =
              'group relative overflow-hidden p-6 rounded-2xl cursor-pointer animate-fade-in-up transition-all duration-300 border border-[#c9973a]/40 bg-gradient-to-br from-[#c9973a]/12 via-aigile-blue/5 to-[#0a0a0f] shadow-[0_12px_40px_-10px_rgba(201,151,58,0.35)] ring-1 ring-[#c9973a]/20 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_80%_20%,rgba(232,150,30,0.12),transparent_50%)] hover:border-[#c9973a]/55'

            const cardClass =
              interactive && isScoring
                ? live
                  ? scoringCardLive
                  : scoringCardPreview
                : interactive
                  ? live
                    ? 'group p-6 bg-card/40 backdrop-blur-sm rounded-2xl border border-aigile-gold/25 hover:border-aigile-gold/50 hover:shadow-lg cursor-pointer animate-fade-in-up transition-all duration-300'
                    : 'group p-6 bg-gradient-to-br from-aigile-gold/5 to-aigile-blue/5 backdrop-blur-sm rounded-2xl border border-aigile-gold/30 hover:border-aigile-gold/50 cursor-pointer animate-fade-in-up transition-all duration-300'
                  : 'group p-6 bg-card/20 backdrop-blur-sm rounded-2xl border border-border opacity-60 cursor-not-allowed animate-fade-in-up hover:border-border/80 transition-colors duration-300'

            const inner = (
              <>
                <div className={`flex items-start space-x-4 ${isScoring ? 'relative z-10' : ''}`}>
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

        {/* Bottom CTA - Removed duplicate "Start for Free" */}
      </div>
    </section>
  )
}
