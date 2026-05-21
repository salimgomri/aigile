import { getDashboardManagerNewBadgeLabel, isDashboardManagerNewBadgeActive } from '@/lib/tool-new-badge'

type Props = {
  language: 'fr' | 'en'
  className?: string
}

/** Pill « Nouveau / New » — affiché pendant 1 mois après lancement Dashboard Manager. */
export function DashboardManagerNewBadge({ language, className = '' }: Props) {
  if (!isDashboardManagerNewBadgeActive()) return null
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${className}`}
      style={{
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#34d399',
        border: '1px solid rgba(52, 211, 153, 0.45)',
      }}
    >
      {getDashboardManagerNewBadgeLabel(language)}
    </span>
  )
}
