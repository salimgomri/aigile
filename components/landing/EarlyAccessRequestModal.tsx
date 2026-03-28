'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { EarlyAccessRequestForm } from '@/components/landing/EarlyAccessRequestForm'

type Props = {
  open: boolean
  onClose: () => void
  language: 'fr' | 'en'
  toolSlug?: string
}

export function EarlyAccessRequestModal({ open, onClose, language, toolSlug = 'scoring_deliverable' }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const fr = language === 'fr'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="early-access-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <h2 id="early-access-modal-title" className="pr-2 text-lg font-semibold leading-snug text-foreground">
            {fr ? 'Demander un early access — Scoring livraison' : 'Request early access — Delivery scoring'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={fr ? 'Fermer' : 'Close'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <EarlyAccessRequestForm language={language} toolSlug={toolSlug} hideHeading />
        </div>
      </div>
    </div>
  )
}
