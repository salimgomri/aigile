import { Resend } from 'resend'
import { getBaseUrl } from '@/lib/utils/base-url'
import { getSupportEmail, VAT_MENTION } from '@/lib/site-facts'
import type { DigitalProduct } from '@/lib/products'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AIgile <onboarding@resend.dev>'

export async function sendDigitalDeliveryEmail(params: {
  to: string
  firstName?: string | null
  product: DigitalProduct
  sessionId: string
}): Promise<void> {
  if (!resend) {
    console.warn('[telechargement] RESEND_API_KEY absent')
    return
  }
  const url = `${getBaseUrl()}/telechargement?session_id=${encodeURIComponent(params.sessionId)}`
  const support = getSupportEmail()
  const greeting = params.firstName?.trim() ? `Bonjour ${params.firstName.trim()},` : 'Bonjour,'

  const html = `<!DOCTYPE html>
<html lang="fr"><body style="font-family:sans-serif;color:#0f2240;">
<p>${greeting}</p>
<p>Votre paiement pour <strong>${params.product.nom}</strong> est confirmé.</p>
<p><a href="${url}" style="background:#FEBD10;color:#0f2240;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:700;">Accéder au téléchargement</a></p>
<p>En demandant l'accès immédiat au contenu numérique, vous avez reconnu perdre votre droit de rétractation dès le début du téléchargement (support durable).</p>
<p>${VAT_MENTION}</p>
<p>Votre reçu arrive par e-mail (Stripe). Support : ${support}</p>
</body></html>`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Votre téléchargement — ${params.product.nom}`,
    html,
  })
}
