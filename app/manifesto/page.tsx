import type { Metadata } from 'next'
import Hero from '@/components/home/hero'

export const metadata: Metadata = {
  title: 'Manifeste AIgile | Coaching Agile AI Luxembourg France Belgique',
  description:
    '4 valeurs, 10 principes - L\'évolution du Manifeste Agile 2001 pour l\'ère IA | Salim Gomri',
  alternates: { canonical: 'https://aigile.lu/manifesto' },
}
import Values from '@/components/home/values'
import Principles from '@/components/home/principles'
import CTA from '@/components/home/cta'
import About from '@/components/home/about'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'

export default function ManifestoPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <PremiumNavbar />
      <Hero />
      <Values />
      <Principles />
      <CTA />
      <About />
      <PremiumFooter />
    </main>
  )
}
