import { Instrument_Serif, Inter } from 'next/font/google'
import { SystemSalimLanding } from '@/components/landing-v2/SystemSalimLanding'
import { AdminLandingTools } from '@/components/landing/admin-landing-tools'
import { getSessionIsAdmin } from '@/lib/landing-admin'
import { getLandingCommerceSummary } from '@/lib/admin/landing-commerce-summary'
import '@/app/landing.css'

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

/** Ancienne homepage — intacte, importée par `/` (legacy) et `/home-legacy`. */
export async function HomeLegacyPage() {
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
