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
    <div className="relative min-h-screen overflow-x-hidden bg-[#c8c8c8] print:bg-white">
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden print:hidden"
        data-no-print
        aria-hidden
      >
        <div className="absolute left-0 top-0 h-[400px] w-full bg-gradient-to-b from-black/80 to-transparent" />
      </div>

      <div data-no-print>
        <PremiumNavbar />
      </div>

      <div className="relative z-10 px-4 pb-4 pt-24 md:px-8" data-no-print>
        <Link
          href="/dashboard-manager"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-[#c8a84b]"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'fr' ? 'Retour' : 'Back'}
        </Link>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#c8a84b]">
          Dashboard Manager · Studio
        </p>
        <h1 className="mb-8 text-2xl font-bold text-white md:text-3xl">
          {lang === 'fr' ? 'Personnalisez et exportez' : 'Customize and export'}
        </h1>
      </div>

      <DashboardManagerEditor />

      <div className="mt-8" data-no-print>
        <PremiumFooter />
      </div>
    </div>
  )
}
