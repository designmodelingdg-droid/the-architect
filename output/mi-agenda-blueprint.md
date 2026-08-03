# Mi Agenda — Blueprint

> Generado el 2026-08-03 por The Architect
> Tipo: herramienta privada de un solo usuario (agenda personal + gestor de ideas)
> Repos implicados: `mi-agenda` (nuevo) · `dma-sales-assistant` (existente)

---

## 1. Visión

**Mi Agenda** es la agenda personal de Dayana Calderón (Design Modeling Academy). Hoy
mete todo en Google Calendar a mano, evento por evento, y las ideas que se le ocurren
—una campaña nueva, un curso, una mejora del bot— se pierden porque no viven en ningún
sistema. Tiene un asistente personal por WhatsApp (`dma-sales-assistant`) que ya sabe leer
y escribir su calendario, pero no tiene memoria: no puede guardar una idea ni seguir un
proyecto en el tiempo.

Mi Agenda le da esa memoria y le pone cara. Es un panel web instalable en el iPhone donde
ve su día completo, y una base de datos donde las ideas se capturan en segundos —por
WhatsApp o desde el panel— y se convierten en proyectos con pasos y fechas. Google
Calendar sigue siendo su calendario real; Mi Agenda no lo reemplaza, lo organiza.

### Objetivos

- Capturar una idea en menos de 10 segundos, desde el celular, sin abrir nada.
- Convertir una idea en un proyecto con pasos fechados en menos de un minuto.
- Ver el día completo —eventos, pasos que vencen, atrasos, ideas sin procesar— en una
  sola pantalla.
- Que el brief de las 8:00 que ya recibe por WhatsApp incluya sus proyectos.
- Cero eventos duplicados en Google Calendar.

### Cómo sabremos que funcionó

- Dayana deja de escribir ideas en notas de voz sueltas: la bandeja de ideas tiene
  entradas todas las semanas.
- Al menos un proyecto pasa de "idea" a "terminado" dentro de la app.
- El bot de ventas no sufre ni una caída atribuible al panel.
- **Costo de operación: $0/mes.** Vercel gratis, Supabase gratis (proyecto compartido ya
  existente), Render gratis (ya existente).

---

## 2. Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | Next.js 15.5.21 (App Router) | Server Components y server actions evitan escribir una API aparte; PWA instalable; un solo deploy. Versión **pineada exacta**, igual que Caja Familiar |
| Lenguaje | TypeScript strict | Sin `any`, sin `as` para silenciar errores |
| Estilos | Tailwind CSS v4 | Sin `tailwind.config`: todo vive en `globals.css` con `@theme inline` |
| Componentes | shadcn/ui (`new-york`, `cssVariables`) | Primitivas accesibles con control total del estilo. Se **vendorean a mano**: `npx shadcn init` falla en este stack |
| Base de datos | Supabase (Postgres), **esquema `agenda`** | El mismo proyecto donde vive Caja Familiar, aislado en su propio esquema |
| Acceso a datos | `@supabase/ssr` + tipos escritos a mano | Sin ORM: a esta escala añade complejidad y la seguridad vive en RLS |
| Auth | Supabase Auth (Google OAuth) | Integrado con la DB y con RLS |
| Validación | Zod v4 | Toda entrada del cliente se valida en el servidor |
| Rate limiting | `@upstash/ratelimit`, con caída a ventana en memoria | Funciona sin configurar nada en desarrollo |
| Fechas | `date-fns` + `date-fns-tz` | `America/Guayaquil` explícito, sin sorpresas |
| Tests | Vitest (unidad) + arnés SQL con Postgres efímero | El arnés cubre lo que los tests unitarios no ven: la RLS |
| Hosting panel | Vercel (proyecto **nuevo**) | HTTPS y deploy automático gratis |
| Hosting asistente | Render (ya existente) | No se toca; solo se le añaden endpoints y tools |

**Cómo conectan las piezas.** Hay tres sistemas y una regla que los ordena.

El **panel** (Vercel) lee y escribe *ideas, proyectos y pasos* directo en Supabase con la
sesión de la usuaria, filtrada por RLS. Para el *calendario* no habla con Google: llama al
**asistente** (Render) por HTTPS servidor a servidor con un token Bearer, porque ahí ya
vive un refresh token de Google que funciona y una lista curada de 6 calendarios. El
asistente, a su vez, escribe en el mismo Supabase con la `service_role` cuando Dayana le
captura una idea por WhatsApp, y lee de ahí para armar el brief de las 8:00.

La regla que lo ordena: **Google Calendar es dueño de los eventos, Google Tasks de las
tareas personales, ClickUp de las del equipo, y Supabase de las ideas, proyectos y pasos.**
Un paso puede *apuntar* a un evento o tarea de Google guardando su id, pero nunca copia su
contenido. Supabase jamás es un espejo del calendario.

Un detalle que no es opcional: **el navegador nunca toca Flask.** `server.py` no tiene una
sola línea de CORS y así debe quedarse. Todo el tráfico panel → asistente sale del servidor
de Next.js, nunca del cliente.

---

## 3. Estructura de directorios

### Repo nuevo: `mi-agenda`

```
mi-agenda/
├── BLUEPRINT.md                 # este documento
├── CLAUDE.md                    # §15
├── next.config.ts               # SOLO cabeceras anti-caché de la PWA
├── postcss.config.mjs           # @tailwindcss/postcss, plugin único
├── components.json              # shadcn: new-york, rsc, cssVariables, lucide
├── vitest.config.ts             # environment node, include src/**/*.test.ts
├── package.json
├── .github/workflows/ci.yml     # lint + test + build en cada PR
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js                    # service worker artesanal, network-first
│   ├── offline.html
│   └── icons/                   # generados por scripts/gen-icons.mjs
├── scripts/
│   ├── gen-icons.mjs            # PNG + favicon sin dependencias
│   └── test-db.sh               # Postgres 16 efímero + migraciones + RLS
├── supabase/
│   ├── migrations/
│   │   ├── 0001_agenda_esquema.sql
│   │   ├── 0002_agenda_profiles.sql
│   │   ├── 0003_agenda_tablas.sql
│   │   ├── 0004_agenda_rls.sql
│   │   └── 0005_agenda_grants.sql
│   └── tests/
│       ├── 00_stub_auth.sql     # simula Supabase: auth.users, auth.uid(), roles
│       └── 99_rls_tests.sql     # aserciones de seguridad + convivencia
├── docs/
│   └── DEPLOY.md                # pasos que ejecuta Dayana, no Claude
└── src/
    ├── middleware.ts            # deny-by-default por lista negra de estáticos
    ├── actions/                 # server actions: TODA mutación pasa por aquí
    │   ├── ideas.ts
    │   ├── proyectos.ts
    │   ├── pasos.ts
    │   └── auth.ts
    ├── app/
    │   ├── layout.tsx           # importa Inter Variable y globals.css
    │   ├── globals.css          # tokens + @theme inline
    │   ├── login/
    │   │   ├── page.tsx
    │   │   └── login-card.tsx
    │   ├── auth/callback/route.ts
    │   ├── (app)/               # TODO protegido por middleware
    │   │   ├── layout.tsx       # shell: header + tab bar, max-w-[480px]
    │   │   ├── page.tsx         # "Hoy" — la pantalla principal
    │   │   ├── semana/page.tsx
    │   │   ├── ideas/page.tsx
    │   │   ├── proyectos/page.tsx
    │   │   └── proyectos/[id]/page.tsx
    │   └── api/
    │       └── calendario/route.ts   # refrescos del cliente; revalida sesión
    ├── components/
    │   ├── ui/                  # primitivas shadcn vendoreadas
    │   └── app/                 # dominio: tab-bar, captura-idea, tarjeta-idea,
    │                            #   tarjeta-proyecto, lista-pasos, banner-datos-viejos
    ├── lib/
    │   ├── supabase/{client,server,middleware}.ts
    │   ├── flask.ts             # leerDeFlask(): timeout, reintento, espejo
    │   ├── queries.ts           # lecturas del servidor
    │   ├── validations.ts       # esquemas Zod
    │   ├── ratelimit.ts
    │   ├── dates.ts             # única fuente de verdad de "hoy" en Guayaquil
    │   └── utils.ts             # cn()
    └── types/database.ts        # raíz = `agenda`, escrito a mano
```

### Archivos que se tocan en `dma-sales-assistant` (repo existente)

```
dma-sales-assistant/
├── agenda_client.py     # NUEVO — REST a Supabase, sin SDK
├── google_client.py     # se le añaden obtener_tarea, obtener_evento,
│                        #   lista_id en crear/completar_tarea, timeout_s
├── asistente_agent.py   # 5 tools nuevas en TOOLS (:155) + ramas en
│                        #   ejecutar_tool (:597)
├── server.py            # rutas /api/agenda/* con auth Bearer + línea en
│                        #   /asistente-diag (:4904)
├── panorama.py          # bloque "proyectos"
├── recordatorios.py     # job de reconciliación 07:45
├── config.py            # SUPABASE_URL, SUPABASE_SERVICE_KEY, PANEL_API_TOKEN
└── .claude/skills/asistente/SKILL.md   # documentar la integración nueva
```

---

## 4. Modelo de datos

Todo vive en el esquema `agenda`. **Nada en `public`** — el proyecto Supabase es compartido
con Caja Familiar (esquema `caja`) y una colisión de nombres rompería ambas apps.

### Entidades

**`agenda.profiles`** — la usuaria. Una sola fila.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `uuid` PK | → `auth.users(id)` on delete cascade |
| `email` | `text` not null | Normalizado a minúsculas por CHECK |
| `nombre` | `text` not null | Default `'Dayana'` |
| `zona_horaria` | `text` not null | Default `'America/Guayaquil'` |
| `creado_en` | `timestamptz` not null | |

