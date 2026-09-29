---
version: alpha
name: Design Modeling Academy
description: >
  Escuela online de BIM, ingeniería estructural e inteligencia artificial
  aplicada, del grupo Design Modeling. El sitio tiene que sonar a escuela
  donde enseña quien construye, no a plataforma de cursos ni a agencia.
colors:
  # Capa semántica: lo que el agente lee primero.
  primary: "{colors.navy}"
  secondary: "{colors.azul}"
  accent: "{colors.naranja}"
  # Paleta del grupo. Es la misma de dgdesignmodeling.com y de las landings
  # de venta de la academia: una sola familia visual.
  navy: "#001e30"
  navy-2: "#00263c"
  azul: "#003e5c"
  azul-medio: "#0a5a80"
  azul-palido: "#d0eaf5"
  crema: "#fafaf7"
  blanco: "#ffffff"
  naranja: "#ca7520"
  naranja-texto: "#a25e1a"
  naranja-claro: "#e8a04a"
  naranja-palido: "#f7e8cc"
  tinta: "#16344a"
  tinta-suave: "#587589"
  borde: "#dde4e6"
typography:
  h1:
    fontFamily: Overpass
    fontSize: 59px
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: -0.02em
  h2:
    fontFamily: Overpass
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.015em
  h3:
    fontFamily: Overpass
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.3
  cuerpo:
    fontFamily: Nunito
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  cuerpo-grande:
    fontFamily: Nunito
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  etiqueta:
    fontFamily: Overpass
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.16em
  boton:
    fontFamily: Overpass
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
  2xl: "96px"
components:
  boton-primario:
    backgroundColor: "{colors.naranja}"
    textColor: "{colors.blanco}"
    typography: "{typography.boton}"
    rounded: "{rounded.md}"
  boton-secundario:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.azul}"
    typography: "{typography.boton}"
    rounded: "{rounded.md}"
  tarjeta-programa:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
  chip-nivel:
    backgroundColor: "{colors.azul-medio}"
    textColor: "{colors.blanco}"
    typography: "{typography.etiqueta}"
    rounded: "{rounded.full}"
  chip-software:
    backgroundColor: "{colors.naranja-palido}"
    textColor: "{colors.naranja-texto}"
    typography: "{typography.etiqueta}"
    rounded: "{rounded.full}"
  sello-credencial:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
  ficha-docente:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
  banda-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.blanco}"
  texto-sobre-navy:
    backgroundColor: "{colors.navy-2}"
    textColor: "{colors.azul-palido}"
    typography: "{typography.cuerpo}"
  etiqueta-seccion:
    textColor: "{colors.naranja-texto}"
    typography: "{typography.etiqueta}"
  enlace-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.naranja-claro}"
    typography: "{typography.cuerpo}"
  texto-secundario:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.tinta-suave}"
    typography: "{typography.cuerpo}"
  borde-panel:
    backgroundColor: "{colors.borde}"
    textColor: "{colors.tinta}"
  chip-navy-2:
    backgroundColor: "{colors.navy-2}"
    textColor: "{colors.azul-palido}"
    typography: "{typography.etiqueta}"
    rounded: "{rounded.full}"
---

# Sistema visual de designmodelingacademy.com

Este archivo manda sobre el aspecto del sitio. Antes de tocar un color, una
tipografía o un espaciado, se lee de aquí en vez de inventarlo otra vez.

La academia y la consultoría son un mismo grupo y comparten sistema: los
tokens de arriba son los de dgdesignmodeling.com, con el contraste ya medido.
Lo que cambia aquí es el carácter, no la paleta. Hubo otras dos paletas en
circulación —el cobre `#c8721e` con Inter de un brief, y el coral `#ff614f`
del tema del LMS— y se descartaron a propósito el 29/09/2026.

## Qué tiene que sentir quien llega

Que esto es una escuela, y que enseña quien construye. Las tres cosas que lo
dicen sin decirlo:

1. **Los niveles existen.** Máster, diplomado, especialización, curso, ruta:
   cada uno es una cosa distinta, con sus horas y su credencial, y el sitio los
   explica antes de vender ninguno. Tarjetas sueltas sin jerarquía es lo que
   hace que una escuela parezca una tienda.
2. **Los docentes tienen cara y oficio.** Nombre, titulación y lo que hacen
   fuera de la escuela. El director de la academia dirige además la consultoría
   que calcula estructuras reales, y eso se enlaza, no se afirma.
3. **La credencial es una sección, no un pie de página.** Las ocho vías de
   certificación, con el logo tal como lo entrega cada emisor y el registro
   oficial cuando lo hay. Para un ingeniero de Ecuador o Colombia, el registro
   SENESCYT del título es la decisión de compra.

## Los tres papeles del color

El navy es el terreno serio: bandas que separan los tramos del argumento, con
el texto en blanco. El crema es el terreno de lectura: catálogo, fichas,
temarios. El naranja es señal, no decoración: la acción, la etiqueta de sección
y el dato que hay que ver. Si el naranja aparece en todas partes deja de
significar algo.

El azul pálido no es un color de fondo. Es texto secundario sobre navy y nada
más. El naranja pálido `#f7e8cc` es fondo de chip y de aviso suave, y nada más.

