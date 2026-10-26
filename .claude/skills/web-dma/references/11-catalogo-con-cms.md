# Catálogo con CMS sobre git (lo que enseñó la academia)

Design Modeling Academy tiene 84 programas, 10 docentes, 11 credenciales y un
catálogo que cambia cada semana. La consultoría cabía en `site.ts`; la academia
no. Esto es lo que se decidió y lo que costó.

## Keystatic: contenido en el repo, editor visual para Ester

- `@keystatic/core` ^0.6.9 y `@keystatic/next` ^5.0.5 funcionan con Next 16.3
  y React 19 (peers `next >=14`, `react ^18.2 || ^19`). Hace falta
  `@markdoc/markdoc` aunque no se use Markdoc.
- Contenido como YAML en `content/<colección>/<slug>.yaml`, imágenes en
  `public/images/<carpeta>`. **Una sola fuente**: Claude edita por PR, Ester
  edita en `/keystatic` con formularios y Keystatic hace el commit.
- Lectura con `createReader(process.cwd(), config)` desde **un solo archivo**,
  `src/lib/contenido.ts`. Páginas, sitemap, markdown para agentes, `llms.txt`
  y JSON-LD leen de ahí, así que no pueden desincronizarse.
- Archivos: `keystatic.config.ts` en la raíz,
  `src/app/keystatic/[[...params]]/page.tsx` (`makePage` de
  `@keystatic/next/ui/app`), `src/app/api/keystatic/[...params]/route.ts`
  (`makeRouteHandler`), y un `layout.tsx` del editor con
  `robots: { index: false }` y `title: { absolute: … }` para que no herede la
  plantilla del sitio. `robots.ts` bloquea `/keystatic` y `/api/`.
- `storage: { kind: "local" }` mientras se desarrolla; en Vercel, modo GitHub
  con `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` y
  `KEYSTATIC_SECRET` como secretos del proyecto. **Nunca `NEXT_PUBLIC_`.**
- Los tipos salen del reader:
  `type Programa = NonNullable<Awaited<ReturnType<typeof reader.collections.programas.read>>> & { slug: string }`.
  Los arrays que devuelve son `readonly`: los helpers que los reciben deben
  aceptar `readonly (string | null)[]`.
- Un script que importe `keystatic.config.ts` (validación, carga masiva) corre
  con `node --experimental-strip-types`, y `tsconfig.json` tiene que excluir
  `scripts/` o el build de Next falla con TS5097.

## Esquema que funcionó

`programas` con `tipo` (máster · bloque · diplomado · especialización · paquete ·
ruta · curso · mentoría · guía · suscripción), `estado`, `destacado`, resumen,
para quién, qué vas a lograr, módulos → sesiones, horas, meses, modalidad,
nivel, próximo inicio, `mostrarPrecio` + `precios[]` (opción única · cuotas ·
preventa · mensual · anual, moneda, país, tachado, cuotas), relaciones a
`docentes`, `credenciales`, `software`, `areas`, `incluye` (otros programas),
`urlMatricula`, `urlCita`, `whatsapp`, FAQ, testimonios, `slugAnterior` (para
las redirecciones) y `alumnos`. Más `docentes`, `credenciales` (con
`registroOficial`), `avales`, `areas`, `software`, `testimonios` (con
`verificado`: sin cargo y país verificados no se publica), `eventos`,
`empresasClientes`, y los singletons `inicio`, `nosotros` (cifras **con
`fuente`**) y `empresas`.

Regla que sale de aquí: **el programa se reduce a `TarjetaDatos` antes de
pasarlo a un componente de cliente** (los filtros del catálogo). Mandar 84
fichas completas al navegador es peso inútil.

## Lo que la web nueva no hereda del sitio anterior

Una auditoría del LMS y de la web pública, antes de escribir contenido, dio
doce inconsistencias: precios distintos según sistema, horas distintas en la
FAQ y en la ficha, textos legales copiados de la consultoría, «© 2023», sin
política de reembolso, testimonios con cargos que no estaban en las reseñas.
Nada de eso se migra: se corrige en el origen (CRM) o se deja fuera. La
política de reembolso la escribe el abogado; mientras tanto, los términos
dicen solo lo cierto: «se entrega por escrito antes de la matrícula».

## El sitio anterior rebota a los bots

LeadGods (Apache 2.4.29) redirige a google.com toda petición sin User-Agent de
navegador. Para auditar la web actual hay que pedir con
`-A "Mozilla/5.0 … Chrome/128"`. Y hay que contarlo en el informe: el
histórico de indexación será irregular y las posiciones se moverán tras el
corte.

## Logo que llega tarde

El logo lo entrega su dueña en el archivo original y no se redibuja. Hasta que
exista, `next.config.ts` comprueba el archivo en build
(`env: { LOGO_ACADEMY: existsSync(...) ? "1" : "" }`) y el componente `Logo`
escribe la marca con la tipografía de títulos. Nada de imágenes rotas en la
barra en las capturas ni en staging.

## Todo programa tiene página

Aunque el plan dijera «cursos como tarjeta que enlaza a GHL», cada programa
tiene su página: es la URL que Google ya conocía (47 slugs de `/curso/`), la
que lleva el `Course` en JSON-LD, y la que responde en markdown. La tarjeta
enlaza dentro; la página manda a GHL.
