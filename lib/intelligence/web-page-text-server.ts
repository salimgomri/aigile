import 'server-only'

function stripHtmlToText(html: string): string {
  return html
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Retire le bruit courant avant extraction du texte « lisible ». */
function stripStructuralNoise(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<aside\b[\s\S]*?<\/aside>/gi, ' ')
}

/**
 * Extrait le meilleur texte visible façon innerText : priorité <main>, sinon <body> épuré.
 * Les pages « index » (listes de liens) restent utiles : tout le texte des <a> et du corps est conservé.
 */
export function htmlToBestPlainText(rawHtml: string): string {
  const cleaned = stripStructuralNoise(rawHtml)

  const bodyMatch = cleaned.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)
  const bodyHtml = bodyMatch?.[1] ?? cleaned

  const headerStrip = bodyHtml.replace(/<header\b[\s\S]*?<\/header>/gi, ' ')

  const mainMatch = headerStrip.match(/<main\b[^>]*>([\s\S]*)<\/main>/i)
  const mainHtml = mainMatch?.[1]

  const tMain = mainHtml ? stripHtmlToText(mainHtml) : ''
  const tBody = stripHtmlToText(headerStrip)

  const best = tMain.length >= tBody.length ? tMain : tBody
  return best.trim()
}

function stripCdata(raw: string): string {
  return raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, (_, inner: string) => inner)
}

function extractInnerTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = block.match(re)
  if (!m) return null
  const inner = stripCdata(m[1]).replace(/\s+/g, ' ').trim()
  return inner.length > 0 ? inner : null
}

function extractContentEncoded(block: string): string | null {
  const m = block.match(/<content:encoded(?:\s[^>]*)?>([\s\S]*?)<\/content:encoded>/i)
  if (!m) return null
  return stripCdata(m[1]).trim()
}

function isLikelyRssDocument(raw: string, contentType: string): boolean {
  const ct = contentType.toLowerCase()
  if (/rss\+xml|atom\+xml|application\/xml|text\/xml/.test(ct)) {
    return /<rss\b/i.test(raw) || /<feed\b/i.test(raw)
  }
  const trimmed = raw.trimStart().slice(0, 800)
  return /<rss\b/i.test(trimmed) || /<rss\b/i.test(raw)
}

/** Concatène les entrées récentes d’un flux RSS 2.0 (ex. Substack) en texte lisible pour Intelligence. */
export function rss2DigestPlainText(xml: string): { channelTitle: string | null; text: string } {
  const channelMatch = xml.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i)
  const channelInner = channelMatch?.[1] ?? ''

  let channelTitle: string | null = null
  if (channelInner) {
    const tm = channelInner.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i)
    if (tm) channelTitle = stripCdata(tm[1]).replace(/\s+/g, ' ').trim() || null
  }

  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi
  const chunks: string[] = []
  const MAX_ITEMS = 35
  const MAX_ARTICLE_CHARS = 10_000

  let im: RegExpExecArray | null
  let n = 0
  while ((im = itemRe.exec(xml)) !== null && n < MAX_ITEMS) {
    n++
    const block = im[1] ?? ''
    const itemTitle = extractInnerTag(block, 'title')
    const link = extractInnerTag(block, 'link')
    const pub = extractInnerTag(block, 'pubDate')
    const desc = extractInnerTag(block, 'description')
    const enc = extractContentEncoded(block)
    const mergedHtml = enc || desc || ''
    const plain =
      mergedHtml.length > 0 ? htmlToBestPlainText(`<body>${mergedHtml}</body>`) : ''

    const headerLines = [itemTitle ? `# ${itemTitle}` : null, pub, link].filter((x): x is string =>
      Boolean(x && x.trim().length > 0),
    )
    const head =
      headerLines.length > 0 ? headerLines.join('\n') : '(sans titre)'

    chunks.push(`${head}\n\n${plain.slice(0, MAX_ARTICLE_CHARS)}\n\n---\n`)
  }

  const rule = channelTitle?.length ? `${channelTitle}\n${'─'.repeat(Math.min(channelTitle.length, 72))}\n\n` : ''
  const text = `${rule}${chunks.join('\n')}`.trim()
  return { channelTitle, text }
}

const MIN_USEFUL_CHARS = 80

/** Extraction HTML → texte brut pour Intelligence (sans cheerio). */
export async function fetchWebPagePlainText(url: string): Promise<{
  title: string | null
  text: string
  error?: string
}> {
  try {
    const u = new URL(url.trim())
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return { title: null, text: '', error: 'Protocole non supporté' }
    }

    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 22_000)
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AIgileIntelBot/1.2 (+https://aigile.lu)',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.95,text/xml;q=0.95,application/rss+xml;q=0.95,*/*;q=0.75',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8',
      },
    })
    clearTimeout(t)

    if (!res.ok) {
      return { title: null, text: '', error: `HTTP ${res.status}` }
    }

    const ct = res.headers.get('content-type') ?? ''
    const raw = await res.text()

    if (isLikelyRssDocument(raw, ct)) {
      const { channelTitle, text: rssText } = rss2DigestPlainText(raw)
      if (rssText.length >= MIN_USEFUL_CHARS) {
        return { title: channelTitle, text: rssText.slice(0, 120_000) }
      }
    }

    if (raw.length < 80 && !/<!DOCTYPE|<html|<article|<body/i.test(raw.slice(0, 4000))) {
      if (/pdf|octet-stream|application\/pdf/i.test(ct)) {
        return { title: null, text: '', error: 'Fichier binaire (PDF, etc.) — ouvrir l’URL.' }
      }
    }

    const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleMatch?.[1]?.replace(/\s+/g, ' ')?.trim() ?? null

    let text = htmlToBestPlainText(raw).slice(0, 120_000)

    if (text.length < MIN_USEFUL_CHARS) {
      const ogDesc =
        raw.match(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1]?.trim() ??
        raw.match(/content=["']([^"']+)["'][^>]*property=["']og:description["']/i)?.[1]?.trim() ??
        raw.match(/name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1]?.trim() ??
        null

      const metaAugmented = [text, title, ogDesc].filter((x) => (x ?? '').trim().length > 0).join('\n\n').trim()

      if (metaAugmented.length >= MIN_USEFUL_CHARS) {
        return { title, text: metaAugmented.slice(0, 120_000) }
      }

      return {
        title,
        text: text.length > 0 ? text : '',
        error: `[intel-fetch] Texte brut trop court (${text.length} car.) après extraction corps/meta — la page est peut-être protégée (bot), vide, ou en SPA sans HTML.`,
      }
    }

    return { title, text }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { title: null, text: '', error: msg.slice(0, 240) }
  }
}
