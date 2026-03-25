-- Invitations par outil (email) + licences crédits illimités (promo admin)

CREATE TABLE IF NOT EXISTS public.tool_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tool_invites_slug_email UNIQUE (tool_slug, email)
);

CREATE INDEX IF NOT EXISTS idx_tool_invites_slug ON public.tool_invites (tool_slug);
CREATE INDEX IF NOT EXISTS idx_tool_invites_email ON public.tool_invites (lower(email));

ALTER TABLE public.tool_invites ENABLE ROW LEVEL SECURITY;

-- Pas de policy SELECT/INSERT public : lecture/écriture via service role (API admin) uniquement

CREATE TABLE IF NOT EXISTS public.credit_promo_grants (
  email text PRIMARY KEY,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_promo_grants ENABLE ROW LEVEL SECURITY;

-- Accès outil réservé aux admins + liste d’invités (quand invite_only = true)
ALTER TABLE public.feature_flags
  ADD COLUMN IF NOT EXISTS invite_only boolean NOT NULL DEFAULT true;
