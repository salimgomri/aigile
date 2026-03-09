-- P10: Quota initial 10 crédits (au lieu de 5)
ALTER TABLE public.user_credits
  ALTER COLUMN credits_remaining SET DEFAULT 10;

-- Mise à jour des utilisateurs free qui ont moins de 10 crédits
UPDATE public.user_credits
SET credits_remaining = 10
WHERE plan = 'free' AND credits_remaining < 10;
