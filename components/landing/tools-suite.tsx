/*
 * Tools Suite Section - AIgile Retro Suite
 * - Showcases the complete toolset
 * - Retro AI Tool as flagship
 * - Professional presentation
 * - Links to /retro and start-scrum page
 */

'use client'

import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { Brain, Smile, BarChart3, Target, Layout, Users, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ToolsSuiteSection() {
  const { language } = useLanguage()
  const t = translations[language]

  const tools = [
    { 
      icon: Brain, 
      title: t['tools-retro-title'], 
      description: t['tools-retro-desc'],
      featured: true,
      href: '/retro'
    },
    { icon: Smile, title: t['tools-nikoni'], description: language === 'fr' ? 'Humeur quotidienne (bientôt)' : 'Daily mood (coming soon)', featured: false, href: '/niko-niko' },
    { icon: BarChart3, title: t['tools-dora'], description: language === 'fr' ? 'Performance élite (bientôt)' : 'Elite performance (coming soon)', featured: false, href: '/dora' },
    { icon: Target, title: t['tools-okr'], description: language === 'fr' ? 'Alignement OKR (bientôt)' : 'OKR alignment (coming soon)', featured: false, href: '/okr' },
    { icon: Layout, title: t['tools-dashboard'], description: language === 'fr' ? 'Santé d\'équipe (bientôt)' : 'Team health (coming soon)', featured: false, href: '/dashboard' },
    { icon: Users, title: t['tools-skills'], description: language === 'fr' ? 'Cartographie compétences (bientôt)' : 'Skills mapping (coming soon)', featured: false, href: '/skill-matrix' },
  ]

  return (
    <section id="tools" className="relative py-24 bg-background">
      {/* Subtle separator */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,rgba(19,142,236,0.1),transparent_60%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-aigile-blue/10 backdrop-blur-sm rounded-full border border-aigile-blue/20 mb-4">
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

        {/* Featured Tool - AI Retro */}
        <div className="mb-12 bg-gradient-to-br from-aigile-gold/5 to-aigile-blue/5 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-aigile-gold/20">
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
                  className="group px-6 py-3 bg-gradient-to-r from-aigile-gold to-aigile-blue text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>{t['tools-cta']}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link
                  href="/parcours"
                  className="px-6 py-3 bg-card/50 backdrop-blur-sm text-foreground font-semibold rounded-full border-2 border-border hover:border-aigile-gold hover:shadow-lg transition-all duration-300 text-center"
                >
                  {language === 'fr' ? 'Découvrir le Parcours' : 'Discover Journey'}
                </Link>
              </div>
            </div>

            {/* Mockup/Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-border">
                {/* Placeholder for AI Retro Tool screenshot/mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-32 h-32 text-aigile-gold/20" />
                </div>
                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-gradient-to-tr from-aigile-gold/10 via-transparent to-aigile-blue/10" />
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-aigile-gold to-aigile-blue text-white px-6 py-3 rounded-full shadow-xl font-bold">
                {language === 'fr' ? 'Logique Terrain' : 'Field Logic'}
              </div>
            </div>
          </div>
        </div>

        {/* Other Tools Grid - NO scale hover */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.slice(1).map((tool, index) => {
            const Icon = tool.icon
            return (
              <div
                key={index}
                className="group p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-border hover:border-aigile-blue hover:shadow-lg hover:shadow-aigile-blue/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-aigile-gold/10 to-aigile-blue/10 rounded-xl">
                    <Icon className="w-6 h-6 text-aigile-blue" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-2">
                      {tool.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    <div className="mt-3 text-sm font-semibold text-aigile-blue group-hover:underline">
                      {language === 'fr' ? 'Bientôt disponible' : 'Coming soon'} →
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA - Removed duplicate "Start for Free" */}
      </div>
    </section>
  )
}
