'use client'

import { useState } from 'react'
import { useCredits } from '@/lib/credits/CreditContext'

export default function CreditsBadge() {
  const { status, loading } = useCredits()
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (loading || !status) return null

  const baseClass =
    'hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors bg-white/10 hover:bg-white/20'

  // Pro
  if (status.isUnlimited && status.plan !== 'day_pass') {
    return (
      <>
        <button onClick={() => setDrawerOpen(true)} className={`${baseClass} text-[#c9973a]`}>
          ⚡ Pro
        </button>
        {drawerOpen && (
          <CreditsDrawerInline open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        )}
      </>
    )
  }

  // Day Pass actif
  if (status.plan === 'day_pass' && status.dayPassTimeRemaining) {
    const msLeft = status.dayPassExpiresAt
      ? new Date(status.dayPassExpiresAt).getTime() - Date.now()
      : 0
    const hoursLeft = msLeft / 3600000
    const isUrgent = hoursLeft < 2

    return (
      <>
        <button
          onClick={() => setDrawerOpen(true)}
          className={`${baseClass} ${isUrgent ? 'text-red-400 animate-pulse' : 'text-[#c9973a]'}`}
        >
          ⚡ {status.dayPassTimeRemaining}
        </button>
        {drawerOpen && (
          <CreditsDrawerInline open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        )}
      </>
    )
  }

  // Free
  const remaining = status.creditsRemaining ?? 0
  const isLow = remaining <= 1
  const isZero = remaining === 0

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className={`${baseClass} ${
          isZero ? 'text-red-400 animate-pulse' : isLow ? 'text-amber-400 animate-pulse' : 'text-white'
        }`}
        title={isZero ? 'Plus de crédits ce mois-ci' : undefined}
      >
        ⚡ {remaining} / 10
      </button>
      {drawerOpen && (
        <CreditsDrawerInline open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  )
}

function CreditsDrawerInline({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <CreditsDrawer open={open} onClose={onClose} />
    </>
  )
}
