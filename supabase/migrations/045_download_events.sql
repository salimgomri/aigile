-- Téléchargements ressources publiques (guides, affiches, manifeste, etc.)

CREATE TABLE IF NOT EXISTS public.download_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT        REFERENCES public."user"(id) ON DELETE SET NULL,
  visitor_id  TEXT,
  asset       TEXT        NOT NULL,
  source      TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_download_events_asset_created
  ON public.download_events (asset, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_download_events_created
  ON public.download_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_download_events_user
  ON public.download_events (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;

-- Lecture : utilisateur connecté voit ses propres lignes uniquement
DROP POLICY IF EXISTS download_events_user_select ON public.download_events;
CREATE POLICY download_events_user_select ON public.download_events
  FOR SELECT USING (user_id IS NOT NULL AND auth.uid()::text = user_id);

-- Écriture : service role uniquement (API Next.js)

CREATE OR REPLACE VIEW public.v_download_events_with_user AS
SELECT
  de.id,
  de.user_id,
  de.visitor_id,
  de.asset,
  de.source,
  de.metadata,
  de.created_at,
  u.email AS user_email,
  u.name  AS user_name
FROM public.download_events de
LEFT JOIN public."user" u ON u.id = de.user_id;

CREATE OR REPLACE VIEW public.v_download_usage_global AS
SELECT
  asset,
  COUNT(*)::bigint AS total_downloads,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL)::bigint AS unique_users,
  COUNT(DISTINCT visitor_id) FILTER (WHERE visitor_id IS NOT NULL)::bigint AS unique_visitors,
  MIN(created_at) AS first_download_at,
  MAX(created_at) AS last_download_at
FROM public.download_events
GROUP BY asset;
