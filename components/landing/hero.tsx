'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DM_Serif_Display, Syne } from 'next/font/google'
import { useLanguage } from '../language-provider'
import { trackEvent } from '@/lib/gtag'
import type { PublicFeatureFlag } from '@/lib/feature-flags'
import { EarlyAccessRequestModal } from '@/components/landing/EarlyAccessRequestModal'
import { useSession } from '@/lib/auth-client'
import { translations } from '@/lib/translations'
import { isDashboardManagerNewBadgeActive, isWestrumNewBadgeActive } from '@/lib/tool-new-badge'
import { getHeroBookSlideBody } from '@/lib/salim-experience'

const HERO_SLIDE_COUNT = 6

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
            stroke="rgba(254, 189, 16,0.18)"
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

function DashboardMockup({ lang }: { lang: 'fr' | 'en' }) {
  const cadrans =
    lang === 'fr'
      ? [
          { label: 'On Time', rag: '#1A7A3C', val: '92%' },
          { label: 'Budget', rag: '#B85C00', val: 'ATT.' },
          { label: 'Scope', rag: '#1A7A3C', val: 'OUI' },
          { label: 'Qualité', rag: '#B01B1B', val: '12%' },
          { label: 'Maturité', rag: '#B85C00', val: '6.1' },
          { label: 'Bien-être', rag: '#1A7A3C', val: '4.2' },
        ]
      : [
          { label: 'On Time', rag: '#1A7A3C', val: '92%' },
          { label: 'Budget', rag: '#B85C00', val: 'WATCH' },
          { label: 'Scope', rag: '#1A7A3C', val: 'YES' },
          { label: 'Quality', rag: '#B01B1B', val: '12%' },
          { label: 'Maturity', rag: '#B85C00', val: '6.1' },
          { label: 'Wellbeing', rag: '#1A7A3C', val: '4.2' },
        ]
  const title = lang === 'fr' ? 'Cockpit sprint' : 'Sprint cockpit'
  const sub = lang === 'fr' ? '6 cadrans RAG' : '6 RAG dials'
  return (
    <div
      className="relative w-full max-w-[380px] rounded-2xl p-5"
      style={{
        background: 'var(--aigile-card)',
        border: '1px solid var(--aigile-border)',
        fontFamily: 'var(--font-hero-syne), sans-serif',
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, #34d399, transparent)` }}
      />
      <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="text-sm font-semibold text-[var(--aigile-white)]">{title}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--aigile-muted)]">
          {sub}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {cadrans.map((c) => (
          <div
            key={c.label}
            className="rounded-md border border-white/[0.08] px-2 py-2"
            style={{ background: `${c.rag}22` }}
          >
            <div className="text-[9px] font-bold uppercase tracking-wide text-white/70">{c.label}</div>
            <div className="mt-1 font-mono text-[13px] font-bold" style={{ color: c.rag }}>
              {c.val}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2 text-[11px]">
        <span className="text-[var(--aigile-muted)]">{lang === 'fr' ? 'Note globale' : 'Global score'}</span>
        <span className="font-mono font-bold text-[#34d399]">4.5 / 6</span>
      </div>
    </div>
  )
}

function WestrumMockup({ lang }: { lang: 'fr' | 'en' }) {
  const title = lang === 'fr' ? 'Culture organisationnelle' : 'Organizational culture'
  const sub = lang === 'fr' ? '6 questions · DORA' : '6 questions · DORA'
  const level = lang === 'fr' ? 'Générative' : 'Generative'
  const target = lang === 'fr' ? 'Cible DORA 5.5' : 'DORA target 5.5'
  return (
    <div
      className="relative w-full max-w-[380px] rounded-2xl p-5"
      style={{
        background: 'var(--aigile-card)',
        border: '1px solid var(--aigile-border)',
        fontFamily: 'var(--font-hero-syne), sans-serif',
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-0.5 rounded-t-2xl"
        style={{ background: 'linear-gradient(90deg, #138eec, transparent)' }}
      />
      <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="text-sm font-semibold text-[var(--aigile-white)]">{title}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--aigile-muted)]">
          {sub}
        </span>
      </div>
      <div className="mb-4 flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div
            key={n}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              background: n >= 5 ? 'rgba(254, 189, 16,0.25)' : 'rgba(255,255,255,0.06)',
              color: n === 6 ? GOLD : 'rgba(255,255,255,0.55)',
              border: n === 6 ? `1px solid ${GOLD}` : '1px solid transparent',
            }}
          >
            {n}
          </div>
        ))}
      </div>
      <div className="rounded-md bg-white/[0.04] px-3 py-3 text-center">
        <div className="font-mono text-3xl font-bold text-[var(--aigile-white)]">5.8</div>
        <div className="text-[11px] text-[var(--aigile-muted)]">/ 7</div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2 text-[11px]">
        <span className="font-semibold text-[#16a34a]">{level}</span>
        <span className="text-[var(--aigile-muted)]">{target}</span>
      </div>
    </div>
  )
}

