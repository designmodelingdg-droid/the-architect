---
name: web-dma
description: |
  Manual completo para construir y mantener los sitios web de Design Modeling (DMA): sistema visual medido, stack de Next 16 con Tailwind 4, movimiento con criterio, legibilidad para agentes de IA, seguridad, integraciones con Sharp CRM, corte de dominio e indexación. Metodología probada de punta a punta en dgdesignmodeling.com.

  Activa este skill cuando el usuario diga: "/web-dma", "vamos a hacer la web de la academia", "nueva web para DMA", "otro sitio como dgdesignmodeling", "hagamos la web de Design Modeling Academy", "mejora la web", "revisa el contraste del sitio", "auditoría del sitio", "el formulario no abre", "el widget de chat", "vamos a apuntar el dominio", "indexar el sitio", "legible por agentes", "llms.txt", o cuando toque cualquier trabajo sobre un sitio web corporativo de DMA.

  NO lo uses para aplicaciones con login, base de datos o panel de control (usa app-dma), ni para landing pages de un evento o un producto dentro de Sharp CRM (usa landing-evento / landing-producto), ni para lead magnets de una pantalla (usa leadmagnet-app).
---

# Sitios web de Design Modeling

Este skill es el manual de la casa para los sitios corporativos de DMA. Todo lo
que contiene está probado en producción en dgdesignmodeling.com: no son buenas
prácticas genéricas, son las decisiones que se tomaron, lo que costó cada una y
lo que se descartó a propósito.

Se usa para levantar un sitio nuevo y para seguir trabajando sobre uno
existente.

## Reglas de oro

1. **`DESIGN.md` antes de maquetar.** El sistema visual se escribe y se mide
   primero. Dejarlo para el final significa tocar decenas de archivos.
2. **El contraste se mide, no se supone.** Con `assets/medir-contraste.mjs`,
   sobre el build de producción, antes de publicar.
3. **Verificar es ejecutar.** Nada se reporta como listo sin correrlo — y todo
   lo que dependa de un tercero se comprueba en producción con `curl`, porque el
   navegador del sandbox no ve internet.
4. **Una cifra sin dueño verificable no se publica.** «10+ años» del equipo no
   es «10+ años» de la empresa.
5. **Las decisiones de marca son de Dayana.** Se presentan medidas y con
   recomendación; no se ejecutan sin su palabra.
6. **Contenido real desde el primer momento.** El texto de relleno sobrevive.
7. **Nunca contenido distinto para un bot que para una persona.**

## El recorrido

El orden completo, paso a paso y numerado, está en
**`references/10-orden-de-construccion.md`**. Es el archivo que hay que abrir al
empezar un sitio nuevo. Resumen del recorrido:

| Fase | Qué se hace | Lo que no se puede dejar para después |
|---|---|---|
| 0 | Entrevista, cifras con su dueño, integraciones, sitemap del sitio anterior | El año de constitución y las URLs viejas |
| 1 | `DESIGN.md`, proyecto Next, tokens, fuentes, seguridad, `site.ts` | El segundo tono del acento |
| 2 | Layout, páginas, movimiento, integraciones, robots y sitemap | Contenido real, no relleno |
| 3 | `llms.txt`, markdown negociado, JSON-LD | — |
| 4 | Lint, build, contraste, rutas, capturas | — |
| 5 | Redirecciones, Vercel, DNS, Search Console | **Las redirecciones antes del DNS** |
| 6 | Wikidata, escaneo de agentes, pipeline del CRM | — |

## Las referencias

| Archivo | Cuándo leerlo |
|---|---|
| `references/01-sistema-visual.md` | Color, tipografía, forma, contraste medido, la trampa de las capas de CSS |
| `references/02-stack.md` | Versiones, Tailwind 4, estructura de archivos, inventario de componentes |
| `references/03-movimiento.md` | Los cuatro recursos del scroll, el acto fijado, hooks y lint |
| `references/04-legible-por-agentes.md` | `llms.txt`, markdown negociado, JSON-LD, y qué se declina |
| `references/05-seguridad.md` | Plugin, reglas del proyecto, patrones propios, LOPDP |
| `references/06-integraciones.md` | Formulario y widget de Sharp CRM, política de video |
| `references/07-dominio-y-seo.md` | Redirecciones, Vercel, DNS, Search Console |
| `references/08-identidad-y-cifras.md` | Wikidata sí / Wikipedia no, honestidad de las cifras |
| `references/09-proceso-y-trampas.md` | Verificación, trampas del entorno, git y PR, cómo reportar |
| `references/10-orden-de-construccion.md` | **El paso a paso completo** |

## Los activos

En `assets/`, listos para copiar a un proyecto nuevo:

| Archivo | Qué es |
|---|---|
| `medir-contraste.mjs` | Auditor de contraste WCAG. Resuelve oklab, alfa por capas y la deriva de fondo ligada al scroll. Validado: 982 nodos en 8 rutas, un único fallo real |
| `DESIGN.ejemplo.md` | El sistema visual de la consultoría, completo, como referencia de profundidad |
| `middleware.ts` | Sufijo `.md`, negociación por `Accept` con q-values, cabecera `Link`, noindex en staging |
| `chat-widget.tsx` | Burbuja de chat de LeadConnector, con el forzado de colocación |
| `contacto-bloque.tsx` | Formulario del CRM embebido, sin tarjeta envolvente |
| `scroll-suave.tsx` | Lenis con la compensación de ancla para la barra fija |
| `robots.ts` | Route handler de `robots.txt` |
| `claude-security-guidance.plantilla.md` | Reglas de seguridad del proyecto. **Hay que reescribir los identificadores públicos** |
| `security-patterns.json` | Los nueve patrones propios, en JSON para que carguen sin PyYAML |

## Skills que se usan durante el trabajo

| Skill | Para qué |
|---|---|
| `artifact-design` | Antes de publicar cualquier entregable como artefacto — una guía para el equipo, un informe |
| `dataviz` | Si el sitio o un informe lleva gráficos |
| `code-review` / `security-review` | Sobre el diff, antes de mergear algo grande |
| `/watch` | Si Dayana manda un video de referencia |
| `app-dma` | Si lo que se pide resulta ser una aplicación, no un sitio |

## Estado actual de dgdesignmodeling.com

Para no repetir investigación ya hecha:

- En producción en Vercel (proyecto `dgdesignmodeling-web`), desplegando `main`.
  Ojo: hay un segundo proyecto, `sitio-next`, que también despliega el mismo
  directorio en previsualizaciones.
- Nueve rutas, todas con gemelo en markdown y frontmatter.
- Contraste AA en todo menos un par: blanco sobre el naranja de marca `#ca7520`
  da 3,46:1 y AA pide 4,5:1 a 13–15 px en negrita. **Decisión de Dayana:
  se queda como está.** La corrección, si algún día la pide, es `#aa621b`
  (4,70:1).
- Escáner de agentes: los seis hallazgos del primer informe están cerrados, más
  cinco de la segunda ronda. Lo que queda exige ser plataforma de software y se
  declina por escrito.
- Entidad en Wikidata: **`Q141456227`**, creada y verificada, enlazada desde el
  `sameAs` del JSON-LD y citada en el `llms.txt`. Sin logotipo a propósito, por
  el registro de marca en curso.
