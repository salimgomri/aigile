'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { QuestionId, getDurationFromAnswers } from '@/lib/retro/questionnaire'
import { detectPatterns, getProblemKeyFromPattern } from '@/lib/retro/pattern-detection'
import { PATTERNS } from '@/lib/retro/patterns'
import { getActivitiesForProblem, RetroActivity } from '@/lib/retro/activities'
import { getActivitiesByDuration } from '@/lib/retro/duration-optimizer'
import { getTeamSizeRecommendations, getTimeAllocationTips } from '@/lib/retro/team-size-optimizer'
import { AlertCircle, ArrowLeft, Clock, Users, TrendingUp, Shuffle, AlertTriangle } from 'lucide-react'
import Header from '@/components/header'

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const [activities, setActivities] = useState<RetroActivity[]>([])
  const [detection, setDetection] = useState<any>(null)
  const [duration, setDuration] = useState(60)
  const [teamSize, setTeamSize] = useState(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = searchParams?.get('data')
    if (!data) {
      router.push('/retro')
      return
    }

    try {
      const decoded = Buffer.from(data, 'base64').toString()
      const answers = JSON.parse(decoded) as Record<QuestionId, string>

      // Detect patterns
      const result = detectPatterns(answers)
      setDetection(result)

      // Get duration
      const retroDuration = getDurationFromAnswers(answers)
      setDuration(retroDuration)

      // Get problem key and activities
      const problemKey = getProblemKeyFromPattern(result.primary.code)
      const allActivities = getActivitiesForProblem(problemKey, retroDuration, 'medium', 7)
      
      // Adapt activities based on duration (3 phases for 30min, 5 for others)
      const selectedActivities = getActivitiesByDuration(allActivities, retroDuration)
      setActivities(selectedActivities)

      setLoading(false)
    } catch (error) {
      console.error('Error parsing data:', error)
      router.push('/retro')
    }
  }, [searchParams, router])

  if (loading || !detection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading your personalized retro...</div>
      </div>
    )
  }

  const primaryPattern = PATTERNS[detection.primary.code]
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0)
  const teamRecommendations = getTeamSizeRecommendations(teamSize)
  const teamTips = getTimeAllocationTips(teamSize, duration)

  const isRandom = searchParams?.get('random') === 'true'

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push(isRandom ? '/retro' : '/retro/questionnaire')}
            className="text-white/80 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {isRandom 
              ? (language === 'fr' ? 'Retour' : 'Back')
              : (language === 'fr' ? 'Modifier mes réponses' : 'Modify my answers')
            }
          </button>
          
          {isRandom && (
            <button
              onClick={() => router.push('/retro/random')}
              className="text-white/80 hover:text-white flex items-center gap-2"
            >
              <Shuffle className="w-5 h-5" />
              {language === 'fr' ? 'Nouvelle rétro aléatoire' : 'New random retro'}
            </button>
          )}
        </div>

        {/* Pattern Detection Results - Only for questionnaire mode */}
        {!isRandom && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-12 h-12 text-orange-500 flex-shrink-0" />
              <div>
                <h1 className="text-4xl font-black mb-2 text-gray-900">
                  {language === 'fr' ? 'Pattern Principal Détecté' : 'Primary Pattern Detected'}
                </h1>
                <p className="text-xl text-gray-600">
                  {language === 'fr' ? primaryPattern.nameFr : primaryPattern.name}
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {language === 'fr' ? 'Description' : 'Description'}
              </h3>
              <p className="text-gray-700">
                {language === 'fr' ? primaryPattern.descriptionFr : primaryPattern.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-red-900">
                  {language === 'fr' ? 'Symptômes' : 'Symptoms'}
                </h3>
                <ul className="space-y-2">
                  {(language === 'fr' ? primaryPattern.symptomsFr : primaryPattern.symptoms).map((symptom, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 font-bold mt-1">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-blue-900">
                  {language === 'fr' ? 'Causes Racines' : 'Root Causes'}
                </h3>
                <ul className="space-y-2">
                  {(language === 'fr' ? primaryPattern.rootCausesFr : primaryPattern.rootCauses).map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-500 font-bold mt-1">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {detection.secondary.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  {language === 'fr' ? 'Patterns Secondaires' : 'Secondary Patterns'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {detection.secondary.map((pattern: any) => (
                    <div
                      key={pattern.code}
                      className="bg-gray-100 px-4 py-2 rounded-full text-gray-700 font-medium"
                    >
                      {language === 'fr' ? pattern.nameFr : pattern.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>5-10 {language === 'fr' ? 'personnes' : 'people'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>{language === 'fr' ? 'Confiance moyenne' : 'Medium trust'}</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Random Retro Header - Only for random mode */}
        {isRandom && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
              <Shuffle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-black mb-2 text-gray-900">
                {language === 'fr' ? 'Votre Rétrospective Aléatoire' : 'Your Random Retrospective'}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {language === 'fr' 
                  ? `Format généré pour une rétro de ${duration} minutes`
                  : `Format generated for a ${duration}-minute retro`}
              </p>
              <div className="flex items-center justify-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{teamSize === 5 ? '3-5' : teamSize === 7 ? '6-8' : teamSize === 10 ? '9-12' : '12+'} {language === 'fr' ? 'personnes' : 'people'}</span>
                </div>
              </div>
              
              {/* Team Size Recommendations */}
              {teamRecommendations.warning && (
                <div className="mt-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900 mb-1">
                        {language === 'fr' ? 'Recommandation' : 'Recommendation'}
                      </p>
                      <p className="text-orange-800 text-sm">{teamRecommendations.warning}</p>
                      <p className="text-orange-700 text-xs mt-2">
                        <strong>{language === 'fr' ? 'Technique' : 'Technique'}:</strong> {teamRecommendations.technique}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Size Tips */}
        {teamSize > 8 && (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="flex items-center gap-2 font-bold text-lg text-blue-900 mb-3">
                <Users className="w-6 h-6" />
                {language === 'fr' ? 'Conseils pour grande équipe' : 'Large Team Tips'}
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                {teamTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Retro Activities */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-white text-center">
            {language === 'fr' ? 'Votre Rétrospective Personnalisée' : 'Your Personalized Retrospective'}
          </h2>
          
          {duration === 30 && (
            <div className="bg-blue-500/20 border border-blue-400 rounded-xl p-4 mb-8 text-white text-center">
              <p className="font-semibold">
                {language === 'fr' 
                  ? '⚡ Format 30 min : 3 phases essentielles pour un impact rapide'
                  : '⚡ 30-min format: 3 core phases for quick impact'}
              </p>
              <p className="text-sm text-white/80 mt-1">
                {language === 'fr'
                  ? 'Set Stage → Gather Data → Decide What To Do (Skip insights profonds)'
                  : 'Set Stage → Gather Data → Decide What To Do (Skip deep insights)'}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {activities.map((activity, index) => {
              const phaseNames: Record<string, {en: string, fr: string}> = {
                'set-stage': { en: 'Set the Stage', fr: 'Créer le Contexte' },
                'gather-data': { en: 'Gather Data', fr: 'Collecter les Données' },
                'generate-insights': { en: 'Generate Insights', fr: 'Générer des Insights' },
                'decide-what-to-do': { en: 'Decide What to Do', fr: 'Décider Quoi Faire' },
                'close': { en: 'Close the Retro', fr: 'Clore la Rétro' }
              }
              
              const phaseName = phaseNames[activity.phase]
              
              return (
              <div
                key={activity.id}
                className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                      {language === 'fr' ? 'Phase' : 'Phase'} {index + 1}/{activities.length}:{' '}
                      {language === 'fr' ? phaseName.fr : phaseName.en}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {language === 'fr' ? activity.nameFr : activity.name}
                    </h3>
                  </div>
                  <div className="bg-blue-100 text-primary px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap">
                    {activity.duration} min
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-lg">
                  {language === 'fr' ? activity.summaryFr : activity.summary}
                </p>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-900">
                    {language === 'fr' ? 'Comment faire :' : 'How to do it:'}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? activity.descriptionFr : activity.description}
                  </p>
                </div>
              </div>
            )
          })}
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
            <p className="text-xl mb-4">
              {language === 'fr'
                ? `Durée totale estimée : ${totalDuration} minutes`
                : `Total estimated duration: ${totalDuration} minutes`}
            </p>
            <p className="text-white/80">
              {language === 'fr'
                ? 'Ajustez les durées selon les besoins de votre équipe'
                : 'Adjust durations based on your team\'s needs'}
            </p>
          </div>

          <div className="mt-8 text-center flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/retro/questionnaire')}
              className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              {language === 'fr' ? 'Nouveau questionnaire' : 'New questionnaire'}
            </button>
            
            <button
              onClick={() => router.push('/retro/random')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2 justify-center">
                <Shuffle className="w-5 h-5" />
                {language === 'fr' ? 'Rétro aléatoire' : 'Random retro'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
