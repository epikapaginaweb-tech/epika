-- Épika Academy: categorías de programas (Programas / Seminarios / Otros) y moneda USD.
-- Ejecutar UNA VEZ en Supabase → SQL Editor, ANTES de usar el panel con la versión nueva.
-- Es seguro repetirlo: no borra ni modifica datos existentes.

alter table public.courses
  add column if not exists category text not null default 'programa';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'courses_category_check'
  ) then
    alter table public.courses
      add constraint courses_category_check check (category in ('programa', 'seminario', 'otro'));
  end if;
end $$;

alter table public.courses alter column currency set default 'USD';
