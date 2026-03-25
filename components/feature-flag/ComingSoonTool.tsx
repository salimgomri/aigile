'use client'

import Link from 'next/link'
import { Sparkles, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr, enUS } from 'date-fns/locale'
import type { FeatureFlagRow } from '@/lib/feature-flags'

type Props = {
  flag: FeatureFlagRow
  language: 'fr' | 'en'
}

export default function ComingSoonTool({ flag, language }: Props) {
  const teaser = language === 'fr' ? flag.teaser_fr || flag.label_fr : flag.teaser_en || flag.label_en
  const title = language === 'fr' ? flag.label_fr : flag.label_en
  const launch = new Date(flag.launch_at)
  const locale = language === 'fr' ? fr : enUS

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-background via-aigile-navy/20 to-background">
      <div className="max-w-2xl text-center space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-aigile-gold/40 bg-aigile-gold/10 text-aigile-gold text-sm font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          {language === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{title}</h1>

        <p className="text-lg text-muted-foreground leading-relaxed">{teaser}</p>

        <div className="flex items-center justify-center gap-2 text-aigile-gold/90">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium">
            {language === 'fr' ? 'Ouverture prévue le ' : 'Expected launch: '}
            {format(launch, 'PPP', { locale })}
          </span>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 rounded-full bg-aigile-gold hover:bg-book-orange text-black font-semibold transition-colors"
          >
            {language === 'fr' ? 'Retour à l’accueil' : 'Back to home'}
          </Link>
          <Link
            href="/tools"
            className="px-8 py-3 rounded-full border border-border hover:border-aigile-gold/50 font-semibold transition-colors"
          >
            {language === 'fr' ? 'Découvrir la suite d’outils' : 'Explore the tool suite'}
          </Link>
        </div>
      </div>
    </div>
  )
}
