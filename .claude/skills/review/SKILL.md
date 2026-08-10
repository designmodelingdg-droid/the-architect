---
name: review
description: |
  Compara la construcción actual contra la especificación de specs/ requisito por requisito, enumera cada brecha nombrando el elemento exacto que falla, y devuelve las correcciones a /build hasta que todo se cumpla.

  Usa este skill cuando el usuario diga: "/review", "review", "revisa la construcción", "verifica contra la spec", "¿esto cumple la especificación?", "audita lo que construiste", o cuando /build acabe de terminar una iteración. Es el tercer paso del ciclo spec → build → review.
---

# Skill: review

Tercer eslabón del sistema auto-correctivo: **construcción → veredicto → `/build`**.

Eres el auditor, no el constructor. **No arregles nada aquí** — tu salida son
brechas y correcciones concretas para que `/build` las resuelva.

---

## Regla de oro

**Escéptico por defecto.** Un requisito no está cumplido porque el reporte de
`/build` diga que sí — está cumplido porque **tú lo verificaste en el código o
ejecutándolo**. Si no lo comprobaste, no lo apruebas.

Nunca apruebes "casi". El veredicto es binario: **APROBADO** o **RECHAZADO**.

---

## Flujo

### 1. Carga los tres documentos

- `specs/<slug>.md` — el contrato.
- `specs/<slug>.build.md` — lo que `/build` dice que hizo.
- El código real — la única fuente de verdad.

Si no hay argumento, usa el slug del build más reciente y di cuál estás revisando.

### 2. Verifica requisito por requisito

Recorre la spec **en orden**, sin saltarte ninguno: cada `R*`, cada `E*`, y cada
línea de la **Definición de "terminado"**.

Para cada uno:

1. Localiza en el código dónde se supone que está cumplido.
2. Compruébalo — lee el código y, cuando sea ejecutable, **córrelo**.
3. Marca ✅ solo si se cumple **completo**. Cualquier otra cosa es ❌.

Verifica también lo que la spec **prohíbe**:

- ¿Se agregaron funciones que no están en la spec? → brecha (violación de alcance).
- ¿Se tocaron archivos marcados como intocables? → brecha.
- ¿Se construyó algo listado en **Fuera de alcance**? → brecha.
- ¿Quedaron `TODO`, stubs o funciones vacías? → brecha.
- ¿El reporte de `/build` dice "cubierto" donde en realidad no lo está? → brecha,
  y dilo explícitamente.

### 3. Escribe el veredicto

Guarda en `specs/<slug>.review.md` (sobrescribe el de la vuelta anterior):

~~~markdown
# Review: <Nombre>

- **Iteración:** <n>
- **Veredicto:** APROBADO | RECHAZADO
- **Spec:** specs/<slug>.md

## Resultado por requisito

| ID | Requisito | Veredicto | Evidencia |
|----|-----------|-----------|-----------|
| R1 | ... | ✅ | `ruta/archivo.js:42` — verificado leyendo/ejecutando X |
| R2 | ... | ❌ | falta por completo |
| E1 | ... | ❌ | `ruta/archivo.js:120` — con input vacío lanza excepción |

## Brechas

Cada brecha nombra el elemento exacto de la spec que falla y la corrección concreta.

### 1. R2 — <título de la brecha>

- **Falla:** <qué está mal, en una frase>
- **Dónde:** `ruta/archivo.js:88`
- **Corrección:** <instrucción concreta y accionable, no "mejorar el manejo de errores">

### 2. E1 — <título de la brecha>

...

## Verificación ejecutada

<comando y salida real. Si no se pudo ejecutar, dilo y explica por qué.>
~~~

Reglas del reporte:

- **Nombra el ID.** "Falla R3", no "falla la validación".
- **Corrección accionable.** `/build` tiene que poder ejecutarla sin interpretar.
- **Cita rutas y líneas.** Sin evidencia, la brecha no es revisable.
- **Sin brechas inventadas.** Si algo no te gusta pero la spec no lo pide, no es
  una brecha — menciónalo aparte como observación opcional.

### 4. Cierra el ciclo

- **RECHAZADO** → **invoca el skill `build`** con el mismo slug. Él lee este
  reporte y arregla. No le preguntes al usuario si quiere continuar.
- **APROBADO** → marca la spec como `Estado: aprobada`, y dile al usuario en
  4-5 líneas: qué quedó construido, dónde vive, cómo verificarlo y cuántas
  vueltas tomó. Ahí termina el bucle.

---

## Freno anti-bucle

Respeta el mismo límite que `/build`: **máximo 5 iteraciones**.

Al llegar a la quinta sin aprobación, no encadenes otra vuelta. Escríbele al
usuario qué requisitos siguen fallando, qué se intentó en cada vuelta y qué
decisión hace falta. Si el mismo requisito falla tres vueltas seguidas por la
misma razón, dilo antes del límite: casi siempre significa que la spec es
ambigua y hay que volver a `/spec`, no seguir construyendo.
