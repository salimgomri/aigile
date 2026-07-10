'use client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      page_path: window.location.pathname,
      language: navigator.language,
      timestamp: new Date().toISOString(),
    })
  }
}

/** Pageview SPA — à appeler à chaque changement de route client. */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  const pagePath = path || window.location.pathname
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: title || document.title,
    page_location: window.location.origin + pagePath,
    language: navigator.language,
    timestamp: new Date().toISOString(),
  })
}

/** Chemins exclus du tracking pageview (bruit interne). */
export function shouldSkipGaPath(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api')
}
