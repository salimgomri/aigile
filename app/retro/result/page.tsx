'use client'

import { useEffect, useState, Suspense, useCallback, useMemo, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { QuestionId, getDurationFromAnswers } from '@/lib/retro/questionnaire'
import { detectPatterns, getProblemKeyFromPattern } from '@/lib/retro/pattern-detection'
import { generateRetroPlan, getTimeAllocationTips as getTerrainTips, getFacilitationTechnique, ActivitySelection } from '@/lib/retro/activity-selector'
import { downloadRetroPDF } from '@/lib/generate-pdf'
import { ArrowLeft, Clock, Shuffle, Target, FileDown, Sparkles } from 'lucide-react'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import CreditButton from '@/components/credits/CreditButton'
import UpgradeModal from '@/components/credits/UpgradeModal'
import { useCredits } from '@/lib/credits/CreditContext'
import { useSession } from '@/lib/auth-client'
import { trackEvent } from '@/lib/gtag'

const PHASE_NAME_MAP: Record<string, { en: string; fr: string }> = {
  'Set the stage': { en: 'Set the Stage', fr: 'Créer le Contexte' },
  'Gather data': { en: 'Gather Data', fr: 'Collecter les Données' },
  'Generate insights': { en: 'Generate Insights', fr: 'Générer des Insights' },
  'Decide what to do': { en: 'Decide What to Do', fr: 'Décider Quoi Faire' },
  'Close the retro': { en: 'Close the Retro', fr: 'Clore la Rétro' },
}

function getPhaseNumber(phase: string): number {
  const map: Record<string, number> = {
    'Set the stage': 1, 'Set the Stage': 1, 'Créer le contexte': 1, 'Créer le Contexte': 1,
    'Gather data': 2, 'Gather Data': 2, 'Collecter les données': 2, 'Collecter les Données': 2,
    'Generate insights': 3, 'Generate Insights': 3, 'Générer des insights': 3, 'Générer des Insights': 3,
    'Decide what to do': 4, 'Decide What to Do': 4, 'Décider quoi faire': 4, 'Décider Quoi Faire': 4,
    'Close the retro': 5, 'Close the Retro': 5, 'Fermer la rétro': 5, 'Clore la Rétro': 5,
  }
  return map[phase] || 1
}

function getPhaseColor(phaseNumber: number) {
  const colors: Record<number, { bg: string; gradient: string }> = {
    1: { bg: 'from-blue-500 to-blue-600', gradient: 'from-blue-500/20 to-blue-600/20' },
    2: { bg: 'from-green-500 to-green-600', gradient: 'from-green-500/20 to-green-600/20' },
    3: { bg: 'from-yellow-500 to-yellow-600', gradient: 'from-yellow-500/20 to-yellow-600/20' },
    4: { bg: 'from-orange-500 to-orange-600', gradient: 'from-orange-500/20 to-orange-600/20' },
    5: { bg: 'from-purple-500 to-purple-600', gradient: 'from-purple-500/20 to-purple-600/20' },
  }
  return colors[phaseNumber] || colors[1]
}

function parseInstructions(instructions: string): { number: number; title: string; details: string[] }[] {
  if (!instructions) return []
  const lines = instructions.split('\n').filter((l) => l.trim())
  const steps: { number: number; title: string; details: string[] }[] = []
  let current: { number: number; title: string; details: string[] } | null = null
  for (const line of lines) {
    const trimmed = line.trim()
    const m = trimmed.match(/^(\d+)\.\s*(.+)/)
    if (m) {
      if (current) steps.push(current)
      current = { number: parseInt(m[1]), title: m[2], details: [] }
    } else if (current && trimmed) {
      current.details.push(trimmed.replace(/^[-•]\s*/, ''))
    }
  }
  if (current) steps.push(current)
  return steps.length ? steps : [{ number: 1, title: '', details: lines }]
}

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const [retroPlan, setRetroPlan] = useState<any>(null)
  const [detection, setDetection] = useState<any>(null)
  const [duration, setDuration] = useState(60)
  const [teamSize, setTeamSize] = useState(7)
  const [loading, setLoading] = useState(true)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeActivityIndex, setActiveActivityIndex] = useState(-1)
  const [planUnlocked, setPlanUnlocked] = useState(false)
  const [unlockedPattern, setUnlockedPattern] = useState<{ name: string; nameFr: string; description: string; descriptionFr: string } | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { refresh: refreshCredits } = useCredits()
  const { data: session } = useSession()
  const triggerGenerateRef = useRef<(() => void) | null>(null)
  const isLoggedIn = !!session?.user

  useEffect(() => {
    const data = searchParams?.get('data')
    const randomTeamSize = searchParams?.get('teamSize')
    if (!data) {
      router.push('/retro')
      return
    }
    try {
      const decoded = Buffer.from(data, 'base64').toString()
      const answers = JSON.parse(decoded) as Record<QuestionId, string>
      const result = detectPatterns(answers)
      setDetection(result)
      const retroDuration = getDurationFromAnswers(answers)
      setDuration(retroDuration)
      const finalTeamSize = randomTeamSize ? parseInt(randomTeamSize) : 7
      setTeamSize(finalTeamSize)
      const problemKey = getProblemKeyFromPattern(result.primary.code)
      const plan = generateRetroPlan(retroDuration, finalTeamSize, problemKey, language)
      setRetroPlan(plan)
      setPlanUnlocked(searchParams?.get('random') === 'true') // random = déjà payé, plan débloqué
      setLoading(false)
    } catch (error) {
      console.error('Error parsing data:', error)
      router.push('/retro')
    }
  }, [searchParams, router, language])

  // Fetch pattern from API when plan unlocked via random (already paid)
  useEffect(() => {
    const isRandom = searchParams?.get('random') === 'true'
    if (!planUnlocked || !isRandom || unlockedPattern || !detection?.primary?.code) return
    fetch(`/api/retro/pattern?code=${detection.primary.code}`)
      .then((r) => r.ok ? r.json() : null)
      .then((p) => p && setUnlockedPattern(p))
      .catch(() => {})
  }, [planUnlocked, searchParams, unlockedPattern, detection?.primary?.code])

  // IntersectionObserver + scroll for active step
  useEffect(() => {
    if (!retroPlan?.activities?.length) return
    const handleScroll = () => setScrollY(window.scrollY)
    const checkActive = () => {
      const intro = document.getElementById('intro-section')
      const final = document.getElementById('final-section')
      const vh = window.innerHeight / 2
      if (intro) {
        const ir = intro.getBoundingClientRect()
        if (ir.top < vh && ir.bottom > vh * 0.3) {
          setActiveActivityIndex(-1)
          return
        }
      }
      if (final) {
        const fr = final.getBoundingClientRect()
        if (fr.top < window.innerHeight * 0.8 && fr.bottom > window.innerHeight * 0.2) {
          setActiveActivityIndex(-2)
          return
        }
      }
      for (let i = 0; i < retroPlan.activities.length; i++) {
        const el = document.getElementById(`activity-${i}`)
        if (el) {
          const r = el.getBoundingClientRect()
          if (r.top < vh && r.bottom > vh * 0.3) {
            setActiveActivityIndex(i)
            return
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    const interval = setInterval(checkActive, 150)
    checkActive()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [retroPlan])

  const scrollToIntro = useCallback(() => {
    document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveActivityIndex(-1)
  }, [])
  const scrollToActivity = useCallback((index: number) => {
    document.getElementById(`activity-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveActivityIndex(index)
  }, [])
  const scrollToFinal = useCallback(() => {
    const el = document.getElementById('final-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    setActiveActivityIndex(-2)
  }, [])

  const handleDownloadPDF = useCallback(async () => {
    if (!retroPlan) return
    setPdfLoading(true)
    try {
      const res = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retro_pdf' }),
      })
      if (!res.ok) {
        if (res.status === 403) setShowUpgrade(true)
        return
      }
      await refreshCredits()
      await downloadRetroPDF(
        retroPlan,
        unlockedPattern ? { name: unlockedPattern.name, nameFr: unlockedPattern.nameFr, description: unlockedPattern.description, descriptionFr: unlockedPattern.descriptionFr } : null,
        language,
        teamSize
      )
    } finally {
      setPdfLoading(false)
    }
  }, [retroPlan, unlockedPattern, language, teamSize, searchParams, refreshCredits])

  if (loading || !detection || !retroPlan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          {language === 'fr' ? 'Génération de votre rétro personnalisée...' : 'Generating your personalized retro...'}
        </div>
      </div>
    )
  }

  const terrainTips = getTerrainTips(duration, teamSize, language)
  const facilitation = getFacilitationTechnique(teamSize, language)
  const isRandom = searchParams?.get('random') === 'true'
  const showPlanOnly = planUnlocked || isRandom

  const saveRetroContext = () => {
    const payload = {
      data: searchParams?.get('data'),
      teamSize: searchParams?.get('teamSize') || String(teamSize),
      random: searchParams?.get('random') || undefined,
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('retro_pending_unlock', JSON.stringify(payload))
    }
  }

  const handleSignUpToUnlock = () => {
    trackEvent('retro_pattern_signup_click', { pattern_code: detection.primary.code })
    saveRetroContext()
    window.location.href = '/register?from=retro_pattern'
  }

  const handleLoginToUnlock = () => {
    trackEvent('retro_pattern_login_click', { pattern_code: detection.primary.code })
    saveRetroContext()
    window.location.href = '/login?redirect=/retro/result-redirect'
  }

  const placeholderLabel = showPlanOnly
    ? (language === 'fr' ? 'Chargement...' : 'Loading...')
    : (language === 'fr' ? 'Pattern détecté — Débloquez pour voir' : 'Detected pattern — Unlock to see')
  const placeholderDesc = showPlanOnly
    ? ''
    : (language === 'fr' ? 'Générez le plan IA pour découvrir le diagnostic personnalisé.' : 'Generate the AI plan to discover your personalized diagnosis.')
  const problemLabel = unlockedPattern ? (language === 'fr' ? unlockedPattern.nameFr : unlockedPattern.name) : placeholderLabel
  const problemDesc = unlockedPattern ? (language === 'fr' ? unlockedPattern.descriptionFr : unlockedPattern.description) : placeholderDesc

  if (!showPlanOnly) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <PremiumNavbar />
        <div className="relative z-30 px-4 md:px-8 py-6 border-b border-white/5 backdrop-blur-2xl bg-black/40">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button onClick={() => router.push('/retro')} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{language === 'fr' ? 'Retour' : 'Back'}</span>
            </button>
          </div>
        </div>
        <div className="relative z-10 w-full py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div
              role={isLoggedIn ? undefined : 'button'}
              tabIndex={isLoggedIn ? undefined : 0}
              onClick={isLoggedIn ? undefined : () => setShowAuthModal(true)}
              onKeyDown={isLoggedIn ? undefined : (e) => e.key === 'Enter' && setShowAuthModal(true)}
              className={`bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent backdrop-blur-3xl rounded-[3rem] border p-8 md:p-12 shadow-2xl shadow-black/50 transition-all duration-300 ${
                isLoggedIn ? 'border-white/10' : 'border-white/10 hover:border-aigile-gold/40 cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center shadow-2xl shadow-green-500/70">
                  <span className="text-white text-3xl font-bold">✓</span>
                </div>
                <div className="flex-1 pt-2">
                  <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight tracking-tight">
                    {unlockedPattern ? problemLabel : (
                      <span className={!isLoggedIn ? 'text-orange-400/90' : ''}>{problemLabel}</span>
                    )}
                  </h1>
                </div>
              </div>
              <p className="text-lg text-white/60 font-light leading-relaxed mb-6">
                {problemDesc}
              </p>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8">
                <div className="text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">
                  {language === 'fr' ? 'Pattern détecté' : 'Detected pattern'}
                </div>
                <div className="text-2xl font-semibold text-orange-400">
                  {problemLabel}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-2 font-medium">{language === 'fr' ? 'Durée' : 'Duration'}</div>
                  <div className="text-xl font-semibold text-white">{duration} min</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-2 font-medium">{language === 'fr' ? 'Équipe' : 'Team'}</div>
                  <div className="text-xl font-semibold text-white">{teamSize} {language === 'fr' ? 'pers.' : 'people'}</div>
                </div>
              </div>
              <p className="text-white/70 mb-8">
                {language === 'fr'
                  ? 'Obtenez un plan rétro personnalisé avec 5 activités curées et des instructions détaillées.'
                  : 'Get a personalized retro plan with 5 curated activities and detailed instructions.'}
              </p>
              <div id="generate-plan-cta">
                {isLoggedIn ? (
                  <CreditButton
                    action="retro_ai_plan"
                    extraBody={{ patternCode: detection.primary.code }}
                    triggerRef={triggerGenerateRef}
                    onConfirmed={async (res) => {
                      if (res?.pattern) {
                        setUnlockedPattern(res.pattern)
                        setShowCongrats(true)
                        trackEvent('retro_plan_unlocked', {
                          pattern_code: detection.primary.code,
                          value: 3,
                          currency: 'EUR',
                        })
                      }
                      setPlanUnlocked(true)
                      await refreshCredits()
                    }}
                    className="w-full py-5 md:py-6 text-base md:text-lg rounded-xl font-semibold"
                  >
                    <Sparkles className="w-6 h-6" />
                    {language === 'fr' ? '✨ Générer le plan IA (3 crédits)' : '✨ Generate AI plan (3 credits)'}
                  </CreditButton>
                ) : (
                  <div
                    className="flex items-center justify-center gap-2 py-4 text-aigile-gold font-medium cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowAuthModal(true)
                    }}
                  >
                    <span className="animate-pulse-gentle">
                      {language === 'fr' ? 'Cliquez pour débloquer' : 'Click to unlock'}
                    </span>
                    <span className="text-xl">→</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Inscription / Connexion */}
        {showAuthModal && !isLoggedIn && (
          <>
            <div
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              onClick={() => setShowAuthModal(false)}
              aria-hidden
            />
            <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
              <div
                className="bg-[#0f2240] border border-aigile-gold/30 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  {language === 'fr' ? 'Débloquez ton diagnostic' : 'Unlock your diagnosis'}
                </h3>
                <p className="text-white/70 text-center mb-6 text-sm">
                  {language === 'fr'
                    ? 'Inscrivez-vous ou connectez-vous pour découvrir le plan personnalisé.'
                    : 'Sign up or log in to discover your personalized plan.'}
                </p>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleSignUpToUnlock}
                    className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-aigile-gold to-book-orange hover:from-book-orange hover:to-aigile-gold text-black transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-aigile-gold/20 hover:shadow-aigile-gold/40 animate-cta-glow"
                  >
                    <Sparkles className="w-5 h-5" />
                    {language === 'fr' ? 'Inscrivez-vous (30 sec)' : 'Sign up (30 sec)'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLoginToUnlock}
                    className="w-full py-3 rounded-xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {language === 'fr' ? 'Déjà un compte ? Connectez-vous' : 'Already have an account? Log in'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-full mt-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
                >
                  {language === 'fr' ? 'Plus tard' : 'Later'}
                </button>
              </div>
            </div>
          </>
        )}
        <PremiumFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden">
      {/* Right sidebar - navigation */}
      {retroPlan.activities.length > 0 && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-6 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl">
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            className="group relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/50 hover:scale-110 transition-all duration-300 disabled:opacity-70"
            title={language === 'fr' ? 'Télécharger le PDF' : 'Download PDF'}
          >
            <FileDown className="w-7 h-7 text-white" />
          </button>
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <button
            onClick={scrollToIntro}
            className={`flex flex-col items-center gap-2 transition-all ${activeActivityIndex === -1 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            title={language === 'fr' ? 'Contexte' : 'Context'}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                activeActivityIndex === -1 ? 'bg-gradient-to-br from-green-500 to-green-600 scale-110 shadow-lg shadow-green-500/50' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <span className="text-white text-lg font-bold">✓</span>
            </div>
            <span className={`text-xs font-medium ${activeActivityIndex === -1 ? 'text-green-400' : 'text-white/40'}`}>
              {language === 'fr' ? 'Contexte' : 'Context'}
            </span>
          </button>
          {retroPlan.activities.map((sel: ActivitySelection, index: number) => {
            const phaseNum = getPhaseNumber(sel.phase)
            const colors = getPhaseColor(phaseNum)
            const isActive = activeActivityIndex === index
            return (
              <button
                key={index}
                onClick={() => scrollToActivity(index)}
                className="flex flex-col items-center gap-2 transition-all"
                title={`${language === 'fr' ? 'Phase' : 'Phase'} ${index + 1}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive ? `bg-gradient-to-br ${colors.bg} scale-110 shadow-lg` : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-white/60'}`}>{index + 1}</span>
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-orange-400' : 'text-white/40'}`}>
                  {language === 'fr' ? 'Phase' : 'Phase'} {index + 1}
                </span>
              </button>
            )
          })}
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <button
            onClick={scrollToFinal}
            className={`flex flex-col items-center gap-2 transition-all ${activeActivityIndex === -2 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            title={language === 'fr' ? 'Conseils' : 'Tips'}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                activeActivityIndex === -2 ? 'bg-gradient-to-br from-purple-500 to-purple-600 scale-110 shadow-lg shadow-purple-500/50' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <span className="text-white text-xl">💡</span>
            </div>
            <span className={`text-xs font-medium ${activeActivityIndex === -2 ? 'text-purple-400' : 'text-white/40'}`}>
              {language === 'fr' ? 'Conseils' : 'Tips'}
            </span>
          </button>
        </div>
      )}

      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.15}px)`, animationDelay: '1s' }}
        />
      </div>

      <PremiumNavbar />

      {/* Header */}
      <div className="relative z-30 px-4 md:px-8 py-6 border-b border-white/5 backdrop-blur-2xl bg-black/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/retro')}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{language === 'fr' ? 'Retour' : 'Back'}</span>
          </button>
          {isRandom && (
            <button
              onClick={() => router.push('/retro/random')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
            >
              <Shuffle className="w-5 h-5" />
              {language === 'fr' ? 'Nouvelle rétro aléatoire' : 'New random retro'}
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full py-16 md:py-24">
        {/* Intro section */}
        <div id="intro-section" className="w-full px-4 md:px-8 lg:px-12 xl:px-16 mb-20 scroll-mt-24">
          <div className="bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 md:p-12 lg:p-16 shadow-2xl shadow-black/50">
            {showCongrats && (
              <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-aigile-gold/20 border border-green-500/30 animate-fade-in-up">
                <p className="text-xl md:text-2xl font-bold text-white">
                  {language === 'fr' ? '🎉 Félicitations pour ta première rétro !' : '🎉 Congratulations on your first retro!'}
                </p>
                <p className="text-lg text-white/90 mt-2">
                  {language === 'fr' ? 'Le pattern détecté est : ' : 'The detected pattern is: '}
                  <span className="text-aigile-gold font-semibold">{problemLabel}</span>
                </p>
              </div>
            )}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center shadow-2xl shadow-green-500/70">
                    <span className="text-white text-3xl font-bold">✓</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight tracking-tight">
                      {problemLabel}
                    </h1>
                  </div>
                </div>
                <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">{problemDesc}</p>
                {!isRandom && (
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                    <div className="text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">
                      {language === 'fr' ? 'Pattern détecté' : 'Detected pattern'}
                    </div>
                    <div className="text-2xl font-semibold text-orange-400">{problemLabel}</div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-7 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mb-2 font-medium">
                      {language === 'fr' ? 'Durée' : 'Duration'}
                    </div>
                    <div className="text-xl font-semibold text-white">{duration} min</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mb-2 font-medium">
                      {language === 'fr' ? 'Équipe' : 'Team'}
                    </div>
                    <div className="text-xl font-semibold text-white">{teamSize} {language === 'fr' ? 'pers.' : 'people'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mb-2 font-medium">
                      {language === 'fr' ? 'Total' : 'Total'}
                    </div>
                    <div className="text-xl font-semibold text-white">{retroPlan.totalTime} min</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mb-2 font-medium">
                      {language === 'fr' ? 'Activités' : 'Activities'}
                    </div>
                    <div className="text-xl font-semibold text-white">{retroPlan.activities.length}</div>
                  </div>
                </div>
                {terrainTips.length > 0 && (
                  <div className="border-t border-white/10 pt-8">
                    <h3 className="flex items-center gap-2 font-bold text-lg text-white mb-4">
                      <Target className="w-6 h-6 text-orange-400" />
                      {language === 'fr' ? 'Logique Terrain' : 'Field Logic'}
                    </h3>
                    <ul className="space-y-2 text-white/80 text-sm">
                      {terrainTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">→</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="border-t border-white/10 pt-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {language === 'fr' ? 'Vue d\'ensemble des activités' : 'Activities Overview'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {retroPlan.activities.map((sel: ActivitySelection, index: number) => {
                      const phaseNum = getPhaseNumber(sel.phase)
                      const colors = getPhaseColor(phaseNum)
                      const phaseName = PHASE_NAME_MAP[sel.phase]
                      const name = language === 'fr' ? (phaseName?.fr ?? sel.phase) : (phaseName?.en ?? sel.phase)
                      return (
                        <button
                          key={index}
                          onClick={() => scrollToActivity(index)}
                          className="text-left p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all group"
                        >
                          <div className="flex items-start gap-4 mb-3">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl font-semibold text-white`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-300 transition-colors line-clamp-2">
                                {language === 'fr' ? sel.activity.nameFr : sel.activity.name}
                              </h4>
                              <div className="text-xs text-white/50 uppercase tracking-wider">{name}</div>
                            </div>
                          </div>
                          <p className="text-sm text-white/70 line-clamp-2">{language === 'fr' ? sel.activity.summaryFr : sel.activity.summary}</p>
                          <div className="flex items-center gap-3 mt-3 text-xs text-white/50">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {sel.allocatedTime} min
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities list */}
        <div className="space-y-0">
          {retroPlan.activities.map((sel: ActivitySelection, index: number) => {
            const phaseNum = getPhaseNumber(sel.phase)
            const colors = getPhaseColor(phaseNum)
            const phaseName = PHASE_NAME_MAP[sel.phase]
            const phaseLabel = language === 'fr' ? (phaseName?.fr ?? sel.phase) : (phaseName?.en ?? sel.phase)
            const steps = parseInstructions(language === 'fr' ? sel.activity.descriptionFr : sel.activity.description)
            return (
              <div
                key={index}
                id={`activity-${index}`}
                className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border-y border-white/10 hover:bg-white/[0.07] transition-all"
              >
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
                  <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-3 flex flex-col items-start lg:items-center gap-6">
                      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br ${colors.bg} shadow-2xl`}>
                        {index + 1}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 rounded-lg border border-white/30 text-white/80 bg-white/10 text-sm font-medium">
                          {sel.allocatedTime} min
                        </span>
                        <span className="px-4 py-2 rounded-lg border border-white/30 text-white/80 bg-white/10 text-sm font-medium">
                          ~{sel.timePerPerson >= 60 ? `${Math.floor(sel.timePerPerson / 60)}min` : `${sel.timePerPerson}s`}/pers
                        </span>
                      </div>
                    </div>
                    <div className="lg:col-span-9">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {language === 'fr' ? sel.activity.nameFr : sel.activity.name}
                      </h2>
                      <p className="text-xl text-white/70 leading-relaxed mb-6">
                        {language === 'fr' ? sel.activity.summaryFr : sel.activity.summary}
                      </p>
                      <div className={`mb-10 p-6 bg-gradient-to-r ${colors.gradient} backdrop-blur-xl rounded-2xl border border-white/10`}>
                        <div className="text-sm uppercase tracking-wider text-white/70 mb-2 font-medium">
                          {language === 'fr' ? 'Phase' : 'Phase'}
                        </div>
                        <div className="text-2xl font-bold text-white">{phaseLabel}</div>
                        <p className="text-white/80 mt-2 text-sm">{facilitation}</p>
                      </div>
                      <div className="mb-10">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                          <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
                          {language === 'fr' ? 'Comment faire' : 'How to do it'}
                        </h3>
                        <div className="space-y-5">
                          {steps.map((step, si) => (
                            <div key={si} className="p-7 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                              <div className="flex gap-6">
                                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/30 border border-orange-500/40 flex items-center justify-center text-xl font-bold text-orange-200">
                                  {step.number}
                                </div>
                                <div className="flex-1">
                                  {step.title && (
                                    <h4 className="text-xl font-semibold text-white mb-4">{step.title}</h4>
                                  )}
                                  {step.details.length > 0 && (
                                    <ul className="space-y-3">
                                      {step.details.map((d, di) => (
                                        <li key={di} className="text-white/85 leading-relaxed flex items-start gap-3">
                                          <span className="text-orange-400 mt-2 w-2 h-2 rounded-full flex-shrink-0" />
                                          <span>{d}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Final section */}
        <div id="final-section" className="max-w-5xl mx-auto px-4 md:px-8 scroll-mt-24">
          <div className="mt-20 p-10 md:p-14 bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-purple-500/5 backdrop-blur-2xl rounded-3xl border border-white/10">
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-500/70">
                <span className="text-white text-3xl">💡</span>
              </div>
              <div className="flex-1 pt-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {language === 'fr' ? 'Récapitulatif' : 'Summary'}
                </h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-5 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-2">{language === 'fr' ? 'Durée totale' : 'Total duration'}</div>
                <div className="text-2xl font-bold text-white">{retroPlan.totalTime} min</div>
              </div>
              <div className="p-5 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-2">{language === 'fr' ? 'Technique' : 'Technique'}</div>
                <div className="text-xl font-semibold text-white">{facilitation}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold text-lg hover:from-orange-400 hover:to-orange-500 transition-all hover:scale-105 shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                {pdfLoading ? (language === 'fr' ? 'Génération...' : 'Generating...') : (language === 'fr' ? 'Télécharger le PDF' : 'Download PDF')}
              </button>
              <button
                onClick={() => router.push('/retro/questionnaire')}
                className="px-8 py-4 bg-white/10 border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all hover:scale-105"
              >
                {language === 'fr' ? 'Nouveau questionnaire' : 'New questionnaire'}
              </button>
              <button
                onClick={() => router.push('/retro/random')}
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Shuffle className="w-5 h-5" />
                {language === 'fr' ? 'Rétro aléatoire' : 'Random retro'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <PremiumFooter />
      {showUpgrade && <UpgradeModal open onClose={() => setShowUpgrade(false)} />}
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">Loading...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}
