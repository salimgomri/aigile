-- Table unifiée des commandes (tous types: livre, crédits, abonnements, day pass)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Produit
  product_id TEXT NOT NULL,
  product_type TEXT NOT NULL,
  product_title TEXT NOT NULL,

  -- Acheteur
  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,

  -- Livraison (nullable si produit numérique)
  shipping_name TEXT,
  shipping_address1 TEXT,
  shipping_address2 TEXT,
  shipping_city TEXT,
  shipping_postal TEXT,
  shipping_country TEXT,
  shipping_phone TEXT,
  shipping_fee INTEGER DEFAULT 0,
  in_person_pickup BOOLEAN DEFAULT false,

  -- Paiement
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  stripe_subscription_id TEXT,
  amount_subtotal INTEGER NOT NULL,
  amount_discount INTEGER DEFAULT 0,
  amount_shipping INTEGER DEFAULT 0,
  amount_total INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  coupon_code TEXT,

  -- Fulfillment
  status TEXT NOT NULL DEFAULT 'pending',
  fulfilled_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  tracking_number TEXT,
  fulfillment_ref TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_product_type ON public.orders(product_type);
CREATE INDEX IF NOT EXISTS idx_orders_session ON public.orders(stripe_session_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_own_select" ON public.orders;
CREATE POLICY "orders_own_select" ON public.orders FOR SELECT
  USING (user_id = auth.uid()::text OR buyer_email = auth.email());
