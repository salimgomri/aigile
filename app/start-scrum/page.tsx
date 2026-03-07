import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import FloatingCoachingButton from '@/components/floating-coaching-button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function StartScrumPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <PremiumNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Start Your Scrum Journey
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Coming soon: Your personalized Scrum onboarding experience
        </p>
        <Link
          href="/retro"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <span>Try AI Retro Tool</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <PremiumFooter />
      <FloatingCoachingButton />
    </main>
  )
}
