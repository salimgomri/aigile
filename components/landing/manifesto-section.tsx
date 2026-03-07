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
    <section id="manifesto" className="relative py-24 bg-background">
      {/* Subtle separator */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(19,142,236,0.1),transparent_60%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-aigile-blue/10 backdrop-blur-sm rounded-full border border-aigile-blue/20">
                <FileText className="w-4 h-4 text-aigile-blue" />
                <span className="text-sm font-semibold text-aigile-blue uppercase tracking-wider">
                  {language === 'fr' ? 'Document Fondateur' : 'Founding Document'}
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                {t['manifesto-title']}
              </h2>
              
              <p className="text-xl text-muted-foreground">
                {t['manifesto-subtitle']}
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {t['manifesto-desc']}
            </p>

            {/* CTAs - ONLY 1 scale-105 */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/manifesto"
                className="group px-6 py-3 bg-gradient-to-r from-aigile-gold to-aigile-blue text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>{t['manifesto-cta-view']}</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Link>

              <a
                href="/aigileManifesto.pdf"
                download
                className="px-6 py-3 bg-card/50 backdrop-blur-sm text-foreground font-semibold rounded-full border-2 border-border hover:border-aigile-gold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>{t['manifesto-cta-download']}</span>
              </a>
            </div>
          </div>

          {/* Right: Visual - NO scale hover */}
          <div className="relative">
            {/* Manifesto Preview Card */}
            <div className="relative aspect-[3/4] max-w-md mx-auto bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transform hover:rotate-1 transition-transform duration-500 border border-border">
              {/* Manifesto Content Preview */}
              <div className="absolute inset-0 p-8 sm:p-12">
                <div className="space-y-6">
                  {/* Title */}
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                      AIgile
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manifesto
                    </p>
                  </div>

                  {/* Values Preview */}
                  <div className="space-y-3 text-sm text-foreground/90">
                    <div className="p-3 bg-muted/30 backdrop-blur-sm rounded-lg border border-border/50">
                      <p className="font-semibold">Individuals & Interactions</p>
                      <p className="text-xs text-muted-foreground">with or without AI</p>
                    </div>
                    <div className="p-3 bg-muted/30 backdrop-blur-sm rounded-lg border border-border/50">
                      <p className="font-semibold">Working Software</p>
                      <p className="text-xs text-muted-foreground">co-created</p>
                    </div>
                    <div className="p-3 bg-muted/30 backdrop-blur-sm rounded-lg border border-border/50">
                      <p className="font-semibold">Customer Collaboration</p>
                      <p className="text-xs text-muted-foreground">AI-augmented or not</p>
                    </div>
                    <div className="p-3 bg-muted/30 backdrop-blur-sm rounded-lg border border-border/50">
                      <p className="font-semibold">Responding to Change</p>
                      <p className="text-xs text-muted-foreground">over following a plan</p>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="text-center pt-4">
                    <p className="text-sm font-semibold text-foreground">
                      Salim Gomri
                    </p>
                    <p className="text-xs text-muted-foreground">April 2025</p>
                  </div>
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-aigile-gold/10 via-transparent to-aigile-blue/10 pointer-events-none" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-aigile-gold to-aigile-blue text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm whitespace-nowrap">
              4 {language === 'fr' ? 'Valeurs' : 'Values'} • 10 {language === 'fr' ? 'Principes' : 'Principles'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
