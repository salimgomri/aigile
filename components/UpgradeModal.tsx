'use client'

import { useLanguage } from '@/components/language-provider'
import Link from 'next/link'
import { Lock, X } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  toolName?: string
}

export default function UpgradeModal({ isOpen, onClose, toolName }: UpgradeModalProps) {
  const { language } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-aigile-gold/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-aigile-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {language === 'fr' ? 'Fonctionnalité Pro' : 'Pro Feature'}
            </h3>
            {toolName && (
              <p className="text-muted-foreground mt-1">
                {toolName} {language === 'fr' ? 'nécessite un abonnement Pro.' : 'requires a Pro subscription.'}
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'fr'
              ? 'Passez à Pro pour débloquer tous les outils et la bibliothèque de prompts complète.'
              : 'Upgrade to Pro to unlock all tools and the full prompt library.'}
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
            >
              {language === 'fr' ? 'Fermer' : 'Close'}
            </button>
            <Link
              href="/register"
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-aigile-gold hover:bg-book-orange text-black font-bold text-center transition-colors"
            >
              {language === 'fr' ? 'Passer à Pro' : 'Upgrade to Pro'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
