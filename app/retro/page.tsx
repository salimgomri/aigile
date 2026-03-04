import Link from 'next/link'
import { ArrowRight, Brain, Users, Zap } from 'lucide-react'

export default function RetroPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-6xl font-black mb-6">
            <span className="aigile-text">AI</span>gile Retro Tool
          </h1>
          <p className="text-2xl mb-8 text-white/90">
            Generate custom AI-powered retrospectives that address your team's real challenges
          </p>
          <p className="text-xl mb-12 text-white/80">
            Answer 8 quick questions and get a personalized retro format tailored to your team's dysfunctions
          </p>

          <Link
            href="/retro/questionnaire"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Start Questionnaire
            <ArrowRight className="w-6 h-6" />
          </Link>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
              <Brain className="w-12 h-12 mb-4 mx-auto text-blue-300" />
              <h3 className="text-xl font-bold mb-2">Pattern Detection</h3>
              <p className="text-white/80">
                Detects 9 team dysfunction patterns from your answers
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
              <Users className="w-12 h-12 mb-4 mx-auto text-green-300" />
              <h3 className="text-xl font-bold mb-2">Tailored Activities</h3>
              <p className="text-white/80">
                Retromat activities mapped to your specific challenges
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
              <Zap className="w-12 h-12 mb-4 mx-auto text-yellow-300" />
              <h3 className="text-xl font-bold mb-2">5-Phase Format</h3>
              <p className="text-white/80">
                Complete retro structure following Retromat methodology
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
