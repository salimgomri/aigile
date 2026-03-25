-- Backfill tool_slug pour exports PDF scoring (aligné CREDIT_ACTIONS.scoring_pdf)
UPDATE public.credit_transactions
SET tool_slug = 'scoring-deliverable'
WHERE action IN ('scoring_pdf', 'scoring_deliverable')
  AND (tool_slug IS NULL OR tool_slug = 'scoring');
