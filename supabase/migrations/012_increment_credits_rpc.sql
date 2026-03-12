-- Fonction atomique pour incrémenter les crédits (évite les race conditions)
-- Utilisée par le webhook Stripe pour credits_pack
CREATE OR REPLACE FUNCTION public.increment_credits(p_user_id TEXT, p_amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.user_credits
  SET credits_remaining = credits_remaining + p_amount,
      updated_at = now()
  WHERE user_id = p_user_id
    AND plan = 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
