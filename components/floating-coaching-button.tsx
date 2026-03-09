/*
 * Floating Coaching Button Component
 * - Always visible on all sections
 * - Opens Calendly for booking with Salim
 * - Premium Apple-style design
 * - Responsive (full text on desktop, icon only on mobile)
 */

'use client'

import { useState } from 'react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/translations'
import { Calendar, X } from 'lucide-react'

export default function FloatingCoachingButton() {
  const { language } = useLanguage()
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)

  // Calendly URL (to be configured)
  const calendlyUrl = 'https://calendly.com/salim-gomri' // TODO: Replace with actual Calendly URL

  const openCalendly = () => {
    // Option 1: Open in new tab
    window.open(calendlyUrl, '_blank')
    
    // Option 2: Embed Calendly widget (requires Calendly embed script)
    // setIsOpen(true)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openCalendly}
        className="fixed bottom-8 right-8 z-40 group"
        aria-label={t['coaching-float']}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-aigile-gold opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300 animate-ping" />

        {/* Button content */}
        <div className="relative flex items-center space-x-3 px-6 py-4 bg-aigile-gold hover:bg-book-orange text-black rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300">
          <Calendar className="w-5 h-5" />
          <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">
            {t['coaching-float']}
          </span>
          <span className="md:hidden font-semibold text-sm">
            {t['coaching-float-short']}
          </span>
        </div>

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping" />
      </button>

      {/* Calendly Embed Modal (Optional) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Calendly iframe */}
            <iframe
              src={calendlyUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Book Coaching Session"
            />
          </div>
        </div>
      )}
    </>
  )
}
