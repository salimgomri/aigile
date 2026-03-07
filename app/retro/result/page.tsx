'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { QuestionId, getDurationFromAnswers } from '@/lib/retro/questionnaire'
import { detectPatterns, getProblemKeyFromPattern } from '@/lib/retro/pattern-detection'
import { PATTERNS, PatternCode } from '@/lib/retro/patterns'
import { generateRetroPlan, getTimeAllocationTips as getTerrainTips, getFacilitationTechnique, ActivitySelection } from '@/lib/retro/activity-selector'
import { getTeamSizeRecommendations } from '@/lib/retro/team-size-optimizer'
import { AlertCircle, ArrowLeft, Clock, Users, Shuffle, AlertTriangle, Target } from 'lucide-react'
import Header from '@/components/header'

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const [retroPlan, setRetroPlan] = useState<any>(null)
  const [detection, setDetection] = useState<any>(null)
  const [duration, setDuration] = useState(60)
  const [teamSize, setTeamSize] = useState(7)
  const [loading, setLoading] = useState(true)

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

      // Detect patterns
      const result = detectPatterns(answers)
      setDetection(result)

      // Get duration
      const retroDuration = getDurationFromAnswers(answers)
      setDuration(retroDuration)

      // Get team size (from URL param or default)
      const finalTeamSize = randomTeamSize ? parseInt(randomTeamSize) : 7
      setTeamSize(finalTeamSize)

      // Get problem key
      const problemKey = getProblemKeyFromPattern(result.primary.code)
      
      // ⚡ NEW TERRAIN LOGIC: Generate plan based on duration + team size
      const plan = generateRetroPlan(retroDuration, finalTeamSize, problemKey, language)
      setRetroPlan(plan)

      setLoading(false)
    } catch (error) {
      console.error('Error parsing data:', error)
      router.push('/retro')
    }
  }, [searchParams, router, language])

  if (loading || !detection || !retroPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">
          {language === 'fr' ? 'Génération de votre rétro personnalisée...' : 'Generating your personalized retro...'}
        </div>
      </div>
    )
  }

  const primaryPattern = PATTERNS[detection.primary.code as PatternCode]
  const teamRecommendations = getTeamSizeRecommendations(teamSize)
  const terrainTips = getTerrainTips(duration, teamSize, language)
  const facilitation = getFacilitationTechnique(teamSize, language)

  const isRandom = searchParams?.get('random') === 'true'

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/retro')}
            className="text-white/80 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'fr' ? 'Retour' : 'Back'}
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

        {/* Terrain Tips - Decision Criteria */}
        {terrainTips.length > 0 && (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 rounded-xl p-6">
              <h3 className="flex items-center gap-2 font-bold text-lg text-white mb-4">
                <Target className="w-6 h-6" />
                {language === 'fr' ? 'Logique Terrain (30 ans coaching)' : 'Field Logic (30 years coaching)'}
              </h3>
              <ul className="space-y-2 text-white/90 text-sm">
                {terrainTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-1">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Retro Plan - Table Format */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-4xl font-black mb-6 text-white text-center">
            {language === 'fr' 
              ? `Plan Rétro ${duration}min / ${teamSize} personnes`
              : `Retro Plan ${duration}min / ${teamSize} people`}
          </h2>

          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="pb-3 px-2 font-bold text-gray-900">
                    {language === 'fr' ? 'Phase' : 'Phase'}
                  </th>
                  <th className="pb-3 px-2 font-bold text-gray-900">
                    {language === 'fr' ? 'Activité' : 'Activity'}
                  </th>
                  <th className="pb-3 px-2 font-bold text-gray-900 text-center">
                    {language === 'fr' ? 'Temps' : 'Time'}
                  </th>
                  <th className="pb-3 px-2 font-bold text-gray-900 text-center">
                    {language === 'fr' ? 'Temps/pers' : 'Time/person'}
                  </th>
                  <th className="pb-3 px-2 font-bold text-gray-900">
                    {language === 'fr' ? 'Pourquoi choisi' : 'Why chosen'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {retroPlan.activities.map((selection: ActivitySelection, index: number) => {
                  const phaseNameMap: Record<string, { en: string; fr: string }> = {
                    'Set the stage': { en: 'Set the Stage', fr: 'Créer le Contexte' },
                    'Gather data': { en: 'Gather Data', fr: 'Collecter' },
                    'Generate insights': { en: 'Generate Insights', fr: 'Analyser' },
                    'Decide what to do': { en: 'Decide', fr: 'Décider' },
                    'Close the retro': { en: 'Close', fr: 'Clore' }
                  }
                  
                  const phaseName = phaseNameMap[selection.phase]
                  const timePerPersonFormatted = 
                    selection.timePerPerson >= 60
                      ? `${Math.floor(selection.timePerPerson / 60)}min${selection.timePerPerson % 60 > 0 ? ` ${selection.timePerPerson % 60}s` : ''}`
                      : `${selection.timePerPerson}s`

                  return (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                          {language === 'fr' ? phaseName.fr : phaseName.en}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-medium text-gray-900">
                        {language === 'fr' ? selection.activity.nameFr : selection.activity.name}
                      </td>
                      <td className="py-4 px-2 text-gray-700 text-center font-semibold">
                        {selection.allocatedTime} min
                      </td>
                      <td className="py-4 px-2 text-gray-600 text-center">
                        ~{timePerPersonFormatted}/pers
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-600">
                        {selection.reasoning}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {language === 'fr' ? 'TOTAL' : 'TOTAL'}: {retroPlan.totalTime} min ✓
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'fr' ? 'Technique' : 'Technique'}: <strong>{facilitation}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-700">
                    {language === 'fr' 
                      ? `Actions garanties : ${retroPlan.guaranteedActions}`
                      : `Guaranteed actions: ${retroPlan.guaranteedActions}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Activities Breakdown */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-white text-center">
            {language === 'fr' ? 'Détails des Activités' : 'Activity Details'}
          </h3>
          
          <div className="space-y-6">
            {retroPlan.activities.map((selection: ActivitySelection, index: number) => {
              const phaseNameMap: Record<string, { en: string; fr: string }> = {
                'Set the stage': { en: 'Set the Stage', fr: 'Créer le Contexte' },
                'Gather data': { en: 'Gather Data', fr: 'Collecter les Données' },
                'Generate insights': { en: 'Generate Insights', fr: 'Générer des Insights' },
                'Decide what to do': { en: 'Decide What to Do', fr: 'Décider Quoi Faire' },
                'Close the retro': { en: 'Close the Retro', fr: 'Clore la Rétro' }
              }
              
              const phaseName = phaseNameMap[selection.phase]
              const activity = selection.activity

              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-3">
                        {language === 'fr' ? phaseName.fr : phaseName.en} • Phase {index + 1}/{retroPlan.activities.length}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {language === 'fr' ? activity.nameFr : activity.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-primary font-bold text-lg">
                        <Clock className="w-5 h-5" />
                        {selection.allocatedTime} min
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 italic">
                      {language === 'fr' ? activity.summaryFr : activity.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {facilitation}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      ~{Math.floor(selection.timePerPerson / 60) > 0 ? `${Math.floor(selection.timePerPerson / 60)}min ` : ''}{selection.timePerPerson % 60}s/pers
                    </span>
                    {activity.trustLevel && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {language === 'fr' ? 'Confiance' : 'Trust'}: {activity.trustLevel}/4
                      </span>
                    )}
                  </div>

                  {/* Team Size Warnings */}
                  {teamSize > 12 && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                      <p className="text-orange-800 text-sm font-semibold">
                        ⚠️ {language === 'fr' 
                          ? 'Équipe très grande : Utilisez 2+ facilitateurs + async/vote'
                          : 'Very large team: Use 2+ facilitators + async/vote'}
                      </p>
                    </div>
                  )}
                  {teamSize > 8 && teamSize <= 12 && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                      <p className="text-blue-800 text-sm">
                        💡 {language === 'fr'
                          ? 'Breakouts recommandés (groupes de 4-6 personnes)'
                          : 'Breakouts recommended (groups of 4-6 people)'}
                      </p>
                    </div>
                  )}

                  {/* Time Breakdown for Large Teams */}
                  {teamSize > 8 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'fr' ? 'Répartition du temps' : 'Time Breakdown'}
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• {language === 'fr' ? 'Breakouts (groupes de 4-6)' : 'Breakouts (groups of 4-6)'}: {Math.round(selection.allocatedTime * 0.6)} min</li>
                        <li>• {language === 'fr' ? 'Spokes (1/groupe partage)' : 'Spokes (1/group shares)'}: {Math.round(selection.allocatedTime * 0.3)} min</li>
                        <li>• {language === 'fr' ? 'Dot voting/décision' : 'Dot voting/decision'}: {Math.round(selection.allocatedTime * 0.1)} min</li>
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
                ? `Durée totale : ${retroPlan.totalTime} min (optimisé pour ${teamSize} personnes)`
                : `Total duration: ${retroPlan.totalTime} min (optimized for ${teamSize} people)`}
            </p>
            <p className="text-white/80">
              {language === 'fr'
                ? '✅ Plan généré avec logique terrain (30 ans coaching Agile)'
                : '✅ Plan generated with field logic (30 years Agile coaching)'}
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
