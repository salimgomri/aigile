'use client'

import Link from 'next/link'
import type { SalimQaAccessInput } from '@/lib/salim-qa/access'
import { canUnlockWithCredits, hasFullSalimQaAccess } from '@/lib/salim-qa/access'
import type { SalimQaQuestionPublic } from '@/lib/salim-qa/types'
import { computeUnlockCost, type SalimQaUnlockScope } from '@/lib/salim-qa/unlock-scope'

const LOGIN_REDIRECT = '/login?redirect=%2Fsalim-qa'

type SalimQaUnlockActionsProps = {
  language: 'fr' | 'en'
  question: SalimQaQuestionPublic
  access: SalimQaAccessInput
  onUnlock: (scope: SalimQaUnlockScope) => void
  onRecharge: () => void
  loading?: boolean
  compact?: boolean
}

export function SalimQaUnlockActions({
  language,
  question,
  access,
  onUnlock,
  onRecharge,
  loading,
  compact,
}: SalimQaUnlockActionsProps) {
  const hasViewableFiche = question.ficheCount > 0
  const state = { answer: question.isAnswerUnlocked, fiche: question.isFicheUnlocked }
  const fullAccess = hasFullSalimQaAccess(access)

  const needAnswer = !question.canReadAnswer
  const needFiche = hasViewableFiche && !question.canReadFiche

  if (fullAccess || (!needAnswer && !needFiche)) return null

  const copy =
    language === 'fr'
      ? {
          answer: 'Dévoiler la réponse (1 crédit)',
          fiche: 'Dévoiler le schéma (1 crédit)',
          all: 'Tout dévoiler (2 crédits)',
          login: 'Se connecter',
          register: 'Créer un compte',
          recharge: 'Recharger des crédits',
        }
      : {
          answer: 'Reveal answer (1 credit)',
          fiche: 'Reveal diagram (1 credit)',
          all: 'Reveal all (2 credits)',
          login: 'Sign in',
          register: 'Create account',
          recharge: 'Top up credits',
        }

  if (!access.isLoggedIn) {
    return (
      <div className={`sq-unlock-actions${compact ? ' sq-unlock-actions--compact' : ''}`}>
        <Link href={LOGIN_REDIRECT} className="sq-btn-gold sq-unlock-btn">
          {copy.login}
        </Link>
        <Link
          href="/register?redirect=%2Fsalim-qa"
          className="sq-btn-gold sq-unlock-btn sq-unlock-btn--ghost"
        >
          {copy.register}
        </Link>
      </div>
    )
  }

  const tryUnlock = (scope: SalimQaUnlockScope) => {
    const cost = computeUnlockCost(scope, state, hasViewableFiche)
    if (cost === 0) return
    if (!canUnlockWithCredits(access, cost)) {
      onRecharge()
      return
    }
    onUnlock(scope)
  }

  const allCost = computeUnlockCost('all', state, hasViewableFiche)

  return (
    <div className={`sq-unlock-actions${compact ? ' sq-unlock-actions--compact' : ''}`}>
      {needAnswer && (
        <button type="button" className="sq-btn-gold sq-unlock-btn" disabled={loading} onClick={() => tryUnlock('answer')}>
          {copy.answer}
        </button>
      )}
      {needFiche && (
        <button type="button" className="sq-unlock-btn sq-unlock-btn--outline" disabled={loading} onClick={() => tryUnlock('fiche')}>
          {copy.fiche}
        </button>
      )}
      {needAnswer && needFiche && allCost === 2 && (
        <button type="button" className="sq-unlock-btn sq-unlock-btn--dark" disabled={loading} onClick={() => tryUnlock('all')}>
          {copy.all}
        </button>
      )}
    </div>
  )
}
