# Reglas de seguridad no negociables

Probadas en Caja Familiar. Se diseñan en la fase 1 y se construyen en los bloques
2–3, **antes** que cualquier funcionalidad.

## 1. Registro cerrado con whitelist en la base de datos

Si la app es para un grupo conocido, la lista de correos autorizados va en un
**trigger de Postgres**, no en el código de la app:

```sql
create or replace function app.enforce_whitelist()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if lower(new.email) not in ('correo1@gmail.com', 'correo2@gmail.com') then
    raise exception 'Registro cerrado: este correo no está autorizado.'
      using errcode = 'P0001';
  end if;
  return new;
end $$;

create trigger enforce_whitelist_before_signup
  before insert on auth.users
  for each row execute function app.enforce_whitelist();
```

Es la barrera definitiva: ningún proveedor mal configurado, API directa ni bug de
la app puede saltarla. Cambiarla exige una migración deliberada.

Además: deshabilitar el registro por email en Supabase y dejar solo el proveedor
elegido.

> ⚠️ En un proyecto Supabase compartido, este trigger afecta a **todas** las apps
> del proyecto. Ver `supabase-compartido.md`.

## 2. RLS en el 100% de las tablas, deny-by-default

`alter table … enable row level security` en cada tabla, con policies explícitas.
El rol `anon` no recibe privilegios si la app no tiene parte pública.

Comprobar siempre que **sin sesión no se ve nada** — no basta con que "la app
no muestre el botón".

## 3. `service_role` solo en el servidor

Nunca en el código cliente ni en las variables de Vercel de la app. Su único lugar
legítimo son las Edge Functions o scripts de servidor.

## 4. La identidad viene del servidor

`created_by`, `user_id`, `closed_by` se toman de `auth.uid()`. Si el formulario
los manda, se ignoran. La policy de INSERT debe exigir `created_by = auth.uid()`.

## 5. Validación en el servidor con Zod

Toda entrada del cliente se parsea antes de tocar la base de datos. El estado del
formulario nunca se confía. Errores en mensajes legibles, en español.

## 6. Rate limiting desde el día uno

Por usuario y por acción (ej. 30/min para crear registros, 5/min para operaciones
pesadas o exportar). Upstash Redis en producción, ventana en memoria en desarrollo.
Responder 429 con `Retry-After`.

## 7. Rutas protegidas deny-by-default

El middleware define una lista blanca de rutas públicas (`/login`, `/auth/*`,
estáticos) y protege **todo lo demás**. El middleware es comodidad; la autoridad
real es la RLS.

## 8. Sesiones en cookies httpOnly

Nunca en localStorage. Refresh automático en el middleware. Cerrar sesión con
alcance global.

## 9. Datos sensibles: lo que no se guarda no se filtra

No almacenar tarjetas, cuentas bancarias ni documentos si la app no los necesita.
HTTPS siempre. Sin PII en logs. `.env*` fuera de git; `.env.example` documentado.

## 10. Integridad de los datos

- Montos en centavos enteros.
- Registros consolidados (cierres, cortes) **inmutables**, con una salida acotada
  para corregir errores del día en curso (ver lección 7).
- Restricciones en la base de datos (`CHECK`, `UNIQUE`), no solo en la app.

## 11. Verificar la seguridad ejecutándola

El arnés `assets/test-db.sh` levanta Postgres, aplica las migraciones reales y
comprueba:

- un correo no autorizado **no** puede registrarse
- `anon` no lee nada
- una sesión sin identidad válida no ve filas
- nadie puede suplantar la autoría de otro
- lo sellado no se edita, no se borra y no admite inserciones retroactivas
- lo inmutable sigue inmutable

Si tocas policies, corre el arnés. Si agregas una regla de seguridad, agrega su
aserción.

## Checklist final antes de dar por terminado

- [ ] Un correo no autorizado es rechazado (probado en producción real)
- [ ] Registro por email deshabilitado si solo se usa OAuth
- [ ] RLS activa en todas las tablas
- [ ] `service_role` ausente de las variables de la app
- [ ] Rate limits respondiendo
- [ ] HTTPS en producción
- [ ] `.env*` fuera de git
