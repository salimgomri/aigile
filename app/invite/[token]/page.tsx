'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { Users, AlertCircle } from 'lucide-react'

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const { data: session, isPending } = useSession()

  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [data, setData] = useState<{
    valid: boolean
    teamName?: string
    role?: string
    email?: string
    error?: string
  } | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`/api/invite/${token}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => setData({ valid: false, error: 'Erreur de chargement' }))
      .finally(() => setLoading(false))
  }, [token])

  const handleAccept = async () => {
    if (!token) return
    setAccepting(true)
    try {
      const res = await fetch('/api/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur')
      router.push('/dashboard')
    } catch (err) {
      setData((prev) => ({
        ...prev,
        valid: prev?.valid ?? false,
        error: err instanceof Error ? err.message : 'Erreur',
      }))
    } finally {
      setAccepting(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!data.valid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-xl bg-destructive/20 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Invitation invalide ou expirée
          </h1>
          <p className="text-muted-foreground">
            {data.error ?? 'Ce lien a peut-être déjà été utilisé ou a expiré.'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full"
          >
            Retour à l&apos;accueil
          </Link>
          <p className="text-sm text-muted-foreground">
            Demandez une nouvelle invitation à votre Scrum Master.
          </p>
        </div>
      </div>
    )
  }

  const userEmail = session?.user?.email?.toLowerCase()
  const isInvitedEmail = userEmail === data.email?.toLowerCase()
  const isLoggedIn = !!session && !isPending

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-[#c9973a] mx-auto flex items-center justify-center shadow-lg mb-4">
            <Users className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Rejoindre {data.teamName}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Rôle proposé : <strong className="text-foreground">{data.role}</strong>
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          {data.error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {data.error}
            </div>
          )}

          {isLoggedIn && isInvitedEmail && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connecté en tant que {session?.user?.email}. Cliquez pour rejoindre.
              </p>
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full px-6 py-3 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full disabled:opacity-50"
              >
                {accepting ? 'Rejoindre...' : 'Rejoindre l\'équipe'}
              </button>
            </div>
          )}

          {isLoggedIn && !isInvitedEmail && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Cette invitation est destinée à <strong>{data.email}</strong>. Connectez-vous avec le bon compte.
              </p>
              <Link
                href="/login"
                className="block w-full text-center px-6 py-3 border border-border rounded-full text-foreground hover:bg-muted"
              >
                Changer de compte
              </Link>
            </div>
          )}

          {!isLoggedIn && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Cette invitation est pour {data.email}.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/login?redirect=${encodeURIComponent(`/invite/${token}`)}`}
                  className="block w-full text-center px-6 py-3 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full"
                >
                  Se connecter pour rejoindre
                </Link>
                <Link
                  href={`/register?email=${encodeURIComponent(data.email ?? '')}&invite=${encodeURIComponent(token)}`}
                  className="block w-full text-center px-6 py-3 border border-border rounded-full text-foreground hover:bg-muted"
                >
                  Créer mon compte et rejoindre
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Ce lien expire dans 72h.
        </p>
      </div>
    </div>
  )
}
