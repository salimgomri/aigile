# Flux d'authentification AIgile

## Inscription (email/password)

1. **Formulaire** : Prénom, Nom, Email, Rôle, Mot de passe, Confirmation mot de passe
2. **Envoi** : Email de bienvenue "Merci de valider ton email" avec lien de vérification
3. **Vérification** : L'utilisateur clique sur le lien → compte activé → session créée
4. **Redirection** : Page `/welcome` avec "Bienvenue [prénom], on qualifie déjà le prospect"
5. **Accès** : Lien vers dashboard

## Connexion Google

1. **Clic** : "Continuer avec Google"
2. **Redirection** : Après Google → `/onboarding/role`
3. **Rôle** : L'utilisateur sélectionne son rôle (Manager, Scrum Master, etc.)
4. **Prénom/Nom** : Récupérés automatiquement depuis Google
5. **Redirection** : Dashboard

## Migration base de données

**Exécuter dans Supabase SQL Editor** :

```sql
-- Fichier: supabase/migrations/001_add_user_additional_fields.sql
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "firstName" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "lastName" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" TEXT;

-- Backfill pour utilisateurs existants
UPDATE "user" 
SET 
  "firstName" = COALESCE("firstName", SPLIT_PART("name", ' ', 1)),
  "lastName" = COALESCE("lastName", NULLIF(TRIM(SUBSTRING("name" FROM POSITION(' ' IN "name"))), ''))
WHERE "firstName" IS NULL AND "name" IS NOT NULL;
```

## Variables d'environnement

- `RESEND_API_KEY` : Clé API Resend pour envoyer les emails
- `RESEND_FROM_EMAIL` : (optionnel) Email expéditeur vérifié
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` : Pour OAuth Google

## Routes

| Route | Accès | Description |
|-------|-------|-------------|
| `/login` | Public | Connexion email ou Google |
| `/register` | Public | Inscription avec prénom, nom, email, rôle, mot de passe |
| `/welcome` | Auth | Page après vérification email |
| `/onboarding/role` | Auth | Sélection du rôle (Google users) |
| `/dashboard` | Auth | Tableau de bord |

## Rôles disponibles

- manager
- scrum_master
- product_owner
- agile_coach
- dev_team
- guest
- other (→ mapped to guest)
