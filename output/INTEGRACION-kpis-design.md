# Módulo «KPIs Equipo» para Design Modeling OS — notas para Patricio

**Qué hay aquí:** `maqueta-tablero-kpis-design.html` — un archivo HTML autocontenido con la
maqueta navegable del módulo. Sin dependencias, sin build, sin peticiones externas. Se abre
en el navegador y funciona.

**Qué NO es:** una app lista para producción. Es la maqueta de diseño e interacción. El
estado se guarda en `localStorage`, así que lo que marca Ester en su navegador no lo ve
nadie más. Sirve para aprobar el diseño y para que tengas la referencia exacta de cómo debe
verse y comportarse el módulo dentro de `dg-contenido-ia`.

El diseño completo (esquema de base de datos, permisos, sincronizaciones) está en
`tablero-kpis-design-blueprint.md`, en esta misma carpeta.

---

## 1. Lo que ya está resuelto en el archivo

| | |
|---|---|
| **Sistema visual** | Tomado de `dg-contenido-ia`: sidebar navy, tarjetas blancas con borde, eyebrow naranja, badges verdes, radios de 12px |
| **Tipografía** | `Overpass` para UI y números, `Nunito` para cuerpo. Declaradas por nombre con respaldo de sistema — si tu app ya las carga, calzan solas |
| **Tema claro y oscuro** | Por variables CSS en `:root`, `prefers-color-scheme` y `[data-theme]`. Ningún color vive solo dentro de un media query |
| **Accesibilidad** | Roles `tab`/`tabpanel`, `aria-pressed` en cada fila marcable, foco visible, `prefers-reduced-motion` |
| **Responsive** | El sidebar pasa arriba bajo 900px; las tablas tienen scroll propio; el body nunca se desplaza en horizontal |
| **Zona horaria** | `America/Guayaquil` explícita en todo cálculo de fecha |

## 2. Cómo llevarlo a un módulo real

### 2.1 Adaptar la estructura

El archivo trae el shell completo (sidebar + contenido) **solo para que se vea en contexto**.
Al integrarlo, quédate con lo que va dentro de `<main class="main">` y déjalo colgando del
layout que ya tiene la app. El `<aside class="sidebar">` es de referencia: sirve para ver
dónde propongo que quede la entrada de menú (`📊 KPIs Equipo`, entre *Tareas* y *Blog & SEO*).

### 2.2 Los tokens de color

Están todos en el primer bloque `:root`. Si tu app ya tiene sus propias variables, mapea
estas contra las tuyas y borra el bloque — no hay ni un color escrito a mano fuera de ahí,
salvo el degradado del logo.

### 2.3 Reemplazar los datos por consultas

Las cinco constantes al inicio del `<script>` son los únicos datos: `KPIS`, `ITEMS`,
`EQUIPO`, `PENDIENTES`, `VENTAS` + `HIGIENE`. Cada una corresponde a una tabla del blueprint:

| Constante | Tabla / origen |
|---|---|
| `KPIS` | `kpis` + `kpi_valores` (vista `v_semaforo`) |
| `ITEMS` | `items_control`, filtrado por `cadencia` |
| `EQUIPO` | `jornada` + `entregas`, agregado por persona y periodo |
| `PENDIENTES` | `pendientes` con `estado = 'abierto'` |
| `VENTAS` / `HIGIENE` | `ventas`, separadas por `estado` y `motivo_higiene` |

### 2.4 El punto importante: cómo funciona el marcado

**No hay ningún proceso que «resetee» los checkboxes.** Un ítem diario está marcado si
existe una fila con `fecha_ancla = hoy en Guayaquil`; al cambiar el día la consulta ya no la
encuentra y la casilla aparece vacía sola, con el historial intacto. La función `ancla()`
del archivo es exactamente la lógica que va al servidor:

- `diario` → la fecha de hoy
- `semanal` → el lunes ISO de esa semana
- `mensual` → el día 5 del periodo (la ventana va del día 5 al día 5)

Marcar es insertar una fila; desmarcar es borrarla. Nada de banderas booleanas que se
actualizan. El historial de quién marcó y quién desmarcó lo guarda un trigger aparte.

### 2.5 Lo que falta y no está en la maqueta

1. **Persistencia compartida.** Hoy es `localStorage`. Necesita la tabla `marcas` y que el
   marcado sea optimista contra el servidor (cambia al instante, se revierte si falla).
2. **Permisos.** El blueprint define tres roles: `admin` (Dayana), `coordinadora` (Ester y
   Gabriel) y `miembro` (Aylin, Camila, Eber, Franklin). Un `miembro` solo marca los ítems
   donde es responsable. **Esto tiene que vivir en la base de datos, no en la UI** — son
   datos de desempeño de personas identificadas.
3. **Las dos sincronizaciones.** Ventas desde GoHighLevel (vía Windsor.ai, con las reglas de
   depuración del método de cierre de mes) y trazabilidad desde la API de ClickUp. Ambas
   diarias. Las ventas entran siempre como `por_validar`: **nada suma al total sin que
   Dayana lo valide**.
4. **El export del cierre.** El botón que baja el periodo completo en el formato que
   consumen los scripts que ya generan los PDF de KPIs.

---

## 3. Lo que hay que confirmar de tu lado

1. **¿Qué usa `dg-contenido-ia` como backend?** El blueprint asume Supabase (Postgres + RLS),
   que es el estándar de las otras apps de DMA. Si tu app ya tiene base de datos y sesión, el
   módulo debería colgarse de eso en vez de montar un servicio aparte — se ahorra el login,
   el deploy y la gestión de usuarios.
2. **¿Cómo se resuelve hoy la identidad del usuario?** El módulo necesita saber quién está
   marcando para aplicar permisos y guardar la autoría.
3. **¿Existe ya una tabla de personas del equipo?** Si sí, `permitidos` y `profiles` se
   reemplazan por lo que ya tengas.

Cualquiera de estas tres respuestas cambia el plan de construcción, así que conviene
resolverlas antes de escribir la primera migración.
