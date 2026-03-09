'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Brain, Users, Zap, Shuffle } from 'lucide-react'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { useLanguage } from '@/components/language-provider'

export default function RetroPage() {
  const { language, setLanguage } = useLanguage()
  const [isAnimating, setIsAnimating] = useState(false)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.03),transparent_50%)]" />
      </div>

      <PremiumNavbar />

      {/* Header */}
      <div className="relative z-20 px-4 md:px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-2xl bg-black/40">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div />
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                language === 'en'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                language === 'fr'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              FR
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 text-white leading-tight tracking-tight">
            {language === 'fr' ? 'Rétrospective IA' : 'AI Retrospective'}
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/80 font-light">
            {language === 'fr'
              ? 'Générez des rétros personnalisées qui répondent aux vrais défis de votre équipe'
              : 'Generate custom retro formats that address your team\'s real challenges'}
          </p>
          <p className="text-lg md:text-xl mb-12 text-white/60 font-light">
            {language === 'fr'
              ? '8 questions rapides pour un format sur-mesure avec des activités adaptées'
              : '8 quick questions for a personalized format with curated activities'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-20">
            <Link
              href="/retro/questionnaire"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 text-white font-bold text-lg"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">
                {language === 'fr' ? 'Commencer le questionnaire' : 'Start Questionnaire'}
              </span>
              <ArrowRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/retro/random"
              className="group inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-xl text-white font-bold text-lg hover:bg-white/10 hover:border-orange-500/50 hover:scale-105 transition-all duration-300"
            >
              <Shuffle className="w-6 h-6" />
              {language === 'fr' ? 'Rétro aléatoire' : 'Random Retro'}
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20 hover:border-purple-500/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 p-6 md:p-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <Brain className="w-12 h-12 mb-4 text-purple-300 relative z-10" />
              <h3 className="text-xl font-bold mb-2 text-white relative z-10">
                {language === 'fr' ? 'Détection de patterns' : 'Pattern Detection'}
              </h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed relative z-10">
                {language === 'fr'
                  ? 'Détecte 9 patterns de dysfonctionnement d\'équipe à partir de vos réponses'
                  : 'Detects 9 team dysfunction patterns from your answers'}
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-900/20 via-orange-900/20 to-yellow-900/20 hover:border-orange-500/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20 p-6 md:p-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <Users className="w-12 h-12 mb-4 text-orange-300 relative z-10" />
              <h3 className="text-xl font-bold mb-2 text-white relative z-10">
                {language === 'fr' ? 'Activités adaptées' : 'Tailored Activities'}
              </h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed relative z-10">
                {language === 'fr'
                  ? '146 activités adaptées à vos défis spécifiques'
                  : '146 curated activities mapped to your specific challenges'}
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-900/20 via-yellow-900/20 to-orange-900/20 hover:border-orange-500/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20 p-6 md:p-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <Zap className="w-12 h-12 mb-4 text-yellow-300 relative z-10" />
              <h3 className="text-xl font-bold mb-2 text-white relative z-10">
                {language === 'fr' ? 'Format 5 phases' : '5-Phase Format'}
              </h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed relative z-10">
                {language === 'fr'
                  ? 'Structure complète : Contexte, Collecte, Insights, Décision, Clôture'
                  : 'Complete structure: Set Stage, Gather Data, Generate Insights, Decide, Close'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
