# Design Modeling OS — brief de construcción para tres módulos nuevos

**Para:** Patricio (y el Claude que trabaje con él sobre `dg-contenido-ia`)
**De:** The Architect · encargo de Dayana Calderón
**Fecha:** 17 de agosto de 2026

Este documento se lee solo: trae los datos reales del equipo, la matriz de permisos, el
esquema de base de datos completo de los tres módulos, las integraciones y el orden de
construcción. No hace falta leer la conversación que lo originó.

Lo único que no está transcrito acá son **tres catálogos de arranque** —los 25 ítems de
control, los KPIs con sus metas en detalle y los 14 pendientes—, que viven en los anexos de
`tablero-kpis-design-blueprint.md` y, ya listos para copiar, en las constantes del `<script>`
de las maquetas HTML. Ver §5.3.

---

## 0. Los archivos

| Archivo | Qué es |
|---|---|
| `maqueta-tablero-kpis-design.html` | Maqueta navegable del módulo **KPIs Equipo** (5 vistas) |
| `maqueta-tareas-playbook.html` | Maqueta navegable de **Tareas** y **Playbook** (4 vistas) |
| `tablero-kpis-design-blueprint.md` | Diseño técnico largo del módulo KPIs: SQL completo, RLS, 14 bloques |
| `mi-agenda-blueprint.md` | **Reutilizable**: la app personal de Dayana ya resolvió proyectos, pasos e ideas con su SQL, CHECK y triggers. Leerlo antes de escribir esa parte (§3.3) |
| Este documento | El brief de construcción de los tres módulos |

Las maquetas son HTML autocontenido: sin dependencias, sin build, sin peticiones externas.
Se abren en el navegador con doble clic y funcionan. **No son código de producción** — el
estado vive en memoria o en `localStorage`, así que lo que marca una persona no lo ve nadie
más. Sirven para aprobar diseño e interacción y como referencia exacta de comportamiento.

### Cómo verlas

**La forma segura: abrir los dos archivos `.html` directamente.** Están en el PR, se
descargan y se abren en cualquier navegador. No necesitan servidor ni conexión.

También están publicadas en línea, enlazadas entre sí desde el menú lateral para recorrerlas
como si fueran una sola app:

| Maqueta | Enlace |
|---|---|
| KPIs Equipo | `https://claude.ai/code/artifact/e2d2ef2f-0352-42ba-9883-9a55b9658d44` |
| Tareas y Playbook | `https://claude.ai/code/artifact/cdf6c3ae-8a38-43e8-951b-61d41d8b1cb6` |

> **Ojo:** esas páginas son **privadas de la cuenta de Dayana**. Si Patricio abre los enlaces
> sin que se los hayan compartido, no va a ver nada. O Dayana las comparte desde el menú de
> cada página, o se trabaja con los archivos `.html` — que para construir es lo práctico,
> porque hay que leerles el código.

### Qué probar en cada una

| Maqueta | Vistas | Qué está vivo |
|---|---|---|
| **KPIs Equipo** | Semáforo · Checklist · Equipo · Pendientes · Cierre | Marcar y desmarcar ítems (persiste en el navegador), validar y descartar ventas moviendo el total |
| **Tareas y Playbook** | Bandeja · Kanban · Calendario · Reuniones · Playbook | Mover tarjetas entre columnas, filtrar por área, encender y apagar capas del calendario, convertir un compromiso de reunión en tarea y verlo aparecer en el Kanban |

La función `ancla()` del `<script>` de la maqueta de KPIs y la función `estaVencida()` de la
de Tareas son **la lógica exacta que va al servidor** — no son atajos de demostración.

---

## 1. Lo que se pudo verificar de la app actual

Dayana entregó el código de acceso (`EQUIPO-DG`). **No se pudo entrar al panel**: este
entorno no logra abrir el sitio con un navegador (la salida a internet pasa por un proxy que
corta la conexión de Chromium; `curl` sí llega). Así que lo de abajo sale de inspeccionar el
HTML y los bundles públicos, no de haber navegado la app.

**Confirmado:**

- **Next.js con Turbopack, desplegado en Vercel.** Los chunks salen de `/_next/static/chunks/`
  con el parámetro `dpl=` de Vercel. Coincide con el stack del blueprint (Next.js 15 App
  Router), así que los módulos encajan sin cambiar de tecnología.
- **El acceso es un código compartido**, validado en el cliente: `/panel` responde 307 hacia
  la pantalla de código.

**No confirmado — hay que verificarlo del lado de ustedes:**

- En los bundles que sirve `/panel` **no aparece ninguna señal de Supabase, Firebase, Prisma
  ni Postgres**; lo único que aparece es `localStorage`. Puede ser que el chunk del panel se
  cargue después y no lo haya visto, pero **si el Kanban actual guarda las tareas en
  `localStorage`, cada persona ve solo las suyas y nadie ve las de los demás** — la tarjeta
  «Prueba» de la captura existiría únicamente en el navegador de Dayana. Es lo primero que
  hay que comprobar, porque cambia el tamaño del trabajo.

