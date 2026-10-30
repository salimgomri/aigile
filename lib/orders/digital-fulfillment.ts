import type Stripe from 'stripe'
import { productFromSession, paymentStatusPaid } from '@/lib/downloads/session-guards'
import { sendDigitalDeliveryEmail } from '@/lib/emails/digital-delivery'
import { sendSalesNotifyEmail } from '@/lib/emails/kit-welcome'

export async function fulfillDigitalProductIfNeeded(session: Stripe.Checkout.Session): Promise<void> {
  if (!paymentStatusPaid(session)) return
  const product = productFromSession(session)
  if (!product || !product.fichierCle) return

  const email =
    session.customer_email ||
    session.customer_details?.email ||
    (session.metadata?.buyer_email as string | undefined)
  if (!email) return

  const firstName =
    session.customer_details?.name?.split(' ')[0] ||
    (session.metadata?.buyer_name as string | undefined) ||
    null

  await sendDigitalDeliveryEmail({
    to: email,
    firstName,
    product,
    sessionId: session.id,
  })

  await sendSalesNotifyEmail({
    subject: `Vente PDF — ${product.nom} — ${email}`,
    html: `<p>Session ${session.id}</p><p>Produit : ${product.nom}</p><p>Montant : ${(session.amount_total ?? 0) / 100} €</p><p>TVA non applicable, art. 293 B du CGI</p>`,
  }).catch(() => {})
}
