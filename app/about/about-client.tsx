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
  b2Title: string
  b2Sub: string
  b2Body: string
  b2Cta: string
  b3SubSuffix: string
  b3Body: string
  b3Cta: string
  b4Title: string
  b4Sub: string
  b4Body: string
  b4Cta: string
  universeCta: string
}> = {
  fr: {
    b1Sub: 'Mon livre',
    b1Body:
      'Scrum Augmenté, Livré en Incrémental et Mesuré. Construit sur 300+ rétrospectives réelles, pour sortir du Scrum de façade.',
    b1Cta: 'Découvrir le livre',
    b2Title: 'Univers AIgile',
    b2Sub: 'Outils & plateforme',
    b2Body: 'Rétro IA, Scoring, Dashboard Manager, Westrum et plus.',
    b2Cta: "Découvrir l'univers",
    b3SubSuffix: 'ans de terrain',
    b3Body: 'Scrum Masters, équipes, managers en transition. Luxembourg et remote.',
    b3Cta: 'Me suivre sur LinkedIn',
    b4Title: 'Prendre RDV',
    b4Sub: '30 min, gratuit',
    b4Body: 'Session découverte pour parler de ton contexte.',
    b4Cta: 'Réserver maintenant',
    universeCta: "Découvre tout l'univers AIgile →",
  },
  en: {
    b1Sub: 'My book',
    b1Body:
      'Scrum Augmented, Delivered Incrementally and Measured. Built on 300+ real retrospectives, to move past surface-level Scrum.',
    b1Cta: 'Discover the book',
    b2Title: 'AIgile Universe',
    b2Sub: 'Tools & platform',
    b2Body: 'AI Retro, Scoring, Dashboard Manager, Westrum and more.',
    b2Cta: 'Explore the universe',
    b3SubSuffix: 'years in the field',
    b3Body: 'Scrum Masters, teams, managers in transition. Luxembourg and remote.',
    b3Cta: 'Follow me on LinkedIn',
    b4Title: 'Book a call',
    b4Sub: '30 min, free',
    b4Body: 'Discovery session to talk about your context.',
    b4Cta: 'Book now',
    universeCta: 'Explore the full AIgile universe →',
  },
}

const MARQUEE_TOOLS =
  'Rétro IA · Scoring Deliverable · Dashboard Manager · Westrum Survey · Prompt Library'

const SALIM_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aigile.lu/salim&color=0f2240&bgcolor=ffffff'
const AIGILE_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aigile.lu&color=0f2240&bgcolor=ffffff'
const LINKEDIN_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.linkedin.com/in/salimgomri/&color=0f2240&bgcolor=ffffff'
const CALENDLY_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://calendly.com/salimdulux/30min&color=0f2240&bgcolor=ffffff'

