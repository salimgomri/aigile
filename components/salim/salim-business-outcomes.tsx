'use client'

import { AnimateIn } from './animate-in'

const OUTCOMES = [
  {
    title: 'Réduire le risque de livraison',
    text: 'Nommer ce qui manque avant la fin du sprint — pas après la plainte client. Moins de rework, moins de surprises en comité.',
  },
  {
    title: 'Rendre la solidité visible',
    text: 'Un langage commun entre SM, PO et management : au-delà du « done », savoir si le livrable tient la route.',
  },
  {
    title: 'Décider plus vite, avec des faits',
    text: 'Dashboard en 30 secondes, plans d’action dès lundi. Moins de réunions pour comprendre, plus d’actions pour corriger.',
  },
] as const

export function SalimBusinessOutcomes() {
  return (
    <section className="outcomes-section">
      <AnimateIn>
        <h2>Ce que le système produit pour ta boîte</h2>
        <p className="outcomes-subtitle">
          Pas plus de méthode. Une meilleure lecture de ce que tu livres déjà.
        </p>
      </AnimateIn>
      <div className="outcomes-grid">
        {OUTCOMES.map((outcome, index) => (
          <AnimateIn key={outcome.title} as="article" cascadeDelay={index * 80} className="outcome-card">
            <h3>{outcome.title}</h3>
            <p>{outcome.text}</p>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
