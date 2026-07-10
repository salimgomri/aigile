import 'server-only'

import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import ComingSoonTool from '@/components/feature-flag/ComingSoonTool'
import ToolAccessDenied from '@/components/feature-flag/ToolAccessDenied'
import DashboardManagerEditor from '@/components/dashboard-manager/DashboardManagerEditor'
import { getFeatureFlag } from '@/lib/feature-flags'
import { canAccessTool, shouldShowComingSoon } from '@/lib/tool-access'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default async function DashboardManagerStudioPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const flag = await getFeatureFlag('dashboard_manager')
  if (!flag) notFound()

  const h = await headers()
  const accept = h.get('accept-language') || ''
  const lang = accept.toLowerCase().startsWith('en') ? 'en' : 'fr'

  if (
    await shouldShowComingSoon('dashboard_manager', session?.user?.email, {
      userId: session?.user?.id,
    })
  ) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-black">
        <div data-no-print>
          <PremiumNavbar />
        </div>
        <ComingSoonTool flag={flag} language={lang} />
        <div data-no-print>
          <PremiumFooter />
        </div>
      </div>
    )
  }

  const inviteOnly = flag.invite_only ?? true
  if (
    inviteOnly &&
    !(await canAccessTool('dashboard_manager', session?.user?.email, { userId: session?.user?.id }))
  ) {
    return <ToolAccessDenied toolLabel={lang === 'fr' ? flag.label_fr : flag.label_en} language={lang} />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-black print:bg-white">
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden print:hidden"
        data-no-print
        aria-hidden
      >
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-br from-aigile-gold/15 via-aigile-gold/5 to-transparent blur-3xl" />
        <div
          className="absolute bottom-0 right-0 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl"
          style={{ animationDelay: '1.2s' }}
        />
      </div>

      <div data-no-print>
        <PremiumNavbar />
      </div>

      <header
        className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-2 pt-24 md:px-8 md:pt-28"
        data-no-print
      >
        <Link
          href="/dashboard-manager"
          className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm text-white/65 transition hover:text-aigile-gold"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {lang === 'fr' ? 'Retour au Dashboard Manager' : 'Back to Dashboard Manager'}
        </Link>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-aigile-gold">
          {lang === 'fr' ? 'Studio · Personnalisation' : 'Studio · Customization'}
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {lang === 'fr' ? 'Votre dashboard sprint' : 'Your sprint dashboard'}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
          {lang === 'fr'
            ? 'Renseignez les 6 cadrans, la vélocité et l’OKR. Exportez en PDF ou générez la narrative manager.'
            : 'Fill in the 6 dials, velocity and OKR. Export as PDF or generate the manager narrative.'}
        </p>
      </header>

      <main className="relative z-10 pb-16 print:pb-0">
        <DashboardManagerEditor />
      </main>

      <div className="mt-4 print:hidden" data-no-print>
        <PremiumFooter />
      </div>
    </div>
  )
}
