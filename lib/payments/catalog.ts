/**
 * Catalogue produits centralisé — source de vérité unique pour tous les produits aigile.lu
 * Le moteur lit la config et adapte formulaire, champs requis et flux post-paiement.
 */

export type ProductType =
  | 'book_physical'
  | 'credits_pack'
  | 'subscription_monthly'
  | 'subscription_annual'
  | 'day_pass'

export type FulfillmentType = 'automatic' | 'manual_kdp' | 'stripe_subscription'

export type Product = {
  id: string
  stripePriceId: string
  type: ProductType
  title: string
  description: string
  amount: number // centimes EUR
  currency: 'eur'
  isRecurring: boolean
  requiresShipping: boolean
  shippingFee: number // centimes
  freeShippingInPerson: boolean
  fulfillmentType: FulfillmentType
}

function envPriceId(key: string): string {
  const v = process.env[key]
  return typeof v === 'string' && v ? v : ''
}

export const CATALOG: Record<string, Product> = {
  // ─── LIVRE ────────────────────────────────────────────────
  book_preorder: {
    id: 'book_preorder',
    stripePriceId: envPriceId('STRIPE_PRICE_ID_PREORDER'),
    type: 'book_physical',
    title: 'Le Système S.A.L.I.M',
    description: 'Livre physique — Précommande · Expédition à la publication',
    amount: 3500,
    currency: 'eur',
    isRecurring: false,
    requiresShipping: true,
    shippingFee: 500, // 5,00 EUR livraison mondiale
    freeShippingInPerson: true,
    fulfillmentType: 'manual_kdp',
  },

  book_sale: {
    id: 'book_sale',
    stripePriceId: envPriceId('STRIPE_PRICE_ID_SALE'),
    type: 'book_physical',
    title: 'Le Système S.A.L.I.M',
    description: 'Livre physique — Prix de vente',
    amount: 4000,
    currency: 'eur',
    isRecurring: false,
    requiresShipping: true,
    shippingFee: 500,
    freeShippingInPerson: true,
    fulfillmentType: 'manual_kdp',
  },

  // ─── ABONNEMENTS ──────────────────────────────────────────
  pro_monthly: {
    id: 'pro_monthly',
    stripePriceId: envPriceId('STRIPE_PRICE_ID_PRO_MONTHLY'),
    type: 'subscription_monthly',
    title: 'AIgile Pro — Mensuel',
    description: 'Crédits illimités · Tous les outils · Équipe illimitée',
    amount: 1999,
    currency: 'eur',
    isRecurring: true,
    requiresShipping: false,
    shippingFee: 0,
    freeShippingInPerson: false,
    fulfillmentType: 'stripe_subscription',
  },

  pro_annual: {
    id: 'pro_annual',
    stripePriceId: envPriceId('STRIPE_PRICE_ID_PRO_ANNUAL'),
    type: 'subscription_annual',
    title: 'AIgile Pro — Annuel',
    description: 'Crédits illimités · Tous les outils · Économisez 40€/an',
    amount: 19999,
    currency: 'eur',
    isRecurring: true,
    requiresShipping: false,
    shippingFee: 0,
    freeShippingInPerson: false,
    fulfillmentType: 'stripe_subscription',
  },

  // ─── DAY PASS ─────────────────────────────────────────────
  day_pass: {
    id: 'day_pass',
    stripePriceId: envPriceId('STRIPE_PRICE_ID_DAY_PASS'),
    type: 'day_pass',
    title: 'Day Pass AIgile',
    description: 'Accès illimité 24h · Tous les outils débloqués',
    amount: 999,
    currency: 'eur',
    isRecurring: false,
    requiresShipping: false,
    shippingFee: 0,
    freeShippingInPerson: false,
    fulfillmentType: 'automatic',
  },

  // ─── PACK CRÉDITS ────────────────────────────────────────
  credits_10: {
    id: 'credits_10',
    stripePriceId: envPriceId('STRIPE_PRICE_ID_CREDITS_10'),
    type: 'credits_pack',
    title: '10 Crédits AIgile',
    description: '10 générations IA ou exports PDF',
    amount: 490,
    currency: 'eur',
    isRecurring: false,
    requiresShipping: false,
    shippingFee: 0,
    freeShippingInPerson: false,
    fulfillmentType: 'automatic',
  },
}

// Rétrocompat: env vars legacy (STRIPE_*_PRICE_ID)
const LEGACY_ENV_MAP: Record<string, string> = {
  day_pass: 'STRIPE_DAY_PASS_PRICE_ID',
  pro_monthly: 'STRIPE_PRO_MONTHLY_PRICE_ID',
  pro_annual: 'STRIPE_PRO_ANNUAL_PRICE_ID',
  credits_10: 'STRIPE_PACK_CREDITS_PRICE_ID',
}

function getStripePriceId(productId: string): string {
  const p = CATALOG[productId]
  if (!p) return ''
  if (p.stripePriceId) return p.stripePriceId
  const legacy = LEGACY_ENV_MAP[productId]
  if (legacy) return envPriceId(legacy)
  return ''
}

export function getProduct(productId: string): Product | null {
  const p = CATALOG[productId]
  if (!p) return null
  const priceId = getStripePriceId(productId)
  if (!priceId) return null
  return { ...p, stripePriceId: priceId }
}

/** Produit livre actif selon la date (précommande vs vente) */
export function getCurrentBookProduct(): Product | null {
  const endStr = process.env.PREORDER_END_DATE
  const preorderEnd = endStr ? new Date(endStr) : null
  const now = new Date()
  if (preorderEnd && now < preorderEnd) {
    return getProduct('book_preorder')
  }
  return getProduct('book_sale')
}

export type CatalogProductId = keyof typeof CATALOG

/** IDs des produits disponibles au checkout (avec Stripe configuré) */
export function getAvailableProductIds(): string[] {
  return Object.keys(CATALOG).filter((id) => getStripePriceId(id))
}
