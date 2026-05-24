/** Badge « Nouveau » — Dashboard Manager, visible 1 mois après mise en ligne. */
export const DASHBOARD_MANAGER_NEW_UNTIL_ISO = '2026-06-22T22:59:59.000Z'

/** Badge « Nouveau » — Westrum Culture Survey. */
export const WESTRUM_NEW_UNTIL_ISO = '2026-06-22T22:59:59.000Z'

export function isDashboardManagerNewBadgeActive(
  until = new Date(DASHBOARD_MANAGER_NEW_UNTIL_ISO)
): boolean {
  return Date.now() < until.getTime()
}

export function isWestrumNewBadgeActive(until = new Date(WESTRUM_NEW_UNTIL_ISO)): boolean {
  return Date.now() < until.getTime()
}

export function getDashboardManagerNewBadgeLabel(lang: 'fr' | 'en'): string {
  return lang === 'fr' ? 'Nouveau' : 'New'
}

export function getWestrumNewBadgeLabel(lang: 'fr' | 'en'): string {
  return lang === 'fr' ? 'Nouveau' : 'New'
}
