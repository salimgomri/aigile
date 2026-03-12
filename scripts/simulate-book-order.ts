/**
 * Simule un achat livre : en main propre, code promo TEST100 (0€), emails à salimdulux@gmail.com
 * Usage: npx tsx scripts/simulate-book-order.ts
 *
 * Ce script :
 * 1. Insère une commande dans orders (livre, en main propre, TEST100, 0€)
 * 2. Envoie l'email buyer confirmation à salimdulux@gmail.com
 * 3. Envoie l'email author notification (à AUTHOR_EMAIL ou salimdulux@gmail.com si non défini)
 * 4. Vérifie que l'order est bien en BDD
 */
import { config } from 'dotenv'

config({ path: '.env.local' })

// Pour ce test : author notification aussi à salimdulux si AUTHOR_EMAIL non défini
if (!process.env.AUTHOR_EMAIL) {
  process.env.AUTHOR_EMAIL = 'salimdulux@gmail.com'
}

const BUYER_EMAIL = 'salimdulux@gmail.com'
const BUYER_NAME = 'Salim'
const COUPON_CODE = 'TEST100'
const SESSION_ID = `cs_test_sim_SCRIPT_${Date.now()}`

async function main() {
  const { supabaseAdmin } = await import('../lib/supabase')
  const { getCurrentBookProduct } = await import('../lib/payments/catalog')
  const { sendBuyerConfirmationEmail, sendAuthorNotificationEmail } = await import('../lib/email')

  const product = getCurrentBookProduct()
  if (!product) {
    throw new Error('Produit livre non configuré (STRIPE_PRICE_ID_PREORDER ou STRIPE_PRICE_ID_SALE)')
  }

  // Montants : 100% off avec TEST100
  const amountSubtotal = product.amount

  const orderData = {
    stripe_session_id: SESSION_ID,
    stripe_payment_intent: null,
    stripe_subscription_id: null,
    product_id: product.id,
    product_type: product.type,
    product_title: product.title,
    buyer_email: BUYER_EMAIL,
    buyer_name: BUYER_NAME,
    user_id: null,
    amount_subtotal: amountSubtotal,
    amount_discount: amountSubtotal,
    amount_shipping: 0,
    amount_total: 0,
    currency: 'eur',
    coupon_code: COUPON_CODE,
    status: 'paid',
    in_person_pickup: true,
    shipping_fee: 0,
    shipping_name: null,
    shipping_address1: null,
    shipping_address2: null,
    shipping_city: null,
    shipping_postal: null,
    shipping_country: null,
    shipping_phone: null,
  }

  console.log('1. Insertion dans orders...')
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('orders')
    .upsert(orderData, { onConflict: 'stripe_session_id' })
    .select()
    .single()

  if (insertError) {
    throw new Error(`Insert failed: ${insertError.message}`)
  }
  console.log('   ✓ Order créé:', inserted?.id)

  console.log('2. Vérification en BDD...')
  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('stripe_session_id', SESSION_ID)
    .single()

  if (fetchError || !order) {
    throw new Error(`Vérification failed: ${fetchError?.message ?? 'order not found'}`)
  }
  console.log('   ✓ Order trouvé:', order.id, '|', order.buyer_email, '|', order.product_title)

  console.log('3. Envoi email buyer confirmation →', BUYER_EMAIL)
  await sendBuyerConfirmationEmail({
    to: BUYER_EMAIL,
    buyerName: BUYER_NAME,
    productTitle: product.title,
    productType: product.type,
    amountTotal: 0,
    amountSubtotal,
    amountDiscount: amountSubtotal,
    couponCode: COUPON_CODE,
    shipping: {
      inPersonPickup: true,
    },
  })
  console.log('   ✓ Buyer confirmation envoyé')

  const authorEmail = process.env.AUTHOR_EMAIL
  console.log('4. Envoi email author notification →', authorEmail)
  await sendAuthorNotificationEmail({
    buyerName: BUYER_NAME,
    buyerEmail: BUYER_EMAIL,
    productId: product.id,
    productTitle: product.title,
    amountTotal: 0,
    amountShipping: 0,
    amountDiscount: amountSubtotal,
    couponCode: COUPON_CODE,
    inPersonPickup: true,
  })
  console.log('   ✓ Author notification envoyé')

  console.log('')
  console.log('✅ Simulation terminée. Vérifie tes mails sur', BUYER_EMAIL)
  console.log('   Order ID:', order.id)
}

main().catch((err) => {
  console.error('Erreur:', err)
  process.exit(1)
})
