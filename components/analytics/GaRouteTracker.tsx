'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { shouldSkipGaPath, trackPageView } from '@/lib/gtag'

/**
 * Envoie une pageview GA4 à chaque navigation client (App Router).
 * Le premier chargement est déjà couvert par gtag('config') dans layout.tsx —
 * on saute donc le premier fire pour éviter le double comptage.
 */
export function GaRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirst = useRef(true)

  useEffect(() => {
    if (!pathname || shouldSkipGaPath(pathname)) return

    if (isFirst.current) {
      isFirst.current = false
      return
    }

    const qs = searchParams?.toString()
    const path = qs ? `${pathname}?${qs}` : pathname
    trackPageView(path)
  }, [pathname, searchParams])

  return null
}
