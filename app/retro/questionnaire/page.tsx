'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { QUESTIONNAIRE, QuestionId } from '@/lib/retro/questionnaire'
import { ArrowLeft } from 'lucide-react'
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
    const newAnswers = { ...answers, [question.id]: answerId }
    setAnswers(newAnswers)
    
    // Auto-advance after a short delay for visual feedback
    setTimeout(() => {
      if (isLast) {
        // Save answers and navigate to results
        const answersJson = JSON.stringify(newAnswers)
        const encoded = Buffer.from(answersJson).toString('base64')
        router.push(`/retro/result?data=${encoded}`)
      } else {
        setCurrentQuestion(currentQuestion + 1)
      }
    }, 400) // 400ms delay for smooth transition
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

            <div className="text-gray-400 text-sm flex items-center gap-2">
              {language === 'fr' ? 'Sélectionnez une réponse pour continuer' : 'Select an answer to continue'}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
