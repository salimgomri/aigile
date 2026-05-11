/**
 * Métadonnées « doctrine » pour le Collector (Sprint 4) — thèses courtes et points clés par groupe YAML.
 * Clés = `group.name` exact dans config/intelligence/sources.yml
 */
export type CollectorTheme = {
  thesisFr: string
  thesisEn: string
  keyPointsFr: string[]
  keyPointsEn: string[]
}

export const COLLECTOR_THEMES: Record<string, CollectorTheme> = {
  'Elon Musk — Tesla': {
    thesisFr: 'Itération radicale sur la production et la conception intégrée.',
    thesisEn: 'Radical iteration on manufacturing and vertically integrated design.',
    keyPointsFr: ['First principles', 'Cadence usine', 'Coût / unité'],
    keyPointsEn: ['First principles', 'Factory cadence', 'Cost per unit'],
  },
  'Elon Musk — SpaceX': {
    thesisFr: 'Réutilisation et cadence de lancement comme levier de coût.',
    thesisEn: 'Reusability and launch cadence as cost leverage.',
    keyPointsFr: ['Rapid reuse', 'Engine commonality', 'Simulation-heavy'],
    keyPointsEn: ['Rapid reuse', 'Engine commonality', 'Simulation-heavy'],
  },
  'NVIDIA (Jensen Huang)': {
    thesisFr: 'Plateforme complète (GPU + soft + écosystème) pour capturer la valeur IA.',
    thesisEn: 'Full-stack platform play to capture AI value.',
    keyPointsFr: ['CUDA / stack', 'Data center AI', 'Long-term bets'],
    keyPointsEn: ['CUDA stack', 'Data center AI', 'Long-term bets'],
  },
  'OpenAI — Actualités': {
    thesisFr: 'Cap IA générale et adoption produit à grande échelle.',
    thesisEn: 'AGI trajectory and product adoption at scale.',
    keyPointsFr: ['Modèles', 'Sécurité', 'API / produits'],
    keyPointsEn: ['Models', 'Safety', 'API / products'],
  },
  'Sam Altman — Blog': {
    thesisFr: 'Startups à impact massif et cycles technologiques.',
    thesisEn: 'High-impact startups and technology cycles.',
    keyPointsFr: ['Scaling org', 'Compound bets', 'Clarté de mission'],
    keyPointsEn: ['Scaling org', 'Compound bets', 'Mission clarity'],
  },
  'Anthropic (Dario Amodei)': {
    thesisFr: 'Capacités modèles vs interprétabilité et garde-fous.',
    thesisEn: 'Model capability vs interpretability and guardrails.',
    keyPointsFr: ['Constitutional AI', 'Safety', 'Research pace'],
    keyPointsEn: ['Constitutional AI', 'Safety', 'Research pace'],
  },
  'Steve Jobs Archive': {
    thesisFr: 'Simplicité narrative, craft produit, intégration bout-en-bout.',
    thesisEn: 'Narrative simplicity, product craft, end-to-end integration.',
    keyPointsFr: ['Focus', 'Go-to-market', 'Détails UI'],
    keyPointsEn: ['Focus', 'Go-to-market', 'UI craft'],
  },
  'Wait But Why (Tim Urban)': {
    thesisFr: 'Décomposer le complexe en récits longs et schémas mentaux.',
    thesisEn: 'Decompose complexity into long-form narratives.',
    keyPointsFr: ['First principles storytelling', 'Delay vs AI', 'Systems thinking'],
    keyPointsEn: ['First principles storytelling', 'Procrastination', 'Systems thinking'],
  },
  'The Gates Notes (Bill Gates)': {
    thesisFr: 'Progrès mesurable (santé, climat, éducation) via science et partenariats.',
    thesisEn: 'Measurable progress via science and partnerships.',
    keyPointsFr: ['Impact metrics', 'R&D', 'Policy / philanthropy'],
    keyPointsEn: ['Impact metrics', 'R&D', 'Policy'],
  },
  'Lex Fridman — Podcast': {
    thesisFr: 'Conversations longues — rigueur, éthique et fondements des systèmes intelligents.',
    thesisEn: 'Long-form rigor on foundations, ethics, and intelligent systems.',
    keyPointsFr: ['Profondeur', 'Contrepoints', 'Science × société'],
    keyPointsEn: ['Depth', 'Steel-manning', 'Science × society'],
  },
  'Naval Ravikant': {
    thesisFr: 'Leverage asymétrique, specific knowledge, équité > salaire.',
    thesisEn: 'Asymmetric leverage, specific knowledge, equity > wage.',
    keyPointsFr: ['Specific knowledge', 'Leverage (code/media/capital)', 'Judgement'],
    keyPointsEn: ['Specific knowledge', 'Leverage', 'Judgement'],
  },
  'Alex Hormozi': {
    thesisFr: 'Volume d’offres, upsell et acquisition comme machine systématisable.',
    thesisEn: 'Offer volume, upsell, acquisition as a systematic machine.',
    keyPointsFr: ['Grand slam offer', 'LTV', 'Distribution'],
    keyPointsEn: ['Grand slam offer', 'LTV', 'Distribution'],
  },
  'Ray Dalio — Principles': {
    thesisFr: 'Décisions en système ouvert, radical transparency, boucles de feedback.',
    thesisEn: 'Systemized decisions, radical transparency, feedback loops.',
    keyPointsFr: ['Principles', 'Believability-weighted', 'Pain + reflection'],
    keyPointsEn: ['Principles', 'Believability-weighted', 'Pain + reflection'],
  },
  'Paul Graham — Essays': {
    thesisFr: 'Startups comme vérité compressée ; utilisateurs et-itération.',
    thesisEn: 'Startups as compressed truth; users and iteration.',
    keyPointsFr: ['Maker schedule', 'Default alive', 'Do things that don’t scale'],
    keyPointsEn: ['Maker schedule', 'Default alive', 'Things that don’t scale'],
  },
  'Y Combinator — Startup School': {
    thesisFr: 'Cadence early-stage : utilisateurs, métrique nord, itération hebdo.',
    thesisEn: 'Early cadence: users, north star metric, weekly iteration.',
    keyPointsFr: ['Talk to users', 'Launch fast', 'Measure'],
    keyPointsEn: ['Talk to users', 'Launch fast', 'Measure'],
  },
  'Graham Stephan': {
    thesisFr: 'Finance personnelle et investissement expliqués sans hype.',
    thesisEn: 'Personal finance and investing without hype.',
    keyPointsFr: ['Cash flow', 'Patience', 'Marchés réels'],
    keyPointsEn: ['Cash flow', 'Patience', 'Real markets'],
  },
  'Marty Cagan — SVPG': {
    thesisFr: 'Discovery continu, équipes produit empowerées, outcomes > outputs.',
    thesisEn: 'Continuous discovery, empowered teams, outcomes > outputs.',
    keyPointsFr: ['Discovery', 'Empowered teams', 'OUTCOME > OUTPUT'],
    keyPointsEn: ['Discovery', 'Empowered teams', 'OUTCOME > OUTPUT'],
  },
  'Melissa Perri': {
    thesisFr: 'Escalade produit et priorités CEO / CPO alignées.',
    thesisEn: 'Product escalation and CEO/CPO priority alignment.',
    keyPointsFr: ['Product ops', 'Strategy gaps', 'Pilot KPIs'],
    keyPointsEn: ['Product ops', 'Strategy gaps', 'Pilot KPIs'],
  },
  'Lenny Rachitsky — Newsletter': {
    thesisFr: 'Playbooks growth & produit validés par la communauté practitioners.',
    thesisEn: 'Growth & product playbooks validated by practitioners.',
    keyPointsFr: ['Benchmarks', 'Templates', 'Guest depth'],
    keyPointsEn: ['Benchmarks', 'Templates', 'Guest depth'],
  },
  'Mind The Product': {
    thesisFr: 'Communauté PM européenne — craft et leadership produit.',
    thesisEn: 'European PM community — craft and product leadership.',
    keyPointsFr: ['Community', 'Conference insights', 'Career'],
    keyPointsEn: ['Community', 'Conference insights', 'Career'],
  },
  'Thiga (FR)': {
    thesisFr: 'Product management francophone, méthodes terrain.',
    thesisEn: 'French PM craft and field methods.',
    keyPointsFr: ['Formation', 'Cas FR', 'Discovery'],
    keyPointsEn: ['Training', 'FR cases', 'Discovery'],
  },
  'ProductBoard — Blog': {
    thesisFr: 'Alignement roadmap / feedback client à l’échelle.',
    thesisEn: 'Roadmap and customer feedback alignment at scale.',
    keyPointsFr: ['Prioritization', 'Insights loop', 'Stakeholders'],
    keyPointsEn: ['Prioritization', 'Insights loop', 'Stakeholders'],
  },
  'Hubvisory — UX Republic': {
    thesisFr: 'Design systems et recherche utilisateur en contexte enterprise.',
    thesisEn: 'Design systems and UX research in enterprise context.',
    keyPointsFr: ['UX maturity', 'Systems', 'Research ops'],
    keyPointsEn: ['UX maturity', 'Systems', 'Research ops'],
  },
  'Jeff Patton': {
    thesisFr: 'User story mapping comme langage partagé équipe / métier.',
    thesisEn: 'User story mapping as shared team/business language.',
    keyPointsFr: ['Story mapping', 'Outcomes', 'Collaboration'],
    keyPointsEn: ['Story mapping', 'Outcomes', 'Collaboration'],
  },
  'Martin Fowler': {
    thesisFr: 'Architecture évolutive et refactoring sans dogme.',
    thesisEn: 'Evolvable architecture and pragmatic refactoring.',
    keyPointsFr: ['Refactoring', 'Bounded contexts', 'Trade-offs'],
    keyPointsEn: ['Refactoring', 'Bounded contexts', 'Trade-offs'],
  },
  'Mike Cohn — Mountain Goat Software': {
    thesisFr: 'User stories, planning agile, estimation « just enough ».',
    thesisEn: 'User stories, agile planning, just-enough estimation.',
    keyPointsFr: ['Stories', 'Planning poker', 'Release planning'],
    keyPointsEn: ['Stories', 'Planning poker', 'Release planning'],
  },
  'Jean-Pierre Lambert': {
    thesisFr: 'Agilité francophone — système et facilitation.',
    thesisEn: 'French agile fluency — systems and facilitation.',
    keyPointsFr: ['Scrum Life', 'Systémique', 'Terrain'],
    keyPointsEn: ['Scrum Life', 'Systems', 'Practice'],
  },
  'Team Topologies': {
    thesisFr: 'Structurer les équipes pour le flux de valeur logicielle.',
    thesisEn: 'Structure teams for software value flow.',
    keyPointsFr: ['Stream-aligned', 'Platform teams', 'Cognitive load'],
    keyPointsEn: ['Stream-aligned', 'Platform teams', 'Cognitive load'],
  },
  'Scaled Agile (SAFe)': {
    thesisFr: 'Alignement portfolio / PI pour grandes organisations.',
    thesisEn: 'Portfolio / PI alignment for large enterprises.',
    keyPointsFr: ['PI Planning', 'RTE', 'Governance'],
    keyPointsEn: ['PI Planning', 'RTE', 'Governance'],
  },
  'Claude Aubry — Scrum FR': {
    thesisFr: 'Scrum clair, terrain français, rôles et artefacts sans surcharge.',
    thesisEn: 'Clear Scrum, French practice, lean ceremonies.',
    keyPointsFr: ['Scrum guide', 'Culture FR', 'Simplicité'],
    keyPointsEn: ['Scrum guide', 'French culture', 'Simplicity'],
  },
  'Esther Derby': {
    thesisFr: 'Organisation change par observation et expériences sécurisées.',
    thesisEn: 'Org change via observation and safe experiments.',
    keyPointsFr: ['Retros', 'Systems thinking', 'Managers'],
    keyPointsEn: ['Retros', 'Systems thinking', 'Managers'],
  },
  'Radical Candor — Blog': {
    thesisFr: 'Feedback à la fois direct et humainement investi.',
    thesisEn: 'Feedback that is candid and personally invested.',
    keyPointsFr: ['Care personally', 'Challenge directly', 'Ruinous empathy'],
    keyPointsEn: ['Care personally', 'Challenge directly', 'Ruinous empathy'],
  },
  'Patrick Lencioni — Table Group': {
    thesisFr: 'Cohésion d’équipe et confiance comme prérequis résultats.',
    thesisEn: 'Team cohesion and trust as prerequisites to results.',
    keyPointsFr: ['Five dysfunctions', 'Trust', 'Conflict'],
    keyPointsEn: ['Five dysfunctions', 'Trust', 'Conflict'],
  },
  'Marshall Goldsmith': {
    thesisFr: 'Changements de comportement pour leaders déjà performants.',
    thesisEn: 'Behavior change for already-successful leaders.',
    keyPointsFr: ['Stakeholder centered', 'Triggers', 'Measurement'],
    keyPointsEn: ['Stakeholder centered', 'Triggers', 'Measurement'],
  },
  'Kim Scott — Radical Candor': {
    thesisFr: 'Cartographier les quadrants de feedback pour éviter la stagnation.',
    thesisEn: 'Map feedback quadrants to avoid stagnation.',
    keyPointsFr: ['Radical candor', 'Ruinous empathy', 'Obnoxious aggression'],
    keyPointsEn: ['Radical candor', 'Ruinous empathy', 'Obnoxious aggression'],
  },
  'Simon Sinek': {
    thesisFr: 'Why avant How — cercles dorés et leadership infini.',
    thesisEn: 'Why before How — golden circles and infinite mindset.',
    keyPointsFr: ['Start with why', 'Trust', 'Purpose'],
    keyPointsEn: ['Start with why', 'Trust', 'Purpose'],
  },
  'Tony Robbins — Blog': {
    thesisFr: 'État psychophysique et stratégies d’exécution durable.',
    thesisEn: 'Peak state and sustainable execution strategies.',
    keyPointsFr: ['State', 'RPM', 'Energy'],
    keyPointsEn: ['State', 'RPM', 'Energy'],
  },
  'Lenny’s Podcast': {
    thesisFr: 'Confidences opérationnelles des meilleurs opérateurs produit.',
    thesisEn: 'Operational detail from top product operators.',
    keyPointsFr: ['Depth interviews', 'Metrics', 'Career arcs'],
    keyPointsEn: ['Depth interviews', 'Metrics', 'Career arcs'],
  },
  'Masters of Scale (Reid Hoffman)': {
    thesisFr: 'Blitzscaling et contre-intuitifs du scaling Silicon Valley.',
    thesisEn: 'Blitzscaling and counter-intuitive Silicon Valley scaling.',
    keyPointsFr: ['Scale stages', 'Networks', 'Speed vs safety'],
    keyPointsEn: ['Scale stages', 'Networks', 'Speed vs safety'],
  },
  'Dans la tête d’un PM': {
    thesisFr: 'Réflexions PM francophones — terrain et craft.',
    thesisEn: 'French PM reflections — practice and craft.',
    keyPointsFr: ['Interviews', 'FR market', 'Mindset'],
    keyPointsEn: ['Interviews', 'FR market', 'Mindset'],
  },
  'Scrum Life (JP Lambert)': {
    thesisFr: 'Scrum et coaching agile en français — communauté active.',
    thesisEn: 'Scrum and agile coaching in French — active community.',
    keyPointsFr: ['Live Q&A', 'Scrum guide', 'Practice'],
    keyPointsEn: ['Live Q&A', 'Scrum guide', 'Practice'],
  },
  'Product Squad': {
    thesisFr: 'Product collective — formats courts et veille FR.',
    thesisEn: 'Product collective — short formats and FR scanning.',
    keyPointsFr: ['News digest', 'Community', 'Templates'],
    keyPointsEn: ['News digest', 'Community', 'Templates'],
  },
  'The Product Tape': {
    thesisFr: 'Récits audio produit — storytelling et leçons de carrière.',
    thesisEn: 'Product audio storytelling and career lessons.',
    keyPointsFr: ['Narrative', 'Guests', 'Lessons learned'],
    keyPointsEn: ['Narrative', 'Guests', 'Lessons learned'],
  },
}

