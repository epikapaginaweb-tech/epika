-- Épika Academy · Testimonios del inicio: suma los que vinieron en tu documento (página de Trafficker).
-- Ejecutar en Supabase → SQL Editor. No duplica.

insert into public.testimonials (name, course, quote, authorized, visible, sort, course_id)
select v.name, v.place, v.quote, true, true, v.sort, null
from (values
  ('Sebastian Manzano', 'Riobamba', 'Muy satisfecho. Mi conocimiento se potenció y mis dudas en este campo fueron aclaradas. Siento que he mejorado como Trafficker Digital.', 4),
  ('David Herrera', 'Quito', 'Me gustó mucho que durante todo el programa me acompañaran tanto en administración como en docencia y me puedan aclarar cualquier duda que tenía, agradezco mucho la buena atención que tuvieron y espero sigan así en un futuro', 5)
) as v(name, place, quote, sort)
where not exists (select 1 from public.testimonials t where t.name = v.name and t.course_id is null);
