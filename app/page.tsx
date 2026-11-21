import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import { HomeLegacyPage } from '@/components/landing-v2/HomeLegacyPage'
import { HomeV2 } from '@/components/home-v2/HomeV2'
import { getHomeVariant } from '@/lib/site-facts'
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

export const dynamic = 'force-dynamic'

const legacyMetadata: Metadata = {
  title: 'Le Système S.A.L.I.M. | Scrum Augmenté Livré en Incremental et Mesuré',
  description: `Scrum Augmenté Livré en Incremental et Mesuré (S.A.L.I.M.). ${salimYearsExpertiseSalimFr()} · Guide terrain · aigile.lu`,
  keywords: ['S.A.L.I.M.', 'agile leadership', 'Scrum', 'book', 'framework', 'retro AI', 'Luxembourg'],
  openGraph: {
    title: 'The S.A.L.I.M. System | AIGILE.LU',
    description: 'Lead better. Deliver more. Together.',
    type: 'website',
    url: 'https://aigile.lu',
    images: [{ url: 'https://aigile.lu/images/system-salim-hero-detoure.png' }],
  },
  alternates: { canonical: 'https://aigile.lu/' },
}

const v2Metadata: Metadata = {
  title: 'Coach agile augmenté par l’IA – formations intra et diagnostic | AIgile',
  description:
    'Coach agile augmenté par l’IA depuis 2003 – formations intra et accompagnement. Diagnostic flash 30 min.',
  openGraph: {
    title: 'Coach agile augmenté par l’IA | AIgile',
    description: 'Formations intra et diagnostic flash — l’IA propose, l’humain décide.',
    type: 'website',
    url: 'https://aigile.lu',
  },
  alternates: { canonical: 'https://aigile.lu/' },
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = getHomeVariant() === 'v2' ? v2Metadata : legacyMetadata
  return {
    ...meta,
    other: {
      'aigile:home-variant': getHomeVariant(),
    },
  }
}

export default async function Home() {
  if (getHomeVariant() === 'v2') {
    return (
      <main className={`${inter.variable} ${instrument.variable}`}>
        <HomeV2 />
      </main>
    )
  }
  return <HomeLegacyPage />
}
