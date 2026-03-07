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

### 1. Configuration better-auth (`lib/auth.ts` ou `app/api/auth/[...all]/route.ts`)
   - Config Google OAuth
   - Config email/password avec vérification
   - Session management
   - **IMPORTANT:** Générer les tables better-auth d'abord (`npx better-auth generate`)

### 2. Schema Supabase (PostgreSQL)

**⚠️ ORDRE CRITIQUE:**
1. Laisser better-auth générer ses tables (`user`, `session`, `account`, `verification`)
2. Créer les tables métier qui référencent `user` créé par better-auth
3. Créer les policies RLS adaptées au système de session better-auth

#### 2.1 Tables Better-Auth (ÉTAPE OBLIGATOIRE D'ABORD)

**⚠️ CRITIQUE: Créer ces tables AVANT les tables métier**

Better-auth nécessite ces tables. Les créer manuellement pour éviter les conflits de typage :

```sql
-- ==========================================
-- BETTER-AUTH TABLES (créer en PREMIER)
-- ==========================================

-- User table (better-auth schema)
CREATE TABLE public.user (
  id TEXT PRIMARY KEY, -- better-auth utilise TEXT, pas UUID
  email TEXT UNIQUE NOT NULL,
  emailVerified BOOLEAN DEFAULT false,
  name TEXT,
  image TEXT,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Session table (better-auth)
CREATE TABLE public.session (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  expiresAt TIMESTAMPTZ NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Account table (better-auth - pour OAuth)
CREATE TABLE public.account (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  expiresAt TIMESTAMPTZ,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Verification table (better-auth - pour email verification)
CREATE TABLE public.verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt TIMESTAMPTZ NOT NULL,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes better-auth
CREATE INDEX idx_session_userId ON public.session(userId);
CREATE INDEX idx_account_userId ON public.account(userId);
CREATE INDEX idx_verification_identifier ON public.verification(identifier);
```

**Note:** Ces tables correspondent au schema better-auth. Si vous utilisez `npx better-auth generate`, vérifiez que le schema généré correspond exactement (notamment le type de `id` : TEXT vs UUID).

#### 2.2 Tables Métier Supabase

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ORGANIZATIONS & TEAMS
-- ==========================================

-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members (lien direct user ↔ org)
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role enum
CREATE TYPE public.team_role AS ENUM (
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
  user_id TEXT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  role public.team_role DEFAULT 'dev_team',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

-- Invitations table
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  role public.team_role NOT NULL,
  token TEXT UNIQUE NOT NULL,
  invited_by TEXT NOT NULL REFERENCES public.user(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SPRINTS & METRICS
-- ==========================================

-- Sprints table
CREATE TABLE public.sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  number INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goal TEXT,
  committed_points INT,
  completed_points INT,
  status TEXT DEFAULT 'planning', -- planning, active, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, number)
);

-- Daily moods (Niko-Niko)
CREATE TABLE public.daily_moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  mood INT NOT NULL CHECK (mood IN (1, 2, 3)), -- 1=bad, 2=ok, 3=good
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, date)
);

-- DORA entries
CREATE TABLE public.dora_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  deployment_frequency NUMERIC,
  lead_time_hours NUMERIC,
  change_failure_rate NUMERIC,
  recovery_time_hours NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OKR check-ins
CREATE TABLE public.okr_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  objective TEXT NOT NULL,
  key_results JSONB NOT NULL, -- [{ kr: "...", progress: 0-100 }]
  confidence INT CHECK (confidence BETWEEN 1 AND 10),
  blockers TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill assessments (Skill Matrix)