### Las tres preguntas que definen el plan

1. **¿Hay base de datos?** Si no la hay, el bloque 1 deja de ser «identidad» y pasa a ser
   «base de datos + identidad».
2. **¿Cómo se distingue a cada persona?** Hoy todos entran con el mismo código. Los tres
   módulos necesitan saber **quién** es cada quien: para asignar tareas, aplicar permisos,
   guardar autoría y enviar notificaciones. Un código común no alcanza.
3. **¿Existe ya una tabla de personas?** Si sí, reemplaza a `permitidos` y `profiles`.

### Sobre el acceso al repositorio

El repo de `dg-contenido-ia` no está en la cuenta de GitHub de Design Modeling
(`designmodelingdg-droid`), así que se asume que está en la de Patricio. Para trabajar sobre
el código real hace falta acceso; con la URL sola no se puede.

---

## 2. El equipo de DG — nombres, correos y permisos

Correos tomados del workspace de ClickUp de Design Modeling el 17/08/2026. Roles
confirmados por Dayana.

| Correo | Nombre | Rol | Función |
|---|---|---|---|
| `designmodelingdg@gmail.com` | Dayana Calderón Brunetti | `admin` | Dirección |
| `asistencia.generaldg@gmail.com` | Ester Álvarez | `coordinadora` | Asesora Cursos · coordinación operativa |
| `gabrielpantoja.ucab@gmail.com` | Gabriel Pantoja Linares | `coordinadora` | Supervisión de Soporte y Ventas |
| `aylin.taur@gmail.com` | Aylin Tapia | `miembro` | Soporte Técnico |
| `cami16012001@gmail.com` | Camila Pinto | `miembro` | Setter (ingresó 05/08/2026) |
| `martinezeber61@gmail.com` | Eber Martínez | `miembro` | Closer Máster |
| **falta el correo** | Franklin | `miembro` | Closer |

> **Franklin no tiene cuenta en ClickUp**, así que su correo es el único dato que falta.
> Sin él no puede entrar: la whitelist rechaza en la base cualquier correo no cargado.

Otras personas que aparecen en las reuniones y **no** están en la lista de acceso: Patricio
(desarrollo), Fabián (pauta), Francisco (edición de video), Pily y Fran Bayas
(incorporaciones al equipo de ventas). Si alguno debe entrar, hay que sumarlo a mano.

### Matriz de permisos

| Acción | `admin` | `coordinadora` | `miembro` |
|---|:---:|:---:|:---:|
| Ver el tablero completo y los KPIs | ✅ | ✅ | ✅ |
| Marcar / desmarcar **cualquier** ítem de control | ✅ | ✅ | ❌ |
| Marcar / desmarcar **los ítems donde es responsable** | ✅ | ✅ | ✅ |
| Crear y asignar tareas y pendientes | ✅ | ✅ | ❌ |
| Cambiar el estado de **sus** tareas | ✅ | ✅ | ✅ |
| Comentar en cualquier tarea | ✅ | ✅ | ✅ |
| Cargar jornada y entregas de **todo el equipo** | ✅ | ✅ | ❌ |
| Registrar **sus** entregas | ✅ | ✅ | ✅ |
| Ver la jornada de **otro miembro** | ✅ | ✅ | ❌ |
| Convertir compromisos de reunión en tareas | ✅ | ✅ | ❌ |
| **Validar o descartar ventas** | ✅ | ❌ | ❌ |
| Definir metas y cerrar el periodo | ✅ | ❌ | ❌ |
| Ver el playbook de **sus propias** llamadas | ✅ | ✅ | ✅ |
| Ver el playbook de las llamadas de **otro** | ✅ | ✅ | ❌ |
| Gestionar personas, ítems y catálogos | ✅ | ❌ | ❌ |

**Regla no negociable:** esto vive en la base de datos (RLS o equivalente), **no en la
interfaz**. Que un miembro no vea la evaluación de llamadas de otro tiene que ser imposible
a nivel de consulta, no solo invisible en pantalla. Son datos de desempeño de personas
identificadas.

### Semilla SQL (Postgres / Supabase)

