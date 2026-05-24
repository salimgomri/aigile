import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CheckInForm } from '@/components/okr/CheckInForm'
import { getTeamSprints } from '@/lib/okr/checkin-store'

type Props = {
  params: Promise<{ teamId: string }>
}

export default async function NewCheckInPage({ params }: Props) {
  const { teamId } = await params
  const sprints = await getTeamSprints(teamId)

  return (
    <div>
      <Link
        href={`/dashboard/${teamId}/checkin`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#138eec]"
      >
        <ArrowLeft className="h-4 w-4" />
        Historique
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-[#0f2240]">Nouveau Check-in OKR</h1>
      <p className="mb-8 text-sm text-gray-600">
        Mesure recommandée en clôture de Sprint Review — 5 à 10 minutes, texte libre uniquement.
      </p>
      <CheckInForm teamId={teamId} sprints={sprints} />
    </div>
  )
}
