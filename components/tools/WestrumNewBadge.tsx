import { getWestrumNewBadgeLabel, isWestrumNewBadgeActive } from '@/lib/tool-new-badge'

type Props = {
  language: 'fr' | 'en'
  className?: string
}

/** Pill « Nouveau / New » — Westrum Culture Survey. */
export function WestrumNewBadge({ language, className = '' }: Props) {
  if (!isWestrumNewBadgeActive()) return null
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${className}`}
      style={{
        background: 'rgba(19, 142, 236, 0.18)',
        color: '#60a5fa',
        border: '1px solid rgba(96, 165, 250, 0.45)',
      }}
    >
      {getWestrumNewBadgeLabel(language)}
    </span>
  )
}
