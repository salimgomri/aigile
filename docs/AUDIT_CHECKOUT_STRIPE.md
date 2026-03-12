# Audit Checkout Stripe — UX · Tech Lead · Architect · QA · Stripe Expert

## ✅ Points solides

- **Catalogue centralisé** : une source de vérité, extensible
- **Webhook unifié** : un seul endpoint, handlers séparés
- **RPC increment_credits** : atomique, évite les race conditions
- **Emails typés** : buyer, author, shipping selon le produit
- **Admin protégé** : layout vérifie `isAdminEmail`
- **Metadata Stripe** : product_id, user_id, adresse pour fulfillment

---

## 🔴 CRITIQUE — Corrections appliquées

### 1. Idempotence webhook Stripe
**Problème** : Stripe retente les webhooks. Sans idempotence → crédits doublés, emails en double.
**Fix** : Table `stripe_webhook_events` + skip si `event.id` déjà traité.

### 2. ensureUserCredits avant increment_credits
**Problème** : Si `user_credits` n'existe pas (edge case), le RPC ne fait rien.
**Fix** : Appeler `ensureUserCredits(userId)` avant le RPC pour credits_pack.

### 3. subscription.deleted sans user_credits
**Problème** : `UPDATE user_credits` affecte 0 lignes si la ligne n'existe pas.
**Fix** : Appeler `ensureUserCredits` avant l'update.

---

## 🟠 HAUTE priorité — À corriger

### 4. Validation CheckoutSheet (livre)
**Problème** : Soumission possible sans adresse complète pour un livre.
**Fix** : Valider `address1`, `city`, `postal`, `country` avant submit quand `requiresShipping && !inPersonPickup`.

### 5. Validation create-session (livre)
**Problème** : API accepte une commande livre sans adresse si `shipping` est vide.
**Fix** : Retourner 400 si `requiresShipping && !inPersonPickup` et `!shipping?.address1`.

### 6. API /checkout/session non protégée
**Risque** : Toute personne avec un `session_id` peut récupérer les infos (type produit, adresse).
**Mitigation** : Le `session_id` est un secret à usage unique fourni par Stripe après paiement. Risque faible. Option : ajouter un rate limit.

---

## 🟡 MOYENNE priorité

### 7. Code promo côté client
**Problème** : `couponApplied` et `discountAmount` ne sont jamais mis à jour par l’API. Le client affiche "Appliquer" mais le discount est géré uniquement côté Stripe.
**Recommandation** : Soit retirer le bloc code promo du client, soit ajouter une API de validation avant checkout.

### 8. Limite metadata Stripe (500 chars/clé)
**Risque** : Adresses très longues pourraient dépasser la limite.
**Mitigation** : Stripe limite à 500 caractères par clé. Une adresse standard reste en dessous.

### 9. Lien Stripe Dashboard
**Problème** : `?query=session_id` peut ne pas fonctionner selon la config Stripe.
**Recommandation** : Utiliser `https://dashboard.stripe.com/payments` et filtrer manuellement, ou l’URL directe du payment_intent si disponible.

---

## 🟢 UX Apple — Recommandations

- **CheckoutSheet** : Focus automatique sur le premier champ à l’ouverture
- **Merci** : Animation de succès (confetti ou check animé)
- **Admin** : Skeleton loading au lieu de "Chargement…"
- **Erreurs** : Messages plus explicites (ex. "Adresse incomplète" au lieu de "Erreur")

---

## 🔧 Dépannage — Orders vides en BDD

Si le checkout réussit (redirection /merci) mais rien dans `orders` :

1. **Webhook Stripe** : Dashboard Stripe → Developers → Webhooks → vérifier que l’URL est `https://aigile.lu/api/webhooks/stripe` et que `checkout.session.completed` est activé.
2. **Secret webhook** : `STRIPE_WEBHOOK_SECRET` sur le serveur doit correspondre au **signing secret** du webhook **live** (pas test).
3. **Policy INSERT** : Exécuter la migration `016_orders_service_insert_policy.sql` dans Supabase Dashboard → SQL Editor.
4. **Logs** : En cas d’erreur, le webhook log `[WEBHOOK] orders insert failed:` dans les logs PM2.

---

## 🔒 Stripe — Bonnes pratiques

- ✅ Vérification de la signature webhook
- ✅ `customer_email` pour le guest checkout
- ✅ Metadata pour le fulfillment
- ✅ Ligne livraison séparée (comptabilité)
- ⚠️ Gérer `invoice.payment_failed` pour les abonnements (relance, etc.)
