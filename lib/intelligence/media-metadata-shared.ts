/**
 * Extraction d’identifiants médias & URLs miniatures (partagé client/serveur).
 */

/** Miniature YouTube « maxres » (peut 404 sur certaines vidéos — fallback côté UI). */
export function youtubeThumbnailMaxRes(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

/** Extrait l’ID vidéo si l’URL pointe vers une vidéo. */
export function extractYoutubeVideoId(url: string): string | null {
  let u: URL
  try {
    u = new URL(url.trim())
  } catch {
    return null
  }
  const host = u.hostname.replace(/^www\./, '')
  if (!host.includes('youtube.com') && !host.includes('youtu.be')) return null

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    const id = u.pathname.replace(/^\//, '').split('/')[0]
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
  }

  if (u.pathname.startsWith('/watch')) {
    const v = u.searchParams.get('v')
    return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null
  }
  if (u.pathname.startsWith('/embed/')) {
    const id = u.pathname.slice('/embed/'.length).split('/')[0]
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
  }
  if (u.pathname.startsWith('/shorts/')) {
    const id = u.pathname.slice('/shorts/'.length).split('/')[0]
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
  }

  return null
}

export function youtubeThumbnailUrlForPageUrl(href: string): string | null {
  const id = extractYoutubeVideoId(href)
  return id ? youtubeThumbnailMaxRes(id) : null
}

/** URL canonique pour matcher les lignes feed (évite ratés trailing slash / hash). */
export function normalizeIntelUrl(href: string): string {
  try {
    const u = new URL(href.trim())
    u.hash = ''
    let out = u.href
    if (out.endsWith('/') && u.pathname !== '/') out = out.slice(0, -1)
    return out
  } catch {
    return href.trim()
  }
}

/** Favicon pour preview Web (sans og:image). DuckDuckGo renvoie une icône par défaut si le domaine est inconnu ; l’API Google s2/favicons 404 souvent côté navigateur. */
export function faviconUrlForPageUrl(href: string): string | null {
  try {
    let host = new URL(href.trim()).hostname
    if (!host) return null
    host = host.replace(/^www\./, '')
    return `https://icons.duckduckgo.com/ip3/${host}.ico`
  } catch {
    return null
  }
}
