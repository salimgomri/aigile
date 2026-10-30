import { redirect } from 'next/navigation'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import PricingSection from '@/components/landing/PricingSection'
import { getHomeVariant } from '@/lib/site-facts'

export default function PricingPage() {
  if (getHomeVariant() === 'v2') {
    redirect('/#offres')
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <PremiumNavbar />
      <PricingSection />
      <PremiumFooter />
    </main>
  )
}
