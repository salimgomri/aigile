import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import ComingSoonTool from '@/components/feature-flag/ComingSoonTool'
import ToolAccessDenied from '@/components/feature-flag/ToolAccessDenied'
import EarlyAdopterToolBanner from '@/components/feature-flag/EarlyAdopterToolBanner'
import { getFeatureFlag } from '@/lib/feature-flags'
import { canAccessTool, shouldShowComingSoon } from '@/lib/tool-access'
import { getToolCreditPromoGrant } from '@/lib/credits/tool-promo'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skill Matrix | AIgile',
  description: 'Cartographie des compétences agile et technique',
}

export default async function SkillMatrixPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const flag = await getFeatureFlag('skill_matrix')
  if (!flag) notFound()

  const h = await headers()
  const accept = h.get('accept-language') || ''
  const lang = accept.toLowerCase().startsWith('en') ? 'en' : 'fr'

  if (await shouldShowComingSoon('skill_matrix', session?.user?.email, { userId: session?.user?.id })) {
    return (
      <main className="min-h-screen bg-background">
        <PremiumNavbar />
        <ComingSoonTool flag={flag} language={lang} />
        <PremiumFooter />
      </main>
    )
  }

  if (!session?.user) {
    redirect('/login?redirect=' + encodeURIComponent('/skill-matrix'))
  }

  if (!(await canAccessTool('skill_matrix', session.user.email, { userId: session.user.id }))) {
    return <ToolAccessDenied toolLabel={flag.label_fr} language={lang} />
  }

  const creditPromo =
    session.user.email ? await getToolCreditPromoGrant(session.user.email, 'skill_matrix') : null

  return (
    <main className="min-h-screen bg-background">
      <PremiumNavbar />
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        {creditPromo && (
          <EarlyAdopterToolBanner toolLabel={flag.label_fr} language={lang} promo={creditPromo} />
        )}
        <h1 className="text-4xl font-bold text-foreground">{flag.label_fr}</h1>
        <p className="text-muted-foreground">
          {lang === 'fr'
            ? 'Contenu de l’outil — à enrichir (matrice, import équipe, etc.).'
            : 'Tool content — extend here (matrix, team import, etc.).'}
        </p>
      </div>
      <PremiumFooter />
    </main>
  )
}
