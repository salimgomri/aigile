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
import { Mail, Send, User, MessageSquare, CheckCircle, Linkedin } from 'lucide-react'

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
    window.location.href = `mailto:edition.malis@gmail.com?subject=${subject}&body=${body}`
    
    setContactSubmitted(true)
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' })
      setContactSubmitted(false)
    }, 3000)
  }

  return (
    <section id="contact" className="relative py-24 bg-background">
      {/* Subtle separator */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_30%,rgba(201,151,58,0.1),transparent_60%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Newsletter Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-aigile-gold/10 backdrop-blur-sm rounded-full border border-aigile-gold/20">
                <Mail className="w-4 h-4 text-aigile-gold" />
                <span className="text-sm font-semibold text-aigile-gold uppercase tracking-wider">
                  {language === 'fr' ? 'Newsletter' : 'Newsletter'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                {t['newsletter-title']}
              </h2>
              
              <p className="text-lg text-muted-foreground">
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
                  className="w-full px-6 py-4 bg-card/50 backdrop-blur-sm border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground placeholder-muted-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={newsletterSubmitted}
                className="w-full px-6 py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <p className="text-sm text-muted-foreground text-center">
                {t['newsletter-privacy']}
              </p>

              {/* LinkedIn Newsletter — alternative claire, hiérarchie secondaire */}
              <div className="flex items-center gap-3 pt-2">
                <span className="flex-1 h-px bg-border" aria-hidden />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t['newsletter-or']}
                </span>
                <span className="flex-1 h-px bg-border" aria-hidden />
              </div>
              <a
                href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7435301314290528256"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border border-border bg-card/30 hover:bg-card/60 hover:border-aigile-blue/40 text-muted-foreground hover:text-[#0a66c2] transition-all duration-200 group"
              >
                <Linkedin className="w-5 h-5 text-[#0a66c2] group-hover:scale-110 transition-transform" />
                <span className="font-medium">{t['newsletter-linkedin']}</span>
              </a>
            </form>

            {/* Social Proof */}
            <div className="pt-8 border-t border-border">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-aigile-gold border-2 border-background"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
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
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-aigile-blue/10 backdrop-blur-sm rounded-full border border-aigile-blue/20">
                <MessageSquare className="w-4 h-4 text-aigile-blue" />
                <span className="text-sm font-semibold text-aigile-blue uppercase tracking-wider">
                  {language === 'fr' ? 'Contact' : 'Contact'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                {t['contact-title']}
              </h2>
              
              <p className="text-lg text-muted-foreground">
                {t['contact-subtitle']}
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  {t['contact-name']}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-6 py-3 bg-card/50 backdrop-blur-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  {t['contact-email']}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-6 py-3 bg-card/50 backdrop-blur-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  {t['contact-message']}
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-6 py-3 bg-card/50 backdrop-blur-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={contactSubmitted}
                className="w-full px-6 py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="pt-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a 
                href="mailto:edition.malis@gmail.com"
                className="hover:text-aigile-gold transition-colors duration-200"
              >
                edition.malis@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
