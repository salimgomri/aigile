# Tests End-to-End Checkout — aigile.lu

## Cartes de test Stripe

| Cas | Numéro | Exp | CVC |
|-----|--------|-----|-----|
| Succès | 4242 4242 4242 4242 | 12/29 | 123 |
| Échec paiement | 4000 0000 0000 0002 | 12/29 | 123 |
| 3D Secure | 4000 0025 0000 3155 | 12/29 | 123 |
| Fonds insuffisants | 4000 0000 0000 9995 | 12/29 | 123 |

---

## TEST 1 — Achat livre précommande sans code promo

**Parcours :** Landing #book → Commander → Remplir formulaire → Payer

**Résultats attendus :**
- [ ] Prix = 35,00€ + livraison 5,00€ = 40,00€
- [ ] Redirection vers Stripe Checkout
- [ ] Après paiement → /merci avec animation ✓
- [ ] Email confirmation reçu (buyer)
- [ ] Email notification reçu (auteur) avec adresse KDP
- [ ] Ligne insérée dans table `orders` (status = 'paid')
- [ ] Événement dans `stripe_webhook_events`

**Résultat réel :** _À remplir après exécution_

---

## TEST 2 — Achat livre avec code SALIM10

**Parcours :** Même parcours + saisir SALIM10 avant checkout

**Résultats attendus :**
- [ ] Validation API → discount = 3,50€ affiché dans le Sheet
- [ ] Prix final = 31,50€ + livraison 5,00€ = 36,50€
- [ ] `orders.coupon_code` = 'SALIM10'
- [ ] `orders.amount_discount` = 350

**Résultat réel :** _À remplir après exécution_

---

## TEST 3 — Achat livre en main propre

**Parcours :** Cocher "En main propre" → Payer

**Résultats attendus :**
- [ ] Champs adresse masqués
- [ ] Livraison = 0€
- [ ] `orders.in_person_pickup` = true
- [ ] Email auteur : mention "EN MAIN PROPRE"

**Résultat réel :** _À remplir après exécution_

---

## TEST 4 — Day Pass

**Parcours :** Landing #pricing → Day Pass → Essayer → Payer

**Résultats attendus :**
- [ ] Prix = 9,99€ sans champs adresse
- [ ] Après paiement → `user_credits.plan` = 'day_pass'
- [ ] `user_credits.day_pass_expires_at` = now + 24h
- [ ] Badge navbar → "⚡ 24h XX:XX"
- [ ] /merci → "Ton Day Pass est actif !"

**Résultat réel :** _À remplir après exécution_

---

## TEST 5 — Abonnement Pro Mensuel

**Parcours :** Landing #pricing → Pro (toggle Mensuel) → Commencer Pro → Payer

**Résultats attendus :**
- [ ] Prix = 19,99€/mois
- [ ] Après paiement → `user_credits.plan` = 'pro_monthly'
- [ ] Badge navbar → "⚡ Pro"
- [ ] Tous les CreditButton → badge "∞"
- [ ] /merci → "Bienvenue dans AIgile Pro !"

**Résultat réel :** _À remplir après exécution_

---

## TEST 6 — Abonnement Pro Annuel

**Parcours :** Toggle Annuel → Pro → Commencer Pro → Payer

**Résultats attendus :**
- [ ] Prix = 199,99€
- [ ] `user_credits.plan` = 'pro_annual'

**Résultat réel :** _À remplir après exécution_

---

## TEST 7 — Free tente action IA sans crédits

**Parcours :** Vider les crédits → tenter "Générer plan rétro"

**Résultats attendus :**
- [ ] UpgradeModal s'ouvre automatiquement
- [ ] L'action IA NE s'exécute pas
- [ ] Pas de décrément dans `user_credits`

**Résultat réel :** _À remplir après exécution_

---

## TEST 8 — Code promo invalide

**Parcours :** Saisir "FAKEPROMO" dans le Sheet

**Résultats attendus :**
- [ ] Message rouge "Code invalide ou expiré"
- [ ] Pas de discount appliqué
- [ ] Prix inchangé

**Résultat réel :** _À remplir après exécution_

---

## TEST 9 — Paiement échoué (carte 4000 0000 0000 0002)

**Résultats attendus :**
- [ ] Message d'erreur explicite affiché (ERROR_MESSAGES)
- [ ] Pas de ligne insérée dans `orders`
- [ ] Pas d'email envoyé

**Résultat réel :** _À remplir après exécution_

---

## TEST 10 — invoice.payment_failed (abonnement Pro)

**Simulation :** Dans Stripe Dashboard → Subscriptions → simuler un échec

**Résultats attendus :**
- [ ] Email de relance reçu avec lien portail Stripe
- [ ] `user_credits.plan` reste 'pro_monthly' (pas de rétrogradation immédiate)
- [ ] Événement dans `stripe_webhook_events`

**Résultat réel :** _À remplir après exécution_

---

## TEST 11 — Idempotence webhook

**Simulation :** Renvoyer manuellement un événement depuis Stripe Dashboard

**Résultats attendus :**
- [ ] Pas de doublon dans `orders`
- [ ] Pas de double crédit dans `user_credits`
- [ ] Réponse 200 avec `{ skipped: true }`

**Résultat réel :** _À remplir après exécution_

---

## TEST 12 — Portail Stripe

**Parcours :** Connexion Pro → Navbar → Gérer l'abonnement (ou CreditsDrawer → Gérer)

**Résultats attendus :**
- [ ] Redirection vers billing.stripe.com avec branding AIgile
- [ ] Peut voir les factures
- [ ] Peut changer sa carte
- [ ] Retour vers aigile.lu/settings (ou /dashboard) après action

**Résultat réel :** _À remplir après exécution_

---

## Exécution

1. S'assurer que `STRIPE_SECRET_KEY` est en mode test (`sk_test_...`)
2. Exécuter chaque test en mode Stripe test
3. Noter le résultat réel dans la section prévue
4. Marquer les cases cochées [x] si le test passe
