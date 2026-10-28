-- Épika Academy · Fase 2: página del curso, inscripción y testimonios por programa.
-- Ejecutar en Supabase → SQL Editor DESPUÉS de migracion-fase1.sql. Es seguro repetirlo.

-- 1) Columnas nuevas
alter table public.courses add column if not exists price_credit numeric(12, 2);
alter table public.courses add column if not exists cash_note text;
alter table public.courses add column if not exists credit_note text;
alter table public.courses add column if not exists academic_hours int;

alter table public.testimonials add column if not exists course_id uuid references public.courses(id) on delete set null;
create index if not exists testimonials_course_idx on public.testimonials (course_id);

alter table public.inquiries add column if not exists birth_date date;
alter table public.inquiries add column if not exists education text;
alter table public.inquiries add column if not exists city text;
alter table public.inquiries add column if not exists address text;

-- 2) Ponente de los brochures (no se duplica)
insert into public.teachers (name, headline, bio, visible, sort)
select 'Mgs. Jean Paulo Rocillo Alba',
       'Especialista en IA aplicada al Marketing y Ventas · Instructor internacional',
       'Especialista en Negocios Internacionales y en Marketing Digital, con enfoque en estrategias comerciales y publicidad digital de alto rendimiento. Se desempeña como mentor, consultor y trafficker digital, ayudando a emprendedores, marcas y empresas a escalar sus ventas mediante estrategias digitales enfocadas en resultados reales.

Cuenta con formación en Negocios Internacionales y una Maestría en Gestión de Proyectos, combinando visión estratégica, análisis de mercado y ejecución comercial orientada al crecimiento empresarial.

Ha liderado estrategias de captación, posicionamiento y ventas para clientes de Ecuador, España y México, trabajando con distintos modelos de negocio, marcas personales, servicios profesionales, educación y e-commerce.

A lo largo de su trayectoria ha gestionado más de $100.000 USD en campañas publicitarias en plataformas como Meta Ads, Google Ads y TikTok Ads, generando crecimiento en facturación, posicionamiento de marca y adquisición de clientes para diferentes empresas y emprendimientos.

Su experiencia integra estrategia digital, producción audiovisual, copywriting y escalamiento publicitario. Actualmente comparte sus conocimientos como instructor y consultor en marketing digital, enseñando metodologías prácticas para crear campañas rentables, construir marcas sólidas y aumentar ventas en el entorno digital.',
       true, 1
where not exists (select 1 from public.teachers where name = 'Mgs. Jean Paulo Rocillo Alba');

-- 3) Contenido de los 3 programas (tomado de los brochures). Solo llena lo que está vacío,
--    así no pisa lo que ya editaste en el panel.

