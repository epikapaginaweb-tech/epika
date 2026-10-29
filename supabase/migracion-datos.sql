-- Épika Academy · Datos que faltaban: cuenta Produbanco, precios, fechas y seminario Meta Ads.
-- Ejecutar en Supabase → SQL Editor (proyecto de Épika). Es seguro repetirlo.
-- Solo completa lo que está vacío: no pisa lo que ya editaste en el panel.

-- 1) Cuenta para transferir y correo de contacto
update public.site_settings
set data = jsonb_set(coalesce(data, '{}'::jsonb), '{bankAccounts}',
  '[{"bank": "Produbanco", "holder": "EPIKACADEMY S.A.S", "idNumber": "0691786832001", "accountType": "", "account": "12006889986"}]'::jsonb)
where id = 1 and coalesce(jsonb_array_length(data -> 'bankAccounts'), 0) = 0;

update public.site_settings
set data = jsonb_set(coalesce(data, '{}'::jsonb), '{email}', '"epikaacademiadecapacitacion@gmail.com"'::jsonb)
where id = 1 and coalesce(data ->> 'email', '') in ('', 'epikacademiadecapacitacion@gmail.com');

-- 2) Valores y fecha de inicio de los 3 programas activos (del moodboard: contado $129, crédito $150, inicio 05 nov 2026)
update public.courses set
  price = coalesce(price, 129),
  price_credit = coalesce(price_credit, 150),
  start_date = coalesce(start_date, date '2026-11-05')
where slug in ('community-manager-y-publicidad-digital', 'trafficker-digital-pro', 'inteligencia-artificial-para-marketing-y-ventas');

-- 3) Seminario Meta Ads (del moodboard)
insert into public.courses (slug, title, category, modality, short_description, summary, modules, duration, start_date,
  price, currency, certificate, academic_hours, rating, show_ecuador, coming_soon, visible, featured, sort, teacher_id)
select 'seminario-meta-ads', 'Meta Ads', 'seminario', 'virtual',
  'Aprende a pautar en Meta Ads desde cero y convierte datos en resultados.',
  'Este seminario está dirigido a emprendedores, dueños de negocio, community managers y cualquier persona que quiera aprender a pautar en Meta Ads desde cero, sin conocimientos previos de publicidad digital. Está pensado para quienes necesitan resultados prácticos y aplicables desde el día uno: crear su primera campaña, segmentar correctamente su público y, sobre todo, entender qué hacer con los datos después de publicar un anuncio, no solo cómo lanzarlo.',
  $json$[{"title": "Fundamentos de Meta Ads y estructura de campaña", "description": "Cómo funciona el Administrador de anuncios\nCampaña, conjunto de anuncios y anuncio\nElegir el objetivo correcto"}, {"title": "Tu primera campaña y segmentación del público", "description": "Públicos: intereses, personalizados y similares\nPresupuesto y ubicaciones\nPráctica guiada: lanzar tu primera campaña"}, {"title": "Leer los datos y tomar decisiones", "description": "Métricas clave: alcance, CTR, CPC, CPR\nQué hacer después de publicar un anuncio\nOptimizar, pausar o escalar"}]$json$::jsonb,
  '1 Semana', date '2026-11-05', 129, 'USD', 'Certificado de Aprobación', 40, 5, true, false, true, false, 10,
  (select id from public.teachers where name = 'Mgs. Jean Paulo Rocillo Alba' limit 1)
where not exists (select 1 from public.courses where slug = 'seminario-meta-ads');
