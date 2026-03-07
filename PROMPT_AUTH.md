# PROMPT CURSOR — P01 · Auth & User Management

## Stack Imposée

- **Authentification:** `better-auth` v1.3.26+ (pas NextAuth, Clerk, Auth.js)
- **Base de données:** Supabase (PostgreSQL) avec RLS policies
- **Email:** Resend pour invitations et réinitialisation mot de passe

Better-auth est déjà dans les dépendances du projet. Utiliser l'adapter Supabase de better-auth pour la persistance des sessions.

---

## QUOI — Authentification

Mettre en place l'authentification avec deux méthodes :
- **Google OAuth** (SSO)
- **Email / Password** avec vérification d'email obligatoire avant accès

Flux de réinitialisation de mot de passe par email (Resend est l'expéditeur email du projet).

Session persistante via cookie sécurisé. Expiration de session configurable (défaut : 30 jours).

---

## QUOI — Structure multi-tenant

L'architecture de données doit suivre ce modèle strict :
```
Organisation (1)
  └── Équipes (N)
        └── Membres (N) — chacun avec un rôle
```

Une organisation correspond à une entreprise ou un consultant indépendant. Un utilisateur peut appartenir à plusieurs organisations (ex : consultant externe qui intervient chez plusieurs clients). Une équipe appartient à une seule organisation.

---

## QUOI — Rôles

Définir **6 rôles** au niveau équipe. Chaque rôle a un périmètre de droits distinct :

| Rôle | Code | Périmètre |
|---|---|---|
| Manager | `manager` | Droits complets — configure l'équipe, voit tout, exporte, déclenche les crédits IA |
| Scrum Master | `scrum_master` | Accès lecture + écriture tous outils · Lance les rétros · Voit le Dashboard · Ne peut pas modifier la configuration de l'équipe ni exporter |
| Product Owner | `product_owner` | Accès lecture + écriture OKR et Dashboard · Lecture seule Niko-Niko, DORA, Skill Matrix |
| Coach Agile | `agile_coach` | Accès lecture totale tous outils · Peut lancer des générations IA (crédits décomptés sur son compte) · Aucune écriture sur les données équipe |
| Dev Team | `dev_team` | Saisie Niko-Niko (sa propre ligne) · Auto-évaluation Skill Matrix (sa propre colonne) · Lecture Dashboard · Pas d'accès OKR ni DORA |
| Invité | `guest` | Lecture seule · Aucune écriture · Aucune génération IA · Durée limitée (ex : audit externe) |

La matrice de droits doit être centralisée dans un fichier `lib/permissions.ts` unique — pas de logique de rôle dispersée dans les composants.

---

## QUOI — Invitations

Le Manager invite des membres par email. Le flux est :
1. Manager saisit un email + choisit un rôle dans la liste
2. Email d'invitation envoyé via Resend avec un lien tokenisé (expiration 72h)
3. Le destinataire clique → crée son compte ou se connecte → rejoint automatiquement l'équipe avec le rôle attribué
4. Token à usage unique — expiré après utilisation ou après 72h

Un Manager peut révoquer une invitation en attente ou changer le rôle d'un membre existant.

---

## QUOI — Protection des routes

Middleware Next.js (`middleware.ts`) qui :
- Redirige vers `/login` si non authentifié sur toute route protégée
- Vérifie le rôle avant d'accéder à certaines actions (pas seulement les pages)
- Routes protégées : `/dashboard`, `/retro`, `/skill-matrix`, `/dora`, `/okr`, `/niko-niko`, `/prompts`, `/parcours` (lecture libre mais certaines actions protégées)
- Routes publiques : `/`, `/manifesto`, `/retro` (1 génération gratuite sans compte)

Les vérifications de rôle sur les **actions serveur** (Server Actions ou API Routes) doivent être faites côté serveur, pas uniquement côté client.

---

## QUOI — UX Auth

- Page `/login` avec les deux options (Google + email/password) dans un composant unique
- Page `/register` uniquement accessible via lien d'invitation — pas d'auto-inscription ouverte (le SaaS est sur invitation)
- Page `/accept-invite/[token]` pour le flux d'acceptation d'invitation
- Après connexion : redirection vers `/dashboard` si Manager/SM, vers `/niko-niko` si Dev Team

---

## POURQUOI

### Better-auth
Choisi pour sa compatibilité native Next.js App Router, son support multi-tenant, et sa gestion des sessions sans dépendance externe payante (contrairement à Clerk).

### 6 rôles
Reflètent la réalité des équipes Scrum terrain : un Dev n'a pas besoin de voir les OKRs, un Coach Agile externe ne doit pas pouvoir modifier les données de l'équipe cliente. Des rôles trop grossiers (Manager/Membre) créent soit des sur-privilèges soit des blocages quotidiens.

### Matrice de droits centralisée
`lib/permissions.ts` évite la dette technique classique des rôles dispersés — dans 6 mois, quand on ajoute un 7ème outil, on modifie un seul fichier.

### Pas d'auto-inscription ouverte
Le SaaS cible des équipes constituées, pas le grand public. Chaque utilisateur doit appartenir à une équipe réelle avant d'accéder aux outils. Ça évite les comptes fantômes et protège les données d'équipe.

### Coach Agile en lecture
Répond à un cas réel : Salim lui-même interviendra chez des clients avec ce rôle — il doit pouvoir diagnostiquer sans risque de modifier les données du client.

---

## Livrables Attendus

1. **Configuration better-auth** (`lib/auth.ts` ou `app/api/auth/[...all]/route.ts`)
   - Config Google OAuth
   - Config email/password avec vérification
   - Session management
   - Adapter Supabase pour better-auth

2. **Schema Supabase (PostgreSQL)**
   
   Créer les tables suivantes via Supabase SQL Editor ou migrations :
   
   ```sql
   -- Enable UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Users table (extends Supabase auth.users)
   CREATE TABLE public.users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT UNIQUE NOT NULL,
     email_verified TIMESTAMPTZ,
     name TEXT,
     image TEXT,
     hashed_password TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Organizations table
   CREATE TABLE public.organizations (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Teams table
   CREATE TABLE public.teams (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Role enum
   CREATE TYPE public.role AS ENUM (
     'manager',
     'scrum_master',
     'product_owner',
     'agile_coach',
     'dev_team',
     'guest'
   );

   -- Team members table
   CREATE TABLE public.team_members (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
     team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
     role public.role DEFAULT 'dev_team',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id, team_id)
   );

   -- Invitations table
   CREATE TABLE public.invitations (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT NOT NULL,
     team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
     role public.role NOT NULL,
     token TEXT UNIQUE NOT NULL,
     expires_at TIMESTAMPTZ NOT NULL,
     used_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Indexes for performance
   CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
   CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
   CREATE INDEX idx_invitations_token ON public.invitations(token);
   CREATE INDEX idx_invitations_email ON public.invitations(email);

   -- RLS (Row Level Security) policies
   ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

   -- Users can read their own data
   CREATE POLICY "Users can view own data"
     ON public.users FOR SELECT
     USING (auth.uid() = id);

   -- Team members can view their team
   CREATE POLICY "Team members can view their teams"
     ON public.teams FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM public.team_members
         WHERE team_members.team_id = teams.id
         AND team_members.user_id = auth.uid()
       )
     );

   -- Similar policies for other tables...
   ```

3. **Matrice de permissions** (`lib/permissions.ts`)
   ```ts
   export const PERMISSIONS = {
     niko_niko: {
       read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest'],
       write: ['manager', 'scrum_master', 'dev_team'],
       write_own_only: ['dev_team'],
     },
     skill_matrix: {
       read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest'],
       write: ['manager', 'scrum_master'],
       write_own_only: ['dev_team'],
     },
     okr: {
       read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'guest'],
       write: ['manager', 'product_owner'],
     },
     dora: {
       read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'guest'],
       write: ['manager', 'scrum_master'],
     },
     retro: {
       read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest'],
       generate: ['manager', 'scrum_master', 'agile_coach'],
     },
     dashboard: {
       read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest'],
     },
     team_config: {
       read: ['manager', 'scrum_master', 'agile_coach', 'guest'],
       write: ['manager'],
     },
     export: {
       execute: ['manager'],
     },
   }

   export function canAccess(userRole: Role, resource: string, action: string): boolean {
     const permissions = PERMISSIONS[resource]
     if (!permissions) return false
     return permissions[action]?.includes(userRole) || false
   }
   ```

4. **Middleware** (`middleware.ts`)
   ```ts
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   import { getSession } from '@/lib/auth'

   const publicRoutes = ['/', '/manifesto', '/login', '/register', '/accept-invite']
   
   export async function middleware(request: NextRequest) {
     const { pathname } = request.nextUrl
     
     // Public routes
     if (publicRoutes.some(route => pathname.startsWith(route))) {
       return NextResponse.next()
     }
     
     // Protected routes
     const session = await getSession()
     if (!session) {
       return NextResponse.redirect(new URL('/login', request.url))
     }
     
     return NextResponse.next()
   }
   ```

5. **Pages Auth**
   - `/app/login/page.tsx`
   - `/app/register/page.tsx` (via invitation uniquement)
   - `/app/accept-invite/[token]/page.tsx`

6. **Supabase Client** (`lib/supabase.ts`)
   ```ts
   import { createClient } from '@supabase/supabase-js'

   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )

   // Server-side client with service role for admin operations
   export const supabaseAdmin = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   )
   ```

7. **Documentation**
   - `docs/AUTH.md` expliquant les rôles et permissions
   - `docs/INVITATION_FLOW.md` détaillant le processus d'invitation
   - `docs/SUPABASE_SETUP.md` pour les migrations et RLS policies

---

## Ordre d'Implémentation

1. **Setup Supabase** (tables + RLS policies + indexes)
2. **Setup better-auth** + Supabase adapter + Google OAuth + Email/Password
3. **Matrice permissions** (`lib/permissions.ts`)
4. **Middleware** de protection
5. **Pages auth** (login, register, accept-invite)
6. **Système d'invitations** (envoi email Resend)
7. **Tests** des flux complets

---

## Notes Importantes

- **Pas de JWT côté client** : better-auth gère les sessions via cookie HttpOnly sécurisé
- **Resend** est l'expéditeur email configuré pour le projet (invitations, réinitialisation mot de passe)
- **Un utilisateur peut avoir plusieurs rôles** s'il appartient à plusieurs équipes
- **Le rôle `agile_coach`** peut générer des rétros IA mais les crédits sont décomptés sur son compte, pas sur celui de l'équipe cliente
- **Mode démo** : 1 génération de rétro gratuite sans compte sur `/retro` (limitation IP ou cookie, pas de compte requis)
