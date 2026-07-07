'use client'

import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  CheckSquare,
  Compass,
  Flag,
  Frame,
  Hammer,
  Inbox,
  Rocket,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  User,
  Users,
  UsersRound,
  XCircle,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  'triangle-alert': AlertTriangle,
  compass: Compass,
  scale: Scale,
  inbox: Inbox,
  frame: Frame,
  search: Search,
  'check-circle': CheckCircle,
  hammer: Hammer,
  flag: Flag,
  'x-circle': XCircle,
  'check-square': CheckSquare,
  rocket: Rocket,
  user: User,
  users: Users,
  shield: Shield,
  'shield-check': ShieldCheck,
  'users-round': UsersRound,
  bot: Bot,
}

export function FrameworkIcon({
  name,
  size = 20,
  className,
  style,
}: {
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  const Icon = ICON_MAP[name] ?? Compass
  return <Icon size={size} strokeWidth={2} className={className} style={style} aria-hidden />
}

export function IconBadge({
  icon,
  tone = 'gold',
  size = 36,
  shape = 'square',
}: {
  icon: string
  tone?: 'gold' | 'solid'
  size?: number
  shape?: 'square' | 'circle'
}) {
  const bg =
    tone === 'gold' ? 'var(--aigile-gold-dim)' : tone === 'solid' ? 'var(--aigile-gold)' : 'var(--surface-page)'
  const color = tone === 'solid' ? 'var(--accent-ink)' : 'var(--accent-hover)'

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? 'var(--radius-full)' : 'var(--radius-md)',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: tone === 'gold' ? '1px solid rgba(254, 219, 16, 0.25)' : 'none',
      }}
    >
      <FrameworkIcon name={icon} size={Math.round(size * 0.48)} style={{ color }} />
    </div>
  )
}
