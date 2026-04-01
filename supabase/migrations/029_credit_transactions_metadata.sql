-- Contexte analytique optionnel (ex. pattern Rétro IA sur retro_ai_plan)
ALTER TABLE public.credit_transactions
  ADD COLUMN IF NOT EXISTS metadata jsonb;

COMMENT ON COLUMN public.credit_transactions.metadata IS
  'JSON optionnel, ex. {"retro_pattern_code":"P1"} pour retro_ai_plan';
