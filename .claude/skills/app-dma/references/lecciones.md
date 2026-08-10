# Lecciones de producción

Problemas reales encontrados construyendo **Caja Familiar**, con su causa y su
solución verificada. Léelo antes de depurar algo raro: probablemente ya está aquí.

---

## 1. La PWA instalada en iPhone se queda pegada en una versión vieja

**Síntoma:** se despliega una versión nueva, pero la app instalada en la pantalla
de inicio sigue mostrando pantallas antiguas (en nuestro caso, Ajustes seguía
diciendo "Se construye en el Bloque 12" una hora después del deploy).

**Causa:** iOS cachea de forma agresiva la pantalla de las PWA instaladas. El
service worker hacía red-primero, pero la petición ni salía: la resolvía el caché
HTTP del sistema.

**Solución** (`assets/next.config.ts`):
- Páginas de la app → `private, no-cache, no-store, max-age=0, must-revalidate`
- `sw.js` y `manifest.webmanifest` → `public, max-age=0, must-revalidate`
- `/icons/*`, `_next/*` → cacheables
- En el registro del SW: `registration.update()` al abrir y en `visibilitychange`;
  recargar una vez en `controllerchange`

**Ojo con el orden de las reglas de `headers()`**: una regla catch-all pisa a las
específicas. Excluye explícitamente `sw.js` y `manifest.webmanifest` del patrón
general.

**Para salir de una versión ya cacheada** (una sola vez): borrar la app de la
pantalla de inicio + limpiar datos del sitio en Safari + reinstalar.

---

## 2. El panel de Supabase falla al guardar configuración

**Síntoma:** en Authentication → URL Configuration o Settings → API, el botón
Guardar se queda cargando o da "Error al guardar la configuración". En la red solo
se ve la petición OPTIONS (preflight), nunca la de escritura.

**Causa:** bug del dashboard (no de las credenciales ni del navegador; nos pasó
con la traducción desactivada y en varias sesiones).

**Solución:** usar la **Management API** con `curl`, que sí funciona:

```bash
# Exponer un esquema en la Data API
curl -X PATCH "https://api.supabase.com/v1/projects/<REF>/postgrest" \
  -H "Authorization: Bearer $SUPABASE_TOKEN" -H "Content-Type: application/json" \
  -d '{"db_schema": "public, graphql_public, mi_esquema"}'

# Site URL + Redirect URLs + proveedores
curl -X PATCH "https://api.supabase.com/v1/projects/<REF>/config/auth" \
  -H "Authorization: Bearer $SUPABASE_TOKEN" -H "Content-Type: application/json" \
  -d '{"site_url": "https://mi-app.vercel.app",
       "uri_allow_list": "http://localhost:3000/auth/callback,https://mi-app.vercel.app/auth/callback",
       "external_google_enabled": true,
       "external_google_client_id": "...", "external_google_secret": "...",
       "external_email_enabled": false}'
```

El token se genera en supabase.com/dashboard/account/tokens.

**Si responde `{"message":"JWT could not be decoded"}`** el token está mal pegado
(quedó el texto `TU_TOKEN` literal o incompleto). Si responde un bloque JSON
grande sin la palabra `error`, quedó guardado.

**Consejo al usuario:** que arme el comando en Notas (reemplazando el token) y
pegue la línea completa en la Terminal.

---

## 3. El favicon sigue siendo el de Next.js aunque lo declares

**Causa:** `src/app/favicon.ico` tiene prioridad sobre `metadata.icons`. Si no lo
reemplazas, gana el de Next.

**Solución:** generar un `.ico` real con el logo (ver `assets/gen-icons.mjs`, que
incluye un codificador ICO propio sin dependencias) y sobrescribir ese archivo.
Declara además los PNG por tamaño y el `apple-touch-icon` de 180px.

---

## 4. Zod v4 ejecuta todos los checks aunque falle el regex

