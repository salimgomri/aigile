'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { QUESTIONNAIRE, QuestionId } from '@/lib/retro/questionnaire'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Header from '@/components/header'

export default function QuestionnairePage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<QuestionId, string>>({} as Record<QuestionId, string>)

  const question = QUESTIONNAIRE[currentQuestion]
  const isLast = currentQuestion === QUESTIONNAIRE.length - 1
  const selectedAnswer = answers[question.id]

  const handleAnswer = (answerId: string) => {
    setAnswers({ ...answers, [question.id]: answerId })
  }

  const handleNext = () => {
    if (!selectedAnswer) return

    if (isLast) {
      // Save answers and navigate to results
      const answersJson = JSON.stringify(answers)
      const encoded = Buffer.from(answersJson).toString('base64')
      router.push(`/retro/result?data=${encoded}`)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else {
      router.push('/retro')
    }
  }

  const progress = ((currentQuestion + 1) / QUESTIONNAIRE.length) * 100

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white/80 text-sm mt-2 text-center">
            Question {currentQuestion + 1} of {QUESTIONNAIRE.length}
          </div>
        </div>

        {/* Question card */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            {language === 'fr' ? question.textFr : question.text}
          </h2>

          <div className="space-y-4">
            {question.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswer(answer.id)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === answer.id
                    ? 'border-primary bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    selectedAnswer === answer.id
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === answer.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-lg text-gray-700">
                    {language === 'fr' ? answer.textFr : answer.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'fr' ? 'Retour' : 'Back'}
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedAnswer
                  ? 'bg-primary text-white hover:bg-blue-700 hover:scale-105 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLast
                ? language === 'fr' ? 'Voir les résultats' : 'See Results'
                : language === 'fr' ? 'Suivant' : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
