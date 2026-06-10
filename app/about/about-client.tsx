'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { getSalimYearsExperience } from '@/lib/salim-experience'

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

function AboutQr({
  src,
  alt,
  size = 'md',
}: {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClass =
    size === 'sm' ? 'about-qr-img-sm' : size === 'lg' ? 'about-qr-img-lg' : 'about-qr-img-md'

  return (
    <div
      className={`about-qr about-interactive-child ${size === 'sm' ? 'about-qr-sm' : ''} ${size === 'lg' ? 'about-qr-lg' : ''}`}
    >
      <Image src={src} alt={alt} width={200} height={200} unoptimized className={sizeClass} />
    </div>
  )
}

function AboutMobileCase({
  title,
  sub,
  qrSrc,
  qrAlt,
  titleColor,
  subColor,
}: {
  title: string
  sub: string
  qrSrc: string
  qrAlt: string
  titleColor: string
  subColor: string
}) {
  return (
    <div className="about-block-mobile about-interactive-child">
      <h2 className="about-mobile-title" style={{ color: titleColor }}>
        {title}
      </h2>
      <AboutQr src={qrSrc} alt={qrAlt} size="lg" />
      <p className="about-mobile-sub" style={{ color: subColor }}>
        {sub}
      </p>
    </div>
  )
}

function AboutWireCta({ label, color }: { label: string; color: string }) {
  return (
    <span className="about-wire-cta about-interactive-child" style={{ color, borderColor: color }}>
      <span aria-hidden>→</span>
      {label}
    </span>
  )
}

function AboutDesktopCase({
  title,
  sub,
  body,
  cta,
  qrSrc,
  qrAlt,
  titleColor,
  subColor,
  bodyColor,
  ctaColor,
  visual,
}: {
  title: string
  sub: string
  body: string
  cta: string
  qrSrc: string
  qrAlt: string
  titleColor: string
  subColor: string
  bodyColor: string
  ctaColor: string
  visual: ReactNode
}) {
  return (
    <div className="about-block-desktop about-interactive-child">
      <div className="about-desktop-visual">{visual}</div>
      <div className="about-desktop-content">
        <h2 className="about-desktop-title" style={{ color: titleColor }}>
          {title}
        </h2>
        <p className="about-desktop-sub" style={{ color: subColor }}>
          {sub}
        </p>
        <p className="about-desktop-body" style={{ color: bodyColor }}>
          {body}
        </p>
        <div className="about-desktop-actions">
          <AboutQr src={qrSrc} alt={qrAlt} />
          <AboutWireCta label={cta} color={ctaColor} />
        </div>
      </div>
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
  const yearsExperience = getSalimYearsExperience()

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

      <div className="about-grid">
        {/* 1 — Le Système S.A.L.I.M. → aigile.lu/salim */}
        <div className="about-block-wrap about-delay-1">
          <a
            href="https://aigile.lu/salim"
            target="_self"
            className="about-block"
            style={{ backgroundColor: NAVY }}
            aria-label={`Le Système S.A.L.I.M. — ${t.b1Cta}`}
          >
            <span className="about-overlay" style={{ backgroundColor: GOLD }} />
            <span className="about-mobile-tap" aria-hidden>
              ↗
            </span>
            <AboutMobileCase
              title="Le Système S.A.L.I.M."
              sub={t.b1Sub}
              qrSrc={SALIM_QR}
              qrAlt="QR code — aigile.lu/salim"
              titleColor={GOLD}
              subColor="#ffffff"
            />
            <AboutDesktopCase
              title="Le Système S.A.L.I.M."
              sub={t.b1Sub}
              body={t.b1Body}
              cta={t.b1Cta}
              qrSrc={SALIM_QR}
              qrAlt="QR code — aigile.lu/salim"
              titleColor={GOLD}
              subColor="#ffffff"
              bodyColor={MUTED}
              ctaColor={GOLD}
              visual={
                <Image
                  src="/images/book-cover.jpg"
                  alt="Couverture — Le Système S.A.L.I.M."
                  width={400}
                  height={560}
                  className="about-desktop-cover"
                  priority
                />
              }
            />
          </a>
        </div>

        {/* 2 — Univers AIgile → aigile.lu */}
        <div className="about-block-wrap about-delay-2">
          <a
            href="https://aigile.lu"
            target="_blank"
            rel="noopener noreferrer"
            className="about-block"
            style={{ backgroundColor: GOLD }}
            aria-label={`${t.b2Title} — ${t.b2Cta}`}
          >
            <span className="about-overlay" style={{ backgroundColor: NAVY }} />
            <span className="about-mobile-tap" aria-hidden>
              ↗
            </span>
            <AboutMobileCase
              title={t.b2Title}
              sub={t.b2Sub}
              qrSrc={AIGILE_QR}
              qrAlt="QR code — aigile.lu"
              titleColor={NAVY}
              subColor={NAVY}
            />
            <AboutDesktopCase
              title={t.b2Title}
              sub={t.b2Sub}
              body={t.b2Body}
              cta={t.b2Cta}
              qrSrc={AIGILE_QR}
              qrAlt="QR code — aigile.lu"
              titleColor={NAVY}
              subColor={NAVY}
              bodyColor={NAVY_LIGHT}
              ctaColor={NAVY}
              visual={
                <span className="about-desktop-icon-wrap" style={{ borderColor: NAVY }}>
                  <HomeIcon color={NAVY} size={72} />
                </span>
              }
            />
          </a>
        </div>

        {/* 3 — Coaching Agile → LinkedIn */}
        <div className="about-block-wrap about-delay-3">
          <a
            href="https://www.linkedin.com/in/salimgomri/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-block"
            style={{ backgroundColor: GOLD }}
            aria-label={`Coaching Agile — ${t.b3Cta}`}
          >
            <span className="about-overlay" style={{ backgroundColor: NAVY }} />
            <span className="about-mobile-tap" aria-hidden>
              ↗
            </span>
            <AboutMobileCase
              title="Coaching Agile"
              sub={`${yearsExperience} ${t.b3SubSuffix}`}
              qrSrc={LINKEDIN_QR}
              qrAlt="QR code — LinkedIn"
              titleColor={NAVY}
              subColor={NAVY}
            />
            <AboutDesktopCase
              title="Coaching Agile"
              sub={`${yearsExperience} ${t.b3SubSuffix}`}
              body={t.b3Body}
              cta={t.b3Cta}
              qrSrc={LINKEDIN_QR}
              qrAlt="QR code — LinkedIn"
              titleColor={NAVY}
              subColor={NAVY}
              bodyColor={NAVY_LIGHT}
              ctaColor={NAVY}
              visual={
                <div className="about-desktop-photo-wrap" style={{ boxShadow: `inset 0 0 0 3px ${NAVY}` }}>
                  <Image
                    src="/images/salim-gomri.jpg"
                    alt="Salim Gomri"
                    width={400}
                    height={400}
                    className="about-desktop-photo"
                    priority
                  />
                </div>
              }
            />
          </a>
        </div>

        {/* 4 — Prendre RDV → Calendly */}
        <div className="about-block-wrap about-delay-4">
          <a
            href="https://calendly.com/salimdulux/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="about-block"
            style={{ backgroundColor: NAVY }}
            aria-label={`${t.b4Title} — ${t.b4Cta}`}
          >
            <span className="about-overlay" style={{ backgroundColor: GOLD }} />
            <span className="about-mobile-tap" aria-hidden>
              ↗
            </span>
            <AboutMobileCase
              title={t.b4Title}
              sub={t.b4Sub}
              qrSrc={CALENDLY_QR}
              qrAlt="QR code — Calendly"
              titleColor={GOLD}
              subColor="#ffffff"
            />
            <AboutDesktopCase
              title={t.b4Title}
              sub={t.b4Sub}
              body={t.b4Body}
              cta={t.b4Cta}
              qrSrc={CALENDLY_QR}
              qrAlt="QR code — Calendly"
              titleColor={GOLD}
              subColor="#ffffff"
              bodyColor={MUTED}
              ctaColor={GOLD}
              visual={
                <span className="about-desktop-icon-wrap" style={{ borderColor: GOLD }}>
                  <PhoneIcon color={GOLD} size={72} />
                </span>
              }
            />
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
