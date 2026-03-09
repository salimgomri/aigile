'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { QUESTIONNAIRE, QuestionId } from '@/lib/retro/questionnaire'
import { ArrowLeft } from 'lucide-react'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
export default function QuestionnairePage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<QuestionId, string>>({} as Record<QuestionId, string>)
  const [isAnimating, setIsAnimating] = useState(false)

  const question = QUESTIONNAIRE[currentQuestion]
  const isLast = currentQuestion === QUESTIONNAIRE.length - 1
  const selectedAnswer = answers[question?.id]

  const handleAnswer = (answerId: string) => {
    if (!question) return
    const newAnswers = { ...answers, [question.id]: answerId }
    setAnswers(newAnswers)
    // Le choix d'une valeur vaut pour validation → avance automatiquement
    if (isLast) {
      const answersJson = JSON.stringify(newAnswers)
      const encoded = Buffer.from(answersJson).toString('base64')
      router.push(`/retro/result?data=${encoded}`)
    } else {
      setIsAnimating(true)
      setCurrentQuestion(currentQuestion + 1)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true)
      setCurrentQuestion(currentQuestion - 1)
      setTimeout(() => setIsAnimating(false), 300)
    } else {
      router.push('/retro')
    }
  }

  const handleNext = () => {
    if (!selectedAnswer) return
    if (isLast) {
      const newAnswers = { ...answers, [question.id]: selectedAnswer }
      const answersJson = JSON.stringify(newAnswers)
      const encoded = Buffer.from(answersJson).toString('base64')
      router.push(`/retro/result?data=${encoded}`)
    } else {
      setIsAnimating(true)
      setCurrentQuestion(currentQuestion + 1)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const progress = ((currentQuestion + 1) / QUESTIONNAIRE.length) * 100
  const isAnswered = !!selectedAnswer

  if (!question) return null

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <PremiumNavbar />

      {/* Header */}
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
          {/* Progress badge */}
          <div className="text-center mb-6 md:mb-8">
            <span className="inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs md:text-sm font-medium">
              {language === 'fr' ? 'Question' : 'Question'} {currentQuestion + 1} {language === 'fr' ? 'sur' : 'of'} {QUESTIONNAIRE.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-8 md:mb-12">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-xl border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-700 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Question card */}
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-10 text-white text-center">
              {language === 'fr' ? question.textFr : question.text}
            </h2>

            <div className="grid gap-3 md:gap-4 mb-8 md:mb-10">
              {question.answers.map((answer, i) => {
                const isSelected = selectedAnswer === answer.id
                return (
                  <div
                    key={answer.id}
                    className={`group relative rounded-xl md:rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 scale-[1.02] shadow-2xl shadow-orange-500/20'
                        : 'border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10 hover:scale-[1.01]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl md:rounded-2xl blur-xl" />
                    )}
                    <button
                      onClick={() => handleAnswer(answer.id)}
                      className="w-full p-4 md:p-6 lg:p-8 text-left"
                    >
                      <div className="relative z-10 flex items-start gap-3 md:gap-4">
                        <div
                          className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? 'border-orange-500 bg-orange-500' : 'border-white/30'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                            <h3
                              className={`text-lg md:text-xl lg:text-2xl font-bold transition-colors ${
                                isSelected ? 'text-orange-400' : 'text-white group-hover:text-orange-400'
                              }`}
                            >
                              {language === 'fr' ? answer.textFr : answer.text}
                            </h3>
                            {isSelected && (
                              <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-500 flex items-center justify-center animate-scale-in">
                                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Navigation - questionnaire + pattern = gratuit */}
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={handleBack}
                className="flex-1 py-5 md:py-6 text-base md:text-lg bg-white/5 backdrop-blur-xl border-2 border-white/20 text-white rounded-xl hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] transition-all duration-300 font-medium"
              >
                ← {language === 'fr' ? 'Précédent' : 'Previous'}
              </button>
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`flex-1 py-5 md:py-6 text-base md:text-lg rounded-xl font-semibold transition-all duration-300 ${
                  isAnswered
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/50 text-white border-0'
                    : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border-2 border-gray-700/50'
                }`}
              >
                {isLast ? (language === 'fr' ? '✨ Voir mon résultat' : '✨ See my result') : (language === 'fr' ? 'Suivant →' : 'Next →')}
              </button>
            </div>

            <p className="text-center text-white/40 text-xs md:text-sm mt-6">
              {isAnswered ? '✓' : '○'} {language === 'fr' ? 'Question' : 'Question'} {currentQuestion + 1} / {QUESTIONNAIRE.length}
            </p>
          </div>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
