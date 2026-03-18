'use client'

import { useLanguage } from '../language-provider'
import { Building2, Users, Target, ArrowRight } from 'lucide-react'

const CALENDLY_URL = 'https://calendly.com/salimdulux/30min'

const content = {
  fr: {
    badge: 'Pour les entreprises',
    title: 'AIgile pour les PME',
    subtitle:
      "AIgile + coaching agile : formation d'équipes, audit, accompagnement sur mesure. 21 ans d'expérience terrain.",
    forLeaders: {
      title: 'Dirigeants & décideurs',
      desc: 'Comprendre les bénéfices, prioriser les investissements, mesurer l\'impact.',
    },
    forExperts: {
      title: 'Experts internes',
      desc: 'Scrum Masters, coachs, managers : « Il nous faut ce mec » — faites-le savoir à votre direction.',
    },
    offers: [
      { icon: Users, label: "Formation d'équipes", key: 'formation' },
      { icon: Target, label: 'Audit AIgile', key: 'audit' },
      { icon: Building2, label: 'Coaching AIgile sur mesure', key: 'coaching' },
    ],
    cta: 'Demander un appel découverte',
    ctaSub: '30 min gratuites — sans engagement',
  },
  en: {
    badge: 'For businesses',
    title: 'AIgile for SMBs',
    subtitle:
      'AIgile + agile coaching: team training, audit, tailored support. 21 years of field experience.',
    forLeaders: {
      title: 'Leaders & decision-makers',
      desc: 'Understand the benefits, prioritize investments, measure impact.',
    },
    forExperts: {
      title: 'Internal experts',
      desc: 'Scrum Masters, coaches, managers: "We need this guy" — make it known to your leadership.',
    },
    offers: [
      { icon: Users, label: 'Team training', key: 'formation' },
      { icon: Target, label: 'AIgile audit', key: 'audit' },
      { icon: Building2, label: 'AIgile coaching', key: 'coaching' },
    ],
    cta: 'Request a discovery call',
    ctaSub: '30 min free — no commitment',
  },
}

export default function EntreprisesSection() {
  const { language } = useLanguage()
  const t = content[language]

  return (
    <section id="entreprises" className="relative py-24 overflow-hidden bg-[#0f2240]">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_70%_30%,rgba(201,151,58,0.2),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-aigile-gold/10 rounded-full border border-aigile-gold/30 mb-6">
            <Building2 className="w-4 h-4 text-aigile-gold" />
            <span className="text-sm font-semibold text-aigile-gold uppercase tracking-wider">
              {t.badge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-aigile-gold mb-2">{t.forLeaders.title}</h3>
            <p className="text-white/80">{t.forLeaders.desc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-aigile-gold mb-2">{t.forExperts.title}</h3>
            <p className="text-white/80">{t.forExperts.desc}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {t.offers.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 text-sm"
            >
              <Icon className="w-4 h-4 text-aigile-gold" />
              {label}
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-aigile-gold hover:bg-book-orange text-black font-bold rounded-full shadow-lg shadow-aigile-gold/30 hover:shadow-xl transition-all duration-300 group"
          >
            {t.cta}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-sm text-white/60 mt-3">{t.ctaSub}</p>
        </div>
      </div>
    </section>
  )
}
