'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  Brain,
  ClipboardCheck,
  Flag,
  KeyRound,
  Layout,
  LayoutDashboard,
  Package,
  RefreshCw,
  Smile,
  Target,
  Users,
} from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { useLanguage } from '@/components/language-provider'
import { useCredits } from '@/lib/credits/CreditContext'
import { AdminIntelligenceToolCard } from '@/components/admin/admin-intelligence-tool-card'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { DashboardToolTile } from '@/components/dashboard/DashboardToolTile'
import { DashboardManagerNewBadge } from '@/components/tools/DashboardManagerNewBadge'
import { translations } from '@/lib/translations'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const { status } = useCredits()
  const router = useRouter()
  const { language } = useLanguage()
  const t = translations[language]
  const isAdmin = status?.isAdmin
  const fr = language === 'fr'

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login')
    }
  }, [session, isPending, router])

  if (isPending) {
    return <div className="db-hub__loading">{fr ? 'Chargement…' : 'Loading…'}</div>
  }

  if (!session) {
    return null
  }

  const userName = isAdmin ? 'Admin' : session.user.name || session.user.email?.split('@')[0] || session.user.email
  const openLabel = fr ? 'Ouvrir' : 'Open'
  const soonLabel = fr ? 'Bientôt' : 'Coming soon'

  return (
    <div className="ld-page db-hub">
      <SiteChrome buySource="dashboard_nav" />

      <div className="ld-shell db-hub__main">
        <header className="db-hub__hero">
          <span className="ld-kicker">{fr ? 'Espace membre' : 'Member space'}</span>
          <h1>
            {fr ? 'Bonjour' : 'Hello'}, {userName}
          </h1>
          <p>{fr ? 'Accédez à vos outils Agile augmentés.' : 'Access your AI-augmented Agile tools.'}</p>
        </header>

        <section className="db-hub__section" aria-labelledby="db-tools-title">
          <div className="db-hub__section-head">
            <h2 id="db-tools-title" className="db-hub__section-title">
              {fr ? 'Outils' : 'Tools'}
            </h2>
          </div>

          <div className="db-hub__grid">
            <DashboardToolTile
              href="/retro"
              icon={Brain}
              title={fr ? 'Outil Rétro IA' : 'AI Retro Tool'}
              description={
                fr ? 'Générez des rétrospectives personnalisées à partir de 146 activités Retromat.' : 'Generate personalized retros from 146 Retromat activities.'
              }
              ctaLabel={openLabel}
            />

            <DashboardToolTile
              href="/dashboard-manager"
              icon={LayoutDashboard}
              title={
                <>
                  Dashboard Manager
                  <DashboardManagerNewBadge language={fr ? 'fr' : 'en'} />
                </>
              }
              description={
                fr
                  ? 'Cockpit sprint S.A.L.I.M. · 6 cadrans RAG, OKR, narrative IA'
                  : 'S.A.L.I.M. sprint cockpit · 6 RAG dials, OKRs, AI narrative'
              }
              ctaLabel={openLabel}
              wide
            />

            <DashboardToolTile
              href="/scoring-deliverable"
              icon={ClipboardCheck}
              title={fr ? 'Scoring livraison' : 'Delivery Scoring'}
              description={
                fr ? 'Évaluez la maturité de vos livrables sur 9 dimensions.' : 'Assess deliverable maturity across nine dimensions.'
              }
              ctaLabel={openLabel}
            />

            <DashboardToolTile
              href="/salim-qa"
              icon={BookOpen}
              title="S.A.L.I.M. Q&A Lab"
              description={t['tools-salim-qa-desc']}
              ctaLabel={openLabel}
            />

            <DashboardToolTile
              href="/dashboard/westrum"
              icon={Users}
              title="Westrum Culture Survey"
              description={
                fr ? 'Culture organisationnelle DORA · 6 questions Likert' : 'DORA organizational culture · 6 Likert questions'
              }
              ctaLabel={openLabel}
            />

            <DashboardToolTile
              href="/okr-checkin"
              icon={Target}
              title={fr ? 'OKR Check-in Sprint' : 'OKR Sprint Check-in'}
              description={
                fr ? 'Avancé, frein, ajustement · rituel de Sprint Review' : 'Advance, blocker, adjustment · Sprint Review ritual'
              }
              ctaLabel={openLabel}
            />

            {isAdmin ? (
              <DashboardToolTile
                href="/niko-niko"
                icon={Smile}
                title="Niko Niko"
                description={fr ? "Suivez les humeurs de l'équipe." : 'Track team mood and happiness index.'}
                ctaLabel={openLabel}
              />
            ) : (
              <DashboardToolTile
                icon={Smile}
                title="Niko Niko"
                description={fr ? "Suivez les humeurs de l'équipe." : 'Track team mood and happiness index.'}
                ctaLabel={openLabel}
                soonLabel={soonLabel}
                disabled
              />
            )}

            {isAdmin ? (
              <DashboardToolTile
                href="/dora"
                icon={BarChart3}
                title="DORA"
                description={fr ? 'Métriques DevOps et recommandations IA.' : 'DevOps metrics and AI recommendations.'}
                ctaLabel={openLabel}
              />
            ) : (
              <DashboardToolTile
                icon={BarChart3}
                title="DORA"
                description={fr ? 'Métriques DevOps et recommandations IA.' : 'DevOps metrics and AI recommendations.'}
                ctaLabel={openLabel}
                soonLabel={soonLabel}
                disabled
              />
            )}

            <DashboardToolTile
              icon={Layout}
              title={fr ? 'Parcours Scrum' : 'Scrum Journey'}
              description={fr ? 'Parcours guidé à travers la suite AIgile.' : 'Guided journey through the AIgile suite.'}
              ctaLabel={openLabel}
              soonLabel={soonLabel}
              disabled
              wide
            />
          </div>
        </section>

        {isAdmin ? (
          <section className="db-hub__section" aria-labelledby="db-admin-title">
            <div className="db-hub__section-head">
              <h2 id="db-admin-title" className="db-hub__section-title">
                {fr ? 'Administration' : 'Administration'}
              </h2>
              <p className="db-hub__section-note">
                {fr ? 'Raccourcis admin · même session' : 'Admin shortcuts · same session'}
              </p>
            </div>

            <div className="db-hub__grid db-hub__grid--admin">
              <DashboardToolTile
                href="/admin/orders"
                icon={Package}
                title={fr ? 'Commandes' : 'Orders'}
                description={fr ? 'Livres, Stripe, expéditions' : 'Books, Stripe, shipping'}
                ctaLabel={openLabel}
              />

              <AdminIntelligenceToolCard layout="hub" />

              <DashboardToolTile
                href="/admin/feature-flags"
                icon={Flag}
                title="Feature flags"
                description={fr ? 'Lancement, invite-only, libellés' : 'Launch dates, invite-only, labels'}
                ctaLabel={openLabel}
              />

              <DashboardToolTile
                href="/admin/access"
                icon={KeyRound}
                title={fr ? 'Accès & promos' : 'Access & promos'}
                description={fr ? 'Invitations outils, promos crédits' : 'Tool invites, credit promos'}
                ctaLabel={openLabel}
              />

              <DashboardToolTile
                href="/admin/stripe-sync"
                icon={RefreshCw}
                title={fr ? 'Sync Stripe' : 'Stripe sync'}
                description={
                  fr
                    ? 'Importer les paiements Stripe vers les commandes'
                    : 'Backfill Stripe payments into orders'
                }
                ctaLabel={openLabel}
                wide
              />
            </div>
          </section>
        ) : null}
      </div>

      <footer className="ld-footer">
        <div className="ld-footer__brand">
          <span className="ld-logo__mark">A</span>
          <span className="ld-logo__text">AIGILE.LU</span>
        </div>
        <p>{fr ? '© 2026 AIGILE.LU · Malis Edition' : '© 2026 AIGILE.LU · Malis Edition'}</p>
      </footer>
    </div>
  )
}
