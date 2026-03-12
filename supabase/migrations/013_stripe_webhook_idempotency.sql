-- Idempotence webhook Stripe : éviter double traitement (crédits, emails)
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id TEXT PRIMARY KEY,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
