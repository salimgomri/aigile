'use client'

import { useLanguage } from '@/components/language-provider'
import LandingNavbar from '@/components/layout/LandingNavbar'
import PremiumFooter from '@/components/landing/premium-footer'
import Link from 'next/link'
import { FileText, Lock } from 'lucide-react'

export default function PromptsPage() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-aigile-gold/20 flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-aigile-gold" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {language === 'fr' ? 'Bibliothèque de Prompts' : 'Prompt Library'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {language === 'fr'
            ? 'La bibliothèque complète de prompts P1 à P6 pour vos cérémoniels Scrum sera bientôt disponible. Fonctionnalité Pro.'
            : 'The complete prompt library P1 to P6 for your Scrum ceremonies will be available soon. Pro feature.'}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aigile-gold/10 border border-aigile-gold/30 text-aigile-gold">
          <Lock className="w-4 h-4" />
          <span className="font-medium">
            {language === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
          </span>
        </div>
        <Link
          href="/parcours"
          className="inline-block mt-8 text-aigile-gold hover:underline font-medium"
        >
          {language === 'fr' ? '← Retour au Parcours' : '← Back to Journey'}
        </Link>
      </div>
      <PremiumFooter />
    </main>
  )
}
