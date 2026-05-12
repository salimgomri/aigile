import 'server-only'

import { extractYoutubeVideoId, youtubeThumbnailMaxRes } from '@/lib/intelligence/media-metadata-shared'

const FETCH_TIMEOUT_MS = 12_000

async function fetchText(url: string): Promise<{ text: string; contentType: string } | null> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; AIgileIntelBot/1.0; +https://aigile.lu) AppleWebKit/537.36',
        Accept: 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/html',
      },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const contentType = res.headers.get('content-type') ?? ''
    const text = await res.text()
    return { text, contentType }
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

function parseItunesImageFromXml(xml: string): string | null {
  const m =
    xml.match(/<itunes:image[^>]*href=["']([^"']+)["']/i) ??
    xml.match(/<itunes:image[^>]*>\s*<[^>]*href=["']([^"']+)["']/i)
  return m?.[1]?.trim() ?? null
}

/** RSS 2.0 classique (Substack, etc.) — logo chaîne sous `<channel><image><url>`. */
function parseRssChannelImageUrl(xml: string): string | null {
  const ch = xml.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i)?.[1]
  if (!ch) return null
  const inner = ch.match(/<image[^>]*>([\s\S]*?)<\/image>/i)?.[1]
  if (!inner) return null
  const u = inner.match(/<url[^>]*>([\s\S]*?)<\/url>/i)?.[1]?.trim()
  return u ?? null
}

function parseOgImage(html: string): string | null {
  const m =
    html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ??
    html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
  return m?.[1]?.trim() ?? null
}

function parseRssHref(html: string): string | null {
  const m = html.match(
    /<link[^>]*rel=["']alternate["'][^>]*type=["']application\/rss\+xml["'][^>]*href=["']([^"']+)["']/i,
  )
  if (m?.[1]) return m[1].trim()
  const m2 = html.match(/href=["']([^"']*\.xml[^"']*)["'][^>]*type=["']application\/rss\+xml["']/i)
  return m2?.[1]?.trim() ?? null
}

function absolutize(base: string, href: string): string {
  try {
    return new URL(href, base).href
  } catch {
    return href
  }
}

/**
 * Tente de résoudre une image pour podcast / page web : flux RSS (itunes:image) ou og:image.
 */
export async function resolveFeedOrPageImage(url: string): Promise<string | null> {
  const first = await fetchText(url)
  if (!first) return null

  const { text, contentType } = first
  const isXml =
    contentType.includes('xml') ||
    contentType.includes('rss') ||
    text.trimStart().startsWith('<?xml') ||
    text.includes('<rss') ||
    text.includes('<feed')

  if (isXml) {
    const img =
      parseItunesImageFromXml(text) ??
      parseRssChannelImageUrl(text)
    return img ? absolutize(url, img) : null
  }

  const og = parseOgImage(text)
  if (og) return absolutize(url, og)

  const rssHref = parseRssHref(text)
  if (rssHref) {
    const rssUrl = absolutize(url, rssHref)
    const second = await fetchText(rssUrl)
    if (second) {
      const img = parseItunesImageFromXml(second.text)
      if (img) return absolutize(rssUrl, img)
    }
  }

  return null
}

export async function resolveIntelThumbnailUrl(href: string, urlKind: string): Promise<string | null> {
  if (urlKind === 'youtube') {
    const id = extractYoutubeVideoId(href)
    return id ? youtubeThumbnailMaxRes(id) : null
  }
  if (urlKind === 'podcast') {
    const first = await resolveFeedOrPageImage(href)
    if (first) return first
    await new Promise((r) => setTimeout(r, 2_000))
    return resolveFeedOrPageImage(href)
  }
  return null
}
