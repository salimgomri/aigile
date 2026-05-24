import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import PremiumNavbar from '@/components/premium-navbar'
import { TeamSidebar } from '@/components/okr/TeamSidebar'
import { getFeatureFlag } from '@/lib/feature-flags'
import { canAccessTool, shouldShowComingSoon } from '@/lib/tool-access'
import ComingSoonTool from '@/components/feature-flag/ComingSoonTool'
import ToolAccessDenied from '@/components/feature-flag/ToolAccessDenied'
import { assertTeamMember, getTeamBasic } from '@/lib/okr/team-access'

type Props = {
  children: React.ReactNode
  params: Promise<{ teamId: string }>
}

export default async function TeamDashboardLayout({ children, params }: Props) {
  const { teamId } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect(`/login?redirect=${encodeURIComponent(`/dashboard/${teamId}/checkin`)}`)
  }

  const flag = await getFeatureFlag('okr_checkin')
  if (!flag) notFound()

  const h = await headers()
  const lang = (h.get('accept-language') || '').toLowerCase().startsWith('en') ? 'en' : 'fr'

  if (
    await shouldShowComingSoon('okr_checkin', session.user.email, { userId: session.user.id })
  ) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PremiumNavbar />
        <ComingSoonTool flag={flag} language={lang} />
      </div>
    )
  }

  if (
    (flag.invite_only ?? true) &&
    !(await canAccessTool('okr_checkin', session.user.email, { userId: session.user.id }))
  ) {
    return <ToolAccessDenied toolLabel={lang === 'fr' ? flag.label_fr : flag.label_en} language={lang} />
  }

  const team = await getTeamBasic(teamId)
  if (!team || !(await assertTeamMember(session.user.id, teamId))) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PremiumNavbar />
      <div className="mx-auto flex max-w-6xl flex-col pt-20 md:flex-row md:pt-24">
        <TeamSidebar teamId={teamId} teamName={team.name} />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
