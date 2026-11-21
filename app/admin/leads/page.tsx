'use client'

import { useEffect, useState } from 'react'
import { LEAD_STATUSES } from '@/lib/leads/status'

type Lead = {
  id: string
  type: string
  name: string | null
  email: string
  company: string | null
  role: string | null
  motif: string | null
  status: string
  notes: string | null
  follow_up_at: string | null
  from_param: string | null
  source: string | null
  created_at: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function load(nextStatus = status) {
    const qs = nextStatus ? `?status=${encodeURIComponent(nextStatus)}` : ''
    const res = await fetch(`/api/admin/leads${qs}`)
    if (res.status === 401) {
      setError('Non autorisé')
      return
    }
    const json = await res.json()
    setLeads(json.leads ?? [])
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    })
    await load()
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mini-CRM des demandes</h1>
      {error ? <p className="text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-3 mb-6">
        <label className="text-sm">
          Statut{' '}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              void load(e.target.value)
            }}
            className="ml-2 rounded border border-border bg-background px-2 py-1"
          >
            <option value="">Tous</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <a
          href={`/api/admin/leads?format=csv${status ? `&status=${status}` : ''}`}
          className="rounded-full bg-aigile-gold px-4 py-2 text-sm font-semibold text-black"
        >
          Export CSV
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border">
              <th className="py-2">Date</th>
              <th>Type</th>
              <th>Nom / entreprise</th>
              <th>Motif</th>
              <th>Statut</th>
              <th>Relance</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const overdue = l.follow_up_at && l.follow_up_at < today && !['gagne', 'perdu'].includes(l.status)
              return (
                <tr key={l.id} className={`border-b border-border ${overdue ? 'bg-red-500/10' : ''}`}>
                  <td className="py-2 whitespace-nowrap">{new Date(l.created_at).toLocaleString('fr-FR')}</td>
                  <td>{l.type}</td>
                  <td>
                    {l.name}
                    <div className="text-xs text-muted-foreground">
                      {l.email}
                      {l.company ? ` · ${l.company}` : ''}
                      {l.role ? ` · ${l.role}` : ''}
                    </div>
                  </td>
                  <td>
                    {l.motif}
                    <div className="text-xs text-muted-foreground">{l.from_param || l.source}</div>
                  </td>
                  <td>
                    <select
                      value={l.status}
                      onChange={(e) => void patch(l.id, { status: e.target.value })}
                      className="rounded border border-border bg-background px-1 py-0.5"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="date"
                      defaultValue={l.follow_up_at ?? ''}
                      onBlur={(e) => void patch(l.id, { follow_up_at: e.target.value || null })}
                      className="rounded border border-border bg-background px-1 py-0.5"
                    />
                  </td>
                  <td>
                    <textarea
                      defaultValue={l.notes ?? ''}
                      onBlur={(e) => void patch(l.id, { notes: e.target.value })}
                      className="w-40 rounded border border-border bg-background px-1 py-0.5 text-xs"
                      rows={2}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
