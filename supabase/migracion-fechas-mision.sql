-- Épika Academy · Fechas de inicio y culminación + Misión, Visión e introducción de Nosotros.
-- Ejecutar en Supabase → SQL Editor (proyecto de Épika). Es seguro repetirlo y solo llena lo que está vacío.
-- Todo se puede editar después desde el panel (Programas y Contenido).

-- 1) Columna nueva: fecha de culminación
alter table public.courses add column if not exists end_date date;

-- 2) Fechas (programas de 4 semanas, seminario de 1 semana, «Próximamente» en enero 2027)
update public.courses set start_date = coalesce(start_date, date '2026-11-05'), end_date = coalesce(end_date, date '2026-12-03')
where slug in ('community-manager-y-publicidad-digital', 'trafficker-digital-pro', 'inteligencia-artificial-para-marketing-y-ventas');

update public.courses set start_date = coalesce(start_date, date '2026-11-05'), end_date = coalesce(end_date, date '2026-11-11')
where slug = 'seminario-meta-ads';

update public.courses set start_date = coalesce(start_date, date '2027-01-12'), end_date = coalesce(end_date, date '2027-02-09')
where coming_soon = true;

-- 3) Nosotros: introducción, misión y visión
update public.site_settings
set data = jsonb_set(jsonb_set(coalesce(data, '{}'::jsonb), '{about}', coalesce(data -> 'about', '{}'::jsonb)), '{about,intro}', to_jsonb('Épika es una academia de capacitación que impulsa el crecimiento personal y profesional. Brindamos formación de calidad para que cada persona descubra su potencial, se supere y lidere su futuro con confianza y propósito.'::text))
where id = 1 and coalesce(data #>> '{about,intro}', '') = '';

update public.site_settings
set data = jsonb_set(jsonb_set(coalesce(data, '{}'::jsonb), '{about}', coalesce(data -> 'about', '{}'::jsonb)), '{about,mission}', to_jsonb('Impulsar el crecimiento personal y profesional de cada estudiante a través de programas 100% virtuales, prácticos y actualizados, guiados por profesionales en ejercicio, para que aprenda haciendo, aplique lo aprendido desde el primer día y lidere su futuro con confianza y propósito.'::text))
where id = 1 and coalesce(data #>> '{about,mission}', '') = '';

update public.site_settings
set data = jsonb_set(jsonb_set(coalesce(data, '{}'::jsonb), '{about}', coalesce(data -> 'about', '{}'::jsonb)), '{about,vision}', to_jsonb('Ser la academia virtual de referencia en Ecuador y Latinoamérica en formación práctica en marketing digital, inteligencia artificial y gestión empresarial, reconocida por una comunidad de egresados que genera resultados reales en sus trabajos, emprendimientos y empresas.'::text))
where id = 1 and coalesce(data #>> '{about,vision}', '') = '';