**`agenda.proyectos`** — un objetivo con pasos.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` not null | Default `auth.uid()` |
| `nombre` | `text` not null | 1-160 caracteres |
| `nombre_norm` | `text` generated stored | `lower(btrim(nombre))`, para el índice único |
| `resultado` | `text` not null | "cómo se ve terminado". Default `''` |
| `estado` | `agenda.estado_proyecto` | `activo` \| `pausado` \| `terminado` \| `cancelado` |
| `color` | `text` not null | `slate` \| `rose` \| `amber` \| `emerald` \| `sky` \| `violet` |
| `vence_el` | `date` | Opcional |
| `orden` | `integer` not null | Para reordenar el tablero |
| `creado_en` / `actualizado_en` | `timestamptz` | `actualizado_en` por trigger |
| `cerrado_en` | `timestamptz` | **CHECK: existe ⟺ estado es terminado o cancelado** |

**`agenda.pasos`** — una acción concreta dentro de un proyecto.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` not null | Default `auth.uid()` |
| `proyecto_id` | `uuid` not null | → `proyectos(id)` on delete cascade |
| `titulo` | `text` not null | 1-300 caracteres |
| `detalle` | `text` not null | Default `''` |
| `tipo` | `agenda.tipo_paso` | `tarea` → Google Tasks · `bloque` → evento de Calendar |
| `estado` | `agenda.estado_paso` | `pendiente` \| `en_curso` \| `hecho` \| `descartado` |
| `orden` | `integer` not null | |
| `vence_el` | `date` | Se sincroniza **desde** Google, no hacia Google |
| `duracion_min` | `integer` | 5-720. Solo para `tipo = 'bloque'` |
| `google_kind` | `text` | `task` \| `event` \| null |
| `google_id` | `text` | Id del objeto en Google |
| `google_lista_id` | `text` | Obligatorio si `kind = 'task'` — sin esto no se puede completar |
| `google_calendar_id` | `text` | Obligatorio si `kind = 'event'` |
| `google_link` | `text` | Enlace directo, para el botón "ver en Google" |
| `google_estado` | `text` | `ok` \| `ausente` — lo que vio la última reconciliación |
| `google_sync_en` | `timestamptz` | Cuándo se confirmó por última vez |
| `hecho_en` | `timestamptz` | **CHECK: existe ⟺ estado = 'hecho'** |

**`agenda.ideas`** — la bandeja de captura.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` not null | Default `auth.uid()` |
| `texto` | `text` not null | 1-2000 caracteres |
| `texto_norm` | `text` generated stored | Para el índice anti-duplicado |
| `estado` | `agenda.estado_idea` | `nueva` \| `en_proyecto` \| `archivada` \| `descartada` |
| `origen` | `text` not null | `panel` \| `whatsapp` \| `brief` \| `api` |
| `proyecto_id` | `uuid` | → `proyectos(id)` on delete **set null** |
| `creado_en` / `actualizado_en` | `timestamptz` | |

**`agenda.cache_externo`** — espejo de la última lectura buena del calendario.

| Campo | Tipo | Notas |
|-------|------|-------|
| `user_id` | `uuid` | PK compuesta |
| `clave` | `text` | PK compuesta. Ej: `dia:2026-08-03:1` |
| `payload` | `jsonb` not null | La respuesta completa del asistente |
| `generado_en` | `timestamptz` not null | Lo que se muestra en el banner |

### Relaciones

- `profiles` 1 → N `proyectos`, `pasos`, `ideas` (por `user_id`, aunque en la práctica hay
  una sola usuaria).
- `proyectos` 1 → N `pasos`. **Cascade**: borrar un proyecto borra sus pasos.
- `proyectos` 1 → N `ideas`. **Set null**: borrar un proyecto no borra la idea que lo
  originó; la idea vuelve a quedar suelta, con su estado.
- Ningún borrado en cascada toca Google. Los objetos de Google se cancelan explícitamente
  o se quedan huérfanos, nunca se borran por efecto lateral.

### SQL completo

#### `0001_agenda_esquema.sql`

```sql
-- Mi Agenda vive en un proyecto Supabase COMPARTIDO con Caja Familiar (esquema
-- `caja`). Todo va en el esquema dedicado `agenda`: cero colisiones, y borrar la
-- app entera es `drop schema agenda cascade`.
--
-- NO se instalan extensiones (citext, etc.): en un proyecto compartido eso es un
-- efecto lateral global. Normalizamos con lower()/btrim() y CHECKs.

create schema if not exists agenda;

create type agenda.estado_idea     as enum ('nueva','en_proyecto','archivada','descartada');
create type agenda.estado_proyecto as enum ('activo','pausado','terminado','cancelado');
create type agenda.tipo_paso       as enum ('tarea','bloque');
create type agenda.estado_paso     as enum ('pendiente','en_curso','hecho','descartado');

create or replace function agenda.touch()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.actualizado_en := now();
  return new;
end $$;
```

#### `0002_agenda_profiles.sql`

```sql
create table agenda.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text        not null,
  nombre        text        not null default 'Dayana',
  zona_horaria  text        not null default 'America/Guayaquil',
  creado_en     timestamptz not null default now(),
  constraint agenda_profiles_email_normalizado check (email = lower(btrim(email))),
  constraint agenda_profiles_email_formato     check (email like '%_@_%._%')
);

create unique index agenda_profiles_email_key on agenda.profiles (lower(email));

-- LA función de autoridad de toda la app. SECURITY DEFINER para que las policies
-- de las otras tablas la consulten sin recursión de RLS.
create or replace function agenda.es_duena()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from agenda.profiles p where p.id = auth.uid());
$$;

revoke all on function agenda.es_duena() from public;

-- ⚠️ NO se crea ningún trigger sobre auth.users. Caja Familiar ya tiene
-- `caja_enforce_whitelist_before_signup` (BEFORE INSERT, sin cláusula WHEN), que
-- cierra el registro de TODO el proyecto a dos correos. Postgres dispara todos los
-- triggers BEFORE INSERT y si uno lanza, aborta el INSERT: dos whitelists se
-- INTERSECTAN, no se suman. Añadir la nuestra dejaría a Caja Familiar sin poder
-- dar de alta a nadie.
--
-- Mi Agenda no necesita registrar a nadie: la usuaria YA existe en auth.users.
-- Solo sembramos su perfil. La autoridad pasa a agenda.es_duena() + RLS, que es
-- una barrera más fuerte: no depende de quién pueda o no registrarse.
insert into agenda.profiles (id, email)
select u.id, lower(btrim(u.email))
from auth.users u
where lower(btrim(u.email)) = 'nilabrunetti@gmail.com'
on conflict (id) do nothing;
```

#### `0003_agenda_tablas.sql`

```sql
-- ── PROYECTOS ────────────────────────────────────────────────────────────────
create table agenda.proyectos (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid()
                 references auth.users(id) on delete cascade,
  nombre         text not null,
  nombre_norm    text generated always as (lower(btrim(nombre))) stored,
  resultado      text not null default '',
  estado         agenda.estado_proyecto not null default 'activo',
  color          text not null default 'slate',
  vence_el       date,
  orden          integer not null default 0,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  cerrado_en     timestamptz,
  constraint agenda_proyectos_nombre_ok
    check (length(btrim(nombre)) between 1 and 160),
  constraint agenda_proyectos_color_ok
    check (color in ('slate','rose','amber','emerald','sky','violet')),
  -- coherencia estado ↔ cierre: sin esto quedan estados fantasma
  constraint agenda_proyectos_cierre_coherente
    check ((estado in ('terminado','cancelado')) = (cerrado_en is not null))
);

-- Índice TOTAL (no parcial) para que PostgREST pueda usarlo en on_conflict.
create unique index agenda_proyectos_nombre_unico
  on agenda.proyectos (user_id, nombre_norm);

create index agenda_proyectos_tablero
  on agenda.proyectos (user_id, estado, orden, creado_en desc);

create trigger agenda_proyectos_touch before update on agenda.proyectos
  for each row execute function agenda.touch();


-- ── PASOS ────────────────────────────────────────────────────────────────────
create table agenda.pasos (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid()
                 references auth.users(id) on delete cascade,
  proyecto_id    uuid not null references agenda.proyectos(id) on delete cascade,
  titulo         text not null,
  detalle        text not null default '',
  tipo           agenda.tipo_paso   not null default 'tarea',
  estado         agenda.estado_paso not null default 'pendiente',
  orden          integer not null default 0,
  vence_el       date,
  duracion_min   integer,

  -- Espejo de Google. Google es dueño del CONTENIDO; aquí solo el puntero.
  google_kind        text,
  google_id          text,
  google_lista_id    text,
  google_calendar_id text,
  google_link        text,
  google_estado      text,
  google_sync_en     timestamptz,

  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  hecho_en       timestamptz,

  constraint agenda_pasos_titulo_ok
    check (length(btrim(titulo)) between 1 and 300),
  constraint agenda_pasos_duracion_ok
    check (duracion_min is null or duracion_min between 5 and 720),
  constraint agenda_pasos_kind_ok
    check (google_kind is null or google_kind in ('task','event')),
  constraint agenda_pasos_google_estado_ok
    check (google_estado is null or google_estado in ('ok','ausente')),
  -- o hay vínculo completo o no hay vínculo: nada a medias
  constraint agenda_pasos_vinculo_completo
    check ((google_id is null) = (google_kind is null)),
  -- el tipo manda sobre qué clase de objeto de Google se acepta
  constraint agenda_pasos_kind_coherente check (
    google_kind is null
    or (tipo = 'tarea'  and google_kind = 'task'  and google_lista_id    is not null)
    or (tipo = 'bloque' and google_kind = 'event' and google_calendar_id is not null)
  ),
  constraint agenda_pasos_hecho_coherente
    check ((estado = 'hecho') = (hecho_en is not null))
);

