'use client'

import { useState } from 'react'
import { IconBadge } from './framework-icons'

export function PhaseCard({
  index,
  name,
  who,
  children,
  icon,
}: {
  index: string
  name: string
  who: string
  children: React.ReactNode
  icon: string
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-5) 0', borderTop: '1px solid var(--border-default)' }}
    >
      <IconBadge icon={icon} tone={hover ? 'solid' : 'gold'} size={44} />
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'var(--text-small)', color: 'var(--accent-hover)' }}>{index}</span>
          <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'var(--text-h3)', margin: 0, color: 'var(--text-body)' }}>{name}</h3>
          <span style={{ fontSize: 'var(--text-micro)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-faint)' }}>{who}</span>
        </div>
        <p style={{ fontSize: 'var(--text-body-size)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)', margin: '6px 0 0' }}>{children}</p>
      </div>
    </div>
  )
}

export function RoleCard({ name, children, icon }: { name: string; children: React.ReactNode; icon: string }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${hover ? 'var(--aigile-gold)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'flex',
        gap: 'var(--space-3)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transition:
          'transform var(--duration-base) var(--ease-out-premium), box-shadow var(--duration-base) var(--ease-out-premium), border-color var(--duration-fast) linear',
      }}
    >
      <IconBadge icon={icon} tone="gold" size={38} />
      <div>
        <h4 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'var(--text-body-lg)', margin: '0 0 8px', color: 'var(--text-body)' }}>{name}</h4>
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>{children}</p>
      </div>
    </div>
  )
}
