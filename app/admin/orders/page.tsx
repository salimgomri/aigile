'use client'

import { useEffect, useState } from 'react'
import { Package, Zap, Sparkles, Target, Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { COUNTRIES } from '@/lib/countries'

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'book_physical':
      return '📚'
    case 'day_pass':
      return '⚡'
    case 'subscription_monthly':
    case 'subscription_annual':
      return '✦'
    case 'credits_pack':
      return '🎯'
    default:
      return '•'
  }
}

function getTypeLabel(type: string, productId: string): string {
  if (type === 'book_physical') {
    return productId === 'book_preorder' ? 'Précommande' : 'Vente'
  }
  if (type === 'day_pass') return 'Day Pass'
  if (type === 'subscription_monthly') return 'Pro Mensuel'
  if (type === 'subscription_annual') return 'Pro Annuel'
  if (type === 'credits_pack') return 'Crédits'
  return type
}

function getStatusLabel(status: string, type: string): string {
  if (status === 'paid' && type === 'book_physical') return '⏳ Payé'
  if (status === 'shipped') return '✅ Expédié'
  if (status === 'fulfilled' && type === 'day_pass') return '✅ Livré'
  if (status === 'fulfilled' && type.startsWith('subscription')) return '✅ Actif'
  if (status === 'fulfilled') return '✅ Livré'
  return status
}

type Order = {
  id: string
  product_id: string
  product_type: string
  product_title: string
  buyer_name: string
  buyer_email: string
  shipping_country: string | null
  amount_total: number
  coupon_code: string | null
  status: string
  created_at: string
  stripe_session_id: string
  shipping_name?: string
  shipping_address1?: string
  shipping_address2?: string
  shipping_city?: string
  shipping_postal?: string
  shipping_phone?: string
  tracking_number?: string
  fulfillment_ref?: string
  notes?: string
  in_person_pickup?: boolean
}

