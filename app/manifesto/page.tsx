import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import { ManifestoApp } from '@/components/manifesto/ManifestoApp'
import '../landing.css'
import './manifesto.css'

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
  title: 'Manifeste AIgile | Coaching Agile AI Luxembourg France Belgique',
  description:
    "4 valeurs, 10 principes — L'évolution du Manifeste Agile 2001 pour l'ère IA | Salim Gomri",
  alternates: { canonical: 'https://aigile.lu/manifesto' },
  openGraph: {
    title: 'Manifeste AIgile | AIGILE.LU',
    description: "On fait AIgile, pas agile. 4 valeurs, 10 principes pour l'ère de l'IA.",
    url: 'https://aigile.lu/manifesto',
  },
}

export default function ManifestoPage() {
  return (
    <main className={`${inter.variable} ${instrument.variable}`}>
      <ManifestoApp />
    </main>
  )
}
