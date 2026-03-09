'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

/**
 * Navbar for public pages (landing, parcours, prompts).
 * Logo: AIgile (AI gold, gile white)
 * Links: Accueil · Parcours · Prompts · Le livre
 * Buttons: Se connecter (outline) · Commencer gratuitement (bg-primary)
 */
export default function LandingNavbar() {
  const { language, setLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: language === 'fr' ? 'Accueil' : 'Home' },
    { href: '/parcours', label: language === 'fr' ? 'Parcours' : 'Journey' },
    { href: '/prompts', label: 'Prompts' },
    { href: '/#book', label: language === 'fr' ? 'Le livre' : 'The Book' },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo: AIgile (AI gold, gile white) */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-aigile-gold flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold hidden sm:inline">
                <span className="text-aigile-gold">AI</span>
                <span className="text-foreground">gile</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-aigile-gold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: Language + Auth */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-full p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    language === 'en' ? 'bg-aigile-gold text-black' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    language === 'fr' ? 'bg-aigile-gold text-black' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  FR
                </button>
              </div>

              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-aigile-gold/50 text-foreground hover:border-aigile-gold hover:bg-aigile-gold/10 transition-colors"
                >
                  {language === 'fr' ? 'Se connecter' : 'Sign In'}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-aigile-gold hover:bg-book-orange text-black text-sm font-bold rounded-full hover:shadow-lg transition-all"
                >
                  {language === 'fr' ? 'Commencer gratuitement' : 'Start Free'}
                </Link>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center font-semibold rounded-lg border border-aigile-gold/50"
                >
                  {language === 'fr' ? 'Se connecter' : 'Sign In'}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center font-bold rounded-full bg-aigile-gold text-black"
                >
                  {language === 'fr' ? 'Commencer gratuitement' : 'Start Free'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="h-20" />
    </>
  )
}
