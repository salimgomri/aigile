# Audit de Conversion — aigile.lu

**Date** : 18 mars 2026  
**Cible** : PME, dirigeants de petites entreprises  
**Objectif de conversion** : Prise de contact / Demande de devis  
**Méthode** : Analyse directe du site en production

---

## 1. Proposition de valeur — Clarté en 5 secondes

### Constat

| Élément | Observation | Problème |
|---------|-------------|----------|
| **Headline** | "S·A·L·I·M" + "Scrum Augmented Lead / Increase & Measure" | Acronyme cryptique. Un dirigeant PME ne comprend pas immédiatement le bénéfice business. |
| **Tagline** | "The only system that guides you step by step in the field — with AI and tools built for your team's reality" | Orienté "terrain" et "équipe" — parle aux praticiens Agile, pas aux décideurs. |
| **Badge** | "21 years in the field" | Crédibilité individuelle, pas de preuve B2B (clients entreprises, cas d'usage PME). |
| **Stats** | 21 ans, 9 patterns, 6 outils | Métriques produit, pas de résultats business (ROI, gains, économies). |

**Verdict** : La proposition de valeur n'est **pas** claire en 5 secondes pour un dirigeant PME. Le site parle à des Scrum Masters et coachs Agile, pas à des décideurs qui cherchent une solution pour leur entreprise.

### Preuve concrète

- Aucune mention de "PME", "dirigeant", "équipe", "productivité", "ROI" ou "transformation" dans le hero.
- Le bénéfice business (réduction des dysfonctions, gains de vélocité, alignement) n'est pas explicite.

---

## 2. Appels à l'action — Positionnement et hiérarchie

### Inventaire des CTA observés

| Emplacement | CTA | Type | Visibilité |
|-------------|-----|------|------------|
| Hero | "Try Retro AI for free" | Primaire (gold) | Forte |
| Hero | "Discover the S.A.L.I.M System" | Secondaire (outline) | Moyenne |
| Hero (couverture livre) | "Pre-order" / "Discover" | Overlay | Forte |
| Barre flottante | Feedback, Buy a coffee, Livre, **Coaching** | 4 boutons côte à côte | Moyenne — Coaching noyé |
| Section Contact | "Send Message" | Formulaire | Faible (bas de page) |
| Pricing | "Start Pro", "Day Pass", "Try" | Multiples | Moyenne |
| Footer | "Contact" (lien #contact) | Lien texte | Faible |

### Problèmes identifiés

1. **CTA "prise de contact" dilué** : Le bouton Calendly (Coaching) est le seul CTA direct vers une conversation, mais il est noyé parmi 4 boutons dans la barre flottante. Pas de hiérarchie visuelle.
2. **Pas de CTA "Demande de devis"** : Aucun wording explicite. Le formulaire contact dit "Questions? Coaching inquiry?" — pas "Demander un devis" ou "Évaluer mes besoins".
3. **Hero orienté produit** : Le CTA principal est "Try Retro AI" (outil gratuit), pas "Parler à un expert" ou "Demander une démo".
4. **Contact = formulaire générique** : Pas de parcours dédié pour les entreprises (devis, audit, accompagnement).

---

## 3. Structure narrative — Parcours vers la demande de devis

### Parcours actuel

```
Hero (S.A.L.I.M) → Try Retro / Discover Book
     ↓
Book Section → Pre-order
     ↓
Pricing → Day Pass / Pro / Free
     ↓
Tools Suite → Start Retro / Journey
     ↓
Manifesto → Read / Download
     ↓
Cards → À venir (newsletter)
     ↓
Newsletter + Contact → Subscribe / Send Message
```

### Problèmes

1. **Aucun fil conducteur "entreprise"** : Le parcours est linéaire produit (livre, outils, manifeste). Un dirigeant qui cherche un accompagnement ou un devis ne trouve pas de chemin dédié.
2. **Contact en fin de page** : La section Contact (#contact) est après 6 sections. Beaucoup d'utilisateurs n'atteignent jamais le formulaire.
3. **Parcours "Ready to take action?" (parcours)** : Sur /parcours, le CTA dit "Coming soon… View the Book" — aucune option de contact ou devis.
4. **Pas de section "Pour les entreprises"** : Aucun bloc qui parle explicitement aux PME (accompagnement, formation, audit).

---

## 4. Confiance et crédibilité — Signaux B2B

### Ce qui existe

| Élément | Observation |
|---------|-------------|
| "21 years in the field" | Crédibilité individuelle forte |
| "1,000+ agilists receive our insights" | Preuve sociale newsletter — pas B2B |
| "4.9/5 | 1000+ agilists worldwide" (tools) | Note et volume — pas de source ni de cas clients |
| Stripe, Luxembourg | Réassurance paiement |
| LinkedIn, gomri.coach | Liens externes |

### Ce qui manque

1. **Aucun témoignage client** : Pas de citation, logo entreprise, ou cas d'usage PME.
2. **Aucune référence entreprise** : Pas de "Ils nous font confiance" ou "Clients".
3. **Note 4.9/5 non sourcée** : D'où vient cette note ? Avis Google ? G2 ? Non précisé.
4. **Email contact incohérent** : `edition.malis@gmail.com` dans le formulaire vs `salim.gomri@gmail.com` dans la doc — confusion possible.

---

## 5. Friction — Ce qui freine la conversion

### Friction technique

| Problème | Impact | Preuve |
|----------|--------|--------|
| **Contact = mailto:** | Le formulaire ouvre le client mail de l'utilisateur au lieu d'envoyer en backend. Friction : changement de contexte, pas de confirmation, pas de suivi. | `newsletter-contact.tsx` ligne 45 : `window.location.href = mailto:...` |
| **Newsletter non fonctionnelle** | `console.log` seulement — pas d'intégration. L'utilisateur croit s'inscrire mais rien n'est enregistré. | `newsletter-contact.tsx` ligne 33 |
| **Cartes "À venir"** | CTA "Join newsletter" pour un produit indisponible — frustration. | Section Cards |
| **Parcours "Coming soon"** | Plusieurs outils et sections en "bientôt" — sentiment d'incomplétude. | Niko-Niko, DORA, OKR, etc. |

### Friction cognitive

| Problème | Impact |
|----------|--------|
| **Trop de CTAs** | Hero : 2 CTAs. Barre flottante : 4. Pricing : 3 plans. Choix paralysant. |
| **Wording technique** | "9 dysfunction patterns", "146 Retromat activities", "DORA metrics" — jargon pour initiés. |
| **Pas de promesse de réponse** | Formulaire contact : aucun "Nous vous répondons sous 24h" ou délai. |

### Friction visuelle

| Problème | Impact |
|----------|--------|
| **Barre flottante surchargée** | 4 boutons de même poids visuel — pas de CTA dominant pour "contact". |
| **Contact en bas de page** | Nécessite beaucoup de scroll. Pas de raccourci visible en header. |

---

## 6. Recommandations concrètes

### R1. Clarifier la proposition de valeur pour les PME (Impact: Critique | Effort: Moyen)

**Quoi** : Ajouter une sous-tagline ou un bloc "Pour les dirigeants" dans le hero.

**Comment** :
- Sous le tagline actuel, ajouter : FR : "Accompagnement Agile sur mesure pour les PME — déploiement, formation, coaching d'équipes."
- EN : "Tailored Agile support for SMBs — deployment, training, team coaching."
- Ou créer un bandeau déroulant/rotatif avec 3 messages : (1) Outils, (2) Livre, (3) Accompagnement PME.

**Pourquoi** : Un dirigeant doit comprendre en 5 secondes que le site propose des services B2B, pas seulement des outils en ligne.

---

### R2. Créer un CTA "Demande de devis" explicite (Impact: Critique | Effort: Faible)

**Quoi** : Ajouter un CTA principal "Demander un devis" / "Request a quote" visible et prioritaire.

**Comment** :
- Dans la navbar : ajouter un bouton "Demander un devis" (style gold, à droite) qui scroll vers #contact ou ouvre un modal.
- Dans le hero : ajouter un 3e CTA tertiaire "Demander un devis" (lien discret sous les 2 principaux).
- Renommer le titre Contact : "Demander un devis ou une démo" au lieu de "Get in Touch".
- Ajouter un champ "Type de demande" dans le formulaire : [Demande de devis] [Question coaching] [Autre].

**Pourquoi** : Le wording "demande de devis" convertit mieux les décideurs B2B que "contact" ou "coaching inquiry".

---

### R3. Remplacer mailto par un vrai backend (Impact: Critique | Effort: Moyen)

**Quoi** : Le formulaire contact doit envoyer via API (Resend, SendGrid, ou API route Next.js) et afficher une confirmation.

**Comment** :
- Créer `POST /api/contact` qui envoie l'email (Resend recommandé).
- Modifier `handleContactSubmit` pour `fetch('/api/contact', { method: 'POST', body: JSON.stringify(contactForm) })`.
- Afficher "Message envoyé. Nous vous répondons sous 24h." + vider le formulaire.
- Optionnel : envoyer une copie à l'utilisateur.

**Pourquoi** : mailto ouvre le client mail, change de contexte, et ne garantit pas l'envoi. Taux d'abandon élevé.

---

### R4. Hiérarchiser la barre flottante — Coaching en CTA dominant (Impact: Élevé | Effort: Faible)

**Quoi** : Faire du bouton Coaching le CTA principal de la barre flottante.

**Comment** :
- Réduire à 2 boutons : (1) "Demander un devis" ou "Coaching" (gold, plus grand), (2) "Feedback" (secondaire, plus discret).
- Ou garder 3 boutons mais : Coaching (gold, bold), Livre (outline), Feedback (icône seule ou texte petit).
- Supprimer "Buy a coffee" de la barre si l'objectif est B2B — ou le déplacer dans le footer.

**Pourquoi** : Un seul CTA dominant convertit mieux. "Coaching" = prise de contact directe.

---

### R5. Ajouter une section "Pour les entreprises" (Impact: Élevé | Effort: Moyen)

**Quoi** : Nouvelle section entre Tools et Manifesto (ou après Book) dédiée aux PME.

**Comment** :
- Titre : "Accompagnement pour les PME" / "SMB Support".
- 3 blocs : Formation équipes | Audit Agile | Coaching sur mesure.
- CTA : "Demander un devis" → scroll #contact ou modal.
- Optionnel : logos "Ils nous font confiance" (même vides au début, à remplir).

**Pourquoi** : Donne un chemin clair aux décideurs et renforce la crédibilité B2B.

---

### R6. Corriger l'email de contact et unifier (Impact: Moyen | Effort: Faible)

**Quoi** : Utiliser un seul email professionnel partout.

**Comment** :
- Remplacer `edition.malis@gmail.com` par l'email de contact officiel (ex: contact@aigile.lu ou salim.gomri@gmail.com) dans `newsletter-contact.tsx` et toute la codebase.
- Vérifier cohérence : footer, formulaire, mentions légales.

**Pourquoi** : Évite confusion et perte de leads (emails envoyés à la mauvaise adresse).

---

### R7. Ajouter une promesse de réponse (Impact: Moyen | Effort: Faible)

**Quoi** : Sous le bouton "Envoyer" du formulaire contact.

**Comment** :
- Texte : "Réponse sous 24h ouvrées" / "We respond within 24 business hours."
- Ou : "Appel de découverte gratuit de 30 min — réservez ci-dessous." + lien Calendly.

**Pourquoi** : Réduit l'incertitude et encourage l'envoi.

---

### R8. Réduire la friction "Coming soon" (Impact: Moyen | Effort: Faible)

**Quoi** : Pour les outils "Coming soon", proposer une alternative de contact.

**Comment** :
- Remplacer "Coming soon" par "Intéressé ? Demander une démo" (lien vers #contact ou Calendly).
- Sur /parcours : remplacer "Coming soon… View the Book" par "Demander un accompagnement" + "Voir le livre".

**Pourquoi** : Transforme une impasse en opportunité de conversion.

---

### R9. Sourcer la preuve sociale (Impact: Moyen | Effort: Faible)

**Quoi** : Clarifier l'origine de "4.9/5" et "1000+ agilists".

**Comment** :
- Si avis Google : "4.9/5 sur Google" + lien.
- Si newsletter : "1 000+ abonnés à la newsletter AIgile."
- Si autre : adapter le wording pour être honnête et vérifiable.

**Pourquoi** : Une preuve non sourcée peut nuire à la crédibilité.

---

### R10. Lien Contact dans la navbar (Impact: Moyen | Effort: Faible)

**Quoi** : Ajouter "Contact" ou "Devis" dans la navbar, visible sans scroll.

**Comment** :
- Dans `premium-navbar.tsx`, ajouter un lien "Demander un devis" ou "Contact" à droite (avant les boutons auth/langue).
- Lien vers #contact ou page /contact.

**Pourquoi** : Accès direct au formulaire depuis n'importe quelle section.

---

## 7. Plan d'action priorisé

| # | Recommandation | Impact | Effort | Priorité |
|---|----------------|--------|--------|----------|
| 1 | R3 — Remplacer mailto par backend | Critique | Moyen | P0 |
| 2 | R2 — CTA "Demande de devis" explicite | Critique | Faible | P0 |
| 3 | R1 — Proposition de valeur PME | Critique | Moyen | P0 |
| 4 | R4 — Hiérarchiser barre flottante | Élevé | Faible | P1 |
| 5 | R5 — Section "Pour les entreprises" | Élevé | Moyen | P1 |
| 6 | R6 — Corriger email contact | Moyen | Faible | P1 |
| 7 | R7 — Promesse de réponse | Moyen | Faible | P2 |
| 8 | R10 — Lien Contact navbar | Moyen | Faible | P2 |
| 9 | R8 — Alternative "Coming soon" | Moyen | Faible | P2 |
| 10 | R9 — Sourcer preuve sociale | Moyen | Faible | P2 |

---

## Synthèse

Le site aigile.lu est bien conçu pour des **praticiens Agile** (Scrum Masters, coachs) qui veulent essayer des outils ou acheter le livre. En revanche, il n'est **pas optimisé** pour la conversion de **dirigeants PME** vers une prise de contact ou une demande de devis.

Les leviers les plus impactants : (1) remplacer le mailto par un vrai envoi, (2) créer un parcours et un wording explicite "demande de devis", (3) adapter la proposition de valeur pour les décideurs B2B.
