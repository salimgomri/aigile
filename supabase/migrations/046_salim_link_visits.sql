-- Visites des deux liens de la fiche S.A.L.I.M. (extrait et achat).
-- Écriture : service role via POST /api/salim/visite. Lecture : admin.

CREATE TABLE IF NOT EXISTS public.salim_link_visits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  link_slug   TEXT        NOT NULL CHECK (link_slug IN ('extrait', 'achat')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_salim_link_visits_slug_created
  ON public.salim_link_visits (link_slug, created_at DESC);

ALTER TABLE public.salim_link_visits ENABLE ROW LEVEL SECURITY;
