/**
 * Email sending via Resend
 * Used for: verification, welcome, password reset
 */
import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AIgile <onboarding@resend.dev>'

export async function sendVerificationEmail(params: {
  to: string
  url: string
  userName?: string
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping verification email. URL:', params.url)
    return
  }

  const { to, url, userName } = params
  const greeting = userName ? `Bonjour ${userName},` : 'Bonjour,'

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Bienvenue sur AIgile — Validez votre email',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c9973a;">Bienvenue sur AIgile</h2>
        <p>${greeting}</p>
        <p>Merci de vous être inscrit sur <strong>aigile.lu</strong>. Pour activer votre compte et accéder à tous les outils Agile augmentés, veuillez valider votre adresse email en cliquant sur le lien ci-dessous :</p>
        <p style="margin: 24px 0;">
          <a href="${url}" style="background: #c9973a; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Valider mon email</a>
        </p>
        <p style="color: #666; font-size: 14px;">Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">AIgile — Scrum Augmenté par l'IA · aigile.lu</p>
      </div>
    `,
  })

  if (error) {
    console.error('[EMAIL] Verification send failed:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(params: { to: string; url: string }) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set - skipping password reset. URL:', params.url)
    return
  }

  const { to, url } = params

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Réinitialisation de votre mot de passe AIgile',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c9973a;">Réinitialisation du mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour en définir un nouveau :</p>
        <p style="margin: 24px 0;">
          <a href="${url}" style="background: #c9973a; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Réinitialiser mon mot de passe</a>
        </p>
        <p style="color: #666; font-size: 14px;">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">AIgile · aigile.lu</p>
      </div>
    `,
  })

  if (error) {
    console.error('[EMAIL] Password reset send failed:', error)
    throw error
  }
}
