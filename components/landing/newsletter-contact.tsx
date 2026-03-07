/*
 * Newsletter & Contact Section
 * - Newsletter signup form
 * - Contact form with email to salim.gomri@gmail.com
 * - Side-by-side layout
 * - Premium Apple-style design
 */

'use client'

import { useState } from 'react'
import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { Mail, Send, User, MessageSquare, CheckCircle } from 'lucide-react'

export default function NewsletterContactSection() {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with newsletter service (Mailchimp, ConvertKit, etc.)
    console.log('Newsletter signup:', newsletterEmail)
    setNewsletterSubmitted(true)
    setTimeout(() => {
      setNewsletterEmail('')
      setNewsletterSubmitted(false)
    }, 3000)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Create mailto link
    const subject = encodeURIComponent(`[AIgile Contact] Message from ${contactForm.name}`)
    const body = encodeURIComponent(`Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`)
    window.location.href = `mailto:salim.gomri@gmail.com?subject=${subject}&body=${body}`
    
    setContactSubmitted(true)
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' })
      setContactSubmitted(false)
    }, 3000)
  }

  return (
    <section id="contact" className="relative py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Newsletter Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {language === 'fr' ? 'Newsletter' : 'Newsletter'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t['newsletter-title']}
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t['newsletter-subtitle']}
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t['newsletter-placeholder']}
                  className="w-full px-6 py-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={newsletterSubmitted}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {newsletterSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{language === 'fr' ? 'Inscrit !' : 'Subscribed!'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t['newsletter-cta']}</span>
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                {t['newsletter-privacy']}
              </p>
            </form>

            {/* Social Proof */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white dark:border-black"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' 
                    ? 'Plus de 1 000 agilistes reçoivent nos insights' 
                    : '1,000+ agilists receive our insights'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {language === 'fr' ? 'Contact' : 'Contact'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t['contact-title']}
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t['contact-subtitle']}
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t['contact-name']}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t['contact-email']}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t['contact-message']}
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={contactSubmitted}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {contactSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{language === 'fr' ? 'Envoyé !' : 'Sent!'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t['contact-cta']}</span>
                  </>
                )}
              </button>
            </form>

            {/* Email Display */}
            <div className="pt-4 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <a 
                href="mailto:salim.gomri@gmail.com"
                className="hover:text-primary transition-colors duration-200"
              >
                salim.gomri@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
