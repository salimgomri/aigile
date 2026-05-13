-- Articles du digest quotidien (pubDate filtrée au calendrier fuseau digest, défaut Europe/Paris)
CREATE TABLE intel_feed_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_date date NOT NULL,
  tier_id text NOT NULL,
  source_label text NOT NULL,
  source_feed_url text NOT NULL,
  article_url text NOT NULL,
  title text NOT NULL,
  summary text,
  content text,
  published_at timestamptz NOT NULL,
  ingestion_kind text NOT NULL DEFAULT 'rss' CHECK (ingestion_kind IN ('rss', 'web_fallback')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_feed_url, article_url, digest_date)
);

CREATE INDEX intel_feed_articles_digest_date_idx ON intel_feed_articles (digest_date DESC);
CREATE INDEX intel_feed_articles_published_at_idx ON intel_feed_articles (published_at DESC);
CREATE INDEX intel_feed_articles_tier_digest_idx ON intel_feed_articles (tier_id, digest_date DESC);

ALTER TABLE intel_feed_articles ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE intel_feed_articles IS 'Veille « du jour » : un article par ligne, digest_date = jour calendaire (fuseau INTEL_DIGEST_TIMEZONE côté app).';
COMMENT ON COLUMN intel_feed_articles.digest_date IS 'Jour du digest (YYYY-MM-DD), aligné Europe/Paris par défaut.';
COMMENT ON COLUMN intel_feed_articles.published_at IS 'Horodatage issu du flux (pubDate / atom:published).';
