-- Ajout de la colonne quantity pour les commandes (livre, etc.)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
