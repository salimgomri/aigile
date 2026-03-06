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
              
              // Determine activity type from name (simplified heuristic)
              const activityName = activity.name.toLowerCase()
              let activityType: 'individual' | 'pairs' | 'group' | 'full-team' = 'full-team'
              
              if (activityName.includes('silent') || activityName.includes('write') || activityName.includes('anonymous')) {
                activityType = 'individual'
              } else if (activityName.includes('pair') || activityName.includes('1-2-4')) {
                activityType = 'pairs'
              } else if (activityName.includes('group') || activityName.includes('breakout')) {
                activityType = 'group'
              }
              
              // Calculate speaking time per person
              const baseTimes = {
                'individual': 30,
                'pairs': 60,
                'group': 90,
                'full-team': 45
              }
              
              let speakingTimePerPerson = baseTimes[activityType]
              if (teamSize > 8) {
                speakingTimePerPerson *= 0.8 // -20% efficiency
              }
              
              // Format speaking time
              const speakingTimeFormatted = speakingTimePerPerson >= 60 
                ? `${Math.round(speakingTimePerPerson / 60)} min ${speakingTimePerPerson % 60}s`
                : `${Math.round(speakingTimePerPerson)}s`
              
              // Get facilitation technique
              const techniques = {
                'individual': language === 'fr' ? 'Réflexion silencieuse + partage' : 'Silent reflection + share',
                'pairs': language === 'fr' ? 'Travail en binôme' : 'Pair work',
                'group': language === 'fr' ? 'Groupes de 4-6 personnes' : 'Groups of 4-6 people',
                'full-team': language === 'fr' ? 'Tour de table complet' : 'Full team round'
              }
              
              const technique = techniques[activityType]
              
              // Breakout recommendation
              const needsBreakouts = teamSize > 8 && (activityType === 'group' || activityType === 'full-team')
              
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
                  <div className="text-right">
                    <div className="bg-blue-100 text-primary px-4 py-2 rounded-full font-bold text-sm mb-2">
                      {activity.duration} min
                    </div>
                    <div className="text-xs text-gray-600">
                      ~{speakingTimeFormatted}/{language === 'fr' ? 'pers.' : 'person'}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-lg">
                  {language === 'fr' ? activity.summaryFr : activity.summary}
                </p>

                {/* Facilitation Info */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    <Users className="w-3 h-3" />
                    {technique}
                  </span>
                  {needsBreakouts && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      {language === 'fr' ? 'Breakouts recommandés' : 'Breakouts recommended'}
                    </span>
                  )}
                  {teamSize > 12 && activityType === 'full-team' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      {language === 'fr' ? 'Technique "spokes" obligatoire' : 'Spokes technique required'}
                    </span>
                  )}
                </div>

                {/* Time breakdown for large teams */}
                {teamSize > 8 && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900 font-semibold mb-1">
                      {language === 'fr' ? '⏱️ Répartition du temps :' : '⏱️ Time breakdown:'}
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      {activityType === 'individual' && (
                        <>
                          <li>• {language === 'fr' ? 'Réflexion silencieuse' : 'Silent reflection'}: {Math.round(activity.duration * 0.3)} min</li>
                          <li>• {language === 'fr' ? 'Partage en breakouts' : 'Share in breakouts'}: {Math.round(activity.duration * 0.5)} min</li>
                          <li>• {language === 'fr' ? 'Synthèse (spokes)' : 'Synthesis (spokes)'}: {Math.round(activity.duration * 0.2)} min</li>
                        </>
                      )}
                      {activityType === 'pairs' && (
                        <>
                          <li>• {language === 'fr' ? 'Discussion en paires' : 'Pair discussions'}: {Math.round(activity.duration * 0.6)} min</li>
                          <li>• {language === 'fr' ? 'Partage des paires' : 'Pairs sharing'}: {Math.round(activity.duration * 0.4)} min</li>
                        </>
                      )}
                      {(activityType === 'group' || activityType === 'full-team') && (
                        <>
                          <li>• {language === 'fr' ? 'Breakouts (groupes de 4-6)' : 'Breakouts (groups of 4-6)'}: {Math.round(activity.duration * 0.6)} min</li>
                          <li>• {language === 'fr' ? 'Spokes (1/groupe partage)' : 'Spokes (1/group shares)'}: {Math.round(activity.duration * 0.3)} min</li>
                          <li>• {language === 'fr' ? 'Dot voting/décision' : 'Dot voting/decision'}: {Math.round(activity.duration * 0.1)} min</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}

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
