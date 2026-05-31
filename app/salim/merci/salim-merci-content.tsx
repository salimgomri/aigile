'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SalimContactLinks } from '@/components/salim/salim-contact-links'

type SessionData = {
  productId: string
  productType: string
}

export default function SalimMerciContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [data, setData] = useState<SessionData | null>(null)

  useEffect(() => {
    if (!sessionId) return
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => setData(json))
      .catch(() => {})
  }, [sessionId])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center text-aigile-navy">
        <h1 className="text-2xl font-bold mb-6">Commande confirmée</h1>
        <div className="space-y-4 text-sm leading-relaxed text-aigile-navy/80">
          <p>Tu vas recevoir un email de confirmation dans les prochaines minutes.</p>
          <p>
            Si tu as commandé la collection, ton accès Early Access au Scoring Deliverable sera activé
            manuellement sous 24h.
          </p>
          <p>
            Des questions : <SalimContactLinks className="text-aigile-blue" />
          </p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-lg bg-aigile-navy px-6 py-3 text-sm font-semibold text-white hover:bg-aigile-navy/90 transition-colors"
        >
          Retour à aigile.lu
        </Link>
      </div>
    </main>
  )
}
