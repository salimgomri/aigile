-- Westrum Culture Survey (DORA) — résultats utilisateur
-- user_id TEXT → Better Auth "user"(id), pas auth.users UUID

CREATE TABLE IF NOT EXISTS public.westrum_results (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT        NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  scores       JSONB       NOT NULL,
  score_moyen  NUMERIC(3,1) NOT NULL,
  niveau       TEXT        NOT NULL CHECK (niveau IN ('pathologique', 'bureaucratique', 'generative')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_westrum_results_user_created
  ON public.westrum_results (user_id, created_at DESC);

ALTER TABLE public.westrum_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS westrum_results_user ON public.westrum_results;
CREATE POLICY westrum_results_user ON public.westrum_results
  FOR ALL USING (auth.uid()::text = user_id);
