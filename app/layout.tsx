import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import { CreditProvider } from '@/lib/credits/CreditContext'
import FloatingBottomBar from '@/components/floating-bottom-bar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
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
        <ThemeProvider>
          <LanguageProvider>
            <CreditProvider>
              {children}
              <FloatingBottomBar />
            </CreditProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
