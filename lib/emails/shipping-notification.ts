/**
 * Email acheteur — livre expédié avec numéro de suivi
 */
import { Resend } from 'resend'
import { getBaseUrl } from '@/lib/utils/base-url'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AIgile <onboarding@resend.dev>'

export async function sendShippingNotificationEmail(params: {
  to: string
  buyerName: string
  productTitle: string
  trackingNumber: string
  carrier?: string
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping shipping notification')
    return
  }

  const { to, buyerName, productTitle, trackingNumber, carrier = 'Colissimo' } = params
  const baseUrl = getBaseUrl()

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
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Bonjour ${buyerName},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#334155;line-height:1.6;">
            Ta commande de <strong>${productTitle}</strong> a été expédiée !
          </p>
          <div style="padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #22c55e;">
            <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f2240;">Suivi</p>
            <p style="margin:0;font-size:14px;color:#334155;">
              ${carrier} : <strong>${trackingNumber}</strong>
            </p>
          </div>
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center;font-size:11px;color:#94a3b8;">
          AIgile — <a href="${baseUrl}" style="color:#94a3b8;">aigile.lu</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✓ ${productTitle} — Expédié`,
    html,
  })

  if (error) console.error('[EMAIL] Shipping notification failed:', error)
}
