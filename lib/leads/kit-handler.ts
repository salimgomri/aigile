import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { sendKitWelcomeEmail, sendLeadNotifyEmail } from '@/lib/emails/kit-welcome'
import { getBaseUrl } from '@/lib/utils/base-url'
import { CONSENT_KIT_TEXT, CONSENT_NEWS_TEXT } from '@/lib/leads/kit-copy'
import { validateKitInput } from '@/lib/leads/kit-validate'
import type { KitSubscribeInput, KitSubscribeResult } from '@/lib/leads/kit-handler-types'

export { CONSENT_KIT_TEXT, CONSENT_NEWS_TEXT, validateKitInput }
export type { KitSubscribeInput, KitSubscribeResult }

export async function subscribeKit(input: KitSubscribeInput): Promise<KitSubscribeResult> {
  const invalid = validateKitInput(input)
  if (invalid) return invalid

  const email = input.email.trim().toLowerCase()
  const now = new Date().toISOString()
  const token = randomBytes(24).toString('hex')

  const { data: existing } = await supabaseAdmin
    .from('kit_subscribers')
    .select('id, unsubscribed_at, unsubscribe_token')
    .ilike('email', email)
    .maybeSingle()

  const row = {
    email,
    first_name: input.firstName?.trim() || null,
    consent_kit: true,
    consent_kit_text: CONSENT_KIT_TEXT,
    consent_kit_at: now,
    consent_news: Boolean(input.consentNews),
    consent_news_text: input.consentNews ? CONSENT_NEWS_TEXT : null,
    consent_news_at: input.consentNews ? now : null,
    source: input.source || 'kit',
    utm: input.utm || {},
    unsubscribe_token: existing?.unsubscribe_token || token,
    unsubscribed_at: null,
  }

  if (existing?.id) {
    const { error } = await supabaseAdmin.from('kit_subscribers').update(row).eq('id', existing.id)
    if (error) return { ok: false, error: "L'envoi n'a pas fonctionné. Réessayez dans un instant.", status: 500 }
  } else {
    const { error } = await supabaseAdmin.from('kit_subscribers').insert(row)
    if (error) return { ok: false, error: "L'envoi n'a pas fonctionné. Réessayez dans un instant.", status: 500 }
  }

  const unsubscribeUrl = `${getBaseUrl()}/api/leads/unsubscribe?token=${row.unsubscribe_token}`
  const provider = (process.env.NEWSLETTER_PROVIDER || 'none').toLowerCase()

  if (provider === 'none') {
    await sendKitWelcomeEmail({
      to: email,
      firstName: input.firstName,
      unsubscribeUrl,
    }).catch((err) => console.warn('[kit] J0 email failed', err))
  } else {
    await pushToNewsletterProvider({
      email,
      firstName: input.firstName,
      consentNews: Boolean(input.consentNews),
    }).catch((err) => console.warn('[kit] newsletter provider failed', err))
  }

  await sendLeadNotifyEmail({
    subject: `Inscription kit — ${email}`,
    html: `<p>${email} s'est inscrit au kit (source ${row.source}). Newsletter : ${row.consent_news ? 'oui' : 'non'}.</p>`,
  }).catch(() => {})

  return { ok: true }
}

async function pushToNewsletterProvider(params: {
  email: string
  firstName?: string
  consentNews: boolean
}): Promise<void> {
  const provider = (process.env.NEWSLETTER_PROVIDER || 'none').toLowerCase()
  const apiKey = process.env.NEWSLETTER_API_KEY
  const listId = process.env.KIT_LIST_ID
  if (!apiKey || !listId) {
    console.warn('[kit] NEWSLETTER_API_KEY ou KIT_LIST_ID manquant — [À CHOISIR par Salim]')
    return
  }
  // Les appels API réels se font uniquement si Salim a choisi un outil et fourni les clés.
  // Pas d'appel live ici sans ces variables.
  console.info('[kit] newsletter provider', { provider, listIdSet: Boolean(listId) })
  void params
  void provider
}
