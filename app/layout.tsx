import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/app-providers'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-WMG8QLND8X'

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
    jobTitle: 'Agile Coach · 21 ans expérience',
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(GA_ID)});
          `}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