function SalimQaLabMockup({ lang }: { lang: 'fr' | 'en' }) {
  const title = lang === 'fr' ? 'S.A.L.I.M. Q&A Lab' : 'S.A.L.I.M. Q&A Lab'
  const sub = lang === 'fr' ? 'Bibliothèque · livre' : 'Library · book'
  const q = lang === 'fr' ? 'Comment escalader après 3 rétros sans progrès ?' : 'How to escalate after 3 retros with no progress?'
  const excerpt = lang === 'fr' ? 'Regle des 3 retros : si le meme pattern...' : 'Rule of 3 retros: if the same pattern...'
  return (
    <div
      className="relative w-full max-w-[380px] rounded-2xl p-5"
      style={{
        background: 'var(--aigile-card)',
        border: '1px solid var(--aigile-border)',
        fontFamily: 'var(--font-hero-syne), sans-serif',
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-0.5 rounded-t-2xl"
        style={{ background: 'linear-gradient(90deg, #FEDB10, transparent)' }}
      />
      <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="text-sm font-semibold text-[var(--aigile-white)]">{title}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--aigile-muted)]">{sub}</span>
      </div>
      <div className="mb-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[12px] text-[var(--aigile-white)]">
        🔍 {q}
      </div>
      <div className="rounded-md bg-white/[0.04] px-3 py-3 text-[12px] leading-relaxed text-[var(--aigile-muted)]">
        {excerpt}
        <span style={{ color: GOLD }}> …</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="font-semibold text-[var(--aigile-muted)]">SM · Ch. 11</span>
        <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: GOLD_DIM, color: GOLD }}>
          1 crédit
        </span>
      </div>
    </div>
  )
}

