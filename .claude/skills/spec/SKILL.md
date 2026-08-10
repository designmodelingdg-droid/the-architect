---
name: spec
description: |
  Convierte una idea a medio formar en una especificación detallada y verificable, entrevistando al usuario una pregunta a la vez antes de escribir nada de código.

  Usa este skill cuando el usuario diga: "/spec", "spec", "quiero construir...", "tengo una idea para una app/herramienta/función", "ayúdame a definir qué voy a construir", "hazme la especificación", "entrevístame sobre lo que quiero", o cuando traiga un plan vago que todavía no está listo para implementarse. Es el primer paso del ciclo spec → build → review.
---

# Skill: spec

Primer eslabón del sistema auto-correctivo: **entrevista → especificación → `/build`**.

Tu único trabajo aquí es **entender**. No escribas código. No crees archivos del
proyecto. No propongas arquitectura hasta que la entrevista haya terminado.

---

## Regla de oro

**Una sola pregunta enfocada a la vez.** Nada de cuestionarios de diez puntos.
Cada respuesta cambia cuál es la siguiente pregunta — por eso se pregunta de una en una.

Usa la herramienta `AskUserQuestion` cuando la pregunta tenga opciones discretas
(elegir entre 2-4 caminos). Usa texto normal cuando la respuesta sea abierta.

---

## Flujo

### 1. Arranque

Si el usuario pasó un argumento (`/spec calculadora de vigas`), úsalo como tema.
Si no, pregunta primero: **"¿Qué quieres construir? Descríbelo como se te venga,
no tiene que estar ordenado."**

### 2. Entrevista

Sigue preguntando, de una en una, hasta que puedas responder **las cinco** con
certeza. No adivines ninguna: si no la sabes, pregúntala.

| # | Qué tienes que saber | Ejemplo de pregunta |
|---|---|---|
| 1 | **Objetivo** — qué problema resuelve y para quién | "¿Quién va a usar esto y qué está haciendo hoy sin ello?" |
| 2 | **Requisitos obligatorios** — qué debe hacer sí o sí | "Si solo pudiera hacer tres cosas, ¿cuáles serían?" |
| 3 | **Restricciones** — stack, archivos, dónde vive, qué no se puede tocar | "¿Esto es un archivo HTML suelto, entra a un repo existente, necesita backend?" |
| 4 | **Casos extremos** — qué pasa cuando el input es raro, vacío o enorme | "¿Qué debería pasar si el usuario deja el campo en blanco?" |
| 5 | **Definición de "terminado"** — cómo se verifica que quedó bien | "¿Qué tendrías que ver funcionando para decir 'esto ya está'?" |

Reglas de la entrevista:

- **Refleja antes de avanzar.** Si el usuario dice algo ambiguo, parafrasea:
  "Entonces lo que quieres es X, ¿correcto?" — y espera confirmación.
- **Persigue lo vago.** "Que se vea bien" no es un requisito. "Tipografía Inter,
  máximo 2 colores, funciona en móvil a 375px" sí lo es.
- **No inventes alcance.** Si se te ocurre una función extra, pregunta si la
  quiere — no la asumas dentro.
- **Detecta lo que ya existe.** Si el proyecto ya tiene algo parecido
  (busca en el repo), menciónalo: "Ya existe `X`, ¿esto lo reemplaza o convive?"
- **Corta cuando ya sabes.** No alargues la entrevista por deporte. Típicamente
  son entre 5 y 10 preguntas.

### 3. Cierre de la entrevista

Antes de escribir, resume en 5-8 líneas lo que entendiste y pregunta:
**"¿Escribo la especificación con esto, o falta algo?"**

Solo escribe el archivo cuando el usuario confirme.

### 4. Escribe la especificación

Guarda en `specs/<slug>.md` — el slug es el nombre de la función en kebab-case
(ej. `specs/calculadora-vigas.md`). Si el archivo ya existe, pregunta si lo
sobrescribes o creas una versión nueva.

Usa exactamente esta estructura:

```markdown
# Spec: <Nombre>

- **Estado:** borrador
- **Creada:** <YYYY-MM-DD>
- **Slug:** <slug>

## Objetivo

<2-4 frases. Qué problema resuelve, para quién, y por qué importa.>

## Requisitos

Cada requisito es verificable y tiene ID. Nada de "debe ser rápido" — di "responde
en menos de 200ms con 1.000 filas".

| ID | Requisito | Cómo se verifica |
|----|-----------|------------------|
| R1 | ... | ... |
| R2 | ... | ... |

## Restricciones

- **Stack:** ...
- **Archivos que se pueden tocar:** ...
- **Archivos que NO se pueden tocar:** ...
- **Dependencias permitidas:** ...

## Casos extremos

| ID | Situación | Comportamiento esperado |
|----|-----------|-------------------------|
| E1 | ... | ... |
| E2 | ... | ... |

## Fuera de alcance

<Lista explícita de lo que NO se construye. Esto protege contra que /build
invente funciones.>

## Definición de "terminado"

Checklist binario — cada línea se marca ✅ o ❌, sin zonas grises.

- [ ] R1: ...
- [ ] R2: ...
- [ ] E1: ...
- [ ] La construcción corre sin errores con: `<comando concreto>`
```

### 5. Encadena a `/build`

Cuando el archivo esté guardado:

1. Dile al usuario en qué ruta quedó y resume los requisitos en una línea.
2. **Invoca el skill `build`** con el slug como argumento, para continuar el ciclo
   sin que el usuario tenga que hacer nada.

---

## Lo que NO haces en este skill

- No escribes código de la función.
- No creas archivos fuera de `specs/`.
- No empiezas a construir "mientras tanto".
- No decides por el usuario cuando la respuesta cambia el resultado.
