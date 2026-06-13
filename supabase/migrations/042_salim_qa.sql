-- Repères S.A.L.I.M. (Q&A) — déblocages, activités, feature flag

CREATE TABLE IF NOT EXISTS public.salim_qa_unlocks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT        NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  question_id  TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_salim_qa_unlocks_user
  ON public.salim_qa_unlocks (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.salim_qa_activities (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT        REFERENCES public."user"(id) ON DELETE SET NULL,
  visitor_id   TEXT,
  action       TEXT        NOT NULL,
  question_id  TEXT,
  query        TEXT,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_salim_qa_activities_user
  ON public.salim_qa_activities (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_salim_qa_activities_action
  ON public.salim_qa_activities (action, created_at DESC);

ALTER TABLE public.salim_qa_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salim_qa_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS salim_qa_unlocks_user ON public.salim_qa_unlocks;
CREATE POLICY salim_qa_unlocks_user ON public.salim_qa_unlocks
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS salim_qa_activities_user ON public.salim_qa_activities;
CREATE POLICY salim_qa_activities_user ON public.salim_qa_activities
  FOR SELECT USING (user_id IS NOT NULL AND auth.uid()::text = user_id);

INSERT INTO public.feature_flags (slug, label_fr, label_en, teaser_fr, teaser_en, launch_at, tool_path, invite_only)
VALUES (
  'salim_qa',
  'Repères S.A.L.I.M.',
  'S.A.L.I.M. Compass',
  'Les questions que tu te poses en agile — réponses extraites du Système S.A.L.I.M. 1 crédit par réponse.',
  'Agile questions you actually ask — answers from the S.A.L.I.M. System. 1 credit per answer.',
  '2020-01-01 00:00:00+00'::timestamptz,
  '/salim-qa',
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
SET tool_slug = 'salim-qa'
WHERE action = 'salim_qa_answer'
  AND tool_slug IS NULL;
