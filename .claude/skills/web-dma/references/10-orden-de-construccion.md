# Orden de construcción de un sitio DMA

El orden no es una sugerencia. Cada paso existe porque hacerlo más tarde costó
caro en el sitio de consultoría. Lo que más duele si se deja para el final:
el segundo tono del acento (38 archivos tocados) y las redirecciones (visitas
cayendo en 404 en producción).

## Fase 0 · Antes de escribir código

1. **Entrevista.** Máximo 3 preguntas por mensaje. Qué es, para quién, qué
   acción tiene que provocar la página, y qué contenido real existe ya — fotos
   de proyectos propios, logos de avales en su archivo original, videos.
2. **Las cifras, con su dueño.** Una por una: ¿es de la empresa o de una
   persona? ¿Se puede verificar? Y el año de constitución de la sociedad.
   Ver `08-identidad-y-cifras.md`.
3. **Las integraciones.** ¿Qué ID de formulario del CRM? ¿Qué ID de widget de
   chat, y está puesto como «Elemento fijo»? ¿Qué videos, y están ya en Vimeo?
4. **El dominio.** ¿Hay sitio anterior? Si lo hay, **sacar su sitemap ahora** y
   guardar la lista de URLs.

## Fase 1 · Los cimientos

5. **`DESIGN.md`** en la raíz, completo, y pasando `npx @google/design.md lint`.
   Incluye la tabla de contraste medido y **el segundo tono del acento** para
   texto pequeño. Esto va antes de maquetar, no después.
6. **Proyecto Next** con las versiones de `02-stack.md`. Tokens en `@theme`
   dentro de `globals.css`, con el ratio medido en el comentario de cada color
   delicado. Clases propias en `@layer components`, siempre.
7. **Fuentes** con `next/font/google`, solo los pesos que se usan. Dos familias
   y ninguna más.
8. **Seguridad** antes de la primera integración: marketplace, plugin,
   `.claude/claude-security-guidance.md` reescrito con los identificadores
   públicos **de este sitio**, y `security-patterns.json`. Comprobar que los
   nueve patrones cargan. Ver `05-seguridad.md`.
9. **`src/lib/site.ts`** con todo el contenido estructurado. Nada se duplica
   fuera de aquí.

## Fase 2 · El sitio que ve una persona

10. **Layout raíz:** metadata con `metadataBase` y plantilla de título, Open
    Graph con imagen 1200×630, `lang`, enlace de salto al contenido, TopBar,
    Navbar, Footer, `ScrollSuave`, `DatosEstructurados`.
11. **Las páginas**, cada una con su `metadata` propio. Contenido real desde el
    primer momento: **nunca texto de relleno**, porque el relleno sobrevive.
12. **Movimiento**, con los cuatro recursos y un solo clímax. Ninguno repetido
    en dos bandas seguidas. Ver `03-movimiento.md`.
13. **Integraciones:** formulario del CRM sin tarjeta envolvente, y el widget de
    chat **como** el botón flotante — no además de uno propio. Ver
    `06-integraciones.md`.
14. **`robots.ts`, `sitemap.ts`** y el `X-Robots-Tag` de staging en el
    middleware.

## Fase 3 · El sitio que ve un agente

15. **`public/llms.txt`** con «Cuándo recomendarnos» en español **y** «When to
    use …» en inglés, los casos en que no somos la respuesta, y las notas para
    agentes.
16. **Handler de markdown** en `src/app/md/[[...slug]]/route.ts`, componiendo
    desde `site.ts`, con frontmatter y 404 útil.
17. **Middleware:** sufijo `.md`, negociación por `Accept` con q-values,
    cabecera `Link`.
18. **`alternos()`** en el `alternates` de cada página, para el
    `<link rel="alternate">`.
19. **JSON-LD** con `Organization` completo: `address` y `contactPoint`
    incluidos. Ver `04-legible-por-agentes.md`.

## Fase 4 · Verificación antes de publicar

20. `npm run lint` y `npm run build`, los dos limpios.
21. **Contraste:** servir el build y correr `medir-contraste.mjs` sobre todas
    las rutas. Cero fallos, o los que haya declarados como decisión de marca.
22. **Rutas y cabeceras** en el build local: cada `.md` devuelve
    `text/markdown` con su frontmatter, el HTML sigue siendo HTML para un
    navegador, y una ruta inexistente devuelve 404 de verdad.
23. **Capturas** a 1440 px y a 390 px, del scroll por pasos. Recordar que los
    iframes externos saldrán en gris y eso no es un fallo.

## Fase 5 · El corte de dominio

24. **Las redirecciones primero**, cubriendo cada URL del sitemap anterior, más
    la convención en inglés. Desplegadas y verificadas **antes** de tocar el
    DNS.
25. **Vercel:** apex y `www`, con `www` → apex en 301.
26. **DNS:** el `@` puede ser un ALIAS que hay que borrar para crear el A. No
    tocar MX, ni los CNAME de otros servicios, ni los servidores de nombres.
27. **Verificar** el apex, el `www` y cada redirección con `curl`.
28. **Search Console:** propiedad de dominio con TXT nuevo sin borrar el
    anterior, sitemap enviado, indexación pedida para las páginas principales.
    Volver a «Páginas» en una semana.

## Fase 6 · Identidad y cierre

29. **Wikidata**, con las declaraciones de `08-identidad-y-cifras.md`. Wikipedia
    no. El código `Q…` se añade al `sameAs` del JSON-LD.
30. **Escaneo de agentes** (`is-agentic`), comparando **comprobación por
    comprobación**, nunca el total. Lo que pide plataforma de software se
    declina por escrito, con el motivo.
31. **El pipeline del CRM** como entregable aparte, por escrito, para quien lo
    monte.

## Lo que no se hace nunca

- Texto de relleno «que luego se cambia».
- Una cifra sin dueño verificable.
- Un logo de un tercero redibujado o recoloreado.
- Un video fuera de Vimeo.
- Dar contenido distinto a un bot que a una persona.
- Precios o condiciones comerciales del producto en el sitio público.
- Cambiar un color de marca sin que lo diga Dayana.
- Reportar como verificado algo que no se ejecutó.
