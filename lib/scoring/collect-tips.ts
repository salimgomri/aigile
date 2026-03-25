import type { DimensionId, ScoreResult } from '@/types/scoring'
import type { ClientSafeModel, TipsMap } from '@/lib/scoring/schema'
import tipsJson from '@/lib/scoring/data/tips.json'

const tips = tipsJson as unknown as TipsMap

function tipKeysForDimension(dimId: DimensionId): string[] {
  const p = `D${dimId.slice(1)}`
  return Object.keys(tips).filter((k) => k.startsWith(p) && /^D\dQ\d+$/.test(k))
}

export type ActionTipRow = {
  qid: string
  text: string
  dimLabel: string
}

/** Conseils actionnables (rouge / orange) alignés sur le générateur de rapport */
export function collectActionTips(
  scoreResult: ScoreResult,
  model: ClientSafeModel
): { red: ActionTipRow[]; orange: ActionTipRow[] } {
  const red: ActionTipRow[] = []
  const orange: ActionTipRow[] = []

  const redDims = scoreResult.dimension_scores.filter((ds) => ds.rag === 'red' && !ds.excluded)
  for (const ds of redDims) {
    const label = model.dimensions[ds.id].label_fr
    for (const qid of tipKeysForDimension(ds.id)) {
      const t = tips[qid]?.red
      if (t) red.push({ qid, text: t, dimLabel: label })
    }
  }

  const orangeDims = scoreResult.dimension_scores.filter((ds) => ds.rag === 'orange' && !ds.excluded)
  for (const ds of orangeDims) {
    const label = model.dimensions[ds.id].label_fr
    for (const qid of tipKeysForDimension(ds.id)) {
      const t = tips[qid]?.orange
      if (t) orange.push({ qid, text: t, dimLabel: label })
    }
  }

  return { red, orange }
}
