import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { truncate } from '@/lib/okr/checkin-schema'
import type { OkrCheckInRow } from '@/lib/okr/checkin-store'

type Props = {
  teamId: string
  checkIn: OkrCheckInRow
}

export function CheckInCard({ teamId, checkIn }: Props) {
  const sprintNum = checkIn.sprint?.number ?? '?'
  const dateLabel = format(new Date(checkIn.created_at), 'd MMM yyyy', { locale: fr })

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#138eec]/40">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[#0f2240]">
          Sprint {sprintNum}
          <span className="ml-2 font-normal text-gray-500">· {dateLabel}</span>
        </h3>
        {checkIn.ai_summary ? (
          <span className="rounded-full bg-[#138eec]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#138eec]">
            Synthèse IA
          </span>
        ) : null}
      </div>
      <dl className="space-y-2 text-sm text-gray-700">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Avancé</dt>
          <dd>{truncate(checkIn.avance)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Frein</dt>
          <dd>{truncate(checkIn.frein)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#0ba4a0]">Ajustement</dt>
          <dd className="font-semibold text-[#0f2240]">{truncate(checkIn.ajustement)}</dd>
        </div>
      </dl>
      <Link
        href={`/dashboard/${teamId}/checkin/${checkIn.id}`}
        className="mt-4 inline-flex text-sm font-semibold text-[#138eec] hover:text-[#0f2240]"
      >
        Voir détail →
      </Link>
    </article>
  )
}
