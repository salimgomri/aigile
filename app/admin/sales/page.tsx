'use client'

import { useEffect, useState } from 'react'

type SalesPayload = {
  orders: Array<{ id: string; product_title: string; amount_total: number; created_at: string; status: string }>
  byProduct: Array<{ id: string; title: string; count: number; amount: number }>
  byMonth: Array<{ month: string; count: number; amount: number }>
  vat: string
}

export default function AdminSalesPage() {
  const [data, setData] = useState<SalesPayload | null>(null)

  useEffect(() => {
    fetch('/api/admin/sales')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Ventes Stripe</h1>
      <p className="text-sm text-muted-foreground mb-6">{data?.vat}</p>
      <a href="/api/admin/sales?format=csv" className="inline-block mb-6 rounded-full bg-aigile-gold px-4 py-2 text-sm font-semibold text-black">
        Export CSV
      </a>
      <h2 className="font-semibold mb-2">Par produit</h2>
      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2">Produit</th>
            <th>Nombre</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {(data?.byProduct ?? []).map((p) => (
            <tr key={p.id} className="border-b border-border">
              <td className="py-2">{p.title}</td>
              <td>{p.count}</td>
              <td>{(p.amount / 100).toFixed(2).replace('.', ',')} €</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="font-semibold mb-2">Par mois</h2>
      <ul className="text-sm space-y-1">
        {(data?.byMonth ?? []).map((m) => (
          <li key={m.month}>
            {m.month} — {m.count} ventes — {(m.amount / 100).toFixed(2).replace('.', ',')} €
          </li>
        ))}
      </ul>
    </div>
  )
}
