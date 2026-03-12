'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import AppNavbar from '@/components/layout/AppNavbar'
import { Copy, Plus, X, Users, Ghost, Mail, Merge, ChevronDown } from 'lucide-react'
import UpgradeModal from '@/components/credits/UpgradeModal'

const ROLES = [
  { value: 'manager', label: 'Manager' },
  { value: 'scrum_master', label: 'Scrum Master' },
  { value: 'product_owner', label: 'Product Owner' },
  { value: 'agile_coach', label: 'Coach Agile' },
  { value: 'dev_team', label: 'Dev Team' },
  { value: 'guest', label: 'Invité' },
]

type TeamData = {
  team: { id: string; name: string; inviteCode: string; plan: string }
  realMembers: Array<{ id: string; user_id: string; role: string; userName: string; userEmail?: string }>
  ghostMembers: Array<{ id: string; display_name: string; created_at: string }>
  invitations: Array<{ id: string; email: string; role: string; expires_at: string }>
  quota: { current: number; max: number }
}

export default function SettingsTeamPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [data, setData] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('dev_team')
  const [ghostName, setGhostName] = useState('')
  const [mergeGhostId, setMergeGhostId] = useState<string | null>(null)
  const [mergeSearch, setMergeSearch] = useState('')
  const [mergeResults, setMergeResults] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  useEffect(() => {
    if (!isPending && !session) router.replace('/login')
  }, [session, isPending, router])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/team/settings')
      if (!res.ok) {
        if (res.status === 403) router.replace('/dashboard')
        else setError('Erreur chargement')
        return
      }
      const d = await res.json()
      setData(d)
    }
    if (session) void load().finally(() => setLoading(false))
  }, [session, router])

  const copyCode = () => {
    if (data?.team?.inviteCode) navigator.clipboard.writeText(data.team.inviteCode)
  }

  const handleInvite = async () => {
    if (!data?.team?.id || !inviteEmail.trim()) return
    setError('')
    const res = await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: data.team.id, email: inviteEmail.trim(), role: inviteRole }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Erreur')
      return
    }
    setInviteEmail('')
    const r = await fetch('/api/team/settings')
    if (r.ok) setData(await r.json())
  }

  const handleAddGhost = async () => {
    if (!data?.team?.id || !ghostName.trim()) return
    setError('')
    const res = await fetch('/api/team/ghost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: data.team.id, displayName: ghostName.trim() }),
    })
    if (!res.ok) {
      setError((await res.json()).error ?? 'Erreur')
      return
    }
    setGhostName('')
    const r = await fetch('/api/team/settings')
    if (r.ok) setData(await r.json())
  }

  const handleRemoveGhost = async (ghostId: string) => {
    if (!confirm('Supprimer ce fantôme ?')) return
    const res = await fetch(`/api/team/ghost?ghostId=${ghostId}`, { method: 'DELETE' })
    if (res.ok) {
      const r = await fetch('/api/team/settings')
      if (r.ok) setData(await r.json())
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!data?.team?.id || !confirm('Retirer ce membre de l\'équipe ?')) return
    const res = await fetch(`/api/team/members?teamId=${data.team.id}&memberId=${memberId}`, { method: 'DELETE' })
    if (res.ok) {
      const r = await fetch('/api/team/settings')
      if (r.ok) setData(await r.json())
    }
  }

  const handleRoleChange = async (memberId: string, role: string) => {
    if (!data?.team?.id) return
    const res = await fetch('/api/team/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: data.team.id, memberId, role }),
    })
    if (res.ok) {
      const r = await fetch('/api/team/settings')
      if (r.ok) setData(await r.json())
    }
  }

  const handleResend = async (invId: string) => {
    const res = await fetch('/api/team/invitations/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId: invId }),
    })
    if (res.ok) {
      const r = await fetch('/api/team/settings')
      if (r.ok) setData(await r.json())
    }
  }

  const searchUsers = async () => {
    if (!mergeSearch.trim()) return
    const res = await fetch(`/api/team/search-users?q=${encodeURIComponent(mergeSearch)}`)
    const d = await res.json()
    setMergeResults(d.users ?? [])
  }

  const handleMerge = async (realUserId: string) => {
    if (!mergeGhostId) return
    const res = await fetch('/api/team/merge-ghost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ghostId: mergeGhostId, realUserId }),
    })
    if (res.ok) {
      setMergeGhostId(null)
      setMergeSearch('')
      setMergeResults([])
      const r = await fetch('/api/team/settings')
      if (r.ok) setData(await r.json())
    } else {
      setError((await res.json()).error ?? 'Erreur fusion')
    }
  }

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  const quotaFull = data.quota.max !== Infinity && data.quota.current >= data.quota.max
  const isManager = data.realMembers.some((m) => m.user_id === session?.user?.id && m.role === 'manager')

  return (
    <main className="min-h-screen bg-background pt-16">
      <AppNavbar />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold text-foreground">Paramètres équipe</h1>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{data.team.name}</h2>
          <div className="flex items-center gap-2">
            <code className="px-3 py-1 bg-muted rounded-lg font-mono">{data.team.inviteCode}</code>
            <button onClick={copyCode} className="p-2 rounded-lg hover:bg-muted">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <section>
          <h3 className="text-sm font-medium text-foreground mb-2">
            MEMBRES RÉELS ({data.quota.current}/{data.quota.max === Infinity ? '∞' : data.quota.max} en {data.team.plan === 'free' ? 'Free' : 'Pro'})
          </h3>
          <div className="space-y-2">
            {data.realMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{m.userName} {m.user_id === session?.user?.id && '(toi)'}</span>
                  <span className="text-sm text-muted-foreground">{m.role}</span>
                </div>
                {m.user_id !== session?.user?.id && isManager && (
                  <div className="flex items-center gap-2">
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <button onClick={() => handleRemoveMember(m.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!quotaFull && (
            <div className="flex gap-2 mt-3">
              <input
                type="email"
                placeholder="Email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <button onClick={handleInvite} disabled={!inviteEmail.trim()} className="px-4 py-2 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full text-sm disabled:opacity-50">
                Inviter
              </button>
            </div>
          )}
          {quotaFull && data.team.plan === 'free' && (
            <div className="mt-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="font-medium text-amber-700 dark:text-amber-400">Quota Free atteint (3/3 membres réels)</p>
              <p className="text-sm text-muted-foreground mt-1">Passez Pro pour inviter plus de membres.</p>
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="mt-3 px-4 py-2 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full text-sm"
              >
                Passer Pro — 19,99€/mois
              </button>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-medium text-foreground mb-2">MEMBRES FANTÔMES</h3>
          <div className="space-y-2">
            {data.ghostMembers.map((g) => (
              <div key={g.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <Ghost className="w-4 h-4 text-muted-foreground" />
                  <span>{g.display_name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setMergeGhostId(g.id)} className="text-sm text-[#c9973a] hover:underline flex items-center gap-1">
                    <Merge className="w-4 h-4" /> Fusionner
                  </button>
                  <button onClick={() => handleRemoveGhost(g.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Prénom"
              value={ghostName}
              onChange={(e) => setGhostName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button onClick={handleAddGhost} disabled={!ghostName.trim()} className="px-4 py-2 border rounded-full text-sm disabled:opacity-50">
              Ajouter
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-foreground mb-2">INVITATIONS EN ATTENTE</h3>
          {data.invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune invitation en attente.</p>
          ) : (
            <div className="space-y-2">
              {data.invitations.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{inv.email}</span>
                    <span className="text-sm text-muted-foreground">{inv.role}</span>
                  </div>
                  <button onClick={() => handleResend(inv.id)} className="text-sm text-[#c9973a] hover:underline">
                    Renvoyer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <UpgradeModal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />

        {mergeGhostId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="font-semibold">Fusionner avec un compte réel</h3>
              <p className="text-sm text-muted-foreground">Recherche par email ou nom :</p>
              <input
                type="text"
                value={mergeSearch}
                onChange={(e) => setMergeSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                placeholder="thomas@fintech.lu"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <button onClick={searchUsers} className="px-4 py-2 bg-[#c9973a] text-black font-semibold rounded-full text-sm">
                Rechercher
              </button>
              {mergeResults.length > 0 && (
                <div className="space-y-2">
                  {mergeResults.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleMerge(u.id)}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted"
                    >
                      {u.name} · {u.email}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Cette action est irréversible.</p>
              <div className="flex gap-2">
                <button onClick={() => { setMergeGhostId(null); setMergeSearch(''); setMergeResults([]) }} className="flex-1 py-2 border rounded-full">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
