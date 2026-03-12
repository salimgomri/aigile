-- Allow service role (webhook backend) to insert orders
-- Le client service_role bypass normalement RLS, mais cette policy explicite
-- garantit que les inserts depuis l'API webhook fonctionnent.
CREATE POLICY "orders_service_insert" ON public.orders
FOR INSERT
TO service_role
WITH CHECK (true);
