import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { salimJobTitleFr } from '@/lib/salim-experience'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'AIgile',
  url: 'https://aigile.lu',
  address: { '@type': 'PostalAddress', addressCountry: 'LU' },
  description:
    "Coaching agile pour PME et dirigeants. Formation d'équipes, audit Agile, coaching sur mesure. Outils Retro AI, méthode S.A.L.I.M.",
  serviceType: ['Agile Coaching', 'Team Training', 'Agile Audit', 'Scrum Master'],
  founder: {
    '@type': 'Person',
    name: 'Salim Gomri',
    jobTitle: salimJobTitleFr(),
  },
  areaServed: ['LU', 'FR', 'BE'],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://aigile.lu'),
  title: {
    default: 'AIgile | Coaching Agile PME & Outils Retro AI',
    template: '%s | AIgile',
  },
  description: 'Coaching agile pour PME et dirigeants · Formation équipes · Retro AI gratuit · Méthode S.A.L.I.M · Luxembourg France Belgique',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