## El naranja tiene dos tonos y no son intercambiables

`naranja` (#ca7520) es el color de marca. Va en fondos de botón, barras de
progreso, bordes y cualquier texto de 19 px o más en negrita. Ahí da 3,30:1
sobre crema y WCAG AA pide 3:1 para texto grande, así que pasa.

`naranja-texto` (#a25e1a) es el mismo naranja un 20 % más oscuro y existe por
una razón medida: en texto pequeño el de marca da 3,30:1 y AA pide 4,5:1. Este
da 4,84:1 sobre crema. Va en etiquetas de sección, enlaces, migas, chips de
software y estados de cursor encima. Nunca en fondos.

Sobre navy no se usa ninguno de los dos. Ahí va `naranja-claro` (#e8a04a), que
da 7,78:1. La clase de la etiqueta vive en `@layer components` para que esa
sustitución pueda ganarle.

## Contraste medido, no supuesto

| Texto | Sobre | Ratio | Veredicto |
|---|---|---|---|
| tinta | crema | 12,36:1 | AA texto normal |
| tinta-suave | crema | 4,65:1 | AA texto normal |
| navy | crema | 16,35:1 | AA texto normal |
| naranja-texto | crema | 4,84:1 | AA texto normal |
| naranja-texto | naranja-palido | 4,47:1 | solo etiqueta en negrita de 12 px con 0,16 em; se mide en el build |
| naranja | crema | 3,30:1 | solo 19 px en negrita o más |
| blanco | navy | 17,10:1 | AA texto normal |
| azul-palido | navy | 13,65:1 | AA texto normal |
| naranja-claro | navy | 7,78:1 | AA texto normal |
| blanco | azul-medio | 6,42:1 | AA texto normal |

Un par que no esté en esta tabla se mide antes de usarlo, con
`medir-contraste.mjs` sobre el build de producción.

Queda un par sin resolver, heredado y decidido: blanco sobre el naranja de
marca da 3,46:1 en los botones de 13–15 px. La dueña de la marca decidió
dejarlo. Se respeta.

## Tipografía

Overpass para titulares y cualquier cosa en mayúsculas: 600, 700 y 800.
Nunito para prosa: 400, 600 y 700. Dos familias y ninguna más. Nada de
monospace. Nada de Inter.

Titulares con interlineado apretado, entre 1,04 y 1,12. Párrafos holgados, 1,6,
y sin pasar de unos 65 caracteres de ancho. Los temarios son listas largas: se
leen a 16 px con 1,6, con el número de módulo en Overpass y el título del
módulo en negrita, nunca todo en mayúsculas.

## Forma

El radio se elige por papel: 8 px en botones y campos, 12 px en tarjetas de
programa y fichas de docente, 16 px en sellos de credencial y figuras grandes,
y redondo completo solo en chips, fotos de personas y logos de avales.

Los paneles se levantan con borde de un píxel y una sombra suave, nunca con
los dos a máxima intensidad. Un panel dentro de otro panel está prohibido.

La tarjeta de programa es un objeto compuesto y todas son iguales: chip de
nivel arriba a la izquierda, imagen 414 × 237, título, docente, horas y
próximo inicio en una línea, credencial principal, precio a la derecha. Un
elemento que se repite va en el mismo sitio en cada tarjeta.

## Movimiento

Los mismos cuatro recursos que en la consultoría, y un solo clímax: la sección
**Elige tu nivel** del inicio, fijada, donde el scroll despliega los cinco
niveles uno a uno. Todo lo demás es más discreto que ella a propósito.

Nada rebota. Se animan `transform`, `opacity` y `clip-path`; nunca `width`,
`height`, `top`, `left` ni `transition: all`. Con `prefers-reduced-motion` el
sitio se queda quieto y completo.

## Fotografía

Personas y aulas antes que modelos: docentes con su foto real, alumnos en
clase en vivo si hay permiso, capturas reales del software con proyectos
reales. Sin texto encima de las imágenes.

Los logos de emisores de credenciales y de avales se usan tal como los entrega
su dueño. No se redibujan ni se recolorean, y si falta el archivo se pide, no
se reconstruye.

Nada de banco de imágenes, nada de personas generadas, nada de renders que no
sean de un proyecto o de un alumno real.

## Reglas duras

- Cifras solo si son reales y verificables, y cada cifra dice de quién es. Los
  5.000+ alumnos de 30 países son de la academia; la fuente va en el campo
  `fuente` del contenido.
- Un testimonio entra solo con resultado concreto y con el cargo y el país
  verificados contra la reseña original. «Excelente experiencia» no entra.
- Los precios son públicos salvo en el Máster, que vende por cita: decisión del
  29/09/2026.
- La suscripción dice qué excluye, siempre.
- Sin degradados decorativos. Sin numerales de sección que no signifiquen nada:
  los cinco niveles y los módulos de un temario sí son una secuencia.
- Sin texto gris sobre fondo de color.
- Sin coral `#ff614f`, sin Inter, sin Space Grotesk.
- Sin guion largo en la prosa en inglés; en español la raya es puntuación
  normal y se usa.
