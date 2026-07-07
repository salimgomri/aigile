'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/gtag'

export function LandingAnalytics() {
  useEffect(() => {
    trackEvent('landing_home_view', { source: 'landing_home' })
  }, [])

  return null
}
