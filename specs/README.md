# specs/

Especificaciones del ciclo auto-correctivo **`/spec` → `/build` → `/review`**.

## Archivos por función

Cada función construida con el ciclo genera hasta tres archivos, todos con el
mismo slug:

| Archivo | Lo escribe | Qué contiene |
|---|---|---|
| `<slug>.md` | `/spec` | El contrato: objetivo, requisitos `R*`, restricciones, casos extremos `E*`, fuera de alcance y definición de "terminado" |
| `<slug>.build.md` | `/build` | Qué requisito quedó cubierto en qué archivo/línea, la verificación ejecutada y las desviaciones |
| `<slug>.review.md` | `/review` | Veredicto por requisito, brechas con corrección concreta, e iteración |

El único archivo que edita una persona es `<slug>.md`. Los otros dos son
subproductos del bucle y se sobrescriben en cada vuelta.

## Cómo se usa

1. `/spec` — te entrevista una pregunta a la vez y escribe `<slug>.md`.
2. Pégale al terminar:

   > Bucle /build y /review: construye a partir de la especificación, revisa la
   > construcción contra la especificación, corrige lo que falle. Continúa por tu
   > cuenta hasta que se apruebe.

3. El bucle se detiene solo al aprobar, o a las **5 iteraciones** si no converge
   (ahí casi siempre el problema es una spec ambigua — vuelve a `/spec`).

> **Ojo con el nombre:** el `/review` de este repo compara contra la spec. Existe
> además un `/review` incorporado en Claude Code que revisa Pull Requests de
> GitHub. Si alguna vez arranca el equivocado, di "usa el skill review del
> proyecto" o invócalo por ruta.