update public.courses set
  summary = coalesce(nullif(summary, ''), 'El programa está dirigido a quienes buscan dominar la gestión de redes sociales, crear contenido estratégico y lanzar campañas digitales con resultados medibles. Mediante nuestra metodología 100% práctica, desarrollarás habilidades para posicionar marcas y construir comunidades online desde un enfoque creativo.'),
  objectives = case when cardinality(objectives) = 0 then array['Gestión de redes sociales', 'Uso de herramientas digitales', 'Publicidad digital', 'Medición de resultados']::text[] else objectives end,
  includes = case when cardinality(includes) = 0 then array['Clases en vivo (quedan grabadas)', 'Campus virtual', 'Triple certificación', 'Work Kit']::text[] else includes end,
  modules = case when jsonb_array_length(modules) = 0 then $json$[{"title": "El Rol del Community Manager", "description": "Qué hace un CM y qué no hace\nTipos de contenido y objetivos por red social\nCaso práctico: análisis de una marca en redes sociales"}, {"title": "Copywriting persuasivo, ganchos y CTA efectivos", "description": "¿Qué es copywriting y por qué es clave en el marketing digital?\nFórmulas de copywriting más usadas\n¿Qué es un gancho y por qué lo necesitas? Tipos de ganchos\n¿Qué es un CTA y qué lo hace funcional? Tipos de CTA\nRedacción práctica de copys para distintos formatos"}, {"title": "Parrilla de contenidos y calendario editorial", "description": "Parrilla vs. calendario\nTipos de contenido\nHerramientas profesionales: Trello, Notion, Metricool\nTaller práctico"}, {"title": "Diseño y edición para redes", "description": "Diseño visual para redes con Canva\nFotografía y edición básica con Lightroom\nEdición de videos cortos con CapCut"}, {"title": "Publicidad en Meta Ads (Facebook e Instagram)", "description": "Estructura de campaña: objetivos, públicos, ubicaciones, presupuesto\nTipos de segmentación\nMeta Advantage+ y Andrómeda\nPráctica guiada: creación de una campaña en Meta Ads Manager"}, {"title": "Publicidad en TikTok Ads", "description": "Cómo funciona TikTok Ads\nTipos de campaña\nCreativos que funcionan en TikTok\nDiferencia entre contenido orgánico y anuncios\nPráctica guiada: diseño de una campaña creativa"}, {"title": "Publicidad en Google Ads", "description": "Tipos de campañas (Search, YouTube, Display, campañas locales)\nEstructura de una campaña efectiva\nFunnels de conversión\nPráctica guiada: simulación de una campaña"}, {"title": "Analítica digital y KPIs", "description": "Métricas clave: CTR, CPC, ROAS, CPA, alcance, frecuencia\nHerramientas: Google Analytics y Metricool\nInterpretación y toma de decisiones"}, {"title": "IA en marketing + prompt engineering", "description": "¿Qué es la IA y cómo está revolucionando el marketing digital?\nQué es un prompt y cómo estructurarlo\nTipos de prompts: branding, social media, pauta, storytelling\nHerramientas actuales\nUso ético y auténtico de la IA"}]$json$::jsonb else modules end,
  certificate = coalesce(nullif(certificate, ''), 'Triple Certificación
Community Manager · 40 horas académicas
Creación de Contenido Digital · 40 horas académicas
Publicidad Digital · 40 horas académicas'),
  academic_hours = coalesce(academic_hours, 40),
  modality = 'virtual'
where slug = 'community-manager-y-publicidad-digital';

update public.courses set
  summary = coalesce(nullif(summary, ''), 'El programa Trafficker Digital PRO está diseñado para quienes ya cuentan con experiencia previa en gestión de redes sociales y desean dar el siguiente paso profesional: dominar la pauta digital a nivel estratégico y de performance.'),
  objectives = case when cardinality(objectives) = 0 then array['Creación de campañas publicitarias profesionales', 'Optimización de anuncios', 'Análisis de resultados', 'Dominio de algoritmos', 'Escalamiento de campañas']::text[] else objectives end,
  includes = case when cardinality(includes) = 0 then array['Clases en vivo (quedan grabadas)', 'Campus virtual', 'Triple certificación', 'Work Kit']::text[] else includes end,
  modules = case when jsonb_array_length(modules) = 0 then $json$[{"title": "Publicidad en Meta Ads (Facebook & Instagram)", "description": "Estructura moderna de campañas publicitarias\nElección estratégica de objetivos según resultados\nCreativos publicitarios que convierten\nTesting de anuncios y optimización\nGestión de presupuestos\nSeñales de fatiga publicitaria\nLectura e interpretación de métricas clave\nMeta Pixel y Conversions API (CAPI): tracking server-side\nReglas de valor: optimización por rentabilidad\nAudiencias Lookalike y personalizadas (remarketing, CRM, engagement)\nCampañas de mensajes (Click-to-WhatsApp) y remarketing por conversación\nEscalamiento vertical y horizontal\nCPR como métrica central de decisión (umbrales, cuándo pausar o escalar)"}, {"title": "Publicidad en TikTok Ads", "description": "Funcionamiento del algoritmo de TikTok Ads\nCreativos tipo UGC y anuncios nativos\nHooks publicitarios efectivos\nTesting rápido de anuncios\nDiferencia entre viralidad y conversión\nMétricas clave en TikTok Ads\nOptimización de campañas\nPreparación de artes finales para publicación"}, {"title": "Publicidad en Google Ads", "description": "Campañas orientadas a intención de compra y embudo de ventas aplicado\nEstructura correcta de campañas\nSelección de palabras clave\nAnuncios efectivos según búsqueda\nTracking de conversiones\nErrores comunes que generan pérdidas"}, {"title": "LinkedIn Ads", "description": "Fundamentos: qué es LinkedIn Ads, cuándo usarlo y audiencia disponible en Ecuador\nCuenta en Campaign Manager: requisitos y creación (moneda USD)\nEstructura de la campaña: grupo de campañas, campaña, anuncio y objetivo\nSegmentación: ubicación, cargo, industria y tamaño de empresa; audiencia mínima y cómo ampliarla\nFormato y anuncio: imagen única, video y redacción\nPresupuesto y puja: diario vs. total y estrategia básica"}, {"title": "Análisis de métricas y performance", "description": "KPIs según objetivo de campaña\nMétricas clave\nInterpretación de resultados\nToma de decisiones basada en datos\nHerramientas de análisis\nIdentificación de anuncios ganadores y fallidos"}, {"title": "Reportes y presentación de resultados (flow de medios)", "description": "Cómo presentar resultados a clientes\nQué métricas mostrar y cuáles no\nCómo justificar decisiones publicitarias\nComunicación clara y profesional"}, {"title": "Inteligencia artificial aplicada a publicidad digital", "description": "IA para copys publicitarios\nIA para hooks y creativos\nOptimización de tiempo y procesos\nUso estratégico y ético de la IA en pauta\nClaude Cowork como asistente operativo (reportes, análisis de métricas)\nNotebookLM: base de conocimiento y análisis de reportes de cliente\nGemini Gems: asistentes personalizados por nicho o cliente\nArtefactos (Claude) y Canvas/Apps (Gemini): dashboards y reportes interactivos"}]$json$::jsonb else modules end,
  certificate = coalesce(nullif(certificate, ''), 'Triple Certificación
Marketing Digital · 40 horas académicas
Trafficker Digital · 40 horas académicas
Publicidad Digital y Paid Media · 40 horas académicas'),
  academic_hours = coalesce(academic_hours, 40),
  modality = 'virtual',
  teacher_id = coalesce(teacher_id, (select id from public.teachers where name = 'Mgs. Jean Paulo Rocillo Alba' limit 1))
where slug = 'trafficker-digital-pro';

update public.courses set
  summary = coalesce(nullif(summary, ''), 'Este programa está dirigido a dueños de negocio, emprendedores y equipos comerciales que quieren usar inteligencia artificial para trabajar más rápido, crear contenido, investigar su mercado, lanzar campañas y automatizar procesos.

Herramientas: ChatGPT, Gemini, Claude, NotebookLM, Notion IA, Perplexity, Nano Banana, Meta IA y Make.'),
  objectives = case when cardinality(objectives) = 0 then array['Usar IA en tu negocio', 'Analizar mercado y competencia', 'Organizar tareas con IA', 'Crear anuncios con IA y Meta Ads', 'Automatizar procesos']::text[] else objectives end,
  includes = case when cardinality(includes) = 0 then array['Clases en vivo (quedan grabadas)', 'Campus virtual', 'Work Kit', 'Certificación institucional']::text[] else includes end,
  modules = case when jsonb_array_length(modules) = 0 then $json$[{"title": "Asistentes de IA para trabajar y crear", "description": "ChatGPT: configuración, prompts, memoria y GPTs\nGemini: uso, Gems y análisis de archivos\nClaude: redacción, análisis y documentos largos\nCuándo usar cada uno según la tarea"}, {"title": "Investigación y organización", "description": "Perplexity: investigación de mercado y competencia con fuentes\nNotebookLM: base de conocimiento propia y resúmenes\nNotion IA: organizar, resumir y delegar tareas"}, {"title": "Marketing", "description": "Nano Banana: imágenes de producto y piezas publicitarias\nMeta IA Andrómeda: cómo funciona y cómo aprovecharla en campañas\nCreativos y copys que alimentan a Andrómeda"}, {"title": "Ventas y automatizaciones", "description": "Make: qué es y cómo funciona la automatización\nMeta Business Agents\nAutomatizaciones para ventas, atención y contenido"}]$json$::jsonb else modules end,
  certificate = coalesce(nullif(certificate, ''), 'Certificación Institucional
Especialista en IA para Marketing · 40 horas académicas
Ventas y Automatización con IA · 40 horas académicas'),
  academic_hours = coalesce(academic_hours, 40),
  modality = 'virtual',
  teacher_id = coalesce(teacher_id, (select id from public.teachers where name = 'Mgs. Jean Paulo Rocillo Alba' limit 1))
where slug = 'inteligencia-artificial-para-marketing-y-ventas';
