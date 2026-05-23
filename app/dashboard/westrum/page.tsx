import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import ComingSoonTool from '@/components/feature-flag/ComingSoonTool'
import ToolAccessDenied from '@/components/feature-flag/ToolAccessDenied'
import { WestrumSurvey } from './components/WestrumSurvey'
import { auth } from '@/lib/auth'
import { getFeatureFlag } from '@/lib/feature-flags'
import { canAccessTool, shouldShowComingSoon } from '@/lib/tool-access'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Westrum Culture Survey | AIgile',
  description:
    'Questionnaire DORA Westrum Culture Survey — mesurez la culture organisationnelle (pathologique, bureaucratique, générative).',
}

export default async function WestrumPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const flag = await getFeatureFlag('westrum')
  if (!flag) notFound()

  const h = await headers()
  const accept = h.get('accept-language') || ''
  const lang = accept.toLowerCase().startsWith('en') ? 'en' : 'fr'

  if (
    await shouldShowComingSoon('westrum', session?.user?.email, {
      userId: session?.user?.id,
    })
  ) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f2240] via-slate-950 to-[#0f2240]">
        <PremiumNavbar />
        <ComingSoonTool flag={flag} language={lang} />
        <PremiumFooter />
      </div>
    )
  }

  const inviteOnly = flag.invite_only ?? true
  if (
    inviteOnly &&
    !(await canAccessTool('westrum', session?.user?.email, { userId: session?.user?.id }))
  ) {
    return <ToolAccessDenied toolLabel={lang === 'fr' ? flag.label_fr : flag.label_en} language={lang} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PremiumNavbar />

      <header className="bg-[#0f2240] px-4 pb-10 pt-24 text-white sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-[#c9973a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c9973a]">
            DORA · Culture organisationnelle
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Westrum Culture Survey</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            Six questions Likert pour situer la culture de ton organisation — modèle Ron Westrum,
            opérationnalisé par DORA Research.
          </p>
        </div>
      </header>

      <WestrumSurvey />

      <PremiumFooter />
    </div>
  )
}
