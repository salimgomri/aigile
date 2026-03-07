'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { Shuffle, ArrowLeft, Clock, Users } from 'lucide-react'

export default function RandomRetroPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [generating, setGenerating] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState<number>(60)
  const [teamSize, setTeamSize] = useState<number>(7)

  // Problem keys for random selection
  const problems = [
    'silent-team',
    'lack-purpose', 
    'repetitive-complaints',
    'no-team',
    'burnout',
    'tensions'
  ]

  const durations = [
    { value: 30, label: '30 min', labelFr: '30 min' },
    { value: 45, label: '45 min', labelFr: '45 min' },
    { value: 60, label: '60 min', labelFr: '60 min' },
    { value: 90, label: '90 min', labelFr: '90 min' }
  ]

  const teamSizes = [
    { value: 5, label: '3-5', labelFr: '3-5' },
    { value: 7, label: '6-8', labelFr: '6-8' },
    { value: 10, label: '9-12', labelFr: '9-12' },
    { value: 15, label: '12+', labelFr: '12+' }
  ]

  const generateRandomRetro = () => {
    setGenerating(true)

    // Simulate generation animation
    setTimeout(() => {
      // Pick random problem with selected duration and team size
      const randomProblem = problems[Math.floor(Math.random() * problems.length)]
      
      // Create mock answers that will lead to this problem
      const mockAnswers = {
        Q1: 'Q1A1',
        Q2: 'Q2A1', 
        Q3: 'Q3A1',
        Q4: 'Q4A1',
        Q5: 'Q5A1',
        Q6: 'Q6A1',
        Q7: 'Q7A1',
        Q8: selectedDuration === 30 ? 'Q8A1' : selectedDuration === 45 ? 'Q8A2' : selectedDuration === 60 ? 'Q8A3' : 'Q8A4'
      }

      const answersJson = JSON.stringify(mockAnswers)
      const encoded = Buffer.from(answersJson).toString('base64')
      
      router.push(`/retro/result?data=${encoded}&random=true&teamSize=${teamSize}`)
    }, 1500)
  }

  // Get warning for large teams
  const getTeamSizeWarning = () => {
    if (teamSize >= 15) {
      return language === 'fr' 
        ? '⚠️ Équipe très grande : 2+ facilitateurs recommandés, breakouts obligatoires'
        : '⚠️ Very large team: 2+ facilitators recommended, breakouts required'
    } else if (teamSize >= 10) {
      return language === 'fr'
        ? '💡 Grande équipe : utilisez des breakouts (groupes de 4-6)'
        : '💡 Large team: use breakouts (groups of 4-6)'
    }
    return null
  }

  const warning = getTeamSizeWarning()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/retro')}
          className="text-white/80 hover:text-white flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === 'fr' ? 'Retour' : 'Back'}
        </button>

        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl">
            <Shuffle className="w-20 h-20 text-white mx-auto mb-6" />
            
            <h1 className="text-4xl font-bold text-white mb-4">
              {language === 'fr' ? 'Rétro Aléatoire' : 'Random Retro'}
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              {language === 'fr' 
                ? 'Obtenez une rétrospective aléatoire avec 5 activités curées'
                : 'Get a random retrospective with 5 curated activities'}
            </p>

            {/* Duration Selector */}
            <div className="bg-white/20 rounded-xl p-6 mb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-white" />
                <h3 className="text-lg font-semibold text-white">
                  {language === 'fr' ? 'Durée de la rétrospective' : 'Retrospective Duration'}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => setSelectedDuration(duration.value)}
                    className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                      selectedDuration === duration.value
                        ? 'bg-white text-primary scale-105 shadow-xl'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {language === 'fr' ? duration.labelFr : duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Size Selector */}
            <div className="bg-white/20 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-6 h-6 text-white" />
                <h3 className="text-lg font-semibold text-white">
                  {language === 'fr' ? 'Taille de l\'équipe' : 'Team Size'}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {teamSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setTeamSize(size.value)}
                    className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                      teamSize === size.value
                        ? 'bg-white text-primary scale-105 shadow-xl'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {language === 'fr' ? size.labelFr : size.label} {language === 'fr' ? 'pers.' : 'people'}
                  </button>
                ))}
              </div>
              
              {warning && (
                <div className="mt-4 bg-orange-500/20 border border-orange-400 rounded-lg p-3 text-white text-sm">
                  {warning}
                </div>
              )}
            </div>

            <div className="bg-white/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                {language === 'fr' ? 'Ce que vous obtiendrez :' : 'What you\'ll get:'}
              </h3>
              <ul className="text-white/90 space-y-2 text-left max-w-md mx-auto">
                <li>• {language === 'fr' ? 'Un format aléatoire parmi 6 types' : 'A random format from 6 types'}</li>
                <li>• {language === 'fr' ? `Optimisé pour ${selectedDuration} min` : `Optimized for ${selectedDuration} min`}</li>
                <li>• {language === 'fr' ? `Adapté pour ${teamSize === 5 ? '3-5' : teamSize === 7 ? '6-8' : teamSize === 10 ? '9-12' : '12+'} personnes` : `Adapted for ${teamSize === 5 ? '3-5' : teamSize === 7 ? '6-8' : teamSize === 10 ? '9-12' : '12+'} people`}</li>
                <li>• {language === 'fr' ? '5 activités des 146 disponibles' : '5 activities from 146 available'}</li>
                <li>• {language === 'fr' ? selectedDuration === 30 ? '3 phases essentielles' : '5 phases complètes' : selectedDuration === 30 ? '3 core phases' : '5 complete phases'}</li>
              </ul>
            </div>

            <button
              onClick={generateRandomRetro}
              disabled={generating}
              className={`inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-xl transition-all duration-300 ${
                generating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-white text-primary hover:bg-gray-100 hover:scale-105 shadow-2xl'
              }`}
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  {language === 'fr' ? 'Génération...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Shuffle className="w-6 h-6" />
                  {language === 'fr' ? 'Générer une Rétro' : 'Generate Retro'}
                </>
              )}
            </button>

            <p className="text-white/60 text-sm mt-6">
              {language === 'fr' 
                ? '💡 Astuce : Parfait pour essayer de nouvelles activités ou quand vous manquez d\'inspiration'
                : '💡 Tip: Perfect for trying new activities or when you need inspiration'}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
