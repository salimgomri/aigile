'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { User } from 'lucide-react'

const ROLES = [
  { value: 'manager', labelFr: 'Manager', labelEn: 'Manager' },
  { value: 'scrum_master', labelFr: 'Scrum Master', labelEn: 'Scrum Master' },
  { value: 'product_owner', labelFr: 'Product Owner', labelEn: 'Product Owner' },
  { value: 'agile_coach', labelFr: 'Coach Agile', labelEn: 'Agile Coach' },
  { value: 'dev_team', labelFr: 'Équipe Dev', labelEn: 'Dev Team' },
  { value: 'guest', labelFr: 'Invité', labelEn: 'Guest' },
]

export default function OnboardingRolePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login')
    }
  }, [session, isPending, router])

  // Redirect to dashboard if user already has a role
  const userRole = (session?.user as { role?: string })?.role
  useEffect(() => {
    if (!isPending && session && userRole) {
      router.replace('/dashboard')
    }
  }, [session, isPending, userRole, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/user/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  const user = session.user as { firstName?: string; lastName?: string; name?: string }
  const firstName = user.firstName || user.name?.split(' ')[0] || session.user.name || ''

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-aigile-gold mx-auto flex items-center justify-center shadow-lg mb-4">
            <User className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenue {firstName} !
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pour personnaliser votre expérience, indiquez votre rôle.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
              Votre rôle *
            </label>
            <select
              id="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground"
            >
              <option value="">Sélectionnez votre rôle</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.labelFr}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !role}
            className="w-full px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : 'Continuer'}
          </button>
        </form>
      </div>
    </div>
  )
}