function RetroMockup({ lang }: { lang: 'fr' | 'en' }) {
  const rows =
    lang === 'fr'
      ? [
          { dot: '#FEBD10', label: 'Équipe silencieuse', pct: 82 },
          { dot: '#e8961e', label: 'Blame culture', pct: 58 },
          { dot: '#d4a84b', label: 'Retros sans impact', pct: 71 },
          { dot: '#b8860f', label: 'Manque de focus', pct: 44 },
        ]
      : [
          { dot: '#FEBD10', label: 'Silent team', pct: 82 },
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
  const { data: session } = useSession()
  const [slide, setSlide] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [publicFlags, setPublicFlags] = useState<Record<string, PublicFeatureFlag>>({})
  const [scoringCanAccess, setScoringCanAccess] = useState<boolean | null>(null)
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false)

  useEffect(() => {
    fetch('/api/feature-flags')
      .then((r) => r.json())
      .then((d: { flags?: Record<string, PublicFeatureFlag> }) => {
        if (d.flags) setPublicFlags(d.flags)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const sd = publicFlags.scoring_deliverable
    if (!sd) {
      setScoringCanAccess(null)
      return
    }
    const fullyPublic = sd.is_live === true && !(sd.invite_only ?? true)
    if (fullyPublic) {
      setScoringCanAccess(null)
      return
    }
    let cancelled = false
    fetch('/api/tool-access?slug=scoring_deliverable', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d: { canAccess?: boolean }) => {
        if (!cancelled) setScoringCanAccess(!!d.canAccess)
      })
      .catch(() => {
        if (!cancelled) setScoringCanAccess(false)
      })
    return () => {
      cancelled = true
    }
  }, [publicFlags, session?.user?.id])

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
      setSlide((s) => (s + 1) % HERO_SLIDE_COUNT)
    }, 5000)
    return () => window.clearInterval(id)
  }, [slide, reducedMotion])

  const go = useCallback((i: number) => {
    setSlide(((i % HERO_SLIDE_COUNT) + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT)
  }, [])

  const copy = useMemo(() => {
    if (language === 'fr') {
      return {
        s1: {
          badge: 'Le livre',
          eyebrow: 'S.A.L.I.M — disponible',
          title: 'Le Système S.A.L.I.M',
          body: getHeroBookSlideBody('fr'),
          primary: 'Commander →',
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
        },
        s4: {
          badge: isDashboardManagerNewBadgeActive() ? 'Nouveau' : 'Manager',
          badgeNew: isDashboardManagerNewBadgeActive(),
          eyebrow: 'Management · Sprint',
          title: 'Dashboard Manager',
          body:
            'Tableau de bord manager S.A.L.I.M. : 6 cadrans RAG, vélocité, OKR et narrative IA (P25). Personnalisez et exportez en PDF.',
          primary: 'Ouvrir le studio →',
          ghost: 'Découvrir ›',
        },
        s5: {
          badge: isWestrumNewBadgeActive() ? 'Nouveau' : 'Culture',
          badgeNew: isWestrumNewBadgeActive(),
          eyebrow: 'DORA · Culture organisationnelle',
          title: 'Westrum Culture Survey',
          body:
            'Six questions Likert pour situer la culture de ton organisation — pathologique, bureaucratique ou générative. Mesure recommandée : une fois par trimestre.',
          primary: 'Passer le questionnaire →',
          ghost: 'En savoir plus ›',
        },
        s6: {
          badge: 'Nouveau',
          badgeNew: true,
          eyebrow: 'S.A.L.I.M. · Bibliothèque',
          title: 'S.A.L.I.M. Q&A Lab',
          body:
            'Toutes les questions du livre, à portée de mot. Recherche, filtres par rôle et chapitre. Réponse complète à débloquer — 1 crédit.',
          primary: 'Explorer le Q&A Lab →',
          ghost: 'Voir la suite ›',
        },
      }
    }
    return {
      s1: {
        badge: 'The book',
        eyebrow: 'S.A.L.I.M — available',
        title: 'The S.A.L.I.M System',
        body: getHeroBookSlideBody('en'),
        primary: 'Order →',
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
      },
      s4: {
        badge: isDashboardManagerNewBadgeActive() ? 'New' : 'Manager',
        badgeNew: isDashboardManagerNewBadgeActive(),
        eyebrow: 'Management · Sprint',
        title: 'Dashboard Manager',
        body:
          'S.A.L.I.M. manager dashboard: 6 RAG dials, velocity, OKRs and AI narrative (P25). Customize and export to PDF.',
        primary: 'Open studio →',
        ghost: 'Learn more ›',
      },
      s5: {
        badge: isWestrumNewBadgeActive() ? 'New' : 'Culture',
        badgeNew: isWestrumNewBadgeActive(),
        eyebrow: 'DORA · Organizational culture',
        title: 'Westrum Culture Survey',
        body:
          'Six Likert questions to map your organization’s culture — pathological, bureaucratic, or generative. Recommended cadence: once per quarter.',
        primary: 'Take the survey →',
        ghost: 'Learn more ›',
      },
      s6: {
        badge: 'New',
        badgeNew: true,
        eyebrow: 'S.A.L.I.M. · Library',
        title: 'S.A.L.I.M. Q&A Lab',
        body:
          'Every question from the book, one search away. Filter by role and chapter. Unlock full answers — 1 credit each.',
        primary: 'Open Q&A Lab →',
        ghost: 'Learn more ›',
      },
    }
  }, [language])

  const langFr = language === 'fr'
  const s3Cta = useMemo(() => {
    const t = translations[language]
    const ctaPrimary = `${t['tools-scoring-cta-use']} →`
    const sd = publicFlags.scoring_deliverable
    const live = sd?.is_live === true
    const invite = (sd?.invite_only ?? true) === true
    const unlocked = !invite || scoringCanAccess === true

    /** Admin / invité / promo : accès API — même avant date is_live (aperçu) */
    if (scoringCanAccess === true) {
      if (langFr) {
        return {
          kind: 'unlocked' as const,
          teaser: 'Disponible — évaluez vos livrables en quelques minutes.',
          primaryLabel: ctaPrimary,
          primaryHref: '/scoring-deliverable',
          ghostLabel: 'En savoir plus ›',
          ghostHref: '/#tools',
          visualLabel: 'Ouvrir Scoring Deliverable',
          visualHref: '/scoring-deliverable',
        }
      }
      return {
        kind: 'unlocked' as const,
        teaser: 'Available — score your deliverables in minutes.',
        primaryLabel: ctaPrimary,
        primaryHref: '/scoring-deliverable',
        ghostLabel: 'Learn more ›',
        ghostHref: '/#tools',
        visualLabel: 'Open Scoring Deliverable',
        visualHref: '/scoring-deliverable',
      }
    }

    /** Live + invite-only : en attente de la réponse /api/tool-access (évite flash « invitation only ») */
    if (scoringCanAccess === null && live && invite) {
      if (langFr) {
        return {
          kind: 'access_check' as const,
          teaser: 'Vérification de l’accès…',
          ghostLabel: 'Découvrir la suite d’outils ›',
          ghostHref: '/#tools',
          visualLabel: 'Scoring livraison',
        }
      }
      return {
        kind: 'access_check' as const,
        teaser: 'Checking access…',
        ghostLabel: 'Explore the tool suite ›',
        ghostHref: '/#tools',
        visualLabel: 'Delivery scoring',
      }
    }

    if (langFr) {
      if (!live) {
        return {
          kind: 'coming_soon' as const,
          teaser: 'Bientôt — demandez un early access (validation équipe).',
          ghostLabel: 'Découvrir la suite d’outils ›',
          ghostHref: '/#tools',
          visualLabel: 'Scoring livraison',
        }
      }
      if (unlocked) {
        return {
          kind: 'unlocked' as const,
          teaser: 'Disponible — évaluez vos livrables en quelques minutes.',
          primaryLabel: ctaPrimary,
          primaryHref: '/scoring-deliverable',
          ghostLabel: 'En savoir plus ›',
          ghostHref: '/#tools',
          visualLabel: 'Ouvrir Scoring Deliverable',
          visualHref: '/scoring-deliverable',
        }
      }
      return {
        kind: 'invite_gated' as const,
        teaser: 'En ligne — accès sur invitation.',
        primaryLabel: 'Se connecter pour accéder →',
        primaryHref: '/login?redirect=' + encodeURIComponent('/scoring-deliverable'),
        ghostLabel: 'Découvrir la suite d’outils ›',
        ghostHref: '/#tools',
        visualLabel: 'Accès Scoring Deliverable',
        visualHref: '/login?redirect=' + encodeURIComponent('/scoring-deliverable'),
      }
    }

    if (!live) {
      return {
        kind: 'coming_soon' as const,
        teaser: 'Coming soon — request early access for your team.',
        ghostLabel: 'Explore the tool suite ›',
        ghostHref: '/#tools',
        visualLabel: 'Delivery scoring',
      }
    }
    if (unlocked) {
      return {
        kind: 'unlocked' as const,
        teaser: 'Available — score your deliverables in minutes.',
        primaryLabel: ctaPrimary,
        primaryHref: '/scoring-deliverable',
        ghostLabel: 'Learn more ›',
        ghostHref: '/#tools',
        visualLabel: 'Open Scoring Deliverable',
        visualHref: '/scoring-deliverable',
      }
    }
    return {
      kind: 'invite_gated' as const,
      teaser: 'Live — invitation-only access.',
      primaryLabel: 'Sign in to access →',
      primaryHref: '/login?redirect=' + encodeURIComponent('/scoring-deliverable'),
      ghostLabel: 'Explore the tool suite ›',
      ghostHref: '/#tools',
      visualLabel: 'Scoring Deliverable access',
      visualHref: '/login?redirect=' + encodeURIComponent('/scoring-deliverable'),
    }
  }, [langFr, language, publicFlags, scoringCanAccess])

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
            className={`flex w-[500%] transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] ${
              reducedMotion ? '' : 'duration-[650ms]'
            }`}
            style={{
              transform: `translateX(-${slide * (100 / HERO_SLIDE_COUNT)}%)`,
            }}
          >
            {/* Slide 1 — Book */}
            <div
              className="box-border flex w-1/6 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
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
                      border: '1px solid rgba(254, 189, 16,0.35)',
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
                  className="group relative mx-auto flex w-full max-w-[min(100%,440px)] flex-col items-center rounded-2xl px-2 pb-2 pt-6 outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#FEBD10]/70"
                  aria-label={
                    language === 'fr'
                      ? 'Commander le livre — aller à la section livre'
                      : 'Order the book — go to the book section'
                  }
                >
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(480px,58vh)] w-[min(380px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gradient-to-br from-[#FEBD10]/45 via-[#e8961e]/22 to-transparent opacity-90 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div
                    className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(420px,52vh)] w-[min(320px,85vw)] -translate-x-1/2 -translate-y-1/2 rounded-[48%] bg-[#FEBD10]/35 blur-2xl ${reducedMotion ? '' : 'landing-hero-book-aura-pulse'}`}
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
                        {language === 'fr' ? 'Commander' : 'Order'}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element -- object-fit contain + explicit dimensions per design */}
                      <img
                        src="/images/book-cover.jpg"
                        alt=""
                        width={320}
                        height={480}
                        className="relative z-10 mx-auto h-auto max-h-[min(420px,52vh)] w-auto object-contain drop-shadow-[0_0_50px_rgba(254, 189, 16,0.45)] transition-[filter] duration-500 group-hover:drop-shadow-[0_0_80px_rgba(254, 189, 16,0.65)]"
                        style={{
                          transform: 'perspective(900px) rotateY(-10deg)',
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--aigile-muted)] transition-colors duration-300 group-hover:text-[#FEBD10]/90"
                    aria-hidden
                  >
                    {language === 'fr' ? 'Aller commander le livre' : 'Tap to order the book'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Slide 2 — Retro */}
            <div
              className="box-border flex w-1/6 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
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
                      border: '1px solid rgba(254, 189, 16,0.35)',
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
                  className={`group relative block w-full max-w-[400px] rounded-2xl p-2 outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#FEBD10]/70 ${reducedMotion ? '' : 'landing-hero-visual-in'}`}
                  aria-label={language === 'fr' ? 'Essayer Retro AI gratuitement' : 'Try Retro AI for free'}
                >
                  <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#FEBD10]/35 to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={reducedMotion ? '' : 'landing-hero-visual-breathe'}>
                    <div className="relative origin-center transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.14]">
                      <RetroMockup lang={language === 'fr' ? 'fr' : 'en'} />
                    </div>
                  </div>
                  <span
                    className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--aigile-muted)] transition-colors group-hover:text-[#FEBD10]/85"
                    aria-hidden
                  >
                    {language === 'fr' ? 'Ouvrir Retro AI' : 'Open Retro AI'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Slide 3 — Scoring */}
            <div
              className="box-border flex w-1/6 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
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
                      border: '1px solid rgba(254, 189, 16,0.35)',
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
                  {s3Cta.teaser}
                </p>
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger flex w-full flex-col gap-4'}
                  style={{ animationDelay: staggerDelays[4] }}
                >
                  {s3Cta.kind === 'access_check' && (
                    <>
                      <div
                        className="h-11 w-full max-w-[220px] animate-pulse rounded-full bg-white/[0.08]"
                        aria-busy
                        aria-label={language === 'fr' ? 'Vérification de l’accès' : 'Checking access'}
                      />
                      <Link
                        href={s3Cta.ghostHref}
                        className="w-fit text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                        style={{ color: 'var(--aigile-muted)' }}
                        onClick={() => trackEvent('hero_scoring_ghost', { slide: 'scoring' })}
                      >
                        {s3Cta.ghostLabel}
                      </Link>
                    </>
                  )}
                  {s3Cta.kind === 'coming_soon' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEarlyAccessOpen(true)
                          trackEvent('hero_scoring_early_access', { slide: 'scoring', source: 'open_modal' })
                        }}
                        className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                        style={{
                          background: GOLD,
                          color: NAVY_CTA,
                        }}
                      >
                        {language === 'fr' ? 'Demander un early access' : 'Request early access'}
                      </button>
                      <Link
                        href={s3Cta.ghostHref}
                        className="w-fit text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                        style={{ color: 'var(--aigile-muted)' }}
                        onClick={() => trackEvent('hero_scoring_ghost', { slide: 'scoring' })}
                      >
                        {s3Cta.ghostLabel}
                      </Link>
                    </>
                  )}
                  {s3Cta.kind === 'unlocked' && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link
                        href={s3Cta.primaryHref}
                        onClick={() => trackEvent('hero_scoring_early_access', { slide: 'scoring' })}
                        className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                        style={{
                          background: GOLD,
                          color: NAVY_CTA,
                        }}
                      >
                        {s3Cta.primaryLabel}
                      </Link>
                      <Link
                        href={s3Cta.ghostHref}
                        className="text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                        style={{ color: 'var(--aigile-muted)' }}
                        onClick={() => trackEvent('hero_scoring_ghost', { slide: 'scoring' })}
                      >
                        {s3Cta.ghostLabel}
                      </Link>
                    </div>
                  )}
                  {s3Cta.kind === 'invite_gated' && (
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                          href={s3Cta.primaryHref}
                          onClick={() => trackEvent('hero_scoring_early_access', { slide: 'scoring' })}
                          className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                          style={{
                            background: GOLD,
                            color: NAVY_CTA,
                          }}
                        >
                          {s3Cta.primaryLabel}
                        </Link>
                        <Link
                          href={s3Cta.ghostHref}
                          className="text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                          style={{ color: 'var(--aigile-muted)' }}
                          onClick={() => trackEvent('hero_scoring_ghost', { slide: 'scoring' })}
                        >
                          {s3Cta.ghostLabel}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEarlyAccessOpen(true)
                          trackEvent('hero_scoring_early_access', { slide: 'scoring', source: 'open_modal_invite' })
                        }}
                        className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                        style={{
                          background: GOLD,
                          color: NAVY_CTA,
                        }}
                      >
                        {language === 'fr' ? 'Demander une invitation' : 'Request an invitation'}
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-4 pb-12 max-[479px]:hidden md:pb-12 md:pl-2 md:pr-10">
                {s3Cta.kind === 'coming_soon' || s3Cta.kind === 'access_check' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (s3Cta.kind === 'access_check') return
                      setEarlyAccessOpen(true)
                      trackEvent('hero_scoring_early_access', { slide: 'scoring', source: 'hero_visual_modal' })
                    }}
                    disabled={s3Cta.kind === 'access_check'}
                    className={`group relative block w-full max-w-[340px] rounded-2xl p-2 text-left outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#FEBD10]/70 ${reducedMotion ? '' : 'landing-hero-visual-in'} ${s3Cta.kind === 'access_check' ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
                    aria-label={
                      s3Cta.kind === 'access_check'
                        ? language === 'fr'
                          ? 'Aperçu scoring'
                          : 'Scoring preview'
                        : language === 'fr'
                          ? 'Ouvrir la demande d’early access'
                          : 'Open early access request'
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
                      {s3Cta.visualLabel}
                    </span>
                  </button>
                ) : (
                  <Link
                    href={s3Cta.visualHref}
                    onClick={() =>
                      trackEvent('hero_scoring_early_access', { slide: 'scoring', source: 'hero_visual' })
                    }
                    className={`group relative block w-full max-w-[340px] rounded-2xl p-2 outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#FEBD10]/70 ${reducedMotion ? '' : 'landing-hero-visual-in'}`}
                    aria-label={s3Cta.visualLabel}
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
                      {s3Cta.visualLabel}
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Slide 4 — Dashboard Manager */}
            <div
              className="box-border flex w-1/6 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
              style={{ background: 'var(--aigile-black)' }}
            >
              <div
                key={`s3-${slide === 3}`}
                className="flex flex-1 flex-col justify-center gap-5 px-6 py-12 md:px-12 lg:px-16"
              >
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{ animationDelay: staggerDelays[0] }}
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={
                      copy.s4.badgeNew
                        ? {
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            border: '1px solid rgba(52, 211, 153, 0.4)',
                          }
                        : {
                            background: GOLD_DIM,
                            color: GOLD,
                            border: '1px solid rgba(254, 189, 16,0.35)',
                          }
                    }
                  >
                    <PulseDot reducedMotion={reducedMotion} />
                    {copy.s4.badge}
                  </span>
                </div>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger text-sm'}
                  style={{ color: 'var(--aigile-muted)', animationDelay: staggerDelays[1] }}
                >
                  {copy.s4.eyebrow}
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
                  {copy.s4.title}
                </h1>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger max-w-xl text-[15px] leading-relaxed'}
                  style={{ color: 'rgba(240,237,230,0.85)', animationDelay: staggerDelays[3] }}
                >
                  {copy.s4.body}
                </p>
                <p
                  className="text-[13px] font-semibold leading-snug"
                  style={{ color: '#34d399', fontFamily: 'var(--font-hero-syne), sans-serif' }}
                >
                  {langFr
                    ? 'Disponible — personnalisez votre dashboard manager.'
                    : 'Available — customize your manager dashboard.'}
                </p>
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger flex flex-col gap-3 sm:flex-row sm:items-center'}
                  style={{ animationDelay: staggerDelays[4] }}
                >
                  <Link
                    href="/dashboard-manager/studio"
                    onClick={() => trackEvent('hero_dashboard_manager', { slide: 'dashboard_manager' })}
                    className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                    style={{
                      background: GOLD,
                      color: NAVY_CTA,
                    }}
                  >
                    {copy.s4.primary}
                  </Link>
                  <Link
                    href="/dashboard-manager"
                    className="text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                    style={{ color: 'var(--aigile-muted)' }}
                    onClick={() => trackEvent('hero_dashboard_manager_ghost', { slide: 'dashboard_manager' })}
                  >
                    {copy.s4.ghost}
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-4 pb-12 max-[479px]:hidden md:pb-12 md:pl-2 md:pr-10">
                <Link
                  href="/dashboard-manager/studio"
                  onClick={() =>
                    trackEvent('hero_dashboard_manager', { slide: 'dashboard_manager', source: 'hero_visual' })
                  }
                  className={`group relative block w-full max-w-[380px] rounded-2xl p-2 outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-emerald-400/70 ${reducedMotion ? '' : 'landing-hero-visual-in'}`}
                  aria-label={
                    language === 'fr' ? 'Ouvrir Dashboard Manager' : 'Open Dashboard Manager'
                  }
                >
                  <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-emerald-500/25 to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={reducedMotion ? '' : 'landing-hero-visual-breathe'}>
                    <div className="relative origin-center transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.14]">
                      <DashboardMockup lang={language === 'fr' ? 'fr' : 'en'} />
                    </div>
                  </div>
                  <span
                    className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--aigile-muted)] transition-colors group-hover:text-emerald-400/90"
                    aria-hidden
                  >
                    {language === 'fr' ? 'Ouvrir le studio' : 'Open studio'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Slide 5 — Westrum Culture Survey */}
            <div
              className="box-border flex w-1/6 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
              style={{ background: 'var(--aigile-black)' }}
            >
              <div
                key={`s4-${slide === 4}`}
                className="flex flex-1 flex-col justify-center gap-5 px-6 py-12 md:px-12 lg:px-16"
              >
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{ animationDelay: staggerDelays[0] }}
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={
                      copy.s5.badgeNew
                        ? {
                            background: 'rgba(19, 142, 236, 0.15)',
                            color: '#60a5fa',
                            border: '1px solid rgba(96, 165, 250, 0.4)',
                          }
                        : {
                            background: GOLD_DIM,
                            color: GOLD,
                            border: '1px solid rgba(254, 189, 16,0.35)',
                          }
                    }
                  >
                    <PulseDot reducedMotion={reducedMotion} />
                    {copy.s5.badge}
                  </span>
                </div>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger text-sm'}
                  style={{ color: 'var(--aigile-muted)', animationDelay: staggerDelays[1] }}
                >
                  {copy.s5.eyebrow}
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
                  {copy.s5.title}
                </h1>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger max-w-xl text-[15px] leading-relaxed'}
                  style={{ color: 'rgba(240,237,230,0.85)', animationDelay: staggerDelays[3] }}
                >
                  {copy.s5.body}
                </p>
                <p
                  className="text-[13px] font-semibold leading-snug"
                  style={{ color: '#60a5fa', fontFamily: 'var(--font-hero-syne), sans-serif' }}
                >
                  {langFr
                    ? 'Gratuit — connecte-toi pour voir ton résultat.'
                    : 'Free — sign in to see your result.'}
                </p>
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger flex flex-col gap-3 sm:flex-row sm:items-center'}
                  style={{ animationDelay: staggerDelays[4] }}
                >
                  <Link
                    href="/dashboard/westrum"
                    onClick={() => trackEvent('hero_westrum', { slide: 'westrum' })}
                    className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                    style={{
                      background: GOLD,
                      color: NAVY_CTA,
                    }}
                  >
                    {copy.s5.primary}
                  </Link>
                  <Link
                    href="/#tools"
                    className="text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                    style={{ color: 'var(--aigile-muted)' }}
                    onClick={() => trackEvent('hero_westrum_ghost', { slide: 'westrum' })}
                  >
                    {copy.s5.ghost}
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-4 pb-12 max-[479px]:hidden md:pb-12 md:pl-2 md:pr-10">
                <Link
                  href="/dashboard/westrum"
                  onClick={() =>
                    trackEvent('hero_westrum', { slide: 'westrum', source: 'hero_visual' })
                  }
                  className={`group relative block w-full max-w-[380px] rounded-2xl p-2 outline-none ring-offset-4 ring-offset-[var(--aigile-black)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#138eec]/70 ${reducedMotion ? '' : 'landing-hero-visual-in'}`}
                  aria-label={
                    language === 'fr' ? 'Passer le questionnaire Westrum' : 'Take the Westrum survey'
                  }
                >
                  <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#138eec]/25 to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={reducedMotion ? '' : 'landing-hero-visual-breathe'}>
                    <div className="relative origin-center transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.14]">
                      <WestrumMockup lang={language === 'fr' ? 'fr' : 'en'} />
                    </div>
                  </div>
                  <span
                    className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--aigile-muted)] transition-colors group-hover:text-[#60a5fa]/90"
                    aria-hidden
                  >
                    {language === 'fr' ? '6 questions · 2 min' : '6 questions · 2 min'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Slide 6 — S.A.L.I.M. Q&A Lab */}
            <div
              className="box-border flex w-1/6 shrink-0 flex-col md:min-h-[580px] md:flex-row md:items-stretch"
              style={{ background: 'var(--aigile-black)' }}
            >
              <div
                key={`s5-${slide === 5}`}
                className="flex flex-1 flex-col justify-center gap-5 px-6 py-12 md:px-12 lg:px-16"
              >
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger'}
                  style={{ animationDelay: staggerDelays[0] }}
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={{
                      background: 'rgba(254, 219, 16, 0.15)',
                      color: GOLD,
                      border: '1px solid rgba(254, 219, 16, 0.4)',
                    }}
                  >
                    <PulseDot reducedMotion={reducedMotion} />
                    {copy.s6.badge}
                  </span>
                </div>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger text-sm'}
                  style={{ color: 'var(--aigile-muted)', animationDelay: staggerDelays[1] }}
                >
                  {copy.s6.eyebrow}
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
                  {copy.s6.title}
                </h1>
                <p
                  className={reducedMotion ? '' : 'landing-hero-stagger max-w-xl text-[15px] leading-relaxed'}
                  style={{ color: 'rgba(240,237,230,0.85)', animationDelay: staggerDelays[3] }}
                >
                  {copy.s6.body}
                </p>
                <p
                  className="text-[13px] font-semibold leading-snug"
                  style={{ color: GOLD, fontFamily: 'var(--font-hero-syne), sans-serif' }}
                >
                  {langFr
                    ? '170+ questions · aperçu gratuit · 1 crédit par réponse'
                    : '170+ questions · free preview · 1 credit per answer'}
                </p>
                <div
                  className={reducedMotion ? '' : 'landing-hero-stagger flex flex-col gap-3 sm:flex-row sm:items-center'}
                  style={{ animationDelay: staggerDelays[4] }}
                >
                  <Link
                    href="/salim-qa"
                    onClick={() => trackEvent('hero_salim_qa', { slide: 'salim_qa' })}
                    className="landing-hero-cta-micro inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold"
                    style={{
                      background: GOLD,
                      color: NAVY_CTA,
                    }}
                  >
                    {copy.s6.primary}
                  </Link>
                  <Link
                    href="/#tools"
                    className="text-[14px] font-semibold transition hover:text-[var(--aigile-white)]"
                    style={{ color: 'var(--aigile-muted)' }}
                    onClick={() => trackEvent('hero_salim_qa_ghost', { slide: 'salim_qa' })}
                  >
                    {copy.s6.ghost}
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-6 py-10 md:px-10">
                <Link
                  href="/salim-qa"
                  className="group relative block w-full max-w-[420px]"
                  onClick={() => trackEvent('hero_salim_qa', { slide: 'salim_qa', source: 'hero_visual' })}
                >
                  <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#FEDB10]/25 to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={reducedMotion ? '' : 'landing-hero-visual-breathe'}>
                    <div className="relative origin-center transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.14]">
                      <SalimQaLabMockup lang={language === 'fr' ? 'fr' : 'en'} />
                    </div>
                  </div>
                  <span
                    className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--aigile-muted)] transition-colors group-hover:text-[#FEDB10]/90"
                    aria-hidden
                  >
                    {language === 'fr' ? 'Q&A Lab · livre' : 'Q&A Lab · book'}
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
            {Array.from({ length: HERO_SLIDE_COUNT }, (_, i) => i).map((i) => {
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

      <EarlyAccessRequestModal
        open={earlyAccessOpen}
        onClose={() => setEarlyAccessOpen(false)}
        language={language}
        toolSlug="scoring_deliverable"
      />
    </section>
  )
}
