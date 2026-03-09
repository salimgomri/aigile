'use client'

import { useCredits } from '@/lib/credits/CreditContext'
import { CREDIT_ACTIONS, type CreditAction } from '@/lib/credits/actions'
import { useState, useEffect, useCallback } from 'react'
import UpgradeModal from './UpgradeModal'

export default function CreditButton({
  action,
  onConfirmed,
  children,
  disabled,
  className = '',
  extraBody = {},
  triggerRef,
}: {
  action: CreditAction
  onConfirmed: (res?: any) => void | Promise<void>
  children: React.ReactNode
  disabled?: boolean
  className?: string
  extraBody?: Record<string, unknown>
  /** Ref pour déclencher le clic depuis l'extérieur (ex: lien "Débloquez pour voir") */
  triggerRef?: React.MutableRefObject<(() => void) | null>
}) {
  const { status, refresh } = useCredits()
  const [loading, setLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const cost = CREDIT_ACTIONS[action].cost
  const canAfford = status?.isUnlimited || (status?.creditsRemaining ?? 0) >= cost
  const isZero = (status?.creditsRemaining ?? 0) === 0 && !status?.isUnlimited

  const handleClick = useCallback(async () => {
    if (isZero) {
      setShowUpgrade(true)
      return
    }
    if (!canAfford || disabled) return

    setLoading(true)
    try {
      const res = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraBody }),
      })

      const data = res.ok ? await res.json().catch(() => ({})) : null

      if (!res.ok) {
        if (res.status === 403) setShowUpgrade(true)
        return
      }

      await onConfirmed(data)
      await refresh()
    } catch {
      // Error handling
    } finally {
      setLoading(false)
    }
  }, [action, extraBody, canAfford, isZero, disabled, onConfirmed, refresh])

  const badge = status?.isUnlimited ? (
    <span className="text-xs font-medium text-[#c9973a]">∞</span>
  ) : isZero ? (
    <span className="text-xs font-medium text-red-400">0/10 🔒</span>
  ) : (
    <span className="text-xs font-medium text-white/90">{cost} crédit{cost > 1 ? 's' : ''}</span>
  )

  useEffect(() => {
    if (triggerRef) {
      triggerRef.current = handleClick
      return () => { triggerRef.current = null }
    }
  }, [triggerRef, handleClick])

  const baseClass =
    'inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed'

  const enabledClass = canAfford && !isZero
    ? 'bg-[#c9973a] hover:bg-[#E8961E] text-black'
    : 'bg-gray-700 text-gray-400 cursor-not-allowed'

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || loading || isZero}
        className={`${baseClass} ${enabledClass} ${className}`}
      >
        {children}
        {badge}
      </button>
      {showUpgrade && <UpgradeModal open onClose={() => setShowUpgrade(false)} />}
    </>
  )
}
