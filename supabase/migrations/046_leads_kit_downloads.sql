-- Leads (diagnostic + formation), inscrits kit, rate-limit, compteurs de téléchargement PDF.

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('diagnostic', 'formation')),
  name text,
  email text NOT NULL,
  company text,
  role text,
  motif text,
  formation_slug text,
  people_count text,
  period text,
  format text,
  message text,
  source text,
  utm jsonb DEFAULT '{}'::jsonb,
  from_param text,
  status text NOT NULL DEFAULT 'nouveau' CHECK (
    status IN ('nouveau', 'contacte', 'rdv_fait', 'devis_envoye', 'gagne', 'perdu')
  ),
  notes text,
  follow_up_at date,
  consent_at timestamptz,
  consent_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_type ON public.leads (type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (lower(email));

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.kit_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text,
  consent_kit boolean NOT NULL DEFAULT false,
  consent_kit_text text,
  consent_kit_at timestamptz,
  consent_news boolean NOT NULL DEFAULT false,
  consent_news_text text,
  consent_news_at timestamptz,
  source text,
  utm jsonb DEFAULT '{}'::jsonb,
  unsubscribe_token text UNIQUE,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_kit_subscribers_email ON public.kit_subscribers (lower(email));
CREATE INDEX IF NOT EXISTS idx_kit_subscribers_created ON public.kit_subscribers (created_at DESC);

ALTER TABLE public.kit_subscribers ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.lead_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  endpoint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_rate_ip ON public.lead_rate_limits (ip_hash, endpoint, created_at DESC);

ALTER TABLE public.lead_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.digital_downloads (
  session_id text NOT NULL,
  product_slug text NOT NULL,
  download_count integer NOT NULL DEFAULT 0,
  last_downloaded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, product_slug)
);

ALTER TABLE public.digital_downloads ENABLE ROW LEVEL SECURITY;
