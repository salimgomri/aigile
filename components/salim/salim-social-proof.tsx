'use client'

import { AnimateIn } from './animate-in'

const TESTIMONIALS = [
  {
    quote:
      'On livrait à l’heure. Le client hésitait quand même à renouveler. Le cadre m’a donné les mots pour expliquer l’écart entre vélocité et solidité — en comité, pas en rétro.',
    role: 'Scrum Master · secteur finance · Luxembourg',
  },
  {
    quote:
      'Six cadrans, une page. Mon N+1 arrête de me demander « on est vert partout ? » sans voir le risque sous la surface. Ça change la conversation.',
    role: 'Directeur de projet · PME tech · France',
  },
] as const

export function SalimSocialProof() {
  return (
    <section className="social-proof-section">
      <AnimateIn>
        <h2>Ce que ça change sur le terrain</h2>
      </AnimateIn>

      <AnimateIn cascadeDelay={80} className="mini-case">
        <p className="mini-case-label">Mini cas · anonymisé</p>
        <div className="mini-case-grid">
          <div>
            <p className="mini-case-phase">Avant</p>
            <p>
              Livrable « done » en fin de sprint. Client calme en démo, insatisfait au moindre écart. Score
              solidité ~30/100 en bêta Scoring Deliverable. Personne ne nomme la cause.
            </p>
          </div>
          <div>
            <p className="mini-case-phase">Après 2 sprints S.A.L.I.M.</p>
            <p>
              Risques nommés en rétro, plan N+1 documenté, comité en 30 secondes. Score solidité au-dessus de
              55/100 — sans plus de vélocité, plus de lecture.
            </p>
          </div>
        </div>
      </AnimateIn>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((item, index) => (
          <AnimateIn key={item.role} as="blockquote" cascadeDelay={index * 80} className="testimonial-card">
            <p className="testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
            <footer className="testimonial-role">{item.role}</footer>
          </AnimateIn>
        ))}
      </div>

      <p className="social-proof-note">Témoignages anonymisés · retours de praticiens accompagnés</p>
    </section>
  )
}
