# Accès Admin

## Comment accéder

1. **Connexion** : Connecte-toi avec le compte dont l'email est dans `ADMIN_EMAILS` (`.env.local`)
2. **Dashboard** : Va sur https://aigile.lu/dashboard — tu verras les cartes Niko Niko, DORA et **Commandes**
3. **Admin direct** : https://aigile.lu/admin/orders

## Sécurité

- L'email admin n'est **jamais affiché** dans l'UI (navbar, dashboard, etc.) — remplacé par « Admin »
- Seul le compte configuré dans `ADMIN_EMAILS` a accès à `/admin/*`
