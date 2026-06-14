'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { SalimQaBookPitch } from './SalimQaBookPitch'

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
        className="sq-book-frame__rail sq-book-frame__rail--top"
        onMouseEnter={() => setHot(true)}
      >
        <span className="sq-book-frame__hint sq-brand-mono">{hint}</span>
      </div>

      {hot && (
        <div
          className="sq-book-pitch-drop"
          onMouseEnter={() => setHot(true)}
          onMouseLeave={() => setHot(false)}
        >
          <SalimQaBookPitch
            language={language}
            layout="strip"
            trackSource="salim_qa_frame"
            onClick={onBookClick}
          />
        </div>
      )}

      <div
        className="sq-book-frame__rail sq-book-frame__rail--bottom"
        onMouseEnter={() => setHot(true)}
        aria-hidden
      />
      <div
        className="sq-book-frame__rail sq-book-frame__rail--left"
        onMouseEnter={() => setHot(true)}
        aria-hidden
      />
      <div
        className="sq-book-frame__rail sq-book-frame__rail--right"
        onMouseEnter={() => setHot(true)}
        aria-hidden
      />

      <div className="sq-book-frame__inner">{children}</div>
    </div>
  )
}

type SalimQaBookHeaderTriggerProps = {
  language: 'fr' | 'en'
  onClick: () => void
}

export function SalimQaBookHeaderTrigger({ language, onClick }: SalimQaBookHeaderTriggerProps) {
  const label = language === 'fr' ? 'Le livre source' : 'Source book'
  const sub = language === 'fr' ? 'Couverture · teaser · commande' : 'Cover · teaser · order'

  return (
    <button type="button" className="sq-book-header-trigger" onClick={onClick}>
      <span className="sq-book-header-trigger__cover">
        <Image src="/images/book-cover.jpg" alt="" width={28} height={38} />
      </span>
      <span className="sq-book-header-trigger__copy">
        <span className="sq-book-header-trigger__label">{label}</span>
        <span className="sq-book-header-trigger__sub sq-brand-mono">{sub}</span>
      </span>
    </button>
  )
}
