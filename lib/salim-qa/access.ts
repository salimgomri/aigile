/** Logique d'accès aux réponses — partagée client / serveur */

export type SalimQaAccessInput = {
  isLoggedIn: boolean
  creditsRemaining: number | null
  isUnlimited: boolean
  isAdmin?: boolean
}

export function hasActiveSubscription(access: SalimQaAccessInput | null): boolean {
  return !!access?.isLoggedIn && !!access?.isUnlimited
}

/** Peut débloquer une réponse (connecté + abonnement ou crédits suffisants) */
export function canUnlockAnswer(
  access: SalimQaAccessInput | null,
  cost = 1
): boolean {
  if (!access?.isLoggedIn) return false
  if (hasActiveSubscription(access)) return true
  return (access.creditsRemaining ?? 0) >= cost
}

/** Réponse complète visible : déjà débloquée, abonnement actif ou admin */
export function canReadFullAnswer(
  access: SalimQaAccessInput | null,
  isUnlocked: boolean
): boolean {
  if (access?.isAdmin) return true
  if (isUnlocked) return true
  return hasActiveSubscription(access)
}

/** Mode extrait : non connecté, pas d'abonnement, ou pas encore débloqué */
export function isExcerptMode(
  access: SalimQaAccessInput | null,
  isUnlocked: boolean
): boolean {
  return !canReadFullAnswer(access, isUnlocked)
}

/** Droits généraux de lecture (pour badge header) */
export function hasReadingEntitlement(
  access: SalimQaAccessInput | null,
  cost = 1
): boolean {
  return canUnlockAnswer(access, cost)
}
