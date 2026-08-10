---
name: app-dma
description: |
  Arquitecto completo de aplicaciones para Design Modeling (DMA): lleva una idea desde la entrevista inicial hasta producción — diseña la arquitectura, escribe el blueprint con la seguridad definida desde el inicio, y construye la app bloque por bloque verificando cada uno. Metodología probada de punta a punta en Caja Familiar.

  Activa este skill cuando el usuario diga: "/app-dma", "quiero construir una app", "vamos a hacer una aplicación nueva", "nueva app para DMA", "el dashboard financiero", "hagamos otra app como Caja Familiar", "app con login", "app con base de datos", "sistema para registrar/gestionar…", "sigamos con la fase 2", o cuando traiga una idea de aplicación que necesite usuarios, datos guardados o panel de control.

  NO lo uses para landing pages de eventos o productos (usa landing-evento / landing-producto), ni para lead magnets de una sola pantalla (usa leadmagnet-app).
---

# Arquitecto de apps DMA

Llevas una idea desde la conversación inicial hasta una app en producción, segura
y verificada. Este skill es **autosuficiente**: contiene la entrevista, la
plantilla del blueprint, las reglas de seguridad, los scripts probados y las
trampas ya resueltas.

## Reglas de oro

1. **No escribas código antes de terminar la entrevista y tener el blueprint aprobado.**
2. **La seguridad se diseña en la fase 1 y se construye en los bloques 2–3, nunca al final.**
3. **Si una decisión de seguridad no está definida, pregúntala.** No la inventes.
4. **Verificar es ejecutar, no suponer.** Nada se reporta como listo sin correrlo.
5. **Un bloque a la vez, con confirmación del usuario entre bloques.**

---

## Fase 1 · Entrevista y diseño

**Lee `references/entrevista.md`** — trae el guion completo: qué preguntar, en qué
orden, cómo clasificar el proyecto y cómo presentar la arquitectura.

Resumen del recorrido:

| Ronda | Sobre qué | No puede faltar |
|---|---|---|
| 1 | Qué y para quién | Tipo de app, cuántos usuarios, prototipo o producción |
| 2 | **Seguridad** | Cómo entran, registro abierto/cerrado (+correos), roles, datos sensibles, operaciones irreversibles |
| 3 | Reglas de negocio | Zona horaria, moneda, qué pasa al pasarse de un límite, hasta cuándo se edita |
| 4 | Forma | Mockup o referencia visual, dónde vive el código y la base de datos |
| 5 | Confirmación | Presentar arquitectura en un mensaje y **esperar aprobación** |
| 6 | Blueprint | Rellenar `assets/blueprint-template.md` completo, sin placeholders |

Máximo 3 preguntas por mensaje. Usa `AskUserQuestion` con opciones concretas y
recomendación marcada. Si el usuario trae un mockup, léelo antes de preguntar:
responde solo la mitad de las preguntas.

**Salida:** `BLUEPRINT.md` aprobado, en la raíz del proyecto.

---

## Fase 2 · Preparación

1. **Repo privado nuevo.** Claude no puede crearlo (403): pide al usuario que lo
   cree vacío en github.com/new y avise. Luego se agrega a la sesión y se clona.
2. `BLUEPRINT.md` + `CLAUDE.md` (sección 15 del blueprint) en la raíz. Commit en `main`.
3. **CI desde el primer día**: copia `assets/ci.yml` a `.github/workflows/`.

---

## Fase 3 · Construcción por bloques

Orden por defecto — ajústalo al blueprint, pero **la seguridad va primero**:

| # | Bloque | Entregable |
|---|--------|-----------|
| 1 | Scaffolding + design system | Proyecto compila, colores y tipografía del mockup, iconos (`assets/gen-icons.mjs`) |
| 2 | **Base de datos + RLS + whitelist** | Migraciones aplicadas, arnés de seguridad en verde |
| 3 | **Auth end-to-end** | Login real, middleware deny-by-default, acceso ajeno rechazado |
| 4 | App shell | Navegación y rutas con placeholders |
| 5 | CRUD principal | Formularios, server actions, Zod, rate limiting |
| 6 | Pantalla principal con datos reales | |
| 7+ | Una función por bloque | |
| n-1 | Pulido / PWA | Instalable, offline, loading y estados vacíos |
| n | **Deploy + checklist de seguridad** | En producción y verificado con usuarios reales |

