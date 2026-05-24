'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Target, Brain } from 'lucide-react'

type Props = {
  teamId: string
  teamName: string
}

const links = (teamId: string) => [
  {
    href: '/dashboard-manager/studio',
    label: 'Dashboard',
    icon: LayoutDashboard,
    match: (p: string) => p.startsWith('/dashboard-manager'),
  },
  {
    href: `/dashboard/${teamId}/checkin`,
    label: 'OKR Check-in',
    icon: Target,
    match: (p: string) => p.includes('/checkin'),
  },
  {
    href: '/retro',
    label: 'Rétro IA',
    icon: Brain,
    match: (p: string) => p.startsWith('/retro'),
  },
]

export function TeamSidebar({ teamId, teamName }: Props) {
  const pathname = usePathname() ?? ''
  const items = links(teamId)

  return (
    <aside className="w-full shrink-0 border-b border-gray-200 bg-[#0f2240] text-white md:w-56 md:border-b-0 md:border-r lg:w-64">
      <div className="px-4 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c9973a]">Équipe</p>
        <p className="mt-1 truncate text-sm font-bold">{teamName}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:px-3 md:pb-6">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-[#138eec] text-white'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
