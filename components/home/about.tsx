'use client'

import { useLanguage } from '../language-provider'
import { Linkedin, Mail, Globe, FileText } from 'lucide-react'

export default function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-[300px_1fr] gap-12 items-center max-w-6xl mx-auto">
          <div className="relative group">
            <img
              src="https://gomri.coach/wp-content/uploads/2025/04/salim-gomri-identite-2.png"
              alt="Salim Gomri"
              className="w-full rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-2 text-gray-900">{t('about-name')}</h2>
            <div className="text-xl text-aigile-navy font-semibold mb-2">{t('about-role')}</div>
            <div className="text-lg text-gray-700 italic mb-6">{t('about-founding')}</div>
            
            <div 
              className="text-lg leading-relaxed text-gray-800 mb-6"
              dangerouslySetInnerHTML={{ __html: t('about-bio') }}
            />

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 hover:shadow-xl transition-all duration-300">
              <h4 className="text-xl font-bold text-aigile-navy mb-4">{t('about-credentials-title')}</h4>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <li key={num} className="flex items-start gap-2 text-gray-800">
                    <span className="text-aigile-gold font-bold mt-1">✓</span>
                    <span dangerouslySetInnerHTML={{ __html: t(`about-cred-${num}` as any) }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h4 className="text-xl font-bold text-aigile-navy mb-4">{t('about-contact-title')}</h4>
              <div className="space-y-3">
                <a href="https://www.linkedin.com/in/salimgomri/" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-3 text-gray-800 hover:text-aigile-blue transition-colors">
                  <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                  <span>{t('linkedin-profile')}</span>
                </a>
                <a href="https://www.linkedin.com/in/salimgomri/recent-activity/articles/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 text-gray-800 hover:text-aigile-blue transition-colors">
                  <FileText className="w-5 h-5 text-[#0a66c2]" />
                  <span>{t('weekly-articles')}</span>
                </a>
                <a href="mailto:Salim.gomri@gmail.com" className="flex items-center gap-3 text-gray-800 hover:text-aigile-blue transition-colors">
                  <Mail className="w-5 h-5 text-[#b91c1c]" />
                  <span>{t('email-contact')}</span>
                </a>
                <a href="https://gomri.coach" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 text-gray-800 hover:text-aigile-blue transition-colors">
                  <Globe className="w-5 h-5 text-aigile-blue" />
                  <span>{t('website-link')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
