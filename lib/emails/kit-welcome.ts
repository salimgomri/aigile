import { Resend } from 'resend'
import { getBaseUrl } from '@/lib/utils/base-url'
import { getContactEmail, getKitPdfUrl, yearsOfExperience } from '@/lib/site-facts'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AIgile <onboarding@resend.dev>'

export async function sendKitWelcomeEmail(params: {
  to: string
  firstName?: string | null
  unsubscribeUrl: string
}): Promise<void> {
  if (!resend) {
    console.warn('[kit] RESEND_API_KEY absent — e-mail J0 non envoyé')
    return
  }

  const greeting = params.firstName?.trim() ? `Bonjour ${params.firstName.trim()},` : 'Bonjour,'
  const pdfUrl = getKitPdfUrl().startsWith('http')
    ? getKitPdfUrl()
    : `${getBaseUrl()}${getKitPdfUrl()}`
  const years = yearsOfExperience()
  const contact = getContactEmail()

  const html = `<!DOCTYPE html>
<html lang="fr"><body style="margin:0;padding:0;background:#f4f4f4;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;"><tr><td align="center">
<table width="600" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;">
<tr><td style="background:#0f2240;padding:28px 40px;text-align:center;">
<span style="font-size:26px;font-weight:800;color:#FEBD10;">AIgile</span>
</td></tr>
<tr><td style="padding:32px 40px;color:#0f2240;">
<p>${greeting}</p>
<p>Merci pour votre demande. Voici votre kit :</p>
<p><a href="${pdfUrl}" style="display:inline-block;background:#FEBD10;color:#0f2240;font-weight:700;padding:12px 22px;border-radius:999px;text-decoration:none;">Télécharger le kit « 5 signaux » (PDF)</a></p>
<p>Mon conseil pour en tirer le maximum :</p>
<ol>
<li>Remplissez l'auto-diagnostic (page 5) en pensant à vos <strong>3 derniers sprints</strong>.</li>
<li>Demandez à 2 ou 3 personnes de votre équipe de le remplir de leur côté.</li>
<li>Comparez. Les écarts de perception sont souvent aussi instructifs que les notes.</li>
</ol>
<p>Gardez en tête : <em>L'IA propose, l'humain décide.</em></p>
<p>Salim<br/><em>Coach agile depuis 2003 (${years} ans de terrain), auteur du Système S.A.L.I.M.</em></p>
</td></tr>
<tr><td style="padding:20px 40px;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;">
Vous recevez cet e-mail parce que vous avez demandé le kit « 5 signaux » sur aigile.lu.
<a href="${params.unsubscribeUrl}">Se désinscrire en un clic</a> ·
<a href="${getBaseUrl()}/privacy">Politique de confidentialité</a><br/>
Salim GOMRI EI (GO-COACH) · AIgile.lu · 50 Grand'Rue, 57280 Maizières-lès-Metz, France
${contact.includes('@') ? `<br/>Contact : ${contact}` : ''}
</td></tr>
</table></td></tr></table>
</body></html>`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: 'Votre kit « 5 signaux » est là',
    html,
  })
}

export async function sendLeadNotifyEmail(params: {
  subject: string
  html: string
}): Promise<void> {
  if (!resend) return
  const to = process.env.LEADS_NOTIFY_EMAIL?.trim() || process.env.AUTHOR_EMAIL?.trim()
  if (!to) {
    console.warn('[leads] LEADS_NOTIFY_EMAIL absent')
    return
  }
  await resend.emails.send({ from: FROM_EMAIL, to, subject: params.subject, html: params.html })
}

export async function sendSalesNotifyEmail(params: {
  subject: string
  html: string
}): Promise<void> {
  if (!resend) return
  const to = process.env.SALES_NOTIFY_EMAIL?.trim() || process.env.AUTHOR_EMAIL?.trim()
  if (!to) return
  await resend.emails.send({ from: FROM_EMAIL, to, subject: params.subject, html: params.html })
}
