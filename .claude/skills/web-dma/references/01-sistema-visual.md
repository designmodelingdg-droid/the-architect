# Sistema visual

## Primero: el sistema se escribe, no se improvisa

Antes de maquetar nada existe un `DESIGN.md` en la raíz del proyecto. Manda
sobre el aspecto del sitio: antes de tocar un color, una tipografía o un
espaciado se lee de ahí en vez de inventarlo otra vez.

El formato es el de Google Labs `design.md`, y se valida:

```bash
npx @google/design.md lint
```

Trae front matter con `version`, `name`, `description`, `colors`, `typography`,
`rounded`, `spacing` y `components`; y debajo, en prosa, las reglas que un
token no puede expresar. En `assets/DESIGN.ejemplo.md` está el del sitio de
consultoría, completo, como referencia de profundidad.

Sub-tokens válidos en `components`: solo `backgroundColor`, `textColor`,
`typography` y `rounded`. Otros los marca el linter.

## Los tres papeles del color

Un sitio DMA tiene tres terrenos, no una paleta suelta:

| Papel | En el sitio de consultoría | Qué hace |
|---|---|---|
| Terreno serio | navy `#001e30` | separa tramos del argumento; el texto va en blanco |
| Terreno de lectura | crema `#fafaf7` | párrafos largos, listas, tablas |
| Señal | naranja `#ca7520` | la acción, la etiqueta de sección, el dato que hay que ver |

La regla dura: **la señal no decora**. Si el color de acento aparece en todas
partes deja de significar algo.

Y un color de apoyo no es un color de fondo. El azul pálido `#d0eaf5` es texto
secundario sobre navy y nada más.

## El acento necesita dos tonos y no son intercambiables

Esta es la lección que más tiempo costó y la que se repite en cualquier sitio
nuevo. Un naranja de marca vivo casi nunca pasa AA en texto pequeño:

- `#ca7520` sobre crema da **3,30:1**. AA pide 4,5:1 en texto normal y 3:1 en
  texto grande. Así que sirve en fondos de botón, barras, bordes y texto de
  19 px o más en negrita — y no sirve en una etiqueta de 12 px.
- Por eso existe `naranja-texto` `#a25e1a`, el mismo naranja un 20 % más
  oscuro, que da **4,84:1**. Va en etiquetas de sección, enlaces, migas y
  estados de cursor encima. **Nunca en fondos**: un botón con ese tono se ve
  apagado.
- Sobre navy no se usa ninguno de los dos: ahí va `naranja-claro` `#e8a04a`,
  que da 7,78:1.

Al derivar la paleta de un sitio nuevo, se decide esto **antes** de maquetar, no
después. Si se deja para el final hay que tocar decenas de archivos: en el sitio
de consultoría fueron 38 sustituciones.

## Contraste medido, no supuesto

`assets/medir-contraste.mjs` mide el sitio entero. Se usa contra el build de
producción servido en local, antes de publicar:

```bash
npm run build && npm run start -- -p 3100
node .claude/skills/web-dma/assets/medir-contraste.mjs \
  http://localhost:3100 / /consultoria /nosotros /proyectos /contactos
```

Devuelve 0 si no hay fallos y 1 si hay, agrupados por par de colores. En el
sitio de consultoría: 982 nodos medidos, un único par en rojo.

Lo que resuelve, y que ninguna extensión de navegador resuelve:

1. **Tailwind 4 devuelve los colores en `oklab(...)`.** Un medidor que lee la
   cadena como rgb mide cualquier cosa. El script convierte oklab y oklch a
   sRGB de verdad.
2. **Un color con alfa no es el color que se ve.** `text-white/70` sobre navy
   hay que componerlo. Y una tarjeta con `bg-navy/90` sobre blanco compone
   *hacia arriba* por capas: sin eso, su texto blanco aparece como 1,00:1.
3. **El texto decorativo con `-webkit-text-stroke` no tiene color de relleno.**
   Se excluye en vez de reportarlo.
4. **No se puede medir la página desde arriba.** Ver más abajo.

### Por qué hay que hacer scroll para medir

Las bandas navy derivan su color de fondo mientras entran en pantalla, y los
bloques entran desde opacidad 0. Una banda que todavía no entró está pintada en
crema: su texto blanco mide 1,05:1 y aparece como un fallo gravísimo que no
existe, porque cuando el lector llega la banda ya es navy.

