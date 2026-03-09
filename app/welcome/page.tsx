'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'

export default function WelcomePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!session) {
    router.replace('/login')
    return null
  }

  const user = session.user as { firstName?: string; lastName?: string; name?: string }
  const firstName = user.firstName || user.name?.split(' ')[0] || ''

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-aigile-gold mx-auto flex items-center justify-center shadow-lg">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bienvenue {firstName} !
          </h1>
          <p className="text-xl text-muted-foreground">
            On qualifie déjà le prospect.
          </p>
        </div>

        <p className="text-muted-foreground">
          Votre compte est activé. Vous avez accès à tous les outils AIgile.
        </p>

        <Link
          href="/dashboard"
          className="inline-block px-8 py-4 bg-aigile-gold hover:bg-book-orange text-black font-bold rounded-xl transition-colors"
        >
          Accéder au dashboard
        </Link>
      </div>
    </div>
  )
}
