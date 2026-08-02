# Stack por defecto

Elegido y validado en Caja Familiar. Costo de operación: **$0/mes** para apps
pequeñas.

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Server Components y server actions evitan escribir una API aparte; PWA instalable; un solo deploy |
| Lenguaje | **TypeScript strict** | Los montos y fechas exigen tipos estrictos. Sin `any` |
| Estilos | **Tailwind v4** | Estándar actual; réplica rápida de un mockup |
| Componentes | **shadcn/ui** | Primitivas accesibles con control total del estilo |
| Base de datos | **Supabase (Postgres)** | Auth + DB + Realtime + Edge Functions en un servicio |
| Acceso a datos | **supabase-js + tipos generados** | Sin ORM: a escala pequeña añade complejidad sin beneficio, y la seguridad vive en RLS |
| Auth | **Supabase Auth** (Google OAuth) | Integrado con la DB y con RLS |
| Validación | **Zod** | Toda entrada del cliente se valida en el servidor |
| Rate limiting | **Upstash Redis** | Serverless-friendly; límites persistentes entre invocaciones |
| Gráficos | **Recharts** | Suficiente para dashboards; se integra bien con React |
| Fechas | **date-fns + date-fns-tz** | Zona horaria explícita, sin sorpresas |
| Tests | **Vitest** (unidad) + arnés SQL | Rápido; el arnés cubre lo que los tests unitarios no ven |
| Hosting | **Vercel** | De los creadores de Next.js; HTTPS y deploy automático gratis |

## Cuándo cambiar algo

- **Hosting compartido tipo Hostinger no sirve** para Next.js: ejecuta PHP, no
  Node. Requeriría un VPS y administrarlo a mano. Vercel es gratis y automático.
- **Firebase en vez de Supabase**: solo si el usuario ya vive en el ecosistema
  Google y no necesita SQL.
- **Sin PWA**: si la app es solo de escritorio, sáltate el service worker.

## Estructura de directorios

```
src/
  app/
    login/                  # ruta pública
    auth/callback/          # callback OAuth
    (app)/                  # TODO protegido por middleware
      layout.tsx            # shell: header + navegación
      page.tsx              # pantalla principal
      <seccion>/page.tsx
    api/<ruta>/route.ts     # solo lo que el navegador llama directo
  actions/                  # server actions: TODA mutación pasa por aquí
  components/
    ui/                     # primitivas (shadcn)
    app/                    # componentes de dominio
  lib/
    supabase/{client,server,middleware}.ts
    queries.ts              # lecturas del servidor
    validations.ts          # esquemas Zod
    ratelimit.ts
    money.ts  dates.ts      # dominio: centavos y zona horaria
  types/database.ts         # generado
  middleware.ts             # deny-by-default
supabase/
  migrations/               # SQL numerado
  functions/                # Edge Functions (Deno)
  tests/                    # arnés de RLS
scripts/                    # utilidades (iconos, pruebas de DB)
docs/                       # guías de despliegue y activación
```

## Variables de entorno

| Variable | Dónde vive |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | Vercel (públicas, seguras) |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ solo secret de Edge Function |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Vercel |
| `VAPID_PRIVATE_KEY` | ⚠️ solo secret de Edge Function |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Vercel (server-side) |
| `APP_TIMEZONE` | Vercel |
