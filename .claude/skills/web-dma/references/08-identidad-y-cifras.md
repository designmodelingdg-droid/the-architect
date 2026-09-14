# Identidad de la empresa y honestidad de las cifras

## Wikidata sí, Wikipedia no

Los escáneres de legibilidad para agentes juntan las dos en una sola
comprobación, y eso lleva a error. Son proyectos con reglas de entrada muy
distintas.

### Wikidata: se puede, y conviene

Es una base de datos estructurada, no una enciclopedia. Admite un elemento
cuando se refiere a una entidad claramente identificable que pueda describirse
con referencias públicas y serias. Una sociedad con registro fiscal, domicilio y
sitio web cumple. **No hace falta que nadie haya escrito sobre la empresa.**

Es la pieza que usan los buscadores con IA para saber que el nombre comercial y
el dominio son la misma entidad.

### Wikipedia: no conviene intentarlo

Exige **notabilidad**: cobertura significativa en varias fuentes independientes
y secundarias — prensa, libros, publicaciones académicas. No cuentan las notas
de prensa propias, las entrevistas ni el sitio de la empresa.

Y escribir sobre tu propia empresa es conflicto de interés declarable. Un
artículo así se borra por promocional, normalmente en horas, **y el borrado
queda registrado en público junto al nombre de la marca**. El camino real es el
inverso: primero existir como dato estructurado, después acumular menciones
independientes, y solo si eso llega, el artículo se sostiene solo y lo escribe
alguien de fuera.

### Las declaraciones, verificadas contra la API

Antes de rellenar nada se comprueba si ya existe el elemento:

```bash
curl -sS -A 'tu-agente/1.0' -G https://www.wikidata.org/w/api.php \
  --data-urlencode action=wbsearchentities \
  --data-urlencode "search=<nombre de la empresa>" \
  --data-urlencode language=es --data-urlencode format=json
```

La API de Wikimedia **exige un User-Agent**; sin él responde con algo que no es
JSON.

Códigos verificados (no escritos de memoria):

| Propiedad | Qué es | Valor |
|---|---|---|
| `P31` | instancia de | empresa `Q4830453`; también empresa de consultoría `Q2089936` |
| `P1448` | nombre oficial | la razón social |
| `P856` | sitio web oficial | el dominio — **la declaración que buscan los escáneres** |
| `P17` | país | Ecuador `Q736` |
| `P159` | sede | Quito `Q2900` |
| `P452` | industria | consultoría de ingeniería `Q65119680` |
| `P101` | campo de trabajo | BIM `Q842017`; ingeniería estructural `Q633538` |
| `P1454` | forma jurídica | sociedad por acciones simplificada `Q654502` |
| `P571` | fundación | el año |
| `P4264` | LinkedIn | solo el tramo final de la URL |
| `P2003` / `P2002` / `P2013` / `P7085` | Instagram / X / Facebook / TikTok | sin arroba |
| `P854` | URL de referencia | se pone al menos en el sitio web y el nombre oficial |

Otros elementos útiles: empresa de consultoría `Q2089936`, estudio de
arquitectura `Q4387609`.

### Dos decisiones que no son técnicas

**La fecha de fundación va con la precisión que se tenga.** Wikidata ofrece un
desplegable de precisión al escribir una fecha. Si el mes es aproximado se pone
**solo el año, con precisión de año**. Declarar como exacto un dato aproximado
es un error que queda público.

**El logotipo (`P154`) se omite.** Wikidata solo enlaza imágenes alojadas en
Wikimedia Commons, y subirlo ahí obliga a publicarlo **bajo licencia libre**, o
sea a autorizar que cualquiera lo reutilice. Eso va justo en contra de lo que
protege un registro de marca. El elemento funciona perfectamente sin logotipo.

### Después

Cuando exista el elemento, su código `Q…` se añade al `sameAs` del JSON-LD del
sitio. Eso cierra además la comprobación de vinculación de entidades, que pide
perfiles de autoridad.

## Las cifras dicen de quién son

La regla dura de `DESIGN.md` es «cifras solo si son reales y verificables». No
basta. Hace falta la segunda mitad:

> Cada cifra dice de quién es. Una cifra del equipo presentada como cifra de la
> empresa es una cifra falsa.

El caso real: el sitio de consultoría decía **«10+ años en proyectos BIM»** en
la cinta de datos del inicio y en la sección «Cifras» del markdown, como cifra
de la empresa. MODELING-DG S.A.S. se constituyó en **2020**: son unos cinco años
y medio. Los más de 10 años son de experiencia BIM del **equipo**.

El número era cierto. Lo falso era de quién. Se corrigió a «años de experiencia
BIM del equipo», sin bajar el número.

Curiosamente, el resto de menciones del sitio ya estaban bien: «el criterio de
+10 años de BIM Management», «10 años de criterio BIM destilado» y la bio del
director hablan de su experiencia, no de la edad de la empresa. El fallo estaba
solo donde la cifra se presentaba suelta.

### Al levantar un sitio nuevo, preguntar explícitamente

Antes de poner una sola cifra en una cinta de datos:

1. ¿Esta cifra es de la empresa o de una persona del equipo?
2. ¿De qué año es la constitución de la sociedad?
3. ¿La cifra se puede verificar si alguien la cuestiona?

Si la respuesta a la tercera es no, la cifra no va. Y en el `llms.txt` y el
markdown se escribe con la misma atribución que en el HTML, porque un agente
que lea el markdown la va a repetir.
