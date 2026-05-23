-- Westrum Culture Survey — feature flag + suivi usage (tool_slug)

INSERT INTO public.feature_flags (slug, label_fr, label_en, teaser_fr, teaser_en, launch_at, tool_path, invite_only)
VALUES (
  'westrum',
  'Westrum Culture Survey',
  'Westrum Culture Survey',
  'Questionnaire DORA — mesure la culture organisationnelle (pathologique, bureaucratique, générative).',
  'DORA survey — measure organizational culture (pathological, bureaucratic, generative).',
  '2020-01-01 00:00:00+00'::timestamptz,
  '/dashboard/westrum',
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
SET tool_slug = 'westrum'
WHERE action = 'westrum_submit'
  AND (tool_slug IS NULL OR tool_slug = 'dashboard');

-- Vue admin : qui a passé le questionnaire, score et niveau
CREATE OR REPLACE VIEW public.v_westrum_usage_with_user AS
SELECT
  wr.id,
  wr.user_id,
  u.email AS user_email,
  u.name AS user_name,
  wr.score_moyen,
  wr.niveau,
  wr.created_at
FROM public.westrum_results wr
LEFT JOIN public."user" u ON u.id = wr.user_id
ORDER BY wr.created_at DESC;
