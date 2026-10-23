-- Programas iniciales de Épika Academy (solo nombre, "Próximamente").
-- Ejecutar en Supabase → SQL Editor. Es seguro repetirlo: no duplica los que ya existen.
-- Luego completa fechas, instructor, brochure e inversión desde /admin/programas.

insert into public.courses (slug, title, modality, short_description, visible, featured, sort) values
  ('community-manager-y-publicidad-digital', 'Community Manager y Publicidad Digital', 'virtual', 'Próximamente', true, false, 1),
  ('trafficker-digital-pro', 'Trafficker Digital PRO', 'virtual', 'Próximamente', true, false, 2),
  ('inteligencia-artificial-para-marketing-y-ventas', 'Inteligencia Artificial para Marketing y Ventas', 'virtual', 'Próximamente', true, false, 3),
  ('diseno-grafico-publicitario-con-ia', 'Diseño Gráfico Publicitario con IA', 'virtual', 'Próximamente', true, false, 4),
  ('especialista-en-talento-humano', 'Especialista en Talento Humano', 'virtual', 'Próximamente', true, false, 5),
  ('asistente-contable-y-tributario', 'Asistente Contable y Tributario', 'virtual', 'Próximamente', true, false, 6)
on conflict (slug) do nothing;