type Stats = {
  total: number
  booksPaid: number
  monthRevenue: number
  pendingShipment: number
  activePro: number
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [shipModal, setShipModal] = useState<Order | null>(null)
  const [shipTracking, setShipTracking] = useState('')
  const [shipKdp, setShipKdp] = useState('')
  const [shipNotes, setShipNotes] = useState('')
  const [shipLoading, setShipLoading] = useState(false)

  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterPeriod, setFilterPeriod] = useState('')
  const [filterSearch, setFilterSearch] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterType) params.set('product_type', filterType)
    if (filterStatus) params.set('status', filterStatus)
    if (filterCountry) params.set('country', filterCountry)
    if (filterPeriod) params.set('period', filterPeriod)
    if (filterSearch) params.set('search', filterSearch)
    const res = await fetch(`/api/admin/orders?${params}`)
    const data = await res.json()
    if (res.ok) {
      setOrders(data.orders)
      setStats(data.stats)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [filterType, filterStatus, filterCountry, filterPeriod, filterSearch])

  const handleShip = async () => {
    if (!shipModal) return
    setShipLoading(true)
    const res = await fetch(`/api/admin/orders/${shipModal.id}/ship`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingNumber: shipTracking.trim() || undefined,
        fulfillmentRef: shipKdp.trim() || undefined,
        notes: shipNotes.trim() || undefined,
      }),
    })
    if (res.ok) {
      setShipModal(null)
      setShipTracking('')
      setShipKdp('')
      setShipNotes('')
      fetchOrders()
      setSelectedOrder(null)
    }
    setShipLoading(false)
  }

  const getCountryName = (code: string) => COUNTRIES.find((c) => c.code === code)?.name ?? code

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-8">Dashboard Commandes</h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-foreground"
        >
          <option value="">Tous les types</option>
          <option value="book_physical">Livre</option>
          <option value="day_pass">Day Pass</option>
          <option value="subscription_monthly">Pro Mensuel</option>
          <option value="subscription_annual">Pro Annuel</option>
          <option value="credits_pack">Crédits</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-foreground"
        >
          <option value="">Statut</option>
          <option value="paid">Payé</option>
          <option value="shipped">Expédié</option>
          <option value="fulfilled">Livré/Actif</option>
        </select>
        <select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-foreground"
        >
          <option value="">Pays</option>
          {COUNTRIES.slice(0, 20).map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-foreground"
        >
          <option value="">Période</option>
          <option value="week">7 jours</option>
          <option value="month">30 jours</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Recherche email/nom"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
          />
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total commandes</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{stats.booksPaid}</p>
            <p className="text-sm text-muted-foreground">Livres payés</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{formatPrice(stats.monthRevenue)}</p>
            <p className="text-sm text-muted-foreground">Revenus mois</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{stats.pendingShipment}</p>
            <p className="text-sm text-muted-foreground">En att. livraison</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{stats.activePro}</p>
            <p className="text-sm text-muted-foreground">Pro actifs</p>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Date</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Type</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Nom</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Pays</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Montant</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Promo</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Statut</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-14" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-12" />
                  </td>
                </tr>
              ))
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="border-t border-border hover:bg-muted/20 cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {format(new Date(order.created_at), 'd MMM', { locale: fr })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span>{getTypeIcon(order.product_type)} </span>
                    {getTypeLabel(order.product_type, order.product_id)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{order.buyer_name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {order.shipping_country ? getCountryName(order.shipping_country) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{formatPrice(order.amount_total)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {order.coupon_code || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">{getStatusLabel(order.status, order.product_type)}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {order.product_type === 'book_physical' && order.status === 'paid' ? (
                      <button
                        onClick={() => setShipModal(order)}
                        className="text-sm font-medium text-aigile-gold hover:text-book-orange"
                      >
                        Expédier →
                      </button>
                    ) : (
                      <a
                        href={`https://dashboard.stripe.com/search?query=${order.stripe_session_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Voir
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal détail */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Détail commande</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground">Acheteur</p>
                <p>{selectedOrder.buyer_name}</p>
                <p>{selectedOrder.buyer_email}</p>
              </div>
              {(selectedOrder.shipping_address1 || selectedOrder.in_person_pickup) && (
                <div>
                  <p className="font-semibold text-muted-foreground">Livraison</p>
                  {selectedOrder.in_person_pickup ? (
                    <p>En main propre</p>
                  ) : (
                    <p>
                      {selectedOrder.shipping_name}<br />
                      {selectedOrder.shipping_address1}
                      {selectedOrder.shipping_address2 && <><br />{selectedOrder.shipping_address2}</>}<br />
                      {selectedOrder.shipping_postal} {selectedOrder.shipping_city}<br />
                      {selectedOrder.shipping_country && getCountryName(selectedOrder.shipping_country)}
                      {selectedOrder.shipping_phone && <><br />Tél : {selectedOrder.shipping_phone}</>}
                    </p>
                  )}
                </div>
              )}
              {selectedOrder.notes && (
                <div>
                  <p className="font-semibold text-muted-foreground">Notes</p>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
              <a
                href={`https://dashboard.stripe.com/search?query=${selectedOrder.stripe_session_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-aigile-gold hover:text-book-orange"
              >
                Voir session Stripe →
              </a>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
            >
              Fermer
            </button>
          </div>
        </>
      )}

      {/* Modal Expédier */}
      {shipModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => !shipLoading && setShipModal(null)}
          />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50 bg-card border border-border rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Marquer comme expédiée</h2>
            <p className="text-sm text-muted-foreground mb-4">{shipModal.product_title} — {shipModal.buyer_name}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de suivi</label>
                <input
                  type="text"
                  value={shipTracking}
                  onChange={(e) => setShipTracking(e.target.value)}
                  placeholder="Ex: 8X12345678901"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Référence KDP</label>
                <input
                  type="text"
                  value={shipKdp}
                  onChange={(e) => setShipKdp(e.target.value)}
                  placeholder="Ex: KDP-12345"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes internes</label>
                <textarea
                  value={shipNotes}
                  onChange={(e) => setShipNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleShip}
                disabled={shipLoading}
                className="flex-1 py-2.5 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full disabled:opacity-70"
              >
                {shipLoading ? 'Envoi…' : 'Confirmer'}
              </button>
              <button
                onClick={() => !shipLoading && setShipModal(null)}
                className="px-4 py-2 border border-border rounded-full"
              >
                Annuler
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
