/*
 * ARCHITECTURE RECOMMENDATION:
 * Stack: Next.js 15 + React 18 + TypeScript + TailwindCSS (already in place)
 * Rationale: Optimal for static/hybrid rendering, excellent performance, modern DX
 * 
 * Premium Apple Navbar Component
 * - Reusable across all pages
 * - Bilingual support (FR/EN)
 * - Glassmorphism design
 * - Authentication placeholders (ready for Firebase/Supabase/Auth0)
 * - Smooth animations and transitions
 * - Mobile-responsive with drawer menu
 */

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './language-provider'
import { useTheme } from './theme-provider'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { Menu, X, ChevronDown, Globe, User, LogOut } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import CreditsCountBadge from '@/components/credits/CreditsCountBadge'

export default function PremiumNavbar() {
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const { theme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, isPending } = useSession()
  const t = translations[language]

  const isLanding = pathname === '/'
  const isManifesto = pathname === '/manifesto'

  const toolsLinks = [
    { href: '/retro', label: t['tools-retro-title'], match: (p: string) => p.startsWith('/retro') },
    { href: '/start-scrum', label: t['tools-start-journey'], match: (p: string) => p.startsWith('/start-scrum') || p.startsWith('/parcours') },
  ]

  const navLinks = isLanding
    ? [
        { href: '/', label: t['nav-home'] },
        { href: '/manifesto', label: t['nav-manifesto'] },
        { href: '/parcours', label: language === 'fr' ? 'Parcours' : 'Journey' },
        { href: '/prompts', label: 'Prompts' },
        { href: '/#pricing', label: t['nav-pricing'] },
        { href: '#tools', label: t['nav-tools'] },
        { href: '#book', label: t['nav-book'] },
        { href: '#cards', label: t['nav-cards'] },
      ]
    : [
        { href: '/', label: t['nav-home'], isActive: false },
        ...toolsLinks.map((tool) => ({ href: tool.href, label: tool.label, isActive: tool.match(pathname || '') })),
      ]

  const userDisplayName = session?.user?.name || session?.user?.email?.split('@')[0] || session?.user?.email || ''

  // Detect scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isLanding
            ? isManifesto
              ? 'bg-white backdrop-blur-xl shadow-lg border-b border-gray-200'
              : 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-aigile-gold flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-black font-bold text-xl">A</span>
                </div>
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-aigile-gold opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
              <span className={`text-2xl font-bold hidden sm:inline ${isManifesto ? 'text-aigile-navy' : 'text-aigile-gold'}`}>
                AIgile
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = 'isActive' in link && link.isActive
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-aigile-gold/20 text-aigile-gold font-semibold'
                        : isManifesto
                          ? 'text-gray-800 hover:text-aigile-gold hover:bg-gray-100'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Right Section: Language, Auth, Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className={`hidden md:flex items-center space-x-2 rounded-full p-1 ${isManifesto ? 'bg-gray-100 border border-gray-200' : 'bg-aigile-navy/60 border border-aigile-gold/30'}`}>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    language === 'en'
                      ? 'bg-aigile-gold text-black shadow-sm'
                      : isManifesto
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                        : 'text-white/90 hover:text-white hover:bg-white/5'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    language === 'fr'
                      ? 'bg-aigile-gold text-black shadow-sm'
                      : isManifesto
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                        : 'text-white/90 hover:text-white hover:bg-white/5'
                  }`}
                >
                  FR
                </button>
              </div>

              {/* Authentication Buttons (Desktop) */}
              <div className="hidden lg:flex items-center space-x-3">
                {isPending ? (
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                ) : session ? (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground bg-muted/50">
                        <User className="w-4 h-4" />
                        <span className="max-w-[120px] truncate" title={session.user.email}>{userDisplayName}</span>
                      </span>
                      <CreditsCountBadge />
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t['nav-signout']}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                        isManifesto || scrolled
                          ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {t['nav-signin']}
                    </Link>
                    <Link
                      href="/register"
                      className="px-5 py-2 bg-aigile-gold hover:bg-book-orange text-black text-sm font-bold rounded-full hover:shadow-lg transition-all duration-200"
                    >
                      {t['nav-signup']}
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t shadow-lg ${isManifesto ? 'bg-white border-gray-200' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800'}`}>
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => {
                const isActive = 'isActive' in link && link.isActive
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-aigile-gold/20 text-aigile-gold font-semibold'
                        : isManifesto
                          ? 'text-gray-800 hover:bg-gray-100 hover:text-aigile-gold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {/* Mobile Language Switcher */}
              <div className={`flex items-center justify-center space-x-2 pt-4 border-t ${isManifesto ? 'border-gray-200' : 'border-gray-200 dark:border-gray-800'}`}>
                <button
                  onClick={() => {
                    setLanguage('en')
                    setMobileMenuOpen(false)
                  }}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    language === 'en'
                      ? 'bg-aigile-gold text-black'
                      : isManifesto ? 'bg-transparent text-gray-600 border border-gray-300' : 'bg-transparent text-muted-foreground border border-white/10'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage('fr')
                    setMobileMenuOpen(false)
                  }}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    language === 'fr'
                      ? 'bg-aigile-gold text-black'
                      : isManifesto ? 'bg-transparent text-gray-600 border border-gray-300' : 'bg-transparent text-muted-foreground border border-white/10'
                  }`}
                >
                  Français
                </button>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                {isPending ? (
                  <div className="w-full h-12 rounded-lg bg-muted animate-pulse" />
                ) : session ? (
                  <>
                    <div className="w-full px-4 py-3 flex flex-col items-center justify-center gap-1.5 text-center text-base font-medium text-foreground bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="truncate">{userDisplayName}</span>
                      </div>
                      <CreditsCountBadge />
                    </div>
                    <button
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full px-4 py-3 flex items-center justify-center space-x-2 text-center text-base font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t['nav-signout']}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full px-4 py-3 text-center text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      {t['nav-signin']}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full px-4 py-3 bg-aigile-gold hover:bg-book-orange text-black text-base font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      {t['nav-signup']}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-20" />
    </>
  )
}
