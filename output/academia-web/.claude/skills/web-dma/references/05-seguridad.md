# Seguridad

## Instalar el candado

El plugin oficial `security-guidance@claude-plugins-official`. **El marketplace
hay que añadirlo primero**, o el install falla con «Plugin not found in
marketplace» y no es obvio por qué:

```bash
claude plugin marketplace list                                  # → "No marketplaces configured"
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install security-guidance@claude-plugins-official --scope project -y
```

Queda en `.claude/settings.json`:

```json
{ "enabledPlugins": { "security-guidance@claude-plugins-official": true } }
```

## Las reglas del proyecto

`.claude/claude-security-guidance.md` — plantilla en
`assets/claude-security-guidance.plantilla.md`. Es lo que el plugin lee para
saber qué es normal en **este** proyecto. Sin esto reporta ruido.

Lo que tiene que declarar, como mínimo:

### Identificadores públicos que NO son secretos

La parte que más falsos positivos evita. En un sitio de marketing casi todo lo
que parece una credencial es público a propósito:

- el ID del formulario del CRM,
- el ID del widget de chat,
- los IDs de los videos de Vimeo y de Loom,
- el número de WhatsApp,
- el RUC.

Todos van en el HTML por diseño. Hay que decirlo explícitamente o el plugin los
señala como secretos filtrados.

Y la regla que sí importa: **`NEXT_PUBLIC_*` no puede contener un secreto
nunca**, porque acaba en el paquete del navegador.

### Listas de permitidos

- **Scripts externos:** `api.leadconnectorhq.com` y
  `widgets.leadconnectorhq.com`. Nada más.
- **Iframes:** `player.vimeo.com`, `www.loom.com/embed`,
  `api.leadconnectorhq.com/widget/form`.
- **Videos:** solo Vimeo.
- **`dangerouslySetInnerHTML`:** solo en `datos-estructurados.tsx`, y solo con
  JSON-LD compuesto en el servidor.

### Reglas de código

- Todo `target="_blank"` lleva `rel="noopener"`.
- El middleware **no confía en cabeceras del cliente** para decidir nada
  sensible. El `Host` sirve para distinguir staging, no para autorizar.
- Sin `fetch` a una URL que venga del cliente.
- Sin cookies ni almacenamiento local sin consentimiento.

### Datos personales (LOPDP de Ecuador y RGPD)

- Del equipo se publica **nombre, rol, foto y LinkedIn público**. Nunca correos
  personales, móviles ni números de cédula.
- Nada de precios ni condiciones comerciales del producto en el sitio público.
- El formulario lo sirve el CRM: los datos viven ahí, no en el sitio. Eso
  simplifica mucho, pero hay que decirlo en la política de privacidad.

## Los patrones propios

`.claude/security-patterns.json` — en `assets/security-patterns.json`. Nueve
patrones, y **en JSON, no en YAML**, porque así carga sin depender de PyYAML.

| Patrón | Qué caza |
|---|---|
| `script_externo_fuera_de_allowlist` | un `<script src>` a un host no permitido |
| `iframe_requisitos` | iframe sin `title` o sin `loading="lazy"` |
| `video_fuera_de_vimeo` | un video servido desde otro sitio |
| `target_blank_sin_noopener` | lo que dice |
| `dangerously_set_inner_html` | fuera del único archivo permitido |
| `next_public_secreto` | algo con pinta de credencial en una variable pública |
| `cookies_o_storage_sin_consentimiento` | |
| `fetch_con_url_del_cliente` | |
| `middleware_confia_en_host` | decisiones sensibles a partir de cabeceras |

Se comprueba que cargan con el propio `extensibility.load_for_session` del
plugin: los nueve tienen que salir válidos.

## Al empezar un sitio nuevo

1. Añadir el marketplace y el plugin con `--scope project`.
2. Copiar la plantilla de reglas y **reescribir la lista de identificadores
   públicos** con los del sitio nuevo. Si se deja la del otro sitio, el plugin
   avisa de cosas que no existen y calla sobre las que sí.
3. Copiar `security-patterns.json` y ajustar las listas de permitidos.
4. Comprobar que los patrones cargan antes de dar por hecho que protegen.
