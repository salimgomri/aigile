'use client'

import { useCredits } from '@/lib/credits/CreditContext'

/** Badge compact affichant le nombre de crédits, vert → rouge selon le reste */
export default function CreditsCountBadge() {
  const { status, loading } = useCredits()

  if (loading || !status) return null

  // Pro illimité
  if (status.isUnlimited && status.plan !== 'day_pass') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
        ⚡ Pro
      </span>
    )
  }

  // Day pass
  if (status.plan === 'day_pass' && status.dayPassTimeRemaining) {
    const msLeft = status.dayPassExpiresAt
      ? new Date(status.dayPassExpiresAt).getTime() - Date.now()
      : 0
    const hoursLeft = msLeft / 3600000
    const isUrgent = hoursLeft < 2

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
          isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
        }`}
      >
        ⚡ {status.dayPassTimeRemaining}
      </span>
    )
  }

  const remaining = status.creditsRemaining ?? 0
  const maxCredits = 10

  // Couleur : vert (10) → jaune (5) → rouge (0)
  const ratio = maxCredits > 0 ? remaining / maxCredits : 0
  let colorClass: string
  if (remaining === 0) {
    colorClass = 'bg-red-500/20 text-red-400'
  } else if (ratio >= 0.7) {
    colorClass = 'bg-emerald-500/20 text-emerald-400'
  } else if (ratio >= 0.5) {
    colorClass = 'bg-green-500/20 text-green-400'
  } else if (ratio >= 0.3) {
    colorClass = 'bg-amber-500/20 text-amber-400'
  } else if (ratio >= 0.1) {
    colorClass = 'bg-orange-500/20 text-orange-400'
  } else {
    colorClass = 'bg-red-500/20 text-red-400'
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      ⚡ {remaining} / {maxCredits}
    </span>
  )
}
