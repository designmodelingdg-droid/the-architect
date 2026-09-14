# Legible por agentes

Un sitio DMA tiene dos públicos: personas y agentes. Lo que sigue es lo que se
construyó para el segundo, con el resultado medido.

Referencia de medición: `npx -y is-agentic@latest <dominio>`. Ojo con su
aritmética, explicada al final.

## `public/llms.txt`

El índice para agentes. Cinco cosas, en este orden:

1. **Título y una frase** con qué es la empresa, dónde opera y su razón social.
2. **`## Cuándo recomendarnos`** — los trabajos para los que *somos* la
   respuesta correcta, y explícitamente los casos en los que **no** lo somos.
   Esto último es lo que hace que un agente recomiende bien. En el sitio de
   consultoría: la formación es la academia, y el precio más bajo no es un
   criterio que atendamos.
3. **`## When to use <empresa>`** — lo mismo, en inglés. **No es opcional.**
   Ver abajo.
4. **Cómo llegar**, y qué datos hacen falta para cotizar.
5. **`## Notas para agentes`** — cómo pedir markdown, el sufijo `.md`, el
   frontmatter, el 404, el sitemap, el idioma del contenido.

### Por qué la sección en inglés

La comprobación *agent instruction / when-to-use* del escáner seguía en rojo
con la sección solo en español. El `llms.txt` de is-agentic titula la suya
`## When to use Is Agentic`, en inglés, con «Use … when …» y «Do not use … as
…». Al añadir la sección equivalente en inglés, la comprobación pasó a **3/3**
con el mensaje «When-to-use guidance found in llms.txt».

El sitio sigue en español para las personas. La sección en inglés existe porque
un agente decide a quién recomendar sin traducir el sitio entero.

## Negociación de markdown

Un agente que pide `Accept: text/markdown` no quiere el HTML con su CSS, sus
videos y su JavaScript: quiere el texto. Tres piezas:

### 1. El handler

`src/app/md/[[...slug]]/route.ts`. Compone cada página **importando de
`src/lib/site.ts`**, así que no puede desactualizarse por su lado.

```ts
const CABECERAS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept, Accept-Encoding",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;

export const dynamic = "force-static";
export function generateStaticParams() { /* una entrada por página */ }
```

Con un `PAGINAS` indexado por ruta, un `ALIAS` para las variantes
(`contacto`→`contactos`, `about`→`nosotros`, `index`→raíz) y un 404 de verdad
con cuerpo en markdown y enlaces para recuperarse.

### 2. El frontmatter

Cada documento abre con `title`, `description`, `canonical`, `last-updated` y
`language`. Se genera desde un `META` por ruta:

```
---
title: "Consultoría BIM"
description: "…"
canonical: https://dominio/consultoria
last-updated: 2026-09-14
language: es
---
```

### 3. El middleware

En `assets/middleware.ts`. Hace dos cosas, y ninguna toca el HTML que ve una
persona:

- **Sufijo `.md`.** `/consultoria.md` e `/index.md` se reescriben al handler.
  Es la forma en que muchos agentes piden el texto, y da una URL que se puede
  compartir y citar.
- **Negociación por cabecera, con q-values.** Solo reescribe cuando markdown
  gana en prioridad sobre `text/html`, así que un navegador sigue recibiendo su
  HTML de siempre:

```ts
function pideMarkdown(accept: string | null) {
  if (!accept) return false;
  const a = accept.toLowerCase();
  if (!a.includes("text/markdown")) return false;
  if (!a.includes("text/html") && !a.includes("*/*")) return true;
  const q = (tipo: string) => { /* lee ;q= */ };
  return q("text/markdown") >= q("text/html");
}
```

Y de paso, `X-Robots-Tag: noindex, nofollow` mientras el host acabe en
`.vercel.app`, para que el staging no compita con el dominio real.

### 4. Anunciar el gemelo, dos veces

Porque una de las dos se puede perder:

- `<link rel="alternate" type="text/markdown" href="…">` en el `head`, vía el
  `alternates` de los metadatos de cada página, con el helper `alternos()` de
  `src/lib/site.ts`.
