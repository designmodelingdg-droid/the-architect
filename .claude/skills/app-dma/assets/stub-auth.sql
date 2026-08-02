-- Stub del entorno Supabase para pruebas locales (NO se aplica en producción).
-- Reproduce lo mínimo que las migraciones necesitan: el esquema auth,
-- auth.users, auth.uid() y los roles anon / authenticated / service_role.

create schema if not exists auth;

create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- En Supabase, auth.uid() lee el claim `sub` del JWT de la request.
-- Aquí lo simulamos con una setting de sesión.
create or replace function auth.uid()
returns uuid
language sql stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

do $$
begin
  if not exists (select from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select from pg_roles where rolname = 'service_role') then
    create role service_role nologin bypassrls;
  end if;
end $$;

-- Supabase otorga privilegios amplios a estos roles y confía en RLS.
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;

-- Supabase Realtime publica los cambios por esta publicación (0005).
create publication supabase_realtime;

-- Simula la "otra app" que ya vive en el proyecto compartido:
-- una tabla en public con acceso anon que NO debe verse afectada.
create table public.contenido_demo (id int primary key, titulo text);
insert into public.contenido_demo values (1, 'contenido de otra app');
grant select on public.contenido_demo to anon;
