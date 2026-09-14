# Movimiento

## El principio

El scroll es la línea de tiempo. **Cuatro recursos y ninguno se repite en dos
bandas seguidas.** Y hay **un solo clímax**: todo lo demás es más discreto que
él a propósito.

En el sitio de consultoría el clímax es el acto fijado del producto en el
inicio. Si todo llama la atención, nada la llama.

## Los cuatro recursos

| Recurso | Componente | Dónde |
|---|---|---|
| Parallax de fondo | `parallax.tsx` | imágenes grandes |
| Cortina de revelado | `ParallaxImg` con `revelar` | imágenes de las familias |
| Titular palabra por palabra | `texto-cinetico.tsx` | `h1` del inicio y de los heros |
| Acto fijado | `acto-plataforma.tsx` | una sola vez, en el inicio |

Y dos apoyos que no cuentan como recurso porque son continuos, no un momento:
la deriva de color de las bandas navy (`deriva-navy.tsx`) y los contadores
(`contador.tsx`).

## Reglas técnicas

- Se animan **`transform` y `opacity`**, y `clip-path` para las cortinas.
- **Nunca** `width`, `height`, `top`, `left` ni `transition: all`.
- Nada rebota. Nada entra dando un saltito. La curva de la casa es
  `cubic-bezier(0.23, 1, 0.32, 1)`, declarada como `--ease-out-brand`.
  Para las cortinas, `[0.76, 0, 0.24, 1]`.
- Con `prefers-reduced-motion` todo se queda quieto y completo.

## El acto fijado

240vh en escritorio, `lg:sticky lg:top-0`, con barra de progreso. En móvil y
con movimiento reducido es una banda normal, no una versión degradada: se ve
completa.

### La trampa de los hooks condicionales

El primer intento tenía un `Tramo` que recibía `p: MotionValue | null` y hacía
`useTransform(p ?? useDummy(), ...)`. Eso es un hook condicional y rompe React.

La forma correcta: **el `MotionValue` se pasa siempre, y un booleano aparte
decide si se usa.**

```tsx
function Tramo({ p, activo, desde, hasta, children, className }: {
  p: MotionValue<number>; activo: boolean; desde: number; hasta: number;
  children: ReactNode; className?: string;
}) {
  const op = useTransform(p, [desde, hasta], [0, 1]);
  const y = useTransform(p, [desde, hasta], [28, 0]);
  if (!activo) return <div className={className}>{children}</div>;
  return <motion.div style={{ opacity: op, y }} className={className}>{children}</motion.div>;
}
```

Los hooks se llaman siempre; lo único condicional es qué se devuelve.

## La deriva de color

```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
const fondo = useTransform(scrollYProgress, [0, 1], ["#fafaf7", "#001e30"]);
return (
  <motion.section
    style={reducido ? { backgroundColor: "#001e30" } : { backgroundColor: fondo }}
  >
```

Dos consecuencias que hay que tener presentes:

1. La deriva **se completa cuando el borde superior de la banda pasa el 35 %**
   de la altura de la pantalla. Antes de eso el fondo es un valor intermedio.
2. Por eso **no se puede auditar contraste desde arriba de la página**. Es la
   razón de que `medir-contraste.mjs` recorra la página y haga la prueba del
   empujón. Detalle completo en `01-sistema-visual.md`.

## Los contadores

Florecen al valor real, pero no todo valor es un número. El patrón deja pasar
intacto lo que no lo es:

```ts
const PATRON = /^(\+?)(\d{1,3}(?:\.\d{3})+|\d+)([^\d/]*)$/;
```

Así `10+` y `+3.800` se animan, y `ARQ/EST/MEP` y `24/7` se muestran tal cual.

Dos detalles de lint que costaron una vuelta:

- `setActual(objetivo)` dentro del efecto para el caso de movimiento reducido
  dispara `react-hooks/set-state-in-effect`. Solución: salir temprano del
  efecto y leer en el render `formatea(reducido ? objetivo : actual)`.
- La ejecución del regex dentro del componente dispara
  `react-hooks/exhaustive-deps`. Solución: envolverla en `useMemo`.

## Videos de fondo

Política de la casa: **los videos se sirven desde Vimeo**. Nunca CloudFront, S3
ni un archivo suelto.

Silencio, bucle y por debajo siempre un póster para quien tenga el movimiento
reducido. El componente es `vimeo-fondo.tsx` y recibe `{ id, aspect, poster }`.

Aviso de verificación: **el navegador del sandbox no carga recursos externos**,
así que los iframes de Vimeo salen en gris en cualquier captura de prueba. Eso
no es un fallo del sitio. Se verifica en producción con `curl`, no con la
captura. Ver `09-proceso.md`.
