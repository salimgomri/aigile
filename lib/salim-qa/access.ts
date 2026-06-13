/** Logique d'accès aux réponses / fiches — partagée client / serveur */

import type { SalimQaUnlockState } from './unlock-scope'

export type SalimQaAccessInput = {
  isLoggedIn: boolean
  creditsRemaining: number | null
  isUnlimited: boolean
  isAdmin?: boolean
}

export function hasActiveSubscription(access: SalimQaAccessInput | null): boolean {
  return !!access?.isLoggedIn && !!access?.isUnlimited
}

export function hasFullSalimQaAccess(access: SalimQaAccessInput | null): boolean {
  return !!access?.isAdmin || hasActiveSubscription(access)
}

/** Peut débloquer (connecté + abonnement/admin ou crédits suffisants) */
export function canUnlockWithCredits(
  access: SalimQaAccessInput | null,
  cost = 1
): boolean {
  if (!access?.isLoggedIn) return false
  if (hasFullSalimQaAccess(access)) return true
  return (access.creditsRemaining ?? 0) >= cost
}

/** @deprecated alias */
export function canUnlockAnswer(access: SalimQaAccessInput | null, cost = 1): boolean {
  return canUnlockWithCredits(access, cost)
}

export function canReadAnswer(
  access: SalimQaAccessInput | null,
  unlock: SalimQaUnlockState
): boolean {
  if (hasFullSalimQaAccess(access)) return true
  return unlock.answer
}

export function canReadFiche(
  access: SalimQaAccessInput | null,
  unlock: SalimQaUnlockState,
  hasViewableFiche: boolean
): boolean {
  if (!hasViewableFiche) return false
  if (hasFullSalimQaAccess(access)) return true
  return unlock.fiche
}

/** @deprecated use canReadAnswer */
export function canReadFullAnswer(
  access: SalimQaAccessInput | null,
  isUnlocked: boolean
): boolean {
  return canReadAnswer(access, { answer: isUnlocked, fiche: false })
}

export function isExcerptMode(
  access: SalimQaAccessInput | null,
  unlock: SalimQaUnlockState
): boolean {
  return !canReadAnswer(access, unlock)
}

export function hasReadingEntitlement(
  access: SalimQaAccessInput | null,
  cost = 1
): boolean {
  return canUnlockWithCredits(access, cost)
}
