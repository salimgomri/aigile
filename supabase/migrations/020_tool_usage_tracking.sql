-- Tool usage tracking: tool_slug sur credit_transactions + vues stats
-- Solution A: évolution de credit_transactions (voir docs/ARCHITECTURE_TOOL_USAGE.md)

-- 1. Colonne tool_slug (retro, dora, okr, skill-matrix, dashboard)
ALTER TABLE public.credit_transactions
ADD COLUMN IF NOT EXISTS tool_slug TEXT;

-- 2. Index pour les requêtes par outil
CREATE INDEX IF NOT EXISTS idx_credit_transactions_tool_slug ON public.credit_transactions(tool_slug);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_tool_user ON public.credit_transactions(tool_slug, user_id);

-- 3. Backfill: mapping action → tool_slug (aligné avec CREDIT_ACTIONS)
UPDATE public.credit_transactions
SET tool_slug = CASE
  WHEN action IN ('retro_ai_plan', 'retro_random', 'retro_pdf') THEN 'retro'
  WHEN action IN ('dora_ai_reco', 'dora_pdf') THEN 'dora'
  WHEN action IN ('okr_ai_summary', 'okr_pdf') THEN 'okr'
  WHEN action IN ('skill_ai_reco', 'skill_pdf') THEN 'skill-matrix'
  WHEN action IN ('dashboard_narrative', 'dashboard_pdf') THEN 'dashboard'
  ELSE NULL
END
WHERE tool_slug IS NULL;

-- 4. Vue: usage par user et par outil (stats faciles)
CREATE OR REPLACE VIEW public.v_tool_usage_by_user AS
SELECT
  user_id,
  tool_slug,
  COUNT(*) AS usage_count,
  SUM(cost) AS credits_spent,
  MIN(created_at) AS first_used_at,
  MAX(created_at) AS last_used_at
FROM public.credit_transactions
WHERE tool_slug IS NOT NULL
GROUP BY user_id, tool_slug;

-- 5. Vue: détail par action (retro_ai_plan, retro_random, etc.)
CREATE OR REPLACE VIEW public.v_tool_usage_detail AS
SELECT
  user_id,
  tool_slug,
  action AS action_slug,
  cost AS credits_cost,
  plan_at_time,
  team_id,
  sprint_id,
  created_at
FROM public.credit_transactions
WHERE tool_slug IS NOT NULL
ORDER BY created_at DESC;

-- 6. Vue: stats globales par outil (pour admin)
CREATE OR REPLACE VIEW public.v_tool_usage_global AS
SELECT
  tool_slug,
  action AS action_slug,
  COUNT(*) AS total_uses,
  SUM(cost) AS total_credits_spent,
  COUNT(DISTINCT user_id) AS unique_users,
  MIN(created_at) AS first_used_at,
  MAX(created_at) AS last_used_at
FROM public.credit_transactions
WHERE tool_slug IS NOT NULL
GROUP BY tool_slug, action;

-- 7. Vue: qui a utilisé quoi, quand (avec email/nom)
CREATE OR REPLACE VIEW public.v_tool_usage_with_user AS
SELECT
  ct.user_id,
  u.email AS user_email,
  u.name AS user_name,
  ct.tool_slug,
  ct.action AS action_slug,
  ct.cost AS credits_cost,
  ct.plan_at_time,
  ct.created_at
FROM public.credit_transactions ct
LEFT JOIN public."user" u ON u.id = ct.user_id
WHERE ct.tool_slug IS NOT NULL
ORDER BY ct.created_at DESC;
