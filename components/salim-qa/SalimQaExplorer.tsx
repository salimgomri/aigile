'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, Loader2 } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { useCredits } from '@/lib/credits/CreditContext'
import { CREDIT_ACTIONS } from '@/lib/credits/actions'
import { trackEvent } from '@/lib/gtag'
import UpgradeModal from '@/components/credits/UpgradeModal'
import {
  canReadFullAnswer,
  canUnlockAnswer,
  hasActiveSubscription,
} from '@/lib/salim-qa/access'
import {
  CIBLE_LABELS,
  DIM_LABELS,
  ROLE_LABELS,
  STATUT_LABELS,
} from '@/lib/salim-qa/constants'
import type { SalimQaFacets, SalimQaQuestionPublic } from '@/lib/salim-qa/types'
import { SalimQaBuyBookButton, SalimQaPaywallBlock } from './SalimQaBookModal'
import { SalimQaFicheStack } from './SalimQaFicheViewer'

const VISITOR_KEY = 'salim_qa_visitor_id'
const LOGIN_REDIRECT = '/login?redirect=%2Fsalim-qa'
const COST = CREDIT_ACTIONS.salim_qa_answer.cost

type AccessInfo = {
  isLoggedIn: boolean
  creditsRemaining: number | null
  isUnlimited: boolean
  hasEntitlement: boolean
  cost: number
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

function logActivity(
  action: string,
  payload: { questionId?: string; query?: string; metadata?: Record<string, unknown> } = {}
) {
  fetch('/api/salim-qa/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, visitorId: getVisitorId(), ...payload }),
    credentials: 'same-origin',
  }).catch(() => {})
}

