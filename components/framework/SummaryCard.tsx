'use client'

import { useState } from 'react'
import { IconBadge } from './framework-icons'

type SummaryCardProps = {
  eyebrow: string
  title: string
  index?: string
  icon?: string
  children: React.ReactNode
}

export function SummaryCard({ eyebrow, title, children, index, icon }: SummaryCardProps) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${hover ? 'var(--aigile-gold)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        minHeight: 200,
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transition:
          'transform var(--duration-base) var(--ease-out-premium), box-shadow var(--duration-base) var(--ease-out-premium), border-color var(--duration-fast) linear',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        {icon ? <IconBadge icon={icon} tone="gold" size={40} /> : <div />}
        {index != null && (
          <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'var(--text-small)', color: 'var(--text-faint)' }}>
            {index}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span
          style={{
            fontSize: 'var(--text-micro)',
            fontWeight: 'var(--weight-semibold)',
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          {eyebrow}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: 'var(--text-h3)',
            fontWeight: 'var(--weight-medium)',
            color: 'var(--text-body)',
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>
      <p
        style={{
          fontSize: 'var(--text-body-size)',
          lineHeight: 'var(--leading-relaxed)',
          color: 'var(--text-muted)',
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  )
}
