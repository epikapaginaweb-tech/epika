# Épika Academy

Sitio multipágina y panel administrativo de Épika Academy.
Next.js 16 (App Router + Cache Components), Tailwind CSS 4, Motion y Supabase.

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Presentación, próximos cursos, beneficios, docentes, testimonios, FAQ |
| `/nosotros` | Historia, misión, visión, metodología y galería |
| `/cursos` | Catálogo con filtro por modalidad |
| `/cursos/[slug]` | Ficha completa del curso, reserva y consulta por WhatsApp |
| `/docentes` | Perfiles y cursos que imparte cada docente |
| `/contacto` | Formulario, canales, redes y mapa |
| `/reservar?curso=slug` | Solicitud de reserva con curso preseleccionado |
| `/admin` | Panel privado (usuario y contraseña) |

Al enviar el formulario con un curso seleccionado se muestran las cuentas bancarias y la opción de subir el comprobante.

## Panel `/admin`

- Cursos: crear, editar, ocultar/publicar, destacar, eliminar y subir imagen y brief (PDF).
- Docentes, preguntas frecuentes y testimonios (solo se publican los autorizados).
- Solicitudes con estados *nueva / contactada / inscrita*, revisión de comprobante y aprobación de pago.
- Accesos del estudiante: genera `primernombre.primerapellido@epika.education` y `Ek<cédula>*` y abre WhatsApp con el mensaje listo.
- Contenido: WhatsApp, correo, redes, mapa, cuentas bancarias, textos de Inicio y Nosotros, galería y aviso de privacidad.

## Puesta en marcha

1. Crea un proyecto en [Supabase](https://supabase.com) y ejecuta `supabase/schema.sql` en el SQL Editor.
2. Copia `.env.example` a `.env.local` y completa las variables.
3. `npm install` y `npm run dev`.

### Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Lectura pública y carga de archivos con URL firmada |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor: formularios y panel |
| `NEXT_PUBLIC_SITE_URL` | Dominio final (SEO y vistas previas) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Acceso al panel |
| `ADMIN_SESSION_SECRET` | 32+ caracteres aleatorios (`openssl rand -base64 48`) |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | Opcional: correo de aviso por cada solicitud y comprobante |

### Vercel

Importa el repositorio, agrega las mismas variables en *Settings → Environment Variables* y despliega.
Los cambios hechos en el panel se reflejan en el sitio al guardar.

## Seguridad

- RLS activo: el público solo lee contenido visible; solicitudes y comprobantes solo vía servidor.
- Comprobantes en bucket privado; el panel los abre con enlaces firmados de 15 minutos.
- Sesión del panel en cookie `httpOnly` firmada (8 h), verificada en `proxy.ts` y en cada acción.
- Formularios con validación en servidor, campo trampa y tiempo mínimo de llenado contra spam.

## Scripts

```bash
npm run dev     # desarrollo
npm run lint    # ESLint
npm run build   # build de producción
```
