import type { DimensionId, ScoreResult } from '@/types/scoring'
import type { ClientSafeModel, QuestionDef, TipsMap } from '@/lib/scoring/schema'
import { ALL_DIMS, getPerQuestionRAG } from '@/lib/scoring/engine'
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

/**
 * Conseils actionnables (rouge / orange) : une seule entrée par question dont le RAG **item**
 * est rouge ou orange (pas toute la liste tips d’une dimension en difficulté).
 */
export function collectActionTips(
  scoreResult: ScoreResult,
  model: ClientSafeModel,
  answersByQuestionId: Record<string, string>,
  activeQuestions: Pick<QuestionDef, 'id' | 'dimension' | 'scale_id'>[]
): { red: ActionTipRow[]; orange: ActionTipRow[] } {
  const red: ActionTipRow[] = []
  const orange: ActionTipRow[] = []

  const qById = new Map(activeQuestions.map((q) => [q.id, q]))

  for (const dimId of ALL_DIMS) {
    const ds = scoreResult.dimension_scores.find((d) => d.id === dimId)
    if (!ds || ds.excluded) continue

    const label = model.dimensions[dimId].label_fr
    for (const qid of tipKeysForDimension(dimId)) {
      if (!qById.has(qid)) continue
      const qRag = getPerQuestionRAG(qid, answersByQuestionId, activeQuestions, model)
      if (qRag === 'red') {
        const t = tips[qid]?.red
        if (t) red.push({ qid, text: t, dimLabel: label })
      } else if (qRag === 'orange') {
        const t = tips[qid]?.orange
        if (t) orange.push({ qid, text: t, dimLabel: label })
      }
    }
  }

  return { red, orange }
}