CREATE TABLE public.skill_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  skill_name TEXT NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 4), -- 0=none, 4=expert
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team dashboard (6 cadrans)
CREATE TABLE public.team_dashboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  on_time_score NUMERIC CHECK (on_time_score BETWEEN 0 AND 100),
  on_budget_score NUMERIC CHECK (on_budget_score BETWEEN 0 AND 100),
  on_scope_score NUMERIC CHECK (on_scope_score BETWEEN 0 AND 100),
  quality_score NUMERIC CHECK (quality_score BETWEEN 0 AND 100),
  maturity_score NUMERIC CHECK (maturity_score BETWEEN 0 AND 100),
  wellbeing_score NUMERIC CHECK (wellbeing_score BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, sprint_id)
);

-- ==========================================
-- CREDITS & PAYMENTS
-- ==========================================

-- User credits (IA generations)
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  balance INT DEFAULT 5,
  last_reset TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'free', -- free, pro, enterprise
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Day passes (Stripe)
CREATE TABLE public.day_passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  stripe_payment_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CONTENT
-- ==========================================

-- Prompt library (P1-P25)
CREATE TABLE public.prompt_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- P1, P2, ..., P25
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tier TEXT DEFAULT 'free', -- free, pro, enterprise
  category TEXT, -- retro, okr, dora, skill_matrix, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Glossary (tooltips livre)
CREATE TABLE public.glossary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term TEXT UNIQUE NOT NULL,
  definition TEXT NOT NULL,
  chapter_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Organization & Teams
CREATE INDEX idx_organization_members_user ON public.organization_members(user_id);
CREATE INDEX idx_organization_members_org ON public.organization_members(organization_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_invitations_token ON public.invitations(token);
CREATE INDEX idx_invitations_email ON public.invitations(email);

-- Sprints & Metrics
CREATE INDEX idx_sprints_team ON public.sprints(team_id);
CREATE INDEX idx_sprints_team_status ON public.sprints(team_id, status);
CREATE INDEX idx_daily_moods_team_date ON public.daily_moods(team_id, date);
CREATE INDEX idx_daily_moods_member_date ON public.daily_moods(member_id, date);
CREATE INDEX idx_dora_entries_team_sprint ON public.dora_entries(team_id, sprint_id);
CREATE INDEX idx_okr_checkins_team_sprint ON public.okr_checkins(team_id, sprint_id);
CREATE INDEX idx_skill_assessments_team_sprint ON public.skill_assessments(team_id, sprint_id);
CREATE INDEX idx_skill_assessments_member ON public.skill_assessments(member_id);
CREATE INDEX idx_team_dashboard_team_sprint ON public.team_dashboard(team_id, sprint_id);

-- Credits & Payments
CREATE INDEX idx_user_credits_user ON public.user_credits(user_id);
CREATE INDEX idx_day_passes_user_expires ON public.day_passes(user_id, expires_at);

-- Content
CREATE INDEX idx_prompt_library_code ON public.prompt_library(code);
CREATE INDEX idx_prompt_library_tier ON public.prompt_library(tier);
CREATE INDEX idx_glossary_term ON public.glossary(term);

-- ==========================================
-- TRIGGERS (updated_at auto-update)
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON public.invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON public.sprints FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_dora_entries_updated_at BEFORE UPDATE ON public.dora_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_okr_checkins_updated_at BEFORE UPDATE ON public.okr_checkins FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_skill_assessments_updated_at BEFORE UPDATE ON public.skill_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_team_dashboard_updated_at BEFORE UPDATE ON public.team_dashboard FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON public.user_credits FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_prompt_library_updated_at BEFORE UPDATE ON public.prompt_library FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_glossary_updated_at BEFORE UPDATE ON public.glossary FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- RLS (Row Level Security)
-- ==========================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dora_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

-- ⚠️ IMPORTANT: Ces policies utilisent un helper get_current_user_id()
-- à créer en fonction de l'intégration better-auth / Supabase
-- (pas auth.uid() qui ne fonctionnera pas avec better-auth)

-- Helper function (À ADAPTER selon l'intégration better-auth)
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT AS $$
BEGIN
  -- TODO: Récupérer le user_id depuis le token better-auth
  -- Peut nécessiter de parser le JWT ou d'utiliser current_setting()
  RETURN current_setting('app.current_user_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- RLS POLICIES - TEAMS & MEMBERS
-- ==========================================

-- Teams: SELECT
CREATE POLICY "select_own_teams" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = get_current_user_id()
    )
  );

-- Teams: INSERT (Manager org only)
CREATE POLICY "insert_teams_org_manager" ON public.teams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = teams.organization_id
      AND organization_members.user_id = get_current_user_id()
      AND organization_members.role = 'manager'
    )
  );

