/**
 * Email acheteur universel — s'adapte au type de produit
 */
import { Resend } from 'resend'
import { COUNTRIES } from '@/lib/countries'
import { getBaseUrl } from '@/lib/utils/base-url'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AIgile <onboarding@resend.dev>'

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

function getSubject(productType: string, productTitle: string): string {
  switch (productType) {
    case 'book_physical':
      return `✓ Ta commande est confirmée — ${productTitle}`
    case 'day_pass':
      return '⚡ Ton Day Pass AIgile est actif — 24h illimitées'
    case 'subscription_monthly':
    case 'subscription_annual':
      return '✦ Bienvenue dans AIgile Pro !'
    case 'credits_pack':
      return '⚡ Tes crédits AIgile ont été ajoutés'
    default:
      return `Confirmation de commande — ${productTitle}`
  }
}

function getMessageByType(productType: string, productTitle: string, amountTotal: number): string {
  const total = formatPrice(amountTotal)
  switch (productType) {
    case 'book_physical':
      return `Ta commande de <strong>${productTitle}</strong> est confirmée pour un montant de ${total}.`
    case 'day_pass':
      return `Ton Day Pass AIgile est actif ! Tu as accès illimité à tous les outils pendant 24h. Montant : ${total}.`
    case 'subscription_monthly':
    case 'subscription_annual':
      return `Bienvenue dans AIgile Pro ! Tu as maintenant accès à tous les outils et crédits illimités. Montant : ${total}.`
    case 'credits_pack':
      return `Tes crédits AIgile ont été ajoutés à ton compte. Montant : ${total}.`
    default:
      return `Ta commande de <strong>${productTitle}</strong> est confirmée pour un montant de ${total}.`
  }
}

export type BuyerConfirmationParams = {
  to: string
  buyerName: string
  productTitle: string
  productType: string
  amountTotal: number
  amountSubtotal?: number
  amountDiscount?: number
  couponCode?: string | null
  /** Bloc livraison — pour book_physical */
  shipping?: {
    inPersonPickup: boolean
    address?: {
      name: string
      address1: string
      address2?: string
      city: string
      postal: string
      country: string
      phone?: string
    }
  }
}

export async function sendBuyerConfirmationEmail(params: BuyerConfirmationParams) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping buyer confirmation')
    return
  }

  const {
    to,
    buyerName,
    productTitle,
    productType,
    amountTotal,
    amountSubtotal,
    amountDiscount = 0,
    couponCode,
    shipping,
  } = params

  const displayAmount = amountDiscount > 0 ? (amountSubtotal ?? amountTotal + amountDiscount) : amountTotal

  const subject = getSubject(productType, productTitle)
  const message = getMessageByType(productType, productTitle, amountTotal)

  const isBook = productType === 'book_physical'
  const isDigital = ['day_pass', 'credits_pack', 'subscription_monthly', 'subscription_annual'].includes(productType)

  let livraisonBlock = ''
  if (isBook && shipping) {
    if (shipping.inPersonPickup) {
      livraisonBlock = `
        <div style="margin:24px 0;padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #c9973a;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f2240;">LIVRAISON</p>
          <p style="margin:0;font-size:14px;color:#334155;">En main propre — Salim te contactera pour convenir d'un rendez-vous.</p>
        </div>`
    } else if (shipping.address) {
      const addr = shipping.address
      const countryName = COUNTRIES.find((c) => c.code === addr.country)?.name ?? addr.country
      livraisonBlock = `
        <div style="margin:24px 0;padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #c9973a;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f2240;">LIVRAISON</p>
          <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">
            ${addr.name}<br>
            ${addr.address1}${addr.address2 ? `<br>${addr.address2}` : ''}<br>
            ${addr.postal} ${addr.city}<br>
            ${countryName}${addr.phone ? `<br>Tél : ${addr.phone}` : ''}
          </p>
          <p style="margin:12px 0 0;font-size:13px;color:#64748b;">Expédition sous 7–10 jours après publication.</p>
        </div>`
    }
  }

  const recapRows: string[] = [
    `<tr><td style="padding:8px 0;font-size:14px;color:#334155;">${productTitle}</td><td style="padding:8px 0;font-size:14px;color:#0f2240;text-align:right;">${formatPrice(displayAmount)}</td></tr>`,
  ]
  if (amountDiscount > 0) {
    recapRows.push(
      `<tr><td style="padding:8px 0;font-size:14px;color:#334155;">Réduction${couponCode ? ` (${couponCode})` : ''}</td><td style="padding:8px 0;font-size:14px;color:#22c55e;text-align:right;">-${formatPrice(amountDiscount)}</td></tr>`,
      `<tr><td style="padding:8px 0;font-size:14px;font-weight:600;color:#0f2240;">Total</td><td style="padding:8px 0;font-size:14px;font-weight:600;color:#0f2240;text-align:right;">${formatPrice(amountTotal)}</td></tr>`
    )
  }

  const baseUrl = getBaseUrl()
  let accesBlock = ''
  if (isDigital) {
    accesBlock = `
      <div style="margin:24px 0;text-align:center;">
        <a href="${baseUrl}/dashboard" style="display:inline-block;background:#c9973a;color:#0f2240;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:9999px;">
          Accéder à AIgile →
        </a>
      </div>`
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#0f2240;padding:28px 40px;text-align:center;">
          <span style="font-size:26px;font-weight:800;"><span style="color:#c9973a;">AI</span><span style="color:#fff;">gile</span></span>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.55);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Scrum Augmenté par l'IA</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Bonjour ${buyerName},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#334155;line-height:1.6;">${message}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
            ${recapRows.join('')}
          </table>
          ${livraisonBlock}
          ${accesBlock}
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center;font-size:11px;color:#94a3b8;">
          AIgile — <a href="${baseUrl}" style="color:#94a3b8;">aigile.lu</a><br>
          <a href="mailto:edition.malis@gmail.com" style="color:#94a3b8;">edition.malis@gmail.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  })

  if (error) console.error('[EMAIL] Buyer confirmation failed:', error)
}
