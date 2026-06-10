'use client'

import { useState } from 'react'
import Image from 'next/image'

const GOLD = '#FEBD10'
const NAVY = '#0f2240'
const NAVY_LIGHT = '#1a3a6b'
const MUTED = '#8ab4d4'
const SYSTEM_FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

type Lang = 'fr' | 'en'

const COPY: Record<Lang, {
  b1Sub: string
  b1Body: string
  b1Cta: string
  b2SubSuffix: string
  b2Body: string
  b2Cta: string
  b3Title: string
  b3Sub: string
  b3Body: string
  b3Cta: string
  universeCta: string
}> = {
  fr: {
    b1Sub: 'Mon livre',
    b1Body:
      'Scrum Augmenté, Livré en Incrémental et Mesuré. Construit sur 300+ rétrospectives réelles, pour sortir du Scrum de façade.',
    b1Cta: 'Découvrir le livre',
    b2SubSuffix: 'ans de terrain',
    b2Body: 'Scrum Masters, équipes, managers en transition. Luxembourg et remote.',
    b2Cta: 'Me suivre sur LinkedIn',
    b3Title: 'Prendre RDV',
    b3Sub: '30 min, gratuit',
    b3Body: 'Session découverte pour parler de ton contexte.',
    b3Cta: 'Réserver maintenant',
    universeCta: "Découvre tout l'univers AIgile →",
  },
  en: {
    b1Sub: 'My book',
    b1Body:
      'Scrum Augmented, Delivered Incrementally and Measured. Built on 300+ real retrospectives, to move past surface-level Scrum.',
    b1Cta: 'Discover the book',
    b2SubSuffix: 'years in the field',
    b2Body: 'Scrum Masters, teams, managers in transition. Luxembourg and remote.',
    b2Cta: 'Follow me on LinkedIn',
    b3Title: 'Book a call',
    b3Sub: '30 min, free',
    b3Body: 'Discovery session to talk about your context.',
    b3Cta: 'Book now',
    universeCta: 'Explore the full AIgile universe →',
  },
}

const MARQUEE_TOOLS =
  'Rétro IA · Scoring Deliverable · Dashboard Manager · Westrum Survey · Prompt Library'

const SALIM_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aigile.lu/salim&color=0f2240&bgcolor=ffffff'
const LINKEDIN_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.linkedin.com/in/salimgomri/&color=0f2240&bgcolor=ffffff'
const CALENDLY_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://calendly.com/salimdulux/30min&color=0f2240&bgcolor=ffffff'

function AboutQr({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="about-qr about-interactive-child">
      <Image
        src={src}
        alt={alt}
        width={200}
        height={200}
        unoptimized
        className="h-auto w-[110px]"
      />
    </div>
  )
}