```sql
create type rol_usuario as enum ('admin','coordinadora','miembro');

create table permitidos (
  correo text primary key,
  nombre text not null,
  rol    rol_usuario not null default 'miembro',
  funcion text
);

insert into permitidos (correo, nombre, rol, funcion) values
  ('designmodelingdg@gmail.com',    'Dayana Calderón Brunetti', 'admin',        'Dirección'),
  ('asistencia.generaldg@gmail.com','Ester Álvarez',            'coordinadora', 'Asesora Cursos · coordinación operativa'),
  ('gabrielpantoja.ucab@gmail.com', 'Gabriel Pantoja Linares',  'coordinadora', 'Supervisión de Soporte y Ventas'),
  ('aylin.taur@gmail.com',          'Aylin Tapia',              'miembro',      'Soporte Técnico'),
  ('cami16012001@gmail.com',        'Camila Pinto',             'miembro',      'Setter'),
  ('martinezeber61@gmail.com',      'Eber Martínez',            'miembro',      'Closer Máster');
  -- falta Franklin: ('<correo>', 'Franklin', 'miembro', 'Closer')

-- Registro cerrado: si el correo no está arriba, la base rechaza el alta.
create or replace function crear_profile() returns trigger
language plpgsql security definer set search_path = public as $$
declare p record;
begin
  select * into p from permitidos where lower(correo) = lower(new.email);
  if not found then
    raise exception 'Correo no autorizado para Design Modeling OS';
  end if;
  insert into profiles (id, correo, nombre, rol)
  values (new.id, lower(new.email), p.nombre, p.rol);
  return new;
end $$;

create trigger trg_crear_profile
  after insert on auth.users
  for each row execute function crear_profile();
```

> **Este archivo con los correos no se versiona en un repo público.** Se aplica directo
> contra la base de datos del proyecto.

**Sobre el código compartido:** conviene que `EQUIPO-DG` deje de ser el mecanismo de acceso y
pase a ser, como mucho, un paso previo. La identidad debería resolverse con Google OAuth
(todos los correos del equipo son de Google), que además da el nombre y la foto sin pedirlos.

---

## 3. Módulo Tareas — sobre el Kanban que ya existe

### Respuestas rápidas

- **¿El Kanban se ve en horizontal?** Sí. Las cuatro columnas (Por hacer · En proceso ·
  Revisión · Listo) van lado a lado, como está hoy. En pantallas de menos de 1100px pasa a
  dos columnas y en celular a una, para no obligar a desplazamiento lateral.
- **¿Se pueden añadir notificaciones en la app?** Sí, y están en la maqueta. Ver §3.2.

### 3.1 Qué cambia respecto de lo que ya hiciste

| Hoy | Propuesta |
|---|---|
| Un tablero de contenido | **Cinco áreas en un solo tablero**, filtrables con chips |
| Tareas creadas a mano | Se suman las que **nacen de reuniones**, con enlace a la grabación en el minuto exacto |
| Sin avisos | **Bandeja de notificaciones** con globo de no leídos en el menú |

Las cinco áreas: **Marketing · Gerencia · Soporte · Plataforma · Closer/Setter**.

Un solo tablero y no uno por área: así Dayana ve todo de un vistazo y cada quien filtra lo
suyo con un clic. Cinco tableros separados obligan a cinco visitas y nadie las hace.

### 3.2 Notificaciones

Cada aviso nace de un hecho de la plataforma, nunca de un cron que "revisa a ver si pasó
algo":

| Evento | Quién recibe |
|---|---|
| Te asignaron una tarea | El responsable |
| Comentaron en una tarea tuya | El responsable y quien la creó |
| Te mencionaron en un comentario | El mencionado |
| Tu tarea vence hoy | El responsable |
| Tu tarea venció y sigue abierta | El responsable y su coordinadora |
| Una reunión dejó compromisos sin repartir | Las coordinadoras |
| Se analizó una llamada tuya | El closer o setter, y las coordinadoras |
| Se validó o descartó una venta | Quien la cerró |

**Tres canales:**

1. **En la app** — la bandeja, con globo de no leídos en el menú lateral
2. **Correo** — el mismo aviso, para quien no entre ese día
3. **Push del navegador** — solo vencimientos y asignaciones directas, para no quemarlo

Más un **resumen diario a las 08:00 hora de Ecuador** con lo que vence hoy y lo que quedó sin
dueño. Sin ese resumen la gente no vuelve, y el módulo muere como murió ClickUp — que hoy
registra el 32,6% del trabajo real del área.

### 3.3 Proyectos, adjuntos, recordatorios e ideas — el patrón de Mi Agenda

Dayana ya opera su app personal **Mi Agenda** con exactamente esta forma, y funciona. El
equipo debería tener lo mismo, con dueño compartido. **No hay que diseñarlo de nuevo:** el
blueprint de esa app está en `output/mi-agenda-blueprint.md` (mismo repo) y trae el SQL de
`proyectos`, `pasos` e `ideas` ya resuelto, con sus CHECK y sus triggers. Conviene leerlo
antes de escribir la primera migración de esta parte.

Lo que se copia tal cual:

- **Proyectos** con nombre, *resultado* («cómo se ve terminado»), estado
  `activo · pausado · terminado · cancelado`, color, vencimiento y orden. En Mi Agenda un
  proyecto agrupa **pasos**; acá agrupa **tareas** — es la misma relación.
- **Ideas** como bandeja de captura, con estado `nueva · en_proyecto · archivada · descartada`
  y `proyecto_id` con `on delete set null`: borrar un proyecto no borra la idea que lo
  originó, la deja suelta.
- La regla de que `cerrado_en` existe **si y solo si** el estado es terminado o cancelado.

Lo que hay que agregar porque Mi Agenda no lo tiene:

