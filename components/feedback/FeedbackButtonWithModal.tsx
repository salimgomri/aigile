'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useLanguage } from '@/components/language-provider'
import { translations } from '@/lib/translations'
import { MessageSquare, X, Send } from 'lucide-react'

type FeedbackButtonWithModalProps = {
  variant?: 'button' | 'link'
  className?: string
  children?: React.ReactNode
}

export default function FeedbackButtonWithModal({
  variant = 'button',
  className = '',
  children,
}: FeedbackButtonWithModalProps) {
  const { language } = useLanguage()
  const pathname = usePathname()
  const { data: session } = useSession()
  const t = translations[language]

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

  return (
    <>
      {children ? (
        <button type="button" onClick={() => setFeedbackOpen(true)} className={className}>
          {children}
        </button>
      ) : variant === 'link' ? (
        <button
          type="button"
          onClick={() => setFeedbackOpen(true)}
          className={`text-gray-700 hover:text-aigile-gold transition-colors duration-200 text-sm flex items-center gap-2 ${className}`}
        >
          <MessageSquare className="w-4 h-4" />
          {t['feedback-float']}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setFeedbackOpen(true)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full border border-aigile-gold/30 text-aigile-gold hover:bg-aigile-gold/10 transition-all ${className}`}
          aria-label={t['feedback-float']}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium text-sm">{t['feedback-float']}</span>
        </button>
      )}

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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t['feedback-title']}</h3>
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
                  <label htmlFor="feedback-name-footer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t['feedback-name-label']}
                  </label>
                  <input
                    id="feedback-name-footer"
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
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t['feedback-sent']}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{t['feedback-error']}</p>
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
                  disabled={!message.trim() || (nameRequired && !name.trim()) || status === 'sending'}
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
