/**
 * Price IDs Stripe — landing /salim (optionnels).
 *
 * Si une variable est vide, le checkout utilise price_data + montants du catalogue
 * (lib/payments/catalog.ts). Voir docs/salim-landing.md.
 */
export const STRIPE_PRICES = {
  LIVRE_SALIM: process.env.PRICE_LIVRE_SALIM ?? process.env.STRIPE_PRICE_ID_SALE ?? '',
  FICHES_SALIM: process.env.PRICE_FICHES_SALIM ?? '',
  BUNDLE_SALIM: process.env.PRICE_BUNDLE_SALIM ?? '',
} as const
