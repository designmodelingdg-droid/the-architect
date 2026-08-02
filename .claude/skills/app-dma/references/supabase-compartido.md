# Instalar una app en un proyecto Supabase compartido

El plan gratuito de Supabase limita el número de proyectos. Si ya hay otras apps
en el proyecto, **no crees tablas en `public`**: usa un esquema dedicado.

## Por qué

- Evita colisiones de nombres con las tablas de las otras apps.
- Los permisos de cada app quedan separados.
- Puedes borrar la app entera con `drop schema … cascade` sin tocar lo demás.

## Cómo

**1. Todo dentro del esquema**

```sql
create schema if not exists caja;   -- nombre corto de la app
create table caja.profiles (…);
create table caja.expenses (…);
```

Funciones, triggers y policies también: `caja.is_member()`, `caja.enforce_whitelist()`.

**2. Permisos sin tocar `public`**

```sql
grant usage on schema caja to authenticated, service_role;
grant select, insert, update, delete on all tables in schema caja to authenticated;
grant all on all tables in schema caja to service_role;
alter default privileges in schema caja
  grant select, insert, update, delete on tables to authenticated;
-- anon: nada, a propósito
```

**Nunca** hagas `revoke … from anon` global: romperías las otras apps. Simplemente
no le des privilegios sobre tu esquema.

**3. Prefija los triggers de `auth.users`**

`caja_enforce_whitelist_before_signup`, `caja_on_auth_user_created` — para no
chocar con triggers existentes.

**4. Exponer el esquema en la Data API** (paso que se olvida y rompe todo)

Settings → API → *Exposed schemas* → agregar el esquema (sin quitar `public`).
Si el panel falla al guardar, usa la Management API (ver `lecciones.md` §2).

**5. Configurar el cliente**

```ts
createBrowserClient<Database>(url, key, { db: { schema: "caja" } })
createServerClient<Database>(url, key, { db: { schema: "caja" }, cookies: {…} })
```

Y en los tipos generados, la clave raíz es el esquema:
`export type Database = { caja: { Tables: {…} } }`

Para regenerarlos: `npx supabase gen types typescript --linked --schema caja`

**6. Realtime**

`alter publication supabase_realtime add table caja.notifications;`
En el canal del cliente: `{ schema: "caja", table: "notifications" }`.

## Lo único que sí es global: Auth

El trigger de whitelist en `auth.users` aplica a **todo el proyecto**. Mientras
exista, ninguna otra app de ese proyecto podrá registrar usuarios nuevos.

**Antes de aplicarlo, verifica** (Dashboard → Authentication → Users) que ninguna
otra app dependa del registro de usuarios. Si alguna lo usa, hay que hacer el
trigger condicional o usar un proyecto aparte.

## Verificar que no rompiste nada

El arnés (`assets/test-db.sh`) incluye una aserción de convivencia: simula una
tabla de otra app en `public` con acceso `anon` y comprueba que **conserva su
acceso** después de instalar el esquema nuevo. Mantenla.
