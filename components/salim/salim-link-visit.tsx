'use client'

import { useEffect } from 'react'
import type { SalimLinkSlug } from '@/lib/salim/fiche'

export function SalimLinkVisit({ link }: { link: SalimLinkSlug }) {
  useEffect(() => {
    const key = `salim-visit-${link}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      return
    }
    void fetch('/api/salim/visite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link }),
      keepalive: true,
    }).catch(() => {})
  }, [link])

  return null
}
