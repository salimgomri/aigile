import Link from 'next/link'
import { Flag, KeyRound, LayoutDashboard, RefreshCw, ShoppingBag } from 'lucide-react'
import type { LandingCommerceSummary } from '@/lib/admin/landing-commerce-summary'
import { AdminIntelligenceToolCard } from '@/components/admin/admin-intelligence-tool-card'

function currencyFr(centimes: number) {
  return new Intl.NumberFormat('fr-LU', { style: 'currency', currency: 'EUR' }).format(centimes / 100)
}

function currencyEn(centimes: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(centimes / 100)
}

function OrdersCommerceCard({
  commerce,
}: {
  commerce: LandingCommerceSummary
}) {
  const netCentimes = Math.max(0, commerce.grossRevenueCentimes - commerce.stripeFeesKnownCentimes)
  const staleFees = commerce.ordersMissingStripeFeeCount > 0

  return (
    <li key="/admin/orders">
      <Link
        href="/admin/orders"
        className="group flex h-full flex-col rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-aigile-gold/40 hover:bg-card"
      >
        <ShoppingBag className="mb-3 h-8 w-8 text-aigile-gold/90" aria-hidden />
        <span className="font-semibold text-foreground">Commandes</span>
        <span className="text-xs text-muted-foreground" lang="en">
          Orders
        </span>
        <span className="mt-2 text-sm text-muted-foreground">Achats, livres, packs crédits</span>
        <span className="text-xs text-muted-foreground/80" lang="en">
          Purchases, books, credit packs
        </span>

        <div className="mt-4 rounded-xl border border-aigile-gold/20 bg-muted/30 px-3 py-2.5">
          <div className="text-2xl font-bold tracking-tight text-foreground">{commerce.booksSold}</div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-book-orange">
            livres vendus · <span lang="en">books sold</span>
          </p>
        </div>

        <dl className="mt-4 space-y-2 border-t border-border/70 pt-3 text-xs leading-snug">
          <p className="mb-1 text-[10px] text-muted-foreground/90">
            Synthèse tous produits (hors TEST100) · <span lang="en">All SKUs excl. TEST100</span>
          </p>
          <div>
            <dt className="font-medium text-foreground">Revenus encaissés (brut)</dt>
            <dd className="text-muted-foreground">
              {currencyFr(commerce.grossRevenueCentimes)} · <span lang="en">{currencyEn(commerce.grossRevenueCentimes)} gross</span>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Commissions Stripe{staleFees ? ' (renseignées)' : ''}</dt>
            <dd className="text-muted-foreground">
              −{currencyFr(commerce.stripeFeesKnownCentimes)} ·{' '}
              <span lang="en">−{currencyEn(commerce.stripeFeesKnownCentimes)} Stripe</span>
            </dd>
          </div>
          <div className="rounded-lg bg-book-orange/5 px-2 py-1.5">
            <dt className="font-semibold text-foreground">Montant net (après frais Stripe)</dt>
            <dd className="text-base font-bold text-book-orange">{currencyFr(netCentimes)}</dd>
            <dd className="text-muted-foreground/90">
              <span lang="en">Net after Stripe · {currencyEn(netCentimes)}</span>
            </dd>
          </div>
          {staleFees && (
            <p className="text-[10px] text-amber-800/90 dark:text-amber-300/95">
              {commerce.ordersMissingStripeFeeCount} vente(s) sans commission en base · run{' '}
              <span lang="en">Stripe sync · recent payouts</span>
            </p>
          )}
        </dl>
      </Link>
    </li>
  )
}

const OTHER_ITEMS = [
  {
    href: '/admin/feature-flags',
    icon: Flag,
    titleFr: 'Feature flags',
    titleEn: 'Feature flags',
    descFr: 'Lancements et accès outils',
    descEn: 'Launches and tool access',
  },
  {
    href: '/admin/access',
    icon: KeyRound,
    titleFr: 'Accès & promos',
    titleEn: 'Access & promos',
    descFr: 'Invitations, early access, crédits promo',
    descEn: 'Invites, early access, promo credits',
  },
  {
    href: '/admin/stripe-sync',
    icon: RefreshCw,
    titleFr: 'Sync Stripe',
    titleEn: 'Stripe sync',
    descFr: 'Importer les paiements Stripe vers les commandes (sans doublon)',
    descEn: 'Backfill Stripe payments into orders (no duplicates)',
  },
] as const

/**
 * Bloc réservé aux admins — rendu uniquement par le serveur (parent page).
 */
export function AdminLandingTools({ commerce }: { commerce: LandingCommerceSummary }) {
  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="mb-8 flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-muted-foreground" aria-hidden />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Administration</h3>
          <p className="text-sm text-muted-foreground">
            Raccourcis · Totaux hors codes promo test · <span lang="en">Excl. test promo codes · paid/shipped/fulfilled</span>
          </p>
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OrdersCommerceCard commerce={commerce} />
        <AdminIntelligenceToolCard />
        {OTHER_ITEMS.map(({ href, icon: Icon, titleFr, titleEn, descFr, descEn }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-aigile-gold/40 hover:bg-card"
            >
              <Icon className="mb-3 h-8 w-8 text-aigile-gold/90" aria-hidden />
              <span className="font-semibold text-foreground">{titleFr}</span>
              <span className="text-xs text-muted-foreground" lang="en">
                {titleEn}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">{descFr}</span>
              <span className="text-xs text-muted-foreground/80" lang="en">
                {descEn}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
