/**
 * Email auteur — notification commande livre (KDP manuel)
 */
import { Resend } from 'resend'
import { COUNTRIES } from '@/lib/countries'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null
const AUTHOR_EMAIL = process.env.AUTHOR_EMAIL || ''
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AIgile <onboarding@resend.dev>'

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code
}

export type AuthorNotificationParams = {
  buyerName: string
  buyerEmail: string
  productId: string
  productTitle: string
  quantity?: number
  amountTotal: number
  amountShipping: number
  amountDiscount: number
  couponCode: string | null
  inPersonPickup: boolean
  shippingAddress?: {
    name: string
    address1: string
    address2?: string
    city: string
    postal: string
    country: string
    phone?: string
  }
}

export async function sendAuthorNotificationEmail(params: AuthorNotificationParams) {
  if (!resend || !AUTHOR_EMAIL) {
    console.warn('[EMAIL] AUTHOR_EMAIL or RESEND_API_KEY not set - skipping author notification')
    return
  }

  const {
    buyerName,
    buyerEmail,
    productId,
    productTitle,
    quantity = 1,
    amountTotal,
    amountShipping,
    amountDiscount,
    couponCode,
    inPersonPickup,
    shippingAddress,
  } = params

  const orderType = productId === 'book_preorder' ? 'Précommande' : 'Vente'
  const qtyLabel = quantity > 1 ? `${quantity}× ` : ''
  const countryCode = shippingAddress?.country ?? 'LU'
  const countryName = getCountryName(countryCode)
  const montantEur = formatPrice(amountTotal).replace(' €', '')

  const subject = `📦 ${orderType} — ${qtyLabel}${buyerName} — ${montantEur}€ — ${countryName}`

  let livraisonBlock: string
  if (inPersonPickup) {
    livraisonBlock = `EN MAIN PROPRE — contacter ${buyerEmail}`
  } else if (shippingAddress) {
    const a = shippingAddress
    livraisonBlock = `${a.name}
${a.address1}${a.address2 ? `\n${a.address2}` : ''}
${a.postal} ${a.city}
${getCountryName(a.country)}${a.phone ? `\nTél : ${a.phone}` : ''}`
  } else {
    livraisonBlock = 'Non renseignée'
  }

  const livraisonFormatted = livraisonBlock.split('\n').map((l) => `  ${l}`).join('\n')

  const body = `ACHETEUR
  Nom   : ${buyerName}
  Email : ${buyerEmail}

LIVRAISON
${livraisonFormatted}

PAIEMENT
  Produit     : ${quantity > 1 ? `${quantity}× ` : ''}${productTitle}
  Total payé  : ${formatPrice(amountTotal)}
  Dont livr.  : ${formatPrice(amountShipping)}
  Réduction   : ${formatPrice(amountDiscount)}
  Code promo  : ${couponCode || 'Aucun'}
  Type        : ${orderType}

ACTION KDP :
  1. Aller sur kdp.amazon.com > Commandes Author Copies
  2. Saisir l'adresse ci-dessus
  3. Marquer comme expédiée dans le dashboard aigile.lu/admin/orders`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: AUTHOR_EMAIL,
    replyTo: buyerEmail,
    subject,
    text: body,
  })

  if (error) console.error('[EMAIL] Author notification failed:', error)
}
