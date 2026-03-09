-- P10: À chaque inscription = 10 crédits. Corriger les utilisateurs déjà inscrits.
-- Schéma actuel: id, user_id, balance, last_reset, plan, created_at, updated_at

-- 1. Renommer balance -> credits_remaining (pour compatibilité avec le code)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_credits' AND column_name = 'balance')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_credits' AND column_name = 'credits_remaining') THEN
    ALTER TABLE public.user_credits RENAME COLUMN balance TO credits_remaining;
  END IF;
END $$;

-- 2. Ajouter colonnes manquantes
ALTER TABLE public.user_credits ADD COLUMN IF NOT EXISTS credits_used_total INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.user_credits ADD COLUMN IF NOT EXISTS monthly_reset_at TIMESTAMPTZ;
UPDATE public.user_credits SET monthly_reset_at = date_trunc('month', now()) + INTERVAL '1 month' WHERE monthly_reset_at IS NULL;
ALTER TABLE public.user_credits ALTER COLUMN monthly_reset_at SET NOT NULL;
ALTER TABLE public.user_credits ALTER COLUMN monthly_reset_at SET DEFAULT (date_trunc('month', now()) + INTERVAL '1 month');

-- 3. Insérer user_credits (10 crédits) pour tout user sans ligne
INSERT INTO public.user_credits (user_id, plan, credits_remaining, credits_used_total, monthly_reset_at)
SELECT 
  u.id,
  'free',
  10,
  0,
  date_trunc('month', now()) + INTERVAL '1 month'
FROM "user" u
WHERE NOT EXISTS (SELECT 1 FROM public.user_credits uc WHERE uc.user_id = u.id);

-- 4. Mettre à jour les free avec moins de 10 crédits
UPDATE public.user_credits
SET credits_remaining = 10
WHERE plan = 'free' AND credits_remaining < 10;
