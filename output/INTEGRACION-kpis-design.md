# Design Modeling OS — tres módulos nuevos · notas para Patricio

**Qué hay en esta carpeta**

| Archivo | Qué es |
|---|---|
| `maqueta-tablero-kpis-design.html` | Maqueta del módulo **KPIs Equipo** |
| `maqueta-tareas-playbook.html` | Maqueta de los módulos **Tareas** (mejorado) y **Playbook** |
| `tablero-kpis-design-blueprint.md` | Diseño técnico completo: esquema SQL, permisos, sincronizaciones |

Los dos HTML son autocontenidos: sin dependencias, sin build, sin peticiones externas. Se
abren en el navegador y funcionan.

**Qué NO son:** apps de producción. El estado vive en memoria o en `localStorage`, así que
lo que marca una persona no lo ve nadie más. Sirven para aprobar diseño e interacción, y
como referencia exacta de cómo deben verse y comportarse los módulos dentro de
`dg-contenido-ia`.

---

## 0. Lo primero: lo que necesito de tu lado

Intenté entrar a `dg-contenido-ia.vercel.app/panel` y llegué **solo a la pantalla de
login** — pide un código. No entré al panel, así que todo lo que sigue está deducido de
capturas, no del código.

Para avanzar en serio hace falta **acceso al repositorio**, no a la URL. El repo no aparece
en la cuenta de GitHub de Design Modeling (`designmodelingdg-droid`), así que asumo que está
en la tuya. Con el repo puedo trabajar contra el código real en vez de proponer a ciegas.

Y tres preguntas que cambian el plan de construcción:

1. **¿Qué usa la app como base de datos?** El blueprint asume Supabase (Postgres + RLS), que
   es el estándar de las otras apps de DMA. Si ya tienes una, los módulos deberían colgarse
   de ella.
2. **¿Cómo se resuelve la identidad del usuario?** Hoy el acceso es por código compartido.
   Los tres módulos necesitan saber **quién** es cada persona: para asignar tareas, aplicar
   permisos, guardar autoría y enviar notificaciones. Un código común no alcanza —
   probablemente sea el primer cambio de fondo que hay que hacer.
3. **¿Existe ya una tabla de personas del equipo?** Si sí, reemplaza a `permitidos` y
   `profiles` del blueprint.

---

## 1. Lo que ya está resuelto en las maquetas

| | |
|---|---|
| **Sistema visual** | Tomado de la app: sidebar navy, tarjetas blancas con borde, eyebrow naranja, badges verdes, radios de 12px |
| **Tipografía** | `Overpass` para UI y números, `Nunito` para cuerpo, declaradas por nombre con respaldo de sistema — si la app ya las carga, calzan solas |
| **Tema claro y oscuro** | Por variables CSS en `:root`, `prefers-color-scheme` y `[data-theme]`. Ningún color vive solo dentro de un media query |
| **Accesibilidad** | Roles `tab`/`tabpanel`, `aria-pressed`, foco visible, `prefers-reduced-motion` |
| **Responsive** | Sidebar arriba bajo 900px, Kanban a una columna, tablas con scroll propio, el body nunca se desplaza en horizontal |
| **Zona horaria** | `America/Guayaquil` explícita en todo cálculo de fecha |

Verificado en Chromium, claro y oscuro, sin errores de consola.

---

## 2. Módulo KPIs Equipo

Cinco vistas: semáforo del mes, checklist del equipo, KPIs por persona, pendientes y cierre.

### Datos

Las constantes al inicio del `<script>` son el único origen: `KPIS`, `ITEMS`, `EQUIPO`,
`PENDIENTES`, `VENTAS`, `HIGIENE`. Cada una corresponde a una tabla del blueprint.

### El patrón central: cómo funciona el marcado

**No hay ningún proceso que «resetee» los checkboxes.** Un ítem diario está marcado si
existe una fila con `fecha_ancla = hoy en Guayaquil`; al cambiar el día la consulta ya no la
encuentra y la casilla aparece vacía sola, con el historial intacto. La función `ancla()` es
exactamente la lógica que va al servidor:

- `diario` → la fecha de hoy
- `semanal` → el lunes ISO de esa semana
- `mensual` → el día 5 del periodo (la ventana va del día 5 al día 5)

Marcar es insertar una fila; desmarcar es borrarla. Nada de banderas booleanas que se
actualizan. Quién marcó y quién desmarcó lo guarda un trigger aparte.

---

## 3. Módulo Tareas (sobre el Kanban que ya hiciste)

El Kanban actual funciona. Lo que cambia:

| Hoy | Propuesta |
|---|---|
| Un tablero de contenido | **Cinco áreas en un solo tablero**, filtrables: Marketing, Gerencia, Soporte, Plataforma, Closer/Setter |
| Tareas creadas a mano | Se suman las que **nacen de reuniones**, con enlace a la grabación en el minuto exacto |
| Sin avisos | **Bandeja de notificaciones** — el reemplazo del grupo de WhatsApp |

### La bandeja

Cada aviso nace de un hecho de la plataforma: tarea asignada, comentario, vencimiento,
reunión con compromisos sin repartir, llamada analizada. Tres canales:

1. **En la app** — la bandeja, con globo de no leídos en el menú
2. **Correo** — el mismo aviso, para quien no entre
3. **Push del navegador** — solo para vencimientos y asignaciones directas

