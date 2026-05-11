import 'server-only'

export type CollectorExportPayload = {
  doctrine: string
  /** Texte complet type « Copier pour GPT » */
  body: string
  lang: 'fr' | 'en'
}

function truncateSlack(s: string, max = 39_000): string {
  if (s.length <= max) return s
  return `${s.slice(0, max - 20)}\n…(truncated)`
}

export async function postCollectorExportWebhook(
  payload: CollectorExportPayload,
): Promise<{ ok: boolean; errors: string[] }> {
  const errors: string[] = []
  const zenUrl = process.env.INTEL_EXPORT_WEBHOOK_URL?.trim()
  const slackUrl = process.env.INTEL_SLACK_WEBHOOK_URL?.trim()

  if (!zenUrl && !slackUrl) {
    return {
      ok: false,
      errors: ['Configurer INTEL_EXPORT_WEBHOOK_URL et/ou INTEL_SLACK_WEBHOOK_URL sur le serveur.'],
    }
  }

  const envelope = {
    source: 'aigile-intelligence-collector',
    sentAt: new Date().toISOString(),
    doctrine: payload.doctrine,
    body: payload.body,
    lang: payload.lang,
  }

  if (zenUrl) {
    try {
      const res = await fetch(zenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envelope),
        signal: AbortSignal.timeout(28_000),
      })
      if (!res.ok) errors.push(`Webhook Zapier/Make : HTTP ${res.status}`)
    } catch (e) {
      errors.push(e instanceof Error ? e.message : 'Webhook indisponible')
    }
  }

  if (slackUrl) {
    const header = payload.lang === 'fr' ? '*Doctrine du jour*' : '*Daily doctrine*'
    const text = truncateSlack(`${header}\n${payload.doctrine}\n\n---\n${payload.body}`)
    try {
      const res = await fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(28_000),
      })
      if (!res.ok) errors.push(`Slack : HTTP ${res.status}`)
    } catch (e) {
      errors.push(e instanceof Error ? e.message : 'Slack webhook indisponible')
    }
  }

  return { ok: errors.length === 0, errors }
}
