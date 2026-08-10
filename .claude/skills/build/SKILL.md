---
name: build
description: |
  Construye exactamente lo que dice una especificación de specs/, sin agregar funciones ni inventar requisitos, y deja la lista de qué requisito cubrió cada pieza para que /review pueda verificarlo.

  Usa este skill cuando el usuario diga: "/build", "build", "constrúyelo", "implementa la spec", "ya está la especificación, hazlo", "aplica las correcciones del review", o cuando exista una especificación en specs/ lista para implementarse. Es el segundo paso del ciclo spec → build → review.
---

# Skill: build

Segundo eslabón del sistema auto-correctivo: **spec → construcción → `/review`**.

Construyes **exactamente** lo que dice la especificación. Ni una función de más.

---

## Regla de oro

**La especificación es el contrato.** Si algo no está en la spec, no se construye.
Si algo está en la spec y no lo entiendes, **pregunta** — no adivines.

Si mientras construyes descubres que la spec está mal o es imposible:
**para, dilo en una o dos frases, propón la corrección concreta y sigue con el
resto**. No la reescribas por tu cuenta y no te quedes bloqueado en lo que sí puedes hacer.

---

## Flujo

### 1. Localiza la especificación

- Si hay argumento (`/build calculadora-vigas`) → `specs/calculadora-vigas.md`.
- Si no hay argumento → usa el archivo más reciente de `specs/` y **di cuál estás
  usando** antes de empezar.
- Si `specs/` está vacío → no construyas nada; invoca el skill `spec` primero.

### 2. Revisa si vienes de un `/review`

Si existe `specs/<slug>.review.md` con estado `RECHAZADO`:

- **Esa es tu lista de trabajo.** Arregla cada brecha que enumera, en orden.
- No re-construyas de cero lo que ya pasó el review.
- No toques nada que el review dio por bueno.

Si no existe, es una construcción desde cero.

### 3. Construye

Trabaja requisito por requisito, en el orden de la tabla de la spec.

**Prohibido:**

- Agregar funciones que no están en la spec ("de una vez le puse un modo oscuro").
- Cambiar el stack o las dependencias que fija la sección **Restricciones**.
- Tocar archivos listados como intocables.
- Construir algo listado en **Fuera de alcance**.
- Dejar `TODO`, stubs o funciones vacías y llamarlo terminado.

**Obligatorio:**

- Cubrir **todos** los casos extremos de la tabla `E*`, no solo el camino feliz.
- Seguir las convenciones del código que ya existe en el repo (nombres, estilo,
  densidad de comentarios).
- Verificar que corre: ejecuta el comando concreto de la **Definición de
  "terminado"** antes de declarar nada.

### 4. Escribe el reporte de cobertura

Guarda en `specs/<slug>.build.md`:

~~~markdown
# Build: <Nombre>

- **Iteración:** <n>
- **Spec:** specs/<slug>.md

## Cobertura de requisitos

| ID | Requisito | Dónde quedó | Estado |
|----|-----------|-------------|--------|
| R1 | ... | `ruta/archivo.js:42` | cubierto |
| R2 | ... | `ruta/archivo.js:88` | cubierto |
| E1 | ... | `ruta/archivo.js:120` | cubierto |

## Verificación ejecutada

```
<comando que corriste>
<salida real, sin maquillar>
```

## Desviaciones

<Cualquier cosa que NO pudiste construir tal cual, y por qué. Si no hay, escribe
"ninguna". Nunca escondas una desviación aquí — /review la va a encontrar.>
~~~

Reporta lo que realmente pasó. Si un requisito quedó a medias, márcalo
`parcial` y explica qué falta — mentir aquí solo alarga el ciclo.

### 5. Encadena a `/review`

Cuando el reporte esté guardado, **invoca el skill `review` de este proyecto**
(`.claude/skills/review/SKILL.md` — el que compara contra la spec, **no** el
`/review` incorporado que revisa Pull Requests de GitHub) con el mismo slug.
No le pidas permiso al usuario para hacerlo: el ciclo se cierra solo.

---

## Freno anti-bucle

Cada vuelta incrementa **Iteración** en `specs/<slug>.build.md`.

Si llegas a la **iteración 5** sin aprobación, **detén el bucle** y escríbele al
usuario: qué requisitos siguen fallando, qué intentaste en cada vuelta y qué
decisión necesitas de él. Un bucle que no converge en 5 vueltas casi siempre es
una spec ambigua, no un problema de implementación.
