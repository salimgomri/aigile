import Link from 'next/link'
import { Flag, KeyRound, LayoutDashboard, RefreshCw, ShoppingBag } from 'lucide-react'

/**
 * Bloc réservé aux admins — rendu uniquement par le serveur (parent page),
 * jamais dans l’arbre pour les autres utilisateurs.
 */
export function AdminLandingTools() {
  const items = [
    {
      href: '/admin/orders',
      icon: ShoppingBag,
      titleFr: 'Commandes',
      titleEn: 'Orders',
      descFr: 'Achats, livres, packs crédits',
      descEn: 'Purchases, books, credit packs',
    },
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
  ]

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="mb-8 flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-muted-foreground" aria-hidden />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Administration</h3>
          <p className="text-sm text-muted-foreground">Raccourcis — même session que le tableau admin</p>
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ href, icon: Icon, titleFr, titleEn, descFr, descEn }) => (
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