Más un **resumen diario a las 08:00 hora de Ecuador** con lo que vence hoy y lo que quedó
sin dueño. Sin esto la gente no vuelve, y el módulo muere como murió ClickUp.

### Modelo de datos que hay que sumar

```
tareas          id · titulo · detalle · area · responsable_id · vence · columna
                origen ('manual' | 'reunion') · reunion_id · reunion_ts · creado_por
comentarios     id · tarea_id · autor_id · cuerpo · creado_en
avisos          id · destinatario_id · tipo · titulo · detalle · enlace
                leido_en · enviado_email · enviado_push
```

Regla que viene del ciclo anterior: **`vence` es obligatorio**. El 64% de los pendientes sin
fecha se postergaron.

---

## 4. Módulo Playbook — y el hallazgo importante

**Fathom ya tiene todo lo que este módulo necesita.** No hay que construir grabación,
transcripción ni extracción: la cuenta de Design Modeling DG tiene las reuniones de la
empresa desde enero de 2026, con resumen, temas, próximos pasos y **compromisos ya extraídos
con responsable sugerido y marca de tiempo**.

Lo que falta no es capturar información. Es el paso que hoy nadie hace: **convertir esos
compromisos en tareas con dueño y fecha.**

### Las dos mitades del módulo

**a) Reuniones → tareas.** Lista las reuniones con sus compromisos y un botón que los manda
al Kanban.

> **Por qué hay revisión humana y no es automático:** Fathom asigna la mayoría de los
> compromisos a la cuenta que grabó («Design Modeling DG»), no a la persona real, y los
> escribe en inglés. Volcarlos directo llenaría el tablero de tareas sin dueño verdadero. El
> módulo propone —sugiriendo responsable según quién estuvo en la llamada— y una persona
> confirma en dos clics.

**b) Playbook de ventas.** Cada asesoría del Máster pasa por la misma rúbrica: diagnóstico,
encaje con el producto, defensa de precio, manejo de objeciones y próximo paso. Eber y
Franklin ven qué repetir y qué corregir; Camila ve si el setteo trae gente que califica.

### Lo que ya se ve en las llamadas reales

Analicé tres asesorías con lo que Fathom tiene. Dos patrones aparecen solos:

- **Defensa de precio.** En la llamada de Ronal Hinojosa (29 jul) se cerró en US$ 1.900
  presentando US$ 2.400 como estándar, cuando el ticket de referencia del método de cierre
  de mes es US$ 2.699,99. El descuento se concedió antes de que apareciera una objeción de
  precio. Vale la pena revisar de dónde sale ese ancla.
- **Quién da el próximo paso.** En la de Rodrigo Faicán (30 jul) el siguiente movimiento
  quedó del lado del cliente — él tenía que escribir. Es el patrón que más ventas pierde, y
  la regla del playbook debería ser que el closer siempre agenda el siguiente contacto.

Esto sale de **tres** llamadas. Hay cuatro asesorías más grabadas sin analizar. El módulo
existe para que esto deje de depender de que alguien escuche llamadas a mano.

### Datos y conexión

```
reuniones       id · fathom_recording_id · titulo · fecha · url · participantes
compromisos     id · reunion_id · texto · responsable_sugerido · area_sugerida
                timestamp_seg · tarea_id (null hasta convertir)
llamadas        id · reunion_id · cliente · closer · resultado
evaluaciones    id · llamada_id · criterio · valoracion · evidencia · evaluado_en
```

La conexión es la **API de Fathom** (el conector ya está activo en la cuenta de Dayana).
Sincronización diaria: trae reuniones nuevas y sus action items. Nada se convierte en tarea
sin confirmación humana.

---

## 5. Orden sugerido de construcción

La identidad va primero porque todo lo demás depende de ella.

| # | Bloque | Por qué en ese orden |
|---|---|---|
| 1 | **Identidad real por persona** | Sin saber quién es cada quien no hay asignación, permisos ni notificaciones |
| 2 | Tablas base + permisos | La seguridad se construye acá, no al final |
| 3 | Tareas con áreas y comentarios | Sobre tu Kanban actual |
| 4 | Bandeja + correo + resumen diario | Lo que hace que el equipo vuelva |
| 5 | Sync de Fathom → compromisos | Reuniones a la bandeja de propuestas |
| 6 | Conversión compromiso → tarea | Cierra el ciclo reunión-tablero |
| 7 | KPIs: semáforo y checklist | El módulo de Ester |
| 8 | Sync GoHighLevel y ClickUp | Ventas por validar y trazabilidad |
| 9 | Playbook de ventas | Necesita las llamadas ya sincronizadas del bloque 5 |
| 10 | Export del cierre | Alimenta los PDF que ya existen |

---

## 6. Advertencia que conviene no saltarse

Los tres módulos manejan **datos de desempeño de personas identificadas** — horas, tareas
sin cumplir, evaluaciones de llamadas de venta. Dos consecuencias:

1. **Los permisos van en la base de datos, no en la interfaz.** Que un miembro no vea la
   evaluación de otro tiene que ser imposible a nivel de consulta, no solo invisible en
   pantalla.
2. **El playbook de ventas se conversa antes de encenderse.** Que Eber y Franklin sepan que
   sus llamadas se evalúan contra una rúbrica es condición para que la herramienta sirva
   para mejorar en vez de para vigilar. La diferencia está en quién ve el resultado y para
   qué se usa, y eso es una decisión de Dayana, no de diseño.
