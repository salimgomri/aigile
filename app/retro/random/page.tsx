'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { Shuffle, Clock, Users } from 'lucide-react'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import CreditButton from '@/components/credits/CreditButton'

export default function RandomRetroPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [generating, setGenerating] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState<number>(60)
  const [teamSize, setTeamSize] = useState<number>(7)

  const problems = ['silent-team', 'lack-purpose', 'repetitive-complaints', 'no-team', 'burnout', 'tensions']

  const durations = [
    { value: 30, label: '30 min', labelFr: '30 min' },
    { value: 45, label: '45 min', labelFr: '45 min' },
    { value: 60, label: '60 min', labelFr: '60 min' },
    { value: 90, label: '90 min', labelFr: '90 min' },
  ]

  const teamSizes = [
    { value: 5, label: '3-5', labelFr: '3-5' },
    { value: 7, label: '6-8', labelFr: '6-8' },
    { value: 10, label: '9-12', labelFr: '9-12' },
    { value: 15, label: '12+', labelFr: '12+' },
  ]

  const generateRandomRetro = async () => {
    setGenerating(true)
    setTimeout(() => {
      const mockAnswers = {
        Q1: 'Q1A1',
        Q2: 'Q2A1',
        Q3: 'Q3A1',
        Q4: 'Q4A1',
        Q5: 'Q5A1',
        Q6: 'Q6A1',
        Q7: 'Q7A1',
        Q8: selectedDuration === 30 ? 'Q8A1' : selectedDuration === 45 ? 'Q8A2' : selectedDuration === 60 ? 'Q8A3' : 'Q8A4',
      }
      const encoded = Buffer.from(JSON.stringify(mockAnswers)).toString('base64')
      router.push(`/retro/result?data=${encoded}&random=true&teamSize=${teamSize}`)
    }, 1500)
  }

  const getTeamSizeWarning = () => {
    if (teamSize >= 15) return language === 'fr' ? '⚠️ Équipe très grande : 2+ facilitateurs recommandés' : '⚠️ Very large team: 2+ facilitators recommended'
    if (teamSize >= 10) return language === 'fr' ? '💡 Grande équipe : utilisez des breakouts (groupes de 4-6)' : '💡 Large team: use breakouts (groups of 4-6)'
    return null
  }
  const warning = getTeamSizeWarning()

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background - même style que questionnaire */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <PremiumNavbar />

      {/* Header - même structure que questionnaire */}
      <div className="relative z-20 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-black/50">
        <Link
          href="/retro"
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="font-medium">{language === 'fr' ? 'Retour' : 'Back'}</span>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              language === 'en' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('fr')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              language === 'fr' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            FR
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-[calc(100vh-180px)] flex items-center justify-center p-4 md:p-8">
        <div className="max-w-3xl w-full">
          {/* Badge titre - style questionnaire */}
          <div className="text-center mb-6 md:mb-8">
            <span className="inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs md:text-sm font-medium">
              {language === 'fr' ? 'Rétro Aléatoire' : 'Random Retro'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-white text-center">
            {language === 'fr' ? 'Obtenez une rétrospective avec 5 activités curées' : 'Get a random retrospective with 5 curated activities'}
          </h1>

          {/* Duration - cartes style questionnaire */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-400" />
              <h3 className="text-base md:text-lg font-semibold text-white">
                {language === 'fr' ? 'Durée' : 'Duration'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDuration(d.value)}
                  className={`group relative rounded-xl md:rounded-2xl border-2 text-left p-4 md:p-6 transition-all duration-300 overflow-hidden ${
                    selectedDuration === d.value
                      ? 'border-orange-500 bg-orange-500/10 scale-[1.02] shadow-2xl shadow-orange-500/20'
                      : 'border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10 hover:scale-[1.01]'
                  }`}
                >
                  {selectedDuration === d.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl md:rounded-2xl blur-xl" />
                  )}
                  <span className={`relative z-10 text-lg md:text-xl font-bold ${selectedDuration === d.value ? 'text-orange-400' : 'text-white group-hover:text-orange-400'}`}>
                    {language === 'fr' ? d.labelFr : d.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Team size - cartes style questionnaire */}
          <div className="mb-8 md:mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-orange-400" />
              <h3 className="text-base md:text-lg font-semibold text-white">
                {language === 'fr' ? 'Taille de l\'équipe' : 'Team Size'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {teamSizes.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setTeamSize(s.value)}
                  className={`group relative rounded-xl md:rounded-2xl border-2 text-left p-4 md:p-6 transition-all duration-300 overflow-hidden ${
                    teamSize === s.value
                      ? 'border-orange-500 bg-orange-500/10 scale-[1.02] shadow-2xl shadow-orange-500/20'
                      : 'border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10 hover:scale-[1.01]'
                  }`}
                >
                  {teamSize === s.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl md:rounded-2xl blur-xl" />
                  )}
                  <span className={`relative z-10 text-lg md:text-xl font-bold ${teamSize === s.value ? 'text-orange-400' : 'text-white group-hover:text-orange-400'}`}>
                    {language === 'fr' ? s.labelFr : s.label} {language === 'fr' ? 'pers.' : 'ppl'}
                  </span>
                </button>
              ))}
            </div>
            {warning && (
              <div className="mt-4 rounded-xl border-2 border-orange-500/30 bg-orange-500/10 p-3 text-orange-400 text-sm">
                {warning}
              </div>
            )}
          </div>

          {/* CTA - style questionnaire (bouton Suivant) */}
          <CreditButton
            action="retro_random"
            onConfirmed={generateRandomRetro}
            disabled={generating}
            className={`w-full py-5 md:py-6 text-base md:text-lg rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
              generating
                ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed border-2 border-gray-700/50'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/50 text-white border-0'
            }`}
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
                {language === 'fr' ? 'Génération...' : 'Generating...'}
              </>
            ) : (
              <>
                <Shuffle className="w-6 h-6" />
                {language === 'fr' ? '✨ Générer une Rétro' : '✨ Generate Retro'}
              </>
            )}
          </CreditButton>

          <p className="text-center text-white/40 text-xs md:text-sm mt-6">
            {language === 'fr'
              ? '💡 Parfait pour essayer de nouvelles activités ou quand vous manquez d\'inspiration'
              : '💡 Perfect for trying new activities or when you need inspiration'}
          </p>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
