-- Niko-Niko schema: organizations, teams, sprints, daily_moods, team_dashboard
-- Skip RLS for now - use supabaseAdmin in API with server-side checks
-- References "user" from better-auth (000_better_auth_base.sql)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ORGANIZATIONS & TEAMS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE public.team_role AS ENUM (
    'manager',
    'scrum_master',
    'product_owner',
    'agile_coach',
    'dev_team',
    'guest'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  role public.team_role DEFAULT 'dev_team',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

-- ==========================================
-- SPRINTS & METRICS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  number INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goal TEXT,
  committed_points INT,
  completed_points INT,
  status TEXT DEFAULT 'planning',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, number)
);

-- Daily moods (Niko-Niko) - member_id references team_members
CREATE TABLE IF NOT EXISTS public.daily_moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  mood INT NOT NULL CHECK (mood IN (1, 2, 3)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, date)
);

-- Team dashboard (6 cadrans)
CREATE TABLE IF NOT EXISTS public.team_dashboard (
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
-- INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_organization_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_sprints_team ON public.sprints(team_id);
CREATE INDEX IF NOT EXISTS idx_sprints_team_status ON public.sprints(team_id, status);
CREATE INDEX IF NOT EXISTS idx_daily_moods_team_date ON public.daily_moods(team_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_moods_member_date ON public.daily_moods(member_id, date);
CREATE INDEX IF NOT EXISTS idx_team_dashboard_team_sprint ON public.team_dashboard(team_id, sprint_id);
