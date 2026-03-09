'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { Users } from 'lucide-react'

export default function JoinPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?redirect=${encodeURIComponent('/join')}`)
    }
  }, [session, isPending, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const c = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    if (c.length < 6) {
      setError('Entrez un code à 6 caractères')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: c }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur')
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    setCode(v)
  }

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-[#c9973a] mx-auto flex items-center justify-center shadow-lg mb-4">
            <Users className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Rejoindre une équipe
          </h1>
          <p className="mt-2 text-muted-foreground">
            Entre le code que t&apos;a partagé ton Scrum Master
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              maxLength={6}
              value={code}
              onChange={handleCodeChange}
              placeholder="XK7P2M"
              className="w-full px-4 py-4 bg-background border border-border rounded-xl text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#c9973a] text-foreground uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full px-6 py-3 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full disabled:opacity-50"
          >
            {loading ? 'Rejoindre...' : 'Rejoindre'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/dashboard" className="text-[#c9973a] hover:underline">
            Retour au tableau de bord
          </Link>
        </p>
      </div>
    </div>
  )
}
