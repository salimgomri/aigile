-- Sécurité prod : certains déploiements n’avaient pas appliqué 017.
-- Sans cette colonne, upsert orders (webhook, sync Stripe) échoue :
-- "Could not find the 'quantity' column of 'orders' in the schema cache"
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