**Adjuntos.** Se cuelgan de una tarea **o** de un proyecto, con cuatro tipos:

| Tipo | Qué es | Dónde vive |
|---|---|---|
| `archivo` | Subida directa (PDF, imagen, xlsx…) | Bucket privado de Storage |
| `nota` | Texto escrito ahí mismo | La propia tabla |
| `enlace` | URL externa con título | La propia tabla |
| `archivero` | Referencia a un archivo **ya subido antes** | Apunta al mismo objeto de Storage |

El cuarto tipo es el que evita que el mismo brochure se suba once veces: el archivero es el
repositorio común del equipo, y adjuntar desde ahí no duplica el archivo, lo referencia.

**Recordatorios.** No son lo mismo que las notificaciones del §3.2. Una notificación reacciona
a un hecho; un recordatorio es alguien diciendo «avísame de esto el jueves a las 9». Se
guarda aparte y al dispararse genera un aviso normal.

```sql
create type estado_proyecto as enum ('activo','pausado','terminado','cancelado');
create type estado_idea     as enum ('nueva','en_proyecto','archivada','descartada');
create type tipo_adjunto    as enum ('archivo','nota','enlace','archivero');

create table proyectos (
  id bigserial primary key,
  nombre text not null check (char_length(nombre) between 1 and 160),
  resultado text not null default '',            -- cómo se ve terminado
  area area_equipo not null,
  responsable_id uuid references profiles(id),
  estado estado_proyecto not null default 'activo',
  color text not null default 'sky',
  vence date,
  orden int not null default 0,
  creado_por uuid not null references profiles(id),
  creado_en timestamptz not null default now(),
  cerrado_en timestamptz,
  check ((cerrado_en is not null) = (estado in ('terminado','cancelado')))
);

-- Una tarea puede vivir suelta o dentro de un proyecto.
alter table tareas add column proyecto_id bigint references proyectos(id) on delete set null;

create table adjuntos (
  id bigserial primary key,
  tarea_id    bigint references tareas(id)    on delete cascade,
  proyecto_id bigint references proyectos(id) on delete cascade,
  tipo tipo_adjunto not null,
  titulo text not null,
  cuerpo text,                                   -- tipo 'nota'
  url text,                                      -- tipo 'enlace'
  storage_path text,                             -- tipos 'archivo' y 'archivero'
  bytes bigint,
  mime text,
  subido_por uuid not null references profiles(id),
  creado_en timestamptz not null default now(),
  -- cuelga de una tarea o de un proyecto, nunca de las dos ni de ninguna
  check (num_nonnulls(tarea_id, proyecto_id) = 1),
  check (
    (tipo = 'nota'      and cuerpo is not null) or
    (tipo = 'enlace'    and url    is not null) or
    (tipo in ('archivo','archivero') and storage_path is not null)
  )
);
create index on adjuntos (tarea_id);
create index on adjuntos (proyecto_id);

create table ideas (
  id bigserial primary key,
  texto text not null check (char_length(texto) between 1 and 2000),
  estado estado_idea not null default 'nueva',
  area area_equipo,
  proyecto_id bigint references proyectos(id) on delete set null,
  autor_id uuid not null references profiles(id),
  creado_en timestamptz not null default now()
);

create table recordatorios (
  id bigserial primary key,
  tarea_id bigint references tareas(id) on delete cascade,
  para_id  uuid not null references profiles(id),
  recordar_en timestamptz not null,
  nota text,
  disparado_en timestamptz,
  creado_por uuid not null references profiles(id)
);
create index on recordatorios (recordar_en) where disparado_en is null;
```

**Storage:** un bucket **privado** con política por rol. Los adjuntos del equipo incluyen
brochures, guiones y planillas internas — nada de bucket público con URL adivinable. La
descarga se sirve con URL firmada de vida corta.

### 3.4 La vista de calendario

La app ya tiene un **Calendario de publicaciones**. Lo correcto no es un segundo calendario
sino **capas sobre el mismo**, con un interruptor por capa:

| Capa | Qué pinta | Origen |
|---|---|---|
| 📅 Publicaciones | Lo que ya existe hoy | El módulo actual |
| 🗂️ Tareas | Cada tarea en su fecha de `vence` | `tareas` |
| 📌 Proyectos | El vencimiento del proyecto, como banda | `proyectos` |
| 🎙️ Reuniones | Las reuniones de Fathom | `reuniones` |
| ⏰ Recordatorios | Los que aún no se dispararon | `recordatorios` |

Dos calendarios separados obligan a mirar en dos lugares para saber cómo viene la semana, y
eso es justo lo que ya pasa hoy entre ClickUp, GHL y las planillas.

Detalles que definen si sirve o estorba:

- **Vista mes y vista semana.** La de mes para planificar; la de semana para trabajar.
- **Filtro por persona y por área**, con «solo lo mío» como primer botón.
- **Las vencidas se pintan en rojo y se quedan en su día**, no saltan a hoy: mover la fecha
  es una decisión de alguien, no un efecto de la interfaz.