-- ⚠️ ESTA es la garantía anti-duplicado. No vive en Python, vive aquí.
-- Doble clic, doble reintento, dos webhooks: una sola fila.
create unique index agenda_pasos_google_unico
  on agenda.pasos (google_kind, google_id)
  where google_id is not null;

create index agenda_pasos_por_proyecto on agenda.pasos (proyecto_id, orden, creado_en);
create index agenda_pasos_abiertos     on agenda.pasos (user_id, estado, vence_el)
  where estado in ('pendiente','en_curso');
create index agenda_pasos_reconciliar  on agenda.pasos (google_sync_en nulls first)
  where google_id is not null;

create trigger agenda_pasos_touch before update on agenda.pasos
  for each row execute function agenda.touch();


-- ── IDEAS ────────────────────────────────────────────────────────────────────
create table agenda.ideas (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid()
                 references auth.users(id) on delete cascade,
  texto          text not null,
  texto_norm     text generated always as (lower(btrim(texto))) stored,
  estado         agenda.estado_idea not null default 'nueva',
  origen         text not null default 'panel',
  proyecto_id    uuid references agenda.proyectos(id) on delete set null,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint agenda_ideas_texto_ok
    check (length(btrim(texto)) between 1 and 2000),
  constraint agenda_ideas_origen_ok
    check (origen in ('panel','whatsapp','brief','api')),
  constraint agenda_ideas_promocion_coherente
    check (proyecto_id is null or estado <> 'nueva')
);

-- Red contra la doble captura por voz. Parcial a propósito: volver a capturar algo
-- ya archivado es legítimo.
create unique index agenda_ideas_sin_duplicar
  on agenda.ideas (user_id, texto_norm) where estado = 'nueva';

create index agenda_ideas_bandeja
  on agenda.ideas (user_id, estado, creado_en desc);

create trigger agenda_ideas_touch before update on agenda.ideas
  for each row execute function agenda.touch();


-- ── ESPEJO DEL CALENDARIO ────────────────────────────────────────────────────
-- Para que el panel no quede en blanco cuando Render está dormido.
create table agenda.cache_externo (
  user_id     uuid not null references auth.users(id) on delete cascade,
  clave       text not null,
  payload     jsonb not null,
  generado_en timestamptz not null default now(),
  primary key (user_id, clave)
);
```

#### `0004_agenda_rls.sql`

```sql
alter table agenda.profiles      enable row level security;
alter table agenda.proyectos     enable row level security;
alter table agenda.pasos         enable row level security;
alter table agenda.ideas         enable row level security;
alter table agenda.cache_externo enable row level security;

-- force: cierra también el hueco del dueño de la tabla (postgres).
-- service_role tiene BYPASSRLS por atributo de rol, así que no le afecta.
alter table agenda.profiles      force row level security;
alter table agenda.proyectos     force row level security;
alter table agenda.pasos         force row level security;
alter table agenda.ideas         force row level security;
alter table agenda.cache_externo force row level security;

-- profiles: solo lectura y edición del propio. Sin INSERT ni DELETE — los perfiles
-- se siembran por migración, no por la app.
create policy agenda_profiles_select on agenda.profiles
  for select to authenticated using (id = auth.uid());
create policy agenda_profiles_update on agenda.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Las tablas de datos, mismo molde. La doble condición es deliberada:
--   user_id = auth.uid()  → nadie suplanta a nadie
--   agenda.es_duena()     → un usuario ajeno del proyecto compartido, aunque tenga
--                           sesión válida, no entra a esta app
do $$
declare t text;
begin
  foreach t in array array['proyectos','pasos','ideas','cache_externo'] loop
    execute format($f$
      create policy agenda_%1$s_select on agenda.%1$s for select to authenticated
        using (user_id = auth.uid() and agenda.es_duena());
      create policy agenda_%1$s_insert on agenda.%1$s for insert to authenticated
        with check (user_id = auth.uid() and agenda.es_duena());
      create policy agenda_%1$s_update on agenda.%1$s for update to authenticated
        using      (user_id = auth.uid() and agenda.es_duena())
        with check (user_id = auth.uid() and agenda.es_duena());
      create policy agenda_%1$s_delete on agenda.%1$s for delete to authenticated
        using (user_id = auth.uid() and agenda.es_duena());
    $f$, t);
  end loop;
end $$;
```

#### `0005_agenda_grants.sql`

```sql
grant usage on schema agenda to authenticated, service_role;

grant select, insert, update, delete on all tables    in schema agenda to authenticated;
grant all                            on all tables    in schema agenda to service_role;
grant usage, select                  on all sequences in schema agenda to authenticated, service_role;
grant execute on function agenda.es_duena() to authenticated, service_role;

alter default privileges in schema agenda
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema agenda
  grant all on tables to service_role;
alter default privileges in schema agenda
  grant usage, select on sequences to authenticated, service_role;

-- anon: nada, a propósito.
-- ⚠️ NUNCA un `revoke ... from anon` global: rompería Caja Familiar.
```

#### Paso que no es SQL y rompe todo si se olvida

El esquema `agenda` debe aparecer en **Settings → API → Exposed schemas** de Supabase. Si
no, PostgREST responde `404` con código `PGRST106` ("The schema must be one of the
following"), indistinguible a simple vista de "no hay datos".

Por la Management API, **`PATCH` reemplaza la cadena completa**. Hay que leer primero:

```bash
# 1. Leer el valor ACTUAL — imprescindible
curl -s "https://api.supabase.com/v1/projects/<REF>/postgrest" \
  -H "Authorization: Bearer $SUPABASE_TOKEN"

# 2. Mandar el valor viejo + ", agenda"  (NO solo "public, agenda")
curl -X PATCH "https://api.supabase.com/v1/projects/<REF>/postgrest" \
  -H "Authorization: Bearer $SUPABASE_TOKEN" -H "Content-Type: application/json" \
  -d '{"db_schema": "public, graphql_public, caja, agenda"}'

# 3. Verificar INMEDIATAMENTE que Caja Familiar sigue viva
curl -s "$SUPABASE_URL/rest/v1/expenses?select=id&limit=1" \
  -H "apikey: $ANON_KEY" -H "Accept-Profile: caja"
```

---

## 5. Acciones y rutas

### Panel — server actions y route handlers

| Tipo | Nombre | Qué hace | Sesión | Rate limit |
|------|--------|----------|--------|-----------|
| Server action | `capturarIdea` | Inserta en `agenda.ideas` con `origen='panel'` | Requerida | 60/min |
| Server action | `descartarIdea` | `estado='descartada'` | Requerida | 60/min |
| Server action | `archivarIdea` | `estado='archivada'` | Requerida | 60/min |
| Server action | `crearProyectoDesdeIdea` | Crea proyecto + marca la idea `en_proyecto` | Requerida | 20/min |
| Server action | `crearProyecto` | Proyecto suelto | Requerida | 20/min |
| Server action | `actualizarProyecto` | Nombre, resultado, color, fecha | Requerida | 30/min |
| Server action | `cerrarProyecto` | `estado` + `cerrado_en` en el mismo update | Requerida | 20/min |
| Server action | `crearPaso` | Inserta un paso. **Nunca toca Google** | Requerida | 60/min |
| Server action | `completarPaso` | `estado='hecho'` + `hecho_en`. Si hay vínculo, avisa a Google | Requerida | 60/min |
| Server action | `reordenarPasos` | Actualiza `orden` en lote | Requerida | 30/min |
| Server action | `agendarPaso` | Crea evento o tarea en Google **y** vincula | Requerida | 20/min |
| Route handler | `GET /api/calendario` | Refrescos del cliente. **Revalida sesión** antes de llamar a Flask | Requerida | 30/min |
| Route handler | `GET /auth/callback` | Callback OAuth de Supabase | Pública | — |

### Asistente — endpoints nuevos en `server.py`

| Método | Ruta | Envuelve | Notas |
|--------|------|----------|-------|
| GET | `/api/agenda/dia?fecha=&dias=` | `gcal.listar_agenda` | `dias` acotado a 1-14, `timeout_s=6` |
| GET | `/api/agenda/tareas?vencidas=0\|1` | `listar_tareas` / `tareas_vencidas` | |
| GET | `/api/agenda/huecos?duracion_min=&dias=` | `buscar_hueco` | |
| POST | `/api/agenda/eventos` | `crear_evento` | Devuelve `{id, calendar_id, link}` |
| POST | `/api/agenda/tareas` | `crear_tarea` | Devuelve `{id, lista_id}` |
| POST | `/api/agenda/tareas/<id>/completar` | `completar_tarea` | Recibe `lista_id` |
| GET | `/api/agenda/salud` | — | `{ok, google, supabase, hora_ec}` |

`/api/agenda/salud` existe aparte de `/health` a propósito: `/health` llama a GHL y es el
blanco del keepalive; el panel no debe depender de que GHL responda.

### Detalle de las críticas

**`capturarIdea(formData)`** — la acción más usada de la app.
- Recibe: `texto` (string).
- Valida: 1-2000 caracteres tras `btrim`.
- Antes de insertar, busca por `texto_norm` con `estado='nueva'`. Si ya está, **devuelve
  éxito** con la idea existente en vez de un error de conflicto: capturar dos veces lo
  mismo no es un fallo del usuario.
- Errores: `"Tu sesión expiró. Vuelve a entrar."` (sin sesión), `"Escribe algo primero."`
  (vacío), `"Vas muy rápido, espera un momento."` (429).

**`agendarPaso(pasoId, cuando)`** — la única acción irreversible hacia fuera.
- Llama a `POST /api/agenda/{eventos|tareas}` según `tipo` del paso.
- Con el id que devuelve Google, hace un **PATCH condicional**:
  `PATCH /pasos?id=eq.X&google_id=is.null`. Si vuelven 0 filas, ya estaba vinculado: se
  devuelve el vínculo existente como éxito, **nunca se pisa el puntero**.
- Si Google responde pero el PATCH devuelve 0 filas, se cancela el objeto recién creado en
  Google para no dejar huérfanos.
- Errores: `"El calendario no responde. Inténtalo en un momento."`, `"Este paso ya estaba
  agendado."`

