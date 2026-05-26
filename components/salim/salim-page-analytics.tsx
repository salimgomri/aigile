'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/gtag'

export function SalimPageAnalytics() {
  useEffect(() => {
    trackEvent('salim_landing_view', { source: 'salim_landing' })
  }, [])

  return null
}
