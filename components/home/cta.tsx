'use client'

import { useLanguage } from '../language-provider'
import Link from 'next/link'

export default function CTA() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gradient-to-r from-[#c9973a] to-[#E8961E] text-black text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4">{t('cta-title')}</h2>
        <p className="text-2xl mb-8 opacity-90" dangerouslySetInnerHTML={{ __html: t('cta-subtitle') }} />
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/aigileManifesto.pdf"
            className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {t('cta-download')}
          </a>
          <Link
            href="/retro"
            className="px-8 py-4 bg-transparent border-2 border-black text-black rounded-full font-semibold text-lg hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
          >
            {t('cta-try-retro')}
          </Link>
        </div>
      </div>
    </section>
  )
}
