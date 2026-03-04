import Hero from '@/components/home/hero'
import Values from '@/components/home/values'
import Principles from '@/components/home/principles'
import CTA from '@/components/home/cta'
import About from '@/components/home/about'
import Footer from '@/components/home/footer'
import Header from '@/components/header'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Values />
      <Principles />
      <CTA />
      <About />
      <Footer />
    </main>
  )
}
