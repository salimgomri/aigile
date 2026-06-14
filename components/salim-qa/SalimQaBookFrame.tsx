'use client'

import { useState, type ReactNode } from 'react'
import { SalimQaBuyBookButton } from './SalimQaBookModal'

type SalimQaBookFrameProps = {
  language: 'fr' | 'en'
  children: ReactNode
  onBookClick?: () => void
}

export function SalimQaBookFrame({ language, children, onBookClick }: SalimQaBookFrameProps) {
  const [hot, setHot] = useState(false)

  const hint =
    language === 'fr'
      ? 'Le Système S.A.L.I.M. · contenu du livre'
      : 'The S.A.L.I.M. System · from the book'

  return (
    <div
      className={`sq-book-frame${hot ? ' sq-book-frame--hot' : ''}`}
      onMouseLeave={() => setHot(false)}
    >
      <div
        className="sq-book-frame__edge sq-book-frame__edge--top"
        onMouseEnter={() => setHot(true)}
        aria-hidden
      />
      <div
        className="sq-book-frame__edge sq-book-frame__edge--bottom"
        onMouseEnter={() => setHot(true)}
        aria-hidden
      />
      <div
        className="sq-book-frame__edge sq-book-frame__edge--left"
        onMouseEnter={() => setHot(true)}
        aria-hidden
      />
      <div
        className="sq-book-frame__edge sq-book-frame__edge--right"
        onMouseEnter={() => setHot(true)}
        aria-hidden
      />

      <div className="sq-book-frame__top-band">
        <span className="sq-book-frame__hint sq-brand-mono">{hint}</span>
        <div className="sq-book-frame__cta" onMouseEnter={() => setHot(true)}>
          <SalimQaBuyBookButton
            language={language}
            variant="landing"
            trackSource="salim_qa_frame"
            onClick={onBookClick}
          />
        </div>
      </div>

      <div className="sq-book-frame__inner">{children}</div>

      <div className="sq-book-frame__bottom-band" aria-hidden />
    </div>
  )
}
