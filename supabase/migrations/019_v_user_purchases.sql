-- Vue agrégée des achats par acheteur (stats faciles)
CREATE OR REPLACE VIEW public.v_user_purchases AS
SELECT
  buyer_email,
  buyer_name,
  user_id,
  COUNT(*) AS total_orders,
  COUNT(*) FILTER (WHERE product_type = 'book_physical') AS books,
  COUNT(*) FILTER (WHERE product_type = 'credits_pack') AS credits_packs,
  COUNT(*) FILTER (WHERE product_type = 'subscription_monthly') AS pro_monthly,
  COUNT(*) FILTER (WHERE product_type = 'subscription_annual') AS pro_annual,
  COUNT(*) FILTER (WHERE product_type = 'day_pass') AS day_passes,
  SUM(amount_total) AS total_centimes,
  MIN(created_at) AS first_order_at,
  MAX(created_at) AS last_order_at
FROM public.orders
WHERE status IN ('paid', 'fulfilled', 'shipped')
GROUP BY buyer_email, buyer_name, user_id;
