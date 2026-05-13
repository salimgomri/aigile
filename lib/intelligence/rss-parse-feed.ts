import { htmlToBestPlainText } from '@/lib/intelligence/web-page-text-server'

export type ParsedFeedItem = {
  title: string
  link: string
  publishedAt: Date | null
  summaryText: string
  guid?: string
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

export function parseRfc822Date(raw: string | null | undefined): Date | null {
  if (!raw?.trim()) return null
  const t = Date.parse(raw.trim())
  if (!Number.isFinite(t)) return null
  return new Date(t)
}

/** Premier lien dans un bloc <item> (RSS 2.0 peut avoir plusieurs balises link). */
function extractFirstLinkFromItem(block: string): string | null {
  const m = block.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i)
  if (!m) return null
  const href = stripCdata(m[1]).trim()
  return href.length > 0 ? href : null
}

function extractGuid(block: string): string | null {
  const m = block.match(/<guid(?:\s[^>]*)?>([\s\S]*?)<\/guid>/i)
  if (!m) return null
  return stripCdata(m[1]).trim() || null
}

/** Items RSS 2.0 */
export function parseRss2ChannelItems(xml: string): ParsedFeedItem[] {
  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi
  const out: ParsedFeedItem[] = []
  let im: RegExpExecArray | null
  while ((im = itemRe.exec(xml)) !== null) {
    const block = im[1] ?? ''
    const title = extractInnerTag(block, 'title') ?? '(sans titre)'
    const link = extractFirstLinkFromItem(block) ?? ''
    const pubRaw = extractInnerTag(block, 'pubDate')
    const publishedAt = parseRfc822Date(pubRaw)
    const desc = extractInnerTag(block, 'description')
    const enc = extractContentEncoded(block)
    const html = enc || desc || ''
    const summaryText =
      html.length > 0 ? htmlToBestPlainText(`<body>${html}</body>`).slice(0, 2000) : ''
    const guid = extractGuid(block) ?? undefined
    if (link.length > 0) {
      out.push({ title, link, publishedAt, summaryText, guid })
    }
  }
  return out
}

/** Entrées Atom 1.0 (minimal). */
export function parseAtomFeedEntries(xml: string): ParsedFeedItem[] {
  const entryRe = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi
  const out: ParsedFeedItem[] = []
  let em: RegExpExecArray | null
  while ((em = entryRe.exec(xml)) !== null) {
    const block = em[1] ?? ''
    const title = extractInnerTag(block, 'title') ?? '(sans titre)'
    let link = ''
    const linkHref =
      block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i)?.[1] ??
      block.match(/<link[^>/]*href=["']([^"']+)["']/i)?.[1]
    if (linkHref) link = linkHref.trim()
    const pubRaw =
      extractInnerTag(block, 'published') ??
      extractInnerTag(block, 'updated') ??
      extractInnerTag(block, 'publishedDate')
    const publishedAt = pubRaw ? parseRfc822Date(pubRaw) || new Date(pubRaw) : null
    const summaryInner =
      extractInnerTag(block, 'summary') ?? extractInnerTag(block, 'content') ?? ''
    const summaryText =
      summaryInner.length > 0 ? htmlToBestPlainText(`<body>${summaryInner}</body>`).slice(0, 2000) : ''
    if (link.length > 0) {
      out.push({ title, link, publishedAt, summaryText })
    }
  }
  return out
}

export function parseFeedXmlItems(xml: string): ParsedFeedItem[] {
  if (/<rss\b/i.test(xml)) return parseRss2ChannelItems(xml)
  if (/<feed\b[^>]*xmlns=["']http:\/\/www\.w3\.org\/2005\/Atom["']/i.test(xml) || /<feed\b/i.test(xml))
    return parseAtomFeedEntries(xml)
  return []
}
