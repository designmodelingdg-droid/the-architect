# {NOMBRE DEL PROYECTO} — Blueprint

> Generado el {FECHA}
> Tipo: {app de gestión / dashboard / SaaS / herramienta privada}

---

## 1. Visión

{1-2 párrafos: qué es, para quién, qué problema resuelve.}

### Objetivos
- {Objetivo medible 1}
- {Objetivo 2}

### Cómo sabremos que funcionó
- {Métrica 1}
- {Costo de operación esperado}

---

## 2. Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | | |
| Lenguaje | | |
| Estilos | | |
| Componentes | | |
| Base de datos | | |
| Auth | | |
| Validación | | |
| Rate limiting | | |
| Hosting | | |

**Cómo conectan las piezas:** {un párrafo: de dónde salen los datos, por dónde
pasan las escrituras, qué dispara qué.}

---

## 3. Estructura de directorios

```
{árbol completo con comentarios por carpeta}
```

---

## 4. Modelo de datos

### Entidades

**{tabla}**
| Campo | Tipo | Notas |
|-------|------|-------|
| | | |

### Relaciones
{uno-a-muchos, qué depende de qué, qué se borra en cascada}

### SQL completo

```sql
-- 0001_schema.sql
{CREATE TABLE con CHECK y UNIQUE}
```

```sql
-- 0002_rls.sql
{enable row level security en TODAS las tablas + policies explícitas}
```

```sql
-- 0003_triggers.sql
{whitelist de registro si aplica, creación automática de perfil, updated_at}
```

```sql
-- 0004_seed.sql
{catálogos fijos y configuración inicial}
```

---

## 5. Acciones y rutas

| Tipo | Nombre | Qué hace | Sesión | Rate limit |
|------|--------|----------|--------|-----------|
| Server action | | | | |
| Route | | | | |

### Detalle de las críticas
{Para las 3-5 más importantes: qué recibe, qué valida, qué responde, qué errores
puede dar y con qué mensaje al usuario.}

**Forma de respuesta:** toda acción retorna `{ ok: true, data? } | { ok: false, error }`.

---

## 6. Frontend

### Rutas
| Ruta | Pantalla | Qué ve el usuario |
|------|----------|-------------------|
| | | |

### Componentes clave
```
{árbol de las 2-3 pantallas principales}
```

### Estado
{Qué se lee en el servidor, qué necesita ser cliente, cómo viajan los filtros
(searchParams), qué se actualiza en vivo.}

---

## 7. Design system

### Colores
| Rol | Hex | Uso |
|-----|-----|-----|
| Primario | | |
| Acción | | |
| Fondo / Superficie | | |
| Texto / Secundario | | |
| Alerta / Error / Éxito | | |

### Tipografía
| Rol | Fuente | Tamaño | Peso |
|-----|--------|--------|------|

### Espaciado y forma
- Escala: {base 4px…}
- Radios: {cards / botones}
- Ancho máximo: {móvil-primero}

---

## 8. Autenticación y permisos

### Flujo de entrada
{Paso a paso desde que abre la app hasta que ve la pantalla principal.}

### Registro
{Abierto o cerrado. Si es cerrado: los correos exactos y **dónde vive la
whitelist** — debe ser un trigger en la base de datos, no código de la app.}

### Rutas protegidas
{Lista blanca de rutas públicas; todo lo demás protegido por middleware.
Aclarar que la autoridad final es la RLS.}

### Roles
| Rol | Puede |
|-----|-------|

### Sesiones
{Cookies httpOnly, refresh, cierre de sesión.}

### Datos sensibles
- **No se guarda:** {…}
- **Cifrado:** {HTTPS en tránsito, en reposo por el proveedor}
- **Nunca se expone:** {service_role, claves privadas} — dónde vive cada una
- **Logs:** sin datos personales

---

## 9. Orden de construcción

> La sección más importante. La seguridad va en los bloques 2-3.

**Bloque 1 — Scaffolding + design system**
{Comandos exactos, qué queda listo.}

**Bloque 2 — Base de datos + RLS + whitelist**
{Migraciones, verificación con el arnés.}

**Bloque 3 — Auth end-to-end**
{Login real funcionando, middleware deny-by-default.}

**Bloque 4 — App shell**

**Bloque 5 — {CRUD principal}**

**Bloque N-1 — Pulido**

**Bloque N — Deploy + checklist de seguridad**

*Cada bloque termina con: build/lint/tests en verde → commit → PR → resumen al
usuario → esperar confirmación.*

---

## 10. Entorno

### Prerrequisitos
- Node.js 20+
- Cuentas: {…}

### Variables
| Variable | Para qué | Dónde se obtiene | Dónde vive |
|----------|----------|------------------|------------|

### Comandos iniciales
```bash
{scaffolding + dependencias + tipos}
```

---

## 11. Dependencias

| Paquete | Para qué |
|---------|----------|

---

## 12. Despliegue

{Hosting, CI/CD, dominio, entornos, cómo se aplican las migraciones.}

---

## 13. Pruebas

### Unidad
{Qué lógica se prueba: dinero, fechas, cálculos, validaciones.}

### Integración / seguridad
{El arnés SQL: qué aserciones debe incluir esta app en concreto.}

### E2E
{Los flujos críticos que no pueden romperse.}

---

## 14. Skills durante la construcción

| Skill | En qué bloque | Para qué |
|-------|---------------|----------|

---

## 15. CLAUDE.md del proyecto

```markdown
# {Proyecto}

{Una línea de qué es.}

## Comandos
- `npm run dev` / `build` / `lint` / `test`

## Stack
{una línea}

## Arquitectura
### Directorios
### Flujo de datos
### Patrones clave

## Design system
{colores con hex, fuente, radios}

## Variables de entorno
| Variable | Descripción |

## Reglas no negociables
1. …
```

---

## 16. Reglas no negociables

1. La seguridad se construye en los bloques 2-3, nunca al final.
2. {Whitelist / control de acceso}: inviolable, vive en la base de datos.
3. RLS en el 100% de las tablas; `service_role` jamás en el cliente.
4. Rate limiting desde el día uno, con respuesta 429.
5. Validación con Zod en el servidor para toda entrada; la identidad viene de
   `auth.uid()`, nunca del formulario.
6. Datos sensibles: {qué no se guarda}; secretos solo en variables de servidor.
7. Integridad: {montos en centavos, qué es inmutable, qué se puede deshacer y
   hasta cuándo}.
8. Zona horaria: {…} — un solo módulo como fuente de verdad.
9. TypeScript strict, sin `any`; un componente por archivo.
10. Interfaz en español, móvil-primero, fiel al mockup.
11. Al terminar cada bloque: verificar ejecutando, commit, resumen y **esperar
    confirmación** antes de seguir.
