/**
 * Création de session portail Stripe pour gérer l'abonnement
 */
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { getBaseUrl } from '@/lib/utils/base-url'
import { isAdminUserId } from '@/lib/admin'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export async function createStripePortalUrl(
  userId: string,
  returnPath = '/settings/team',
  baseUrl?: string
): Promise<string> {
  if (!stripe) throw new Error('Stripe non configuré')

  const base = baseUrl ?? getBaseUrl()

  const { data: credits } = await supabaseAdmin
    .from('user_credits')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('user_id', userId)
    .single()

  let customerId = credits?.stripe_customer_id
  if (!customerId && credits?.stripe_subscription_id && stripe) {
    const sub = await stripe.subscriptions.retrieve(credits.stripe_subscription_id)
    customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id ?? null
    if (customerId) {
      await supabaseAdmin.from('user_credits').update({ stripe_customer_id: customerId }).eq('user_id', userId)
    }
  }
  // Admin sans customer Stripe : utilise un customer "demo" pour prévisualiser le portail Pro
  if (!customerId && (await isAdminUserId(userId))) {
    customerId = process.env.STRIPE_ADMIN_PORTAL_CUSTOMER_ID || null
  }
  if (!customerId) {
    throw new Error('Aucun client Stripe pour cet utilisateur')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${base}${returnPath}`,
  })

  return session.url ?? `${base}${returnPath}`
}
