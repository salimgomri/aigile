-- Signal Master initial : pulsation admin tant que non lu (vitality > 98).
-- ON CONFLICT DO NOTHING : ne réécrit pas une ligne déjà créée (ni après lecture).
INSERT INTO intel_master_signals (source_key, vitality_score, read_at)
VALUES ('master', 99, NULL)
ON CONFLICT (source_key) DO NOTHING;