function AboutQr({ src, alt, size = 'md' }: { src: string; alt: string; size?: 'sm' | 'md' }) {
  return (
    <div className={`about-qr about-interactive-child ${size === 'sm' ? 'about-qr-sm' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={200}
        height={200}
        unoptimized
        className={size === 'sm' ? 'h-auto w-[64px]' : 'h-auto w-[90px]'}
      />
    </div>
  )
}

function HomeIcon({ color, size = 40 }: { color: string; size?: number }) {
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
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  )
}

function PhoneIcon({ color, size = 40 }: { color: string; size?: number }) {
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
        className="about-top-back fixed left-4 top-4 z-[101] rounded-full no-underline"
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

      <div className="about-top-lang fixed right-4 top-4 z-[101] flex gap-2">
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

      {/* Grille 2×2 */}
      <div className="about-grid">
        {/* 1 — Le Système S.A.L.I.M. */}
        <div className="about-block-wrap about-delay-1">
          <a
            href="https://aigile.lu/salim"
            target="_self"
            className="about-block"
            style={{ backgroundColor: NAVY }}
          >
            <span className="about-overlay" style={{ backgroundColor: GOLD }} />
            <span className="about-mobile-tap" aria-hidden>
              ↗
            </span>
            <div className="about-block-mobile about-interactive-child">
              <Image
                src="/images/book-cover.jpg"
                alt=""
                width={40}
                height={40}
                className="about-mobile-thumb"
                aria-hidden
              />
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
                className="mb-2 h-auto w-[100px] rounded-md"
                priority
              />
              <h2 className="text-lg font-bold" style={{ color: GOLD }}>
                Le Système S.A.L.I.M.
              </h2>
              <p className="mt-1 text-xs font-semibold" style={{ color: '#ffffff' }}>
                {t.b1Sub}
              </p>
              <p className="mt-1 max-w-[200px] text-[11px] leading-snug" style={{ color: MUTED }}>
                {t.b1Body}
              </p>
              <AboutQr src={SALIM_QR} alt="QR code — aigile.lu/salim" />
              <span
                className="about-cta mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold"
                style={{ backgroundColor: GOLD, color: NAVY }}
              >
                {t.b1Cta}
              </span>
            </div>
          </a>
        </div>

        {/* 2 — Univers AIgile */}
        <div className="about-block-wrap about-delay-2">
          <a
            href="https://aigile.lu"
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
              <span className="about-mobile-icon" aria-hidden>
                <HomeIcon color={NAVY} size={40} />
              </span>
              <h2 className="about-mobile-title" style={{ color: NAVY }}>
                {t.b2Title}
              </h2>
              <p className="about-mobile-sub" style={{ color: NAVY }}>
                {t.b2Sub}
              </p>
            </div>
            <div className="about-block-desktop about-interactive-child">
              <span
                className="mb-2 flex h-[56px] w-[56px] items-center justify-center rounded-full"
                style={{ border: `1.5px solid ${NAVY}` }}
              >
                <HomeIcon color={NAVY} size={32} />
              </span>
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                {t.b2Title}
              </h2>
              <p className="mt-1 text-xs font-semibold" style={{ color: NAVY }}>
                {t.b2Sub}
              </p>
              <p className="mt-1 max-w-[200px] text-[11px] leading-snug" style={{ color: NAVY_LIGHT }}>
                {t.b2Body}
              </p>
              <AboutQr src={AIGILE_QR} alt="QR code — aigile.lu" />
              <span
                className="about-cta mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold"
                style={{ backgroundColor: NAVY, color: GOLD }}
              >
                {t.b2Cta}
              </span>
            </div>
          </a>
        </div>

        {/* 3 — Coaching Agile */}
        <div className="about-block-wrap about-delay-3">
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
                {yearsExperience} {t.b3SubSuffix}
              </p>
            </div>
            <div className="about-block-desktop about-interactive-child">
              <Image
                src="/images/salim-gomri.jpg"
                alt="Salim Gomri"
                width={300}
                height={300}
                className="mb-2 h-[80px] w-[80px] rounded-full object-cover"
                style={{ boxShadow: `0 0 0 3px ${NAVY}` }}
                priority
              />
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                Coaching Agile
              </h2>
              <p className="mt-1 text-xs font-semibold" style={{ color: NAVY }}>
                {yearsExperience} {t.b3SubSuffix}
              </p>
              <p className="mt-1 max-w-[200px] text-[11px] leading-snug" style={{ color: NAVY_LIGHT }}>
                {t.b3Body}
              </p>
              <AboutQr src={LINKEDIN_QR} alt="QR code — LinkedIn" />
              <span
                className="about-cta mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold"
                style={{ backgroundColor: NAVY, color: GOLD }}
              >
                {t.b3Cta}
              </span>
            </div>
          </a>
        </div>

        {/* 4 — Prendre RDV */}
        <div className="about-block-wrap about-delay-4">
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
                {t.b4Title}
              </h2>
              <p className="about-mobile-sub" style={{ color: '#ffffff' }}>
                {t.b4Sub}
              </p>
            </div>
            <div className="about-block-desktop about-interactive-child">
              <span
                className="mb-2 flex h-[56px] w-[56px] items-center justify-center rounded-full"
                style={{ border: `1.5px solid ${GOLD}` }}
              >
                <PhoneIcon color={GOLD} size={32} />
              </span>
              <h2 className="text-lg font-bold" style={{ color: GOLD }}>
                {t.b4Title}
              </h2>
              <p className="mt-1 text-xs font-semibold" style={{ color: '#ffffff' }}>
                {t.b4Sub}
              </p>
              <p className="mt-1 max-w-[200px] text-[11px] leading-snug" style={{ color: MUTED }}>
                {t.b4Body}
              </p>
              <AboutQr src={CALENDLY_QR} alt="QR code — Calendly" />
              <span
                className="about-cta mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold"
                style={{ backgroundColor: GOLD, color: NAVY }}
              >
                {t.b4Cta}
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Bande Univers AIgile — sous la grille, plus haute */}
      <a
        href="https://aigile.lu"
        target="_blank"
        rel="noopener noreferrer"
        className="about-universe-strip"
        aria-label={t.universeCta.replace(' →', '')}
      >
        <span className="about-universe-brand" aria-hidden>
          <span className="about-universe-logo-mark">A</span>
          <span className="about-universe-logo-text">AIgile</span>
        </span>
        <div className="about-universe-marquee" aria-hidden>
          <div className="about-universe-marquee-pill">
            <div className="about-universe-marquee-track">
              <span>{MARQUEE_TOOLS}</span>
              <span>{MARQUEE_TOOLS}</span>
            </div>
          </div>
        </div>
        <AboutQr src={AIGILE_QR} alt="QR code — aigile.lu" size="sm" />
        <span className="about-universe-cta">{t.universeCta}</span>
      </a>
    </main>
  )
}
