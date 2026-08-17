# Tablero KPIs Design — DMA — Blueprint

> Generado por The Architect · 17 de agosto de 2026
> Arquetipo: Internal Tool / Dashboard
> Repo destino: `designmodelingdg-droid/tablero-kpis-design` (privado, por crear)

---

## 1. Visión

### El problema real

Ester Alvarez produce hoy, a mano, tres informes mensuales de KPIs (Comercial, Marketing,
Administrativo) para la dirección de Design Modeling Academy. El ciclo julio/agosto 2026
dejó un diagnóstico que los tres informes comparten y que es más importante que cualquier
cifra individual:

> **El trabajo se ejecuta pero no queda registrado.**
> · 32,6% de las entregas figuran cerradas en ClickUp (30 de 92)
> · 53,1% de la facturación real está marcada como oportunidad ganada en GHL
> · 41,8% de las conversaciones de Meta (944) quedaron sin responsable asignado

El equipo no tiene un problema de ejecución: tiene un problema de trazabilidad. Y el costo
es concreto — evaluar a Aylin con el dato de ClickUp (5 tareas) en lugar del real (31
entregas) habría producido una conclusión equivocada sobre su desempeño.

### Qué es este tablero

Una app web privada donde Ester **marca y desmarca** el control del equipo de Design, y
donde los números de ventas y pauta llegan solos desde GHL y Meta. Cuatro pantallas:
semáforo del mes, checklist del equipo, KPIs por persona y cierre del mes.

**La decisión de diseño que gobierna todo lo demás:** este tablero **no es un cuarto
sistema donde re-teclear tareas**. ClickUp ya falló haciendo eso. El tablero marca sobre
una **lista curada y recurrente** de ~25 ítems de control — los que deciden si el mes sale
bien — y lee los números que ya existen en otros sistemas. Si pide re-teclear, muere igual
que ClickUp.

### Objetivos

- Que Ester lleve el control diario/semanal del equipo con dos toques, desde el celular.
- Que Dayana vea el estado del mes en vivo sin pedir un informe.
- Que el informe administrativo mensual **se arme solo** con lo que ya se marcó, en vez de
  reconstruirse a mano cada cierre.
- Que la lista de higiene del CRM deje de ser un anexo del PDF y pase a ser una cola de
  trabajo con nombre y apellido.

### Cómo sabremos que funcionó

| Indicador | Hoy | Meta a 2 ciclos |
|---|---|---|
| Entregas registradas (ClickUp hoy → tablero) | 32,6% | ≥ 85% |
| Pendientes sin fecha de vencimiento | 64% (9 de 14) | 0% (el campo es obligatorio) |
| Tiempo de armado del informe administrativo | ~1 jornada | < 30 min (exporta y revisa) |
| Ventas sin fuente / sin monto al cierre | 45% sin marcar en GHL | ≤ 10% |

---

## 2. Stack

Stack por defecto de DMA, ya validado en Caja Familiar y Control Financiero DG. Costo de
operación: **$0/mes**.

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Server Components y server actions evitan una API aparte; PWA instalable; un solo deploy |
| Lenguaje | **TypeScript strict** | Sin `any`. Montos, horas y fechas exigen tipos duros |
| Estilos | **Tailwind v4** | Réplica rápida del brandkit DMA con variables CSS |
| Componentes | **shadcn/ui** | Checkbox, Dialog, Select y Table accesibles con control total del estilo |
| Base de datos | **Supabase (Postgres)** | Auth + DB + Realtime + Edge Functions en un servicio |
| Acceso a datos | **supabase-js + tipos generados** | Sin ORM. La seguridad vive en RLS, no en el código |
| Auth | **Supabase Auth** (Google OAuth) | El equipo ya usa Google Workspace |
| Tiempo real | **Supabase Realtime** | Ester marca, la pantalla de Dayana se actualiza sola |
| Validación | **Zod** | Toda entrada del cliente se valida en el servidor |
| Rate limiting | **Upstash Redis** | Serverless-friendly, límites persistentes entre invocaciones |
| Gráficos | **Recharts** | Barras horizontales y progreso; suficiente para este tablero |
| Fechas | **date-fns + date-fns-tz** | Zona horaria explícita. `America/Guayaquil` siempre |
| Tests | **Vitest** + arnés SQL de RLS | El arnés cubre lo que los tests unitarios no ven |
| Hosting | **Vercel** | HTTPS, previews y deploy automático, gratis |

### Por qué NO estas alternativas

- **HTML estático + localStorage:** es la opción barata, y es la equivocada. Ester marca en
  su laptop y Dayana necesita verlo desde la suya. El estado tiene que ser compartido.