export function pairKey(a: string, b: string): string {
  return [a, b].sort((x, y) => x.localeCompare(y, 'fr')).join('|||')
}

/** Doctrines combinées (paires) pour la bannière « Daily Doctrine ». */
export const COLLECTOR_PAIR_DOCTRINES_FR: Record<string, string> = {
  [pairKey('Naval Ravikant', 'Marty Cagan — SVPG')]:
    "Naval veut du leverage asymétrique et du jugement ; Marty Cagan veut de l’empathie utilisateur et du discovery continu : votre doctrine — Product-Led Growth avec décisions distribuées.",
  [pairKey('Alex Hormozi', 'Marty Cagan — SVPG')]:
    "Hormozi veut du scale systématisé et de l’offre irrésistible ; Cagan veut de l’empathie produit et des outcomes mesurables : focus du jour — croissance pilotée par la valeur utilisateur.",
  [pairKey('Naval Ravikant', 'Alex Hormozi')]:
    "Naval veut du levier rare et scalable ; Hormozi veut des machines d’acquisition : synthèse — construire des actifs médiatiques qui nourrissent une offre scalable.",
}

export const COLLECTOR_PAIR_DOCTRINES_EN: Record<string, string> = {
  [pairKey('Naval Ravikant', 'Marty Cagan — SVPG')]:
    "Naval pushes asymmetric leverage and judgement; Marty Cagan pushes user empathy and continuous discovery: today's doctrine — product-led growth with distributed decisions.",
  [pairKey('Alex Hormozi', 'Marty Cagan — SVPG')]:
    "Hormozi wants systematic scale and irresistible offers; Cagan wants product empathy and measurable outcomes: focus — growth driven by user value.",
  [pairKey('Naval Ravikant', 'Alex Hormozi')]:
    "Naval wants rare, scalable leverage; Hormozi wants acquisition machines: synthesis — build media assets that feed a scalable offer.",
}

export function getCollectorTheme(groupName: string): CollectorTheme {
  return (
    COLLECTOR_THEMES[groupName] ?? {
      thesisFr: `Perspective stratégique — ${groupName}`,
      thesisEn: `Strategic lens — ${groupName}`,
      keyPointsFr: ['Veille', 'Décision', 'Itération'],
      keyPointsEn: ['Scanning', 'Decision', 'Iteration'],
    }
  )
}
