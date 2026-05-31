-- 040 — Fin de l'early access : tous les outils publics et déjà lancés.
-- invite_only = false  → accès ouvert à tous (plus d'invitation requise)
-- launch_at ramené dans le passé si encore dans le futur → outil "live" immédiatement.
UPDATE public.feature_flags
SET invite_only = false,
    launch_at = CASE WHEN launch_at > now() THEN now() ELSE launch_at END,
    updated_at = now();
