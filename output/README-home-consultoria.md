# Home de consultoría BIM — dgdesignmodeling.com

Nueva página de inicio para Design Modeling DG, enfocada en vender **consultoría BIM** y
**DG BIM Intelligence**, con captura de lead visible sin scroll.

Sustituye el enfoque de la home actual, donde la consultoría y la academia competían por la
atención y no existía ninguna ruta de conversión.

## Archivos

| Archivo | Qué es |
|---|---|
| `home-consultoria-bim.html` | **El entregable.** Bloque HTML autocontenido para pegar en WordPress. |
| `assets-home/` | Imágenes optimizadas para subir a la librería de medios (834 KB en total). |

Los archivos `_preview-local.html` y `_artifact-preview.html` son derivados de
`home-consultoria-bim.html` (rutas relativas y data URIs respectivamente) y no se versionan.

## Cómo montarla en WordPress

1. **Subir las imágenes** de `assets-home/` a Medios → Añadir nuevo.
2. **Reemplazar las 6 URLs de Higgsfield** en el HTML por las URLs que WordPress asigne.
   Están todas en el bloque `d8j0ntlcm91z4.cloudfront.net` — buscar y reemplazar.
   Este paso es obligatorio: los PNG originales del CDN pesan ~25 MB en total.
3. **Conectar el formulario**: borrar el `div.form-placeholder` del hero y pegar el iframe
   que está comentado justo debajo, sustituyendo `PEGAR_FORM_ID_AQUI` por el Form ID real
   de Sharp CRM.
4. Crear página nueva **"Inicio 2026"** (slug `inicio-2026`), plantilla **Elementor Canvas**
   (sin header/footer del tema), un solo widget **HTML**, y pegar todo el bloque.
5. Publicar y revisar en `/inicio-2026/`. La home actual sigue intacta.
6. Solo tras aprobación: Ajustes → Lectura → Página de inicio = "Inicio 2026".

## Sistema de diseño

Brandkit DMA, idéntico al de las landings de producto y evento:

- Fuentes: **Overpass** (títulos/UI) + **Nunito** (cuerpo), vía Google Fonts
- `--azul-principal: #003e5c` · `--naranja: #ca7520` · `--azul-navy: #001e30` · `--crema: #fafaf7`
- CSS propio con custom properties, sin Tailwind ni dependencias externas

Nota: el subset latino de **Overpass 800** no incluye el glifo `·` (U+00B7) y lo renderiza con
ancho cero. Evitar ese carácter en elementos de peso 800 — por eso el tercer stat del hero usa
`ARQ/EST/MEP` y no `ARQ·EST·MEP`.

## Estructura

Orden pensado para conversión: gancho → prueba → problema → solución → diferenciador → confianza → cierre.

1. Nav sticky con CTA permanente
2. Hero split: copy + 3 stats · formulario a la derecha
3. Marquee de avales (Autodesk + universidades)
4. **El problema** — el costo real de descubrir la interferencia en obra
5. Servicios (4 tarjetas)
6. **DG BIM Intelligence** — el diferenciador
7. Cómo trabajamos (4 pasos)
8. ¿Es para ti? — listas sí/no que califican el lead
9. Clientes y avales
10. Fundadores
11. Academia (secundaria, deriva a designmodelingacademy.com)
12. FAQ — objeciones reales de consultoría
13. CTA final
14. Footer

## Pendiente

- **Form ID de Sharp CRM** — sin esto el CTA principal no captura leads (hoy cae a WhatsApp y correo)
- **Casos de consultoría reales** — todos los testimonios existentes son de la academia, no de
  clientes de consultoría. La sección de clientes se apoya solo en logos.
- **Capturas reales del dashboard** de DG BIM Intelligence — hoy la sección usa una imagen generada