**Síntoma:** un `.refine()` que asume formato válido explota con datos basura.

```ts
// ❌ el refine recibe "23/07/2026" y revienta
z.string().regex(ISO).refine((d) => isTodayOrPast(d), "…")

// ✅ protegerlo
z.string().regex(ISO).refine((d) => !ISO.test(d) || isTodayOrPast(d), "…")
```

---

## 5. El build de Next intenta compilar las Edge Functions (Deno)

**Síntoma:** `Cannot find module 'npm:@supabase/supabase-js@2'`.

**Solución:** en `tsconfig.json` → `"exclude": ["node_modules", "supabase/functions"]`.

---

## 6. Tipos estrictos y Web Push

`applicationServerKey` no acepta `Uint8Array<ArrayBufferLike>` en TS estricto:
devuelve `.buffer` (`ArrayBuffer`) desde el helper que decodifica la clave VAPID.

---

## 7. Un cierre/bloqueo irreversible deja al usuario sin salida

**Qué pasó:** el cierre de caja diario sellaba los gastos del día. Un toque
accidental dejó el día bloqueado: no se podían corregir ni registrar gastos, y
además impidió probar las notificaciones.

**Lección de diseño:** toda operación irreversible necesita **dos cosas**:
1. **Confirmación en dos pasos** antes de ejecutarse.
2. **Una salida acotada**: se puede deshacer mientras siga siendo el mismo día;
   los días anteriores quedan sellados para siempre.

Así se protege la integridad histórica sin dejar al usuario atrapado por un error.

---

## 8. Supabase Realtime necesita su publicación

La migración `alter publication supabase_realtime add table …` falla si la
publicación no existe (pasa en el arnés local). El stub de pruebas debe declararla:
`create publication supabase_realtime;`

---

## 9. GitHub falla intermitentemente

Vas a ver 500 al crear PRs y 504 al leerlos. **No es tu código.** Reintenta; si
persiste, avisa al usuario que la rama está subida y verificada, y que el PR queda
pendiente. Nunca lo dejes sin explicación.

---

## 10. Límites del entorno de Claude Code remoto

- **No puede crear repos** (403) → que el usuario lo cree vacío en github.com/new.
- **No puede hacer fork** de repos fuera del alcance de la sesión → que el usuario
  lo haga desde la web y luego se agrega con `add_repo`.
- Solo se pueden agregar repos **del mismo owner** que los ya adjuntos.
- La red bloquea `supabase.com`, `vercel.app` y `api.supabase.com` → **no puedes
  verificar producción directamente**; pídele capturas o resultados al usuario.
- `npx shadcn init` falla (bloquea `ui.shadcn.com`) → vendorea los componentes a
  mano (`cn()`, `Button`, `components.json`); es el mismo código.

---

## 11. Verificar de verdad, no suponer

Lo que más valor dio en este proyecto:

- **Arnés de RLS con Postgres real** (`assets/test-db.sh`): levanta una base
  efímera, aplica las migraciones reales y prueba que un intruso no entra, que
  nadie suplanta a otro y que lo sellado no se toca. Encontró errores que la
  lectura del código no habría encontrado.
- **Capturas con Playwright** de cada pantalla nueva, comparadas contra el mockup.
- **CI en cada PR** desde el primer bloque.

---

## 12. Detalles de dominio que evitan bugs sutiles

- **Dinero en centavos enteros**, nunca decimales flotantes. Formatear solo en la vista.
- **Fechas de negocio en la zona horaria del usuario**, con un único módulo como
  fuente de verdad. Nunca `new Date()` suelto para decidir "hoy" (a las 22:00 en
  Ecuador ya es el día siguiente en UTC).
- **`created_by` / `user_id` siempre del servidor** (`auth.uid()`), jamás del
  formulario.
- **Operaciones simultáneas**: si ambos usuarios pueden hacer lo mismo a la vez,
  protege con `UNIQUE` y trata el conflicto como éxito, no como error.

