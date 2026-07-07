import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import { SystemSalimLanding } from '@/components/landing-v2/SystemSalimLanding'
import { AdminLandingTools } from '@/components/landing/admin-landing-tools'
import { getSessionIsAdmin } from '@/lib/landing-admin'
import { getLandingCommerceSummary } from '@/lib/admin/landing-commerce-summary'
import { salimYearsExpertiseSalimFr } from '@/lib/salim-experience'
import './landing.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Le Système S.A.L.I.M. | Scrum Augmenté Livré en Incremental et Mesuré',
  description:
    `Scrum Augmenté Livré en Incremental et Mesuré (S.A.L.I.M.). ${salimYearsExpertiseSalimFr()} · Guide terrain · aigile.lu`,
  keywords: ['S.A.L.I.M.', 'agile leadership', 'Scrum', 'book', 'framework', 'retro AI', 'Luxembourg'],
  openGraph: {
    title: 'The S.A.L.I.M. System | AIGILE.LU',
    description: 'Lead better. Deliver more. Together.',
    type: 'website',
    url: 'https://aigile.lu',
    images: [{ url: 'https://aigile.lu/images/system-salim-hero.png' }],
  },
  alternates: { canonical: 'https://aigile.lu/' },
}

export default async function Home() {
  const isAdmin = await getSessionIsAdmin()
  const commerceSummary = isAdmin ? await getLandingCommerceSummary() : null

  return (
    <main className={`${inter.variable} ${instrument.variable}`}>
      <SystemSalimLanding />
      {commerceSummary ? (
        <div className="ld-admin-wrap">
          <AdminLandingTools commerce={commerceSummary} />
        </div>
      ) : null}
    </main>
  )
}