**`completarPaso(pasoId)`**
- Marca `estado='hecho'` + `hecho_en=now()` en el mismo update (el CHECK lo exige).
- Si el paso tiene vínculo, intenta completar en Google. **Si Google da 404, se traga el
  error**, marca `google_estado='ausente'`, y el paso **igual queda hecho**: lo que ella
  pidió fue marcarlo hecho, no sincronizar.

**`GET /api/calendario`** — el que más fácil se convierte en agujero.
- **Debe llamar a `supabase.auth.getUser()` y comprobar `es_duena()` antes de tocar
  Flask.** El middleware protege páginas, no route handlers usados como proxy.
- Sin eso, es la agenda de Dayana expuesta a internet.

**Forma de respuesta.** Toda server action retorna
`{ ok: true, data? } | { ok: false, error: string }` con el error ya en español y listo
para mostrar. Todo endpoint del asistente retorna
`{ ok, datos, generado_en, fuente }` o `{ ok: false, error, detalle }` —
**nunca un 200 con lista vacía cuando algo falló.**

---

## 6. Frontend

### Rutas

| Ruta | Pantalla | Qué ve el usuario |
|------|----------|-------------------|
| `/login` | Entrada | Botón "Entrar con Google". Única pública junto a `/auth/*` |
| `/` | **Hoy** | Eventos de hoy, pasos que vencen, atrasados, contador de ideas sin procesar |
| `/semana` | Semana | Siete días con eventos y pasos, uno debajo de otro |
| `/ideas` | Bandeja | Caja de captura arriba; lista de ideas nuevas abajo |
| `/proyectos` | Tablero | Proyectos agrupados por estado |
| `/proyectos/[id]` | Detalle | Pasos con checkbox, fecha y chip de estado en Google |

### Componentes clave

```
(app)/layout.tsx
├── AppHeader              # título de sección + avatar
├── {children}             # max-w-[480px] px-4 pb-28 pt-4
├── TabBar                 # Hoy · Semana · Ideas · Proyectos + FAB de captura
└── PwaRegister            # registra sw.js, prompt de instalación

/ (Hoy)
├── <Suspense fallback={<SkeletonAgenda/>}>
│   └── BloqueCalendario   # Server Component: leerDeFlask("dia")
│       ├── BannerDatosViejos   # solo si estado==="caido"
│       └── TarjetaEvento[]
├── BloquePasosHoy         # Supabase directo, rápido: pinta sin esperar a Google
├── BloqueAtrasados
└── ChipIdeasSinProcesar   # enlace a /ideas

/ideas
├── CapturaIdea            # Client Component: textarea + useActionState
└── ListaIdeas
    └── TarjetaIdea[]      # → Proyecto · Archivar · Descartar

/proyectos/[id]
├── CabeceraProyecto       # nombre, resultado, estado, fecha
├── ListaPasos
│   └── FilaPaso[]         # checkbox · título · fecha · ChipGoogle
└── FormNuevoPaso
```

### Estado

**Se lee en el servidor** todo lo que se puede: proyectos, pasos e ideas por Server
Components con el cliente de servidor de Supabase, filtrado por RLS. Los filtros viajan en
`searchParams` (`?estado=activo`), no en estado de React — así la URL es compartible y el
botón de atrás funciona.

**Necesitan ser cliente:** la caja de captura (`useActionState` para el estado de envío),
los checkbox de pasos (respuesta optimista), el registro del service worker, y el refresco
del calendario (`useSWR` con `refreshInterval: 300000` contra `/api/calendario`).

**El calendario es el único dato que puede llegar viejo.** `leerDeFlask()` lo maneja así:

1. Intento con `AbortSignal.timeout(8000)` — cubre el 99% (servicio caliente).
2. Si aborta o da 5xx: un solo reintento con `AbortSignal.timeout(35000)` — es el arranque
   en frío de Render. Sin backoff exponencial: en un render de página no hay tiempo.
3. Si también falla: lee `agenda.cache_externo` y devuelve `estado: "caido"`. El panel
   pinta con el último dato bueno y un banner honesto: *"El calendario no responde ahora
   mismo. Esto es de hace 12 minutos."*
4. Toda lectura exitosa **escribe el espejo**.

Nunca una pantalla en blanco, nunca un cero que parece un dato real.

**Cacheo:** `fetch(url, { next: { revalidate: 60, tags: ["calendario"] } })` para lecturas;
`cache: "no-store"` para mutaciones; `revalidateTag("calendario")` después de cualquier
acción que toque Google.

---

## 7. Design system

Copiado literalmente de Caja Familiar para que las dos apps se sientan hermanas. Tailwind
v4 puro: **no hay `tailwind.config`**, todo vive en `src/app/globals.css` con `@theme
inline`. Solo modo claro.

### Colores

| Rol | Hex | Uso |
|-----|-----|-----|
| Primario | `#6c5ce7` | Botones principales, enlaces, anillo de foco, `theme_color` |
| Primario oscuro | `#5b4bd5` | `hover` del botón primario |
| Acción | `#059669` | Botón de confirmar/agendar |
| Fondo | `#f8fafc` | Fondo de la app |
| Superficie | `#ffffff` | Cards, popovers |
| Texto | `#0f172a` | Texto principal |
| Secundario / Muted | `#f1f5f9` fondo, `#64748b` texto | Chips, texto de apoyo |
| Borde / Input | `#e2e8f0` | Bordes y campos |
| Éxito | `#10b981` | Paso completado |
| Alerta | `#f59e0b` | Vence hoy |
| Error | `#ef4444` | Atrasado, destructivo |

**Colores de proyecto** (reemplazan a los `--fund-*` de Caja Familiar), cada uno con su
variante de fondo suave:

| Nombre | Color | Fondo |
|--------|-------|-------|
| `slate` | `#64748b` | `#f8fafc` |
| `rose` | `#ec4899` | `#fdf2f8` |
| `amber` | `#f59e0b` | `#fffbeb` |
| `emerald` | `#10b981` | `#ecfdf5` |
| `sky` | `#3b82f6` | `#eff6ff` |
| `violet` | `#8b5cf6` | `#f5f3ff` |

### Tipografía

| Rol | Fuente | Tamaño | Peso |
|-----|--------|--------|------|
| Título de sección | Inter Variable | 20px | 600 |
| Título de card | Inter Variable | 16px | 600 |
| Cuerpo | Inter Variable | 15px | 400 |
| Apoyo / meta | Inter Variable | 13px | 400, color muted |
| Números grandes | Inter Variable | 28px | 700, tabular |

Inter Variable se carga **self-hosted por paquete npm**, no con `next/font`:
`import "@fontsource-variable/inter";` en `layout.tsx`, antes de `globals.css`. Se conecta
por el nombre de familia en `--font-sans: "Inter Variable", ui-sans-serif, system-ui, …`.

### Espaciado y forma

- Escala base 4px: 4, 8, 12, 16, 24, 32, 48 (la default de Tailwind, sin override).
- `--radius: 0.75rem`. Cards `rounded-xl` (16px), botones e inputs `rounded-lg` (12px),
  chips y avatares `rounded-full`.
- Sombras sutiles: `shadow-sm` en cards y botones, `shadow-lg` solo en el FAB.
- **Ancho máximo 480px, centrado.** Móvil primero, tab bar inferior fija, `pb-28` para que
  el contenido no quede debajo de la barra.
- Alturas de botón: `default h-11`, `sm h-9`, `lg h-12`, `icon size-11` — cómodo para el
  pulgar.

---

## 8. Autenticación y permisos

### Flujo de entrada

1. Dayana abre la app (o el icono de la PWA en el iPhone).
2. El middleware ve que no hay sesión y redirige a `/login?next=/ruta-que-pedía`.
3. Pulsa "Entrar con Google" → `signInWithOAuth` de Supabase.
4. Google devuelve a `/auth/callback?code=...&next=...`.
5. El callback intercambia el código por sesión y redirige a `next`, **saneando el destino**:
   solo se acepta si empieza por `/` y no por `//` (cierra el open-redirect).
6. La sesión queda en cookies httpOnly. El middleware la refresca en cada request.
7. Cada consulta pasa por RLS: `user_id = auth.uid() and agenda.es_duena()`.

### Registro

**Cerrado. Y Mi Agenda no lo implementa: lo hereda.**

El proyecto Supabase ya tiene `caja_enforce_whitelist_before_signup`, un trigger
`BEFORE INSERT ON auth.users` sin cláusula `WHEN`, que autoriza exactamente dos correos:
`gabrielpantoja.ucab@gmail.com` y `nilabrunetti@gmail.com`. Además el login por email está
deshabilitado a nivel de proyecto (`external_email_enabled: false`): solo Google.

