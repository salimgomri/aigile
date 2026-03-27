-- Demandes early access (landing) — validation admin → invite + promo + email

CREATE TABLE IF NOT EXISTS public.tool_early_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  tool_slug text NOT NULL DEFAULT 'scoring_deliverable',
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processed_by text
);

CREATE INDEX IF NOT EXISTS idx_tool_ea_pending ON public.tool_early_access_requests (created_at DESC)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_tool_ea_email_slug ON public.tool_early_access_requests (lower(email), tool_slug);

ALTER TABLE public.tool_early_access_requests ENABLE ROW LEVEL SECURITY;
