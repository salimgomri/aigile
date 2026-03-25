/**
 * Email sending via Resend
 * Template transactionnel AIgile — vérification email, mot de passe
 */
import { Resend } from 'resend'
import { getBaseUrl } from '@/lib/utils/base-url'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AIgile <onboarding@resend.dev>'

type Locale = 'fr' | 'en'

const CONTENT = {
  verification: {
    fr: {
      subject: 'Validez votre email AIgile',
      greeting: (name?: string) => (name ? `Bonjour ${name},` : 'Bonjour,'),
      body: 'Merci de rejoindre AIgile. Cliquez sur le bouton ci-dessous pour valider votre adresse email et accéder à votre espace.',
      ctaLabel: 'Valider mon email',
      footerNote: 'Ce lien expire dans 24 heures.',
    },
    en: {
      subject: 'Verify your AIgile email',
      greeting: (name?: string) => (name ? `Hi ${name},` : 'Hi,'),
      body: 'Thanks for joining AIgile. Click the button below to verify your email address and access your account.',
      ctaLabel: 'Verify my email',
      footerNote: 'This link expires in 24 hours.',
    },
  },
  password: {
    fr: {
      subject: 'Définissez votre mot de passe AIgile',
      greeting: (name?: string) => (name ? `Bonjour ${name},` : 'Bonjour,'),
      body: 'Pour finaliser votre accès à AIgile, définissez votre mot de passe en cliquant sur le bouton ci-dessous.',
      ctaLabel: 'Définir mon mot de passe',
      footerNote: 'Ce lien expire dans 1 heure. Pour des raisons de sécurité, ne partagez pas ce lien.',
    },
    en: {
      subject: 'Set your AIgile password',
      greeting: (name?: string) => (name ? `Hi ${name},` : 'Hi,'),
      body: 'To complete your AIgile setup, set your password by clicking the button below.',
      ctaLabel: 'Set my password',
      footerNote: 'This link expires in 1 hour. For security reasons, do not share this link.',
    },
  },
} as const

function getEmailTemplate(params: {
  greeting: string
  body: string
  ctaUrl: string
  ctaLabel: string
  footerNote: string
  lang?: Locale
}) {
  const { greeting, body, ctaUrl, ctaLabel, footerNote } = params
  const baseUrl = getBaseUrl()
  const antiSpam = params.lang === 'en'
    ? 'If you did not initiate this action, please ignore this email.'
    : 'Si vous n\'êtes pas à l\'origine de cette action, ignorez cet email.'

  return `<!DOCTYPE html>
<html lang="${params.lang || 'fr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AIgile</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#0f2240;padding:28px 40px;text-align:center;">
              <span style="font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                <span style="color:#c9973a;">AI</span><span style="color:#ffffff;">gile</span>
              </span>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.55);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">
                Scrum Augmenté par l'IA
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px 40px 24px;">
              <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;line-height:1.6;">
                ${greeting}
              </p>
              <div style="font-size:15px;color:#334155;line-height:1.7;">
                ${body}
              </div>
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td style="padding:8px 40px 36px;text-align:center;">
              <a href="${ctaUrl}"
                 style="display:inline-block;background-color:#c9973a;color:#0f2240;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:6px;letter-spacing:0.02em;">
                ${ctaLabel}
              </a>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">
                ${footerNote}
              </p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">
                <strong style="color:#c9973a;">AIgile</strong>
                — Scrum Augmenté par l'IA ·
                <a href="${baseUrl}" style="color:#94a3b8;text-decoration:none;">aigile.lu</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- Anti-spam note -->
        <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;text-align:center;">
          ${antiSpam}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendVerificationEmail(params: {
  to: string
  url: string
  userName?: string
  locale?: Locale
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping verification email. URL:', params.url)
    return
  }

  const { to, url, userName, locale = 'fr' } = params
  const c = CONTENT.verification[locale]

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: c.subject,
    html: getEmailTemplate({
      greeting: c.greeting(userName),
      body: c.body,
      ctaUrl: url,
      ctaLabel: c.ctaLabel,
      footerNote: c.footerNote,
      lang: locale,
    }),
  })

  if (error) {
    console.error('[EMAIL] Verification send failed:', error)
    // Ne pas throw pour éviter unhandledRejection — l'inscription reste valide
  }
}

export async function sendPasswordResetEmail(params: {
  to: string
  url: string
  userName?: string
  locale?: Locale
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping password reset. URL:', params.url)
    return
  }

  const { to, url, userName, locale = 'fr' } = params
  const c = CONTENT.password[locale]

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: c.subject,
    html: getEmailTemplate({
      greeting: c.greeting(userName),
      body: c.body,
      ctaUrl: url,
      ctaLabel: c.ctaLabel,
      footerNote: c.footerNote,
      lang: locale,
    }),
  })

  if (error) {
    console.error('[EMAIL] Password reset send failed:', error)
  }
}

const FEEDBACK_TO = 'salimdulux@gmail.com'

export async function sendFeedbackEmail(params: {
  message: string
  pageUrl?: string | null
  userEmail?: string | null
  userName?: string | null
  deviceType?: string | null
  ipAddress?: string | null
  country?: string | null
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping feedback email')
    return
  }

  const { message, pageUrl, userEmail, userName, deviceType, ipAddress, country } = params
  const from = FROM_EMAIL

  const meta: string[] = []
  if (pageUrl) meta.push(`Page: ${pageUrl}`)
  if (userEmail) meta.push(`De: ${userName || 'Anonyme'} <${userEmail}>`)
  else meta.push(`Utilisateur: ${userName || 'Anonyme'}`)
  if (deviceType) meta.push(`Appareil: ${deviceType}`)
  if (ipAddress) meta.push(`IP: ${ipAddress}`)
  if (country) meta.push(`Pays: ${country}`)

  const body = `
Nouveau feedback AIgile
${'─'.repeat(40)}

Message:
${message}

${meta.join('\n')}
  `.trim()

  const { error } = await resend.emails.send({
    from,
    to: FEEDBACK_TO,
    replyTo: userEmail || undefined,
    subject: `[AIgile] Feedback${userName ? ` - ${userName}` : ''}`,
    text: body,
  })

  if (error) {
    console.error('[EMAIL] Feedback send failed:', error)
    throw error
  }
}

const CONTENT_INVITE = {
  fr: {
    subject: (inviter: string, team: string) => `${inviter} t'invite à rejoindre l'équipe ${team} sur AIgile`,
    greeting: (inviter: string, team: string) => `${inviter} t'a invité(e) à rejoindre ${team} sur aigile.lu`,
    roleLabel: 'Ton rôle :',
    ctaLabel: 'Rejoindre l\'équipe',
    expiresNote: 'Ce lien expire dans 72h.',
    footerNote: 'Tu reçois cet email car quelqu\'un a saisi ton adresse.',
  },
  en: {
    subject: (inviter: string, team: string) => `${inviter} invites you to join ${team} on AIgile`,
    greeting: (inviter: string, team: string) => `${inviter} has invited you to join ${team} on aigile.lu`,
    roleLabel: 'Your role:',
    ctaLabel: 'Join the team',
    expiresNote: 'This link expires in 72 hours.',
    footerNote: 'You received this email because someone entered your address.',
  },
} as const

