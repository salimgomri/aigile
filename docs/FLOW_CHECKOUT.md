# Flux Checkout — Où arrive la page /merci

## Ordre des étapes

1. **create-session** — L’utilisateur clique sur « Payer » → `POST /api/checkout/create-session`
   - Log : `[CHECKOUT] create-session` { productId, baseUrl, successUrl }
   - Log : `[CHECKOUT] session créée` { sessionId }
   - Réponse : URL Stripe Checkout

2. **Stripe Checkout** — L’utilisateur paie sur la page Stripe (hors de notre app)

3. **Redirection Stripe** → **PAGE /merci**
   - Stripe redirige vers `success_url` = `https://aigile.lu/merci?session_id={CHECKOUT_SESSION_ID}`
   - L’utilisateur arrive sur /merci avec le `session_id` dans l’URL

4. **Page /merci** — Le client appelle `GET /api/checkout/session?session_id=xxx`
   - Log : `[CHECKOUT] session GET — page /merci charge les détails` { sessionId }
   - Log : `[CHECKOUT] session OK` { sessionId, productType, productTitle }
   - La page affiche les détails (livre, day pass, etc.)

5. **Webhook** (en parallèle, asynchrone) — Stripe envoie `checkout.session.completed`
   - Log : `[WEBHOOK] event reçu` { id, type }
   - Log : `[WEBHOOK] checkout.session.completed → handleCheckoutCompleted` { sessionId }
   - Log : `[CHECKOUT] handleCheckoutCompleted début` { sessionId }
   - Log : `[CHECKOUT] order inséré en BDD` { sessionId }
   - Log : `[WEBHOOK] handleCheckoutCompleted OK` { sessionId }
   - Log : `[WEBHOOK] traité avec succès` { id }

## Important

- La page **/merci** apparaît dès que Stripe redirige (étape 3), **avant** que le webhook ait inséré l’order.
- L’order est créé par le webhook (étape 5), qui peut arriver quelques secondes après.
- Pour tracer un problème : chercher `[CHECKOUT]` et `[WEBHOOK]` dans les logs PM2.
