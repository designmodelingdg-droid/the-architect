# Reglas de seguridad — Design Modeling Academy (designmodelingacademy.com)

Contexto: sitio público de la academia en Next.js 16 App Router, estático salvo dos
piezas de servidor: el editor de contenido Keystatic (`/keystatic` y
`/api/keystatic/*`) y el handler de markdown para agentes (`/md/*`). Sin base de
datos propia: el contenido vive en `content/` como archivos del repo. Sin
autenticación propia: la del editor la aporta GitHub. Cualquier cambio que
introduzca otra API route, cookies, formularios propios o manejo de datos
personales debe revisarse con más rigor que el resto.

## Secretos y credenciales
- Nunca se guardan claves, tokens ni contraseñas en el repo (ni en `.env`
  versionados, ni en `next.config.ts`, ni en `keystatic.config.ts`, ni en
  comentarios). Las claves van en variables de entorno de Vercel y se leen con
  `process.env` solo en código de servidor.
- Toda variable `NEXT_PUBLIC_*` se envía al navegador: no puede contener secretos.
  Las de Keystatic en modo GitHub (`KEYSTATIC_GITHUB_CLIENT_SECRET`,
  `KEYSTATIC_SECRET`) son secretas y **nunca** llevan el prefijo `NEXT_PUBLIC_`;
  `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` es el único valor público del editor.
- Los siguientes identificadores son PÚBLICOS por diseño y NO deben reportarse
  como secretos: el identificador de ubicación de Sharp CRM
  (`nkKbOarn5IwHeMv48uY9`), el Form ID del formulario de contacto, el widget-id
  del chat de LeadConnector y la URL del calendario de citas (los tres se
  declaran en `src/lib/site.ts`), los ids de videos de Vimeo, los enlaces
  `wa.link` de cada programa, el número de WhatsApp, el RUC, las URLs de redes
  sociales y la URL del campus (`designmodelingacademy.app.clientclub.net`).

## El editor de contenido (Keystatic)
- `/keystatic` y `/api/keystatic/*` solo aceptan escrituras con sesión de GitHub
  sobre el repositorio. En modo `local` el editor **no se despliega**: Vercel debe
  correr con `storage.kind = "github"`.
- `robots.ts` excluye `/keystatic` y `/api/`. El layout de `/keystatic` lleva
  `robots: noindex`.
- El contenido de `content/` es dato, no código: ninguna página lo pasa por
  `dangerouslySetInnerHTML`. Las descripciones son texto plano; los enlaces de
  matrícula, cita, brochure y WhatsApp se validan como URL (`fields.url`) y solo
  se renderizan como `href`.
- Los campos de imagen escriben en `public/images/*` a través de Keystatic, con
  extensión de imagen. No se aceptan SVG subidos por el editor (pueden llevar
  script).

## Scripts e iframes de terceros
- Solo se permiten scripts externos de: `api.leadconnectorhq.com` (formulario de
  Sharp CRM) y `widgets.leadconnectorhq.com` (chat). Cualquier otro dominio en un
  `<Script>` o `<script>` es un hallazgo: hay que justificarlo y añadirlo aquí
  antes de mergear.
- Solo se permiten iframes de: `player.vimeo.com`,
  `api.leadconnectorhq.com/widget/form` y el calendario de citas de Sharp CRM
  (`api.leadconnectorhq.com/widget/booking` o `link.apisystem.tech`). Todo iframe
  lleva `title`, `loading="lazy"` y el `allow` mínimo. Nunca `allow="*"`.
- Los videos se sirven desde Vimeo (política de la casa). No se aceptan URLs de
  CloudFront, S3 u otros buckets como fuente de video o imagen.
- Los scripts de terceros se cargan con `next/script`, nunca con
  `dangerouslySetInnerHTML`.

## HTML e inyección
- `dangerouslySetInnerHTML` solo está permitido en `datos-estructurados.tsx` y en
  el JSON-LD de cada página de programa, siempre con un objeto compuesto en el
  servidor y serializado con `JSON.stringify`. Nunca con datos de query string.
- Todo `<a target="_blank">` a un dominio externo lleva `rel="noopener"`.
- Los filtros del catálogo leen `searchParams` solo para elegir entre valores de
  una lista cerrada (tipo, área, software, nivel); nunca para construir HTML ni
  URLs.

## Middleware, proxy y cabeceras
- El middleware (o `proxy.ts` en Next 16) solo reescribe hacia `/md/*` en
  función de la cabecera `Accept` y del sufijo `.md`, y añade `X-Robots-Tag` en
  hosts `*.vercel.app`. No redirige ni reescribe en función de `host`,
  `x-forwarded-*` ni `referer` para nada sensible.
- El handler `/md/*` es de solo lectura y compone desde `content/`; devuelve 404
  con cuerpo en markdown para rutas desconocidas y nunca refleja la ruta pedida
  sin escaparla.
- Si se añaden más API routes: validar y tipar el cuerpo, limitar tamaño, aplicar
  rate-limit, no reenviar (`fetch`) URLs que vengan del cliente (SSRF), y
  responder sin filtrar stack traces.

## Datos personales (LOPDP Ecuador y RGPD para alumnos en España)
- El sitio no almacena datos de alumnos ni de interesados: el formulario y el
  calendario viven en iframes de Sharp CRM y el chat en LeadConnector. No crear
  formularios propios que envíen datos a servicios no listados en `/privacidad`.
- No introducir cookies, `localStorage`, píxeles ni analítica nueva sin actualizar
  `/privacidad` y, si aplica, un aviso de consentimiento.
- De los docentes solo se publica nombre, titulación, rol, foto y LinkedIn
  público. Nunca correos personales, teléfonos móviles ni cédulas.
- Un testimonio se publica solo con `verificado: true` (cargo y país contrastados
  con la reseña original) y con permiso de uso. Nunca datos de alumnos sacados
  del LMS o del CRM.
- Las cifras de alumnos publicadas llevan su fuente en `content/nosotros.yaml`.
- Los precios y condiciones internas de DG BIM Intelligence no van al sitio.

## Dependencias y build
- No añadir dependencias con postinstall que descarguen binarios sin revisarlas.
- Mantener `next`, `react`, `motion` y `@keystatic/*` en versiones con soporte;
  revisar `npm audit` ante cualquier `high` o `critical` antes de mergear.
- Los logos de emisores de credenciales y avales entran a `public/` tal como los
  entrega su dueño, optimizados localmente; nunca por hotlinking.
