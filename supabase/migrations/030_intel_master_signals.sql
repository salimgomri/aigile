-- Sprint Intelligence — signal Master (vitality) pour pulse admin (service role / API admin uniquement).
CREATE TABLE intel_master_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key text NOT NULL,
  vitality_score numeric NOT NULL CHECK (vitality_score >= 0 AND vitality_score <= 100),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_key)
);

CREATE INDEX intel_master_signals_source_read_idx ON intel_master_signals (source_key) WHERE read_at IS NULL;

ALTER TABLE intel_master_signals ENABLE ROW LEVEL SECURITY;
