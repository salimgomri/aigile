'use client'

import { useEffect, useState } from 'react'
import { KitForm } from '@/components/kit/KitForm'

const SESSION_KEY = 'aigile_kit_exit_seen'

export function ExitIntentKit() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(max-width: 640px)').matches) return
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
    } catch {
      return
    }

    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 12) return
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        return
      }
      setOpen(true)
    }

    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4">
      <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-book-orange">Kit gratuit</p>
            <h2 className="text-lg font-bold text-aigile-navy">5 signaux que votre livraison dérape</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>
        <div className="mt-3">
          <KitForm compact source="home-v2-exit" />
        </div>
      </div>
    </div>
  )
}
