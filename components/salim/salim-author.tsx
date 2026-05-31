'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimateIn } from './animate-in'

function AuthorPhoto() {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="author-photo-placeholder" aria-hidden>
        <span>SG</span>
      </div>
    )
  }

  return (
    <Image
      src="/images/salim-gomri.jpg"
      alt="Salim Gomri"
      width={280}
      height={280}
      className="author-photo"
      priority={false}
      onError={() => setHasError(true)}
    />
  )
}

export function SalimAuthor() {
  return (
    <AnimateIn as="section" className="author-section">
      <div className="author-inner">
        <div className="author-photo-wrapper">
          <AuthorPhoto />
        </div>
        <div className="author-content">
          <p className="author-eyebrow">L&apos;auteur</p>
          <h2 className="author-name">Salim Gomri</h2>
          <p className="author-credentials">
            Fondateur d&apos;AIgile · Lead Agile Coach depuis 2004 · Premier praticien agile au Luxembourg
            en 2006
          </p>
          <p className="author-story">
            En 2009, une release « réussie » côté vélocité a coûté six semaines de rework et la confiance d&apos;un
            client stratégique. Personne dans l&apos;équipe ne savait expliquer l&apos;écart. J&apos;ai passé les
            années suivantes à documenter ce que les tableaux de bord ne montrent pas — et à en faire un système
            reproductible.
          </p>
          <p className="author-quote">
            Ce livre n&apos;est pas ce que j&apos;aurais voulu lire. C&apos;est ce que j&apos;ai mis 22 ans à
            apprendre.
          </p>
          <p className="author-body">
            22 ans. Des centaines d&apos;équipes. Une grande banque internationale. Des PME en croissance. Des
            DSI sous pression.
          </p>
        </div>
      </div>
    </AnimateIn>
  )
}
