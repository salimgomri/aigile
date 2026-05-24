import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CheckInDetail } from '@/components/okr/CheckInDetail'
import { getCheckInById, getSprintDashboardRag } from '@/lib/okr/checkin-store'

type Props = {
  params: Promise<{ teamId: string; checkinId: string }>
}

export default async function CheckInDetailPage({ params }: Props) {
  const { teamId, checkinId } = await params
  const checkIn = await getCheckInById(teamId, checkinId)
  if (!checkIn) notFound()

  const rag = await getSprintDashboardRag(teamId, checkIn.sprint_id)

  return (
    <div>
      <Link
        href={`/dashboard/${teamId}/checkin`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#138eec]"
      >
        <ArrowLeft className="h-4 w-4" />
        Historique
      </Link>
      <CheckInDetail teamId={teamId} checkIn={checkIn} rag={rag} />
    </div>
  )
}
