import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

const plexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'Dashboard Manager | Le Système S.A.L.I.M. | AIgile',
  description:
    'Tableau de bord manager — 6 cadrans RAG, vélocité, OKR et narrative IA pour Scrum Masters et managers agile.',
  alternates: { canonical: 'https://aigile.lu/dashboard-manager' },
}

export default function DashboardManagerLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${plexSans.variable} ${plexMono.variable}`}>{children}</div>
}
