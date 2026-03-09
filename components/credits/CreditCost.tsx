'use client'

import { useCredits } from '@/lib/credits/CreditContext'
import { CREDIT_ACTIONS, type CreditAction } from '@/lib/credits/actions'

export default function CreditCost({ action }: { action: CreditAction }) {
  const { status } = useCredits()
  const cost = CREDIT_ACTIONS[action].cost

  if (!status) return <span className="text-white/50">1 crédit</span>

  if (status.isUnlimited) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#c9973a]/20 text-[#c9973a]">
        ∞
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
      {cost} crédit{cost > 1 ? 's' : ''}
    </span>
  )
}