- **Un tablero dentro de GHL:** Ester ya creó uno ("Creación de KPIs con dashboard dentro
  de GHL", julio 2026). No cubre horas, entregas ni pendientes del equipo, y no se puede
  exportar al informe.
- **Google Sheets:** funciona hasta que dos personas editan a la vez y nadie sabe cuál es
  la versión buena. Además no tiene roles ni auditoría de quién desmarcó qué.

---

## 3. Estructura de directorios

```
tablero-kpis-design/
  BLUEPRINT.md                     # este documento
  CLAUDE.md                        # sección 15
  src/
    app/
      login/page.tsx               # única ruta pública
      auth/callback/route.ts       # callback OAuth
      (app)/                       # TODO protegido por middleware
        layout.tsx                 # shell: sidebar navy + selector de periodo
        page.tsx                   # 1. Semáforo del mes
        checklist/page.tsx         # 2. Checklist del equipo  ← el corazón
        equipo/page.tsx            # 3. KPIs por persona
        pendientes/page.tsx        # 3b. Pendientes abiertos
        cierre/page.tsx            # 4. Cierre del mes + export
        ajustes/page.tsx           # metas, ítems de control, personas (solo admin)
      api/cron/sync-ventas/route.ts   # cron de Vercel: ventas GHL
      api/cron/sync-clickup/route.ts  # cron de Vercel: trazabilidad ClickUp
    actions/
      marcas.ts                    # marcar / desmarcar  ← la acción más usada
      pendientes.ts
      kpis.ts                      # cargar valores manuales
      jornada.ts
      entregas.ts
      ventas.ts                    # validar / descartar / mandar a higiene
    components/
      ui/                          # primitivas shadcn
      app/
        FilaMarcable.tsx           # checkbox + título + área + responsable
        TarjetaKpi.tsx             # número grande + meta + barra + semáforo
        BarraMeta.tsx
        SelectorPeriodo.tsx
        TablaHigiene.tsx
    lib/
      supabase/{client,server,middleware}.ts
      queries.ts                   # lecturas del servidor
      validations.ts               # esquemas Zod
      ratelimit.ts
      fechas.ts                    # hoyGuayaquil, anclaDe, periodoDe  ← crítico
      formato.ts                   # centavos → USD, minutos → HH:MM, bp → %
      semaforo.ts                  # valor + meta + dirección → verde/ámbar/rojo
    types/database.ts              # generado por supabase gen types
    middleware.ts                  # deny-by-default
  supabase/
    migrations/
      001_esquema.sql
      002_rls.sql
      003_whitelist.sql
      004_semillas.sql             # personas, KPIs con metas reales, 25 ítems, 14 pendientes
    functions/sync-ventas/         # Edge Function (Deno): GHL + Meta
    functions/sync-clickup/        # Edge Function (Deno): tareas cerradas de ClickUp
    tests/rls.sql                  # arnés de seguridad
  scripts/
    gen-icons.mjs                  # del skill app-dma
    test-db.sh                     # del skill app-dma
  docs/
    DEPLOY.md
    OPERACION.md                   # cómo lo usa Ester, en llano
```

---

## 4. Modelo de datos

### Entidades

**`profiles`** — quién puede entrar
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | = `auth.users.id` |
| correo | text unique | debe existir en `permitidos` |
| nombre | text | "Ester Alvarez" |
| rol | enum | `admin` · `coordinadora` · `miembro` |
| activo | boolean | apagar sin borrar historial |

**`permitidos`** — whitelist dura. Si el correo no está aquí, el registro se rechaza en la
base, no en la UI.

**`periodos`** — la ventana del mes. **Del día 5 al día 5**, como la mide Dayana.
| Campo | Tipo | Notas |
|---|---|---|
| inicia | date | día 5, inclusive |
| termina | date | día 5 del mes siguiente, **exclusive** |
| etiqueta | text unique | `2026-07` (mes de `inicia`) |
| cerrado | boolean | un periodo cerrado ya no acepta marcas |

**`kpis`** — catálogo de indicadores con su meta
| Campo | Tipo | Notas |
|---|---|---|
| clave | text unique | `facturacion_cobrada`, `asistencia_citas` |
| bloque | text | `comercial` · `marketing` · `administrativo` |
| unidad | text | `usd_centavos` · `bp` (puntos base) · `conteo` · `minutos` |
| meta_valor | bigint | en la misma unidad |
| direccion | enum | `mayor_mejor` · `menor_mejor` |
| umbral_ambar_bp | int | default 8000 = ámbar bajo el 80% de la meta |

**`kpi_valores`** — el valor de cada KPI en cada periodo. `unique (kpi_id, periodo_id)`.
Lleva `origen`: `manual` · `ghl` · `meta` · `clickup`. Lo que llega solo no se pisa a mano
sin dejar rastro.

**`items_control`** — el catálogo de lo marcable. **Esta tabla es el producto.**
| Campo | Tipo | Notas |
|---|---|---|
| titulo | text | "Revisar conversaciones no leídas" |
| area | text | `GHL` · `Marketing` · `Comercial` · `Soporte` · `Contenido` |
| cadencia | enum | `diario` · `semanal` · `mensual` |
| responsable_id | uuid null | null = cualquiera del equipo |
| orden | int | orden de pintado |

**`marcas`** — el check. `unique (item_id, fecha_ancla)`.
Marcar = insertar una fila. Desmarcar = borrarla. Nada más.

**`marcas_log`** — append-only por trigger. Guarda `marca` / `desmarca`, quién y cuándo.
Es lo que permite reconstruir el informe y saber quién desmarcó algo.

**`pendientes`** — las tareas abiertas de verdad (las 14 del informe y las que vengan)
| Campo | Tipo | Notas |
|---|---|---|
| titulo, area | text | |
| responsable_id | uuid NOT NULL | siempre tiene dueño |
| **vence** | **date NOT NULL** | **obligatorio — ver Regla 3** |
| prioridad | text | `alta` · `media` · `baja` |
| estado | enum | `abierto` · `en_curso` · `hecho` · `cancelado` |

**`jornada`** — horas por persona y periodo, en minutos enteros: nominales, ausencia,
recuperadas, cumplidas. `unique (persona_id, periodo_id)`.

**`entregas`** — cada entrega verificada, con `en_clickup boolean`. La diferencia entre el
total y las que tienen `en_clickup = true` **es** el KPI de trazabilidad.

**`ventas`** — el volcado depurado de GHL, con `estado`: `por_validar` · `validada` ·
`descartada`, y `motivo_higiene`: `sin_monto` · `duplicado` · `sin_fuente` · `prueba` ·
`recurrente`. **Solo las `validada` suman al total.**

### Relaciones

- `profiles 1—N marcas`, `1—N pendientes`, `1—N entregas`, `1—1 jornada` por periodo
- `periodos 1—N kpi_valores`, `1—N ventas`, `1—N jornada`, `1—N entregas`
- `items_control 1—N marcas` (una marca por ítem y por `fecha_ancla`)
- `marcas 1—N marcas_log` (lógico, no por FK: el log sobrevive al borrado)

### El patrón que evita un cron

Un ítem diario está marcado hoy **si existe una fila con `fecha_ancla = hoy en Guayaquil`**.
No hay job que "resetee" los checkboxes a medianoche: al cambiar el día, la consulta ya no
encuentra la fila y el checkbox aparece vacío solo. El historial queda intacto.

`anclaDe(cadencia, fecha)`:
- `diario` → la fecha misma
- `semanal` → el lunes ISO de esa semana
- `mensual` → el `inicia` del periodo (día 5)

### SQL completo

```sql
-- ============ 001_esquema.sql ============
create type rol_usuario     as enum ('admin','coordinadora','miembro');
create type cadencia        as enum ('diario','semanal','mensual');
create type direccion_meta  as enum ('mayor_mejor','menor_mejor');
create type estado_pend     as enum ('abierto','en_curso','hecho','cancelado');
create type origen_valor    as enum ('manual','ghl','meta','clickup');
create type estado_venta    as enum ('por_validar','validada','descartada');

create table permitidos (
  correo text primary key,
  nombre text not null,
  rol    rol_usuario not null default 'miembro'
);

create table profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  correo    text not null unique,
  nombre    text not null,
  rol       rol_usuario not null default 'miembro',
  activo    boolean not null default true,
  creado_en timestamptz not null default now()
);

create table periodos (
  id        bigserial primary key,
  inicia    date not null,
  termina   date not null,
  etiqueta  text not null unique,
  cerrado   boolean not null default false,
  check (termina > inicia)
);

create table kpis (
  id              bigserial primary key,
  clave           text not null unique,
  nombre          text not null,
  bloque          text not null check (bloque in ('comercial','marketing','administrativo')),
  unidad          text not null check (unidad in ('usd_centavos','bp','conteo','minutos')),
  meta_valor      bigint,
  direccion       direccion_meta not null default 'mayor_mejor',
  umbral_ambar_bp int not null default 8000,
  orden           int not null default 0,
  activo          boolean not null default true
);

create table kpi_valores (
  id               bigserial primary key,
  kpi_id           bigint not null references kpis(id) on delete cascade,
  periodo_id       bigint not null references periodos(id) on delete cascade,
  valor            bigint not null,
  origen           origen_valor not null default 'manual',
  nota             text,
  actualizado_por  uuid references profiles(id),
  actualizado_en   timestamptz not null default now(),
  unique (kpi_id, periodo_id)
);

create table items_control (
  id             bigserial primary key,
  titulo         text not null,
  area           text not null,
  cadencia       cadencia not null,
  responsable_id uuid references profiles(id) on delete set null,
  orden          int not null default 0,
  activo         boolean not null default true,
  creado_en      timestamptz not null default now()
);

create table marcas (
  id          bigserial primary key,
  item_id     bigint not null references items_control(id) on delete cascade,
  fecha_ancla date not null,
  marcado_por uuid not null references profiles(id),
  marcado_en  timestamptz not null default now(),
  unique (item_id, fecha_ancla)
);
create index on marcas (fecha_ancla desc);

create table marcas_log (
  id          bigserial primary key,
  item_id     bigint not null,
  fecha_ancla date not null,
  accion      text not null check (accion in ('marca','desmarca')),
  actor       uuid not null,
  ocurrio_en  timestamptz not null default now()
);

create or replace function log_marca() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    insert into marcas_log (item_id, fecha_ancla, accion, actor)
    values (new.item_id, new.fecha_ancla, 'marca', new.marcado_por);
    return new;
  else
    insert into marcas_log (item_id, fecha_ancla, accion, actor)
    values (old.item_id, old.fecha_ancla, 'desmarca', auth.uid());
    return old;
  end if;
end $$;

create trigger trg_log_marca
  after insert or delete on marcas
  for each row execute function log_marca();

create table pendientes (
  id                bigserial primary key,
  titulo            text not null,
  area              text not null,
  responsable_id    uuid not null references profiles(id),
  vence             date not null,                      -- OBLIGATORIO
  prioridad         text not null default 'media' check (prioridad in ('alta','media','baja')),
  estado            estado_pend not null default 'abierto',
  periodo_origen_id bigint references periodos(id),
  cerrado_en        timestamptz,
  creado_por        uuid not null references profiles(id),
  creado_en         timestamptz not null default now()
);
create index on pendientes (estado, vence);

create table jornada (
  id                    bigserial primary key,
  persona_id            uuid not null references profiles(id),
  periodo_id            bigint not null references periodos(id) on delete cascade,
  nominales_min         int not null,
  ausencia_min          int not null default 0,
  recuperadas_min       int not null default 0,
  cumplidas_min         int not null,
  nota                  text,
  unique (persona_id, periodo_id)
);

create table entregas (
  id         bigserial primary key,
  persona_id uuid not null references profiles(id),
  periodo_id bigint not null references periodos(id) on delete cascade,
  titulo     text not null,
  area       text not null,
  en_clickup boolean not null default false,
  creado_en  timestamptz not null default now()
);
create index on entregas (periodo_id, persona_id);

create table ventas (
  id               bigserial primary key,
  periodo_id       bigint not null references periodos(id) on delete cascade,
  cliente          text not null,
  producto         text not null check (producto in ('master','acero','lowcost','diplomado','otro')),
  monto_centavos   bigint not null default 0,
  fuente           text,
  pipeline         text,
  ghl_id           text unique,
  estado           estado_venta not null default 'por_validar',
  motivo_higiene   text,
  validado_por     uuid references profiles(id),
  validado_en      timestamptz,
  sincronizado_en  timestamptz not null default now()
);
create index on ventas (periodo_id, estado);

-- Vista que alimenta el semáforo: valor real vs meta, ya con el color resuelto
create or replace view v_semaforo as
select
  k.clave, k.nombre, k.bloque, k.unidad, k.meta_valor, k.direccion, k.orden,
  p.id as periodo_id, p.etiqueta,
  v.valor, v.origen,
  case
    when v.valor is null or k.meta_valor is null or k.meta_valor = 0 then 'sin_dato'
    when k.direccion = 'mayor_mejor' then
      case when v.valor >= k.meta_valor then 'verde'
           when v.valor * 10000 / k.meta_valor >= k.umbral_ambar_bp then 'ambar'
           else 'rojo' end
    else
      case when v.valor <= k.meta_valor then 'verde'
           when k.meta_valor * 10000 / nullif(v.valor,0) >= k.umbral_ambar_bp then 'ambar'
           else 'rojo' end
  end as color
from kpis k
cross join periodos p
left join kpi_valores v on v.kpi_id = k.id and v.periodo_id = p.id
where k.activo;
```

```sql
-- ============ 003_whitelist.sql ============
-- Registro cerrado: si el correo no está en `permitidos`, la base rechaza el alta.
create or replace function crear_profile() returns trigger
language plpgsql security definer set search_path = public as $$
declare p record;
begin
  select * into p from permitidos where lower(correo) = lower(new.email);
  if not found then
    raise exception 'Correo no autorizado para el Tablero KPIs Design';
  end if;
  insert into profiles (id, correo, nombre, rol)
  values (new.id, lower(new.email), p.nombre, p.rol);
  return new;
end $$;

create trigger trg_crear_profile
  after insert on auth.users
  for each row execute function crear_profile();
```

---

## 5. Acciones y rutas

Todo pasa por **server actions**. La única `route.ts` es la del cron, porque la llama
Vercel desde fuera.

| Acción | Archivo | Quién | Qué hace |
|---|---|---|---|
| `alternarMarca` | `actions/marcas.ts` | coordinadora, admin, o miembro sobre lo suyo | inserta o borra la fila de `marcas` |
| `crearPendiente` | `actions/pendientes.ts` | coordinadora, admin | exige `vence` |
| `cambiarEstadoPendiente` | `actions/pendientes.ts` | responsable, coordinadora, admin | |
| `guardarValorKpi` | `actions/kpis.ts` | coordinadora, admin | solo KPIs de origen `manual` |
| `guardarJornada` | `actions/jornada.ts` | coordinadora, admin | minutos enteros |
| `registrarEntrega` | `actions/entregas.ts` | cualquiera sobre lo suyo | con `en_clickup` |
| `validarVenta` / `descartarVenta` | `actions/ventas.ts` | **solo admin (Dayana)** | mueve `por_validar` → `validada`/`descartada` |
| `cerrarPeriodo` | `actions/periodos.ts` | **solo admin**, en dos pasos | sella el periodo |
| `GET /api/cron/sync-ventas` | route handler | cron de Vercel + `CRON_SECRET` | trae y depura las ventas de GHL |
| `GET /api/cron/sync-clickup` | route handler | cron de Vercel + `CRON_SECRET` | cruza las tareas cerradas de ClickUp contra `entregas` |

### Detalle de las críticas

**`alternarMarca(itemId)`** — la que se usa 50 veces al día.
1. Lee el ítem, calcula `fecha_ancla = anclaDe(item.cadencia, hoyGuayaquil())`.
2. Si el periodo que contiene esa fecha está `cerrado`, rechaza.
3. Si existe la fila → `delete`. Si no → `insert`.
4. El trigger escribe en `marcas_log`. Realtime avisa a las otras pantallas.
5. Rate limit: 120 por minuto por usuario.
6. **Optimista en el cliente:** el checkbox cambia al instante y se revierte si el servidor
   falla. Sin spinner — es un checkbox, no un formulario.

**`validarVenta(ventaId)`** — solo Dayana. Las reglas de depuración del método `cierre-mes`
(deduplicar por cliente entre pipelines, excluir "Prueba", los de PAGO RECURRENTE caso por
caso, los de $0 no suman) **no se automatizan a ciegas**: la Edge Function las aplica y
deja el resultado en `por_validar`; Dayana confirma. Lo que ella no valida, no está en el
total. Esto es lo que convierte el Anexo B del PDF en una cola de trabajo.

**`cerrarPeriodo(id)`** — en **dos pasos con confirmación**, y reversible por el admin el
mismo día. Es la lección del cierre de caja de Caja Familiar: un toque accidental no puede
dejar el mes sellado.

---

## 6. Frontend

### Rutas

| Ruta | Pantalla | Qué ve el usuario |
|---|---|---|
| `/login` | Login | Botón "Entrar con Google". Único público |
| `/` | **Semáforo del mes** | 6 tarjetas grandes con número, meta y barra de color |
| `/checklist` | **Checklist del equipo** | Los ítems marcables, agrupados. El corazón |
| `/equipo` | **KPIs por persona** | Matriz: jornada, entregas, entregas/hora, % en ClickUp |
| `/pendientes` | Pendientes abiertos | Tabla con vencimiento, prioridad, responsable |
| `/cierre` | Cierre del mes | Ventas por validar, higiene CRM, botón de exportar |
| `/ajustes` | Ajustes | Metas, ítems de control, personas. Solo admin |

### Las cuatro pantallas, en concreto

**1 · Semáforo del mes** — seis números y nada más. Los que deciden el mes:

| Tarjeta | Meta de referencia | Origen |
|---|---|---|
| Facturación cobrada | US$10.000 | `ghl` |
| Máster High Tickets | 12 estudiantes | `ghl` |
| Cursos Lowcost | US$3.000 | `ghl` |
| Asistencia a citas | 80% | `ghl` |
| Higiene CRM (ventas marcadas) | 90% | calculado |
| Registro de entregas | 85% | calculado |

Cada tarjeta: número grande en Overpass Bold, meta debajo en gris, barra de progreso con
el color del semáforo. **Asistencia a citas va arriba y en grande** — el informe comercial
demostró que ahí está el cuello de botella real (30,2% de asistencia; de 53 citas
agendadas, 37 no llegaron; con asistencia normal habrían sido 8 estudiantes en vez de 1).

**2 · Checklist del equipo** — tres pestañas: **Hoy · Esta semana · Este mes**.
Dentro de cada una, los ítems agrupados por área, cada fila con checkbox grande (44px de
alto mínimo, es una pantalla de celular), título, chip de área y avatar del responsable.
Arriba, un contador: `12 de 18 hoy`. Los ítems ya marcados bajan al final con opacidad 60%,
sin desaparecer — desmarcar tiene que ser tan fácil como marcar.

**3 · KPIs por persona** — la tabla del informe administrativo, en vivo:

| Persona | Jornada | Cumplimiento | Entregas | En ClickUp | Pendientes | Estado |
|---|---|---|---|---|---|---|

Con la fila `TOTAL ÁREA` al final, como en el PDF. Esta pantalla **es** la sección 6 del
informe administrativo, ya calculada.

**4 · Cierre del mes** — dos bloques:
- *Ventas por validar*: lista nominal con monto, producto y fuente. Dayana valida o descarta.
- *Higiene CRM*: los que llegaron sin monto, duplicados o sin fuente, con nombre y apellido,
  como tarea del equipo.
- Botón **"Exportar cierre"**: baja un JSON con todo el periodo, listo para alimentar los
  scripts de ReportLab que ya existen y el método `/cierre-mes`.

### Jerarquía de componentes (checklist)

```
ChecklistPage (server)
  SelectorPeriodo
  Tabs [Hoy | Semana | Mes]
    ContadorAvance          "12 de 18"
    GrupoArea (× n)
      FilaMarcable (client)   ← "use client", optimista
        Checkbox · Titulo · ChipArea · Avatar
  SuscriptorRealtime (client)  ← revalida cuando otro marca
```

### Estado

- **Server Components por defecto.** Todas las lecturas en el servidor con `queries.ts`.
- **Client Components solo donde hay interacción**: `FilaMarcable`, `SelectorPeriodo`,
  diálogos de alta.
- **Optimista** en el marcado, con `useOptimistic`. Revertir si la action falla.
- **Realtime** sobre `marcas` y `ventas`: si Ester marca, la pantalla de Dayana se refresca
  sin recargar.
- **Nada de estado global.** No hay Redux, Zustand ni Context de datos. Si aparece la
  tentación, es señal de que algo debía resolverse en el servidor.

---

## 7. Design system

Brandkit DMA, fijo. Los colores de semáforo son **los mismos de los PDFs** de Ester para
que tablero e informe se lean como la misma familia.

### Colores

| Rol | Hex | Uso |
|---|---|---|
| Azul principal | `#003e5c` | Encabezados, botón primario, barra activa |
| Azul navy | `#001e30` | Sidebar, fondo de portada del export |
| Naranja | `#ca7520` | Acento, subrayado de sección, números destacados |
| Fondo | `#f5f8fa` | Fondo de página |
| Superficie | `#ffffff` | Tarjetas y tablas |
| Texto | `#1f2b33` | Cuerpo |
| Texto suave | `#5a6b77` | Etiquetas, metadatos |
| Borde | `#dce3e8` | Separadores, bordes de tarjeta |
| Verde | `#2e9e5b` | Semáforo cumplido · check marcado |
| Ámbar | `#d9a32b` | Semáforo en riesgo |
| Rojo | `#c33b3b` | Semáforo incumplido · destructivo |

```css
@theme {
  --color-azul:        #003e5c;
  --color-navy:        #001e30;
  --color-naranja:     #ca7520;
  --color-fondo:       #f5f8fa;
  --color-superficie:  #ffffff;
  --color-texto:       #1f2b33;
  --color-texto-suave: #5a6b77;
  --color-borde:       #dce3e8;
  --color-verde:       #2e9e5b;
  --color-ambar:       #d9a32b;
  --color-rojo:        #c33b3b;
}
```

### Tipografía

| Rol | Fuente | Tamaño | Peso |
|---|---|---|---|
| Números grandes (KPI) | Overpass | 40 / 48px | 700 |
| Títulos | Overpass | 24 / 18 / 15px | 700 |
| Etiquetas y chips | Overpass | 11px, `uppercase`, `tracking-wide` | 600 |
| Cuerpo y tablas | Nunito | 14px | 400 / 600 |

Ambas por `next/font/google`, con `display: swap`.

### Espaciado y forma

- Escala base 4px: 4 · 8 · 12 · 16 · 24 · 32 · 48
- Radio: 10px en tarjetas, 8px en botones y campos, `full` en chips y avatares
- Sombra: una sola, suave — `0 1px 3px rgb(0 62 92 / .08)`. Sin sombras dramáticas
- Ancho máximo de contenido: 1200px. Sidebar fija de 240px en ≥`lg`
- Breakpoints Tailwind por defecto. **Mobile-first**: Ester marca desde el celular

### Estilo

Ejecutivo y denso, como los informes: fondo claro, sidebar navy, un solo acento naranja,
números grandes, mucho blanco entre bloques. Sin degradados, sin ilustraciones, sin
animaciones más allá de transiciones de 150ms. El check debe sentirse instantáneo.

---

## 8. Autenticación y permisos

### Flujo de entrada

`/login` → Google OAuth (Supabase) → `/auth/callback` → trigger `crear_profile` valida
contra `permitidos` → si el correo no está, la base lanza excepción y el usuario ve
"Tu correo no está autorizado" → si está, entra a `/`.

### Registro

**Cerrado.** Whitelist dura en la base. Correos tomados del workspace de ClickUp de DMA
(fuente de verdad del equipo, consultada el 17/08/2026):

| Correo | Nombre | Rol | Función |
|---|---|---|---|
| `designmodelingdg@gmail.com` | Dayana Calderón Brunetti | `admin` | Dirección |
| `asistencia.generaldg@gmail.com` | Ester Álvarez | `coordinadora` | Asesora Cursos · coordinación operativa |
| `aylin.taur@gmail.com` | Aylin Tapia | `miembro` | Soporte Técnico |
| `cami16012001@gmail.com` | Camila Pinto | `miembro` | Setter (se incorporó el 05/08) |
| `martinezeber61@gmail.com` | Eber Martínez | `miembro` | Closer Máster |
| `gabrielpantoja.ucab@gmail.com` | Gabriel Pantoja Linares | `miembro` | Supervisión de Soporte |

> **Dos cosas a confirmar antes de aplicar `004_semillas.sql`:**
> 1. **Gabriel queda como `miembro`** por defecto. Aprueba permisos de jornada y dio las
>    capacitaciones de Soporte, así que podría corresponderle `coordinadora` — pero un rol
>    con más privilegios no se asume: lo decide Dayana.
> 2. **Franklin no tiene cuenta en ClickUp**, así que no hay correo suyo. Aparece en el
>    informe entre las capacitaciones del equipo de ventas. Si va a marcar en el tablero,
>    hay que sumarlo a mano a `permitidos`.
>
> El archivo `004_semillas.sql` con estos correos **no se versiona en el repo público**: se
> aplica directamente contra el Supabase del proyecto.

### Rutas protegidas

`middleware.ts` **deny-by-default**: todo bajo `(app)` exige sesión. Solo `/login`,
`/auth/callback` y los estáticos son públicos. `/ajustes` además exige rol `admin`.

### Roles

| Rol | Puede |
|---|---|
| `admin` (Dayana) | Todo. Definir metas y periodos, **validar ventas**, cerrar el periodo, gestionar personas e ítems |
| `coordinadora` (Ester) | Marcar y desmarcar cualquier ítem, crear y asignar pendientes, cargar jornada y entregas de todos, ver todo. **No** valida ventas ni cierra el periodo |
| `miembro` | Marcar y desmarcar **solo los ítems donde es responsable**, cambiar el estado de **sus** pendientes, registrar **sus** entregas. Lectura del resto |

> Que cada miembro marque lo suyo es lo que ataca el problema en el origen. Ester conserva
> el poder de marcar por cualquiera — si el equipo no adopta, ella sigue pudiendo llevar el
> control sola, que es exactamente lo que pidió.

### Sesiones

Cookies HTTP-only gestionadas por `@supabase/ssr`. Refresh automático en el middleware.
Sin tokens en `localStorage`.

### Datos sensibles

No hay datos de tarjeta ni documentos de identidad. Sí hay **datos de desempeño de personas
identificadas** — horas, ausencias, cumplimiento. Por eso:
- El repo es **privado**.
- Ningún nombre real ni correo va al código: todo entra por `004_semillas.sql`, que se
  aplica en el Supabase del usuario.
- RLS obliga a que un `miembro` no pueda leer la jornada de otro `miembro`.

### RLS — reglas centrales

```sql
alter table profiles, marcas, pendientes, jornada, entregas, ventas,
             kpi_valores, items_control, kpis, periodos enable row level security;

create or replace function mi_rol() returns rol_usuario
language sql stable security definer set search_path = public as
$$ select rol from profiles where id = auth.uid() and activo $$;

-- Catálogos: todos leen, solo coordinadora/admin escriben
create policy leer_items on items_control for select using (mi_rol() is not null);
create policy tocar_items on items_control for all
  using (mi_rol() in ('admin','coordinadora')) with check (mi_rol() in ('admin','coordinadora'));

-- Marcas: miembro solo sobre lo suyo; nunca sobre periodo cerrado
create policy leer_marcas on marcas for select using (mi_rol() is not null);
create policy crear_marca on marcas for insert with check (
  marcado_por = auth.uid()
  and not exists (select 1 from periodos p
                  where marcas.fecha_ancla >= p.inicia
                    and marcas.fecha_ancla <  p.termina and p.cerrado)
  and ( mi_rol() in ('admin','coordinadora')
        or exists (select 1 from items_control i
                   where i.id = marcas.item_id and i.responsable_id = auth.uid()) )
);
create policy borrar_marca on marcas for delete using (
  not exists (select 1 from periodos p
              where marcas.fecha_ancla >= p.inicia
                and marcas.fecha_ancla <  p.termina and p.cerrado)
  and ( mi_rol() in ('admin','coordinadora')
        or exists (select 1 from items_control i
                   where i.id = marcas.item_id and i.responsable_id = auth.uid()) )
);

-- Jornada: un miembro solo ve la suya
create policy leer_jornada on jornada for select using (
  mi_rol() in ('admin','coordinadora') or persona_id = auth.uid()
);

-- Ventas: escribe solo la Edge Function (service_role). Valida solo el admin.
create policy leer_ventas on ventas for select using (mi_rol() is not null);
create policy validar_ventas on ventas for update
  using (mi_rol() = 'admin') with check (mi_rol() = 'admin');

-- marcas_log: nadie escribe desde la app; solo el trigger
create policy leer_log on marcas_log for select using (mi_rol() in ('admin','coordinadora'));
```

---

## 9. Orden de construcción

Un bloque por rama, con verificación real (`test` + `lint` + `build` en verde) y PR antes
de pasar al siguiente. **La seguridad va en los bloques 2 y 3, nunca al final.**

**Bloque 1 · Scaffolding + design system**
`npx create-next-app@latest tablero-kpis-design --ts --tailwind --app --eslint --src-dir`.
Instalar shadcn/ui. Cargar Overpass y Nunito con `next/font`. Escribir el `@theme` de la
sección 7. Generar iconos PWA con `scripts/gen-icons.mjs`. Copiar `assets/ci.yml` del skill
`app-dma` a `.github/workflows/`.
*Entregable:* la app compila y una página de muestra pinta los 11 colores y las 2 fuentes.

**Bloque 2 · Base de datos + RLS + whitelist**
Aplicar `001_esquema.sql`, `002_rls.sql`, `003_whitelist.sql`. Correr `scripts/test-db.sh`
contra Postgres real con `supabase/tests/rls.sql`.
*Entregable:* el arnés en verde. Un `miembro` no puede borrar la marca de otro, y ninguna
marca entra en un periodo cerrado.

**Bloque 3 · Auth end-to-end**
Google OAuth en Supabase, `middleware.ts` deny-by-default, `/login`, `/auth/callback`.
*Entregable:* login real funcionando **y prueba de rechazo**: entrar con una cuenta que no
está en `permitidos` y confirmar que falla con mensaje claro.

**Bloque 4 · App shell**
Layout con sidebar navy, selector de periodo, las 7 rutas con placeholders. `lib/fechas.ts`
con `hoyGuayaquil`, `anclaDe`, `periodoDe` — **con tests unitarios, incluidos los bordes
del día 5 y del cambio de mes**.
*Entregable:* se navega toda la app; las fechas están probadas.

**Bloque 5 · Checklist (el corazón)**
`004_semillas.sql` con los ~25 ítems de control reales. `FilaMarcable`, `alternarMarca`,
las tres pestañas, el contador, Realtime.
*Entregable:* Ester marca y desmarca desde el celular; al día siguiente los diarios
aparecen limpios solos y el historial sigue ahí.

**Bloque 6 · Semáforo del mes**
`TarjetaKpi`, `BarraMeta`, `lib/semaforo.ts`, la vista `v_semaforo`. Carga manual de valores
para los KPIs que aún no llegan solos.
*Entregable:* la portada muestra los 6 números con su color contra la meta.

**Bloque 7 · KPIs por persona**
Tabla del equipo, formularios de jornada y entregas.
*Entregable:* la tabla del informe administrativo, en vivo, con el `TOTAL ÁREA`.

**Bloque 8 · Pendientes**
Alta con `vence` obligatorio, filtros por estado y responsable, aviso de vencidos.
*Entregable:* los 14 pendientes reales del informe cargados y ninguno sin fecha.

**Bloque 9 · Sync de ventas (GHL)**
Edge Function `sync-ventas`: trae oportunidades de GoHighLevel vía Windsor.ai, aplica las
reglas de depuración del método `/cierre-mes` (filtrar `won` por
`last_status_change_at` dentro de la ventana; deduplicar por cliente entre pipelines
quedándose con el de mayor valor; excluir "Prueba"; $0 y recurrentes a higiene) y escribe
todo como `por_validar`. Cron diario en Vercel.
*Entregable:* las ventas del periodo aparecen solas, ninguna suma al total todavía.

**Bloque 10 · Sync de ClickUp (trazabilidad automática)**
Como ClickUp se queda (Anexo D), la marca `entregas.en_clickup` **no se tilda a mano**.
Edge Function `sync-clickup` que lee las tareas cerradas del workspace por responsable y
periodo (`clickup_filter_tasks` sobre el workspace de DMA), las cruza contra `entregas` por
título y responsable, y actualiza `en_clickup`. Lo que no cruza queda como "solo en el
tablero" y alimenta el KPI `registro_entregas`. Mismo cron que el bloque 9.
*Entregable:* la brecha entre lo entregado y lo registrado en ClickUp se calcula sola, sin
que nadie la tilde.

**Bloque 11 · Validación + higiene CRM**
Pantalla de cierre: Dayana valida o descarta; la lista de higiene sale con nombre y apellido.
*Entregable:* el total del semáforo se mueve solo con lo que Dayana validó.

**Bloque 12 · Export del cierre**
Botón que baja el JSON del periodo con la estructura que consumen los scripts de ReportLab
existentes y el método `/cierre-mes`.
*Entregable:* el informe administrativo se arma desde el tablero, sin re-teclear.

**Bloque 13 · PWA + pulido**
`manifest.json`, service worker (`assets/sw.js` del skill), cabeceras de caché
(`assets/next.config.ts` — **no saltarse esto**, es la tarde perdida de Caja Familiar),
estados vacíos y de carga.
*Entregable:* instalable en el celular de Ester, con estados vacíos en llano.

**Bloque 14 · Deploy + checklist de seguridad**
Vercel, variables de entorno, `docs/DEPLOY.md` y `docs/OPERACION.md`.
*Entregable:* en producción, con la prueba de rechazo repetida contra el dominio real.

---

## 10. Entorno

### Prerrequisitos

- Node.js 20 LTS · npm 10
- Cuenta de Supabase (plan gratuito) y Supabase CLI
- Cuenta de Vercel
- Cuenta de Google Cloud para el cliente OAuth
- Acceso a Windsor.ai con el conector `gohighlevel` activo (para el bloque 9)
- Token de API de ClickUp del workspace de DMA (para el bloque 10)

### Variables

| Variable | Para qué | Dónde se saca | Pública |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | endpoint del proyecto | Supabase → Settings → API | sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | cliente del navegador | Supabase → Settings → API | sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function y semillas | Supabase → Settings → API | **NO — nunca al cliente** |
| `WINDSOR_API_KEY` | leer GHL | Windsor.ai → API | **NO** |
| `GHL_LOCATION_ID` | cuenta DMA (`nkKbOarn5IwHeMv48uY9`) | GHL | **NO** |
| `CLICKUP_API_TOKEN` | leer tareas cerradas | ClickUp → Settings → Apps | **NO** |
| `CLICKUP_TEAM_ID` | workspace de DMA | ClickUp → URL del workspace | **NO** |
| `CRON_SECRET` | autenticar el cron de Vercel | generar con `openssl rand -hex 32` | **NO** |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | rate limiting | Upstash | **NO** |
| `TZ_NEGOCIO` | `America/Guayaquil` | fijo | sí |

### Comandos iniciales

```bash
npx create-next-app@latest tablero-kpis-design --ts --tailwind --app --eslint --src-dir
cd tablero-kpis-design
npx shadcn@latest init
npx shadcn@latest add button checkbox card table dialog select tabs badge avatar sonner
npm i @supabase/supabase-js @supabase/ssr zod date-fns date-fns-tz recharts \
      @upstash/ratelimit @upstash/redis
npm i -D vitest @vitejs/plugin-react supabase
npx supabase init && npx supabase link --project-ref <ref>
npx supabase db push
npx supabase gen types typescript --linked > src/types/database.ts
npm run dev
```

---

## 11. Dependencias

### Core

| Paquete | Para qué |
|---|---|
| `next` 15 · `react` 19 | framework |
| `@supabase/supabase-js` · `@supabase/ssr` | datos, auth y realtime con cookies en SSR |
| `zod` | validación en el servidor de toda entrada |
| `date-fns` · `date-fns-tz` | `America/Guayaquil` explícito, sin `new Date()` suelto |
| `recharts` | barras de cumplimiento y progreso |
| `@upstash/ratelimit` · `@upstash/redis` | límites que sobreviven entre invocaciones |
| `tailwindcss` v4 · `clsx` · `tailwind-merge` | estilos |
| `sonner` | avisos de éxito y error |

### Dev

| Paquete | Para qué |
|---|---|
| `vitest` · `@vitejs/plugin-react` | tests unitarios (fechas, semáforo, formato) |
| `supabase` (CLI) | migraciones y generación de tipos |
| `@playwright/test` | E2E del flujo de marcado |
| `eslint-config-next` · `typescript` | calidad |

---

## 12. Despliegue

### Hosting

**Vercel**, plan Hobby. Conectar el repo privado; cada push a `main` va a producción y cada
PR genera un preview con su URL.

### CI/CD

`.github/workflows/ci.yml` (copiado del skill `app-dma`): `lint` + `test` + `build` en cada
PR. Sin los tres en verde, no se mergea.

### Cron

`vercel.json`:
```json
{ "crons": [
  { "path": "/api/cron/sync-ventas",  "schedule": "0 11 * * *" },
  { "path": "/api/cron/sync-clickup", "schedule": "0 11 * * *" }
] }
```
11:00 UTC = 06:00 en Guayaquil. El handler exige `CRON_SECRET`.

### Dominio

Subdominio interno, por ejemplo `kpis.designmodeling.com`, apuntando a Vercel. No se indexa:
`robots.txt` con `Disallow: /` y `X-Robots-Tag: noindex`.

### Entornos

- **Local:** Supabase local (`supabase start`) con datos de prueba.
- **Producción:** proyecto Supabase real + Vercel. No hay staging — la app es chica y los
  previews de Vercel cubren la revisión.

---

## 13. Pruebas

### Unidad (Vitest)

- `lib/fechas.ts` — **lo más importante que se prueba en este proyecto**:
  `hoyGuayaquil` a las 23:30 y a las 00:30; `anclaDe` para las tres cadencias;
  `periodoDe` en los bordes del día 4, 5 y 6; cambio de mes y fin de año.
- `lib/semaforo.ts` — verde/ámbar/rojo en `mayor_mejor` y `menor_mejor`, meta 0 y valor nulo.
- `lib/formato.ts` — centavos a USD, minutos a `HH:MM`, puntos base a porcentaje.

### Integración / seguridad (arnés SQL)

`supabase/tests/rls.sql` corrido por `scripts/test-db.sh` contra Postgres real:
1. Un `miembro` **no** puede marcar un ítem del que no es responsable.
2. Un `miembro` **no** puede leer la jornada de otro `miembro`.
3. Nadie puede insertar ni borrar marcas en un periodo `cerrado`.
4. Un correo fuera de `permitidos` **no** puede crear `profile`.
5. Solo `admin` puede pasar una venta a `validada`.
6. Borrar una marca **siempre** deja fila en `marcas_log`.

### E2E (Playwright)

- Login → `/checklist` → marcar tres ítems → recargar → siguen marcados.
- Desmarcar uno → recargar → sigue desmarcado, y el log tiene las dos acciones.
- Crear un pendiente sin fecha → el formulario lo impide.
- Entrar con cuenta no autorizada → mensaje de rechazo, sin sesión.

---

## 14. Skills durante la construcción

| Skill | En qué bloque | Para qué |
|---|---|---|
| `/app-dma` | Todos | Es la metodología de esta app: ciclo por bloques, assets probados (`gen-icons.mjs`, `test-db.sh`, `sw.js`, `next.config.ts`, `ci.yml`) y las 19 lecciones ya resueltas |
| `/dataviz` | Bloques 6 y 7 | Antes de escribir la primera línea de gráfico: tarjetas KPI, barras y semáforo consistentes |
| `/frontend-design` | Bloques 4, 5, 6 | Interfaz de nivel producción sobre el brandkit DMA |
| `/shadcn-ui` | Bloques 1 y 5 | Checkbox, Tabs y Dialog accesibles |
| `/cierre-mes` | Bloques 9, 11, 12 | Las reglas de depuración de GHL y el formato del cierre ya validados con Dayana |
| `/spec` → `/build` → `/review` | Después del bloque 14 | Para funciones sueltas sobre la app ya construida; más liviano que un bloque completo |
| `/playwright-cli` | Bloque 14 | E2E del flujo de marcado y capturas contra el diseño |

---

## 15. CLAUDE.md del proyecto

```markdown
# Tablero KPIs Design — DMA

Tablero interno donde el equipo de Design de Design Modeling Academy marca y desmarca sus
KPIs, tareas y pendientes, y lee las ventas y la pauta que llegan de GHL y Meta.

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run lint` — linter
- `npm run test` — tests unitarios (Vitest)
- `npx supabase db push` — aplicar migraciones
- `npx supabase gen types typescript --linked > src/types/database.ts` — regenerar tipos
- `./scripts/test-db.sh` — arnés de RLS contra Postgres real

## Stack

Next.js 15 (App Router) + TypeScript strict + Tailwind v4 + shadcn/ui + Supabase (Postgres,
Auth Google, RLS, Realtime, Edge Functions) + Vercel

## Arquitectura

### Directorios
- `src/app/(app)/` — todo protegido por middleware deny-by-default
- `src/actions/` — server actions: TODA mutación pasa por aquí
- `src/lib/queries.ts` — todas las lecturas del servidor
- `src/lib/fechas.ts` — zona horaria y ventana del periodo. Nada de fechas fuera de aquí
- `supabase/migrations/` — SQL numerado, la fuente de verdad del esquema

### Flujo de datos
Server Component → `queries.ts` → Supabase (RLS filtra) → render.
Mutación: Client Component → server action → Zod → rate limit → Supabase → `revalidatePath`.
Realtime sobre `marcas` y `ventas` refresca las pantallas abiertas.

### Patrones clave
- Un ítem diario está marcado si existe fila con `fecha_ancla = hoy en Guayaquil`.
  **No hay cron que resetee checkboxes** — al cambiar el día se limpian solos.
- `marcas` guarda el estado; `marcas_log` guarda la historia por trigger. Nunca escribir
  el log desde la app.
- Las ventas entran siempre como `por_validar`. Solo `admin` las valida. Lo no validado no
  suma al total.

## Reglas de organización

1. Un componente por archivo, máximo 300 líneas.
2. Alias `@/` para `src/`.
3. Sin barrel exports: importar del archivo fuente.
4. Server Components por defecto. `"use client"` solo donde hay interacción.
5. Ningún `select` de Supabase fuera de `queries.ts` o de una server action.

## Design system

### Colores
`--color-azul: #003e5c` · `--color-navy: #001e30` · `--color-naranja: #ca7520`
`--color-fondo: #f5f8fa` · `--color-superficie: #ffffff` · `--color-borde: #dce3e8`
`--color-texto: #1f2b33` · `--color-texto-suave: #5a6b77`
`--color-verde: #2e9e5b` · `--color-ambar: #d9a32b` · `--color-rojo: #c33b3b`

### Tipografía
- Títulos y números: Overpass 700 (KPI a 40–48px)
- Cuerpo y tablas: Nunito 400/600 a 14px
- Etiquetas: Overpass 600, 11px, uppercase

### Estilo
Radio 10px en tarjetas, 8px en botones. Sombra única `0 1px 3px rgb(0 62 92 / .08)`.
Escala 4px. Ancho máximo 1200px. Mobile-first: las filas marcables miden 44px de alto.

## Variables de entorno

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | endpoint del proyecto (pública) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | cliente del navegador (pública) |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function. Nunca llega al cliente |
| `WINDSOR_API_KEY` | leer GoHighLevel |
| `GHL_LOCATION_ID` | cuenta DMA en GHL |
| `CLICKUP_API_TOKEN` / `CLICKUP_TEAM_ID` | leer tareas cerradas de ClickUp |
| `CRON_SECRET` | autenticar el cron de Vercel |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | rate limiting |

## Reglas No Negociables

1. **La zona horaria del negocio es `America/Guayaquil`.** Prohibido `new Date()` suelto
   para decidir "hoy": siempre `hoyGuayaquil()` de `lib/fechas.ts`.
2. **El periodo va del día 5 al día 5**, `inicia` inclusive y `termina` exclusive. Así lo
   mide la dirección.
3. **`pendientes.vence` es obligatorio.** El 64% de los pendientes del ciclo anterior no
   tenía fecha y se postergaron. La base lo impide, no solo la UI.
4. **Dinero en centavos enteros y porcentajes en puntos base.** Ningún `float` para plata.
5. **Ninguna venta suma al total sin validación del admin.** La sincronización deja todo en
   `por_validar`.
6. **La seguridad vive en RLS**, no en el cliente. Toda tabla con RLS activo y política
   explícita. El arnés `test-db.sh` debe pasar antes de cada merge.
7. **Desmarcar es tan válido como marcar.** Nunca esconder ni bloquear un ítem ya marcado.
8. **TypeScript strict, sin `any`.**
```

---

## 16. Reglas No Negociables

1. **No convertir esto en un segundo ClickUp.** ClickUp se queda y convive con el tablero
   (Anexo D): las tareas puntuales viven allá, los ítems recurrentes y los números viven
   acá. El checklist marca sobre un catálogo curado. Si aparece la necesidad de re-teclear
   cada tarea del día, la respuesta es corregir el catálogo, no agregar un formulario de
   alta libre.
2. **`entregas.en_clickup` nunca se tilda a mano.** Lo calcula el sync del bloque 10. Pedirle
   a alguien que marque en dos sistemas es exactamente lo que produjo el 32,6%.
3. **La zona horaria es `America/Guayaquil`** y la ventana del periodo va del día 5 al día
   5. Ambas cosas viven en `lib/fechas.ts` y están cubiertas por tests.
4. **`vence` obligatorio en pendientes.** Es la corrección directa del hallazgo del informe.
5. **Nada suma al total sin validar.** Las ventas sincronizadas entran como `por_validar`;
   solo el `admin` las mueve. Las de $0, duplicadas o sin fuente van a higiene con nombre y
   apellido.
6. **Seguridad en RLS y whitelist en la base.** Registro cerrado; un correo ajeno se rechaza
   en Postgres, no en la UI. El arnés de RLS pasa antes de cada merge.
7. **Dinero en centavos, porcentajes en puntos base, horas en minutos.** Enteros siempre.
8. **El cierre de periodo es en dos pasos y reversible el mismo día** por el admin. Lección
   del cierre de caja de Caja Familiar.
9. **Mobile-first.** Ester marca desde el celular: filas de 44px, sin hover como única
   affordance, sin tablas que obliguen a desplazamiento horizontal.
10. **Marcar es optimista y sin spinner.** Si el servidor falla, se revierte y avisa.
11. **Repo privado.** Ningún correo ni nombre real en el código: van en `004_semillas.sql`,
    que se aplica en el Supabase del usuario.

---

## Anexo A · Catálogo inicial de ítems de control

Salen de las actividades reales del ciclo julio/agosto y de los tres cuellos de botella
detectados. Cargar en `004_semillas.sql`.

**Diarios (7)**
| Ítem | Área | Responsable |
|---|---|---|
| Revisar conversaciones no leídas en GHL | GHL | Ester |
| Asignar responsable a las conversaciones nuevas | GHL | Ester |
| Confirmar asistencia de las citas de mañana | Comercial | Setter |
| Registrar las ventas del día como ganadas en GHL | Comercial | Closer |
| Revisar errores del bot y reportarlos | GHL | Ester |
| Registrar las entregas del día | Soporte | cada uno |
| Mover leads en los seguimientos 1-4 | GHL | Ester |

**Semanales (11)**
| Ítem | Área |
|---|---|
| Cruzar ventas de la semana contra la planilla de inscritos | Comercial |
| Revisar oportunidades sin monto asignado | Comercial |
| Revisar oportunidades sin fuente | Comercial |
| Revisar el reporte semanal de Olympus (pauta) | Marketing |
| Publicar el contenido de la semana en IG | Contenido |
| Programar los videos de valor del feed | Contenido |
| Reunión de seguimiento con el equipo de ventas | Comercial |
| Revisar pendientes vencidos del equipo | Soporte |
| Actualizar artes y creativos de campaña | Marketing |
| Revisar accesos de clientes nuevos | Soporte |
| Depurar automatizaciones sin uso | GHL |

**Mensuales (7)**
| Ítem | Área |
|---|---|
| Cargar jornada del periodo de cada persona | Soporte |
| Cerrar el conteo de entregas del periodo | Soporte |
| Validar las ventas del periodo con Dayana | Comercial |
| Emitir la lista de higiene del CRM al equipo | Comercial |
| Consolidar el resultado de pauta del periodo | Marketing |
| Definir metas del periodo siguiente | Comercial |
| Exportar el cierre y generar los informes | Soporte |

## Anexo B · Semillas de KPIs con metas reales

| Clave | Nombre | Bloque | Unidad | Meta | Dirección |
|---|---|---|---|---|---|
| `facturacion_cobrada` | Facturación cobrada | comercial | usd_centavos | 1000000 ($10.000) | mayor_mejor |
| `master_estudiantes` | Máster High Tickets | comercial | conteo | 12 | mayor_mejor |
| `lowcost_facturado` | Cursos Lowcost | comercial | usd_centavos | 300000 ($3.000) | mayor_mejor |
| `asistencia_citas` | Asistencia a citas | comercial | bp | 8000 (80%) | mayor_mejor |
| `higiene_crm` | Ventas registradas en GHL | comercial | bp | 9000 (90%) | mayor_mejor |
| `registro_entregas` | Entregas registradas | administrativo | bp | 8500 (85%) | mayor_mejor |
| `cumplimiento_jornada` | Cumplimiento de jornada | administrativo | bp | 9500 (95%) | mayor_mejor |
| `cac_master` | CAC Máster | marketing | usd_centavos | 40000 ($400) | menor_mejor |
| `cac_cursos` | CAC Cursos | marketing | usd_centavos | 4500 ($45) | menor_mejor |
| `roas` | ROAS sobre cobrado | marketing | bp | 30000 (3,0x) | mayor_mejor |

Línea base del ciclo 05/07–05/08/2026, para comparar desde el primer día: facturación
US$3.406,87 · Máster 1 de 12 · Lowcost US$2.906,87 · asistencia 30,2% · higiene 53,1% ·
registro de entregas 32,6% · cumplimiento de jornada 98,4% · CAC Máster US$392,04 · CAC
Cursos US$41,93 · ROAS 2,76x.

## Anexo C · Los 14 pendientes de arranque

Cargar en `004_semillas.sql` con `estado = 'abierto'`. Fechas repartidas sobre los días
hábiles que quedan de agosto de 2026, respetando dependencias y equilibrando la carga entre
Aylin y Ester.

| Tarea | Responsable | Vence | Prioridad | Área |
|---|---|---|---|---|
| Revisar y aplicar política de privacidad en Vimeo | Aylin | **mar 18/08** ⚠ | alta | GHL |
| Actualizar landings de la página de recursos | Ester | **mar 18/08** ⚠ | alta | GHL |
| Publicar artes de marketing para ads + IG | Ester | **mié 19/08** ⚠ | alta | Contenido |
| Primer post de agosto + contenido de la semana 1 | Ester | **mié 19/08** ⚠ | alta | Contenido |
| Enviar a Patricio el código consolidado del bot (PR #4) | Ester | mar 18/08 | media | GHL |
| Correos post-pérdida (secuencia tras oportunidad perdida) | Ester | jue 20/08 | alta | GHL |
| Añadir los 4 puntos definidos en la interfaz de cursos | Aylin + Ester | vie 21/08 | media | GHL |
| Política de privacidad en Vimeo (con Gabriel) | Aylin | vie 21/08 | media | Soporte |
| Crear correos nuevos con IA para plantillas | Aylin | lun 24/08 | media | GHL |
| Notificación de nuevo comentario para docentes | Ester | mar 25/08 | media | GHL |
| Renombrar y ordenar videos base de cada curso | Aylin | mié 26/08 | media | GHL |
| Configurar campañas de correo en GHL (con Patricio) | Ester | jue 27/08 | media | Marketing |
| Limpiar correos viejos + mejorar plantillas con IA | Aylin | vie 28/08 | media | GHL |
| Limpiar automatizaciones sin uso + activar workflow | Aylin | lun 31/08 | media | GHL |

**⚠ Las cuatro marcadas ya están vencidas.** Tenían vencimiento 14/08 y hoy es 17/08, así
que entran al tablero en rojo desde el primer día. Reprogramadas al 18 y 19 de agosto: son
las de prioridad alta y conviene cerrarlas esta misma semana.

**Criterio del reparto:**
- **Cadena de correos con IA** (Aylin): crear plantillas nuevas 24/08 → limpiar las viejas
  28/08 → limpiar automatizaciones y activar el workflow 31/08. En ese orden, porque cada
  una depende de la anterior.
- **Cadena del bot** (Ester): mandar el código a Patricio el 18/08 desbloquea configurar las
  campañas de correo con él, que queda el 27/08.
- **Correos post-pérdida** al 20/08 pese a no tener dependencias: es la única entrega del
  bloque de automatizaciones que no se completó en el ciclo anterior y golpea directo la
  recuperación de oportunidades.
- **Carga pareja:** Aylin cierra 6 (18, 21, 24, 26, 28, 31) y Ester 7 (18×2, 19×2, 20, 25,
  27), con la compartida el 21. Ninguna semana lleva más de tres por persona.

> **Corrección al informe:** son **10** los pendientes sin fecha, no 9 como decía el
> Anexo B del PDF administrativo. La diferencia es la tarea compartida de Aylin + Ester,
> que quedó fuera de ese conteo.

## Anexo D · La frontera con ClickUp

**Decisión tomada (Dayana, 17/08/2026): ClickUp se queda.** El equipo lo sigue usando y el
tablero convive con él. Eso obliga a trazar la frontera con precisión, porque el riesgo real
no desaparece: si una persona tiene que registrar lo mismo en dos lugares, deja de hacerlo
en uno — y así el tablero heredaría el mismo 32,6% que hoy tiene ClickUp.

### Quién manda sobre qué

| | ClickUp | Tablero |
|---|---|---|
| **Tareas granulares del día a día** | ✅ fuente de verdad | ❌ no las duplica |
| **Ítems de control recurrentes** (diario/semanal/mensual) | ❌ | ✅ los ~25 del Anexo A |
| **Pendientes de cierre de periodo** | ❌ | ✅ con `vence` obligatorio |
| **KPIs, metas y semáforo** | ❌ | ✅ |
| **Jornada, horas y entregas** | ❌ | ✅ |
| **Ventas e higiene del CRM** | ❌ (eso es GHL) | ✅ validación y cola |

Regla de bolsillo: **si es una tarea puntual con nombre propio, va a ClickUp. Si es algo que
se repite cada día o cada semana, o es un número contra una meta, va al tablero.**

### La consecuencia técnica: no se marca `en_clickup` a mano

Ester **no** tiene que ir tildando qué entregas quedaron registradas en ClickUp — eso sería
justo el trabajo doble que mata la adopción. Como ClickUp se queda, el tablero **lee su API**
y calcula la trazabilidad solo (bloque 10). El KPI `registro_entregas` deja de ser una
casilla y pasa a ser una consulta.

Esto además convierte a ClickUp en un aliado del diagnóstico en vez de en su síntoma: el
tablero muestra en vivo la brecha entre lo que el equipo entregó y lo que ClickUp registró,
que es exactamente el número que el informe tardó un mes en descubrir.

### Lo único que hay que sostener

El tablero **sustituye el armado manual del informe administrativo**. Si al cierre del mes
alguien vuelve a reconstruir la información a mano, el tablero no está cumpliendo su función
y hay que revisar el catálogo del Anexo A, no agregarle pantallas.
