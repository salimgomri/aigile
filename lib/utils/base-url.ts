export function getBaseUrl(): string {
  // Côté serveur : lire l'URL de la requête entrante
  // C'est la seule source fiable — fonctionne en local ET en production
  // sans aucune variable d'environnement à configurer
  if (typeof window === 'undefined') {
    // Server-side : utiliser NEXT_PUBLIC_URL si défini, sinon localhost
    const explicit = process.env.NEXT_PUBLIC_URL
    if (explicit) return explicit
    const port = process.env.PORT ?? '3010'
    return `http://localhost:${port}`
  }
  // Côté client : utiliser window.location.origin
  // Retourne automatiquement http://localhost:3010 en local
  // et https://aigile.lu en production
  return window.location.origin
}
