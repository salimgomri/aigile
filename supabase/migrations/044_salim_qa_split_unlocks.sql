-- Q&A Lab : déblocage réponse / fiche séparés

ALTER TABLE public.salim_qa_unlocks
  ADD COLUMN IF NOT EXISTS unlock_answer BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS unlock_fiche BOOLEAN NOT NULL DEFAULT false;

-- Anciens déblocages (1 crédit tout-en-un) → réponse + fiche
UPDATE public.salim_qa_unlocks
SET unlock_answer = true, unlock_fiche = true
WHERE unlock_answer = false AND unlock_fiche = false;

UPDATE public.credit_transactions
SET tool_slug = 'salim-qa'
WHERE action IN ('salim_qa_fiche', 'salim_qa_bundle')
  AND (tool_slug IS NULL OR tool_slug = '');
