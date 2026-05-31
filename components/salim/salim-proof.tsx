'use client'

import { AnimateIn } from './animate-in'
import { CounterStat } from './counter-stat'
import { useInView } from '@/hooks/use-in-view'

type CounterMetric = {
  kind: 'counter'
  value: number
  label: string
  context: string
}

type FadeMetric = {
  kind: 'fade'
  display: string
  label: string
  context: string
  longValue?: boolean
}

const METRICS: (CounterMetric | FadeMetric)[] = [
  {
    kind: 'counter',
    value: 73,
    label: 'erreurs terrain nommées',
    context: 'avec diagnostic et correction',
  },
  {
    kind: 'counter',
    value: 10,
    label: 'plans d’action “dès lundi”',
    context: 'un plan concret par chapitre',
  },
  {
    kind: 'counter',
    value: 93,
    label: 'prompts IA documentés',
    context: 'utilisables dans ChatGPT, Claude ou Cursor',
  },
  {
    kind: 'fade',
    display: 'environ 30/100',
    label: 'score moyen d’un livrable (bêta Scoring Deliverable)',
    context: 'le livre explique comment doubler ce score',
    longValue: true,
  },
  {
    kind: 'counter',
    value: 6,
    label: 'cadrans RAG du dashboard manager',
    context: 'On Time, Budget, Scope, Qualité, Maturité, Bien-être',
  },
  {
    kind: 'counter',
    value: 24,
    label: 'pièges identifiés',
    context: 'les anti-patterns que personne n’ose documenter',
  },
]

export function SalimProof() {
  const { ref, inView } = useInView(0.15)

  return (
    <section ref={ref} className="metrics-section">
      <div className="metrics-grid">
        {METRICS.map((metric, index) => (
          <AnimateIn
            key={metric.label}
            as="article"
            cascadeDelay={Math.min(index, 3) * 80}
            threshold={0.15}
            fadeOnly={metric.kind === 'fade'}
            className="metric-item"
          >
            <span
              className={`metric-number${metric.kind === 'fade' && metric.longValue ? ' long-value' : ''}`}
            >
              {metric.kind === 'counter' ? (
                <CounterStat target={metric.value} active={inView} />
              ) : (
                metric.display
              )}
            </span>
            <p className="metric-label">{metric.label}</p>
            <p className="metric-context">{metric.context}</p>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