- **Arrastrar una tarea a otro día cambia su `vence`** y deja rastro en el historial.
- Todo en `America/Guayaquil`. Un evento del 31/08 a las 23:00 no puede aparecer el 1/09.

### 3.5 Datos

```sql
create type area_equipo  as enum ('marketing','gerencia','soporte','plataforma','comercial');
create type col_kanban   as enum ('hacer','proceso','revision','listo');
create type origen_tarea as enum ('manual','reunion');

create table tareas (
  id             bigserial primary key,
  titulo         text not null,
  detalle        text,
  area           area_equipo not null,
  responsable_id uuid not null references profiles(id),
  vence          date not null,                    -- OBLIGATORIO, ver abajo
  prioridad      text not null default 'media' check (prioridad in ('alta','media','baja')),
  columna        col_kanban not null default 'hacer',
  origen         origen_tarea not null default 'manual',
  reunion_id     bigint references reuniones(id),
  reunion_ts     int,                              -- segundo exacto de la grabación
  creado_por     uuid not null references profiles(id),
  creado_en      timestamptz not null default now(),
  cerrado_en     timestamptz
);
create index on tareas (columna, area);
create index on tareas (responsable_id, vence);

create table comentarios (
  id        bigserial primary key,
  tarea_id  bigint not null references tareas(id) on delete cascade,
  autor_id  uuid not null references profiles(id),
  cuerpo    text not null,
  creado_en timestamptz not null default now()
);

create table avisos (
  id              bigserial primary key,
  destinatario_id uuid not null references profiles(id),
  tipo            text not null,
  titulo          text not null,
  detalle         text,
  enlace          text,
  leido_en        timestamptz,
  enviado_email   boolean not null default false,
  enviado_push    boolean not null default false,
  creado_en       timestamptz not null default now()
);
create index on avisos (destinatario_id, leido_en);
```

**`vence` es NOT NULL a propósito.** En el ciclo julio/agosto, 10 de los 14 pendientes del
área no tenían fecha y todos se postergaron. Que el campo sea obligatorio en la base —y no
solo en el formulario— es la corrección directa de ese hallazgo.

---

## 4. Módulo Playbook — Fathom ya tiene todo

**El hallazgo que reduce este módulo a la mitad:** no hay que construir grabación,
transcripción ni extracción. La cuenta de Fathom de Design Modeling DG ya guarda las
reuniones de la empresa con resumen, temas, próximos pasos y **compromisos extraídos con
responsable sugerido y marca de tiempo**.

Lo que falta es el paso que hoy nadie da: **convertir esos compromisos en tareas con dueño y
fecha**.

### 4.1 La API de Fathom — dos detalles que ahorran horas

1. **`recording_id` ≠ `call_id`.** La API trabaja con `recording_id`; el número que aparece
   en la URL (`fathom.video/calls/766148644`) es el `call_id`. Hay que guardar ambos: el
   primero para consultar, el segundo para construir el enlace que ve el usuario.
2. **Los enlaces admiten `?timestamp=<segundos>`** y abren la grabación en ese punto exacto.
   Es lo que convierte una tarea en algo verificable: se hace clic y se escucha el momento en
   que se acordó.

### 4.2 Reuniones reales para sembrar el módulo

| Reunión | Fecha | call_id | Compromisos |
|---|---|---|---|
| Reunión de Cierre y Apertura DM | 07 ago 2026 | `775933090` | 8 |
| Onboarding Camila | 06 ago 2026 | `775983340` | 4 |
| Reunión con Camila — puesto y capacitaciones | 03 ago 2026 | `768734257` | 3 |
| Equipo Ventas Máster DM | 11 ago 2026 | `780861241` | — |

Asesorías del Máster (closer: Eber): Ronal Hinojosa `766148644` (29 jul, cerrado en
US$ 1.900) · Mauricio González `764489757` (28 jul) · Rodrigo Faicán `766224789` (30 jul) ·
y cuatro más sin analizar entre el 30 de julio y el 13 de agosto.

### 4.3 Por qué hay revisión humana y no es automático

Fathom asigna la mayoría de los compromisos a **la cuenta que grabó** («Design Modeling
DG»), no a la persona real, y los escribe en inglés. Volcarlos directo al tablero lo
llenaría de tareas sin dueño verdadero — exactamente el problema que este proyecto viene a
resolver.

El flujo correcto: **Fathom → bandeja de propuestas → una persona confirma responsable y
fecha → tarea en el Kanban.** El módulo sugiere el responsable a partir de quién estuvo en
la llamada; confirmarlo son dos clics.

### 4.4 El playbook de ventas

Cada asesoría pasa por la misma rúbrica: **diagnóstico · encaje con el producto · defensa de
precio · manejo de objeciones · próximo paso**. Con tres llamadas ya aparecen dos patrones:

