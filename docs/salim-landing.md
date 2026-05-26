# Landing `/salim` — produits & Stripe

Page de vente LinkedIn : `https://aigile.lu/salim`

## Price IDs Stripe : **pas obligatoires**

Le checkout `/salim` fonctionne **sans** créer de produits dans le dashboard Stripe.

| Produit | Variable env (optionnelle) | Si vide |
|---------|---------------------------|---------|
| Livre | `PRICE_LIVRE_SALIM` ou `STRIPE_PRICE_ID_SALE` | `price_data` depuis le catalogue (65 €) |
| Fiches | `PRICE_FICHES_SALIM` | `price_data` depuis le catalogue (35 €) |
| Bundle | `PRICE_BUNDLE_SALIM` | `price_data` depuis le catalogue (100 €) |

Seule contrainte prod : **`STRIPE_SECRET_KEY`** doit être renseignée.

Les Price IDs servent surtout si tu veux des produits nommés/fixes dans le dashboard Stripe (reporting, promos Stripe liées à un Price, etc.). Tu peux les ajouter plus tard sans changer le code.

---

## Modifier les prix — où toucher

Les montants encaissés viennent du **catalogue** (`amount` en centimes). L’affichage landing est dans la page.

| Offre | Prix affiché | Centimes checkout | Fichier catalogue | Fichier affichage |
|-------|--------------|-------------------|-------------------|-------------------|
| Livre | 65 € (barré 79 €) | `6500` | `lib/payments/catalog.ts` → `book_sale` | `app/salim/page.tsx` + `lib/book-config.ts` (`BOOK_COMPARE_AT_CENTIMES`) + `components/landing/book-section.tsx` |
| Fiches | 35 € (barré 49 €) | `3500` | `lib/payments/catalog.ts` → `fiches_salim` | `app/salim/page.tsx` |
| Bundle | 100 € | `10000` | `lib/payments/catalog.ts` → `bundle_salim` | `app/salim/page.tsx` |
| Livraison | +5 € au checkout | `500` (`shippingFee`) | même entrées catalogue | bloc Livraison (texte informatif) |

**Règle :** si tu changes un prix, mets à jour **catalogue + page** (et les boutons). Optionnel : créer/mettre à jour le Price Stripe + variable env.

---

## Textes produit (checkout Stripe)

Titres et descriptions sur la page Stripe Checkout = champs `title` / `description` dans `lib/payments/catalog.ts` (`fiches_salim`, `bundle_salim`, `book_sale`).

Couvertures checkout :
- Livre → `/images/book-cover.jpg`
- Fiches → `/images/book-cover-fiche.png`

---

## Variables env (optionnelles)

```env
# Optionnel — sinon price_data automatique
PRICE_LIVRE_SALIM=    # alias possible : STRIPE_PRICE_ID_SALE (déjà utilisé ailleurs)
PRICE_FICHES_SALIM=
PRICE_BUNDLE_SALIM=
```

---

## Flux technique (inchangé si tu ajoutes des Price IDs)

1. Clic bouton → Server Action `app/salim/actions.ts`
2. `lib/payments/create-checkout-session.ts` → session Stripe (`mode: payment`)
3. Webhook existant → table `orders` (metadata `product_id` : `book_sale`, `fiches_salim`, `bundle_salim`)
4. Succès → `/salim/merci`

La route `/api/checkout/create-session` (homepage, pricing) **n’est pas utilisée** par `/salim`.

---

## Comment tester

### 1. Page seule (sans payer)

```bash
npm run dev
```

Ouvre [http://localhost:3010/salim](http://localhost:3010/salim) — vérifie les 5 blocs, les 3 cards, le bloc livraison.

Homepage livre : [http://localhost:3010/#book](http://localhost:3010/#book) — prix barré 79 € + prix 65 €.

### 2. Checkout complet (Stripe test)

Prérequis dans `.env.local` :

```env
STRIPE_SECRET_KEY=sk_test_...
# Webhook local (optionnel mais nécessaire pour la ligne orders + emails)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Terminal 1** — app :

```bash
npm run dev
```

**Terminal 2** — webhook (pour persister la commande en BDD) :

```bash
stripe listen --forward-to localhost:3010/api/webhooks/stripe
```

Copie le `whsec_...` affiché dans `STRIPE_WEBHOOK_SECRET`, redémarre `npm run dev`.

**Parcours :**

1. `/salim` → clic sur un bouton (livre, fiches ou bundle)
2. Stripe Checkout → email + adresse (collectés par Stripe)
3. Carte test : `4242 4242 4242 4242` · exp. `12/29` · CVC `123` (voir `docs/TESTS_CHECKOUT.md`)
4. Montant attendu : prix produit **+ 5,00 €** livraison (ex. livre = 70,00 €)
5. Redirection → `/salim/merci`
6. Vérifier : email confirmation, ligne `orders` (admin ou Supabase), `product_id` = `book_sale` / `fiches_salim` / `bundle_salim`

Sans webhook local : le paiement Stripe passe quand même, mais pas d’insert `orders` ni d’emails automatiques.

### 3. Tests automatisés existants

```bash
npm test
```

Checkout livre / webhook : `tests/checkout-handler.test.ts`, `tests/parse-checkout-session.test.ts`.

---

## Checklist lancement minimal

- [ ] `STRIPE_SECRET_KEY` en prod
- [ ] Prix catalogue = prix affichés sur `/salim`
- [ ] (Optionnel) Price IDs Stripe + variables env
- [ ] Test checkout test mode : livre, fiches, bundle → `/salim/merci` + email + ligne `orders`

---

## Notes produit

- **Bundle** : accès Early Access Scoring Deliverable = activation manuelle (cf. `/salim/merci`).
- **Retrait en main propre** : bloc informatif uniquement ; le checkout `/salim` passe par envoi postal (+5 €). Le flux avec case « retrait » reste sur la homepage (`CheckoutSheet`).
