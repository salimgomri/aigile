'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PulseButtonVariant } from '@/components/admin/pulse-button'

export function useAdminIntelligencePulse() {
  const [critical, setCritical] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const ackSent = useRef(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/intelligence-pulse')
      .then((r) => (r.ok ? r.json() : Promise.resolve({ critical: false })))
      .then((data: { critical?: boolean }) => {
        if (!cancelled) {
          setCritical(!!data.critical)
          setLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const acknowledge = useCallback(() => {
    if (ackSent.current) return
    ackSent.current = true
    setDismissed(true)
    void fetch('/api/admin/intelligence-pulse', { method: 'POST' })
  }, [])

  const activeCritical = critical && !dismissed
  const variant: PulseButtonVariant = activeCritical ? 'critical' : 'standard'

  return { loaded, variant, acknowledge, activeCritical }
}
