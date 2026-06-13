'use client'

import { useEffect, useState, type SyntheticEvent } from 'react'
import { salimQaFicheUrl } from '@/lib/salim-qa/fiches-security'

function blockInteraction(e: SyntheticEvent) {
  e.preventDefault()
  e.stopPropagation()
}

type SalimQaFicheViewerProps = {
  questionId: string
  index?: number
}

/** Affichage inline protégé — pas d’URL en src, pas de clic droit / drag */
export function SalimQaFicheViewer({ questionId, index = 0 }: SalimQaFicheViewerProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
    <div
      className="sq-fiche-viewer"
      onContextMenu={blockInteraction}
      onDragStart={blockInteraction}
      onCopy={blockInteraction}
      onCut={blockInteraction}
    >
      <div className="sq-fiche-viewer__svg" dangerouslySetInnerHTML={{ __html: svg }} />
      <div
        className="sq-fiche-viewer__shield"
        aria-hidden
        onContextMenu={blockInteraction}
        onDragStart={blockInteraction}
      />
    </div>
  )
}

export function SalimQaFicheStack({ questionId, count }: { questionId: string; count: number }) {
  if (count <= 0) return null
  return (
    <div className="sq-fiche-stack">
      {Array.from({ length: count }, (_, i) => (
        <SalimQaFicheViewer key={i} questionId={questionId} index={i} />
      ))}
    </div>
  )
}
