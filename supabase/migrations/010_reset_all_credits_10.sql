-- Réaffecter 10 crédits à tous les utilisateurs free
UPDATE public.user_credits
SET credits_remaining = 10
WHERE plan = 'free';