**Mi Agenda no crea ningún trigger nuevo.** La razón es concreta: Postgres dispara *todos*
los triggers `BEFORE INSERT` y si uno lanza excepción, aborta el INSERT entero. Dos
whitelists independientes no se suman, **se intersectan**. Añadir la nuestra dejaría a Caja
Familiar sin poder dar de alta a nadie, y nadie se enteraría hasta que fallara.

La usuaria de Mi Agenda es `nilabrunetti@gmail.com`, que **ya existe** en `auth.users`.
La migración `0002` solo siembra su fila en `agenda.profiles` con `on conflict do nothing`.

**La autoridad de Mi Agenda es `agenda.es_duena()` + RLS**, no el trigger. Un usuario que
existe en `auth.users` pero no tiene fila en `agenda.profiles` no lee ni escribe una sola
fila de agenda, aunque el registro se reabriera mañana. Para este caso es una barrera más
fuerte que el trigger, porque no depende de quién pueda registrarse.

### Rutas protegidas

Lista blanca de públicas: **`/login` y `/auth/*`. Nada más.**

El matcher del middleware es una **lista negra de estáticos**, no una lista blanca de
rutas privadas:

```
"/((?!_next/static|_next/image|favicon\\.ico|icons/|manifest\\.webmanifest|sw\\.js|.*\\.png$).*)"
```

Así, **una ruta nueva queda protegida automáticamente** sin tocar el middleware. Ese es el
corazón del deny-by-default. El match de públicas es exacto o por prefijo con barra, así
que `/logind` no cuela como pública.

El middleware es UX (redirecciones). **La autoridad final es la RLS en Postgres.** Y los
route handlers revalidan la sesión por su cuenta: el middleware no los cubre como proxy.

### Roles

| Rol | Puede |
|-----|-------|
| `anon` | **Nada.** Sin privilegios sobre el esquema `agenda` |
| `authenticated` sin perfil de agenda | **Nada** de agenda. Puede seguir usando Caja Familiar con normalidad |
| `authenticated` con perfil (Dayana) | Todo sobre sus propias filas |
| `service_role` | Todo, con BYPASSRLS. Solo lo usa el asistente en Render |

No hay roles dentro de la app: un solo usuario, sin jerarquía.

### Sesiones

Cookies httpOnly gestionadas por `@supabase/ssr` — **nunca `localStorage`**. El middleware
refresca en cada request y devuelve `supabaseResponse` (no un `NextResponse.next()` nuevo)
para no perder las cookies actualizadas. Regla de las docs de Supabase que hay que
respetar: **no ejecutar ninguna lógica entre `createServerClient` y `getUser()`** — provoca
cierres de sesión aleatorios. Cierre de sesión con `scope: "global"`.

### Datos sensibles

- **No se guarda:** nada de tarjetas, cuentas bancarias, documentos de identidad ni datos
  de terceros. Las ideas y proyectos son texto libre de la usuaria; si escribe algo
  sensible ahí, queda protegido por RLS como el resto.
- **Cifrado:** HTTPS en tránsito; en reposo, por Supabase.
- **Nunca se expone:**
  - `SUPABASE_SERVICE_KEY` → **solo** variable de entorno en Render. Jamás en Vercel, jamás
    en el bundle. El CI del panel incluye un grep que falla si aparece `SERVICE_ROLE` en el
    repo.
  - `PANEL_API_TOKEN` → en Render y en Vercel **sin prefijo `NEXT_PUBLIC_`** (server-side).
  - `GOOGLE_REFRESH_TOKEN` → solo Render, como ya está.
- **Logs:** sin datos personales. Los endpoints del asistente no registran el contenido de
  ideas ni títulos de eventos, solo conteos y códigos de error.
- **Nada de `?secret=` para el puente.** `config.py:493` define
  `SECRET = os.getenv("WEBHOOK_SECRET", "dma-webhook-2026")` — con default en el código, ya
  en el historial de git para siempre. Además el query string acaba en los access logs de
  Render y en el `Referer`. El puente usa `Authorization: Bearer` con `hmac.compare_digest`
  y **queda cerrado si la variable falta**, no abierto.

---

## 9. Orden de construcción

> La sección más importante. La seguridad va en los bloques 2-3, nunca al final.
> Cada bloque termina con: build/lint/tests en verde → commit → PR → resumen a Dayana →
> **esperar confirmación** antes de seguir.

---

### Bloque 0 — Diagnóstico del Supabase compartido · **BLOQUEANTE**

No se escribe la primera migración sin esto. Son tres consultas read-only que Dayana
ejecuta en el SQL Editor de Supabase, y un `curl`.

```sql
-- 0.1 ¿Qué triggers hay YA en auth.users? (el riesgo global)
select t.tgname,
       n.nspname || '.' || p.proname as funcion,
       pg_get_triggerdef(t.oid)      as definicion
from pg_trigger t
join pg_proc      p on p.oid = t.tgfoid
join pg_namespace n on n.oid = p.pronamespace
where t.tgrelid = 'auth.users'::regclass and not t.tgisinternal;

-- 0.2 Confirmar que nilabrunetti@gmail.com ya existe
select id, email, created_at from auth.users order by created_at;

-- 0.3 ¿Qué esquemas hay?
select nspname from pg_namespace
where nspname not like 'pg_%' and nspname <> 'information_schema';
```

```bash
# 0.4 Valor ACTUAL de db_schema — antes de tocarlo
curl -s "https://api.supabase.com/v1/projects/<REF>/postgrest" \
  -H "Authorization: Bearer $SUPABASE_TOKEN"
```

**Qué decide:** que existe el trigger de Caja (confirma no crear otro), que la usuaria ya
está (confirma la siembra por migración), y el valor exacto de `db_schema` que hay que
preservar en el paso de exponer el esquema.

---

### Bloque 1 — Scaffolding + design system

```bash
npx create-next-app@15.5.21 mi-agenda --typescript --tailwind --app --src-dir \
  --import-alias "@/*" --no-eslint
cd mi-agenda
npm i @supabase/ssr@^0.12.3 @supabase/supabase-js@^2.110.8 \
      @fontsource-variable/inter@^5.3.0 @radix-ui/react-slot@^1.3.0 \
      class-variance-authority@^0.7.1 clsx@^2.1.1 tailwind-merge@^3.6.0 \
      lucide-react@^1.25.0 zod@^4.4.3 date-fns@^4.4.0 date-fns-tz@^3.2.0 \
      @upstash/ratelimit@^2.0.8 @upstash/redis@^1.38.0
npm i -D vitest@^4.1.10 tw-animate-css@^1.4.0 eslint@^9 eslint-config-next@15.5.21 \
      @eslint/eslintrc@^3
npm run icons     # tras copiar scripts/gen-icons.mjs
```

**shadcn se vendorea a mano.** `npx shadcn init` falla en este stack. Se copia
`components.json` de Caja Familiar y los componentes se traen archivo por archivo desde
`src/components/ui/` de Caja Familiar (empezando por `button.tsx`), adaptando los tokens.

Queda listo: `globals.css` con todos los tokens de §7, Inter Variable cargada, iconos y
favicon generados, `next.config.ts` con las cabeceras anti-caché, CI corriendo en el primer
PR, y una pantalla en blanco con la identidad visual correcta.

---

### Bloque 2 — Base de datos + RLS · **seguridad**

Las cinco migraciones de §4, más el paso de exponer el esquema (con el `GET` previo).

**Verificación — `scripts/test-db.sh`.** Levanta un Postgres 16 efímero (`initdb` en un
`mktemp -d`, solo socket unix, `trap cleanup EXIT`), aplica `00_stub_auth.sql`, luego todas
las migraciones en orden, y finalmente `99_rls_tests.sql`. Aserciones obligatorias:

1. `anon` no puede leer `agenda.ideas` → `insufficient_privilege`.
2. **Convivencia:** `public.contenido_demo` (que simula la otra app) **conserva** su acceso
   `anon` después de instalar el esquema. Se copia tal cual de Caja Familiar.
3. **La aserción propia de esta app:** un usuario legítimo del proyecto que **no** tiene
   fila en `agenda.profiles` no lee ni escribe nada de agenda.

```sql
insert into auth.users (id, email)
  values ('00000000-0000-0000-0000-0000000000ff', 'intruso@caja.test');
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000ff';

do $$ begin
  if (select count(*) from agenda.ideas) <> 0 then
    raise exception 'FALLO: un usuario sin perfil de agenda ve ideas';
  end if;
end $$;

do $$ begin
  begin
    insert into agenda.ideas (user_id, texto)
      values ('00000000-0000-0000-0000-0000000000ff', 'no debería entrar');
    raise exception 'FALLO: un usuario sin perfil de agenda pudo insertar';
  exception when insufficient_privilege then null;   -- esperado
  end;
end $$;
reset role;
```

4. Con perfil: ve sus filas, no puede suplantar `user_id` (espera `42501`).
5. Los CHECK de coherencia rechazan estados fantasma: `estado='hecho'` sin `hecho_en`,
   `google_id` sin `google_kind`, proyecto `terminado` sin `cerrado_en`.
6. El índice único de Google rechaza el segundo vínculo al mismo `google_id`.

---

### Bloque 3 — Auth end-to-end · **seguridad**

`/login`, `/auth/callback/route.ts` con el saneado de `next`, los tres clientes de
`src/lib/supabase/` con `db: { schema: "agenda" }`, `src/middleware.ts` con el matcher de
lista negra, y `src/types/database.ts` con la raíz `agenda`.

```bash
npx supabase gen types typescript --linked --schema agenda
```

