import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import { CreditProvider } from '@/lib/credits/CreditContext'
import { BookProductProvider } from '@/lib/book-product-context'
import FloatingBottomBar from '@/components/floating-bottom-bar'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-WMG8QLND8X'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AIgile',
  url: 'https://aigile.lu',
  address: { '@type': 'PostalAddress', addressCountry: 'LU' },
  description:
    'Coaching agile AI Luxembourg France Belgique | Outils Retro AI + méthode S.A.L.I.M',
  founder: {
    '@type': 'Person',
    name: 'Salim Gomri',
    jobTitle: 'Agile Coach 21 ans expérience',
  },
  areaServed: ['LU', 'FR', 'BE'],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://aigile.lu'),
  title: 'AIgile Manifesto - The Evolution of Agile for the AI Era',
  description: 'Transform from "Are you agile?" to "Are you AIgile?" - The essential evolution of the 2001 Agile Manifesto for teams working in the AI era.',
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
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <ThemeProvider>
          <LanguageProvider>
            <CreditProvider>
              <BookProductProvider>
                {children}
                <FloatingBottomBar />
              </BookProductProvider>
            </CreditProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