- **Defensa de precio.** Ronal Hinojosa cerró en US$ 1.900 con un ancla de US$ 2.400,
  cuando el ticket de referencia del método de cierre de mes es **US$ 2.699,99**. El
  descuento se concedió antes de que apareciera una objeción de precio.
- **Quién da el próximo paso.** Con Rodrigo Faicán el siguiente movimiento quedó del lado
  del cliente. Es el patrón que más ventas pierde; la regla debería ser que el closer
  siempre agenda el siguiente contacto.

Para Camila, la vista de setteo mide la calidad del agendamiento. Línea base del ciclo
julio/agosto: **53 citas agendadas, 16 asistieron (30,2%), 37 no llegaron**, contra una meta
del 80%. Ese número mide la **ausencia del puesto** —Camila entró el 05/08, el último día del
ciclo—, así que es la línea base contra la cual medirla desde agosto, no su desempeño.

### 4.5 Datos

```sql
create table reuniones (
  id                  bigserial primary key,
  fathom_recording_id text not null unique,
  fathom_call_id      text not null,
  titulo              text not null,
  fecha               date not null,
  url                 text not null,
  participantes       text[],
  sincronizado_en     timestamptz not null default now()
);

create table compromisos (
  id                  bigserial primary key,
  reunion_id          bigint not null references reuniones(id) on delete cascade,
  texto               text not null,
  responsable_sugerido text,
  area_sugerida       area_equipo,
  timestamp_seg       int,
  tarea_id            bigint references tareas(id),   -- null hasta que alguien lo convierta
  descartado          boolean not null default false,
  unique (reunion_id, texto)
);

create table llamadas (
  id         bigserial primary key,
  reunion_id bigint not null references reuniones(id) on delete cascade,
  cliente    text not null,
  vendedor_id uuid references profiles(id),
  rol_venta  text check (rol_venta in ('closer','setter')),
  resultado  text check (resultado in ('cerrado','en_proceso','en_riesgo','perdido','sin_analizar'))
);

create table evaluaciones (
  id          bigserial primary key,
  llamada_id  bigint not null references llamadas(id) on delete cascade,
  criterio    text not null,
  valoracion  text not null check (valoracion in ('bien','atencion','corregir','sin_dato')),
  evidencia   text,
  evaluado_en timestamptz not null default now(),
  unique (llamada_id, criterio)
);
```

Sincronización diaria contra la API de Fathom. El conector ya está activo en la cuenta de
Dayana; para el servidor hace falta una API key propia.

---

## 5. Módulo KPIs Equipo

Cinco vistas: **semáforo del mes · checklist del equipo · KPIs por persona · pendientes ·
cierre**.

### 5.1 El catálogo de indicadores, con metas y línea base

Esto es lo que no se puede inventar: las metas son de Dayana y la línea base es el ciclo
05 jul – 05 ago 2026, ya cerrado. Cargarlo tal cual permite que el semáforo tenga sentido
desde el primer día.

| Clave | Nombre | Bloque | Unidad | Meta | Dirección | Línea base jul–ago |
|---|---|---|---|---|---|---|
| `facturacion_cobrada` | Facturación cobrada | comercial | `usd_centavos` | 1000000 | mayor mejor | 340687 (US$ 3.406,87) |
| `master_estudiantes` | Máster High Tickets | comercial | `conteo` | 12 | mayor mejor | 1 |
| `lowcost_facturado` | Cursos Lowcost | comercial | `usd_centavos` | 300000 | mayor mejor | 290687 |
| `asistencia_citas` | Asistencia a citas | comercial | `bp` | 8000 | mayor mejor | 3020 (30,2%) |
| `higiene_crm` | Ventas registradas en GHL | comercial | `bp` | 9000 | mayor mejor | 5310 |
| `registro_entregas` | Entregas registradas | administrativo | `bp` | 8500 | mayor mejor | 3260 |
| `cumplimiento_jornada` | Cumplimiento de jornada | administrativo | `bp` | 9500 | mayor mejor | 9840 |
| `cac_master` | CAC Máster | marketing | `usd_centavos` | 40000 | **menor** mejor | 39204 |
| `cac_cursos` | CAC Cursos | marketing | `usd_centavos` | 4500 | **menor** mejor | 4193 |
| `roas` | ROAS sobre cobrado | marketing | `bp` | 30000 | mayor mejor | 27600 (2,76x) |

**Unidades, todas enteras:** `usd_centavos` (dinero), `bp` = puntos base (porcentajes:
8000 = 80,0%), `conteo`, `minutos` (tiempo). Ningún `float` para plata ni para porcentajes.

**Regla del semáforo:** verde si cumple la meta; ámbar desde el 80% de la meta; rojo bajo
eso. Para los indicadores de *menor mejor* la razón se invierte (`meta / valor`). Cada
tarjeta muestra además la etiqueta en texto —Cumplido / En riesgo / Incumplido— porque el
color solo no basta.

Contexto para leer la línea base: **la asistencia a citas es el cuello de botella real.**
De 53 citas agendadas, 37 no llegaron. Con asistencia normal el Máster habría cerrado 8
estudiantes en vez de 1 — el problema no fue el cierre ni la pauta.

