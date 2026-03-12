# Rapport d'audit câblage checkout

## ✅ Correctement câblés (après corrections)

- **CreditButton** : UpgradeModal → CheckoutSheet, consumeCredits côté API
- **consumeCredits** : Appelé dans `/api/credits/consume`, pas côté client
- **Emails payment_failed** : Lien portail Stripe dynamique
- **Merci /retro** : CTA "Lancer une rétro IA" → /retro (correct)

## 🔴 Manquants ou cassés → Corrections appliquées

| Point d'achat | Problème | Correction |
|---------------|----------|------------|
| **Section #book** | Bouton sans onClick, prix hardcodé | CheckoutSheet + /api/book/pricing, countdown, prix barré |
| **UpgradeModal (credits)** | Appel direct create-session, prix hardcodés | CheckoutSheet par produit, prix depuis /api/products/upgrade |
| **CreditsDrawer "Gérer"** | Bouton sans onClick | Redirection vers /api/stripe/portal |
| **settings/team** | "Passer Pro" sans onClick | UpgradeModal (credits) avec CheckoutSheet |
| **Parcours** | UpgradeModal → /register | Remplacé par credits/UpgradeModal |
| **DORA** | UpgradeModal → /register | Remplacé par credits/UpgradeModal |
| **Portail Stripe** | Inexistant | Créé lib/payments/stripe-portal.ts + /api/stripe/portal |

## 🟡 Partiellement câblés

| Point | Ce qui manque | Statut |
|-------|---------------|--------|
| **Section tarifs SaaS** | Pas de section dédiée Day Pass/Pro sur landing | Non implémenté — tools-suite et cards-section n'ont pas ces cartes |
| **Navbar "Gérer abonnement"** | Pas dans le menu avatar | Disponible via CreditsBadge → Drawer → Gérer |
| **Email confirmation Pro** | Lien "Gérer abonnement" | Lien /dashboard uniquement — portail accessible via app |

## Fichiers créés

- `lib/payments/stripe-portal.ts` — createStripePortalUrl()
- `app/api/stripe/portal/route.ts` — GET → { url }
- `app/api/book/pricing/route.ts` — Prix dynamique + product pour CheckoutSheet
- `app/api/products/upgrade/route.ts` — Produits pour UpgradeModal

## Fichiers modifiés

- `components/landing/book-section.tsx` — CheckoutSheet, fetch pricing
- `components/credits/UpgradeModal.tsx` — CheckoutSheet, fetch products
- `components/credits/CreditsDrawer.tsx` — Portail "Gérer"
- `app/settings/team/page.tsx` — UpgradeModal "Passer Pro"
- `app/parcours/page.tsx` — credits/UpgradeModal
- `app/dora/page.tsx` — credits/UpgradeModal

## Points d'achat vérifiés : 12

## Corrections appliquées : 7
