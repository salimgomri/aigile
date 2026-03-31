'use client'

import { useEffect, useState } from 'react'
import { Package, Zap, Sparkles, Target, Search, BarChart3 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { COUNTRIES } from '@/lib/countries'

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

const TOOL_LABELS: Record<string, string> = {
  retro: 'Rétro',
  dora: 'DORA',
  okr: 'OKR',
  'skill-matrix': 'Skill Matrix',
  dashboard: 'Dashboard',
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
  /** Frais Stripe (commission) en centimes */
  stripe_fee_amount?: number | null
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

type MacroStats = {
  toolUsage: Array<{ tool_slug: string; total_uses: number; total_credits_spent: number; unique_users: number }>
  purchases: {
    totalBuyers: number
    totalOrders: number
    totalBooks: number
    totalCreditsPacks: number
    totalProMonthly: number
    totalProAnnual: number
    totalDayPasses: number
    totalRevenueCentimes: number
  }
  recentUsage: Array<{
    user_email: string
    user_name: string
    tool_slug: string
    action_slug: string
    credits_cost: number
    created_at: string
  }>
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [macroStats, setMacroStats] = useState<MacroStats | null>(null)
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
  /** Par défaut : masquer les commandes avec code promo test (TEST100). */
  const [includeInternalTest, setIncludeInternalTest] = useState(false)
  /** Sous-chaîne sur le code promo ; « __none__ » = sans code uniquement. */
  const [filterCoupon, setFilterCoupon] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterType) params.set('product_type', filterType)
    if (filterStatus) params.set('status', filterStatus)
    if (filterCountry) params.set('country', filterCountry)
    if (filterPeriod) params.set('period', filterPeriod)
    if (filterSearch) params.set('search', filterSearch)
    if (includeInternalTest) params.set('include_internal_test', '1')
    if (filterCoupon.trim()) params.set('coupon', filterCoupon.trim())
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
  }, [filterType, filterStatus, filterCountry, filterPeriod, filterSearch, includeInternalTest, filterCoupon])

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => !d.error && setMacroStats(d))
      .catch(() => {})
  }, [])

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

      {/* Vue macro */}
      {macroStats && (
        <div className="mb-8 p-6 rounded-xl border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-aigile-gold" />
            Vue macro
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Achats : hors commandes avec le code promo test TEST100 (usage interne).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xl font-bold text-foreground">{formatPrice(macroStats.purchases.totalRevenueCentimes)}</p>
              <p className="text-xs text-muted-foreground">Revenus totaux</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xl font-bold text-foreground">{macroStats.purchases.totalBuyers}</p>
              <p className="text-xs text-muted-foreground">Acheteurs uniques</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xl font-bold text-foreground">{macroStats.purchases.totalBooks}</p>
              <p className="text-xs text-muted-foreground">Livres vendus</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xl font-bold text-foreground">{macroStats.purchases.totalProAnnual + macroStats.purchases.totalProMonthly}</p>
              <p className="text-xs text-muted-foreground">Abos Pro</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xl font-bold text-foreground">
                {macroStats.toolUsage.reduce((s, t) => s + t.total_uses, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Usages outils</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xl font-bold text-foreground">
                {macroStats.toolUsage.reduce((s, t) => s + t.total_credits_spent, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Crédits consommés</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Usage par outil</p>
              <div className="space-y-2">
                {macroStats.toolUsage.map((t) => (
                  <div key={t.tool_slug} className="flex justify-between items-center text-sm">
                    <span>{TOOL_LABELS[t.tool_slug] ?? t.tool_slug}</span>
                    <span className="text-foreground font-medium">
                      {t.total_uses} uses · {t.unique_users} users · {t.total_credits_spent} cr.
                    </span>
                  </div>
                ))}
                {macroStats.toolUsage.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun usage enregistré</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Activité récente</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {macroStats.recentUsage.slice(0, 8).map((u, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="truncate max-w-[140px]" title={u.user_email}>
                      {u.user_name || u.user_email?.split('@')[0] || '—'}
                    </span>
                    <span className="text-muted-foreground shrink-0 ml-2">
                      {TOOL_LABELS[u.tool_slug] ?? u.tool_slug} · {format(new Date(u.created_at), 'd MMM HH:mm', { locale: fr })}
                    </span>
                  </div>
                ))}
                {macroStats.recentUsage.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune activité</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
        <input
          type="text"
          placeholder="Code promo (filtre)"
          value={filterCoupon}
          onChange={(e) => setFilterCoupon(e.target.value)}
          title="Sous-chaîne sur le code ; taper __none__ pour les commandes sans code promo"
          className="px-3 py-2 bg-background border border-border rounded-lg text-foreground w-44 min-w-[10rem]"
        />
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={includeInternalTest}
            onChange={(e) => setIncludeInternalTest(e.target.checked)}
            className="rounded border-border"
          />
          Inclure TEST100
        </label>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-2 text-xs text-muted-foreground">
          {!includeInternalTest && !filterCoupon.trim() && (
            <span>Stats et liste : hors commandes avec code promo test TEST100.</span>
          )}
          {!includeInternalTest && filterCoupon.trim() && (
            <span>TEST100 exclu ; filtre promo : « {filterCoupon} ».</span>
          )}
          {includeInternalTest && <span>Toutes les commandes visibles (y compris TEST100).</span>}
        </div>
      )}
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
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Frais Stripe</th>
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
                    {order.stripe_fee_amount != null ? formatPrice(order.stripe_fee_amount) : '—'}
                  </td>
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
              <div>
                <p className="font-semibold text-muted-foreground">Paiement</p>
                <p>Montant TTC : {formatPrice(selectedOrder.amount_total)}</p>
                <p>
                  Frais Stripe (commission) :{' '}
                  {selectedOrder.stripe_fee_amount != null
                    ? formatPrice(selectedOrder.stripe_fee_amount)
                    : '—'}
                </p>
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