---

## 13. Singleton con id booleano: `where id`, no `where id = 1`

En `dg.settings` el id se definió como `id boolean primary key default
true check (id)` — garantiza una sola fila. La condición correcta es
`where id` a secas; `where id = 1` revienta con `operator does not exist:
boolean = integer`. Si el proyecto mezcla singletons booleanos y numéricos
(en `caja.settings` sí es `id = 1`), revisa el schema antes de filtrar.
El arnés de Postgres real atrapa esto al primer intento — otra razón para
correrlo siempre antes de entregar SQL.

---

## 14. SQL para producción: SIEMPRE archivo adjunto, nunca chat

El formato del chat se come los asteriscos (`a * b` → `a  b`) y puede
corromper multiplicaciones dentro del SQL sin que nadie lo note hasta que
los montos salen mal. Todo SQL que otra persona vaya a pegar en el SQL
Editor se entrega como archivo. Y el script debe terminar con una consulta
de verificación (conteos, totales) para que quien lo corre confirme el
resultado sin saber SQL.

---

## 15. Aviso falso de RLS en el SQL Editor de Supabase

Al correr ciertos INSERT/UPDATE el editor avisa "esta consulta crea una
tabla sin RLS" aunque el script no cree ninguna tabla. Es un falso
positivo. La opción correcta es **"Run without RLS"** — significa "correr
sin cambiar la configuración", que es lo que se quiere cuando RLS ya está
activa. Verificable con `pg_class` (`relrowsecurity` / `relforcerowsecurity`).
Jamás elegir "Run and enable RLS" a ciegas.

---

## 16. Rate limit de la API de GitHub: el plan B es merge directo

La API puede pasar horas devolviendo rate limit y bloquear crear/mergear
PRs. Si el usuario lo aprueba, el plan B es `git merge --squash rama` +
commit + `git push origin main`, con TODA la verificación (lint, tests,
build, arnés de BD) hecha ANTES del merge. Los PRs supersedidos se
cierran cuando la API vuelva. Nunca dejes el trabajo verificado esperando
a una API caída sin contárselo al usuario.

---

## 17. Datos de plataformas externas sin tocar su API directa

Cuando la red del entorno bloquea una API (o no hay token utilizable), el
conector correspondiente en **Windsor.ai** (MCP) suele resolver la
lectura: GoHighLevel expone órdenes, transacciones, contactos, pipelines y
oportunidades. Con eso se construyó el catálogo real de productos con
precios verificados contra pagos reales. Regla de oro: cruza siempre el
dato de la plataforma con la fuente oficial del negocio (en DMA, el guion
de ventas) antes de darlo por bueno.

---

## 18. Las ventanas de negocio no son el mes calendario

El "mes contable" del usuario va del día 5 al día 5. Ese tipo de regla
debe vivir en UN solo módulo (`contableWindow()`) que todo lo demás
consume: dashboard, obligaciones, estadísticas, cierres. Si cada pantalla
calcula su propia ventana, aparecen números distintos para "el mes" y el
usuario pierde la confianza. Y cuidado con los servidores intermedios:
una whitelist de parámetros desactualizada degradaba "corte" a "mes" en
silencio — el bug más caro de encontrar de todo el proyecto.

---

## 19. Espejo entre apps del mismo Supabase: trigger, no HTTP

Para que un registro de la app A aparezca en la app B (gasto del hogar →
gasto personal en finanzas): trigger `security definer` en el esquema de
A que inserta en el de B, idempotente por `UNIQUE (source, source_id)` con
`on conflict do update`. Reglas: si B no está configurada, el trigger
retorna sin hacer nada (jamás bloquea a A); B anula en vez de borrar
cuando A elimina; y si el destino depende de un dato del registro (p. ej.
"pagado con tarjeta"), la columna de enrutamiento viaja en A y el trigger
decide la cuenta destino en B.
