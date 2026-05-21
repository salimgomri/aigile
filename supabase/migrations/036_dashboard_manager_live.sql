-- Dashboard Manager — ouvert à tous immédiatement (déjà en prod via 035 invite-only)
UPDATE public.feature_flags
SET
  launch_at = '2020-01-01 00:00:00+00'::timestamptz,
  invite_only = false,
  updated_at = now()
WHERE slug = 'dashboard_manager';
