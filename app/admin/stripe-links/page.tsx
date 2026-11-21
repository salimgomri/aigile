'use client'

import { useEffect, useState } from 'react'

type Payload = {
  envLinks: Array<{ slug: string; nom: string; url: string | null; missing: boolean; envUrl: string }>
  paymentLinks: Array<{ id: string; url: string | null; active: boolean; livemode: boolean }>
  alerts: string[]
  readOnly: boolean
}

export default function AdminStripeLinksPage() {
  const [data, setData] = useState<Payload | null>(null)

  useEffect(() => {
    fetch('/api/admin/stripe-links')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Liens Stripe (lecture seule)</h1>
      <p className="text-sm text-muted-foreground mb-6">Aucun bouton de création ou de modification.</p>
      {(data?.alerts ?? []).length > 0 ? (
        <ul className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm">
          {data!.alerts.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      ) : null}
      <h2 className="font-semibold mb-2">Variables du site</h2>
      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2">Produit</th>
            <th>Variable</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {(data?.envLinks ?? []).map((l) => (
            <tr key={l.slug} className="border-b border-border">
              <td className="py-2">{l.nom}</td>
              <td>
                <code>{l.envUrl}</code>
              </td>
              <td>{l.missing ? 'absent' : l.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="font-semibold mb-2">Payment Links Stripe</h2>
      <ul className="text-sm space-y-1">
        {(data?.paymentLinks ?? []).map((l) => (
          <li key={l.id}>
            {l.id} — {l.active ? 'actif' : 'inactif'} — {l.livemode ? 'LIVE' : 'test'} — {l.url}
          </li>
        ))}
      </ul>
    </div>
  )
}
