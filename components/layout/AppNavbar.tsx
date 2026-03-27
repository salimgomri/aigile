'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, ChevronDown, Settings, LogOut, Users } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { useCredits } from '@/lib/credits/CreditContext'
import CreditsBadge from '@/components/credits/CreditsBadge'
import CreditsCountBadge from '@/components/credits/CreditsCountBadge'

const navy = '#0f2240'

export default function AppNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const { data: session, isPending } = useSession()
  const { status } = useCredits()
  const isAdmin = status?.isAdmin

  const displayName = session?.user?.name
    ? `${(session.user as { firstName?: string }).firstName || session.user.name.split(' ')[0] || ''} ${(session.user as { lastName?: string }).lastName || session.user.name.split(' ').slice(1).join(' ') || ''}`.trim()
    : session?.user?.email?.split('@')[0] || session?.user?.email || ''

  const navLinks = [
    { href: '/dashboard', label: 'Tableau de bord', isActive: pathname === '/dashboard', available: true },
    { href: '/retro', label: 'Rétro IA', isActive: pathname?.startsWith('/retro') ?? false, available: true },
    { href: '/scoring-deliverable', label: 'Scoring livraison', isActive: pathname?.startsWith('/scoring') ?? false, available: true },
    ...(isAdmin
      ? [
          { href: '/admin/orders', label: 'Admin', isActive: pathname?.startsWith('/admin') ?? false, available: true },
          { href: '/niko-niko', label: 'Niko-Niko', isActive: pathname?.startsWith('/niko-niko') ?? false, available: true },
          { href: '/dora', label: 'DORA', isActive: pathname?.startsWith('/dora') ?? false, available: true },
        ]
      : [
          { href: '/niko-niko', label: 'Niko-Niko', isActive: false, available: false },
          { href: '/dora', label: 'DORA', isActive: false, available: false },
        ]),
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-[#0f2240] border-b border-[#c9973a]/30"
      style={{ backgroundColor: navy }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold text-[#c9973a]">AI</span>
            <span className="text-xl font-bold text-white">gile</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.available ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    link.isActive
                      ? 'bg-[#c9973a]/20 text-[#c9973a]'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <span
                  key={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white/40 cursor-not-allowed"
                  title="Bientôt"
                >
                  {link.label}
                </span>
              )
            )}
          </div>

          {/* Right: Credits badge + Avatar */}
          <div className="flex items-center gap-4">
            {session && <CreditsBadge />}

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#c9973a] flex items-center justify-center text-navy font-semibold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/80" />
                </button>

                {avatarOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAvatarOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute right-0 mt-2 w-64 py-2 rounded-lg shadow-xl z-50 border border-white/10"
                      style={{ backgroundColor: navy }}
                    >
                      <div className="px-4 py-3 border-b border-white/10 space-y-1.5">
                        <p className="font-semibold text-white truncate">{displayName}</p>
                        <div className="flex items-center gap-2">
                          <CreditsCountBadge />
                        </div>
                        <p className="text-sm text-white/70 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/join"
                        onClick={() => setAvatarOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                      >
                        <Users className="w-4 h-4" />
                        Rejoindre une équipe
                      </Link>
                      <Link
                        href="/settings/team"
                        onClick={() => setAvatarOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                      >
                        <Settings className="w-4 h-4" />
                        Paramètres équipe
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setAvatarOpen(false)
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : null}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white/90 hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 py-4">
          <div className="px-4 space-y-2">
            {navLinks.map((link) =>
              link.available ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    link.isActive ? 'bg-[#c9973a]/20 text-[#c9973a]' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <span
                  key={link.href}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-white/40 cursor-not-allowed"
                >
                  {link.label}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
