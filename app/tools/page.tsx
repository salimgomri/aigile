'use client'

import { useLanguage } from '@/components/language-provider'
import { trackEvent } from '@/lib/gtag'
import ToolsSuiteSection from '@/components/landing/tools-suite'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import Link from 'next/link'
import { Shield, Star, Lock } from 'lucide-react'

export default function ToolsPage() {
  const { language } = useLanguage()

  return (
    <main className="relative min-h-screen bg-background">
      <PremiumNavbar />

      {/* Subtle brand gradient (landing style) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(201,151,58,0.06) 0%, transparent 50%),
                             radial-gradient(circle at 70% 80%, rgba(19,142,236,0.05) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Trust Bar — charte AIgile (gold/blue/navy) */}
          <div
            className="mb-12 rounded-2xl border border-aigile-gold/20 bg-aigile-navy/60 backdrop-blur-sm p-5 md:p-6
              animate-fade-in-up opacity-0"
            style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center text-center md:text-left">
              <span className="flex items-center gap-2 font-semibold text-lg text-aigile-gold">
                <Shield className="w-5 h-5 flex-shrink-0" />
                {language === 'fr' ? '21 ans expertise Agile' : '21 years Agile expertise'}
              </span>
              <span className="hidden md:block w-px h-6 bg-aigile-gold/30" aria-hidden />
              <span className="flex items-center gap-2 text-foreground/90">
                <Star className="w-5 h-5 text-aigile-gold fill-aigile-gold/50" />
                4.9/5 | {language === 'fr' ? '1000+ agilists FR/Lux' : '1000+ agilists worldwide'}
              </span>
              <span className="hidden md:block w-px h-6 bg-aigile-gold/30" aria-hidden />
              <span className="flex items-center gap-2 text-muted-foreground text-sm">
                <Lock className="w-4 h-4 text-aigile-gold/80" />
                {language === 'fr' ? 'Sécurisé Stripe | Luxembourg-based' : 'Secure Stripe | Luxembourg-based'}
              </span>
            </div>
          </div>

          <ToolsSuiteSection />
        </div>

        {/* Sticky CTA — charte AIgile (gold/orange) + micro-animation */}
        <div
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-80 z-30
            animate-fade-in-up opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}
        >
          <div className="rounded-2xl border border-aigile-gold/30 bg-gradient-to-r from-aigile-gold/90 to-book-orange/90 p-1 shadow-xl shadow-aigile-gold/20">
            <Link
              href="/retro"
              onClick={() => trackEvent('sticky_cta_click', { value: 9.99, currency: 'EUR' })}
              className="group flex items-center justify-center gap-2 w-full bg-white/95 hover:bg-white text-aigile-navy font-bold py-3 px-6 rounded-xl
                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              <span>{language === 'fr' ? 'Essai gratuit Retro AI' : 'Start Free Retro AI Trial'}</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>

      <PremiumFooter />
    </main>
  )
}
