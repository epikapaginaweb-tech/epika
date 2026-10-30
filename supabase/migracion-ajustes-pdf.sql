-- Épika Academy · Ajustes del documento «Cambios no cumplidos».
-- Ejecutar en Supabase → SQL Editor (proyecto de Épika). Es seguro repetirlo.

-- 1) Testimonios de la página de Trafficker Digital PRO (del documento). No se duplican.
insert into public.testimonials (name, course, quote, authorized, visible, sort, course_id)
select v.name, v.place, v.quote, true, true, v.sort, c.id
from (values
  ('Karla Loor', 'Cuenca', 'Me gustó mucho que durante todo el programa me acompañaran tanto en administración como en docencia y me puedan aclarar cualquier duda que tenía, agradezco mucho la buena atención que tuvieron y espero sigan así en un futuro', 1),
  ('Sebastian Manzano', 'Riobamba', 'Muy satisfecho. Mi conocimiento se potenció y mis dudas en este campo fueron aclaradas. Siento que he mejorado como Trafficker Digital.', 2),
  ('David Herrera', 'Quito', 'Me gustó mucho que durante todo el programa me acompañaran tanto en administración como en docencia y me puedan aclarar cualquier duda que tenía, agradezco mucho la buena atención que tuvieron y espero sigan así en un futuro', 3)
) as v(name, place, quote, sort)
join public.courses c on c.slug = 'trafficker-digital-pro'
where not exists (
  select 1 from public.testimonials t where t.name = v.name and t.course_id = c.id
);

-- 2) Eslogan de «Próximamente»
update public.site_settings
set data = jsonb_set(coalesce(data, '{}'::jsonb), '{offer}',
  coalesce(data -> 'offer', '{}'::jsonb) || jsonb_build_object('comingSoonSlogan', 'Lo que se viene impulsará tu carrera al siguiente nivel. ¡Mantente atento!'))
where id = 1 and coalesce(data #>> '{offer,comingSoonSlogan}', '') in ('', 'Muy pronto más formas de aprender contigo.');


-- 3) Trafficker Digital PRO: texto «Acerca del programa» y 120 horas académicas, tal como indica el documento.
update public.courses set
  summary = 'El programa Trafficker Digital Pro está orientado a profesionales con experiencia previa en redes sociales que desean dar el siguiente paso en su carrera: dominar la pauta digital y el performance marketing en las principales plataformas del mercado.

Su objetivo es formar especialistas capaces de crear, optimizar y escalar campañas publicitarias en Meta Ads, TikTok Ads y Google Ads, aplicando estrategias basadas en datos y en el funcionamiento real de los algoritmos. El enfoque es práctico y aplicado, permitiendo que los participantes desarrollen competencias para diseñar creativos efectivos, analizar métricas clave, presentar resultados a clientes y aprovechar la inteligencia artificial en la publicidad digital.

A través de un enfoque interdisciplinario y actualizado, este programa prepara a los participantes para convertirse en traffickers digitales, capaces de generar resultados reales y sostenibles en cualquier modelo de negocio.',
  academic_hours = 120
where slug = 'trafficker-digital-pro';
