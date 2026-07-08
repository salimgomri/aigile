'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

type Props = {
  href?: string
  icon: LucideIcon
  title: ReactNode
  description: string
  ctaLabel: string
  soonLabel?: string
  disabled?: boolean
  wide?: boolean
}

export function DashboardToolTile({
  href,
  icon: Icon,
  title,
  description,
  ctaLabel,
  soonLabel,
  disabled = false,
  wide = false,
}: Props) {
  const className = `db-tool-tile${disabled ? ' db-tool-tile--disabled' : ''}${wide ? ' db-tool-tile--wide' : ''}`

  const body = (
    <>
      <div className="db-tool-tile__top">
        <span className="db-tool-tile__icon">
          <Icon size={20} strokeWidth={1.75} aria-hidden />
        </span>
        {!disabled ? <span className="db-tool-tile__live" aria-hidden /> : null}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="db-tool-tile__footer">
        {disabled ? (
          <span className="db-tool-tile__soon">{soonLabel}</span>
        ) : (
          <span className="db-tool-tile__cta">
            {ctaLabel}
            <ArrowRight size={14} aria-hidden />
          </span>
        )}
      </div>
    </>
  )

  if (disabled || !href) {
    return <div className={className}>{body}</div>
  }

  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  )
}
