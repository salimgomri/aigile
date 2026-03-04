'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { QuestionId, getDurationFromAnswers } from '@/lib/retro/questionnaire'
import { detectPatterns, getProblemKeyFromPattern } from '@/lib/retro/pattern-detection'
import { PATTERNS } from '@/lib/retro/patterns'
import { getActivitiesForProblem, RetroActivity } from '@/lib/retro/activities'
import { AlertCircle, ArrowLeft, Clock, Users, TrendingUp } from 'lucide-react'

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const [activities, setActivities] = useState<RetroActivity[]>([])
  const [detection, setDetection] = useState<any>(null)
  const [duration, setDuration] = useState(60)
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
      const selectedActivities = getActivitiesForProblem(problemKey, retroDuration, 'medium', 7)
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <button
          onClick={() => router.push('/retro/questionnaire')}
          className="text-white/80 hover:text-white flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === 'fr' ? 'Modifier mes réponses' : 'Modify my answers'}
        </button>

        {/* Pattern Detection Results */}
        <div className="max-w-5xl mx-auto mb-12">
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

        {/* Retro Activities */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-8 text-white text-center">
            {language === 'fr' ? 'Votre Rétrospective Personnalisée' : 'Your Personalized Retrospective'}
          </h2>

          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                      {language === 'fr' ? 'Phase' : 'Phase'} {index + 1}/5:{' '}
                      {activity.phase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
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
            ))}
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

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/retro/questionnaire')}
              className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              {language === 'fr' ? 'Générer une nouvelle rétro' : 'Generate a new retro'}
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
