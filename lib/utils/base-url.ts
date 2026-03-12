/**
 * URL de base — forcée à https://aigile.lu en production
 * pour éviter les redirections localhost derrière nginx
 */
export const PROD_BASE_URL = 'https://aigile.lu'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  if (process.env.NODE_ENV === 'production') {
    return PROD_BASE_URL
  }
  const port = process.env.PORT ?? '3010'
  return `http://localhost:${port}`
}

/** Base URL depuis une Request — en prod toujours aigile.lu */
export function getBaseUrlFromRequest(_request: Request): string {
  if (process.env.NODE_ENV === 'production') return PROD_BASE_URL
  return getBaseUrl()
}