-- Teams: UPDATE (Manager team only)
CREATE POLICY "update_teams_manager" ON public.teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = get_current_user_id()
      AND team_members.role = 'manager'
    )
  );

-- Teams: DELETE (Manager team only)
CREATE POLICY "delete_teams_manager" ON public.teams
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = get_current_user_id()
      AND team_members.role = 'manager'
    )
  );

-- ==========================================
-- RLS POLICIES - SPRINTS
-- ==========================================

-- Sprints: SELECT (team members)
CREATE POLICY "select_sprints_team_members" ON public.sprints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = sprints.team_id
      AND team_members.user_id = get_current_user_id()
    )
  );

-- Sprints: INSERT (Manager, SM)
CREATE POLICY "insert_sprints_manager_sm" ON public.sprints
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = sprints.team_id
      AND team_members.user_id = get_current_user_id()
      AND team_members.role IN ('manager', 'scrum_master')
    )
  );

-- Sprints: UPDATE (Manager, SM)
CREATE POLICY "update_sprints_manager_sm" ON public.sprints
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = sprints.team_id
      AND team_members.user_id = get_current_user_id()
      AND team_members.role IN ('manager', 'scrum_master')
    )
  );

-- Sprints: DELETE (Manager only)
CREATE POLICY "delete_sprints_manager" ON public.sprints
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = sprints.team_id
      AND team_members.user_id = get_current_user_id()
      AND team_members.role = 'manager'
    )
  );

-- ==========================================
-- RLS POLICIES - DAILY MOODS (Niko-Niko)
-- ==========================================

-- Daily moods: SELECT (team members)
CREATE POLICY "select_moods_team_members" ON public.daily_moods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = daily_moods.team_id
      AND team_members.user_id = get_current_user_id()
    )
  );

-- Daily moods: INSERT (own data only for dev_team, all for manager/SM)
CREATE POLICY "insert_moods_own_or_manager" ON public.daily_moods
  FOR INSERT WITH CHECK (
    (
      -- Own data
      member_id IN (
        SELECT id FROM public.team_members
        WHERE user_id = get_current_user_id()
      )
    ) OR (
      -- Manager/SM can insert for others
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = daily_moods.team_id
        AND team_members.user_id = get_current_user_id()
        AND team_members.role IN ('manager', 'scrum_master')
      )
    )
  );

-- Daily moods: UPDATE (own data only for dev_team, all for manager/SM)
CREATE POLICY "update_moods_own_or_manager" ON public.daily_moods
  FOR UPDATE USING (
    (
      member_id IN (
        SELECT id FROM public.team_members
        WHERE user_id = get_current_user_id()
      )
    ) OR (
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = daily_moods.team_id
        AND team_members.user_id = get_current_user_id()
        AND team_members.role IN ('manager', 'scrum_master')
      )
    )
  );

-- Daily moods: DELETE (Manager only)
CREATE POLICY "delete_moods_manager" ON public.daily_moods
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = daily_moods.team_id
      AND team_members.user_id = get_current_user_id()
      AND team_members.role = 'manager'
    )
  );

-- ==========================================
-- RLS POLICIES - CONTENT (Public read)
-- ==========================================

-- Prompt library: SELECT (authenticated users)
CREATE POLICY "select_prompts_authenticated" ON public.prompt_library
  FOR SELECT USING (get_current_user_id() IS NOT NULL);

