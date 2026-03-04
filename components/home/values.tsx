'use client'

import { useLanguage } from '../language-provider'
import { Users, Cog, Handshake, RefreshCw } from 'lucide-react'

const valueIcons = [Users, Cog, Handshake, RefreshCw]

export default function Values() {
  const { t } = useLanguage()

  const values = [
    { bold: 'value-1-bold', over: 'value-1-over', regular: 'value-1-regular' },
    { bold: 'value-2-bold', over: 'value-2-over', regular: 'value-2-regular' },
    { bold: 'value-3-bold', over: 'value-3-over', regular: 'value-3-regular' },
    { bold: 'value-4-bold', over: 'value-4-over', regular: 'value-4-regular' },
  ]

  return (
    <section id="values" className="relative py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, rgba(0, 160, 176, 0.2) 0%, transparent 50%)`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-bold text-center mb-8 text-white">
          {t('values-title')}
        </h2>
        <p className="text-xl text-center mb-12 text-white/90 font-medium">
          {t('values-intro')}
        </p>

        <div className="max-w-4xl mx-auto space-y-6">
          {values.map((value, index) => {
            const Icon = valueIcons[index]
            return (
              <div
                key={index}
                className="group bg-white/95 p-8 rounded-3xl border-l-8 border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl grid grid-cols-[80px_80px_1fr] gap-6 items-center"
              >
                <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center text-primary text-3xl font-black group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-300">
                  {index + 1}
                </div>
                <Icon className="w-12 h-12 text-primary group-hover:text-secondary transition-all duration-300 group-hover:scale-110" />
                <div className="text-lg leading-relaxed">
                  <div className="font-bold text-gray-900">{t(value.bold as any)}</div>
                  <div className="italic text-gray-600 my-1">{t(value.over as any)}</div>
                  <div className="text-gray-700">{t(value.regular as any)}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-xl italic text-white/80 max-w-3xl mx-auto">
          {t('values-note')}
        </div>
      </div>
    </section>
  )
}
