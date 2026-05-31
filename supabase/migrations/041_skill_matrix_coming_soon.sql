-- Skill Matrix pas encore développé : repasse en "bientôt" (date de lancement future).
-- Les autres outils restent ouverts (migration 040).
UPDATE public.feature_flags
SET launch_at = '2099-12-31 22:59:59+00'::timestamptz,
    invite_only = true,
    updated_at = now()
WHERE slug = 'skill_matrix';
