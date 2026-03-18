'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession } from '@/lib/auth-client'

export type CreditStatus = {
  plan: 'free' | 'day_pass' | 'pro_monthly' | 'pro_annual'
  isUnlimited: boolean
  creditsRemaining: number | null
  monthlyTotal: number
  nextResetAt: string | null
  dayPassExpiresAt: string | null
  dayPassTimeRemaining: string | null
  isAdmin?: boolean
}

type CreditContextType = {
  status: CreditStatus | null
  loading: boolean
  refresh: () => Promise<void>
}

const CreditContext = createContext<CreditContextType>({
  status: null,
  loading: true,
  refresh: async () => {},
})

const emptyRefresh = async () => {}

/**
 * CreditProviderWithSession - uses useSession (client-only to avoid SSR redirect loops).
 * Only mounted after hydration so get-session fetch uses window.location.origin.
 */
function CreditProviderWithSession({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [status, setStatus] = useState<CreditStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!session?.user) {
      setStatus(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/credits/status')
      if (res.ok) {
        const data = await res.json()
        setStatus(data)
      } else {
        setStatus(null)
      }
    } catch {
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // Mode admin: active le cookie pour bypass middleware (niko-niko, dora)
  useEffect(() => {
    if (session?.user) {
      fetch('/api/admin/check', { credentials: 'include' }).catch(() => {})
    }
  }, [session?.user?.id])

  return (
    <CreditContext.Provider value={{ status, loading, refresh }}>
      {children}
    </CreditContext.Provider>
  )
}

/**
 * CreditProvider - defers useSession until client mount to avoid ERR_TOO_MANY_REDIRECTS
 * when BETTER_AUTH_URL / baseURL mismatch causes get-session to redirect in a loop.
 */
export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <CreditContext.Provider value={{ status: null, loading: true, refresh: emptyRefresh }}>
        {children}
      </CreditContext.Provider>
    )
  }

  return <CreditProviderWithSession>{children}</CreditProviderWithSession>
}

export const useCredits = () => useContext(CreditContext)
