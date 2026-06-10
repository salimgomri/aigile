'use client'

import { useState } from 'react'
import Image from 'next/image'

const GOLD = '#FEBD10'
const NAVY = '#0f2240'
const SYSTEM_FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

type Lang = 'fr' | 'en'

const COPY: Record<Lang, {
  b1Sub: string
  b1Body: string
  b2Sub: string
  b2Body: string
  b3Title: string
  b3Sub: string
  cta: string
}> = {
  fr: {
    b1Sub: 'Mon livre',
    b1Body: 'Construit sur 300+ rétrospectives réelles.',
    b2Sub: '21 ans de terrain',
    b2Body: 'Scrum Masters, équipes, managers en transition.',
    b3Title: 'Prendre RDV',
    b3Sub: '30 min, gratuit',
    cta: 'Réserver maintenant',
  },
  en: {
    b1Sub: 'My book',
    b1Body: 'Built on 300+ real retrospectives.',
    b2Sub: '21 years in the field',
    b2Body: 'Scrum Masters, teams, managers in transition.',
    b3Title: 'Book a call',
    b3Sub: '30 min, free',
    cta: 'Book now',
  },
}

const CALENDLY_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://calendly.com/salimdulux/30min&color=0f2240&bgcolor=ffffff'

function Arrow() {
  return (
    <span
      aria-hidden
      className="absolute bottom-4 right-4 text-2xl leading-none sm:hidden"
      style={{ color: GOLD }}
    >
      ↗
    </span>
  )
}

export function AboutClient() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = COPY[lang]

  return (
    <main className="about-main relative flex flex-col" style={{ backgroundColor: NAVY, fontFamily: SYSTEM_FONT }}>
      {/* Back to aigile.lu — fixed top-left, always visible */}
      <a
        href="https://aigile.lu"
        target="_self"
        className="fixed left-4 top-4 z-50 rounded-full no-underline"
        style={{
          backgroundColor: NAVY,
          color: GOLD,
          fontSize: '13px',
          padding: '8px 16px',
          boxShadow: '0 0 0 1px rgba(254,189,16,0.25)',
        }}
      >
        ← aigile.lu
      </a>

      {/* Language switcher — fixed top-right */}
      <div className="fixed right-4 top-4 z-50 flex gap-2">
        {(['fr', 'en'] as Lang[]).map((l) => {
          const active = lang === l
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={active}
              className="rounded-full font-bold uppercase"
              style={{
                fontSize: '13px',
                padding: '8px 14px',
                backgroundColor: active ? GOLD : 'transparent',
                color: active ? NAVY : GOLD,
                border: `1px solid ${GOLD}`,
              }}
            >
              {l}
            </button>
          )
        })}
      </div>

      {/* 48px réservés en haut → chaque bloc = (100dvh - 48px) / 3 */}
      <div className="h-12 shrink-0" style={{ backgroundColor: NAVY }} />

      {/* BLOC 1 — Le Système S.A.L.I.M. → aigile.lu (même onglet) */}
      <div className="about-block-wrap about-delay-1 flex flex-1">
        <a
          href="https://aigile.lu"
          target="_self"
          className="about-block relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center no-underline"
          style={{ backgroundColor: NAVY }}
        >
          <span className="about-overlay absolute inset-0" style={{ backgroundColor: GOLD }} />
          <div className="relative z-10">
            <h2 className="text-[1.75rem] font-bold sm:text-5xl" style={{ color: GOLD }}>
              Le Système S.A.L.I.M.
            </h2>
            <p className="mt-2 text-sm font-semibold sm:text-lg" style={{ color: '#ffffff' }}>
              {t.b1Sub}
            </p>
            <p className="mt-1.5 text-xs sm:text-base" style={{ color: '#8ab4d4' }}>
              {t.b1Body}
            </p>
          </div>
          <Arrow />
        </a>
      </div>

      {/* BLOC 2 — Coaching Agile → LinkedIn (nouvel onglet) */}
      <div className="about-block-wrap about-delay-2 flex flex-1">
        <a
          href="https://www.linkedin.com/in/salimgomri/"
          target="_blank"
          rel="noopener noreferrer"
          className="about-block relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center no-underline"
          style={{ backgroundColor: GOLD }}
        >
          <span className="about-overlay absolute inset-0" style={{ backgroundColor: NAVY }} />
          <div className="relative z-10">
            <h2 className="text-[1.75rem] font-bold sm:text-5xl" style={{ color: NAVY }}>
              Coaching Agile
            </h2>
            <p className="mt-2 text-sm font-semibold sm:text-lg" style={{ color: NAVY }}>
              {t.b2Sub}
            </p>
            <p className="mt-1.5 text-xs sm:text-base" style={{ color: '#1a3a6b' }}>
              {t.b2Body}
            </p>
          </div>
          <span
            aria-hidden
            className="absolute bottom-4 right-4 text-2xl leading-none sm:hidden"
            style={{ color: NAVY }}
          >
            ↗
          </span>
        </a>
      </div>

      {/* BLOC 3 — Prendre RDV → Calendly (nouvel onglet) */}
      <div className="about-block-wrap about-delay-3 flex flex-1">
        <a
          href="https://calendly.com/salimdulux/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="about-block relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center no-underline"
          style={{ backgroundColor: NAVY }}
        >
          <span className="about-overlay absolute inset-0" style={{ backgroundColor: GOLD }} />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-[1.75rem] font-bold sm:text-5xl" style={{ color: GOLD }}>
              {t.b3Title}
            </h2>
            <p className="mt-2 text-sm font-semibold sm:text-lg" style={{ color: '#ffffff' }}>
              {t.b3Sub}
            </p>
            <div className="mt-4 hidden rounded-lg bg-white p-2 sm:block">
              <Image
                src={CALENDLY_QR}
                alt="QR code — Calendly"
                width={200}
                height={200}
                unoptimized
                className="h-auto w-[120px]"
              />
            </div>
            <span
              className="mt-5 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              {t.cta}
            </span>
          </div>
          <Arrow />
        </a>
      </div>
    </main>
  )
}
