import Link from 'next/link'
import { Plus } from 'lucide-react'
import { CheckInCard } from '@/components/okr/CheckInCard'
import { getCheckInsByTeam } from '@/lib/okr/checkin-store'
import { CheckInSavedToast } from '@/components/okr/CheckInSavedToast'

type Props = {
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ saved?: string }>
}

export default async function CheckInListPage({ params, searchParams }: Props) {
  const { teamId } = await params
  const { saved } = await searchParams
  const checkIns = await getCheckInsByTeam(teamId)

  return (
    <div>
      <CheckInSavedToast show={saved === '1'} />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FEBD10]">Sprint Review</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0f2240]">OKR Check-in</h1>
          <p className="mt-2 max-w-xl text-sm text-gray-600">
            Rituel de clôture — verbalisez l&apos;avancement OKR et l&apos;ajustement acté pour le prochain sprint.
          </p>
        </div>
        <Link
          href={`/dashboard/${teamId}/checkin/new`}
          className="inline-flex items-center gap-2 rounded-full bg-[#FEBD10] px-5 py-2.5 text-sm font-bold text-[#0f2240] hover:bg-[#b8862f]"
        >
          <Plus className="h-4 w-4" />
          Nouveau Check-in
        </Link>
      </div>

      {checkIns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <p className="text-gray-600">Aucun check-in enregistré.</p>
          <Link
            href={`/dashboard/${teamId}/checkin/new`}
            className="mt-4 inline-block text-sm font-semibold text-[#138eec]"
          >
            Créer le premier check-in →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {checkIns.map((c) => (
            <CheckInCard key={c.id} teamId={teamId} checkIn={c} />
          ))}
        </div>
      )}
    </div>
  )
}
