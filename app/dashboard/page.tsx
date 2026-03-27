'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { useLanguage } from '@/components/language-provider'
import { useCredits } from '@/lib/credits/CreditContext'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import {
  Brain,
  ArrowRight,
  Layout,
  Smile,
  BarChart3,
  Package,
  ClipboardCheck,
  Flag,
  KeyRound,
} from 'lucide-react'

function toolCardClass(active: boolean) {
  return active
    ? 'group flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-aigile-gold/50 hover:shadow-lg transition-all duration-200'
    : 'group flex items-center gap-4 p-6 bg-card/50 border border-border rounded-2xl opacity-60 cursor-not-allowed'
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const { status } = useCredits()
  const router = useRouter()
  const { language } = useLanguage()
  const isAdmin = status?.isAdmin

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login')
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          {language === 'fr' ? 'Chargement...' : 'Loading...'}
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userName = isAdmin ? 'Admin' : (session.user.name || session.user.email?.split('@')[0] || session.user.email)

  return (
    <main className="min-h-screen bg-background">
      <PremiumNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {language === 'fr' ? 'Bonjour' : 'Hello'}, {userName}
        </h1>
        <p className="text-muted-foreground mb-10">
          {language === 'fr'
            ? 'Accédez à vos outils Agile augmentés'
            : 'Access your AI-augmented Agile tools'}
        </p>

        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {language === 'fr' ? 'Outils' : 'Tools'}
        </p>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Link
            href="/retro"
            className="group flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-aigile-gold/50 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-aigile-gold/20 flex items-center justify-center group-hover:bg-aigile-gold/30 transition-colors">
              <Brain className="w-7 h-7 text-aigile-gold" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">
                {language === 'fr' ? 'Outil Rétro IA' : 'AI Retro Tool'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'fr'
                  ? 'Générez des rétrospectives personnalisées'
                  : 'Generate personalized retrospectives'}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-aigile-gold group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/scoring-deliverable"
            className="group flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-aigile-gold/50 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-orange-500/15 flex items-center justify-center group-hover:bg-orange-500/25 transition-colors">
              <ClipboardCheck className="w-7 h-7 text-orange-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">
                {language === 'fr' ? 'Scoring livraison' : 'Delivery Scoring'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'fr'
                  ? 'Évaluez la maturité de vos livrables sur 9 dimensions'
                  : 'Assess deliverable maturity across nine dimensions'}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-aigile-gold group-hover:translate-x-1 transition-all" />
          </Link>

          {isAdmin ? (
            <Link href="/niko-niko" className={toolCardClass(true)}>
              <div className="w-14 h-14 rounded-xl bg-aigile-blue/20 flex items-center justify-center group-hover:bg-aigile-blue/30 transition-colors">
                <Smile className="w-7 h-7 text-aigile-blue" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {language === 'fr' ? 'Niko Niko' : 'Niko Niko'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'fr'
                    ? "Suivez les humeurs de l'équipe"
                    : 'Track team mood and happiness index'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-aigile-gold group-hover:translate-x-1 transition-all" />
            </Link>
          ) : (
            <div className={toolCardClass(false)}>
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <Smile className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-muted-foreground">
                  {language === 'fr' ? 'Niko Niko' : 'Niko Niko'}
                </h2>
                <p className="text-sm text-muted-foreground/80 mt-1">
                  {language === 'fr'
                    ? "Suivez les humeurs de l'équipe"
                    : 'Track team mood and happiness index'}
                </p>
                <span className="inline-block mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {language === 'fr' ? 'Bientôt' : 'Coming soon'}
                </span>
              </div>
            </div>
          )}

          {isAdmin ? (
            <Link href="/dora" className={toolCardClass(true)}>
              <div className="w-14 h-14 rounded-xl bg-aigile-blue/20 flex items-center justify-center group-hover:bg-aigile-blue/30 transition-colors">
                <BarChart3 className="w-7 h-7 text-aigile-blue" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">DORA</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'fr'
                    ? 'Métriques DevOps & recommandations IA'
                    : 'DevOps metrics & AI recommendations'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-aigile-gold group-hover:translate-x-1 transition-all" />
            </Link>
          ) : (
            <div className={toolCardClass(false)}>
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-muted-foreground">DORA</h2>
                <p className="text-sm text-muted-foreground/80 mt-1">
                  {language === 'fr'
                    ? 'Métriques DevOps & recommandations IA'
                    : 'DevOps metrics & AI recommendations'}
                </p>
                <span className="inline-block mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {language === 'fr' ? 'Bientôt' : 'Coming soon'}
                </span>
              </div>
            </div>
          )}

          <div className="group flex items-center gap-4 p-6 bg-card/50 border border-border rounded-2xl opacity-60 cursor-not-allowed md:col-span-2">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
              <Layout className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-muted-foreground">
                {language === 'fr' ? 'Parcours Scrum' : 'Scrum Journey'}
              </h2>
              <p className="text-sm text-muted-foreground/80 mt-1">
                {language === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
              </p>
              <span className="inline-block mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {language === 'fr' ? 'Bientôt' : 'Coming soon'}
              </span>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {language === 'fr' ? 'Administration' : 'Administration'}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <Link
                href="/admin/orders"
                className="group flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-aigile-gold/50 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-xl bg-aigile-gold/20 flex items-center justify-center group-hover:bg-aigile-gold/30 transition-colors">
                  <Package className="w-7 h-7 text-aigile-gold" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {language === 'fr' ? 'Commandes' : 'Orders'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'fr' ? 'Livres, Stripe, expéditions' : 'Books, Stripe, shipping'}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-aigile-gold group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/admin/feature-flags"
                className="group flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-aigile-gold/50 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-xl bg-violet-500/15 flex items-center justify-center group-hover:bg-violet-500/25 transition-colors">
                  <Flag className="w-7 h-7 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">Feature flags</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'fr' ? 'Lancement, invite-only, libellés' : 'Launch dates, invite-only, labels'}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-aigile-gold group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/admin/access"
                className="group flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-aigile-gold/50 hover:shadow-lg transition-all duration-200 md:col-span-2"
              >
                <div className="w-14 h-14 rounded-xl bg-teal-500/15 flex items-center justify-center group-hover:bg-teal-500/25 transition-colors">
                  <KeyRound className="w-7 h-7 text-teal-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {language === 'fr' ? 'Accès & promos' : 'Access & promos'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'fr'
                      ? 'Invitations outils, promos crédits'
                      : 'Tool invites, credit promos'}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-aigile-gold group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </>
        ) : null}
      </div>
      <PremiumFooter />
    </main>
  )
}
