/**
 * Checkout Stripe — landing /salim (visiteur anonyme, un clic).
 * Réutilise le même modèle que create-session : book_physical, frais port 5 €, metadata orders.
 */
import Stripe from 'stripe'
import {
  buildBookPhysicalLineItem,
  buildCombinedProductTitle,
  resolveBookCatalogProduct,
} from '@/lib/payments/book-checkout-line-items'
import { getProduct } from '@/lib/payments/catalog'
import { clampStripeMetadata } from '@/lib/payments/stripe-metadata'
import { getSalimCrossSellTargetId } from '@/lib/payments/salim-cross-sell'
import { getStripeShippingCountryCodes } from '@/lib/payments/stripe-shipping-countries'
import { getBaseUrl } from '@/lib/utils/base-url'

export type SalimCheckoutProduct = 'livre' | 'fiches' | 'bundle'

const SALIM_CATALOG_IDS: Record<SalimCheckoutProduct, string> = {
  livre: 'book_sale',
  fiches: 'fiches_salim',
  bundle: 'bundle_salim',
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export async function createCheckoutSession(
  product: SalimCheckoutProduct,
  options?: { withAddon?: boolean }
): Promise<{ url: string } | { error: string }> {
  if (!stripe) {
    return { error: 'Stripe non configuré' }
  }

  const catalogId = SALIM_CATALOG_IDS[product]
  const resolvedProduct = getProduct(catalogId)
  if (!resolvedProduct) {
    return { error: 'Produit invalide ou non configuré' }
  }

  const baseUrl = getBaseUrl().replace(/\/$/, '')
  const successUrl = `${baseUrl}/salim/merci?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${baseUrl}/salim`

  const addonId =
    options?.withAddon && product !== 'bundle' ? getSalimCrossSellTargetId(catalogId) : null
  const addonProduct = addonId ? resolveBookCatalogProduct(addonId) : null

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  lineItems.push(buildBookPhysicalLineItem(resolvedProduct, catalogId, baseUrl, 1))
  if (addonProduct && addonId) {
    lineItems.push(buildBookPhysicalLineItem(addonProduct, addonId, baseUrl, 1))
  }

  if (resolvedProduct.shippingFee > 0) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Livraison mondiale' },
        unit_amount: resolvedProduct.shippingFee,
      },
      quantity: 1,
    })
  }

  const metadata = clampStripeMetadata({
    product_id: resolvedProduct.id,
    product_type: resolvedProduct.type,
    buyer_name: '',
    user_id: '',
    coupon_code: '',
    in_person_pickup: 'false',
    quantity: '1',
    checkout_source: 'salim_landing',
    ...(addonProduct && {
      addon_product_id: addonProduct.id,
      product_title: buildCombinedProductTitle(resolvedProduct, addonProduct),
    }),
  })

  const allowedCountries = getStripeShippingCountryCodes()

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      payment_intent_data: { metadata: { ...metadata } },
      shipping_address_collection: { allowed_countries: allowedCountries },
    })

    if (!checkoutSession.url) {
      return { error: 'URL de paiement indisponible' }
    }

    return { url: checkoutSession.url }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[CHECKOUT] salim createCheckoutSession error:', message, err)
    return {
      error:
        process.env.NODE_ENV === 'development'
          ? `Erreur Stripe : ${message}`
          : 'Erreur lors de la création du paiement',
    }
  }
}
