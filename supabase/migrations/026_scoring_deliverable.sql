-- P1 — Scoring Deliverable (aigile.lu)
-- user_id = TEXT → "user"(id) Better Auth (pas auth.users UUID)
-- Crédits : user_credits.credits_remaining, credit_transactions (action, cost, delta, plan_at_time, tool_slug)

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.scoring_sessions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        TEXT        NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,

  team_name      TEXT,
  sprint_number  TEXT,
  sprint_end_date DATE,

  org_context      TEXT,
  scope            TEXT,
  respondent_role  TEXT,
  detail_level     TEXT,
  ia_cadrage_raw   TEXT,
  ia_dimension_active BOOLEAN DEFAULT false,

  excluded_dimensions TEXT[],

  score_global  NUMERIC(5,1),
  rag_global    TEXT,

  score_d0 NUMERIC(5,1), rag_d0 TEXT,
  score_d1 NUMERIC(5,1), rag_d1 TEXT,
  score_d2 NUMERIC(5,1), rag_d2 TEXT,
  score_d3 NUMERIC(5,1), rag_d3 TEXT,
  score_d4 NUMERIC(5,1), rag_d4 TEXT,
  score_d5 NUMERIC(5,1), rag_d5 TEXT,
  score_d6 NUMERIC(5,1), rag_d6 TEXT,
  score_d7 NUMERIC(5,1), rag_d7 TEXT,
  score_d8 NUMERIC(5,1), rag_d8 TEXT,

  CONSTRAINT rag_global_chk CHECK (rag_global IS NULL OR rag_global IN ('red','orange','green','capped_orange')),
  CONSTRAINT rag_d0_chk CHECK (rag_d0 IS NULL OR rag_d0 IN ('red','orange','green','capped_orange','na')),
  CONSTRAINT rag_d1_chk CHECK (rag_d1 IS NULL OR rag_d1 IN ('red','orange','green','capped_orange','na')),
  CONSTRAINT rag_d2_chk CHECK (rag_d2 IS NULL OR rag_d2 IN ('red','orange','green','capped_orange','na')),
  CONSTRAINT rag_d3_chk CHECK (rag_d3 IS NULL OR rag_d3 IN ('red','orange','green','capped_orange','na')),
  CONSTRAINT rag_d4_chk CHECK (rag_d4 IS NULL OR rag_d4 IN ('red','orange','green','capped_orange','na')),
  CONSTRAINT rag_d5_chk CHECK (rag_d5 IS NULL OR rag_d5 IN ('red','orange','green','capped_orange','na')),
  CONSTRAINT rag_d6_chk CHECK (rag_d6 IS NULL OR rag_d6 IN ('red','orange','green','capped_orange','na')),
  CONSTRAINT rag_d7_chk CHECK (rag_d7 IS NULL OR rag_d7 IN ('red','orange','green','capped_orange','na')),
  CONSTRAINT rag_d8_chk CHECK (rag_d8 IS NULL OR rag_d8 IN ('red','orange','green','capped_orange','na')),

  blocking_rule_applied    BOOLEAN DEFAULT false,
  blocking_criticals_count INTEGER DEFAULT 0,

  weights_used   JSONB,
  critical_flags TEXT[],

  report_markdown  TEXT,
  credits_consumed INTEGER DEFAULT 2,

  status       TEXT        DEFAULT 'draft' CHECK (status IN ('draft','complete','archived')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,

  CONSTRAINT score_set_when_complete CHECK (status != 'complete' OR score_global IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.scoring_answers (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID        NOT NULL REFERENCES public.scoring_sessions(id) ON DELETE CASCADE,
  dimension_id TEXT        NOT NULL,
  question_id  TEXT        NOT NULL,
  answer_key   TEXT        NOT NULL,
  score_value  NUMERIC(5,1) NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT scoring_answers_session_question UNIQUE (session_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.scoring_metrics_log (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                TEXT        NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  session_id             UUID        REFERENCES public.scoring_sessions(id) ON DELETE SET NULL,
  event_type             TEXT        NOT NULL CHECK (event_type IN ('session_started','session_completed')),
  score_global           NUMERIC(5,1),
  rag_global             TEXT,
  blocking_rule_applied  BOOLEAN,
  org_context            TEXT,
  ia_active              BOOLEAN,
  dimensions_red_count   INTEGER,
  dimensions_green_count INTEGER,
  critical_flags_count   INTEGER,
  created_at             TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. Vue (pas d’ORDER BY — tri côté app)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.scoring_trends AS
SELECT
  s.user_id, s.team_name, s.sprint_number, s.sprint_end_date,
  s.score_global, s.rag_global, s.blocking_rule_applied,
  s.score_d0, s.score_d1, s.score_d2, s.score_d3,
  s.score_d4, s.score_d5, s.score_d6, s.score_d7, s.score_d8,
  ROW_NUMBER() OVER (PARTITION BY s.user_id, s.team_name ORDER BY s.completed_at) AS sprint_index,
  s.completed_at
FROM public.scoring_sessions s
WHERE s.status = 'complete';

-- ---------------------------------------------------------------------------
-- 3. RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.scoring_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_answers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_metrics_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_sessions" ON public.scoring_sessions;
CREATE POLICY "users_own_sessions" ON public.scoring_sessions
  FOR ALL USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "users_own_answers" ON public.scoring_answers;
CREATE POLICY "users_own_answers" ON public.scoring_answers
  FOR ALL USING (
    auth.uid()::text = (SELECT ss.user_id FROM public.scoring_sessions ss WHERE ss.id = session_id)
  );

DROP POLICY IF EXISTS "users_own_metrics" ON public.scoring_metrics_log;
CREATE POLICY "users_own_metrics" ON public.scoring_metrics_log
  FOR ALL USING (auth.uid()::text = user_id);

-- ---------------------------------------------------------------------------
-- 4. Débit crédits (schéma réel user_credits + credit_transactions)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.debit_credits_for_scoring(
  p_user_id    TEXT,
  p_session_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current   INTEGER;
  v_required  INTEGER := 2;
  v_plan      TEXT;
BEGIN
  IF p_session_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'session_id_required');
  END IF;

  BEGIN
    SELECT credits_remaining, plan INTO v_current, v_plan
    FROM public.user_credits
    WHERE user_id = p_user_id
    FOR UPDATE NOWAIT;
  EXCEPTION
    WHEN SQLSTATE '55P03' THEN
      RETURN jsonb_build_object('success', false, 'error', 'lock_unavailable');
  END;

  IF v_current IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'user_not_found');
  END IF;

  IF v_current < v_required THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'current', v_current,
      'required', v_required
    );
  END IF;

  UPDATE public.user_credits
  SET
    credits_remaining = credits_remaining - v_required,
    credits_used_total = credits_used_total + v_required,
    updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO public.credit_transactions (
    user_id,
    action,
    cost,
    delta,
    plan_at_time,
    tool_slug,
    team_id,
    sprint_id
  ) VALUES (
    p_user_id,
    'scoring_deliverable',
    v_required,
    -v_required,
    COALESCE(v_plan, 'free'),
    'scoring',
    NULL,
    NULL
  );

  RETURN jsonb_build_object(
    'success', true,
    'debited', v_required,
    'remaining', v_current - v_required
  );
END;
$$;

REVOKE ALL ON FUNCTION public.debit_credits_for_scoring(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.debit_credits_for_scoring(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.debit_credits_for_scoring(TEXT, UUID) TO service_role;

-- ---------------------------------------------------------------------------
-- 5. Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_ss_user_id    ON public.scoring_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ss_created_at ON public.scoring_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ss_status     ON public.scoring_sessions(status);
CREATE INDEX IF NOT EXISTS idx_ss_user_draft ON public.scoring_sessions(user_id, created_at DESC) WHERE status = 'draft';
CREATE INDEX IF NOT EXISTS idx_sa_session_id ON public.scoring_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_sa_dimension  ON public.scoring_answers(dimension_id);
CREATE INDEX IF NOT EXISTS idx_sml_user      ON public.scoring_metrics_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sml_created   ON public.scoring_metrics_log(created_at DESC);

-- ---------------------------------------------------------------------------
-- 6. Feature flag — lancement 9 avril 2026, 10:00 (Europe centrale ≈ 08:00 UTC)
-- ---------------------------------------------------------------------------

INSERT INTO public.feature_flags (slug, label_fr, label_en, teaser_fr, teaser_en, launch_at, tool_path, invite_only)
VALUES (
  'scoring_deliverable',
  'Scoring livraison',
  'Delivery scoring',
  'Mesurez la maturité de livraison logicielle — dimensions critiques, quality gate, tendances sprint après sprint.',
  'Measure software delivery maturity — critical dimensions, quality gate, sprint-over-sprint trends.',
  '2026-04-09 08:00:00+00'::timestamptz,
  '/scoring',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  label_fr   = EXCLUDED.label_fr,
  label_en   = EXCLUDED.label_en,
  teaser_fr  = EXCLUDED.teaser_fr,
  teaser_en  = EXCLUDED.teaser_en,
  launch_at  = EXCLUDED.launch_at,
  tool_path  = EXCLUDED.tool_path,
  invite_only = EXCLUDED.invite_only,
  updated_at = now();
