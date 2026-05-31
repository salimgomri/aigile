'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { OKR_QUESTIONS } from '@/lib/okr/checkin-schema'
import { createCheckIn } from '@/app/actions/okr-checkin'

type SprintOption = { id: string; number: number; start_date: string; end_date: string }

type Props = {
  teamId: string
  sprints: SprintOption[]
}

const MAX = 500
const MIN = 10

function Field({
  id,
  label,
  value,
  onChange,
  highlight,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  highlight?: boolean
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-xl border-2 border-[#0ba4a0]/50 bg-[#0ba4a0]/5 p-4'
          : 'rounded-xl border border-gray-200 bg-white p-4'
      }
    >
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#0f2240]">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        rows={4}
        className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none ring-[#138eec]/30 focus:border-[#138eec] focus:ring-2"
        placeholder="Minimum 10 caractères…"
      />
      <p className={`mt-1 text-right text-xs ${value.length < MIN ? 'text-amber-600' : 'text-gray-400'}`}>
        {value.length} / {MAX}
      </p>
    </div>
  )
}

export function CheckInForm({ teamId, sprints }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [sprintId, setSprintId] = useState(sprints[0]?.id ?? '')
  const [avance, setAvance] = useState('')
  const [frein, setFrein] = useState('')
  const [ajustement, setAjustement] = useState('')
  const [error, setError] = useState<string | null>(null)

  const valid =
    sprintId &&
    avance.trim().length >= MIN &&
    frein.trim().length >= MIN &&
    ajustement.trim().length >= MIN

  const submit = () => {
    if (!valid) return
    setError(null)
    startTransition(async () => {
      const res = await createCheckIn(teamId, {
        sprintId,
        avance: avance.trim(),
        frein: frein.trim(),
        ajustement: ajustement.trim(),
      })
      if (!res.success) {
        setError(res.error ?? 'Erreur')
        return
      }
      router.push(`/dashboard/${teamId}/checkin?saved=1`)
      router.refresh()
    })
  }

  if (sprints.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Aucun sprint enregistré pour cette équipe. Créez un sprint avant le check-in.
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label htmlFor="sprint" className="mb-2 block text-sm font-semibold text-[#0f2240]">
          Sprint concerné
        </label>
        <select
          id="sprint"
          value={sprintId}
          onChange={(e) => setSprintId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#138eec] focus:ring-2 focus:ring-[#138eec]/30"
        >
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              Sprint {s.number} ({s.start_date} → {s.end_date})
            </option>
          ))}
        </select>
      </div>

      <Field id="avance" label={`1. ${OKR_QUESTIONS.avance}`} value={avance} onChange={setAvance} />
      <Field id="frein" label={`2. ${OKR_QUESTIONS.frein}`} value={frein} onChange={setFrein} />
      <Field
        id="ajustement"
        label={`3. ${OKR_QUESTIONS.ajustement}`}
        value={ajustement}
        onChange={setAjustement}
        highlight
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      ) : null}

      <button
        type="button"
        disabled={!valid || pending}
        onClick={submit}
        className="w-full rounded-full bg-[#FEBD10] px-6 py-3 text-sm font-bold text-[#0f2240] transition hover:bg-[#b8862f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Enregistrement…' : 'Enregistrer le Check-in'}
      </button>
    </div>
  )
}
