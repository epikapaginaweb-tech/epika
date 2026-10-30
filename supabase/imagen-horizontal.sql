-- Épika Academy · Imagen horizontal por programa (página del programa y catálogo).
-- La imagen vertical (image_url) sigue usándose en el abanico del inicio. Es seguro repetirlo.
alter table public.courses add column if not exists banner_url text;
