-- Promos crédits illimités par outil + fenêtre de validité + early adopter
-- Remplace credit_promo_grants (global).

CREATE TABLE IF NOT EXISTS public.tool_credit_promo_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  tool_slug text NOT NULL,
  expires_at timestamptz NOT NULL,
  early_adopter boolean NOT NULL DEFAULT true,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tool_credit_promo_grants_email_tool UNIQUE (email, tool_slug)
);

CREATE INDEX IF NOT EXISTS idx_tool_credit_promo_email ON public.tool_credit_promo_grants (lower(email));
CREATE INDEX IF NOT EXISTS idx_tool_credit_promo_slug ON public.tool_credit_promo_grants (tool_slug);
CREATE INDEX IF NOT EXISTS idx_tool_credit_promo_expires ON public.tool_credit_promo_grants (expires_at);

ALTER TABLE public.tool_credit_promo_grants ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'credit_promo_grants'
  ) THEN
    INSERT INTO public.tool_credit_promo_grants (email, tool_slug, expires_at, early_adopter, note, created_at)
    SELECT
      c.email,
      'skill_matrix',
      NOW() + interval '365 days',
      true,
      c.note,
      c.created_at
    FROM public.credit_promo_grants c
    WHERE NOT EXISTS (
      SELECT 1 FROM public.tool_credit_promo_grants t
      WHERE t.email = c.email AND t.tool_slug = 'skill_matrix'
    );
    DROP TABLE public.credit_promo_grants;
  END IF;
END $$;