Emular `prefers-reduced-motion` **no** lo asienta: el valor va ligado a la
posición de scroll, no al tiempo, y además hasta que React no hidrata el
componente sigue en su estado inicial.

Lo que sí funciona, y es lo que hace el script:

- Recorre la página parando en cada nodo pendiente, y lo sitúa en el **primer
  cuarto** de la pantalla, no en el centro. La deriva se completa cuando el
  borde superior de la banda pasa el 35 % de la altura; un nodo en la parte
  alta de una banda, centrado al 50 %, deja la banda a medio derivar.
- **Prueba del empujón:** relee los fondos 70 px más abajo y descarta el nodo
  cuyo fondo haya cambiado. Es lo que distingue un fondo asentado de uno en
  transición, y lo que permite medir con confianza las barras fijas y los
  bloques más altos que la pantalla.
- Lo descartado se declara en el informe. No se esconde.

## La trampa de las capas de CSS

Un fallo real que estuvo meses escondido en el sitio de consultoría: la clase
`.tag-tech` estaba definida **fuera de toda capa**.

Una regla sin capa le gana a *todas* las utilidades de Tailwind, porque las
utilidades viven en `@layer utilities` y lo no estratificado tiene prioridad
sobre cualquier capa. Consecuencia: el `dark` de `SectionHead` nunca pudo pintar
la etiqueta en naranja claro sobre navy. La etiqueta salía siempre del mismo
tono, y nadie lo notó porque el síntoma era sutil.

La regla: **toda clase propia va dentro de `@layer components`.**

```css
@layer components {
  .tag-tech {
    font-family: var(--font-overpass), sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-naranja-texto);
  }
}
```

Si una utilidad de Tailwind no surte efecto sobre un elemento con clase propia,
esto es lo primero que hay que mirar.

## Tipografía

Dos familias y ninguna más. En el sitio de consultoría: Overpass para titulares
y mayúsculas (600, 700, 800) y Nunito para prosa (400, 600, 700). Se cargan con
`next/font/google`, solo los pesos que se usan.

- Nada de monospace, ni para datos ni para etiquetas. La etiqueta de sección es
  la familia de titulares en mayúsculas con 0,16 em de espaciado.
- Titulares con interlineado apretado, entre 1,04 y 1,12.
- Párrafos holgados, 1,6, y sin pasar de unos 65 caracteres de ancho.
- Escala declarada en `DESIGN.md` y respetada. Sin tamaños inventados sobre la
  marcha.

## Forma

El radio se elige por papel, no por costumbre: 8 px en botones y campos, 12 px
en paneles, 16 px en figuras grandes, y redondo completo solo en fotos de
personas y avales. Un mismo radio repetido en todo aplana la jerarquía.

Los paneles se levantan con borde de un píxel y una sombra suave, nunca con los
dos a máxima intensidad. **Un panel dentro de otro panel está prohibido**: si
hace falta separar algo dentro de un panel, se separa con espacio o con una
línea de un píxel.

## Fotografía

- Todas las imágenes son de proyectos propios, y todas van sin texto encima.
- Los logos de terceros se usan tal como los entrega su dueño. **No se
  redibujan ni se recolorean.** Si hace falta el logo de un aval, se pide el
  archivo; no se reconstruye.
- Nada de banco de imágenes, nada de personas generadas, nada de renders que no
  sean de un proyecto real.
- Las imágenes de especialidad salen de recortes de proyectos reales, escalados
  con IA a 2K y entregados a 1600 px de ancho. En Higgsfield el plan libre
  permite **un solo trabajo a la vez**: hay que encadenar los escalados con
  `jobs_wait`, no lanzarlos en paralelo.

## Reglas duras que se heredan

- Cifras solo si son reales y verificables. Sin número, sin contador. Y cada
  cifra dice de quién es (ver `08-identidad-y-cifras.md`).
- Sin degradados decorativos. Los que hay son velos donde se apoya el texto, y
  existen para que se lea.
- Sin numerales de sección tipo 01 / 06 que no signifiquen nada. Si la
  numeración es una secuencia de verdad, se queda.
- Sin texto gris sobre fondo de color.
- Sin guion largo en la prosa en inglés. En español la raya es puntuación
  normal y se usa.
