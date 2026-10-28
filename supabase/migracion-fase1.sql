-- Épika Academy · Fase 1: datos de la tarjeta del catálogo.
-- Ejecutar UNA VEZ en Supabase → SQL Editor. Es seguro repetirlo: no borra ni cambia datos existentes.

alter table public.courses add column if not exists rating numeric(2,1) not null default 5;
alter table public.courses add column if not exists show_ecuador boolean not null default true;
alter table public.courses add column if not exists coming_soon boolean not null default false;

-- Testimonios iniciales del moodboard (no duplica si ya existen).
insert into public.testimonials (name, course, quote, authorized, visible, sort)
select v.name, v.course, v.quote, true, true, v.sort
from (values
  ('Karla Loor', 'Quito', 'Realmente fue un buen curso, me llevo un agradable sabor de este curso y más por el conocimiento impartido por el docente, fue de mucha ayuda para mi trabajo, realmente estoy muy agradecida por el conocimiento adquirido en este curso.', 1),
  ('Lady Mera', 'Guayaquil', 'Muy satisfecho. Mi conocimiento se potenció y mis dudas en este campo fueron aclaradas. Siento que he mejorado como Trafficker Digital.', 2),
  ('Alexander Cedeño', 'Cuenca', 'Fue una muy buena experiencia, realmente aprendí mucho sobre la publicidad pagada en redes sociales y canales digitales.', 3)
) as v(name, course, quote, sort)
where not exists (select 1 from public.testimonials t where t.name = v.name and t.quote = v.quote);

-- Brochures de los 3 programas activos (archivos incluidos en el sitio, carpeta /brochures)
-- y datos básicos tomados de cada brochure. Solo completa duración y horario si están vacíos.
update public.courses set
  brief_url = '/brochures/community-manager-y-publicidad-digital.pdf', brief_public = true, coming_soon = false,
  duration = coalesce(duration, '4 Semanas'),
  schedule = coalesce(schedule, 'Lunes, Miércoles y Viernes · 19:30 - 21:30')
where slug = 'community-manager-y-publicidad-digital';

update public.courses set
  brief_url = '/brochures/trafficker-digital-pro.pdf', brief_public = true, coming_soon = false,
  duration = coalesce(duration, '4 Semanas'),
  schedule = coalesce(schedule, 'Martes y Jueves 19:30 - 21:30 · Sábado 18:00 - 20:00')
where slug = 'trafficker-digital-pro';

update public.courses set
  brief_url = '/brochures/inteligencia-artificial-para-marketing-y-ventas.pdf', brief_public = true, coming_soon = false,
  duration = coalesce(duration, '4 Semanas'),
  schedule = coalesce(schedule, 'Lunes, Miércoles y Viernes · 19:30 - 21:30')
where slug = 'inteligencia-artificial-para-marketing-y-ventas';

-- Los demás quedan como «Próximamente» (difuminados, sin inscripción). Se cambia desde el panel.
update public.courses set coming_soon = true
where slug in ('diseno-grafico-publicitario-con-ia', 'especialista-en-talento-humano', 'asistente-contable-y-tributario');
