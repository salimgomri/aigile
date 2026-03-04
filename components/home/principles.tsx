'use client'

import { useLanguage } from '../language-provider'
import { 
  TrendingUp, Brain, GitBranch, RotateCcw, Flag, 
  Eye, Clock, Rocket, Network, Target 
} from 'lucide-react'

const principleIcons = [
  TrendingUp, Brain, GitBranch, RotateCcw, Flag,
  Eye, Clock, Rocket, Network, Target
]

export default function Principles() {
  const { t } = useLanguage()

  return (
    <section id="principles" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-8 text-gray-900">
          {t('principles-title')}
        </h2>
        <p className="text-xl text-center mb-12 text-gray-700 font-medium max-w-3xl mx-auto">
          {t('principles-intro')}
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const Icon = principleIcons[num - 1]
            return (
              <div
                key={num}
                className="group bg-white p-6 rounded-2xl border-l-6 border-primary shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl grid grid-cols-[60px_60px_1fr] gap-4 items-center"
              >
                <div className="w-14 h-14 rounded-full border-4 border-primary flex items-center justify-center text-primary text-2xl font-black group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-300">
                  {num}
                </div>
                <Icon className="w-10 h-10 text-primary group-hover:text-secondary transition-all duration-300 group-hover:scale-110" />
                <p className="text-lg font-medium text-gray-800">
                  {t(`principle-${num}` as any)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
