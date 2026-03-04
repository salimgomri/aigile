'use client'

import { useLanguage } from '../language-provider'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Parallax background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 102, 204, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(0, 160, 176, 0.2) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-9xl md:text-[12rem] font-black mb-8 leading-none">
          <span className="aigile-text">AIgile</span>
          <br />
          <span className="text-white">Manifesto</span>
        </h1>
        <p className="text-2xl md:text-4xl text-white/80 mb-8 font-light">
          {t('hero-author')}
        </p>
        <p className="text-3xl md:text-5xl text-white/90 font-light">
          {t('hero-subtitle')}
        </p>
      </div>
    </section>
  )
}
