'use client'

import { useEffect } from 'react'
import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  deleteGaCookies,
  parseStoredConsent,
  type StoredConsent,
} from '@/lib/consent'
import { GA_MEASUREMENT_ID } from '@/lib/site-facts'
import { shouldSkipGaPath } from '@/lib/gtag'

const SCRIPT_ID = 'aigile-gtag-js'

function unloadGtag(): void {
  const el = document.getElementById(SCRIPT_ID)
  el?.remove()
  deleteGaCookies()
}

function loadGtag(id: string): void {
  if (typeof window === 'undefined') return
  if (document.getElementById(SCRIPT_ID)) return
  if (shouldSkipGaPath(window.location.pathname)) return

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer!.push(args)
    }
  window.gtag('js', new Date())
  window.gtag('config', id, { anonymize_ip: true })

  const s = document.createElement('script')
  s.id = SCRIPT_ID
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    const apply = (stored: StoredConsent | null) => {
      if (stored?.choice === 'granted') {
        loadGtag(GA_MEASUREMENT_ID)
      } else {
        unloadGtag()
      }
    }

    try {
      apply(parseStoredConsent(localStorage.getItem(CONSENT_STORAGE_KEY)))
    } catch {
      apply(null)
    }

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<StoredConsent>).detail
      apply(detail ?? null)
    }
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  return null
}
