---
version: alpha
name: Design Modeling DG
description: >
  Consultoría BIM estructural y arquitectónica con software propio de IA.
  El sitio tiene que sonar a oficina de ingeniería que responde por sus
  cálculos, no a agencia de marketing.
colors:
  # Capa semántica: lo que el agente lee primero.
  primary: "{colors.navy}"
  secondary: "{colors.azul}"
  accent: "{colors.naranja}"
  # Paleta de marca.
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
  panel:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
  banda-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.blanco}"
  etiqueta-seccion:
    textColor: "{colors.naranja-texto}"
    typography: "{typography.etiqueta}"
  boton-secundario:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.azul}"
    typography: "{typography.boton}"
    rounded: "{rounded.md}"
  texto-sobre-navy:
    backgroundColor: "{colors.navy-2}"
    textColor: "{colors.azul-palido}"
    typography: "{typography.cuerpo}"
  enlace-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.naranja-claro}"
    typography: "{typography.cuerpo}"
  panel-secundario:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.tinta-suave}"
    typography: "{typography.cuerpo}"
    rounded: "{rounded.lg}"
  chip:
    backgroundColor: "{colors.azul-medio}"
    textColor: "{colors.blanco}"
    typography: "{typography.etiqueta}"
    rounded: "{rounded.full}"
  borde-panel:
    backgroundColor: "{colors.borde}"
    textColor: "{colors.tinta}"
---

# Sistema visual de dgdesignmodeling.com

Este archivo manda sobre el aspecto del sitio. Antes de tocar un color, una
tipografía o un espaciado, se lee de aquí en vez de inventarlo otra vez.

## Los tres papeles del color

El navy es el terreno serio. Bandas de navy separan los tramos del argumento
y en ellas el texto va en blanco. El crema es el terreno de lectura: párrafos
largos, listas, tablas. El naranja es señal, no decoración: marca la acción,
la etiqueta de sección y el dato que hay que ver. Si el naranja aparece en
todas partes deja de significar algo.

El azul palido no es un color de fondo. Es texto secundario sobre navy y nada
más.

## El naranja tiene dos tonos y no son intercambiables

`naranja` (#ca7520) es el color de marca. Va en fondos de botón, barras de
progreso, bordes y cualquier texto de 19 px o más en negrita. Ahí da 3,30:1
sobre crema y WCAG AA pide 3:1 para texto grande, así que pasa.

`naranja-texto` (#a25e1a) es el mismo naranja un 20 % más oscuro, y existe
por una razón medida: en texto pequeño el de marca da 3,30:1 y AA pide 4,5:1.
Este da 4,84:1 sobre crema.
Va en etiquetas de sección, enlaces, migas de pan y estados de cursor encima.
Nunca en fondos: un botón con este tono se ve apagado.

Sobre navy no se usa ninguno de los dos. Ahí va `naranja-claro` (#e8a04a),
que da 7,78:1. La clase de la etiqueta vive en `@layer components` para que esa
sustitución pueda ganarle: fuera de capa le ganaba a las utilidades y la
etiqueta salía siempre del tono claro, también sobre navy.

## Contraste medido, no supuesto

Cada par que el sitio usa de verdad, con su medición:

| Texto | Sobre | Ratio | Veredicto |
|---|---|---|---|
| tinta | crema | 12,36:1 | AA texto normal |
| tinta-suave | crema | 4,65:1 | AA texto normal |
| navy | crema | 16,35:1 | AA texto normal |
| naranja-texto | crema | 4,84:1 | AA texto normal |
| naranja | crema | 3,30:1 | solo 19 px en negrita o más |
| blanco | navy | 17,10:1 | AA texto normal |
| azul-palido | navy | 13,65:1 | AA texto normal |
| naranja-claro | navy | 7,78:1 | AA texto normal |
| blanco | azul | 11,39:1 | AA texto normal |

Un par que no esté en esta tabla se mide antes de usarlo. El `tinta-suave`
quedó en #587589 y no en #5c7a8f justamente por esto: el anterior daba 4,33:1
y se quedaba a 0,17 de pasar.

Queda un par sin resolver, y está anotado a propósito: blanco sobre el naranja
de marca da 3,46:1, y el texto de los botones va en 15 px negrita, que no
califica como texto grande. Cambiarlo implica oscurecer el color de marca a
#aa621b, y esa decisión es de la dueña de la marca, no del código.

## Tipografía

Overpass para titulares y cualquier cosa en mayúsculas: 600, 700 y 800.
Nunito para prosa: 400, 600 y 700. Dos familias y ninguna más. Nada de
monospace, ni para datos ni para etiquetas: la etiqueta de sección es Overpass
en mayúsculas con 0,16 em de espaciado entre letras.

Los titulares llevan interlineado apretado, entre 1,04 y 1,12. Los párrafos
van holgados, 1,6, y no pasan de unos 65 caracteres de ancho.

## Forma

El radio se elige por papel, no por costumbre: 8 px en botones y campos,
12 px en paneles, 16 px en figuras grandes, y redondo completo solo en fotos
de personas y avales. Un mismo radio repetido en todo aplana la jerarquía.

Los paneles se levantan con borde de un píxel y una sombra suave, nunca con
los dos a máxima intensidad. Un panel dentro de otro panel está prohibido:
si hace falta separar algo dentro de un panel, se separa con espacio o con
una línea de un píxel.

## Movimiento

El scroll es la línea de tiempo. Cuatro recursos y ninguno se repite en dos
bandas seguidas: parallax de fondo, cortina de revelado, titular que entra
palabra por palabra, y el acto fijado de la plataforma en la home.

El clímax es uno solo y es el acto fijado de DG BIM Intelligence. Todo lo
demás es más discreto que él a propósito.

Nada rebota. Nada entra dando un saltito. Se animan `transform` y `opacity`,
y `clip-path` para las cortinas; nunca `width`, `height`, `top`, `left` ni
`transition: all`. Con `prefers-reduced-motion` el sitio se queda quieto y
completo: ninguna sección depende del movimiento para poder leerse.

## Fotografía

Todas las imágenes son de proyectos propios y todas van sin texto encima.
Los logos de terceros se usan tal como los entrega su dueño; no se redibujan
ni se recolorean. Los videos de fondo se sirven desde Vimeo, en silencio y en
bucle, y por debajo siempre hay un póster para quien tenga el movimiento
reducido.

Nada de fotos de banco de imágenes, nada de personas generadas, nada de
renders que no sean de un proyecto real.

## Reglas duras

- Cifras solo si son reales y verificables. Sin número, sin contador. Y cada
  cifra dice de quién es: los más de 10 años son de experiencia BIM del equipo,
  no de la empresa, que se constituyó en 2020. Una cifra del equipo presentada
  como cifra de la empresa es una cifra falsa.
- Sin degradados decorativos. Los degradados que hay son velos de navy donde
  se apoya el texto, y existen para que se lea.
- Sin numerales de sección tipo 01 / 06 que no signifiquen nada: la
  numeración de las familias sí es una secuencia, y por eso se queda.
- Sin texto gris sobre fondo de color.
- Sin precios ni condiciones comerciales de DG BIM Intelligence en el sitio
  público.
- Sin guion largo en la prosa en inglés; en español la raya es puntuación
  normal y se usa.
