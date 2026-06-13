/** Portées de déblocage Q&A Lab */

export type SalimQaUnlockScope = 'answer' | 'fiche' | 'all'

export type SalimQaUnlockState = {
  answer: boolean
  fiche: boolean
}

export function computeUnlockCost(
  scope: SalimQaUnlockScope,
  state: SalimQaUnlockState,
  hasViewableFiche: boolean
): number {
  if (scope === 'answer') return state.answer ? 0 : 1
  if (scope === 'fiche') {
    if (!hasViewableFiche || state.fiche) return 0
    return 1
  }
  let cost = 0
  if (!state.answer) cost += 1
  if (hasViewableFiche && !state.fiche) cost += 1
  return cost
}

/** Actions crédit à consommer pour une portée (bundle si 2 d'un coup) */
export function creditActionsForScope(
  scope: SalimQaUnlockScope,
  state: SalimQaUnlockState,
  hasViewableFiche: boolean
): Array<'salim_qa_answer' | 'salim_qa_fiche' | 'salim_qa_bundle'> {
  const cost = computeUnlockCost(scope, state, hasViewableFiche)
  if (cost === 0) return []
  if (scope === 'all' && cost === 2) return ['salim_qa_bundle']
  if (scope === 'answer' || (scope === 'all' && !state.answer && (!hasViewableFiche || state.fiche))) {
    return ['salim_qa_answer']
  }
  if (scope === 'fiche' || (scope === 'all' && hasViewableFiche && !state.fiche && state.answer)) {
    return ['salim_qa_fiche']
  }
  return ['salim_qa_answer']
}

export function flagsAfterUnlock(
  scope: SalimQaUnlockScope,
  state: SalimQaUnlockState,
  hasViewableFiche: boolean
): SalimQaUnlockState {
  if (scope === 'answer') return { ...state, answer: true }
  if (scope === 'fiche') return { ...state, fiche: hasViewableFiche ? true : state.fiche }
  return {
    answer: true,
    fiche: hasViewableFiche ? true : state.fiche,
  }
}
