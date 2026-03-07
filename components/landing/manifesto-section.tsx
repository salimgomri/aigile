/*
 * Manifesto Section
 * - Link to /manifesto page
 * - Download PDF option
 * - Premium Apple-style design
 */

'use client'

import { useLanguage } from '../language-provider'
import { translations } from '@/lib/translations'
import { FileText, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ManifestoSection() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section id="manifesto" className="relative py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {language === 'fr' ? 'Document Fondateur' : 'Founding Document'}
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                {t['manifesto-title']}
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {t['manifesto-subtitle']}
              </p>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {t['manifesto-desc']}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/manifesto"
                className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>{t['manifesto-cta-view']}</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Link>

              <a
                href="/aigileManifesto.pdf"
                download
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>{t['manifesto-cta-download']}</span>
              </a>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            {/* Manifesto Preview Card */}
            <div className="relative aspect-[3/4] max-w-md mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 hover:rotate-1 transition-all duration-500">
              {/* Manifesto Content Preview */}
              <div className="absolute inset-0 p-8 sm:p-12">
                <div className="space-y-6">
                  {/* Title */}
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                      AIgile
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manifesto
                    </p>
                  </div>

                  {/* Values Preview */}
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="p-3 bg-white/50 dark:bg-black/30 rounded-lg backdrop-blur-sm">
                      <p className="font-semibold">Individuals & Interactions</p>
                      <p className="text-xs text-gray-500">with or without AI</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-black/30 rounded-lg backdrop-blur-sm">
                      <p className="font-semibold">Working Software</p>
                      <p className="text-xs text-gray-500">co-created</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-black/30 rounded-lg backdrop-blur-sm">
                      <p className="font-semibold">Customer Collaboration</p>
                      <p className="text-xs text-gray-500">AI-augmented or not</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-black/30 rounded-lg backdrop-blur-sm">
                      <p className="font-semibold">Responding to Change</p>
                      <p className="text-xs text-gray-500">over following a plan</p>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="text-center pt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Salim Gomri
                    </p>
                    <p className="text-xs text-gray-500">April 2025</p>
                  </div>
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm whitespace-nowrap">
              4 {language === 'fr' ? 'Valeurs' : 'Values'} • 10 {language === 'fr' ? 'Principes' : 'Principles'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
