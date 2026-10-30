import type { Metadata } from 'next'
import { HomeLegacyPage } from '@/components/landing-v2/HomeLegacyPage'

export const metadata: Metadata = {
  title: 'Accueil (ancienne version)',
  robots: { index: false, follow: false },
}

export default async function HomeLegacyPreviewPage() {
  return <HomeLegacyPage />
}