### 5.2 Tablas del módulo

```sql
create type direccion_meta as enum ('mayor_mejor','menor_mejor');
create type cadencia       as enum ('diario','semanal','mensual');
create type origen_valor   as enum ('manual','ghl','meta','clickup');
create type estado_venta   as enum ('por_validar','validada','descartada');

-- La ventana del mes: del día 5 al día 5. `termina` es exclusivo.
create table periodos (
  id bigserial primary key,
  inicia date not null, termina date not null,
  etiqueta text not null unique,          -- '2026-07'
  cerrado boolean not null default false,
  check (termina > inicia)
);

create table kpis (
  id bigserial primary key,
  clave text not null unique, nombre text not null,
  bloque text not null check (bloque in ('comercial','marketing','administrativo')),
  unidad text not null check (unidad in ('usd_centavos','bp','conteo','minutos')),
  meta_valor bigint, direccion direccion_meta not null default 'mayor_mejor',
  umbral_ambar_bp int not null default 8000,
  orden int not null default 0, activo boolean not null default true
);

create table kpi_valores (
  id bigserial primary key,
  kpi_id bigint not null references kpis(id) on delete cascade,
  periodo_id bigint not null references periodos(id) on delete cascade,
  valor bigint not null, origen origen_valor not null default 'manual', nota text,
  actualizado_por uuid references profiles(id),
  actualizado_en timestamptz not null default now(),
  unique (kpi_id, periodo_id)
);

-- El catálogo de lo marcable. Esta tabla es el producto del módulo.
create table items_control (
  id bigserial primary key,
  titulo text not null, area area_equipo not null, cadencia cadencia not null,
  responsable_id uuid references profiles(id) on delete set null,
  orden int not null default 0, activo boolean not null default true
);

-- Marcar = insertar. Desmarcar = borrar. Nada más.
create table marcas (
  id bigserial primary key,
  item_id bigint not null references items_control(id) on delete cascade,
  fecha_ancla date not null,
  marcado_por uuid not null references profiles(id),
  marcado_en timestamptz not null default now(),
  unique (item_id, fecha_ancla)
);

-- El historial lo escribe un trigger, nunca la app.
create table marcas_log (
  id bigserial primary key,
  item_id bigint not null, fecha_ancla date not null,
  accion text not null check (accion in ('marca','desmarca')),
  actor uuid not null, ocurrio_en timestamptz not null default now()
);

create table jornada (
  id bigserial primary key,
  persona_id uuid not null references profiles(id),
  periodo_id bigint not null references periodos(id) on delete cascade,
  nominales_min int not null, ausencia_min int not null default 0,
  recuperadas_min int not null default 0, cumplidas_min int not null, nota text,
  unique (persona_id, periodo_id)
);

create table entregas (
  id bigserial primary key,
  persona_id uuid not null references profiles(id),
  periodo_id bigint not null references periodos(id) on delete cascade,
  titulo text not null, area area_equipo not null,
  en_clickup boolean not null default false,   -- lo calcula el sync, nunca una persona
  creado_en timestamptz not null default now()
);

create table ventas (
  id bigserial primary key,
  periodo_id bigint not null references periodos(id) on delete cascade,
  cliente text not null,
  producto text not null check (producto in ('master','acero','lowcost','diplomado','otro')),
  monto_centavos bigint not null default 0,
  fuente text, pipeline text, ghl_id text unique,
  estado estado_venta not null default 'por_validar',
  motivo_higiene text,                          -- sin_monto | duplicado | sin_fuente | prueba | recurrente
  validado_por uuid references profiles(id), validado_en timestamptz,
  sincronizado_en timestamptz not null default now()
);
```

`pendientes` es la tabla `tareas` del §3.3 con `origen = 'manual'`: no hace falta duplicarla.

### 5.3 Datos de arranque que están en el blueprint

Tres catálogos largos viven en `tablero-kpis-design-blueprint.md` para no repetirlos acá:

| Qué | Dónde | Contenido |
|---|---|---|
| **25 ítems de control** | Anexo A | 7 diarios, 11 semanales y 7 mensuales, con área y responsable |
| Los mismos KPIs de §5.1 | Anexo B | Con el detalle de cada meta |
| **14 pendientes de arranque** | Anexo C | Con responsable y vencimiento ya repartidos en agosto |

Los 25 ítems y los 14 pendientes también están **completos y ordenados dentro de las
maquetas HTML**, en las constantes `ITEMS` y `PENDIENTES` del `<script>` — es la forma más
rápida de copiarlos a las semillas.

### El patrón central: cómo funciona el marcado

**No hay ningún proceso que resetee los checkboxes.** Un ítem diario está marcado si existe
una fila con `fecha_ancla = hoy en Guayaquil`; al cambiar el día la consulta ya no la
encuentra y la casilla aparece vacía sola, con el historial intacto.

