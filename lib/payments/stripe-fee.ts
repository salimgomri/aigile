import Stripe from 'stripe'

/**
 * Récupère les frais Stripe (commission) en centimes pour une Checkout Session payée.
 * Source : BalanceTransaction.fee liée au charge du PaymentIntent.
 */
export async function fetchStripeFeeAmountCentimes(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<number | null> {
  try {
    const piRef = session.payment_intent
    const piId = typeof piRef === 'string' ? piRef : piRef?.id
    if (!piId) return null

    const pi = (await stripe.paymentIntents.retrieve(piId, {
      expand: ['latest_charge.balance_transaction'],
    })) as Stripe.PaymentIntent

    const charge = pi.latest_charge
    if (typeof charge === 'object' && charge && charge !== null) {
      const bt = charge.balance_transaction
      if (typeof bt === 'object' && bt !== null && typeof bt.fee === 'number') {
        return bt.fee
      }
      if (typeof bt === 'string') {
        const btx = await stripe.balanceTransactions.retrieve(bt)
        return typeof btx.fee === 'number' ? btx.fee : null
      }
    }

    return null
  } catch (e) {
    console.warn('[stripe-fee] fetchStripeFeeAmountCentimes', e)
    return null
  }
}
