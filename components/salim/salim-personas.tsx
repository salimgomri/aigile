'use client'

import { Award, BarChart3, Users, Zap } from 'lucide-react'
import { AnimateIn } from './animate-in'

const PERSONAS = [
  {
    icon: Users,
    title: 'Tu es Scrum Master ou coach agile',
    text: '10 plans d’action dès lundi. 73 erreurs terrain. 10 patterns de dysfonctionnement avec la réponse adaptée à chacun.',
  },
  {
    icon: BarChart3,
    title: 'Tu pilotes des équipes ou des projets',
    text: '6 cadrans RAG. 115 décisions documentées. Un dashboard qui dit la vérité en moins de 30 secondes.',
  },
  {
    icon: Zap,
    title: 'Tu veux intégrer l’IA dans ton sprint',
    text: '566 références IA sur 415 pages. 93 prompts utilisables immédiatement. 4 chapitres dédiés IA × Scrum.',
  },
  {
    icon: Award,
    title: 'Tu pratiques Scrum depuis des années',
    text: '22 ans de terrain concentrés. 24 pièges que les formations ne mentionnent jamais. Le système S.A.L.I.M. comme cadre d’ensemble.',
  },
] as const

export function SalimPersonas() {
  return (
    <section className="personas-section">
      <AnimateIn>
        <h2>Pour toi, si…</h2>
      </AnimateIn>
      <div className="personas-grid">
        {PERSONAS.map((persona, index) => {
          const Icon = persona.icon
          return (
            <AnimateIn
              key={persona.title}
              as="article"
              cascadeDelay={index * 80}
              className="persona-card"
            >
              <Icon className="h-5 w-5 text-[#FEBD10] mb-4" aria-hidden />
              <h3>{persona.title}</h3>
              <p>{persona.text}</p>
            </AnimateIn>
          )
        })}
      </div>
    </section>
  )
}
