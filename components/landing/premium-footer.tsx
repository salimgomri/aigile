/*
 * Premium Footer Component
 * - Reusable across all pages
 * - Links to all sections
 * - Social links
 * - Copyright
 */

'use client'

import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { getBookCtaLabel } from '@/lib/book-config'
import { useBookProduct } from '@/lib/book-product-context'
import { trackEvent } from '@/lib/gtag'
import Link from 'next/link'
import { Linkedin, Twitter, MessageSquare, Coffee, BookOpen, Calendar } from 'lucide-react'
import FeedbackButtonWithModal from '@/components/feedback/FeedbackButtonWithModal'
import BuyCoffeeSheet from '@/components/checkout/BuyCoffeeSheet'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'

const CALENDLY_URL = 'https://calendly.com/salimdulux/30min'

export default function PremiumFooter() {
  const { language } = useLanguage()
  const t = translations[language]
  const { product: bookProduct } = useBookProduct()

  const footerLinks = {
    product: [
      { href: '/retro', label: t['tools-retro-title'], available: true },
      { href: '#', label: `${t['tools-nikoni']} (${language === 'fr' ? 'bientôt' : 'soon'})`, available: false },
      { href: '#', label: `${t['tools-dora']} (${language === 'fr' ? 'bientôt' : 'soon'})`, available: false },
      { href: '/parcours', label: language === 'fr' ? 'Parcours' : 'Journey', available: true },
      { href: '/start-scrum', label: t['tools-start-journey'], available: true },
      { href: '#tools', label: t['nav-tools'], available: true },
    ],
    resources: [
      { href: '/manifesto', label: t['nav-manifesto'] },
      { href: '/prompts', label: 'Prompts' },
      { href: '#book', label: t['nav-book'] },
      { href: '#cards', label: t['nav-cards'] },
    ],
    company: [
      { href: '#entreprises', label: language === 'fr' ? 'Entreprises' : 'Business' },
      { href: '#contact', label: language === 'fr' ? 'Contact' : 'Contact' },
      { href: 'https://gomri.coach', label: 'gomri.coach', external: true },
      { href: 'https://www.linkedin.com/in/salimgomri/', label: 'LinkedIn', external: true },
    ],
  }

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 4 CTA toujours visibles — Feedback, Buy a coffee, Livre, Coaching */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 pb-8 border-b border-gray-200">
          <FeedbackButtonWithModal variant="button" />
          <BuyCoffeeSheet
            trigger={(onOpen) => (
              <button
                type="button"
                onClick={onOpen}
                className="flex items-center gap-2 px-4 py-3 rounded-full border border-aigile-gold/50 text-aigile-gold hover:bg-aigile-gold/10 transition-all"
                aria-label={t['coffee-float']}
              >
                <Coffee className="w-5 h-5" />
                <span className="font-medium text-sm">{t['coffee-float']}</span>
              </button>
            )}
          />
          {bookProduct ? (
            <CheckoutSheet
              product={bookProduct}
              trigger={
                <button
                  type="button"
                  onClick={() => trackEvent('cta_book_footer', {})}
                  className="flex items-center gap-2 px-4 py-3 rounded-full border border-book-orange/50 text-book-orange hover:bg-book-orange/10 transition-all"
                  aria-label={t['nav-book']}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium text-sm">{getBookCtaLabel(language)}</span>
                </button>
              }
            />
          ) : (
            <span className="flex items-center gap-2 px-4 py-3 rounded-full border border-book-orange/30 text-book-orange/70 text-sm">
              <BookOpen className="w-5 h-5 animate-pulse" />
              {getBookCtaLabel(language)}
            </span>
          )}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-aigile-gold hover:bg-book-orange text-black font-semibold transition-all"
            aria-label={t['coaching-float']}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">{t['coaching-float-short']}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="w-12 h-12 rounded-xl bg-aigile-gold flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-2xl">A</span>
              </div>
            </Link>
            <p className="text-gray-700 text-sm leading-relaxed">
              {language === 'fr' 
                ? "L'écosystème professionnel pour les équipes Agile de l'ère IA" 
                : 'The professional ecosystem for Agile Teams in the AI era'}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Produit' : 'Product'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  {link.available ? (
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-aigile-gold transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-gray-500 text-sm cursor-not-allowed">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Ressources' : 'Resources'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-aigile-gold transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Entreprise' : 'Company'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-aigile-gold transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-aigile-gold transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              © 2026 Salim Gomri. AIgile. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.linkedin.com/in/salimgomri/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-aigile-gold hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/salimgomri"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-aigile-gold hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
