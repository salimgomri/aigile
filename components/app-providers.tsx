'use client'

import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import { CreditProvider } from '@/lib/credits/CreditContext'
import { BookProductProvider } from '@/lib/book-product-context'
import FloatingBottomBar from '@/components/floating-bottom-bar'
import { GaRouteTracker } from '@/components/analytics/GaRouteTracker'

/**
 * Regroupe les providers client pour garder app/layout.tsx minimal
 * (évite un chunk layout surchargé / erreurs de parse côté dev).
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CreditProvider>
          <BookProductProvider>
            <Suspense fallback={null}>
              <GaRouteTracker />
            </Suspense>
            {children}
            <FloatingBottomBar />
          </BookProductProvider>
        </CreditProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
