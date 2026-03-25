-- Feature flags (lancement outils : date + teasers, éditable admin)
CREATE TABLE IF NOT EXISTS public.feature_flags (
  slug text PRIMARY KEY,
  label_fr text NOT NULL DEFAULT '',
  label_en text NOT NULL DEFAULT '',
  teaser_fr text,
  teaser_en text,
  launch_at timestamptz NOT NULL,
  tool_path text NOT NULL DEFAULT '/',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_launch ON public.feature_flags (launch_at);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feature_flags_select_public" ON public.feature_flags;
CREATE POLICY "feature_flags_select_public"
  ON public.feature_flags FOR SELECT
  USING (true);

-- Insert / update via service role (API admin) uniquement
INSERT INTO public.feature_flags (slug, label_fr, label_en, teaser_fr, teaser_en, launch_at, tool_path)
VALUES (
  'skill_matrix',
  'Skill Matrix',
  'Skill Matrix',
  'Cartographie des compétences agile et technique — pour équipes qui veulent grandir ensemble.',
  'Map agile and technical skills — for teams that grow together.',
  '2099-12-31 22:59:59+00'::timestamptz,
  '/skill-matrix'
)
ON CONFLICT (slug) DO NOTHING;

DROP TRIGGER IF EXISTS trg_feature_flags_updated_at ON public.feature_flags;
CREATE TRIGGER trg_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at();
