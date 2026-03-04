'use client'

import { useLanguage } from '../language-provider'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold mb-4">
              <span className="aigile-text">AIgile</span> Manifesto
            </h4>
            <p className="text-white/80">{t('footer-manifesto-desc')}</p>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4 text-secondary">{t('footer-quick-links')}</h4>
            <div className="space-y-2">
              <a href="#values" className="block text-white/80 hover:text-secondary transition-colors">
                {t('footer-values-link')}
              </a>
              <a href="#about" className="block text-white/80 hover:text-secondary transition-colors">
                {t('footer-about-link')}
              </a>
              <a href="https://gomri.coach" target="_blank" rel="noopener noreferrer" 
                 className="block text-white/80 hover:text-secondary transition-colors">
                {t('footer-coaching-link')}
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4 text-secondary">{t('footer-stay-updated')}</h4>
            <div className="space-y-2">
              <a href="https://www.linkedin.com/in/salimgomri/recent-activity/articles/" target="_blank" rel="noopener noreferrer"
                 className="block text-white/80 hover:text-secondary transition-colors">
                {t('footer-weekly-articles')}
              </a>
              <a href="https://www.linkedin.com/in/salimgomri/" target="_blank" rel="noopener noreferrer"
                 className="block text-white/80 hover:text-secondary transition-colors">
                {t('footer-follow-linkedin')}
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 text-center text-white/60 text-sm">
          <p dangerouslySetInnerHTML={{ __html: t('footer-copyright') }} />
        </div>
      </div>
    </footer>
  )
}