-- Glossary: SELECT (authenticated users)
CREATE POLICY "select_glossary_authenticated" ON public.glossary
  FOR SELECT USING (get_current_user_id() IS NOT NULL);

-- NOTE: Les policies pour dora_entries, okr_checkins, skill_assessments, 
-- team_dashboard, user_credits, day_passes suivent le même pattern
-- (SELECT = team members, INSERT/UPDATE = role-specific, DELETE = manager)
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

**⚠️ ORDRE CRITIQUE - SUIVRE STRICTEMENT :**

1. **Setup Supabase** (créer le projet + obtenir les credentials)

2. **Créer les tables better-auth EN PREMIER** (section 2.1 du schema SQL)
   ```sql
   -- Exécuter d'abord dans Supabase SQL Editor :
   CREATE TABLE public.user (...);
   CREATE TABLE public.session (...);
   CREATE TABLE public.account (...);
   CREATE TABLE public.verification (...);
   ```
   
3. **Créer les tables métier Supabase** (section 2.2 du schema SQL)
   ```sql
   -- Maintenant que public.user existe, les REFERENCES fonctionnent :
   CREATE TABLE public.organizations (...);
   CREATE TABLE public.teams (...);
   -- etc.
   ```

4. **Configurer better-auth** dans le code Next.js
   ```bash
   npm install better-auth
   ```
   Créer `lib/auth.ts` avec la config better-auth pointant vers Supabase

5. **Adapter `get_current_user_id()`** pour l'intégration better-auth/Supabase

6. **Matrice permissions** (`lib/permissions.ts`)

7. **Middleware** de protection

8. **Pages auth** (login, register, accept-invite)

9. **Système d'invitations** (envoi email Resend)

10. **Tests** des flux complets + vérification RLS policies

---

## Notes Importantes - Résolution Conflit better-auth / Supabase

**Problème:** better-auth gère ses propres tables (`user`, `session`, `account`, `verification`). Les policies RLS Supabase natives utilisent `auth.uid()` qui ne fonctionnera **pas** avec better-auth car il ne passe pas par le JWT Supabase natif.

**Solution:**

1. **Laisser better-auth générer ses tables d'abord** (`npx better-auth generate`)
2. **Ne PAS créer de table `public.users` manuellement** — better-auth crée `public.user`
3. **Créer un helper `get_current_user_id()`** qui extrait le `user_id` depuis le token better-auth :
   ```sql
   CREATE OR REPLACE FUNCTION get_current_user_id()
   RETURNS TEXT AS $$
   BEGIN
     -- Option 1: Via current_setting() si better-auth set le user_id
     RETURN current_setting('app.current_user_id', true);
     
     -- Option 2: Parser le JWT better-auth (à adapter selon leur format)
     -- Documentation: https://better-auth.com/docs/integrations/supabase
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```
4. **Toutes les policies RLS** doivent utiliser `get_current_user_id()` au lieu de `auth.uid()`
5. **Dans le middleware Next.js**, après authentification better-auth, set le `user_id` via :
   ```ts
   // middleware.ts ou lib/auth.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(url, key)
   await supabase.rpc('set_config', {
     parameter: 'app.current_user_id',
     value: session.userId
   })
   ```

**Références:**
- Documentation better-auth Supabase: https://better-auth.com/docs/integrations/supabase
- Alternative: Utiliser Supabase Auth natif au lieu de better-auth (mais perd les features better-auth)

---

## Notes Importantes

- **Pas de JWT côté client** : better-auth gère les sessions via cookie HttpOnly sécurisé
- **Resend** est l'expéditeur email configuré pour le projet (invitations, réinitialisation mot de passe)
- **Un utilisateur peut avoir plusieurs rôles** s'il appartient à plusieurs équipes
- **Le rôle `agile_coach`** peut générer des rétros IA mais les crédits sont décomptés sur son compte, pas sur celui de l'équipe cliente
- **Mode démo** : 1 génération de rétro gratuite sans compte sur `/retro` (limitation IP ou cookie, pas de compte requis)
