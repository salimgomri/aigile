-- Renommage officiel : S.A.L.I.M. Q&A Lab

UPDATE public.feature_flags
SET
  label_fr = 'S.A.L.I.M. Q&A Lab',
  label_en = 'S.A.L.I.M. Q&A Lab',
  teaser_fr = 'Bibliothèque de questions du livre — réponses extraites ou complètes. 1 crédit par réponse.',
  teaser_en = 'Book question library — excerpt or full answers. 1 credit per answer.',
  updated_at = now()
WHERE slug = 'salim_qa';

UPDATE public.credit_transactions
SET tool_slug = 'salim-qa'
WHERE action = 'salim_qa_answer'
  AND (tool_slug IS NULL OR tool_slug = '');
