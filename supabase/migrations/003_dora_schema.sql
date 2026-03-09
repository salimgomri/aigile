-- DORA metrics schema: dora_entries, user_credits, team_dashboard extension
-- References teams, sprints from 002_niko_niko_schema.sql

-- ==========================================
-- DORA ENTRIES (manual form submissions)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.dora_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  deploy_freq NUMERIC NOT NULL,
  lead_time_hours NUMERIC NOT NULL,
  cfr_pct NUMERIC NOT NULL CHECK (cfr_pct >= 0 AND cfr_pct <= 100),
  mttr_hours NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT REFERENCES "user"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_dora_entries_team ON public.dora_entries(team_id);
CREATE INDEX IF NOT EXISTS idx_dora_entries_sprint ON public.dora_entries(sprint_id);
CREATE INDEX IF NOT EXISTS idx_dora_entries_created ON public.dora_entries(created_at);

-- ==========================================
-- USER CREDITS (for AI, PDF, Pro features)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  credits_remaining INT NOT NULL DEFAULT 5,
  last_reset TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_credits_user ON public.user_credits(user_id);

-- ==========================================
-- TEAM_DASHBOARD: add dora_quality_score (RAG from CFR)
-- ==========================================

ALTER TABLE public.team_dashboard
  ADD COLUMN IF NOT EXISTS dora_quality_score TEXT CHECK (dora_quality_score IN ('green', 'amber', 'red'));
