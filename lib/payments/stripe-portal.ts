/**
 * Création de session portail Stripe pour gérer l'abonnement
 */
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { getBaseUrl } from '@/lib/utils/base-url'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export async function createStripePortalUrl(userId: string, returnPath = '/settings/team'): Promise<string> {
  if (!stripe) throw new Error('Stripe non configuré')

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
  if (!customerId) {
    throw new Error('Aucun client Stripe pour cet utilisateur')
  }

  const baseUrl = getBaseUrl()
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}${returnPath}`,
  })

  return session.url ?? `${baseUrl}${returnPath}`
}
