/**
 * CallMeBot WhatsApp — notifications admin (optionnel).
 * Variables : CALLMEBOT_PHONE (ex. 33612345678), CALLMEBOT_APIKEY
 * https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
const WHATSAPP_API = 'https://api.callmebot.com/whatsapp.php'
const MAX_TEXT = 3500

export type CallMeBotResult = { ok: true; skipped?: boolean } | { ok: false; error: string }

export async function sendCallMeBotWhatsApp(text: string): Promise<CallMeBotResult> {
  const phone = process.env.CALLMEBOT_PHONE?.trim()
  const apikey = process.env.CALLMEBOT_APIKEY?.trim()
  if (!phone || !apikey) {
    return { ok: true, skipped: true }
  }

  const safe = text.slice(0, MAX_TEXT)
  const url = new URL(WHATSAPP_API)
  url.searchParams.set('phone', phone.replace(/^\+/, ''))
  url.searchParams.set('text', safe)
  url.searchParams.set('apikey', apikey)

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
    })
    const body = await res.text()
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}: ${body.slice(0, 300)}` }
    }
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}

export async function notifyEarlyAccessRequest(params: {
  email: string
  toolSlug: string
  message: string | null
}): Promise<CallMeBotResult> {
  const parts = [
    '🆕 *AIgile* — nouvelle demande early access',
    `*Outil:* ${params.toolSlug}`,
    `*Email:* ${params.email}`,
  ]
  if (params.message) {
    parts.push(`*Message:* ${params.message.slice(0, 800)}`)
  }
  return sendCallMeBotWhatsApp(parts.join('\n'))
}
