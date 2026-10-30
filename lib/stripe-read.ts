import Stripe from 'stripe'

/**
 * Client Stripe lecture seule pour téléchargement + admin ventes/liens.
 * Préfère STRIPE_RESTRICTED_KEY ; repli STRIPE_SECRET_KEY en local/test.
 * Jamais exposé au client.
 */
export function getStripeReadClient(): Stripe | null {
  const key = process.env.STRIPE_RESTRICTED_KEY?.trim() || process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key)
}

export function getStripeSecretClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key)
}
