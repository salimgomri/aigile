# Configuration Auth AIgile — Guide complet

## 1. Variables d'environnement

**Obligatoire** : ajoute **DATABASE_URL** dans `.env.local` :

1. Supabase Dashboard → ton projet → **Settings** → **Database**
2. Section **Connection string** → **URI**
3. Copie la chaîne (Session mode ou Transaction mode)
4. Remplace `[YOUR-PASSWORD]` par ton mot de passe DB

```
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

Sans DATABASE_URL, le fallback utilise la connexion directe `db.[ref].supabase.co` (indépendante de la région).

## 2. Créer les tables

### Méthode A : Script automatique

```bash
npm run db:setup
```

### Méthode B : SQL manuel (Supabase SQL Editor)

1. Ouvre **Supabase Dashboard** → ton projet → **SQL Editor**
2. Exécute `supabase/migrations/000_better_auth_base.sql`
3. Exécute `supabase/migrations/001_add_user_additional_fields.sql`

## 3. Vérifier la connexion

```bash
curl http://localhost:3010/api/auth/health
```

Réponse attendue : `{"ok":true,"database":"connected"}`

## 4. Redémarrer et tester

```bash
npm run dev
```

Inscription sur http://localhost:3010/register

## 5. Tests unitaires

```bash
npm test
```