- `diario` → la fecha de hoy
- `semanal` → el lunes ISO de esa semana
- `mensual` → el día 5 del periodo (la ventana del mes va del día 5 al día 5)

Marcar es insertar una fila; desmarcar es borrarla. Nada de banderas booleanas. Quién marcó y
quién desmarcó lo guarda un trigger en una tabla de historial. La función `ancla()` de la
maqueta es exactamente la lógica que va al servidor.

### Las dos sincronizaciones

- **GoHighLevel** (vía Windsor.ai, cuenta `nkKbOarn5IwHeMv48uY9`): trae las ventas del
  periodo aplicando las reglas de depuración del método de cierre de mes — deduplicar por
  cliente entre pipelines, excluir «Prueba», mandar a higiene los de $0 y los recurrentes.
  **Todo entra como `por_validar`: nada suma al total sin que Dayana lo valide.**
- **ClickUp**: lee las tareas cerradas y calcula la trazabilidad sola. `entregas.en_clickup`
  **nunca se tilda a mano** — pedirle a alguien que marque en dos sistemas es justo lo que
  produjo el 32,6%.

---

## 6. Orden de construcción

| # | Bloque | Por qué en ese orden |
|---|---|---|
| 1 | **Base de datos + identidad real por persona** | Sin saber quién es cada quien no hay asignación, permisos ni notificaciones. Todo lo demás depende de esto |
| 2 | Whitelist + permisos en la base | La seguridad se construye acá, nunca al final |
| 3 | Tareas con áreas, comentarios y `vence` obligatorio | Sobre el Kanban actual |
| 4 | **Proyectos + ideas** | Copiando el SQL de `mi-agenda-blueprint.md`, que ya lo resolvió |
| 5 | **Adjuntos + archivero** (bucket privado) | Es lo que hace que se trabaje *dentro* de la tarea |
| 6 | Bandeja + correo + resumen diario 08:00 | Lo que hace que el equipo vuelva |
| 7 | **Recordatorios** | Reusa la bandeja del bloque 6 |
| 8 | **Capas de tareas sobre el calendario existente** | No un calendario nuevo: capas sobre el de publicaciones |
| 9 | Sync de Fathom → reuniones y compromisos | |
| 10 | Conversión compromiso → tarea | Cierra el ciclo reunión-tablero |
| 11 | KPIs: semáforo y checklist | El módulo de Ester |
| 12 | Sync GoHighLevel y ClickUp | Ventas por validar y trazabilidad |
| 13 | Playbook de ventas | Necesita las llamadas ya sincronizadas del bloque 9 |
| 14 | Export del cierre | Alimenta los PDF de KPIs que ya existen |

Un bloque por rama, verificado (`lint` + `test` + `build` en verde) antes de pasar al
siguiente.

---

## 7. Variables de entorno

| Variable | Para qué | Pública |
|---|---|---|
| `FATHOM_API_KEY` | Reuniones, compromisos y llamadas | **No** |
| `WINDSOR_API_KEY` | Leer GoHighLevel | **No** |
| `GHL_LOCATION_ID` | Cuenta DMA (`nkKbOarn5IwHeMv48uY9`) | **No** |
| `CLICKUP_API_TOKEN` / `CLICKUP_TEAM_ID` | Tareas cerradas para trazabilidad | **No** |
| `CRON_SECRET` | Autenticar los crons de Vercel | **No** |
| `TZ_NEGOCIO` | `America/Guayaquil` | Sí |

---

## 8. Reglas no negociables

1. **La zona horaria del negocio es `America/Guayaquil`.** Prohibido `new Date()` suelto para
   decidir «hoy». El periodo del mes va del día 5 al día 5.
2. **`vence` es obligatorio** en tareas y pendientes. Lo impide la base, no el formulario.
3. **Los permisos viven en la base de datos**, no en la interfaz.
4. **Ninguna venta suma al total sin validación del admin.**
5. **`en_clickup` nunca se tilda a mano** — lo calcula el sync.
6. **Ningún compromiso de reunión se convierte en tarea sin confirmación humana.**
7. **Dinero en centavos, porcentajes en puntos base, horas en minutos.** Enteros siempre.
8. **Mobile-first:** las filas marcables miden 44px de alto. Ester marca desde el celular.
9. **Marcar es optimista y sin spinner**: cambia al instante, se revierte si el servidor falla.
10. **Los correos del equipo no se versionan** en un repo público.

---

## 9. Una advertencia que conviene no saltarse

El módulo Playbook evalúa **llamadas de venta de personas identificadas**. Que Eber, Franklin
y Camila sepan de antemano que sus llamadas pasan por una rúbrica es la condición para que la
herramienta sirva para mejorar en vez de para vigilar.

La diferencia está en quién ve el resultado y para qué se usa. Por eso la matriz de permisos
del §2 dice que un `miembro` ve **sus propias** evaluaciones y no las de otro miembro. Esa
decisión es de Dayana, no de diseño — pero conviene tomarla antes de encender el módulo, no
después.
