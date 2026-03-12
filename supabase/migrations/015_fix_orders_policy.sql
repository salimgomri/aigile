-- Fix: policy peut déjà exister si 011 a été partiellement appliquée
DROP POLICY IF EXISTS "orders_own_select" ON public.orders;
CREATE POLICY "orders_own_select" ON public.orders FOR SELECT
  USING (user_id = auth.uid()::text OR buyer_email = auth.email());
