# Stack y estructura

## Versiones que funcionan juntas

Las del sitio de consultoría, en producción y verificadas:

| Paquete | Versión | Para qué |
|---|---|---|
| `next` | 16.3.2 | App Router, middleware, route handlers |
| `react` / `react-dom` | 19.2.8 | |
| `tailwindcss` | ^4 | con `@tailwindcss/postcss` |
| `motion` | ^13.1.1 | se importa de `motion/react`, no de `framer-motion` |
| `lenis` | ^1.3.26 | scroll suave |
| `shadcn` | ^4.18.0 | componentes base |
| `radix-ui` | ^1.6.7 | primitivas bajo shadcn |
| `lucide-react` | ^1.33.0 | iconos |
| `tailwind-merge` + `clsx` + `class-variance-authority` | | utilidades de clases |
| `tw-animate-css` | ^1.4.0 | animaciones de utilidad |

`eslint-config-next` va clavado a la versión de Next.

Scripts: `dev`, `build`, `start`, `lint` (`eslint` a secas).

## Tailwind 4: el tema va en CSS, no en un archivo de config

No hay `tailwind.config.js`. Los tokens se declaran en `src/app/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme {
  --color-navy: #001e30;
  --color-crema: #fafaf7;
  --color-naranja: #ca7520;
  /* Variante solo para texto pequeño: el de marca da 3,30:1 sobre crema
     y no pasa AA; este da 4,84:1. */
  --color-naranja-texto: #a25e1a;
  --color-naranja-claro: #e8a04a;
  --color-tinta: #16344a;
  --color-tinta-suave: #587589;   /* 4,65:1 sobre crema */
  --ease-out-brand: cubic-bezier(0.23, 1, 0.32, 1);
}
```

Cada token declarado así genera utilidades (`text-navy`, `bg-crema`,
`border-naranja`). El comentario con el ratio medido al lado del color no es
adorno: es lo que evita que alguien lo cambie sin medir.

Hay un segundo bloque `@theme inline` con los tokens que shadcn espera
(`--color-primary`, `--color-card`, los radios derivados de `--radius`). Se
deja como viene.

Y un `@layer components` con las clases propias. **Toda clase propia va ahí**
(el porqué, en `01-sistema-visual.md`).

## Tipografías

`next/font/google` en el layout raíz, solo los pesos que se usan:

```tsx
import { Overpass, Nunito } from "next/font/google";

const overpass = Overpass({
  subsets: ["latin"], weight: ["600", "700", "800"],
  variable: "--font-overpass", display: "swap",
});
const nunito = Nunito({
  subsets: ["latin"], weight: ["400", "600", "700"],
  variable: "--font-nunito", display: "swap",
});
```

Y las variables se cuelgan del `<body>`:

```tsx
<body className={`${overpass.variable} ${nunito.variable} bg-background text-foreground antialiased`}>
```

## Estructura de archivos

```
src/
  app/
    layout.tsx              raíz: fuentes, metadata, TopBar, Navbar, Footer,
                            ChatWidget, ScrollSuave, DatosEstructurados
    page.tsx                inicio
    <seccion>/page.tsx      una carpeta por página, con su propio metadata
    md/[[...slug]]/route.ts  markdown para agentes (ver 04)
    robots.ts
    sitemap.ts
    globals.css
  components/
    site/                   componentes propios del sitio
    ui/                     shadcn, sin tocar
  lib/
    site.ts                 TODO el contenido estructurado
  middleware.ts             negociación de markdown + noindex en staging
DESIGN.md                   el sistema visual manda desde aquí
AGENTS.md                   lo reescribe `next dev`; se commitea con el trabajo
```

## `src/lib/site.ts` es la fuente única

Todo el contenido que se repite vive aquí y **nada lo duplica**: ni las
páginas, ni el markdown para agentes, ni el JSON-LD, ni el `llms.txt`.

Exportaciones del sitio de consultoría, como plantilla de qué cosas van aquí:

```
WA, WA_MSG(texto), EMAIL, ACADEMIA, LINKEDIN_EMPRESA
NAV          navegación principal
FAMILIAS     las familias de servicio, con num, label, resumen, servicios[]
VERTICALES   con quién se trabaja, { label, detalle }
EQUIPO       nombre, rol, foto, bio, linkedin
REDES        { label, href }
AVALES       acreditaciones y partners
CLIENTES     logos de clientes
alternos(md) helper para el <link rel="alternate"> de markdown
```

La prueba de que está bien hecho: el handler de markdown compone sus páginas
importando de aquí, así que no puede desactualizarse por su lado.

## Inventario de componentes propios

Los de `src/components/site/`, con lo que resuelve cada uno:

| Componente | Qué hace |
|---|---|
| `navbar.tsx` / `topbar.tsx` | barra fija, CTA a `/contactos#formulario` |
| `footer.tsx` | pie, sin créditos de herramientas |
| `section.tsx` | la banda: `tone="navy"` la envuelve en `DerivaNavy`; también `SectionHead` con su prop `dark` |
| `page-hero.tsx` | cabecera de página interna, con titular cinético |
| `data-strip.tsx` | cinta de cifras |
| `contador.tsx` | cifras que florecen al valor real |
| `texto-cinetico.tsx` | titular que entra palabra por palabra |
| `deriva-navy.tsx` | la banda navy deriva desde crema al entrar |
| `parallax.tsx` | `ParallaxImg`, con `revelar` para la cortina |
| `reveal.tsx` | entrada estándar de un bloque |
| `acto-plataforma.tsx` | el acto fijado del producto en el inicio |
| `agent-panel.tsx` | panel de demostración del agente |
| `scroll-suave.tsx` | monta Lenis |
| `vimeo-fondo.tsx` | video de fondo, silencio y bucle, con póster |
| `cine-banda.tsx` | banda con video |
| `marquee.tsx` | cinta de logos, se pausa al pasar el cursor |
| `zona-mouse.tsx` | seguimiento suave del cursor |
| `contacto-bloque.tsx` | formulario de Sharp CRM embebido |
| `chat-widget.tsx` | burbuja de chat de LeadConnector |
| `datos-estructurados.tsx` | JSON-LD; el único sitio con `dangerouslySetInnerHTML` |
| `icono-linkedin.tsx` | icono suelto |

## Scroll suave con Lenis

En `assets/scroll-suave.tsx`. El detalle que importa: con una barra fija hay que
compensar el ancla, o al saltar a `#formulario` el encabezado queda debajo de la
barra.

```ts
anchors: { offset: -96 }
```

## Accesibilidad de base

- `<html lang="es">`.
- Enlace de salto al contenido (`.saltar-contenido`), visible al enfocar.
- Un solo `<h1>` por página, y sin saltos de nivel de encabezado.
- Controles nativos: en el sitio de consultoría, 66 controles interactivos y
  cero `div` haciendo de botón. Un escáner externo lo midió en 100 %.
- Foco visible en todo lo enfocable.
- `prefers-reduced-motion`: el sitio se queda quieto **y completo**. Ninguna
  sección depende del movimiento para poder leerse.
