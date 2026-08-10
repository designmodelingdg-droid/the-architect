# Caso real: Control Financiero DG

Cómo se construyó, bloque a bloque, la app financiera de Design Modeling
(Gabriel y Dayana). Léelo junto al skill `app-dma`: este es el ejemplo
completo de la metodología aplicada a un sistema grande — 40+ bloques,
tres repos, un Supabase compartido y un asistente de WhatsApp integrado.

## El sistema completo

| Pieza | Repo | Stack | Vive en |
|---|---|---|---|
| App financiera | `control-financiero-dg` | Next.js 15 + Supabase (esquema `dg`) | Vercel |
| Caja Familiar | `caja-familiar` | Next.js 15 + Supabase (esquema `caja`) | Vercel |
| Asistente / estadísticas | `dma-sales-assistant` | Flask + GHL + Stripe + Meta Ads | Render |

Un solo proyecto Supabase ("dg-contenido-ia") con esquemas separados por
app — ver `references/supabase-compartido.md`. Los esquemas se hablan por
triggers `security definer`, nunca por llamadas HTTP entre apps.

## Fase 0 — Entrevista y blueprint

Igual que Caja Familiar: entrevista (mockup + PDF de instrucciones del
usuario), blueprint con la seguridad definida desde el inicio, whitelist
dura de 2 correos, RLS deny-by-default + FORCE en todas las tablas.

## Los bloques, en orden real

**Cimientos (1–4):** scaffolding + design system del mockup → base de
datos completa (23 tablas: cuentas, movimientos, categorías, obligaciones,
deudas, clientes, inscripciones, cuotas, metas, actividades…) con RLS y
arnés de pruebas → auth end-to-end con whitelist → app shell.

**CRUDs financieros (5–9):** cuentas y caja → movimientos (ingreso /
gasto / transferencia, con anulación en vez de borrado) → dashboard con
datos reales → pagos pendientes y obligaciones recurrentes → deudas y
créditos.

**Clientes y cobros (10):** clientes, inscripciones a programas y cuotas.
El registro de una cuota es un RPC (`register_installment`) que crea la
transacción y actualiza la inscripción en una sola operación atómica.

**Operación (11–15):** cierre diario → reportes y exportación →
configuración + espejo con Caja Familiar → PWA + logo → deploy con
checklist de seguridad.

**Comercial (16–20):** metas comerciales → proyección semanal → cierres
semanal y mensual → actividades y tareas → notificaciones + push.

**Integraciones (21–30):** importación desde Excel → comprobantes
adjuntos (Storage) → finanzas por WhatsApp en el asistente → web push →
kanban y calendario → estadísticas de la empresa (GHL + Meta Ads + Stripe,
tres iteraciones hasta "ventas reales del CRM").

**Refinamiento continuo (31+):** pagos fijos con botón de pago rápido,
filtros por semana/área, edición de cuotas, alta de clientes desde los
cobros de Stripe, tarjetas de crédito de verdad (TDC), meta del mes.

## Decisiones de dominio que definieron todo

- **Dinero en centavos enteros.** Siempre.
- **Mes contable del 5 al 5**, no calendario. Un solo módulo
  (`src/lib/finance.ts` → `contableWindow`) decide la ventana; TODO lo
  demás (dashboard, obligaciones, estadísticas, cierres) la consume. Un
  vencimiento con día 1–4 pertenece al mes siguiente.
- **Ventas reales de GHL** (el dato que el usuario ve en su CRM):
  oportunidades **ganadas** en la ventana, fecha = `lastStatusChangeAt ||
  createdAt` (nunca `updatedAt`: tocar una tarjeta la re-contaba), un solo
  registro por cliente (dedup por nombre, gana el de mayor monto; empate lo
  gana el pipeline del Máster), pruebas excluidas, agrupadas por familia de
  pipeline. Costó tres iteraciones llegar a la cifra exacta del cierre
  oficial — verificar contra el número que el usuario ya conoce.
- **Tarjetas de crédito** = cuenta tipo `tarjeta`: el gasto con TDC
  descuenta presupuesto pero no liquidez (saldo negativo = deuda); pagar la
  tarjeta es una transferencia banco → tarjeta.
- **Anular, no borrar.** Los movimientos se anulan con motivo y autor; los
  que vienen espejados de otra app se anulan desde la app origen.

## Integración entre las tres piezas

- **Caja Familiar → DG:** trigger `caja.sync_expense_to_dg()` (security
  definer): cada gasto del hogar entra como gasto personal en DG,
  idempotente por `UNIQUE (source, source_id)`. Si DG no está configurada,
  el trigger NO bloquea a Caja Familiar (retorna sin hacer nada).
- **App ↔ asistente (Render):** la app pide estadísticas a Render con un
  secreto compartido (`ESTADISTICAS_URL` + `ESTADISTICAS_SECRET`). Los
  tokens de GHL/Stripe/Meta viven SOLO en Render. Ojo con las whitelists de
  parámetros en el servidor: una whitelist vieja degradaba en silencio el
  período "corte" a "mes" y produjo números incomprensibles río abajo.
- **Datos de GHL sin tocar la API directa:** el conector de GoHighLevel en
  Windsor.ai (MCP) da órdenes, transacciones, contactos y oportunidades.
  Útil cuando la red del entorno bloquea la API o no hay token a mano.

## Cómo se opera producción (sin acceso directo)

El entorno no llega a Supabase producción. El flujo probado:

1. Todo cambio de datos/esquema se escribe como **SQL idempotente**
   (`where not exists` / `on conflict`) — repetirlo no duplica ni pisa.
2. Se prueba **dos veces seguidas** contra Postgres efímero
   (`assets/test-db.sh` + stub de auth + migraciones reales).
3. Se entrega como **archivo adjunto**, nunca pegado en el chat (el chat
   se come los asteriscos: un `a * b` que desaparece corrompe el SQL).
4. El usuario (u otra sesión de Claude con acceso) lo pega COMPLETO en el
   SQL Editor de Supabase y reporta el resultado de la consulta de
   verificación que el propio script trae al final.

Seeds reales entregados así: 68 pagos fijos, 26 clientes recurrentes,
corte inicial del mes, arranque de cuentas en cero, catálogo de productos
con precios verificados contra los pagos reales de GHL.

## Flujo git bajo fuego

El ciclo normal es rama `claude/bloque-NN` → verificar → PR → merge. Pero
la API de GitHub pasó horas con rate limit y el trabajo no podía parar:
con el permiso del usuario, el patrón pasó a **squash-merge directo a
main** (`git merge --squash rama` + commit + push) con la verificación
completa ANTES del merge (lint + tests + build + arnés de BD). Los PRs
supersedidos se cierran después. No es el ideal — es el plan B honesto.
