import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import { FrameworkApp } from '@/components/framework/FrameworkApp'
import { getFrameworkArticlesByLang } from '@/lib/framework/framework-articles'
import '../landing.css'
import './framework.css'

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
  title: 'The AIgile Framework | AIGILE.LU',
  description:
    'Interactive AIgile workflow: six states, one lateral exit. Humans set the frame, AI produces inside it.',
  alternates: { canonical: 'https://aigile.lu/framework' },
  openGraph: {
    title: 'The AIgile Framework | AIGILE.LU',
    description: 'On fait AIgile, pas agile. Cadre de référence v1.4.',
    url: 'https://aigile.lu/framework',
  },
}

export default function FrameworkPage() {
  const articles = getFrameworkArticlesByLang()

  return (
    <main className={`${inter.variable} ${instrument.variable}`}>
      <FrameworkApp articles={articles} />
    </main>
  )
}
