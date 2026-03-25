'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DM_Serif_Display, Syne } from 'next/font/google'
import { useLanguage } from '../language-provider'
import { trackEvent } from '@/lib/gtag'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hero-dm',
})

const syne = Syne({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hero-syne',
})

/** Marque AIgile (aligné tailwind aigile-gold / book-orange) */
const GOLD = 'var(--aigile-hero-gold)'
const ORANGE = 'var(--aigile-hero-orange)'
const GOLD_DIM = 'var(--aigile-hero-gold-dim)'
const NAVY_CTA = '#0f2240'

function PulseDot({ reducedMotion: rm }: { reducedMotion?: boolean }) {
  const color = GOLD
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${rm ? '' : 'landing-hero-pulse-dot'}`}
      style={{ background: color }}
      aria-hidden
    />
  )
}

/** Acronyme S.A.L.I.M décodé — 2 lignes, initiales en or */
function SalimSubtitle({ lang }: { lang: 'fr' | 'en' }) {
  const gold = GOLD
  const sep = <span className="mx-1 text-[var(--aigile-muted)]">·</span>
  if (lang === 'fr') {
    return (
      <div
        className="max-w-xl space-y-2 text-white/90"
        style={{ fontFamily: 'var(--font-hero-syne), system-ui, sans-serif' }}
      >
        <div className="flex flex-wrap items-baseline gap-x-1 text-[clamp(1rem,2.4vw,1.35rem)] font-medium leading-snug tracking-tight">
          <span>
            <span className="font-extrabold" style={{ color: gold }}>
              S
            </span>
            crum
          </span>
          {sep}
          <span>
            <span className="font-extrabold" style={{ color: gold }}>
              A
            </span>
            ugmenté
          </span>
          {sep}
          <span>
            <span className="font-extrabold" style={{ color: gold }}>
              L
            </span>
            ivré
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-1 text-[clamp(1rem,2.4vw,1.35rem)] font-medium leading-snug tracking-tight">
          <span>
            <span className="font-extrabold" style={{ color: gold }}>
              I
            </span>
            ncrémental &
          </span>
          {sep}
          <span>
            <span className="font-extrabold" style={{ color: gold }}>
              M
            </span>
            esurable
          </span>
        </div>
      </div>
    )
  }
  return (
    <div
      className="max-w-xl space-y-2 text-white/90"
      style={{ fontFamily: 'var(--font-hero-syne), system-ui, sans-serif' }}
    >
      <div className="flex flex-wrap items-baseline gap-x-1 text-[clamp(1rem,2.4vw,1.35rem)] font-medium leading-snug tracking-tight">
        <span>
          <span className="font-extrabold" style={{ color: gold }}>
            S
          </span>
          crum
        </span>
        {sep}
        <span>
          <span className="font-extrabold" style={{ color: gold }}>
            A
          </span>
          ugmented
        </span>
        {sep}
        <span>
          <span className="font-extrabold" style={{ color: gold }}>
            L
          </span>
          ead
        </span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-1 text-[clamp(1rem,2.4vw,1.35rem)] font-medium leading-snug tracking-tight">
        <span>
          <span className="font-extrabold" style={{ color: gold }}>
            I
          </span>
          ncrease &
        </span>
        {sep}
        <span>
          <span className="font-extrabold" style={{ color: gold }}>
            M
          </span>
          easure
        </span>
      </div>
    </div>
  )
}

function ScoringRingMockup({ lang }: { lang: 'fr' | 'en' }) {
  const size = 140
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = 0.83
  const criteria =
    lang === 'fr'
      ? [
          { label: 'Clarté', score: '9/10', w: 90 },
          { label: 'Complétude', score: '8/10', w: 80 },
          { label: 'Valeur métier', score: '7/10', w: 70 },
        ]
      : [
          { label: 'Clarity', score: '9/10', w: 90 },
          { label: 'Completeness', score: '8/10', w: 80 },
          { label: 'Business value', score: '7/10', w: 70 },
        ]
  return (
    <div
      className="relative flex flex-col items-center gap-6 rounded-2xl p-6"
      style={{
        background: 'var(--aigile-card)',
        border: '1px solid var(--aigile-border)',
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-0.5 rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        }}
      />
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(201,151,58,0.18)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={GOLD}
            strokeWidth={stroke}
            strokeDasharray={`${c * pct} ${c}`}
            strokeLinecap="round"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center gap-1 text-center"
          style={{ fontFamily: 'var(--font-hero-dm), Georgia, serif' }}
        >
          <span className="text-[32px] leading-none text-[var(--aigile-white)]">83</span>
          <span
            className="self-end pb-1 text-[12px] leading-none"
            style={{ color: 'var(--aigile-muted)', fontFamily: 'var(--font-hero-syne), sans-serif' }}
          >
            /100
          </span>
        </div>
      </div>
      <div className="w-full space-y-3" style={{ fontFamily: 'var(--font-hero-syne), sans-serif' }}>
        {criteria.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between text-[12px] text-[var(--aigile-white)]">
              <span>{row.label}</span>
              <span style={{ color: 'var(--aigile-muted)' }}>{row.score}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full"
                style={{ width: `${row.w}%`, background: GOLD }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RetroMockup({ lang }: { lang: 'fr' | 'en' }) {
  const rows =
    lang === 'fr'
      ? [
          { dot: '#c9973a', label: 'Équipe silencieuse', pct: 82 },
          { dot: '#e8961e', label: 'Blame culture', pct: 58 },
          { dot: '#d4a84b', label: 'Retros sans impact', pct: 71 },
          { dot: '#b8860f', label: 'Manque de focus', pct: 44 },
        ]
      : [
          { dot: '#c9973a', label: 'Silent team', pct: 82 },
          { dot: '#e8961e', label: 'Blame culture', pct: 58 },
          { dot: '#d4a84b', label: 'Low-impact retros', pct: 71 },
          { dot: '#b8860f', label: 'Lack of focus', pct: 44 },
        ]
  const title = lang === 'fr' ? 'Diagnostic équipe' : 'Team diagnostic'
  const sub = lang === 'fr' ? '9 patterns détectés' : '9 patterns detected'
  return (
    <div
      className="relative flex w-full max-w-[380px] flex-col gap-4 rounded-2xl p-5"
      style={{
        background: 'var(--aigile-card)',
        border: '1px solid var(--aigile-border)',
        fontFamily: 'var(--font-hero-syne), sans-serif',
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-0.5 rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, ${ORANGE}, transparent)`,
        }}
      />
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--aigile-white)]">
          <span aria-hidden>🔍</span>
          <span>{title}</span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--aigile-muted)' }}>
          {sub}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: row.dot }} />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2 text-[12px] text-[var(--aigile-white)]">
                <span className="truncate">{row.label}</span>
                <span style={{ color: 'var(--aigile-muted)' }}>{row.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${row.pct}%`, background: row.dot }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LandingHero() {
  const { language } = useLanguage()
  const [slide, setSlide] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const fn = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % 3)
    }, 5000)
    return () => window.clearInterval(id)
  }, [slide, reducedMotion])

  const go = useCallback((i: number) => {
    setSlide(((i % 3) + 3) % 3)
  }, [])

  const copy = useMemo(() => {
    if (language === 'fr') {
      return {
        s1: {
          badge: 'Pré-commande ouverte',
          eyebrow: 'Nouveau livre · Spring 2026',
          title: 'Le Système S.A.L.I.M',
          body:
            "Le premier guide complet pour implémenter le Scrum augmenté par l'IA dans votre équipe. 21 ans de terrain, condensés en un système actionnable.",
          primary: 'Pré-commander →',
          ghost: 'Découvrir le contenu ›',
        },
        s2: {
          badge: 'Outil phare',
          eyebrow: 'Intelligence · Rétrospective',
          title: 'Retro AI Tool',
          body:
            'Diagnostiquez 9 dysfonctionnements d’équipe. Activités ciblées parmi 146 formats Retromat. Timing terrain intelligent.',
          primary: 'Essayer gratuitement →',
          ghost: 'Voir le parcours ›',
        },
        s3: {
          badge: 'Nouveau · Beta',
          eyebrow: 'Qualité · Livrables',
          title: 'Scoring Deliverable',
          body:
            'Évaluez la qualité de vos livrables Scrum en secondes. Score objectif, critères terrain, recommandations actionnables.',
          teaser: 'Bientôt le 9 avril — demandez un early access illimité.',
          primary: 'Demander un early access illimité →',
          ghost: 'En savoir plus ›',
        },
      }
    }
    return {
      s1: {
        badge: 'Pre-order open',
        eyebrow: 'New book · Spring 2026',
        title: 'The S.A.L.I.M System',
        body:
          'The first complete guide to implementing AI-augmented Scrum in your team. 21 years in the field, distilled into an actionable system.',
        primary: 'Pre-order →',
        ghost: "See what's inside ›",
      },
      s2: {
        badge: 'Flagship tool',
        eyebrow: 'Intelligence · Retrospective',
        title: 'Retro AI Tool',
        body:
          'Diagnose 9 team dysfunctions. Targeted activities across 146 Retromat formats. Smart, field-tested timing.',
        primary: 'Try it free →',
        ghost: 'See the journey ›',
      },
      s3: {
        badge: 'New · Beta',
        eyebrow: 'Quality · Deliverables',
        title: 'Scoring Deliverable',
        body:
          'Assess Scrum deliverable quality in seconds. Objective scoring, field criteria, actionable recommendations.',
        teaser: 'Coming April 9 — request unlimited early access.',
        primary: 'Request unlimited early access →',
        ghost: 'Learn more ›',
      },
    }
  }, [language])

  const staggerDelays = ['0.05s', '0.1s', '0.17s', '0.24s', '0.31s']

  return (
    <section
      className={`relative w-full overflow-x-hidden ${dmSerif.variable} ${syne.variable}`}
      style={{
        background: 'var(--aigile-black)',
        fontFamily: 'var(--font-hero-syne), system-ui, sans-serif',
      }}
    >
      {/* Fond or / orange discret (marque initiale) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 85% 65% at 72% 38%, ${GOLD_DIM}, transparent 55%),
              radial-gradient(ellipse 55% 45% at 18% 55%, rgba(232, 150, 30, 0.07), transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="overflow-hidden">
          <div
            className={`flex w-[300%] transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] ${
              reducedMotion ? '' : 'duration-[650ms]'
            }`}
            style={{
              transform: `translateX(-${slide * (100 / 3)}%)`,
            }}
          >
            {/* Slide 1 — Book */}
            <div
              className="box-border flex w-1/3 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
              style={{ background: 'var(--aigile-black)' }}
            >
              <div
                key={`s0-${slide === 0}`}
                className="flex flex-1 flex-col justify-center gap-5 px-6 py-12 md:px-12 lg:px-16"
              >
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{ animationDelay: staggerDelays[0] }}
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={{
                      background: GOLD_DIM,
                      color: GOLD,
                      border: '1px solid rgba(201,151,58,0.35)',
                    }}
                  >
                    <PulseDot reducedMotion={reducedMotion} />
                    {copy.s1.badge}
                  </span>
                </div>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger text-sm'}
                  style={{ color: 'var(--aigile-muted)', animationDelay: staggerDelays[1] }}
                >
                  {copy.s1.eyebrow}
                </p>
                <h1
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{
                    fontFamily: 'var(--font-hero-dm), Georgia, serif',
                    fontSize: 'clamp(2rem, 5vw, 52px)',
                    lineHeight: 1.08,
                    color: 'var(--aigile-white)',
                    animationDelay: staggerDelays[2],
                  }}
                >
                  {copy.s1.title}
                </h1>
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{ animationDelay: '0.22s' }}
                >
                  <SalimSubtitle lang={language === 'fr' ? 'fr' : 'en'} />
                </div>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger max-w-xl text-[15px] leading-relaxed'}
                  style={{ color: 'rgba(240,237,230,0.85)', animationDelay: '0.3s' }}
                >
                  {copy.s1.body}
                </p>
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger flex flex-col gap-3 sm:flex-row sm:items-center'}
                  style={{ animationDelay: '0.38s' }}
                >
                  <Link
                    href="#book"
                    onClick={() => trackEvent('hero_preorder', { slide: 'book' })}
                    className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                    style={{
                      background: GOLD,
                      color: NAVY_CTA,
                    }}
                  >
                    {copy.s1.primary}
                  </Link>
                  <a
                    href="#book"
                    className="text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                    style={{ color: 'var(--aigile-muted)' }}
                    onClick={() => trackEvent('hero_book_ghost', { slide: 'book' })}
                  >
                    {copy.s1.ghost}
                  </a>
                </div>
              </div>
              <div className="flex min-h-0 flex-1 flex-col items-stretch justify-center px-4 pb-10 max-[479px]:hidden md:pb-12 md:pl-2 md:pr-10 lg:pr-14">
                <Link
                  href="#book"
                  onClick={() => trackEvent('hero_preorder', { slide: 'book', source: 'hero_visual' })}
                  className="group relative mx-auto flex w-full max-w-[min(100%,440px)] flex-col items-center rounded-2xl px-2 pb-2 pt-6 outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#c9973a]/70"
                  aria-label={
                    language === 'fr'
                      ? 'Précommander — aller à la section livre'
                      : 'Pre-order — go to the book section'
                  }
                >
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(480px,58vh)] w-[min(380px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gradient-to-br from-[#c9973a]/45 via-[#e8961e]/22 to-transparent opacity-90 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div
                    className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(420px,52vh)] w-[min(320px,85vw)] -translate-x-1/2 -translate-y-1/2 rounded-[48%] bg-[#c9973a]/35 blur-2xl ${reducedMotion ? '' : 'landing-hero-book-aura-pulse'}`}
                  />
                  <div
                    className={`relative z-10 mt-2 w-full max-w-[380px] ${reducedMotion ? '' : 'landing-hero-book-alive'}`}
                  >
                    <div className="relative origin-center transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.14]">
                      <span
                        className="absolute -right-0 -top-2 z-20 rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide shadow-lg shadow-black/30 md:-right-1 md:-top-1"
                        style={{
                          background: GOLD,
                          color: NAVY_CTA,
                          fontFamily: 'var(--font-hero-syne), sans-serif',
                        }}
                      >
                        {language === 'fr' ? 'Précommander' : 'Pre-order'}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element -- object-fit contain + explicit dimensions per design */}
                      <img
                        src="/images/book-cover.jpg"
                        alt=""
                        width={320}
                        height={480}
                        className="relative z-10 mx-auto h-auto max-h-[min(420px,52vh)] w-auto object-contain drop-shadow-[0_0_50px_rgba(201,151,58,0.45)] transition-[filter] duration-500 group-hover:drop-shadow-[0_0_80px_rgba(201,151,58,0.65)]"
                        style={{
                          transform: 'perspective(900px) rotateY(-10deg)',
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--aigile-muted)] transition-colors duration-300 group-hover:text-[#c9973a]/90"
                    aria-hidden
                  >
                    {language === 'fr' ? 'Toucher pour précommander' : 'Tap to pre-order'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Slide 2 — Retro */}
            <div
              className="box-border flex w-1/3 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
              style={{ background: 'var(--aigile-black)' }}
            >
              <div
                key={`s1-${slide === 1}`}
                className="flex flex-1 flex-col justify-center gap-5 px-6 py-12 md:px-12 lg:px-16"
              >
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{ animationDelay: staggerDelays[0] }}
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={{
                      background: GOLD_DIM,
                      color: GOLD,
                      border: '1px solid rgba(201,151,58,0.35)',
                    }}
                  >
                    <PulseDot reducedMotion={reducedMotion} />
                    {copy.s2.badge}
                  </span>
                </div>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger text-sm'}
                  style={{ color: 'var(--aigile-muted)', animationDelay: staggerDelays[1] }}
                >
                  {copy.s2.eyebrow}
                </p>
                <h1
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{
                    fontFamily: 'var(--font-hero-dm), Georgia, serif',
                    fontSize: 'clamp(2rem, 5vw, 52px)',
                    lineHeight: 1.08,
                    color: 'var(--aigile-white)',
                    animationDelay: staggerDelays[2],
                  }}
                >
                  {copy.s2.title}
                </h1>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger max-w-xl text-[15px] leading-relaxed'}
                  style={{ color: 'rgba(240,237,230,0.85)', animationDelay: staggerDelays[3] }}
                >
                  {copy.s2.body}
                </p>
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger flex flex-col gap-3 sm:flex-row sm:items-center'}
                  style={{ animationDelay: staggerDelays[4] }}
                >
                  <Link
                    href="/retro"
                    onClick={() => trackEvent('hero_retro', { slide: 'retro' })}
                    className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                    style={{
                      background: GOLD,
                      color: NAVY_CTA,
                    }}
                  >
                    {copy.s2.primary}
                  </Link>
                  <Link
                    href="/parcours"
                    className="text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                    style={{ color: 'var(--aigile-muted)' }}
                    onClick={() => trackEvent('hero_retro_ghost', { slide: 'retro' })}
                  >
                    {copy.s2.ghost}
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-4 pb-12 max-[479px]:hidden md:pb-12 md:pl-2 md:pr-10">
                <Link
                  href="/retro"
                  onClick={() => trackEvent('hero_retro', { slide: 'retro', source: 'hero_visual' })}
                  className={`group relative block w-full max-w-[400px] rounded-2xl p-2 outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#c9973a]/70 ${reducedMotion ? '' : 'landing-hero-visual-in'}`}
                  aria-label={language === 'fr' ? 'Essayer Retro AI gratuitement' : 'Try Retro AI for free'}
                >
                  <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#c9973a]/35 to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={reducedMotion ? '' : 'landing-hero-visual-breathe'}>
                    <div className="relative origin-center transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.14]">
                      <RetroMockup lang={language === 'fr' ? 'fr' : 'en'} />
                    </div>
                  </div>
                  <span
                    className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--aigile-muted)] transition-colors group-hover:text-[#c9973a]/85"
                    aria-hidden
                  >
                    {language === 'fr' ? 'Ouvrir Retro AI' : 'Open Retro AI'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Slide 3 — Scoring */}
            <div
              className="box-border flex w-1/3 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
              style={{ background: 'var(--aigile-black)' }}
            >
              <div
                key={`s2-${slide === 2}`}
                className="flex flex-1 flex-col justify-center gap-5 px-6 py-12 md:px-12 lg:px-16"
              >
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{ animationDelay: staggerDelays[0] }}
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={{
                      background: GOLD_DIM,
                      color: GOLD,
                      border: '1px solid rgba(201,151,58,0.35)',
                    }}
                  >
                    <PulseDot reducedMotion={reducedMotion} />
                    {copy.s3.badge}
                  </span>
                </div>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger text-sm'}
                  style={{ color: 'var(--aigile-muted)', animationDelay: staggerDelays[1] }}
                >
                  {copy.s3.eyebrow}
                </p>
                <h1
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{
                    fontFamily: 'var(--font-hero-dm), Georgia, serif',
                    fontSize: 'clamp(2rem, 5vw, 52px)',
                    lineHeight: 1.08,
                    color: 'var(--aigile-white)',
                    animationDelay: staggerDelays[2],
                  }}
                >
                  {copy.s3.title}
                </h1>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger max-w-xl text-[15px] leading-relaxed'}
                  style={{ color: 'rgba(240,237,230,0.85)', animationDelay: staggerDelays[3] }}
                >
                  {copy.s3.body}
                </p>
                <p
                  className="text-[13px] font-semibold leading-snug"
                  style={{ color: ORANGE, fontFamily: 'var(--font-hero-syne), sans-serif' }}
                >
                  {copy.s3.teaser}
                </p>
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger flex flex-col gap-3 sm:flex-row sm:items-center'}
                  style={{ animationDelay: staggerDelays[4] }}
                >
                  <Link
                    href="/scoring"
                    onClick={() => trackEvent('hero_scoring_early_access', { slide: 'scoring' })}
                    className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                    style={{
                      background: GOLD,
                      color: NAVY_CTA,
                    }}
                  >
                    {copy.s3.primary}
                  </Link>
                  <Link
                    href="/scoring-deliverable"
                    className="text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                    style={{ color: 'var(--aigile-muted)' }}
                    onClick={() => trackEvent('hero_scoring_ghost', { slide: 'scoring' })}
                  >
                    {copy.s3.ghost}
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-4 pb-12 max-[479px]:hidden md:pb-12 md:pl-2 md:pr-10">
                <Link
                  href="/scoring"
                  onClick={() =>
                    trackEvent('hero_scoring_early_access', { slide: 'scoring', source: 'hero_visual' })
                  }
                  className={`group relative block w-full max-w-[340px] rounded-2xl p-2 outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#c9973a]/70 ${reducedMotion ? '' : 'landing-hero-visual-in'}`}
                  aria-label={
                    language === 'fr'
                      ? 'Demander un early access illimité — Scoring Deliverable'
                      : 'Request unlimited early access — Scoring Deliverable'
                  }
                >
                  <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#e8961e]/30 to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={reducedMotion ? '' : 'landing-hero-visual-breathe'}>
                    <div className="relative origin-center transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.14]">
                      <ScoringRingMockup lang={language === 'fr' ? 'fr' : 'en'} />
                    </div>
                  </div>
                  <span
                    className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--aigile-muted)] transition-colors group-hover:text-[#e8961e]/90"
                    aria-hidden
                  >
                    {language === 'fr' ? 'Demander l’early access' : 'Request early access'}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 pb-10 pt-2">
          <button
            type="button"
            aria-label="Slide précédent"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white/[0.1]"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--aigile-muted)' }}
            onClick={() => go(slide - 1)}
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => {
              const active = slide === i
              const color = GOLD
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  aria-current={active}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: active ? 44 : 28,
                    height: 4,
                    background: active ? color : 'rgba(255,255,255,0.12)',
                  }}
                  onClick={() => go(i)}
                />
              )
            })}
          </div>
          <button
            type="button"
            aria-label="Slide suivant"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white/[0.1]"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--aigile-muted)' }}
            onClick={() => go(slide + 1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
