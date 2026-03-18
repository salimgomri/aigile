-- Vue macro : usage agrégé par outil (pour dashboard admin)
CREATE OR REPLACE VIEW public.v_tool_usage_macro AS
SELECT
  tool_slug,
  COUNT(*) AS total_uses,
  SUM(cost) AS total_credits_spent,
  COUNT(DISTINCT user_id) AS unique_users,
  MIN(created_at) AS first_used_at,
  MAX(created_at) AS last_used_at
FROM public.credit_transactions
WHERE tool_slug IS NOT NULL
GROUP BY tool_slug;
