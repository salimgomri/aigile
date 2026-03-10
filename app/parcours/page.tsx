'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useLanguage } from '@/components/language-provider'
import LandingNavbar from '@/components/layout/LandingNavbar'
import PremiumFooter from '@/components/landing/premium-footer'
import UpgradeModal from '@/components/UpgradeModal'
import { Sprout, Wrench, BarChart3, Sparkles, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type ProfileId = 'lanceur' | 'stabilisateur' | 'mesureur' | 'augmenteur'

interface Step {
  title: string
  titleEn: string
  chapters: number[]
  tool: { name: string; href: string; isPro: boolean }
  time: string
}

interface Profile {
  id: ProfileId
  icon: typeof Sprout
  title: string
  subtitle: string
  subtitleEn: string
  message: string
  messageEn: string
  steps: Step[]
}

const PROFILES: Profile[] = [
  {
    id: 'lanceur',
    icon: Sprout,
    title: '🌱 Lanceur',
    subtitle: 'Je démarre Scrum dans mon équipe',
    subtitleEn: 'I\'m starting Scrum in my team',
    message: 'Tu as les bases. Commence par mesurer le bien-être dès le premier sprint.',
    messageEn: 'You have the basics. Start by measuring well-being from the first sprint.',
    steps: [
      { title: 'Mesurer le bien-être', titleEn: 'Measure well-being', chapters: [1, 2], tool: { name: 'Niko-Niko', href: '/niko-niko', isPro: false }, time: '~15 min' },
      { title: 'Comprendre les valeurs', titleEn: 'Understand the values', chapters: [3], tool: { name: 'Manifesto', href: '/manifesto', isPro: false }, time: '~15 min' },
      { title: 'Première rétro', titleEn: 'First retro', chapters: [2, 3], tool: { name: 'Rétro IA', href: '/retro', isPro: false }, time: '~20 min' },
      { title: 'Consolider les bases', titleEn: 'Consolidate basics', chapters: [3], tool: { name: 'Rétro IA', href: '/retro', isPro: false }, time: '~15 min' },
    ],
  },
  {
    id: 'stabilisateur',
    icon: Wrench,
    title: '🔧 Stabilisateur',
    subtitle: 'Mon équipe pratique Scrum mais les cérémoniels sont dysfonctionnels',
    subtitleEn: 'My team practices Scrum but ceremonies are dysfunctional',
    message: '9 patterns de dysfonction identifiés. Lance une Rétro IA pour diagnostiquer.',
    messageEn: '9 dysfunction patterns identified. Launch an AI Retro to diagnose.',
    steps: [
      { title: 'Diagnostiquer les dysfonctions', titleEn: 'Diagnose dysfunctions', chapters: [4, 5], tool: { name: 'Rétro IA', href: '/retro', isPro: false }, time: '~20 min' },
      { title: 'Patterns de cérémoniels', titleEn: 'Ceremony patterns', chapters: [6], tool: { name: 'Prompt Library P1-P3', href: '/prompts', isPro: true }, time: '~15 min' },
      { title: 'Corriger les anti-patterns', titleEn: 'Fix anti-patterns', chapters: [11], tool: { name: 'Prompt Library P4-P6', href: '/prompts', isPro: true }, time: '~15 min' },
      { title: 'Animer une rétro ciblée', titleEn: 'Run a targeted retro', chapters: [5, 6], tool: { name: 'Rétro IA', href: '/retro', isPro: false }, time: '~20 min' },
    ],
  },
  {
    id: 'mesureur',
    icon: BarChart3,
    title: '📊 Mesureur',
    subtitle: 'Je veux des métriques qui parlent à mon management',
    subtitleEn: 'I want metrics that speak to my management',
    message: 'Vélocité, DORA, Happiness Index, OKR — 4 métriques qui racontent une histoire.',
    messageEn: 'Velocity, DORA, Happiness Index, OKR — 4 metrics that tell a story.',
    steps: [
      { title: 'Happiness Index', titleEn: 'Happiness Index', chapters: [7], tool: { name: 'Niko-Niko', href: '/niko-niko', isPro: false }, time: '~15 min' },
      { title: 'Métriques DORA', titleEn: 'DORA metrics', chapters: [8], tool: { name: 'DORA', href: '/dora', isPro: true }, time: '~20 min' },
      { title: 'Alignement OKR', titleEn: 'OKR alignment', chapters: [12], tool: { name: 'OKR', href: '/okr', isPro: true }, time: '~15 min' },
      { title: 'Dashboard équipe', titleEn: 'Team dashboard', chapters: [13], tool: { name: 'Dashboard', href: '/dashboard', isPro: false }, time: '~15 min' },
    ],
  },
  {
    id: 'augmenteur',
    icon: Sparkles,
    title: '🤖 Augmenteur',
    subtitle: 'Je veux intégrer l\'IA dans mes pratiques agiles',
    subtitleEn: 'I want to integrate AI into my agile practices',
    message: 'L\'AIgile Manifesto comme boussole. L\'IA révèle les patterns invisibles à l\'œil humain.',
    messageEn: 'The AIgile Manifesto as compass. AI reveals patterns invisible to the human eye.',
    steps: [
      { title: 'Manifesto AIgile', titleEn: 'AIgile Manifesto', chapters: [9, 10], tool: { name: 'Manifesto', href: '/manifesto', isPro: false }, time: '~15 min' },
      { title: 'Patterns IA', titleEn: 'AI patterns', chapters: [11], tool: { name: 'Prompt Library complète', href: '/prompts', isPro: true }, time: '~20 min' },
      { title: 'Rétro augmentée', titleEn: 'Augmented retro', chapters: [10, 11], tool: { name: 'Rétro IA', href: '/retro', isPro: false }, time: '~20 min' },
      { title: 'Tous les outils', titleEn: 'All tools', chapters: [16], tool: { name: 'Suite complète', href: '/dashboard', isPro: true }, time: '~30 min' },
    ],
  },
]

function ToolButton({
  tool,
  isLoggedIn,
  onProClick,
}: {
  tool: Step['tool']
  isLoggedIn: boolean
  onProClick: () => void
}) {
  const { language } = useLanguage()
  const router = useRouter()

  const handleClick = () => {
    if (tool.isPro) {
      onProClick()
      return
    }
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(tool.href)}`)
      return
    }
    router.push(tool.href)
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-aigile-gold/10 hover:bg-aigile-gold/20 border border-aigile-gold/30 text-aigile-gold font-medium transition-colors"
    >
      {tool.isPro && <Lock className="w-4 h-4" />}
      {tool.name}
      <ArrowRight className="w-4 h-4" />
    </button>
  )
}

export default function ParcoursPage() {
  const { data: session } = useSession()
  const { language } = useLanguage()
  const [selectedProfile, setSelectedProfile] = useState<ProfileId | null>(null)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [upgradeToolName, setUpgradeToolName] = useState('')

  const profile = selectedProfile ? PROFILES.find((p) => p.id === selectedProfile) : null

  const handleProToolClick = (toolName: string) => {
    setUpgradeToolName(toolName)
    setUpgradeModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {language === 'fr' ? 'Choisis ton parcours' : 'Choose your journey'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Identifie ton profil et découvre les chapitres et outils adaptés à ta situation.'
              : 'Identify your profile and discover the chapters and tools suited to your situation.'}
          </p>
        </div>

        {/* 4 Profile Cards - 2x2 grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {PROFILES.map((p) => {
            const Icon = p.icon
            const isSelected = selectedProfile === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p.id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-aigile-gold bg-aigile-navy/30 dark:bg-aigile-navy/20'
                    : 'border-border bg-card hover:border-aigile-gold/50 hover:bg-card/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-aigile-gold/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-aigile-gold" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{p.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'fr' ? p.subtitle : p.subtitleEn}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected profile: message + steps */}
        {profile && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-aigile-gold/5 border border-aigile-gold/20">
              <p className="text-lg text-foreground font-medium">
                {language === 'fr' ? profile.message : profile.messageEn}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8">
                {language === 'fr' ? 'Ton parcours en 4 étapes' : 'Your journey in 4 steps'}
              </h3>
              <div className="space-y-8">
                {profile.steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-2xl bg-card border border-border"
                  >
                    <div className="flex items-center gap-4 sm:w-64 flex-shrink-0">
                      <span className="w-10 h-10 rounded-full bg-aigile-gold text-black font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {language === 'fr' ? step.title : step.titleEn}
                        </h4>
                        <span className="text-sm text-muted-foreground">{step.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      {step.chapters.map((ch) => (
                        <span
                          key={ch}
                          className="px-3 py-1 rounded-full bg-aigile-blue/10 text-aigile-blue text-sm font-medium"
                        >
                          Ch. {ch}
                        </span>
                      ))}
                      <ToolButton
                        tool={step.tool}
                        isLoggedIn={!!session}
                        onProClick={() => handleProToolClick(step.tool.name)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-aigile-gold/10 to-aigile-blue/10 border border-aigile-gold/20 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {language === 'fr' ? 'Prêt à passer à l\'action ?' : 'Ready to take action?'}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <span
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-muted/60 text-muted-foreground rounded-full font-semibold cursor-not-allowed border border-border"
              aria-disabled="true"
            >
              {language === 'fr' ? 'Très bientôt…' : 'Coming soon…'}
              <Sparkles className="w-5 h-5 opacity-70" />
            </span>
            <Link
              href="/#book"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-aigile-gold/50 rounded-full font-semibold hover:border-aigile-gold hover:bg-aigile-gold/10 transition-all"
            >
              {language === 'fr' ? 'Voir le livre' : 'View the Book'}
            </Link>
          </div>
        </div>
      </div>
      <PremiumFooter />
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        toolName={upgradeToolName}
      />
    </main>
  )
}
