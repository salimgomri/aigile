'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, FileDown, LayoutDashboard, Sparkles } from 'lucide-react'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { useLanguage } from '@/components/language-provider'
import { DashboardManagerNewBadge } from '@/components/tools/DashboardManagerNewBadge'

export default function DashboardManagerLandingPage() {
  const { language, setLanguage } = useLanguage()
  const fr = language === 'fr'

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-[#c8a84b]/20 via-[#c8a84b]/5 to-transparent blur-3xl" />
        <div
          className="absolute bottom-1/4 right-1/4 h-[800px] w-[800px] animate-pulse rounded-full bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent blur-3xl"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,168,75,0.04),transparent_50%)]" />
      </div>

      <PremiumNavbar />

      <div className="relative z-20 flex items-center justify-between border-b border-white/5 bg-black/40 px-4 py-6 backdrop-blur-2xl md:px-8">
        <div className="mx-auto flex w-full max-w-7xl justify-end gap-2">
          {(['en', 'fr'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                language === lang
                  ? 'scale-105 bg-[#c8a84b] text-black shadow-lg shadow-[#c8a84b]/40'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c8a84b]">
            {fr ? 'Le Système S.A.L.I.M.' : 'The S.A.L.I.M. System'}
          </p>
          <h1 className="mb-4 flex flex-wrap items-center justify-center gap-3 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Dashboard Manager
            <DashboardManagerNewBadge language={fr ? 'fr' : 'en'} className="!text-[10px]" />
          </h1>
          <p className="mb-6 text-xl font-light text-white/80 md:text-2xl">
            {fr
              ? 'Votre cockpit sprint : 6 cadrans RAG, vélocité, OKR et narrative manager'
              : 'Your sprint cockpit: 6 RAG dials, velocity, OKRs and manager narrative'}
          </p>
          <p className="mb-12 text-lg font-light text-white/55 md:text-xl">
            {fr
              ? 'Personnalisez, imprimez en PDF — narrative IA en 2 crédits (Prompt P25)'
              : 'Customize, export PDF — AI narrative for 2 credits (Prompt P25)'}
          </p>

          <div className="mb-20 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/dashboard-manager/studio"
              className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#c8a84b] to-[#b8943e] px-8 py-5 text-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#c8a84b]/40"
            >
              <span className="relative z-10">{fr ? 'Ouvrir le studio' : 'Open studio'}</span>
              <ArrowRight className="relative z-10 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-[#c8a84b]/25 bg-gradient-to-br from-[#c8a84b]/10 to-emerald-900/10 p-6 transition-all hover:scale-[1.02] hover:border-[#c8a84b]/50 md:rounded-3xl md:p-8">
              <LayoutDashboard className="relative z-10 mb-4 h-12 w-12 text-[#c8a84b]" />
              <h3 className="relative z-10 mb-2 text-xl font-bold text-white">
                {fr ? '6 cadrans RAG' : '6 RAG dials'}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-white/75 md:text-base">
                {fr
                  ? 'On Time, Budget, Scope, Qualité, Maturité, Bien-être — seuils S.A.L.I.M.'
                  : 'On Time, Budget, Scope, Quality, Maturity, Wellbeing — S.A.L.I.M. thresholds'}
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border-2 border-emerald-500/25 bg-gradient-to-br from-emerald-900/20 to-black/40 p-6 transition-all hover:scale-[1.02] md:rounded-3xl md:p-8">
              <BarChart3 className="relative z-10 mb-4 h-12 w-12 text-emerald-300" />
              <h3 className="relative z-10 mb-2 text-xl font-bold text-white">
                {fr ? 'Vélocité & OKR' : 'Velocity & OKRs'}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-white/75 md:text-base">
                {fr
                  ? 'Sparkline 6 sprints, moyenne glissante et check-in trimestriel'
                  : '6-sprint sparkline, rolling average and quarterly check-in'}
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border-2 border-white/15 bg-gradient-to-br from-white/5 to-black/40 p-6 transition-all hover:scale-[1.02] md:rounded-3xl md:p-8">
              <Sparkles className="relative z-10 mb-4 h-12 w-12 text-white/90" />
              <h3 className="relative z-10 mb-2 text-xl font-bold text-white">
                {fr ? 'Narrative IA' : 'AI narrative'}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-white/75 md:text-base">
                {fr
                  ? 'Génération P25 factuelle (2 cr.) · export PDF (1 cr.)'
                  : 'Factual P25 generation (2 cr.) · PDF export (1 cr.)'}
              </p>
              <FileDown className="relative z-10 mt-3 h-5 w-5 text-[#c8a84b]" />
            </div>
          </div>
        </div>
      </div>

      <PremiumFooter />
    </div>
  )
}
