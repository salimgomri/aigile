'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingRolePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/onboarding')
  }, [router])
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Redirection...</div>
    </div>
  )
}