function norm(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function highlightText(text: string, terms: string[]) {
  if (!terms.length) return text
  const parts = text.split(/(\s+)/)
  return parts.map((w, i) => {
    const clean = w.replace(/[.,;:!?»«"'()]/g, '')
    const hit = terms.some((t) => norm(clean).includes(norm(t)))
    if (hit && clean.trim()) {
      return (
        <mark key={i} className="sq-mark">
          {w}
        </mark>
      )
    }
    return <span key={i}>{w}</span>
  })
}

type SalimQaExplorerProps = {
  language: 'fr' | 'en'
}

export function SalimQaExplorer({ language }: SalimQaExplorerProps) {
  const { data: session } = useSession()
  const { status, refresh } = useCredits()

  const [chips, setChips] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [focused, setFocused] = useState(false)
  const [role, setRole] = useState('')
  const [cible, setCible] = useState('all')
  const [fiche, setFiche] = useState<'all' | 'avec' | 'sans'>('all')
  const [dim, setDim] = useState('')
  const [chap, setChap] = useState('')
  const [questions, setQuestions] = useState<SalimQaQuestionPublic[]>([])
  const [facets, setFacets] = useState<SalimQaFacets | null>(null)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [detailId, setDetailId] = useState<string | null>(null)
  const [featuredId, setFeaturedId] = useState<string | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [unlockingId, setUnlockingId] = useState<string | null>(null)
  const [apiAccess, setApiAccess] = useState<AccessInfo | null>(null)

  const spotRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const access = useMemo(() => {
    const isLoggedIn = !!session?.user
    const creditsRemaining = status?.creditsRemaining ?? apiAccess?.creditsRemaining ?? null
    const isUnlimited = !!status?.isUnlimited || !!apiAccess?.isUnlimited
    const isAdmin = !!status?.isAdmin
    return { isLoggedIn, creditsRemaining, isUnlimited, isAdmin }
  }, [session?.user, status, apiAccess])

  /** Accès lecture : priorité au flag serveur (évite race credits au chargement) */
  const canViewFull = (q: SalimQaQuestionPublic) =>
    q.canReadFull || canReadFullAnswer(access, q.isUnlocked)

  const hasFullAccess = hasActiveSubscription(access) || !!status?.isAdmin

  const terms = useMemo(() => {
    const t = [...chips]
    const d = draft.trim()
    if (d) t.push(d)
    return t.filter(Boolean)
  }, [chips, draft])

  const activeSearch = terms.join('').length >= 3

  const copy = useMemo(
    () =>
      language === 'fr'
        ? {
            boxTitle: 'Q&A Lab',
            kicker: 'Le Système S.A.L.I.M. · Bibliothèque de questions',
            h1: 'Toutes les questions du livre, à portée de mot.',
            sub: 'Ce sont les questions que se posent vraiment managers, Scrum Masters, Product Owners et équipes agiles. Les réponses, elles, sont dans le livre.',
            searchPh: 'Rechercher dans les questions…',
            minChars: '3 car. min',
            suggested: 'Questions suggérées',
            buyBook: 'Acheter le livre',
            explore: 'Question à explorer',
            random: 'Au hasard',
            seeQ: 'Voir la question',
            terrain: 'Sur le terrain',
            filters: 'Filtres',
            reset: 'Réinitialiser',
            ficheFilter: 'Fiche & schéma',
            withFiche: 'Avec fiche',
            withoutFiche: 'Sans fiche',
            role: 'Rôle',
            dim: 'Dimension',
            chapter: 'Chapitre',
            allRoles: 'Tous les rôles',
            allDims: 'Toutes les dimensions',
            allChaps: 'Tous les chapitres',
            all: 'Tous',
            answer: 'La réponse',
            showAnswer: 'Voir la réponse',
            hideAnswer: 'Masquer la réponse',
            open: 'Ouvrir ↗',
            emptyTitle: 'Aucune question trouvée',
            emptySub: "Aucune question ne correspond à ces critères. Essayez d'élargir un filtre.",
            end: 'Fin des résultats',
            loading: 'Chargement…',
            bottomTitle: 'Le Système S.A.L.I.M.',
            bottomSub: 'Salim Gomri · toutes les réponses sont dans le livre',
            buyFull: 'Acheter Le Système S.A.L.I.M.',
            unlock: `Débloquer (${COST} crédit)`,
            login: 'Se connecter',
            register: 'Créer un compte',
            prev: '← Précédente',
            next: 'Suivante →',
            response: 'RÉPONSE',
            inBook: 'LA RÉPONSE EST DANS LE LIVRE',
            statusDefault: (n: number) =>
              activeSearch
                ? `${n} résultat${n > 1 ? 's' : ''} · fiches en premier, puis pertinence`
                : `${n} questions du livre · classées par rôle, thème et dimension`,
            statusMin: 'Saisissez au moins 3 caractères pour lancer la recherche',
            proBadge: 'Accès illimité (Pro)',
            adminBadge: 'Accès illimité (Admin)',
            creditsLeft: (n: number) => `${n} crédit${n > 1 ? 's' : ''}`,
            sheetFor: 'Fiche destinée à',
            sheetTitle: 'Fiche pratique',
            sheetLocked: 'Fiche disponible après déblocage de la réponse.',
            sheetMissing: 'Fiche référencée — fichier SVG à ajouter dans config/fp/.',
          }
        : {
            boxTitle: 'Q&A Lab',
            kicker: 'The S.A.L.I.M. System · Question library',
            h1: 'Every question from the book, one search away.',
            sub: 'Real questions from managers, Scrum Masters, Product Owners and agile teams. The answers live in the book.',
            searchPh: 'Search questions…',
            minChars: '3 char. min',
            suggested: 'Suggested questions',
            buyBook: 'Buy the book',
            explore: 'Question to explore',
            random: 'Random',
            seeQ: 'View question',
            terrain: 'In the field',
            filters: 'Filters',
            reset: 'Reset',
            ficheFilter: 'Sheet & diagram',
            withFiche: 'With sheet',
            withoutFiche: 'Without sheet',
            role: 'Role',
            dim: 'Dimension',
            chapter: 'Chapter',
            allRoles: 'All roles',
            allDims: 'All dimensions',
            allChaps: 'All chapters',
            all: 'All',
            answer: 'The answer',
            showAnswer: 'View answer',
            hideAnswer: 'Hide answer',
            open: 'Open ↗',
            emptyTitle: 'No questions found',
            emptySub: 'No question matches these filters. Try broadening your search.',
            end: 'End of results',
            loading: 'Loading…',
            bottomTitle: 'The S.A.L.I.M. System',
            bottomSub: 'Salim Gomri · all answers are in the book',
            buyFull: 'Buy The S.A.L.I.M. System',
            unlock: `Unlock (${COST} credit)`,
            login: 'Sign in',
            register: 'Create account',
            prev: '← Previous',
            next: 'Next →',
            response: 'ANSWER',
            inBook: 'THE ANSWER IS IN THE BOOK',
            statusDefault: (n: number) =>
              activeSearch
                ? `${n} result${n > 1 ? 's' : ''} · sheets first, then relevance`
                : `${n} book questions · by role, theme and dimension`,
            statusMin: 'Type at least 3 characters to search',
            proBadge: 'Unlimited access (Pro)',
            adminBadge: 'Unlimited access (Admin)',
            creditsLeft: (n: number) => `${n} credit${n !== 1 ? 's' : ''}`,
            sheetFor: 'Sheet for',
            sheetTitle: 'Practical sheet',
            sheetLocked: 'Sheet available after unlocking the answer.',
            sheetMissing: 'Sheet referenced — add SVG file under config/fp/.',
          },
    [language, activeSearch]
  )

  const fetchPage = useCallback(
    async (nextOffset: number, append: boolean) => {
      if (nextOffset === 0) setLoading(true)
      else setLoadingMore(true)

      try {
        const params = new URLSearchParams({
          limit: '12',
          offset: String(nextOffset),
          cible,
          fiche,
          visitorId: getVisitorId(),
        })
        if (chips.length) params.set('chips', chips.join('|'))
        if (draft.trim()) params.set('q', draft.trim())
        if (role) params.set('role', role)
        if (dim) params.set('dim', dim)
        if (chap) params.set('chap', chap)

        const res = await fetch(`/api/salim-qa/search?${params}`, { credentials: 'same-origin' })
        const data = await res.json()

        setQuestions((prev) => (append ? [...prev, ...(data.questions ?? [])] : data.questions ?? []))
        setTotal(data.total ?? 0)
        setFacets(data.facets ?? null)
        setApiAccess(data.access ?? null)
        setOffset(nextOffset + (data.questions?.length ?? 0))

        if (!featuredId && data.questions?.[0]?.id) {
          setFeaturedId(data.questions[0].id)
        }
      } catch {
        if (!append) {
          setQuestions([])
          setTotal(0)
        }
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [chips, draft, role, cible, fiche, dim, chap, featuredId]
  )

  useEffect(() => {
    trackEvent('salim_qa_page_view', { tool: 'salim_qa' })
    fetchPage(0, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchPage(0, false)
      if (activeSearch) {
        trackEvent('salim_qa_search', { query: terms.join(' '), role: role || 'all' })
      }
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [chips, draft, role, cible, fiche, dim, chap, fetchPage, activeSearch, terms, role])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && !loadingMore && offset < total) {
          fetchPage(offset, true)
        }
      },
      { rootMargin: '260px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [offset, total, loading, loadingMore, fetchPage])

  const logBookClick = () => logActivity('book_click')

  const openRecharge = () => {
    logActivity('recharge_click')
    trackEvent('salim_qa_recharge_click', { source: 'salim_qa' })
    setUpgradeOpen(true)
  }

  const handleUnlock = async (questionId: string) => {
    if (!access.isLoggedIn) return
    if (!canUnlockAnswer(access, COST)) {
      openRecharge()
      return
    }

    setUnlockingId(questionId)
    trackEvent('salim_qa_unlock_click', { question_id: questionId })

    try {
      const res = await fetch('/api/salim-qa/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, visitorId: getVisitorId() }),
        credentials: 'same-origin',
      })
      const data = await res.json()

      if (res.status === 401 || res.status === 403) {
        trackEvent('salim_qa_unlock_denied', {
          question_id: questionId,
          reason: res.status === 401 ? 'not_authenticated' : 'no_credits',
        })
        if (res.status === 403) openRecharge()
        return
      }
      if (!res.ok) return

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, isUnlocked: true, canReadFull: true, answerFull: data.answerFull as string }
            : q
        )
      )
      await refresh()
      trackEvent('salim_qa_unlock_success', { question_id: questionId })
    } finally {
      setUnlockingId(null)
    }
  }

  const featured = questions.find((q) => q.id === featuredId) ?? questions[0]
  const detail = detailId ? questions.find((q) => q.id === detailId) : null
  const detailIdx = detail ? questions.findIndex((q) => q.id === detail.id) : -1

  const suggestions =
    focused && draft.trim().length >= 2
      ? questions
          .filter((q) => norm(q.question).includes(norm(draft.trim())))
          .slice(0, 5)
      : []

  const marqueeItems = useMemo(() => {
    const base = (facets?.roles ?? []).slice(0, 8).map((r) => ({
      letter: r,
      label: ROLE_LABELS[r]?.[language] ?? r,
      onClick: () => setRole(r),
    }))
    return [...base, ...base]
  }, [facets?.roles, language])

  const filtersActive =
    fiche !== 'all' ||
    cible !== 'all' ||
    !!role ||
    !!dim ||
    !!chap ||
    chips.length > 0 ||
    draft.trim().length > 0

  const resetAll = () => {
    setChips([])
    setDraft('')
    setFiche('all')
    setCible('all')
    setRole('')
    setDim('')
    setChap('')
  }

  const onSpotMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = spotRef.current
    if (!el) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.background = `radial-gradient(440px circle at ${x}px ${y}px, rgba(254,219,16,.2), rgba(255,255,255,.05) 38%, transparent 68%)`
  }

  const renderAnswerBlock = (q: SalimQaQuestionPublic) => {
    const full = canViewFull(q)
    const excerpt = !full

    if (full && q.answerFull) {
      return <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>{q.answerFull}</p>
    }

    return (
      <>
        <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.55 }}>{q.answerPreview}</p>
        {!access.isLoggedIn ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href={LOGIN_REDIRECT} className="sq-btn-gold" onClick={() => trackEvent('salim_qa_login_click', { question_id: q.id })}>
              {copy.login}
            </Link>
            <Link href="/register?redirect=%2Fsalim-qa" className="sq-btn-gold" style={{ background: '#fff', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.12)' }}>
              {copy.register}
            </Link>
          </div>
        ) : excerpt ? (
          <SalimQaPaywallBlock
            language={language}
            hasFiche={q.hasFiche}
            page={q.page}
            canUnlock={canUnlockAnswer(access, COST)}
            cost={COST}
            onBookClick={logBookClick}
            onUnlock={() => {
              if (canUnlockAnswer(access, COST)) {
                handleUnlock(q.id)
              } else {
                openRecharge()
              }
            }}
          />
        ) : null}
      </>
    )
  }

  return (
    <div className="salim-qb pb-28">
      <header className="sq-header">
        <div className="sq-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <Link href="/" className="sq-brand-mono">
              aigile.lu
            </Link>
            <span style={{ width: 1, height: 15, background: 'rgba(0,0,0,0.14)' }} />
            <span className="sq-brand-serif">S.A.L.I.M.</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6B6B66' }}>{copy.boxTitle}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {status?.isAdmin ? (
              <span
                className="sq-brand-mono"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#6B5A10',
                  background: 'rgba(254,219,16,0.22)',
                  border: '1px solid rgba(254,219,16,0.45)',
                  borderRadius: 999,
                  padding: '5px 10px',
                }}
              >
                {copy.adminBadge}
              </span>
            ) : hasFullAccess ? (
              <span
                className="sq-brand-mono"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#6B5A10',
                  background: 'rgba(254,219,16,0.22)',
                  border: '1px solid rgba(254,219,16,0.45)',
                  borderRadius: 999,
                  padding: '5px 10px',
                }}
              >
                {copy.proBadge}
              </span>
            ) : access.isLoggedIn ? (
              <span className="sq-brand-mono" style={{ fontSize: 11, color: '#6B6B66' }}>
                {copy.creditsLeft(access.creditsRemaining ?? 0)}
              </span>
            ) : null}
            <SalimQaBuyBookButton language={language} trackSource="salim_qa_header" onClick={logBookClick} />
          </div>
        </div>
      </header>

      <section className="sq-hero">
        <div>
          <div className="sq-brand-mono" style={{ marginBottom: 16, color: '#B0B0A8' }}>
            {copy.kicker}
          </div>
          <h1>{copy.h1}</h1>
          <p style={{ margin: '0 0 26px', fontSize: 16, lineHeight: 1.55, color: '#6B6B66', maxWidth: '50ch' }}>
            {copy.sub}
          </p>

          <div className="sq-search-wrap">
            <div className="sq-search-box">
              <Search className="h-5 w-5 shrink-0 opacity-55" />
              <input
                value={draft}
                onChange={(e) => {
                  const v = e.target.value
                  if (/\s/.test(v)) {
                    const parts = v.split(/\s+/)
                    const last = parts.pop() ?? ''
                    const add = parts.filter(Boolean)
                    setChips((c) => [...c, ...add])
                    setDraft(last)
                  } else {
                    setDraft(v)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const d = draft.trim()
                    if (d) {
                      setChips((c) => [...c, d])
                      setDraft('')
                    }
                  } else if (e.key === 'Backspace' && draft === '') {
                    setChips((c) => c.slice(0, -1))
                  }
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 160)}
                placeholder={copy.searchPh}
              />
              {(chips.length > 0 || draft.trim()) && (
                <button
                  type="button"
                  onClick={() => {
                    setChips([])
                    setDraft('')
                  }}
                  style={{
                    flex: 'none',
                    width: 30,
                    height: 30,
                    border: 'none',
                    borderRadius: 999,
                    background: '#F0F0EC',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              )}
              <span
                className="sq-brand-mono"
                style={{
                  flex: 'none',
                  fontSize: 10,
                  color: '#C2C2BA',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 6,
                  padding: '4px 7px',
                }}
              >
                {copy.minChars}
              </span>
            </div>

            {focused && suggestions.length > 0 && (
              <div className="sq-suggestions">
                <div className="sq-brand-mono" style={{ padding: '11px 16px 7px', fontSize: 10, color: '#B0B0A8' }}>
                  {copy.suggested}
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onMouseDown={() => setDetailId(s.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      width: '100%',
                      textAlign: 'left',
                      border: 'none',
                      background: 'none',
                      padding: '11px 16px',
                      cursor: 'pointer',
                      borderTop: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <span className="sq-role-code">{s.role}</span>
                    <span style={{ flex: 1, fontSize: 14, lineHeight: 1.35 }}>{highlightText(s.question, terms)}</span>
                    <span style={{ color: '#C2C2BA' }}>↗</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {chips.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              <span className="sq-brand-mono" style={{ fontSize: 10, color: '#B0B0A8', alignSelf: 'center' }}>
                ET
              </span>
              {chips.map((word, i) => (
                <span key={`${word}-${i}`} className="sq-chip">
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: '#FEDB10' }} />
                  {word}
                  <button
                    type="button"
                    onClick={() => setChips((c) => c.filter((_, j) => j !== i))}
                    style={{
                      width: 19,
                      height: 19,
                      border: 'none',
                      borderRadius: 999,
                      background: '#F0F0EC',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          <div style={{ marginTop: 16, fontSize: 13, color: '#9A9A93' }}>
            {terms.length > 0 && !activeSearch
              ? copy.statusMin
              : copy.statusDefault(total)}
          </div>
        </div>

        {featured && (
          <div className="sq-featured" onMouseMove={onSpotMove}>
            <div ref={spotRef} className="sq-featured-spot" />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span className="sq-brand-mono" style={{ fontSize: 10.5, color: '#FEDB10' }}>
                  {copy.explore}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const pick = questions[Math.floor(Math.random() * questions.length)]
                    if (pick) setFeaturedId(pick.id)
                  }}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid rgba(255,255,255,0.16)',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ↻ {copy.random}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="sq-role-badge" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.18)' }}>
                  <span className="sq-role-code" style={{ background: '#FEDB10', color: '#0A0A0A' }}>
                    {featured.role}
                  </span>
                  {ROLE_LABELS[featured.role]?.[language] ?? featured.role}
                </span>
              </div>
              <h3
                style={{
                  margin: '0 0 14px',
                  fontFamily: 'var(--sq-serif)',
                  fontSize: 25,
                  lineHeight: 1.14,
                  cursor: 'pointer',
                }}
                onClick={() => setDetailId(featured.id)}
              >
                {featured.question}
              </h3>
              <div className="sq-brand-mono" style={{ fontSize: 9.5, color: '#7A7A73', marginBottom: 6 }}>
                {copy.terrain}
              </div>
              <p style={{ margin: '0 0 22px', fontFamily: 'var(--sq-serif)', fontStyle: 'italic', fontSize: 16.5, color: '#C9C9C2' }}>
                « {featured.douleur.length > 150 ? `${featured.douleur.slice(0, 150)}…` : featured.douleur} »
              </p>
              <span style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setDetailId(featured.id)}
                  style={{
                    padding: '12px 18px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    background: 'transparent',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copy.seeQ}
                </button>
                <SalimQaBuyBookButton
                  language={language}
                  variant="gold-lg"
                  trackSource="salim_qa_featured"
                  style={{ flex: 1, minWidth: 140 }}
                  onClick={logBookClick}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {marqueeItems.length > 0 && (
        <div className="sq-marquee-wrap">
          <div className="sq-marquee">
            {marqueeItems.map((m, i) => (
              <button key={`${m.letter}-${i}`} type="button" className="sq-marquee-pill" onClick={m.onClick}>
                <span className="sq-role-code">{m.letter}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="sq-main">
        <aside className="sq-aside">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
            <span className="sq-brand-mono" style={{ fontSize: 11, color: '#9A9A93' }}>
              {copy.filters}
            </span>
            {filtersActive && (
              <button type="button" onClick={resetAll} style={{ border: 'none', background: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                {copy.reset}
              </button>
            )}
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#9A9A93', marginBottom: 10 }}>{copy.ficheFilter}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button type="button" className={`sq-fiche-chip ${fiche === 'avec' ? 'active' : ''}`} onClick={() => setFiche(fiche === 'avec' ? 'all' : 'avec')}>
                {copy.withFiche}
              </button>
              <button type="button" className={`sq-fiche-chip ${fiche === 'sans' ? 'active' : ''}`} onClick={() => setFiche(fiche === 'sans' ? 'all' : 'sans')}>
                {copy.withoutFiche}
              </button>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', marginBottom: 22 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9A9A93', marginBottom: 8 }}>{copy.role}</span>
              <select className="sq-filter-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">{copy.allRoles}</option>
                {(facets?.roles ?? []).map((r) => (
                  <option key={r} value={r}>
                    {r} · {ROLE_LABELS[r]?.[language] ?? r}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9A9A93', marginBottom: 8 }}>{copy.dim}</span>
              <select className="sq-filter-select" value={dim} onChange={(e) => setDim(e.target.value)}>
                <option value="">{copy.allDims}</option>
                {(facets?.dimensions ?? []).map((d) => (
                  <option key={d} value={d}>
                    {DIM_LABELS[d]?.[language] ?? d}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9A9A93', marginBottom: 8 }}>{copy.chapter}</span>
              <select className="sq-filter-select" value={chap} onChange={(e) => setChap(e.target.value)}>
                <option value="">{copy.allChaps}</option>
                {(facets?.chapters ?? []).map((c) => (
                  <option key={c} value={String(c)}>
                    Ch. {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '22px 0' }} />
          <div className="sq-brand-mono" style={{ fontSize: 10.5, lineHeight: 1.9, color: '#B6B6AE' }}>
            <span style={{ color: '#0A0A0A' }}>S</span>crum{' '}
            <span style={{ color: '#0A0A0A' }}>A</span>ugmenté
            <br />
            <span style={{ color: '#0A0A0A' }}>L</span>ivré{' '}
            <span style={{ color: '#0A0A0A' }}>I</span>ncrémental
            <br />
            <span style={{ color: '#0A0A0A' }}>M</span>esuré
          </div>
        </aside>

        <section style={{ flex: '1 1 540px', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            <button type="button" className={`sq-tab ${cible === 'all' ? 'active' : ''}`} onClick={() => setCible('all')}>
              {copy.all}
              <span style={{ opacity: 0.7 }}>{facets?.total ?? total}</span>
            </button>
            {(facets?.cibles ?? []).map((c) => (
              <button
                key={c}
                type="button"
                className={`sq-tab ${cible === c ? 'active' : ''}`}
                onClick={() => setCible(c)}
              >
                {CIBLE_LABELS[c]?.[language] ?? c}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 48, color: '#9A9A93' }}>
              <Loader2 className="h-5 w-5 animate-spin" />
              {copy.loading}
            </div>
          ) : questions.length === 0 ? (
            <div style={{ border: '1px dashed rgba(0,0,0,0.16)', borderRadius: 18, padding: '56px 28px', textAlign: 'center', background: '#fff' }}>
              <div style={{ fontFamily: 'var(--sq-serif)', fontSize: 30, marginBottom: 8 }}>{copy.emptyTitle}</div>
              <p style={{ margin: '0 0 18px', color: '#9A9A93' }}>{copy.emptySub}</p>
              <button type="button" className="sq-btn-gold" onClick={resetAll}>
                {copy.reset}
              </button>
            </div>
          ) : (
            <div className="sq-card-grid">
              {questions.map((q) => (
                <article key={q.id} className="sq-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                    <span className="sq-role-badge">
                      <span className="sq-role-code">{q.role}</span>
                      {ROLE_LABELS[q.role]?.[language] ?? q.role}
                    </span>
                    <span style={{ flex: 1 }} />
                    {q.hasFiche && <span className="sq-fiche-badge">■ FICHE</span>}
                  </div>
                  <h3
                    style={{ margin: '0 0 11px', fontSize: 16.5, fontWeight: 600, lineHeight: 1.36, cursor: 'pointer' }}
                    onClick={() => {
                      setDetailId(q.id)
                      logActivity('question_view', { questionId: q.id })
                      trackEvent('salim_qa_question_view', { question_id: q.id })
                    }}
                  >
                    {highlightText(q.question, terms)}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                    {q.dimensions.slice(0, 4).map((d) => (
                      <span
                        key={d}
                        className="sq-brand-mono"
                        style={{
                          fontSize: 9.5,
                          textTransform: 'uppercase',
                          color: '#8A8A82',
                          background: '#F6F6F2',
                          border: '1px solid rgba(0,0,0,0.06)',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {DIM_LABELS[d]?.[language] ?? d}
                      </span>
                    ))}
                  </div>
                  <div className="sq-brand-mono" style={{ fontSize: 9.5, color: '#B6A23A', marginBottom: 5 }}>
                    {copy.terrain}
                  </div>
                  <p style={{ margin: 0, fontFamily: 'var(--sq-serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.42, color: '#454540' }}>
                    « {q.douleur.length > 186 ? `${q.douleur.slice(0, 186)}…` : q.douleur} »
                  </p>

                  {expanded[q.id] && (
                    <div style={{ marginTop: 16, animation: 'salimFade 0.2s ease' }}>
                      <div className="sq-brand-mono" style={{ fontSize: 9.5, color: '#B6B6AE', marginBottom: 7 }}>
                        {copy.answer}
                      </div>
                      {renderAnswerBlock(q)}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                    <button
                      type="button"
                      onClick={() => setExpanded((e) => ({ ...e, [q.id]: !e[q.id] }))}
                      style={{ border: 'none', background: 'none', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      {expanded[q.id] ? copy.hideAnswer : copy.showAnswer}{' '}
                      <span style={{ display: 'inline-block', transform: expanded[q.id] ? 'rotate(180deg)' : 'none' }}>⌄</span>
                    </button>
                    <span style={{ flex: 1 }} />
                    <span className="sq-brand-mono" style={{ fontSize: 10, color: '#B6B6AE' }}>
                      p. {q.page ?? '—'} · Ch. {q.chapter}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDetailId(q.id)}
                      style={{ border: 'none', background: 'none', fontWeight: 600, color: '#6B6B66', cursor: 'pointer' }}
                    >
                      {copy.open}
                    </button>
                  </div>
                </article>
              ))}

              {offset < total && (
                <div ref={sentinelRef} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '34px 0' }}>
                  {loadingMore && (
                    <>
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      <span className="sq-brand-mono" style={{ fontSize: 10.5, color: '#B6B6AE' }}>
                        {copy.loading}
                      </span>
                    </>
                  )}
                </div>
              )}
              {offset >= total && total > 0 && (
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 14, color: '#C2C2BA' }}>
                  <span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                  <span className="sq-brand-mono" style={{ fontSize: 10.5 }}>
                    {copy.end}
                  </span>
                  <span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <div className="sq-bottom-bar">
        <div className="sq-bottom-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <div
              style={{
                width: 32,
                height: 44,
                borderRadius: 3,
                background: 'linear-gradient(140deg,#FEDB10,#e6c40a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--sq-serif)',
                fontSize: 15,
              }}
            >
              S
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{copy.bottomTitle}</div>
              <div style={{ fontSize: 11.5, color: '#9C9C95' }}>{copy.bottomSub}</div>
            </div>
          </div>
          <span style={{ flex: 1 }} />
          <SalimQaBuyBookButton
            language={language}
            variant="gold-lg"
            trackSource="salim_qa_bottom_bar"
            onClick={logBookClick}
          />
        </div>
      </div>

      {detail && (
        <div className="sq-modal-overlay" onClick={() => setDetailId(null)} role="presentation">
          <div className="sq-modal" onClick={(e) => e.stopPropagation()} role="dialog">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderBottom: '1px solid rgba(0,0,0,0.07)',
                position: 'sticky',
                top: 0,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="sq-role-badge">
                  <span className="sq-role-code">{detail.role}</span>
                  {ROLE_LABELS[detail.role]?.[language] ?? detail.role}
                </span>
                {detail.cible && (
                  <span style={{ fontSize: 12, color: '#9A9A93' }}>
                    {CIBLE_LABELS[detail.cible]?.[language] ?? detail.cible}
                  </span>
                )}
                {detail.statutReponse && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        background: STATUT_LABELS[detail.statutReponse]?.color ?? '#9A9A93',
                      }}
                    />
                    {STATUT_LABELS[detail.statutReponse]?.[language] ?? detail.statutReponse}
                  </span>
                )}
              </div>
              <button type="button" onClick={() => setDetailId(null)} style={{ width: 34, height: 34, border: 'none', borderRadius: 999, background: '#F0F0EC', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            <div style={{ padding: '28px 32px 34px' }}>
              <div className="sq-brand-mono" style={{ fontSize: 11, color: '#B6B6AE', marginBottom: 14 }}>
                {detail.id} · {String(detailIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </div>
              <h2 style={{ margin: '0 0 18px', fontFamily: 'var(--sq-serif)', fontWeight: 400, fontSize: 'clamp(25px,3.6vw,34px)', lineHeight: 1.14 }}>
                {highlightText(detail.question, terms)}
              </h2>
              <div style={{ background: '#FBFBF8', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <div className="sq-brand-mono" style={{ fontSize: 10, color: '#B6A23A', marginBottom: 8 }}>
                  {copy.terrain}
                </div>
                <p style={{ margin: 0, fontFamily: 'var(--sq-serif)', fontStyle: 'italic', fontSize: 19, lineHeight: 1.45 }}>
                  « {detail.douleur} »
                </p>
              </div>
              <div className="sq-brand-mono" style={{ fontSize: 11, color: '#B6B6AE', marginBottom: 10 }}>
                {copy.response}
              </div>
              {canViewFull(detail) && detail.answerFull ? (
                <>
                  <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.66 }}>{detail.answerFull}</p>
                  {detail.hasFiche && (
                    <div
                      style={{
                        marginTop: 22,
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 16,
                        padding: '16px 18px',
                        background: '#FBFBF9',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        <span className="sq-brand-mono" style={{ fontSize: 11 }}>
                          {copy.sheetTitle}
                        </span>
                        {detail.ficheDestineeA.length > 0 && (
                          <span style={{ fontSize: 11.5, color: '#9A9A93' }}>
                            {copy.sheetFor}: {detail.ficheDestineeA.join(', ')}
                          </span>
                        )}
                      </div>
                      {detail.ficheCount > 0 ? (
                        <SalimQaFicheStack questionId={detail.id} count={detail.ficheCount} />
                      ) : (
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#6B6B66' }}>
                          {copy.sheetMissing}
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ marginTop: 4 }}>
                  {renderAnswerBlock(detail)}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 26, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <button type="button" disabled={detailIdx <= 0} onClick={() => detailIdx > 0 && setDetailId(questions[detailIdx - 1].id)} style={{ opacity: detailIdx <= 0 ? 0.5 : 1, padding: '10px 18px', borderRadius: 11, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', cursor: detailIdx <= 0 ? 'default' : 'pointer' }}>
                  {copy.prev}
                </button>
                <span className="sq-brand-mono" style={{ flex: 1, textAlign: 'center', fontSize: 10.5, color: '#B6B6AE' }}>
                  p. {detail.page ?? '—'}
                </span>
                <button type="button" disabled={detailIdx >= questions.length - 1} onClick={() => detailIdx < questions.length - 1 && setDetailId(questions[detailIdx + 1].id)} style={{ opacity: detailIdx >= questions.length - 1 ? 0.5 : 1, padding: '10px 18px', borderRadius: 11, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', cursor: detailIdx >= questions.length - 1 ? 'default' : 'pointer' }}>
                  {copy.next}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {upgradeOpen && <UpgradeModal open onClose={() => setUpgradeOpen(false)} />}
    </div>
  )
}
