# Sitio de Design Modeling DG

Rediseño completo de `dgdesignmodeling.com`: 8 páginas más una plantilla de artículo,
todas con el mismo sistema de diseño, enfocadas en vender **consultoría BIM** y
**DG BIM Intelligence**.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `estilos-compartidos.css` | **El sistema de diseño.** Va una sola vez en WordPress → Apariencia → Personalizar → CSS adicional. |
| `inicio.html` | Home |
| `servicios.html` | Los 4 servicios en detalle + capacidad técnica + FAQ |
| `dg-bim-intelligence.html` | Página propia del software |
| `quienes-somos.html` | Empresa, política, visión, misión, fundadores |
| `acreditaciones.html` | Autodesk y avales universitarios |
| `bolsa-de-trabajo.html` | Bolsa de trabajo para egresados |
| `contactos.html` | Datos de contacto + formulario |
| `blog.html` | Listado del blog (con el estado vacío mientras no haya artículos) |
| `blog-articulo.html` | Plantilla para cada entrada |
| `assets/` | Imágenes. Las `dm-*.jpg` hay que subirlas a WordPress; el resto ya existen en el sitio. |
| `build.py` | Genera las páginas. El nav, el footer y los bloques compartidos se definen una sola vez aquí. |
| `build_artifact.py` | Empaqueta todo en un HTML navegable para previsualizar |

Editar `build.py` y volver a ejecutarlo, **no** los `.html` sueltos: el nav y el footer
se repiten en las 9 páginas y a mano se desincronizan.

```
python3 build.py            # regenera las páginas
python3 build.py --local    # además crea _local/ para abrir en el navegador
python3 build_artifact.py   # crea el HTML único de previsualización
```

## Cómo montarlo en WordPress

**1. Los estilos, una sola vez**
Apariencia → Personalizar → CSS adicional → pegar todo `estilos-compartidos.css`.
Todas las páginas dependen de esto; sin él se ven sin formato.

**2. Las imágenes**
Subir a Medios los 9 archivos `assets/dm-*.jpg`. Si WordPress los coloca en una carpeta
de mes distinta a `2026/08`, cambiar la constante `IMG` en `build.py` y regenerar.
El resto de imágenes (logo, fotos de los fundadores, logos de clientes, avales) ya
están en el sitio y se referencian por su URL actual.

**3. Cada página**
Crear la página → plantilla **Elementor Canvas** (sin header ni footer del tema) →
un único widget **HTML** → pegar el archivo correspondiente.

Slugs que espera el menú: `/servicios/`, `/dg-bim-intelligence/`, `/quienes-somos/`,
`/acreditaciones/`, `/bolsa-de-trabajo/`, `/blog/`, `/contactos/`.

**4. El formulario**
En `inicio.html` y `contactos.html`, borrar el `div.form-placeholder` y pegar el iframe
que está comentado justo debajo, sustituyendo `PEGAR_FORM_ID_AQUI` por el Form ID de
Sharp CRM. Mientras tanto el bloque cae a WhatsApp y correo, que sí funcionan.

**5. La home, al final**
Publicar primero en un slug provisional (`/inicio-2026/`), revisar en vivo, y solo
entonces Ajustes → Lectura → Página de inicio. Reversible en un click.

## Sistema de diseño

- Fuentes: **Overpass** (títulos/UI) + **Nunito** (cuerpo)
- `--azul-principal: #003e5c` · `--naranja: #ca7520` · `--azul-navy: #001e30` · `--crema: #fafaf7`
- Todo el CSS vive bajo `.dm` para no chocar con los estilos de Elementor o del tema
- Sin Tailwind ni dependencias externas

Dos trampas encontradas, ya resueltas, que conviene no reintroducir:

- El subset latino de **Overpass 800** no incluye `·` (U+00B7): lo renderiza con ancho
  cero y el carácter desaparece. No usarlo en elementos de peso 800.
- El logo de **VYMSA** es blanco sobre transparente y desaparece sobre fondo claro.
  Su tarjeta lleva la clase `.dark`.

## Correcciones respecto al sitio actual

- El menú era **inconsistente**: 9 ítems en la home y 5 en las páginas internas. Ahora es uno solo.
- El **RUC** aparecía distinto en dos sitios: `1793148549001` en Contactos y `17931448549001`
  en el footer de la home. Se usa el de 13 dígitos, que es el formato válido en Ecuador.
- Textos del tema sin traducir en /servicios/: «Learn more» y «Skoola Faculties».
- Erratas: «conexciones», «isionamos», y «Domina las y tecnologías» (falta una palabra).
- La sección «Atención personalizada» estaba **duplicada** con el mismo texto.

## Pendiente

- **Form ID de Sharp CRM** — sin esto el formulario no captura leads
- **Casos de consultoría reales** — todos los testimonios existentes son de alumnos de la
  academia, no de clientes de consultoría. Es lo que más le falta a `/servicios/`.
- **Capturas reales del dashboard** de DG BIM Intelligence para `/dg-bim-intelligence/`
- **URLs reales de redes sociales** en el footer (hoy apuntan a la raíz de cada red)
- **Primer artículo del blog** para reemplazar el estado vacío
