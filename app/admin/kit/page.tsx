'use client'

import { useEffect, useState } from 'react'

type Sub = {
  id: string
  email: string
  first_name: string | null
  consent_kit: boolean
  consent_kit_at: string | null
  consent_news: boolean
  source: string | null
  unsubscribed_at: string | null
  created_at: string
}

export default function AdminKitPage() {
  const [items, setItems] = useState<Sub[]>([])
  const [q, setQ] = useState('')

  async function load(query = q) {
    const res = await fetch(`/api/admin/kit-subscribers?q=${encodeURIComponent(query)}`)
    const json = await res.json()
    setItems(json.subscribers ?? [])
  }

  useEffect(() => {
    void load('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Inscrits au kit gratuit</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void load()}
          placeholder="Recherche e-mail"
          className="rounded border border-border bg-background px-3 py-2 text-sm"
        />
        <button type="button" onClick={() => void load()} className="rounded-full border border-border px-4 py-2 text-sm">
          Chercher
        </button>
        <a href="/api/admin/kit-subscribers?format=csv&actifs=1" className="rounded-full bg-aigile-gold px-4 py-2 text-sm font-semibold text-black">
          Export CSV (actifs)
        </a>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2">Date</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Kit</th>
            <th>News</th>
            <th>Source</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id} className="border-b border-border">
              <td className="py-2">{new Date(s.created_at).toLocaleString('fr-FR')}</td>
              <td>{s.first_name}</td>
              <td>{s.email}</td>
              <td>{s.consent_kit ? 'oui' : 'non'}</td>
              <td>{s.consent_news ? 'oui' : 'non'}</td>
              <td>{s.source}</td>
              <td>{s.unsubscribed_at ? 'désinscrit' : 'actif'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
