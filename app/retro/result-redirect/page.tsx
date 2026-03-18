'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'

const STORAGE_KEY = 'retro_pending_unlock'

export default function ResultRedirectPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      router.replace('/retro')
      return
    }

    try {
      const raw = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null
      if (!raw) {
        router.replace('/retro')
        return
      }

      const { data, teamSize, random } = JSON.parse(raw) as {
        data?: string
        teamSize?: string
        random?: string
      }

      sessionStorage.removeItem(STORAGE_KEY)

      const params = new URLSearchParams()
      if (data) params.set('data', data)
      if (teamSize) params.set('teamSize', teamSize)
      if (random === 'true') params.set('random', 'true')

      router.replace(`/retro/result?${params.toString()}`)
    } catch {
      router.replace('/retro')
    }
  }, [session, isPending, router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">
        Redirection vers ton diagnostic...
      </div>
    </div>
  )
}
