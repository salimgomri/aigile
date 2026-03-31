-- Commission / frais Stripe (centimes), depuis la balance transaction du paiement
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS stripe_fee_amount INTEGER;

COMMENT ON COLUMN public.orders.stripe_fee_amount IS 'Frais Stripe en centimes (fee sur balance transaction)';
