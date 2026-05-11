-- Sprint 3 — Moteur vitalité prédictif & items intel (rotation 7 jours)
CREATE TYPE intel_feed_item_status AS ENUM ('pending', 'analyzing', 'ready', 'error');

CREATE TABLE intel_feed_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id text NOT NULL,
  source_label text NOT NULL,
  url text NOT NULL,
  url_kind text NOT NULL DEFAULT 'web',
  vitality_score numeric NOT NULL CHECK (vitality_score >= 0 AND vitality_score <= 100),
  empire_boost_applied numeric NOT NULL DEFAULT 1.0,
  status intel_feed_item_status NOT NULL DEFAULT 'pending',
  preview_snippet text,
  transcript_text text,
  transcript_error text,
  analyst_started_at timestamptz,
  ready_at timestamptz,
  rotation_day date NOT NULL DEFAULT (timezone('UTC', now()))::date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tier_id, url, rotation_day)
);

CREATE INDEX intel_feed_items_rotation_day_idx ON intel_feed_items (rotation_day DESC);
CREATE INDEX intel_feed_items_status_idx ON intel_feed_items (status);
CREATE INDEX intel_feed_items_vitality_idx ON intel_feed_items (vitality_score DESC);

ALTER TABLE intel_feed_items ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE intel_feed_items IS 'Items Intelligence — vitalité, transcripts (yt-dlp), rotation journalière (rétention 7 j).';
