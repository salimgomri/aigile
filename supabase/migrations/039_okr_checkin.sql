-- OKR Check-in Sprint — saisie + synthèse IA (1 cr)

CREATE TABLE IF NOT EXISTS public.okr_sprint_checkins (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id      UUID        NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  sprint_id    UUID        NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
  user_id      TEXT        NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  avance       TEXT        NOT NULL,
  frein        TEXT        NOT NULL,
  ajustement   TEXT        NOT NULL,
  ai_summary   TEXT,
  ai_summary_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, sprint_id)
);

CREATE INDEX IF NOT EXISTS idx_okr_sprint_checkins_team_created
  ON public.okr_sprint_checkins (team_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_okr_sprint_checkins_sprint
  ON public.okr_sprint_checkins (sprint_id);

ALTER TABLE public.okr_sprint_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS okr_sprint_checkins_team_member ON public.okr_sprint_checkins;
CREATE POLICY okr_sprint_checkins_team_member ON public.okr_sprint_checkins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = okr_sprint_checkins.team_id
        AND tm.user_id = auth.uid()::text
    )
  );

-- Feature flag
INSERT INTO public.feature_flags (slug, label_fr, label_en, teaser_fr, teaser_en, launch_at, tool_path, invite_only)
VALUES (
  'okr_checkin',
  'OKR Check-in Sprint',
  'OKR Sprint Check-in',
  'Rituel de clôture Sprint Review — avancé, frein, ajustement OKR en 5 minutes.',
  'Sprint Review closing ritual — OKR advance, blocker, and adjustment in 5 minutes.',
  '2020-01-01 00:00:00+00'::timestamptz,
  '/okr-checkin',
  false
)
ON CONFLICT (slug) DO UPDATE SET
  label_fr = EXCLUDED.label_fr,
  label_en = EXCLUDED.label_en,
  teaser_fr = EXCLUDED.teaser_fr,
  teaser_en = EXCLUDED.teaser_en,
  launch_at = EXCLUDED.launch_at,
  tool_path = EXCLUDED.tool_path,
  invite_only = EXCLUDED.invite_only,
  updated_at = now();

UPDATE public.credit_transactions
SET tool_slug = 'okr-checkin'
WHERE action IN ('okr_checkin_summary', 'okr_checkin_create')
  AND (tool_slug IS NULL OR tool_slug = 'okr');

CREATE OR REPLACE VIEW public.v_okr_checkin_usage_with_user AS
SELECT
  c.id,
  c.team_id,
  c.sprint_id,
  c.user_id,
  u.email AS user_email,
  u.name AS user_name,
  s.number AS sprint_number,
  t.name AS team_name,
  c.created_at,
  c.ai_summary_at,
  (c.ai_summary IS NOT NULL) AS has_ai_summary
FROM public.okr_sprint_checkins c
LEFT JOIN public."user" u ON u.id = c.user_id
LEFT JOIN public.sprints s ON s.id = c.sprint_id
LEFT JOIN public.teams t ON t.id = c.team_id
ORDER BY c.created_at DESC;
