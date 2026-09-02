# Reglas de seguridad — Design Modeling DG (dgdesignmodeling.com)

Contexto: este repositorio contiene (a) la base de conocimiento de "The Architect"
(markdown, sin código ejecutable) y (b) el sitio público en `output/sitio-next`:
Next.js 15 App Router, 100 % estático, sin base de datos, sin autenticación y sin
API routes. Cualquier cambio que introduzca backend, cookies, formularios propios o
manejo de datos personales debe revisarse con más rigor que el resto.

## Secretos y credenciales
- Nunca se guardan claves, tokens ni contraseñas en el repo (ni en `.env` versionados,
  ni en `next.config.ts`, ni en comentarios). Las claves van en variables de entorno
  de Vercel y se leen con `process.env` solo en código de servidor.
- Toda variable `NEXT_PUBLIC_*` se envía al navegador: no puede contener secretos.
- Los siguientes identificadores son PÚBLICOS por diseño y NO deben reportarse como
  secretos: el Form ID de Sharp CRM (`OfA7Ehcb8QSo9VXIDe6X`), el widget-id del chat
  de LeadConnector (`6a989ada7e179c4b6622818a`), los ids de videos de Vimeo y Loom,
  el número de WhatsApp, el RUC y las URLs de redes sociales.

## Scripts e iframes de terceros
- Solo se permiten scripts externos de: `api.leadconnectorhq.com` (formulario Sharp CRM)
  y `widgets.leadconnectorhq.com` (chat). Cualquier otro dominio en un `<Script>` o
  `<script>` es un hallazgo: hay que justificarlo y añadirlo aquí antes de mergear.
- Solo se permiten iframes de: `player.vimeo.com`, `www.loom.com/embed` y
  `api.leadconnectorhq.com/widget/form`. Todo iframe lleva `title`, `loading="lazy"` y el
  `allow` mínimo necesario. Nunca `allow="*"` ni `sandbox` vacío como excusa.
- Los videos se sirven desde Vimeo (política de la casa). No se aceptan URLs de
  CloudFront, S3 u otros buckets como fuente de video o imagen en el sitio.
- Los scripts de terceros se cargan con `next/script` (`afterInteractive` o
  `lazyOnload`), nunca con `dangerouslySetInnerHTML`.

## HTML e inyección
- `dangerouslySetInnerHTML` solo está permitido en `datos-estructurados.tsx` para el
  JSON-LD, y siempre con un objeto estático serializado con `JSON.stringify`. Nunca con
  datos de query string, formularios, CMS o APIs.
- Todo `<a target="_blank">` a un dominio externo lleva `rel="noopener"`.
- Ningún componente debe leer `window.location`, `searchParams` o `hash` para
  construir HTML, redirecciones o URLs de terceros sin validar contra una lista fija.

## Middleware y cabeceras
- `src/middleware.ts` solo añade cabeceras (`X-Robots-Tag` en hosts `*.vercel.app`).
  No debe redirigir ni reescribir en función de cabeceras controladas por el usuario
  (`host`, `x-forwarded-*`, `referer`) sin una lista cerrada de valores permitidos.
- Si se añaden API routes: validar y tipar el cuerpo, limitar tamaño, aplicar
  rate-limit, no reenviar (`fetch`) URLs que vengan del cliente (SSRF), y responder
  sin filtrar stack traces.

## Datos personales (LOPDP Ecuador y RGPD para clientes en España)
- El sitio no almacena datos personales: el formulario de contacto vive en un iframe
  de Sharp CRM y el chat en LeadConnector. No crear formularios propios que envíen
  datos a servicios no listados en `privacidad`.
- No introducir cookies, `localStorage`, píxeles de seguimiento ni analítica nueva sin
  actualizar `/privacidad` y, si aplica, un aviso de consentimiento.
- Del equipo solo se publica lo autorizado: nombre, cargo, foto y LinkedIn público.
  Nunca correos personales, teléfonos móviles ni cédulas.
- Los precios y condiciones internas de DG BIM Intelligence no van al sitio público.

## Dependencias y build
- No añadir dependencias con postinstall que descarguen binarios sin revisarlas.
- Mantener `next`, `react` y `motion` en versiones con soporte; revisar `npm audit`
  ante cualquier `high` o `critical` antes de mergear.
- Los assets subidos por terceros (logos, fotos) se optimizan localmente antes de
  entrar a `public/`; nunca se enlazan desde dominios ajenos con hotlinking.
