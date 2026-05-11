import 'server-only'

function stripHtmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Extraction légère HTML → texte brut pour analyse Intelligence (pas de cheerio en prod). */
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
    const t = setTimeout(() => ctrl.abort(), 18_000)
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIgileIntelBot/1.1; +https://aigile.lu)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })
    clearTimeout(t)

    if (!res.ok) {
      return { title: null, text: '', error: `HTTP ${res.status}` }
    }

    const ct = res.headers.get('content-type') ?? ''
    const raw = await res.text()

    if (raw.length < 80 && !/<!DOCTYPE|<html|<article/i.test(raw.slice(0, 2000))) {
      if (/pdf|octet-stream|application\/pdf/i.test(ct)) {
        return { title: null, text: '', error: 'Fichier binaire (PDF, etc.) — ouvrir l’URL.' }
      }
    }
    const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleMatch?.[1]?.replace(/\s+/g, ' ')?.trim() ?? null
    const ogDesc =
      raw.match(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1]?.trim() ??
      raw.match(/name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1]?.trim() ??
      null

    const body = stripHtmlToText(raw)
    const text = body.slice(0, 120_000)

    if (text.length < 120) {
      const fallback = [title, ogDesc].filter(Boolean).join('\n\n').trim()
      if (fallback.length >= 40) {
        return { title, text: fallback.slice(0, 80_000) }
      }
      return {
        title,
        text: '',
        error: 'Page peu lisible en texte brut — ouvrir le lien source.',
      }
    }

    return { title, text }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { title: null, text: '', error: msg.slice(0, 240) }
  }
}
