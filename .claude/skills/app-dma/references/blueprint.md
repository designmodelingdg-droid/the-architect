# Estructura del BLUEPRINT.md

Documento **autocontenido**: otra sesión de Claude sin ningún contexto previo debe
poder construir la app entera desde él. Se escribe en el idioma del usuario.

Si el repo `the-architect` está disponible, usa `templates/blueprint-template.md`.
Si no, estas son las 16 secciones:

| # | Sección | Qué debe contener |
|---|---|---|
| 1 | Visión y objetivos | Qué es, para quién, qué problema resuelve, métricas de éxito |
| 2 | Stack | Tabla capa → tecnología → **por qué** (una línea de justificación cada una) |
| 3 | Estructura de directorios | Árbol completo con comentarios |
| 4 | Modelo de datos | Entidades con campos y restricciones, relaciones y **el SQL completo** (schema + RLS + triggers + seed) |
| 5 | API / acciones | Tabla de cada server action y ruta: qué hace, si exige sesión, su rate limit. Detalle de las 3-5 críticas |
| 6 | Frontend | Rutas, jerarquía de componentes de las pantallas clave, manejo de estado |
| 7 | Design system | Colores con hex, tipografía, espaciado, radios, estilo general |
| 8 | **Autenticación y permisos** | Flujo de login, registro (abierto/cerrado), rutas protegidas, tabla de roles, sesiones, **manejo de datos sensibles** |
| 9 | **Orden de construcción** | La sección más importante: bloques numerados con su entregable. La seguridad va en los bloques 2-3 |
| 10 | Entorno | Prerrequisitos, tabla de variables de entorno (con dónde se obtiene cada una), comandos iniciales |
| 11 | Dependencias | Paquetes y para qué sirve cada uno |
| 12 | Despliegue | Hosting, CI/CD, dominios, entornos |
| 13 | Pruebas | Unidad, integración (incluido el arnés de RLS), E2E de los flujos críticos |
| 14 | Skills a usar | Qué skill ayuda en qué bloque |
| 15 | **CLAUDE.md del proyecto** | Completo, listo para pegar en la raíz del repo nuevo |
| 16 | **Reglas no negociables** | Incluye rate limiting, validación, secretos, integridad de datos, y "confirmar con el usuario al terminar cada bloque" |

## Errores a evitar

- **Placeholders sin rellenar** (`{descripción}`) — el blueprint debe estar completo.
- **Orden de construcción sin la seguridad al principio.**
- **Decisiones sin justificar**: cada elección de stack lleva su "por qué".
- **Omitir el SQL**: la sección 4 debe traer las migraciones listas para ejecutar.
