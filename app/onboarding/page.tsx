'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Users, Copy, Plus, X } from 'lucide-react'

const ROLES = [
  { value: 'scrum_master', label: 'Scrum Master' },
  { value: 'manager', label: 'Manager' },
  { value: 'product_owner', label: 'Product Owner' },
  { value: 'agile_coach', label: 'Coach Agile' },
  { value: 'dev_team', label: 'Développeur' },
]

const ROLE_OPTIONS = [
  { value: 'scrum_master', label: 'Scrum Master' },
  { value: 'manager', label: 'Manager' },
  { value: 'product_owner', label: 'Product Owner' },
  { value: 'agile_coach', label: 'Coach Agile' },
  { value: 'dev_team', label: 'Développeur' },
]

type RealMember = { firstName: string; email: string; role: string }
type GhostMember = { displayName: string }

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [organizationName, setOrganizationName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [role, setRole] = useState('dev_team')
  const [teamId, setTeamId] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState('')

  const [realMembers, setRealMembers] = useState<RealMember[]>([
    { firstName: '', email: '', role: 'dev_team' },
    { firstName: '', email: '', role: 'dev_team' },
  ])
  const [ghostMembers, setGhostMembers] = useState<GhostMember[]>([])

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login')
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (isPending || !session) return
    const check = async () => {
      const res = await fetch('/api/onboarding/status')
      if (!res.ok) return
      const { hasTeam, onboardingCompleted } = await res.json()
      if (hasTeam && onboardingCompleted) {
        router.replace('/dashboard')
      }
    }
    void check()
  }, [session, isPending, router])

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding/create-space', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: organizationName.trim(),
          teamName: teamName.trim(),
          role,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      if (data.alreadyExists) {
        setTeamId(data.teamId)
        setInviteCode(data.inviteCode || '')
      } else {
        setTeamId(data.teamId)
        setInviteCode(data.inviteCode || '')
      }
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleStep2Send = async () => {
    setLoading(true)
    setError('')
    try {
      const real = realMembers.filter((m) => m.email.trim())
      const ghost = ghostMembers.filter((g) => g.displayName.trim())
      if (real.length === 0 && ghost.length === 0) {
        router.push('/dashboard')
        return
      }
      const res = await fetch('/api/onboarding/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          realMembers: real.map((m) => ({
            firstName: m.firstName,
            email: m.email,
            role: m.role,
          })),
          ghostMembers: ghost.map((g) => ({ displayName: g.displayName })),
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Erreur envoi invitations')
      }
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const handleStep2Skip = () => {
    router.push('/dashboard')
  }

  const addRealMember = () => {
    setRealMembers((prev) => [...prev, { firstName: '', email: '', role: 'dev_team' }])
  }

  const updateRealMember = (i: number, field: keyof RealMember, value: string) => {
    setRealMembers((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  const removeRealMember = (i: number) => {
    setRealMembers((prev) => prev.filter((_, j) => j !== i))
  }

  const addGhost = () => {
    setGhostMembers((prev) => [...prev, { displayName: '' }])
  }

  const updateGhost = (i: number, value: string) => {
    setGhostMembers((prev) => {
      const next = [...prev]
      next[i] = { displayName: value }
      return next
    })
  }

  const removeGhost = (i: number) => {
    setGhostMembers((prev) => prev.filter((_, j) => j !== i))
  }

  const copyCode = () => {
    if (inviteCode) navigator.clipboard.writeText(inviteCode)
  }

  const realCount = realMembers.filter((m) => m.email.trim()).length
  const maxReal = 3
  const invitesLeft = Math.max(0, maxReal - 1 - realCount)

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  const user = session.user as { firstName?: string; name?: string }
  const firstName = user.firstName || user.name?.split(' ')[0] || ''

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-[#c9973a] mx-auto flex items-center justify-center shadow-lg mb-4">
            <Users className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {step === 1 ? 'Créons ton espace équipe' : 'Invite tes premiers coéquipiers'}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {step === 1
              ? 'Étape 1 — Ton équipe'
              : 'Optionnel — tu pourras le faire plus tard'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1} className="bg-card border border-border rounded-2xl p-8 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nom de ton organisation
              </label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder='ex: "FinTech Luxembourg", "Equipe Phoenix"'
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9973a] text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nom de ton équipe
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder='ex: "Équipe Phoenix", "Squad Backend"'
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9973a] text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ton rôle dans l&apos;équipe
              </label>
              <div className="flex flex-wrap gap-3">
                {ROLES.map((r) => (
                  <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => setRole(r.value)}
                      className="text-[#c9973a] focus:ring-[#c9973a]"
                    />
                    <span className="text-sm text-foreground">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer mon espace'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Plan Free : {invitesLeft} invitation(s) par email disponibles · fantômes illimités
            </p>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Membres réels (par email)</h3>
              {realMembers.map((m, i) => (
                <div key={i} className="flex flex-wrap gap-2 mb-3 items-end">
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={m.firstName}
                    onChange={(e) => updateRealMember(i, 'firstName', e.target.value)}
                    className="flex-1 min-w-[100px] px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={m.email}
                    onChange={(e) => updateRealMember(i, 'email', e.target.value)}
                    className="flex-1 min-w-[120px] px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <select
                    value={m.role}
                    onChange={(e) => updateRealMember(i, 'role', e.target.value)}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  >
                    {ROLE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeRealMember(i)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {realCount < 2 && (
                <button
                  type="button"
                  onClick={addRealMember}
                  className="text-sm text-[#c9973a] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Ajouter un membre
                </button>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Membres fantômes (prénom uniquement)
              </h3>
              {ghostMembers.map((g, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={g.displayName}
                    onChange={(e) => updateGhost(i, e.target.value)}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeGhost(i)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addGhost}
                className="text-sm text-[#c9973a] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Ajouter un fantôme
              </button>
            </div>

            {inviteCode && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  Code d&apos;équipe pour rejoindre sans invitation
                </h3>
                <div className="flex gap-2">
                  <code className="flex-1 px-4 py-2 bg-background border border-border rounded-lg font-mono text-lg tracking-wider">
                    {inviteCode}
                  </code>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="px-4 py-2 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" /> Copier
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Partage ce code — les membres créent leur compte et entrent ce code.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleStep2Send}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Envoyer les invitations'}
              </button>
              <button
                type="button"
                onClick={handleStep2Skip}
                className="px-6 py-3 border border-border rounded-full text-foreground hover:bg-muted"
              >
                Passer cette étape
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