**Prueba de rechazo, obligatoria y manual:** intentar entrar con una cuenta de Google
distinta y confirmar que no pasa. Documentar el resultado en el PR.

---

### Bloque 4 — 📥 Bandeja de ideas · **primer valor real**

`/ideas` con la caja de captura y la lista. `capturarIdea`, `descartarIdea`,
`archivarIdea` en `src/actions/ideas.ts`, con el orden canónico: **auth → rate limit → Zod
→ DB → revalidate**. `user_id` siempre de `auth.uid()`, nunca del formulario.

Más el app shell mínimo: `(app)/layout.tsx` con header y tab bar.

**Por qué este bloque va antes que todo lo demás:** las ideas son el único dato que hoy no
existe en ningún sistema —Calendar, Tasks y ClickUp ya funcionan— y no depende de nada
frágil: cero Flask, cero Google, cero Render dormido. Además valida en producción el
esquema, la RLS y la sesión con la tabla más simple de las cuatro.

Al terminar este bloque Dayana ya tiene una app que usa todos los días.

---

### Bloque 5 — Captura por WhatsApp

En `dma-sales-assistant`. Sigue los seis pasos del skill `asistente`: cliente REST sin SDK
→ credenciales en `config.py` sin default → declarar en `TOOLS` → rama en `ejecutar_tool` →
línea en `/asistente-diag` → guardia de confirmación si es irreversible.

**`agenda_client.py`** — REST puro contra la Data API. Nada nuevo en `requirements.txt`.

El esquema **no va en la URL**, va en cabeceras: `Accept-Profile: agenda` para `GET`/`HEAD`,
`Content-Profile: agenda` para `POST`/`PATCH`/`DELETE`/`PUT` y `POST /rpc/*`. Ponerlas
siempre las dos es inofensivo y evita el bug de "las lecturas funcionan y las escrituras se
van a `public`".

```python
"""
DMA Chief of Staff — Cliente de la agenda personal (Supabase, esquema `agenda`)

Data API de Supabase (PostgREST) por REST directo, sin SDK. El esquema NO va en la
URL: va en Accept-Profile (lecturas) y Content-Profile (escrituras). Si el esquema
no está expuesto en Settings → API, PostgREST responde 404 con código PGRST106.

Usa la service_role key, que hace BYPASSRLS: la RLS del panel NO protege aquí. Por
eso _req() exige user_id en toda operación de datos y filtro en todo PATCH/DELETE.

Variables en Render: SUPABASE_URL, SUPABASE_SERVICE_KEY.
"""

def credenciales_ok() -> dict
    # {"ok", "url_puesta", "key_puesta", "esquema_expuesto", "perfil_sembrado", "error"}
    # Prueba REAL: GET agenda.profiles?select=id&limit=1. Distingue 401 (key mala)
    # de PGRST106 (esquema sin exponer) de 200-vacío (falta la migración 0002).
def _user_id() -> str          # cachea con lock; lanza si no hay perfil
def _req(metodo, recurso, *, params=None, cuerpo=None, prefer="",
         exigir_user_id=True) -> list | dict

def crear_idea(texto: str, origen: str = "whatsapp") -> dict
    # Lee primero por texto_norm+estado='nueva'. Si ya está, la DEVUELVE con
    # {"ya_estaba": True}. Conflicto = éxito, no error.
def listar_ideas(estado: str = "nueva", limite: int = 50) -> list[dict]
def archivar_idea(idea_id: str) -> dict
def descartar_idea(idea_id: str) -> dict
```

Tres medidas contra el BYPASSRLS de `service_role`, todas en `_req()`:

1. **Todo filtro lleva `user_id`.** Si la operación toca una tabla de datos y no trae
   `user_id`, lanza `RuntimeError` antes de salir a la red.
2. **El `user_id` se resuelve del servidor**, leyendo `agenda.profiles` por email una vez y
   cacheando con lock (mismo patrón que `_token_cache` de `google_client.py`). Si no hay
   perfil, todas las funciones fallan diciendo *"no hay perfil de agenda para X — falta
   correr la migración 0002"*, nunca con una lista vacía que parece un dato real.
3. **Nada de `DELETE` ni `PATCH` sin filtro `id=eq.*`.** PostgREST sin filtro borra la
   tabla entera.

