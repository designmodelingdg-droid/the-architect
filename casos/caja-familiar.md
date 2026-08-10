# Caso real: Caja Familiar

La primera app construida con esta metodología, de la entrevista a
producción. Es el caso "pequeño y completo": 2 usuarios, un dominio
acotado, y todas las prácticas que después escalaron a Control Financiero
DG nacieron aquí.

## Qué es

PWA privada para los egresos del hogar de Gabriel y Dayana. Presupuesto
mensual repartido en tres fondos (Gabriel / Dayana / fondo común, montos
editables en Ajustes), registro de gastos, historial por mes, cierre de
caja diario, notificaciones push, reportes y alertas de presupuesto.

## Decisiones de la entrevista (fase 1)

- **Registro cerrado:** solo 2 correos de Google, whitelist dura con
  trigger en la base — cualquier otro correo es rechazado al registrarse.
- **Ambos administradores iguales**; pueden registrar gastos de cualquier
  fondo.
- **Exceder el presupuesto se permite con alerta** (amarilla 80%, roja
  100%), nunca se bloquea el registro.
- **Los gastos se editan solo hasta el cierre diario de su fecha**;
  después quedan sellados (RLS lo garantiza, no la UI).
- **Zona horaria del negocio:** America/Guayaquil. "Hoy" se decide ahí,
  jamás con `new Date()` suelto.
- **Dinero en centavos enteros.**

## Stack

Next.js 15 (App Router, TS estricto) + Tailwind v4 + Supabase (Postgres,
Auth con Google, RLS, Realtime, Edge Function para Web Push) + Vercel.
Costo $0. Sin ORM: `supabase-js` con tipos escritos a mano.

## Los bloques, en orden real

1. **Scaffolding + design system** del mockup (morado primario, un color
   por fondo, iconos generados con `assets/gen-icons.mjs`).
2. **Base de datos + RLS + whitelist** — profiles, funds, monthly_budgets,
   expenses, daily_closes, notifications, push_subscriptions, settings.
   Arnés `assets/test-db.sh` desde este bloque.
3. **Auth end-to-end** — Google OAuth vía Supabase, middleware
   deny-by-default, prueba de rechazo con cuenta ajena.
4. **App shell** — navegación completa con placeholders.
5. **CRUD de gastos** — server actions + Zod + rate limiting.
6. **Dashboard** con saldos reales por fondo.
7. **Historial** por mes.
8. **Cierre de caja diario** — sella los gastos del día. Lección grande:
   la primera versión era irreversible y un toque accidental dejó el día
   bloqueado; se agregó confirmación en dos pasos + reapertura posible
   solo el mismo día (ver `references/lecciones.md` §7).
9. **Notificaciones + Web Push** (VAPID, campanita en vivo con Realtime).
10. **Reportes + alertas** de presupuesto.
11. **Ajustes + export** — presupuestos editables por fondo.
12. **PWA polish** — instalable, offline, y las cabeceras anti-caché
    (`assets/next.config.ts`) que costaron una tarde de depurar en iPhone.
13. **Deploy + checklist de seguridad** en Vercel.

## Evolución posterior (ya en producción)

- **Espejo hacia Control Financiero DG:** cada gasto del hogar aparece
  automáticamente como gasto personal en la app financiera (trigger
  `security definer` en el Supabase compartido). Caja Familiar no sabe que
  DG existe: si DG no está configurada, el trigger no hace nada.
- **Conceptos frecuentes** (datalist con los gastos fijos del hogar) para
  registrar en dos toques.
- **Pagado con tarjeta de crédito:** checkbox en el formulario; el gasto
  descuenta el presupuesto del fondo pero en DG entra a la cuenta TDC, sin
  tocar la liquidez de los bancos hasta pagar la tarjeta a fin de mes.

## Qué aprender de este caso

- El tamaño pequeño lo hizo el laboratorio perfecto: el arnés de RLS, el
  patrón de whitelist, los iconos, el service worker y las cabeceras de
  caché se escribieron aquí una vez y se reusaron tal cual en la app
  grande (hoy viven en `assets/` del skill `app-dma`).
- La mejora que propuso el usuario (poder deshacer el cierre del día) era
  correcta y evitó un problema real: cuando el usuario detecta una falla
  de diseño, tómala en serio.