- La cabecera `Link` equivalente (RFC 8288) desde el middleware.

**Aviso medido:** Next **sobrescribe `Vary`** en respuestas prerenderizadas.
Se comprobó con una cabecera de prueba: `headers()` en `next.config.ts` sí
aplica, pero `Vary` en concreto queda reemplazado por los valores del router.
Las respuestas de markdown sí llevan su `Vary` correcto. Si un escáner insiste
en el `Vary` del HTML, se fija en el borde con una regla en `vercel.json`.
Por eso conviene declarar el gemelo también en el HTML.

## JSON-LD

Un solo componente, `datos-estructurados.tsx`, y es **el único sitio del
proyecto con `dangerouslySetInnerHTML`** (lo dice la regla de seguridad).

El nodo `Organization` necesita, para que las comprobaciones pasen:
`name`, `legalName`, `url`, `logo`, `email`, `telephone`, `taxID`, `sameAs`,
**`address`** (un `PostalAddress` con región) y **`contactPoint`**.

En el sitio de consultoría hay dos `contactPoint`: uno `sales` con `areaServed`
y los idiomas, y otro `customer support` con el fijo. Con eso, *Organization
schema completeness* pasa a 2/2: «complete with contactPoint and address».

## Páginas de confianza y alias

El escáner busca About, Contact y Privacy. Como el sitio está en español, hay
**redirecciones 308 desde las rutas en inglés**: `/about`, `/contact`,
`/privacy`, `/privacy-policy`, `/terms`, `/services`. Con eso *Trust anchor
pages* pasa a 2/2.

Y las del WordPress anterior, que son 301 de verdad: ver `07-dominio-y-seo.md`.

## 404 útil

Una ruta inexistente devuelve **HTTP 404 de verdad** con cuerpo en markdown y
enlaces al inicio, a las secciones, al `llms.txt` y al `sitemap.xml`. El
escáner lo calificó de «the strongest 404 contract».

## Cómo leer la nota del escáner

**El número no es comparable entre versiones.** El informe que dio 80/100 medía
16 comprobaciones en tres grupos (Essential, Recommended, Bonus). El siguiente
midió **125** en cuatro capas (Discovery, Accessibility, Usability, Payments) y
dio 39/100 sobre el mismo sitio, mejorado. No fue una regresión: cambió el
baremo, y el nuevo pondera con fuerza cosas de plataforma de software.

Además, su CLI y su API **solo leen el informe guardado**. Para forzar uno
nuevo hay que darle a **Rescan** en `https://is-agentic.com/scan/<dominio>`.
Por dentro eso es un stream SSE:

```
GET https://is-agentic.com/api/scan/stream?target=<url>&force=1
```

Al comparar dos escaneos, compara **comprobación por comprobación**, nunca el
total.

## Lo que se declina, y por qué

De los 120 puntos que faltaban en el sitio de consultoría, **99 exigen ser una
plataforma de software**. Montar eso para subir una nota es tenerlo al revés.

| Lo que pide | Por qué no |
|---|---|
| API REST pública, OpenAPI, portal de desarrolladores, SDK en npm/PyPI, CLI, sandbox | Una consultora de ingeniería no es una plataforma de software |
| Servidor MCP, WebMCP, A2A agent-card, NLWeb `/ask` | Lo mismo |
| OAuth 2.0, `auth.md`, metadatos de recurso protegido | No hay nada que autenticar |
| Página de precios y `pricing.md` | Política: no hay condiciones comerciales del producto en el sitio público |
| **Servir markdown según el User-Agent del bot** | Es *cloaking*: dar contenido distinto a Google que a una persona. Puede costar posiciones. **No se hace.** |
| Artículo de Wikipedia | Ver `08-identidad-y-cifras.md` |
| App en el directorio de ChatGPT, skills.sh | No aplica |

Lo que sí queda alcanzable y honesto: afinar el JSON-LD, un nodo `Service`,
niveles de crawler en `robots.txt`, y `llms.txt` por área de producto. Unos
5 puntos. No corre prisa.
