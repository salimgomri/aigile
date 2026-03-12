'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './language-provider'
import { useSession } from '@/lib/auth-client'
import { translations } from '@/lib/translations'
import { MessageSquare, Calendar, Coffee, X, Send } from 'lucide-react'
import BuyCoffeeSheet from '@/components/checkout/BuyCoffeeSheet'

const CALENDLY_URL = 'https://calendly.com/salimdulux/30min'

export default function FloatingBottomBar() {
  const { language } = useLanguage()
  const pathname = usePathname()
  const { data: session } = useSession()
  const t = translations[language]

  // Feedback state
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const isLoggedIn = !!session?.user
  const nameRequired = !isLoggedIn

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    if (nameRequired && !name.trim()) return

    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          pageUrl: typeof window !== 'undefined' ? window.location.href : pathname,
          senderName: nameRequired ? name.trim() : undefined,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setMessage('')
        setName('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleFeedbackClose = () => {
    setFeedbackOpen(false)
    setTimeout(() => setStatus('idle'), 300)
  }

  const btnClass =
    'flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105'
  const iconClass = 'w-5 h-5 flex-shrink-0'

  return (
    <>
      {/* Barre fixe centrée en bas — icône seule sur small, icône+texte sur md+ */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3"
        role="group"
      >
        {/* Feedback */}
        <button
          onClick={() => setFeedbackOpen(true)}
          className={`${btnClass} bg-aigile-navy/90 hover:bg-aigile-navy border border-aigile-gold/30 text-aigile-gold`}
          aria-label={t['feedback-float']}
        >
          <MessageSquare className={iconClass} />
          <span className="hidden md:inline font-medium text-sm whitespace-nowrap">
            {t['feedback-float']}
          </span>
        </button>

        {/* Buy a coffee */}
        <BuyCoffeeSheet
          trigger={
            <span
              className={`${btnClass} bg-aigile-gold/10 hover:bg-aigile-gold/20 border border-aigile-gold/50 text-aigile-gold cursor-pointer`}
              role="button"
              aria-label={t['coffee-float']}
            >
              <Coffee className={iconClass} />
              <span className="hidden md:inline font-medium text-sm whitespace-nowrap">
                {t['coffee-float']}
              </span>
            </span>
          }
        />

        {/* Calendly */}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnClass} bg-aigile-gold hover:bg-book-orange text-black`}
          aria-label={t['coaching-float']}
        >
          <Calendar className={iconClass} />
          <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">
            {t['coaching-float-short']}
          </span>
        </a>
      </div>

      {/* Modal Feedback */}
      {feedbackOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleFeedbackClose()}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t['feedback-title']}
              </h3>
              <button
                onClick={handleFeedbackClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="p-4 space-y-4">
              {nameRequired && (
                <div>
                  <label
                    htmlFor="feedback-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t['feedback-name-label']}
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t['feedback-name-placeholder']}
                    maxLength={100}
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent disabled:opacity-50"
                  />
                </div>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t['feedback-placeholder']}
                rows={4}
                maxLength={2000}
                disabled={status === 'sending'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent resize-none disabled:opacity-50"
              />

              {status === 'sent' && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {t['feedback-sent']}
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {t['feedback-error']}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleFeedbackClose}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {language === 'fr' ? 'Fermer' : 'Close'}
                </button>
                <button
                  type="submit"
                  disabled={
                    !message.trim() || (nameRequired && !name.trim()) || status === 'sending'
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-aigile-gold hover:bg-book-orange text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'sending' ? (
                    <span className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {t['feedback-send']}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
