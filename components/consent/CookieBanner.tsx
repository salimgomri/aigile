'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CONSENT_EVENT,
  CONSENT_REOPEN_EVENT,
  CONSENT_STORAGE_KEY,
  deleteGaCookies,
  parseStoredConsent,
  shouldAskConsent,
  type ConsentChoice,
  type StoredConsent,
} from '@/lib/consent'
import { CONSENT_MAX_AGE_MONTHS } from '@/lib/site-facts'

function persist(choice: ConsentChoice): StoredConsent {
  const stored: StoredConsent = { choice, at: new Date().toISOString() }
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored))
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: stored }))
  return stored
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = parseStoredConsent(localStorage.getItem(CONSENT_STORAGE_KEY))
      setVisible(shouldAskConsent(stored))
    } catch {
      setVisible(true)
    }
    setReady(true)

    const reopen = () => setVisible(true)
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen)
  }, [])

  if (!ready || !visible) return null

  const accept = () => {
    persist('granted')
    setVisible(false)
  }

  const refuse = () => {
    persist('denied')
    deleteGaCookies()
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[80] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(15,34,64,0.18)]">
        <h2 id="cookie-banner-title" className="text-base font-bold text-aigile-navy">
          Cookies de mesure d&apos;audience
        </h2>
        <p id="cookie-banner-desc" className="mt-2 text-sm text-gray-700 leading-relaxed">
          Nous utilisons Google Analytics uniquement si vous acceptez, pour comprendre les pages
          visitées. Aucun cookie publicitaire. Votre choix est mémorisé {CONSENT_MAX_AGE_MONTHS}{' '}
          mois{' '}
          <mark className="todo-mark">[À CONFIRMER : 6]</mark>. Détails :{' '}
          <Link href="/privacy" className="underline text-aigile-navy">
            Politique de confidentialité
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={refuse}
            className="flex-1 min-h-[44px] rounded-full border-2 border-aigile-navy px-5 py-2.5 text-sm font-semibold text-aigile-navy hover:bg-aigile-navy/5"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex-1 min-h-[44px] rounded-full bg-aigile-gold px-5 py-2.5 text-sm font-semibold text-aigile-navy hover:bg-book-orange"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
