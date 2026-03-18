import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import PricingSection from '@/components/landing/PricingSection'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <PremiumNavbar />
      <PricingSection />
      <PremiumFooter />
    </main>
  )
}