export async function sendInvitationEmail(params: {
  to: string
  url: string
  inviterName: string
  teamName: string
  role: string
  locale?: Locale
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping invitation. URL:', params.url)
    return
  }

  const { to, url, inviterName, teamName, role, locale = 'fr' } = params
  const c = CONTENT_INVITE[locale]

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#0f2240;padding:28px 40px;text-align:center;">
          <span style="font-size:26px;font-weight:800;"><span style="color:#c9973a;">AI</span><span style="color:#fff;">gile</span></span>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">${c.greeting(inviterName, teamName)}</p>
          <p style="margin:0 0 24px;font-size:14px;color:#334155;"><strong>${c.roleLabel}</strong> ${role}</p>
          <p style="text-align:center;"><a href="${url}" style="display:inline-block;background:#c9973a;color:#0f2240;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:6px;">${c.ctaLabel}</a></p>
          <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">${c.expiresNote}</p>
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center;font-size:11px;color:#94a3b8;">${c.footerNote}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: c.subject(inviterName, teamName),
    html,
  })

  if (error) console.error('[EMAIL] Invitation send failed:', error)
}

/** Notification utilisateur : ajouté à la liste d’invités d’un outil (admin /admin/access) */
export async function sendToolAccessInviteEmail(params: {
  to: string
  toolLabelFr: string
  toolPath: string
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping tool access invite email')
    return
  }
  const url = `${getBaseUrl()}${params.toolPath.startsWith('/') ? params.toolPath : `/${params.toolPath}`}`
  const subject = `Accès ${params.toolLabelFr} — AIgile`
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
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Bonjour,</p>
          <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
            Votre adresse a été ajoutée à la liste d’accès pour <strong>${escapeHtml(params.toolLabelFr)}</strong> sur AIgile.
            Connectez-vous avec <strong>cet email</strong> pour utiliser l’outil lorsque l’accès sur invitation est actif (après la date de lancement).
          </p>
          <p style="text-align:center;margin:28px 0 0;">
            <a href="${url}" style="display:inline-block;background:#c9973a;color:#0f2240;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:6px;">Ouvrir l’outil</a>
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center;font-size:11px;color:#94a3b8;">
          aigile.lu — Si vous n’attendiez pas cet accès, vous pouvez ignorer cet email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject,
    html,
  })
  if (error) console.error('[EMAIL] Tool access invite send failed:', error)
}

/** Notification utilisateur : promo crédits illimités par outil (admin) */
export async function sendToolCreditPromoEmail(params: {
  to: string
  toolLabelFr: string
  toolPath: string
  expiresAtISO: string
  earlyAdopter: boolean
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping tool credit promo email')
    return
  }
  const url = `${getBaseUrl()}${params.toolPath.startsWith('/') ? params.toolPath : `/${params.toolPath}`}`
  const exp = new Date(params.expiresAtISO)
  const expStr = Number.isNaN(exp.getTime()) ? params.expiresAtISO : exp.toLocaleString('fr-FR')
  const ea = params.earlyAdopter
    ? '<p style="margin:16px 0 0;font-size:14px;color:#c9973a;"><strong>Early adopter</strong> : offres mises en avant dans l’app.</p>'
    : ''
  const subject = `Promo crédits — ${params.toolLabelFr} — AIgile`
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
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Bonjour,</p>
          <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
            Une <strong>promo crédits illimités</strong> sur <strong>${escapeHtml(params.toolLabelFr)}</strong> est active pour votre compte
            (même adresse email), jusqu’au <strong>${escapeHtml(expStr)}</strong>.
          </p>
          ${ea}
          <p style="text-align:center;margin:28px 0 0;">
            <a href="${url}" style="display:inline-block;background:#c9973a;color:#0f2240;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:6px;">Accéder à l’outil</a>
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center;font-size:11px;color:#94a3b8;">
          aigile.lu
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject,
    html,
  })
  if (error) console.error('[EMAIL] Tool credit promo send failed:', error)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export { sendAuthorNotificationEmail } from '@/lib/emails/author-notification'
export { sendBuyerConfirmationEmail } from '@/lib/emails/buyer-confirmation'
export { sendPaymentFailedEmail } from '@/lib/emails/payment-failed'
