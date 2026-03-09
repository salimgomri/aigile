import Hero from '@/components/home/hero'
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
