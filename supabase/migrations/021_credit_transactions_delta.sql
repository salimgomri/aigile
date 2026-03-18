-- Colonne delta pour afficher + et - dans l'historique crédits
-- delta > 0 = crédits ajoutés (bonus livre, pack)
-- delta < 0 = crédits consommés (usage outil)

ALTER TABLE public.credit_transactions
ADD COLUMN IF NOT EXISTS delta INTEGER;

-- Backfill: pour les consommations existantes (cost > 0), delta = -cost
UPDATE public.credit_transactions
SET delta = -cost
WHERE delta IS NULL AND cost > 0;

-- Pour les additions (book_bonus, credits_pack) insérées après cette migration,
-- delta sera positif. Pas de backfill pour elles (elles n'existent pas encore).
