import 'server-only'

import type { DimensionId } from '@/types/scoring'
import type { ScoreResult, ScoringSession } from '@/types/scoring'
import type { ScoringModel, TipsMap } from '@/lib/scoring/schema'

function tipKeysForDimension(dimId: DimensionId, tips: TipsMap): string[] {
  const p = `D${dimId.slice(1)}`
  return Object.keys(tips).filter((k) => k.startsWith(p) && /^D\dQ\d+$/.test(k))
}

export function generateMarkdownReport(
  session: Pick<ScoringSession, 'team_name' | 'sprint_number'>,
  scoreResult: ScoreResult,
  tips: TipsMap,
  model: ScoringModel
): string {
  const lines: string[] = []
  const { score_global, rag_global, blocking_rule_applied, dimension_scores, critical_flags } = scoreResult

  lines.push(`## Score global`)
  lines.push(`**${score_global.toFixed(1)}** — RAG : **${rag_global}**`)
  if (blocking_rule_applied) {
    lines.push(`⚠ **PLAFONNÉ (quality gate)**`)
  }
  lines.push('')

  lines.push(`## Dimensions`)
  lines.push(`| Dimension | Type | Score | RAG | Poids % |`)
  lines.push(`| --- | --- | --- | --- | --- |`)
  for (const ds of dimension_scores) {
    const meta = model.dimensions[ds.id]
    const scoreStr = ds.score === null ? '—' : ds.score.toFixed(1)
    lines.push(
      `| ${meta.label_fr} (${ds.id}) | ${meta.type} | ${scoreStr} | ${ds.rag} | ${ds.weight_effective.toFixed(2)} |`
    )
  }
  lines.push('')

  lines.push(`## Alertes critiques`)
  if (critical_flags.length === 0) {
    lines.push(`_Aucune alerte._`)
  } else {
    const ordered = [...critical_flags].sort((a, b) => {
      if (a === 'SECURITY_CRITICAL') return -1
      if (b === 'SECURITY_CRITICAL') return 1
      return a.localeCompare(b)
    })
    for (const f of ordered) {
      lines.push(`- **${f}**`)
    }
  }
  lines.push('')

  const greenMinGlobal = model.rag_thresholds.global.green_min
  const strengths = dimension_scores.filter(
    (ds) => ds.score !== null && ds.score >= greenMinGlobal && !ds.excluded
  )
  lines.push(`## Forces`)
  if (strengths.length === 0) {
    lines.push(`_—_`)
  } else {
    for (const ds of strengths) {
      lines.push(`- ${model.dimensions[ds.id].label_fr} (${ds.score?.toFixed(1)})`)
    }
  }
  lines.push('')

  lines.push(`## Recommandations 🔴→🟠`)
  const redDims = dimension_scores.filter((ds) => ds.rag === 'red' && !ds.excluded)
  if (redDims.length === 0) {
    lines.push(`_—_`)
  } else {
    for (const ds of redDims) {
      for (const qid of tipKeysForDimension(ds.id, tips)) {
        const t = tips[qid]?.red
        if (t) lines.push(`- **${qid}** : ${t}`)
      }
    }
  }
  lines.push('')

  lines.push(`## Recommandations 🟠→🟢`)
  const orangeDims = dimension_scores.filter((ds) => ds.rag === 'orange' && !ds.excluded)
  if (orangeDims.length === 0) {
    lines.push(`_—_`)
  } else {
    for (const ds of orangeDims) {
      for (const qid of tipKeysForDimension(ds.id, tips)) {
        const t = tips[qid]?.orange
        if (t) lines.push(`- **${qid}** : ${t}`)
      }
    }
  }
  lines.push('')

  const d8 = dimension_scores.find((d) => d.id === 'd8')
  lines.push(`## Maturité IA`)
  if (!d8 || d8.excluded || d8.score === null) {
    lines.push(`_Dimension non évaluée ou exclue._`)
  } else {
    lines.push(`Score **${d8.score.toFixed(1)}** — ${d8.rag}`)
  }

  if (session.team_name || session.sprint_number) {
    lines.push('')
    lines.push(`---`)
    if (session.team_name) lines.push(`Équipe : ${session.team_name}`)
    if (session.sprint_number) lines.push(`Sprint : ${session.sprint_number}`)
  }

  return lines.join('\n')
}
