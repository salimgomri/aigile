-- P02b: Team & Member Management
-- organizations (owner_id, plan), teams (invite_code), ghost_members, invitations
-- Extends 002_niko_niko_schema

-- ==========================================
-- USER: onboarding_completed
-- ==========================================
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "onboarding_completed" BOOLEAN DEFAULT false;

-- ==========================================
-- ORGANIZATIONS: owner_id, plan
-- ==========================================
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS owner_id TEXT REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';

-- Backfill owner_id from first organization_members with role owner/member
UPDATE public.organizations o
SET owner_id = (
  SELECT om.user_id FROM public.organization_members om
  WHERE om.organization_id = o.id
  ORDER BY om.created_at ASC LIMIT 1
)
WHERE o.owner_id IS NULL;

-- ==========================================
-- TEAMS: invite_code, skill_config, dashboard_config
-- ==========================================
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS skill_config JSONB DEFAULT '[]';
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS dashboard_config JSONB DEFAULT '{}';

-- Generate invite_code for existing teams
UPDATE public.teams
SET invite_code = UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6))
WHERE invite_code IS NULL;

-- Enforce NOT NULL and UNIQUE
ALTER TABLE public.teams ALTER COLUMN invite_code SET NOT NULL;
ALTER TABLE public.teams ALTER COLUMN invite_code SET DEFAULT UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6));

-- ==========================================
-- TEAM_MEMBERS: joined_at (alias for created_at)
-- ==========================================
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW();
UPDATE public.team_members SET joined_at = created_at WHERE joined_at IS NULL;

-- ==========================================
-- GHOST_MEMBERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ghost_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  added_by TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  merged_into TEXT REFERENCES "user"("id") ON DELETE SET NULL,
  merged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ghost_members_team ON public.ghost_members(team_id);
CREATE INDEX IF NOT EXISTS idx_ghost_members_added_by ON public.ghost_members(added_by);

-- ==========================================
-- INVITATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'dev_team',
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '72 hours',
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_team ON public.invitations(team_id);

-- ==========================================
-- DAILY_MOODS: support ghost members
-- ghost_member_id nullable, member_id nullable when ghost
-- ==========================================
ALTER TABLE public.daily_moods ADD COLUMN IF NOT EXISTS ghost_member_id UUID REFERENCES public.ghost_members(id) ON DELETE CASCADE;
ALTER TABLE public.daily_moods ALTER COLUMN member_id DROP NOT NULL; -- allow null when ghost_member_id is set
-- Add constraint: one of member_id or ghost_member_id must be set
ALTER TABLE public.daily_moods ADD CONSTRAINT chk_daily_moods_member_or_ghost
  CHECK (
    (member_id IS NOT NULL AND ghost_member_id IS NULL) OR
    (member_id IS NULL AND ghost_member_id IS NOT NULL)
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_moods_ghost_date ON public.daily_moods(ghost_member_id, date) WHERE ghost_member_id IS NOT NULL;

-- ==========================================
-- TRIGGERS updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_organizations_updated_at ON public.organizations;
CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

DROP TRIGGER IF EXISTS trg_teams_updated_at ON public.teams;
CREATE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
