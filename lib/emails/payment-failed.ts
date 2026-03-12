/**
 * Email relance paiement échoué — abonnement Pro
 */
import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AIgile <onboarding@resend.dev>'

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

export async function sendPaymentFailedEmail(params: {
  to: string
  amount: number
  portalUrl: string
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping payment failed email')
    return
  }

  const { to, amount, portalUrl } = params
  const total = formatPrice(amount)

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#0f2240;padding:28px 40px;text-align:center;">
          <span style="font-size:26px;font-weight:800;"><span style="color:#c9973a;">AI</span><span style="color:#fff;">gile</span></span>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Ton paiement de <strong>${total}</strong> pour ton abonnement AIgile Pro n'a pas pu être traité.</p>
          <p style="margin:0 0 24px;font-size:14px;color:#334155;">Mets à jour ta carte bancaire pour conserver l'accès Pro. Sans mise à jour sous 3 jours, ton compte passera en Free.</p>
          <p style="text-align:center;"><a href="${portalUrl}" style="display:inline-block;background:#c9973a;color:#0f2240;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:6px;">Mettre à jour ma carte →</a></p>
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center;font-size:11px;color:#94a3b8;">AIgile — Scrum Augmenté par l'IA · aigile.lu</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: '⚠️ Paiement échoué — Ton abonnement AIgile Pro',
    html,
  })

  if (error) console.error('[EMAIL] Payment failed send failed:', error)
}
