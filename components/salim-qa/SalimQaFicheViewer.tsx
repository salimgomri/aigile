'use client'

import { useCallback, useEffect, useState, type SyntheticEvent } from 'react'
import { createPortal } from 'react-dom'
import { salimQaFicheUrl } from '@/lib/salim-qa/fiches-security'

function blockInteraction(e: SyntheticEvent) {
  e.preventDefault()
  e.stopPropagation()
}

type SalimQaFicheLightboxProps = {
  svg: string
  label: string
  closeLabel: string
  onClose: () => void
}

function SalimQaFicheLightbox({ svg, label, closeLabel, onClose }: SalimQaFicheLightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prev
    }
  }, [handleKey])

  return createPortal(
    <div className="sq-fiche-lightbox" onClick={onClose} role="presentation">
      <div
        className="sq-fiche-lightbox__panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button type="button" className="sq-fiche-lightbox__close" onClick={onClose} aria-label={closeLabel}>
          ×
        </button>
        <div
          className="sq-fiche-lightbox__body"
          onContextMenu={blockInteraction}
          onDragStart={blockInteraction}
          onCopy={blockInteraction}
          onCut={blockInteraction}
        >
          <div className="sq-fiche-lightbox__svg" dangerouslySetInnerHTML={{ __html: svg }} />
          <div
            className="sq-fiche-lightbox__shield"
            aria-hidden
            onClick={onClose}
            onContextMenu={blockInteraction}
            onDragStart={blockInteraction}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

type SalimQaFicheViewerProps = {
  questionId: string
  index?: number
  language?: 'fr' | 'en'
}

/** Affichage inline protégé — clic pour agrandir, pas de clic droit / drag */
export function SalimQaFicheViewer({ questionId, index = 0, language = 'fr' }: SalimQaFicheViewerProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const zoomLabel = language === 'fr' ? 'Agrandir le schéma' : 'Enlarge diagram'
  const lightboxLabel = language === 'fr' ? 'Schéma agrandi' : 'Enlarged diagram'
  const closeLabel = language === 'fr' ? 'Fermer' : 'Close'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSvg(null)

    fetch(salimQaFicheUrl(questionId, index), { credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok || res.status === 204) return null
        return res.text()
      })
      .then((text) => {
        if (cancelled) return
        setSvg(text?.trim() ? text : null)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setSvg(null)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [questionId, index])

  if (loading) {
    return (
      <div className="sq-fiche-viewer sq-fiche-viewer--loading" aria-busy="true">
        …
      </div>
    )
  }

  if (!svg) return null

  return (
    <>
      <button
        type="button"
        className="sq-fiche-viewer sq-fiche-viewer--zoomable"
        aria-label={zoomLabel}
        onClick={() => setOpen(true)}
        onContextMenu={blockInteraction}
        onDragStart={blockInteraction}
      >
        <div className="sq-fiche-viewer__svg" dangerouslySetInnerHTML={{ __html: svg }} />
        <span className="sq-fiche-viewer__zoom-hint sq-brand-mono">
          {language === 'fr' ? 'Agrandir' : 'Enlarge'}
        </span>
      </button>
      {open && (
        <SalimQaFicheLightbox
          svg={svg}
          label={lightboxLabel}
          closeLabel={closeLabel}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export function SalimQaFicheStack({
  questionId,
  count,
  language = 'fr',
}: {
  questionId: string
  count: number
  language?: 'fr' | 'en'
}) {
  if (count <= 0) return null
  return (
    <div className="sq-fiche-stack">
      {Array.from({ length: count }, (_, i) => (
        <SalimQaFicheViewer key={i} questionId={questionId} index={i} language={language} />
      ))}
    </div>
  )
}