**Tools nuevas** en `asistente_agent.py:155`, descritas con las frases literales de Dayana:
`capturar_idea` ("apunta que…", "se me ocurrió…") y `ver_ideas` ("¿qué ideas tengo
apuntadas?"). Ramas correspondientes en `ejecutar_tool` (`:597`) — verificar en los dos
sentidos: toda tool con rama, toda rama con tool.

**Verificación:** mandar una nota de voz al asistente y ver la idea aparecer en `/ideas`.

---

### Bloque 6 — Proyectos y pasos

`/proyectos`, `/proyectos/[id]`, y las actions de `proyectos.ts` y `pasos.ts`. Idea →
proyecto en un clic. Reordenar pasos. **`crearPaso` no toca Google** — vincular es un acto
aparte (bloque 9).

---

### Bloque 7 — Puente de lectura con el asistente

En `server.py`: `_auth_panel()` con Bearer y `compare_digest`, cerrado por defecto:

```python
PANEL_API_TOKEN = os.getenv("PANEL_API_TOKEN", "")   # sin default, 32+ bytes urlsafe

def _auth_panel() -> bool:
    if not PANEL_API_TOKEN:          # sin configurar = cerrado, no abierto
        return False
    cab = request.headers.get("Authorization", "")
    if not cab.startswith("Bearer "):
        return False
    return hmac.compare_digest(cab[7:], PANEL_API_TOKEN)
```

Rate limit en Flask: ventana en memoria, 60 req/min por token (fiable porque `workers=1`),
429 con `Retry-After`.

**El arreglo que evita tumbar el bot de ventas.** `google_client._req` usa `timeout=25` por
llamada y `listar_agenda` recorre los 6 calendarios **en serie**: peor caso 150 s contra el
`--timeout 120` de gunicorn. Como `workers=1`, gunicorn mata el proceso entero y se pierde
el estado anti-duplicado en memoria **y el scheduler de las 8:00**. Un panel refrescando el
calendario puede tumbar el bot de ventas.

Tres mitigaciones, las tres:
1. Añadir `timeout_s` a `listar_agenda`; `/api/agenda/dia` pasa `timeout_s=6` (6 × 6 = 36 s
   tope).
2. Presupuesto total en el endpoint: acumular tiempo y cortar el bucle devolviendo lo leído
   + `"parcial": true` con qué calendarios faltaron. **Degradar, no fallar.**
3. Los endpoints del panel **no** llaman a GHL, Stripe ni Meta.

En el panel: `src/lib/flask.ts` con `leerDeFlask()` (§6), la tabla `cache_externo` como
espejo, y `BannerDatosViejos`.

**Y una nota para el `CLAUDE.md` del asistente:** el navegador nunca toca Flask. Cuando
alguien vea fallar un preflight, la tentación será añadir `flask-cors`. Es la respuesta
equivocada.

---

### Bloque 8 — Pantalla "Hoy"

La home compone: eventos del día (Flask), pasos que vencen y atrasados (Supabase), y el
contador de ideas sin procesar. `<Suspense>` alrededor del bloque de calendario para que
los pasos —que llegan en ~50 ms— se pinten sin esperar a Google.

---

### Bloque 9 — Agendar un paso

`POST /api/agenda/{eventos,tareas}` en el asistente, `agendarPaso` en el panel,
`vincular_paso_google` en `agenda_client.py`.

**Arreglos previos obligatorios en `google_client.py`.** Hay un bug latente:
`_tasklist_id()` cachea *la primera lista de la cuenta* en un global, y `completar_tarea()`
usa esa misma lista para el PATCH. Una tarea creada desde la app de Google en otra lista
**no se puede completar: 404 silencioso**.

```python
def crear_tarea(titulo, notas="", vence_iso="", lista_id="") -> dict
    # devolver también {"lista_id": lista}  ← hoy no lo devuelve, y sin eso no se
    #                                          puede guardar el puntero
def completar_tarea(task_id, lista_id="") -> dict
def obtener_tarea(task_id, lista_id="") -> dict | None    # None si 404/410
def obtener_evento(event_id, calendar_id="") -> dict | None
def listar_agenda(desde, hasta, calendarios=None, timeout_s=25)
```

Por eso `agenda.pasos.google_lista_id` es obligatorio cuando el vínculo es de tipo tarea.

**Test que no puede faltar:** doble clic en "agendar" deja **un solo** objeto en Google.

---

### Bloque 10 — Reconciliador

Job de APScheduler a las **07:45** (justo antes del brief) sobre el scheduler que ya existe,
más bajo demanda al abrir un proyecto. Es **Google → Supabase y solo de lectura**:

| Lo que responde Google | Qué se hace |
|---|---|
| Task `status = completed` | `estado='hecho'`, `hecho_en=now()`, `google_estado='ok'` |
| Task `status = needsAction` | copiar `due` → `vence_el`, `google_estado='ok'` |
| Evento normal | copiar `start` → `vence_el`, `google_estado='ok'` |
| **404 / 410 (borrada)** | **`google_id=null, google_kind=null, google_estado='ausente'`. El paso NO se toca** |
| **Evento `status='cancelled'`** | igual que el 404 (Calendar devuelve `cancelled`, no 404, con `singleEvents`) |
| 5xx / timeout | **no se toca nada**, se reintenta mañana. Un Google caído no puede desvincular medio tablero |

En el panel: chip gris *"sin agendar"* y botón *"volver a mandarlo a Tareas"*. Esa es la
**única** forma de recrear el objeto en Google, y es un clic de Dayana. El sistema nunca
decide por su cuenta que algo debe volver a existir.

**Por qué no sincronización bidireccional automática:** Google Tasks no tiene webhooks;
Calendar sí, pero los canales caducan a los ~7 días y su renovación programada es justo lo
que fallaría en silencio sobre una instancia de Render que se duerme. Sondeo diario cuesta
~1 request por paso vinculado y sobra para una agenda personal.

**Test:** borrar la tarea en Google deja el paso vivo con chip "sin agendar", sin fantasmas
ni duplicados.

---

### Bloque 11 — Proyectos en el brief y en el agente

Bloque `proyectos` en `panorama.BLOQUES`, y `brief_matutino()` pasa a
`panorama(['agenda','tareas','proyectos','comercial'])`. Cada bloque en su propio `try`,
como los demás, para que un servicio caído no tumbe el resto.

Tools restantes: `ver_proyectos` ("¿cómo van mis proyectos?"), `crear_paso` ("agrégale un
paso a…"), `avanzar_paso` ("ya hice…"). Solo `agendar_paso` lleva guardia `confirmado`,
verificada **en el dispatcher**, no en el prompt.

Truco que ahorra requests: los conteos con `Prefer: count=exact` y `Range: 0-0`, leyendo
`Content-Range: 0-0/17`. El brief baja de 5 lecturas a 1.

Esto es lo que hace que la app se note sin abrir el panel.

---

### Bloque 12 — Pulido + PWA

`manifest.webmanifest`, `sw.js` (network-first con fallback a `/offline.html`, nunca
cachear HTML con sesión), `PwaRegister` con `reg.update()` en `visibilitychange` por iOS y
recarga única en `controllerchange`. Estados vacíos con texto útil. Instalable desde Safari.

Las cabeceras de `next.config.ts` se copian **tal cual** de Caja Familiar: son lo que evita
que iOS deje la PWA pegada en una versión vieja tras cada deploy.

---

### Bloque 13 — Deploy + checklist de seguridad

Se escribe `docs/DEPLOY.md` para que **Dayana lo ejecute** — Claude no tiene acceso a sus
cuentas de Vercel, Supabase ni Render.

Checklist final:
- [ ] `SUPABASE_SERVICE_KEY` **no** está en Vercel (solo en Render).
- [ ] `PANEL_API_TOKEN` está en ambos, sin prefijo `NEXT_PUBLIC_` en Vercel.
- [ ] Prueba de rechazo con una cuenta de Google no autorizada.
- [ ] `GET /asistente-diag` reporta agenda en verde.
- [ ] Leer una tabla de `caja` sigue funcionando tras el `PATCH db_schema`.
- [ ] Caja Familiar abre y funciona con normalidad.
- [ ] Doble clic en "agendar" deja un solo objeto en Google.
- [ ] El grep de `SERVICE_ROLE` en el CI del panel está activo y pasa.

---

## 10. Entorno

### Prerrequisitos

- Node.js 20+
- Docker no hace falta; `scripts/test-db.sh` usa `initdb` local de Postgres 16
- Cuentas ya existentes: Vercel, Supabase (proyecto compartido), Render, Google Cloud
  (OAuth ya configurado)

### Variables

| Variable | Para qué | Dónde se obtiene | Dónde vive |
|----------|----------|------------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente Supabase | Supabase → Settings → API | Vercel (pública) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente Supabase | Supabase → Settings → API | Vercel (pública) |
| `FLASK_API_URL` | Base del asistente | `https://dma-sales-assistant.onrender.com` | Vercel (server) |
| `FLASK_API_TOKEN` | Bearer del puente | Se genera: `openssl rand -base64 32` | Vercel (server) |
| `UPSTASH_REDIS_REST_URL` | Rate limit | Upstash (opcional) | Vercel (server) |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limit | Upstash (opcional) | Vercel (server) |
| `SUPABASE_URL` | Cliente del asistente | Supabase → Settings → API | **Render** |
| `SUPABASE_SERVICE_KEY` | Escritura del asistente | Supabase → Settings → API | **Render, jamás Vercel** |
| `PANEL_API_TOKEN` | Bearer del puente | El mismo valor que `FLASK_API_TOKEN` | **Render** |
| `AGENDA_EMAIL_DUENA` | Resolver el perfil | `nilabrunetti@gmail.com` | Render (no es credencial) |

### Comandos iniciales

```bash
# Panel
npx create-next-app@15.5.21 mi-agenda --typescript --tailwind --app --src-dir \
  --import-alias "@/*" --no-eslint
cd mi-agenda && npm i <dependencias de §11>
npm run icons

# Base de datos
npx supabase link --project-ref <REF>
npx supabase db push
npx supabase gen types typescript --linked --schema agenda > src/types/database.ts

# Verificación de seguridad
bash scripts/test-db.sh
```

---

## 11. Dependencias

| Paquete | Para qué |
|---------|----------|
| `next@15.5.21` | Framework. **Pineado exacto** |
| `react@19.1.0` / `react-dom@19.1.0` | **Pineados exactos** |
| `@supabase/ssr@^0.12.3` | Clientes de navegador/servidor/middleware con cookies |
| `@supabase/supabase-js@^2.110.8` | Cliente base |
| `@fontsource-variable/inter@^5.3.0` | Inter Variable self-hosted, sin `next/font` |
| `@radix-ui/react-slot@^1.3.0` | Base de los componentes shadcn |
| `class-variance-authority@^0.7.1` | Variantes de componentes |
| `clsx@^2.1.1` + `tailwind-merge@^3.6.0` | `cn()` |
| `lucide-react@^1.25.0` | Iconos |
| `zod@^4.4.3` | Validación en el servidor. **v4**: `.refine` corre aunque el `.regex` falle — hay que auto-protegerlo |
| `date-fns@^4.4.0` + `date-fns-tz@^3.2.0` | Fechas en `America/Guayaquil` |
| `@upstash/ratelimit@^2.0.8` + `@upstash/redis@^1.38.0` | Rate limit, con caída a memoria |
| `tailwindcss@^4` + `@tailwindcss/postcss@^4` | Estilos |
| `tw-animate-css@^1.4.0` | Animaciones de shadcn |
| `vitest@^4.1.10` | Tests unitarios |
| `eslint@^9` + `eslint-config-next@15.5.21` + `@eslint/eslintrc@^3` | Lint |
| `typescript@^5` + `@types/{node,react,react-dom}` | Tipos |

**En el asistente: cero dependencias nuevas.** `agenda_client.py` usa `requests`, que ya
está.

---

## 12. Despliegue

**Panel — Vercel, proyecto nuevo.** No se reutiliza el de Caja Familiar: un proyecto de
Vercel es una app, y renombrarlo cambiaría la URL de Caja Familiar y apuntaría sus deploys
a otro código. Crear uno nuevo es gratis. Se conecta el repo `mi-agenda`, `main` → producción,
cada PR con su preview. **Sin `vercel.json`** — todo por dashboard, igual que Caja Familiar.

**Asistente — Render, ya desplegado.** Solo se añaden las tres variables nuevas y se
redespliega. Recordar: `--workers 1` es obligatorio (el anti-duplicado vive en memoria de
un solo proceso); para concurrencia se usan `--threads`, nunca más workers.

**Migraciones.** Se aplican a mano con `npx supabase db push` desde local, contra el
proyecto compartido. No van en CI: un `db push` automático contra una base que comparte con
otra app en producción es un riesgo que no vale la pena.

**Exponer el esquema** es un paso manual y delicado (§4): leer `db_schema` primero,
`PATCH` con el valor viejo + `, agenda`, verificar que `caja` sigue respondiendo.

**CI** (`.github/workflows/ci.yml`): un solo job — `npm ci`, `lint`, `test`, `build` con
placeholders de Supabase (funciona porque ninguna página llama a Supabase en build time).
Más el grep que falla si aparece `SERVICE_ROLE` en el repo. `test-db.sh` **no** corre en CI:
es manual, porque necesita `initdb`.

**Dominio:** el que dé Vercel por defecto. Es una app privada de un usuario.

---

## 13. Pruebas

### Unidad (Vitest, `src/**/*.test.ts`, colocados junto al código)

- `lib/dates.ts` — "hoy" en `America/Guayaquil`, límites de semana, formateo relativo
  ("vence en 2 días", "atrasado 3 días"). Nunca `new Date()` directo.
- `lib/validations.ts` — los esquemas Zod: textos vacíos, límites de longitud, el gotcha de
  Zod v4 con `.refine` tras un `.regex` fallido.
- Lógica de agrupación de la pantalla "Hoy": qué cuenta como atrasado, qué como de hoy.
- `leerDeFlask()` con `fetch` mockeado: éxito, timeout → reintento, doble fallo → espejo.

### Integración / seguridad — el arnés SQL

Ya detallado en el bloque 2. Las tres aserciones que esta app necesita y Caja Familiar no
tenía:

1. **Usuario sin perfil de agenda** (el reemplazo de la prueba de whitelist): existe en
   `auth.users`, tiene sesión válida, y aun así no lee ni escribe nada de agenda.
2. **Coherencia**: los CHECK rechazan `estado='hecho'` sin `hecho_en`, `google_id` sin
   `google_kind`, y proyecto `terminado` sin `cerrado_en`.
3. **Anti-duplicado**: el índice único parcial rechaza vincular dos pasos al mismo
   `(google_kind, google_id)`.

Más la aserción de convivencia heredada: `public.contenido_demo` conserva su acceso `anon`.

### E2E — flujos que no pueden romperse (manuales, documentados en el PR)

1. Login con la cuenta correcta → entra. Con otra cuenta → rechazado.
2. Capturar una idea por WhatsApp → aparece en `/ideas` en menos de 5 segundos.
3. Idea → proyecto → paso → agendar → aparece en Google Calendar.
4. Doble clic en "agendar" → un solo objeto en Google.
5. Borrar esa tarea desde la app de Google → tras el reconciliador, el paso sigue vivo con
   chip "sin agendar".
6. Con el asistente apagado, abrir "Hoy" → se ve el espejo con el banner, no una pantalla
   en blanco.
7. Abrir Caja Familiar → funciona igual que siempre.

---

## 14. Skills durante la construcción

| Skill | En qué bloque | Para qué |
|-------|---------------|----------|
| `/app-dma` | Todos | Es la metodología de este blueprint: un bloque a la vez, seguridad en 2-3, verificar ejecutando. Sus `references/lecciones.md` y `references/seguridad.md` se leen antes de los bloques 1 y 2 |
| `/frontend-design` | 1, 4, 6, 8 | Construir las pantallas con el sistema visual de §7 |
| `/shadcn-ui` | 1 | Vendorear los componentes a mano (el `init` falla en este stack) |
| `/playwright-cli` | 4, 6, 8, 12 | Captura de cada pantalla para comparar contra el diseño antes del PR |
| `/deep-research` | 9, 10 | Comportamiento exacto de la API de Google Tasks y Calendar ante borrados y cancelaciones |

**No usar** `/ui-ux-pro-max`: el sistema visual está decidido y copiado de Caja Familiar.
Rediseñarlo rompería la hermandad entre las dos apps.

---

## 15. CLAUDE.md del proyecto

```markdown
# Mi Agenda

Agenda personal de Dayana (DMA): captura ideas, las convierte en proyectos con pasos, y
muestra el día completo junto al calendario de Google. Un solo usuario.

## Comandos

- `npm run dev` — desarrollo (`next dev --turbopack`)
- `npm run build` — build de producción
- `npm run lint` — ESLint
- `npm run test` — Vitest
- `npm run icons` — regenerar iconos y favicon
- `bash scripts/test-db.sh` — arnés de RLS con Postgres efímero (manual, no en CI)
- `npx supabase db push` — aplicar migraciones (manual, base compartida)

## Stack

Next.js 15 App Router + TypeScript strict + Tailwind v4 + shadcn/ui + Supabase
(Postgres, esquema `agenda`) + Supabase Auth (Google) + Zod v4 + Vitest, en Vercel.

## Arquitectura

### Directorios

- `src/app/(app)/` — todo protegido por middleware
- `src/actions/` — server actions: **TODA mutación vive aquí** (auth → rate limit → Zod →
  DB → revalidate)
- `src/lib/supabase/{client,server,middleware}.ts` — los tres clientes, todos con
  `db: { schema: "agenda" }`
- `src/lib/flask.ts` — `leerDeFlask()`: única puerta al asistente
- `src/lib/dates.ts` — única fuente de verdad de "hoy" en `America/Guayaquil`
- `supabase/migrations/` — SQL numerado
- `supabase/tests/` — arnés de RLS

### Flujo de datos

**Ideas, proyectos y pasos:** Server Component → cliente de servidor de Supabase → RLS.
Mutaciones: form → server action → Zod → rate limit → RLS → `revalidatePath`.

**Calendario:** el panel **no** habla con Google. Llama al asistente
(`dma-sales-assistant`, Flask en Render) por HTTPS servidor a servidor con `Bearer`,
porque allí vive el refresh token de Google que funciona. Si el asistente no responde, se
lee el espejo de `agenda.cache_externo` y se muestra un banner con la antigüedad del dato.

### Patrones clave

- **Deny-by-default**: el matcher del middleware es una lista negra de estáticos, no una
  lista blanca de rutas privadas. Ruta nueva = protegida automáticamente.
- **La autoridad es la RLS**, no el middleware. Los route handlers revalidan la sesión por
  su cuenta.
- **Un paso apunta a Google, no lo copia.** Google es dueño de eventos y tareas; Supabase
  de ideas, proyectos y pasos.
- Vincular usa PATCH condicional (`?id=eq.X&google_id=is.null`): 0 filas = ya estaba
  vinculado, se devuelve como éxito.
- En UPDATE/DELETE, `data.length === 0` significa "RLS te filtró la fila", no "no existe".

## Design system

Fondo `#f8fafc`, texto `#0f172a`, superficie `#ffffff`, borde `#e2e8f0`.
Primario `#6c5ce7` (hover `#5b4bd5`), acción `#059669`, éxito `#10b981`,
alerta `#f59e0b`, error `#ef4444`, muted `#f1f5f9` / `#64748b`.
Fuente Inter Variable (`@fontsource-variable/inter`, sin `next/font`).
`--radius: 0.75rem` — cards 16px, botones e inputs 12px, chips redondos.
Ancho máximo 480px, móvil primero, tab bar inferior. Solo modo claro.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (pública) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública) |
| `FLASK_API_URL` | Base del asistente en Render (server-side) |
| `FLASK_API_TOKEN` | Bearer del puente. **Sin `NEXT_PUBLIC_`** |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Rate limit (opcional; sin ellas usa memoria) |

`SUPABASE_SERVICE_KEY` **no existe en este repo ni en Vercel.** Vive solo en Render.

## Reglas no negociables

1. La seguridad se construye en los bloques 2-3, nunca al final.
2. **No se crea ningún trigger sobre `auth.users`.** El de Caja Familiar cierra el registro
   de todo el proyecto; añadir otro lo dejaría sin poder dar de alta a nadie. La autoridad
   de esta app es `agenda.es_duena()` + RLS.
3. RLS habilitada y forzada en el 100% de las tablas. `service_role` jamás en el código del
   panel — el CI falla si aparece `SERVICE_ROLE` en el repo.
4. Rate limiting desde el día uno, con 429 y `Retry-After`.
5. Validación Zod en el servidor para toda entrada. `user_id` viene de `auth.uid()`, nunca
   del formulario.
6. **Google es dueño del calendario y de las tareas.** Supabase solo guarda el puntero.
   Se crea una vez, se lee siempre, no se recrea nunca. Si el objeto desapareció en Google,
   el paso pierde el vínculo — no se borra, no se duplica.
7. Zona horaria: todo "hoy" en `America/Guayaquil` vía `lib/dates.ts`. Nunca `new Date()`
   directo.
8. TypeScript strict; prohibido `any` y `as` para silenciar errores. Un componente por
   archivo, máximo 300 líneas. Server Components por defecto.
9. Interfaz en español, móvil-primero, fiel al sistema visual de Caja Familiar.
10. Nunca commitear `.env*`. Secretos jamás en el bundle del cliente.
11. Al terminar cada bloque: build, lint y tests en verde → commit → PR → resumen a Dayana
    → **esperar confirmación** antes de seguir.
```

---

## 16. Reglas no negociables

1. **La seguridad se construye en los bloques 2-3, nunca al final.** El bloque 0
   (diagnóstico del Supabase compartido) es bloqueante: no se escribe la primera migración
   sin sus cuatro respuestas.
2. **No se crea ningún trigger sobre `auth.users`.** Caja Familiar ya tiene el suyo, sin
   cláusula `WHEN`, y dos whitelists se intersectan en vez de sumarse. El control de acceso
   de Mi Agenda vive en `agenda.es_duena()` + RLS, en la base de datos, no en código de la
   app.
3. **RLS `enable` + `force` en el 100% de las tablas**, con policies explícitas.
   `service_role` solo en Render; el CI del panel falla si aparece `SERVICE_ROLE` en el
   repo. `anon` sin privilegios sobre `agenda`, y **nunca** un `revoke … from anon` global.
4. **Rate limiting desde el día uno**, por usuario y por token, con 429 y `Retry-After`.
5. **Validación Zod en el servidor para toda entrada.** La identidad viene de `auth.uid()`
   (panel) o del perfil resuelto en el servidor (asistente), **nunca del formulario ni de
   un parámetro**.
6. **Datos sensibles:** no se guardan tarjetas, cuentas ni documentos. Los secretos viven
   solo en variables de servidor; `.env*` fuera de git; sin contenido de ideas ni títulos
   de eventos en los logs.
7. **Integridad del vínculo con Google:** se crea una vez, se lee siempre, no se recrea
   nunca. La unicidad la impone Postgres (índice único parcial), no Python. Un 404 de
   Google desvincula; **nunca** borra ni recrea. Un 5xx no toca nada.
8. **Zona horaria `America/Guayaquil`**, con `lib/dates.ts` como única fuente de verdad. En
   el asistente, la misma regla que ya tiene documentada: fechas UTC-5.
9. **Nada puede tumbar el bot de ventas.** Los endpoints del panel llevan `timeout_s` corto
   y presupuesto total, no llaman a GHL ni a Stripe, y degradan a respuesta parcial antes
   que agotar el `--timeout 120` de gunicorn. `--workers 1` no se cambia.
10. **El navegador nunca toca Flask.** No se añade `flask-cors`. Todo el tráfico panel →
    asistente sale del servidor de Next.js.
11. **TypeScript strict, sin `any`**; un componente por archivo, máximo 300 líneas;
    interfaz en español, móvil-primero, fiel al sistema visual de Caja Familiar.
12. **Al terminar cada bloque:** verificar ejecutando (no suponer), commit, PR, resumen en
    lenguaje llano —qué puede hacer Dayana ahora que antes no podía— y **esperar
    confirmación** antes de seguir.
13. **Si una decisión de seguridad no está definida aquí, se pregunta. No se inventa.**
