-- Dashboard Manager — feature flag + tool_slug backfill

INSERT INTO public.feature_flags (slug, label_fr, label_en, teaser_fr, teaser_en, launch_at, tool_path, invite_only)
VALUES (
  'dashboard_manager',
  'Dashboard Manager',
  'Dashboard Manager',
  'Tableau de bord manager S.A.L.I.M. — 6 cadrans RAG, vélocité, OKR et narrative IA (P25).',
  'S.A.L.I.M. manager dashboard — 6 RAG dials, velocity, OKRs and AI narrative (P25).',
  '2020-01-01 00:00:00+00'::timestamptz,
  '/dashboard-manager',
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
SET tool_slug = 'dashboard-manager'
WHERE action IN ('dashboard_narrative', 'dashboard_pdf')
  AND (tool_slug IS NULL OR tool_slug = 'dashboard');
