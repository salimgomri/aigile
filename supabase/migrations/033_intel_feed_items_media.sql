-- Sprint finition prod — médias & champs canoniques summary/content
ALTER TABLE intel_feed_items
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS content text;

UPDATE intel_feed_items SET summary = COALESCE(summary, preview_snippet) WHERE summary IS NULL;
UPDATE intel_feed_items SET content = COALESCE(content, transcript_text) WHERE content IS NULL;

COMMENT ON COLUMN intel_feed_items.thumbnail_url IS 'Miniature (YouTube maxres, RSS itunes:image, etc.)';
COMMENT ON COLUMN intel_feed_items.summary IS 'Résumé court aligné marketing / reader (sync preview_snippet)';
COMMENT ON COLUMN intel_feed_items.content IS 'Corps long (transcript YouTube, texte enrichi futur)';