### Ciclo obligatorio de cada bloque

```
rama claude/bloque-NN-nombre → construir → VERIFICAR → commit → PR → resumen → ESPERAR confirmación
```

**Verificar = ejecutar:**
- `npm run test` · `npm run lint` · `npm run build` — los tres en verde
- Captura con Playwright de la pantalla nueva, comparada contra el mockup
- Si toca la base de datos: correr `assets/test-db.sh` (Postgres real)

**El resumen va en lenguaje llano:** qué puede hacer el usuario ahora que antes no
podía. Sin jerga técnica. Con el enlace al PR.

---

## Fase 4 · Despliegue

Vercel (gratis, de los creadores de Next.js). Escribe `docs/DEPLOY.md` paso a paso
— el usuario lo ejecuta, tú no tienes acceso a sus cuentas. Incluye siempre:

- Configuración del proveedor de login (con las URLs exactas)
- Variables de entorno, **con cuáles son públicas y cuáles nunca salen del servidor**
- **Checklist de seguridad final** del blueprint
- **Prueba de rechazo**: intentar entrar con una cuenta no autorizada y confirmar que falla

---

## Material de apoyo

**Antes de construir, lee:**

| Archivo | Cuándo |
|---|---|
| `references/entrevista.md` | Fase 1, siempre |
| `references/seguridad.md` | Antes del bloque 2. Las 11 reglas no negociables |
| `references/stack.md` | Al proponer la arquitectura |
| `references/blueprint.md` | Al redactar el blueprint |
| `references/supabase-compartido.md` | Si la base de datos convive con otras apps |
| `references/lecciones.md` | **Antes de depurar algo raro** — 19 trampas reales ya resueltas |

**Casos reales completos** (en el repo `the-architect`, carpeta `casos/`):

| Caso | Qué muestra |
|---|---|
| `casos/caja-familiar.md` | El caso pequeño y completo: 2 usuarios, 13 bloques, de la entrevista a producción |
| `casos/control-financiero-dg.md` | El sistema grande: 40+ bloques, 3 repos, Supabase compartido, asistente integrado, operación de producción por SQL adjunto |

Cuando el usuario diga "otra app como la financiera" o "como Caja Familiar",
lee el caso correspondiente: ahí está el orden real de bloques y las
decisiones que funcionaron.

**Ciclo `/spec` → `/build` → `/review`** (skills hermanos en `.claude/skills/`):
para funciones puntuales DENTRO de una app ya construida, ese ciclo es más
liviano que un bloque completo — la spec de la función va en `specs/` y
`/review` la verifica requisito por requisito. Este skill (app-dma) es para
construir apps enteras; el ciclo spec/build/review es para hacerles cirugía.

**Assets probados (cópialos, funcionan):**

| Archivo | Qué hace |
|---|---|
| `assets/blueprint-template.md` | Las 16 secciones listas para rellenar |
| `assets/gen-icons.mjs` | Iconos PWA + favicon.ico multi-tamaño, sin dependencias |
| `assets/test-db.sh` + `assets/stub-auth.sql` | Arnés que verifica RLS contra Postgres real |
| `assets/sw.js` | Service worker: offline + Web Push |
| `assets/next.config.ts` | Cabeceras de caché (evita que la PWA se quede pegada) |
| `assets/ci.yml` | GitHub Action: lint + tests + build en cada PR |

---

## Cómo comunicarte

- **Español llano, sin jerga.** "El día queda sellado" en vez de "RLS bloquea el UPDATE".
- **Cuando algo externo falle** (GitHub 500, panel de Supabase que no guarda, red
  bloqueada), dilo claro, explica que no es culpa del usuario y **ofrece la ruta
  alternativa**. Nunca lo dejes esperando sin saber qué pasa.
- **Cuando el usuario proponga una mejora, tómala en serio.** En Caja Familiar
  detectó que faltaba poder deshacer el cierre de caja, y tenía razón: se
  implementó y evitó un problema real.
- **Nunca pidas credenciales privadas por el chat** si hay alternativa (que las
  pegue directo en Vercel o Supabase). Las públicas (anon key, VAPID pública) sí
  se pueden compartir.
- **Reporta con honestidad.** Si algo quedó sin probar porque el entorno no llega
  a producción, dilo y pide al usuario que lo confirme desde su lado.
