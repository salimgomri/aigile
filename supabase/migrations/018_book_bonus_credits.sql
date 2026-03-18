-- Bonus 10 crédits pour acheteurs du livre S.A.L.I.M
-- Permet de tracker si le bonus a déjà été attribué (ex: à l'inscription)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS book_bonus_granted_at TIMESTAMPTZ;
