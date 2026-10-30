import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import { HomeV2 } from '@/components/home-v2/HomeV2'
import '../landing.css'

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
  title: 'Coach agile augmenté par l’IA – formations intra et diagnostic | AIgile',
  description:
    'Coach agile augmenté par l’IA depuis 2003 – formations intra et accompagnement. [À CONFIRMER par Salim]',
  robots: { index: false, follow: false },
}

export default function HomeV2PreviewPage() {
  return (
    <main className={`${inter.variable} ${instrument.variable}`}>
      <HomeV2 />
    </main>
  )
}
