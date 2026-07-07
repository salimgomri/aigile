import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FrameworkApp } from '@/components/framework/FrameworkApp'
import './framework.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  return (
    <main className={inter.variable}>
      <FrameworkApp />
    </main>
  )
}
