# Accès Admin

## Comment accéder

1. **Connexion** : Connecte-toi avec le compte dont l'email est dans `ADMIN_EMAILS` (`.env.local`)
2. **Dashboard** : Va sur https://aigile.lu/dashboard — tu verras les cartes Niko Niko, DORA et **Commandes**
3. **Admin direct** : https://aigile.lu/admin/orders

## Portail Stripe (Manage subscription)

En tant qu'admin, tu n'as pas d'abonnement Stripe perso. Pour prévisualiser le portail Pro :

1. Récupère un **customer ID** Stripe ayant un abo Pro (Dashboard Stripe → Customers → un client avec abo actif)
2. Ajoute dans `.env.local` : `STRIPE_ADMIN_PORTAL_CUSTOMER_ID=cus_xxx`
3. Le bouton « Gérer mon abonnement » ouvrira le portail de ce customer (ce que verrait un Pro)

## Sécurité

- L'email admin n'est **jamais affiché** dans l'UI (navbar, dashboard, etc.) — remplacé par « Admin »
- Seul le compte configuré dans `ADMIN_EMAILS` a accès à `/admin/*`