/** Icône filaire « appel » (SVG inline, aucune librairie) */
function PhoneIcon({ color, size = 44 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export function AboutClient() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = COPY[lang]
  const yearsExperience = new Date().getFullYear() - 2003

  return (
    <main className="about-main relative" style={{ backgroundColor: NAVY, fontFamily: SYSTEM_FONT }}>
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

      <div className="about-columns">
        {/* COLONNE 1 — Le Système S.A.L.I.M. */}
        <div className="about-block-wrap about-delay-1">
          <a
            href="https://aigile.lu"
            target="_self"
            className="about-block"
            style={{ backgroundColor: NAVY }}
          >
            <span className="about-overlay" style={{ backgroundColor: GOLD }} />
            <span className="about-mobile-tap" aria-hidden>
              ↗
            </span>

            <div className="about-block-mobile about-interactive-child">
              <span className="about-mobile-icon" aria-hidden>
                📖
              </span>
              <h2 className="about-mobile-title" style={{ color: GOLD }}>
                Le Système S.A.L.I.M.
              </h2>
              <p className="about-mobile-sub" style={{ color: '#ffffff' }}>
                {t.b1Sub}
              </p>
            </div>

            <div className="about-block-desktop about-interactive-child">
              <Image
                src="/images/book-cover.jpg"
                alt="Couverture — Le Système S.A.L.I.M."
                width={300}
                height={400}
                className="mb-4 h-auto w-[130px] rounded-md"
                priority
              />
              <h2 className="text-2xl font-bold" style={{ color: GOLD }}>
                Le Système S.A.L.I.M.
              </h2>
              <p className="mt-2 text-sm font-semibold" style={{ color: '#ffffff' }}>
                {t.b1Sub}
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed" style={{ color: MUTED }}>
                {t.b1Body}
              </p>
              <AboutQr src={SALIM_QR} alt="QR code — aigile.lu/salim" />
              <span
                className="about-cta mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold"
                style={{ backgroundColor: GOLD, color: NAVY }}
              >
                {t.b1Cta}
              </span>
            </div>
          </a>
        </div>

        {/* COLONNE 2 — Coaching Agile */}
        <div className="about-block-wrap about-delay-2">
          <a
            href="https://www.linkedin.com/in/salimgomri/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-block"
            style={{ backgroundColor: GOLD }}
          >
            <span className="about-overlay" style={{ backgroundColor: NAVY }} />
            <span className="about-mobile-tap" aria-hidden>
              ↗
            </span>

            <div className="about-block-mobile about-interactive-child">
              <Image
                src="/images/salim-gomri.jpg"
                alt=""
                width={40}
                height={40}
                className="about-mobile-photo"
                style={{ boxShadow: `0 0 0 2px ${NAVY}` }}
                aria-hidden
              />
              <h2 className="about-mobile-title" style={{ color: NAVY }}>
                Coaching Agile
              </h2>
              <p className="about-mobile-sub" style={{ color: NAVY }}>
                {yearsExperience} {t.b2SubSuffix}
              </p>
            </div>

            <div className="about-block-desktop about-interactive-child">
              <Image
                src="/images/salim-gomri.jpg"
                alt="Salim Gomri"
                width={300}
                height={300}
                className="mb-4 h-[120px] w-[120px] rounded-full object-cover"
                style={{ boxShadow: `0 0 0 4px ${NAVY}` }}
                priority
              />
              <h2 className="text-2xl font-bold" style={{ color: NAVY }}>
                Coaching Agile
              </h2>
              <p className="mt-2 text-sm font-semibold" style={{ color: NAVY }}>
                {yearsExperience} {t.b2SubSuffix}
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed" style={{ color: NAVY_LIGHT }}>
                {t.b2Body}
              </p>
              <AboutQr src={LINKEDIN_QR} alt="QR code — LinkedIn" />
              <span
                className="about-cta mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold"
                style={{ backgroundColor: NAVY, color: GOLD }}
              >
                {t.b2Cta}
              </span>
            </div>
          </a>
        </div>

        {/* COLONNE 3 — Prendre RDV */}
        <div className="about-block-wrap about-delay-3">
          <a
            href="https://calendly.com/salimdulux/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="about-block"
            style={{ backgroundColor: NAVY }}
          >
            <span className="about-overlay" style={{ backgroundColor: GOLD }} />
            <span className="about-mobile-tap" aria-hidden>
              ↗
            </span>

            <div className="about-block-mobile about-interactive-child">
              <span className="about-mobile-icon" aria-hidden>
                <PhoneIcon color={GOLD} size={40} />
              </span>
              <h2 className="about-mobile-title" style={{ color: GOLD }}>
                {t.b3Title}
              </h2>
              <p className="about-mobile-sub" style={{ color: '#ffffff' }}>
                {t.b3Sub}
              </p>
            </div>

            <div className="about-block-desktop about-interactive-child">
              <span
                className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full"
                style={{ border: `1.5px solid ${GOLD}` }}
              >
                <PhoneIcon color={GOLD} />
              </span>
              <h2 className="text-2xl font-bold" style={{ color: GOLD }}>
                {t.b3Title}
              </h2>
              <p className="mt-2 text-sm font-semibold" style={{ color: '#ffffff' }}>
                {t.b3Sub}
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed" style={{ color: MUTED }}>
                {t.b3Body}
              </p>
              <AboutQr src={CALENDLY_QR} alt="QR code — Calendly" />
              <span
                className="about-cta mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold"
                style={{ backgroundColor: GOLD, color: NAVY }}
              >
                {t.b3Cta}
              </span>
            </div>
          </a>
        </div>
      </div>

      <a
        href="https://aigile.lu"
        target="_blank"
        rel="noopener noreferrer"
        className="about-universe-strip"
        aria-label={t.universeCta.replace(' →', '')}
      >
        <div className="about-universe-marquee" aria-hidden>
          <div className="about-universe-marquee-pill">
            <div className="about-universe-marquee-track">
              <span>{MARQUEE_TOOLS}</span>
              <span>{MARQUEE_TOOLS}</span>
            </div>
          </div>
        </div>
        <span className="about-universe-cta">{t.universeCta}</span>
      </a>
    </main>
  )
}
