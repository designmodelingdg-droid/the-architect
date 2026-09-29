# Proceso y trampas del entorno

## Verificar es ejecutar

La regla que gobierna todo lo demás: **nada se reporta como listo sin haberlo
corrido.** Y en este stack hay tres niveles, porque uno solo no alcanza:

1. `npm run lint` y `npm run build` en local. Compilar no es funcionar, pero no
   compilar es no funcionar.
2. El build de producción servido en local, y sobre él las comprobaciones
   reales: rutas, cabeceras, contraste, capturas.
3. **Producción con `curl`.** Es el único nivel que vale para cualquier cosa que
   dependa de un recurso externo.

## El navegador del sandbox no ve internet

Es la trampa que más tiempo hace perder. Cualquier iframe externo — Vimeo,
Loom, el formulario del CRM, el widget de chat — **sale en gris** en una captura
hecha desde el sandbox. No es un fallo del sitio. Ir a «arreglarlo» es perseguir
un fantasma.

Todo lo que dependa de un tercero se verifica contra producción con `curl`.

## El proxy de salida corta conexiones al azar

Las peticiones `curl` fallan de vez en cuando con `000`, timeout,
`ws_closed_mid_exchange` o `ERR_CONNECTION_RESET`. **No es el sitio.**

Cómo distinguirlo en vez de suponerlo: medir varias veces y ver si los fallos se
reparten al azar entre rutas distintas.

```bash
for u in / /consultoria /nosotros /proyectos; do
  ok=0; fail=0
  for i in 1 2 3 4 5 6; do
    c=$(curl -s -o /dev/null -w "%{http_code}" -m 25 "https://<dominio>$u")
    [ "$c" = "200" ] && ok=$((ok+1)) || fail=$((fail+1))
  done
  printf "%-16s ok=%s fallos=%s\n" "$u" "$ok" "$fail"
done
```

Repartidos → es el proxy. Concentrados en una ruta → es la ruta.

Y para confirmarlo desde otro ángulo, sin adivinar: los errores de ejecución del
proyecto en Vercel. Cero errores en 24 h con fallos de `curl` repartidos es
prueba de que el problema es local.

```
curl -sS "$HTTPS_PROXY/__agentproxy/status"   # lista los cortes recientes del relay
```

**Nunca** se desactiva la verificación TLS para saltar esto.

Consecuencia para Playwright: el navegador del sandbox no confía en la CA del
proxy y da `ERR_CERT_AUTHORITY_INVALID` contra hosts externos. Por eso
`medir-contraste.mjs` se usa contra `localhost`, que además es donde hay que
medir.

## El shell no recuerda el directorio

Cada llamada vuelve al directorio raíz. Hay que entrar al proyecto **en la misma
línea**:

```bash
cd /ruta/al/proyecto && npm run build
```

## Después de un corte de sesión, `node_modules` puede estar vacío

Síntoma: `next: not found`. Arreglo:

```bash
cd /ruta/al/proyecto && npm ci
```

## Matar y levantar el servidor

```bash
ps aux | grep next | grep -v grep | awk '{print $2}' | xargs -r kill -9
cd /ruta/al/proyecto && npm run start -- -p 3100
```

Y esperar a que responda, en vez de dormir a ciegas:

```bash
for i in $(seq 1 20); do sleep 2; curl -s -o /dev/null -m 5 http://localhost:3100/ && break; done
```

## Playwright en este entorno

- El módulo está en `/opt/node22/lib/node_modules/playwright/index.mjs`.
  `NODE_PATH` **no** funciona para imports ESM: hay que importar la ruta
  completa, o probar candidatos como hace `medir-contraste.mjs`.
- El navegador, en `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
- Siempre con `--no-sandbox`.
- No hay que ejecutar `playwright install`.
- `page.evaluate` con una **cadena** no acepta argumentos de forma fiable. Si
  hace falta pasar algo, se pasa una función de verdad.
- `page.evaluate(() => document.fonts.ready)` falla al serializar. Se usa
  `document.fonts.ready.then(() => true)`.

## Reglas de lint que muerden

Dos que aparecieron al escribir los componentes de movimiento y que conviene
conocer de antemano:

- `react-hooks/set-state-in-effect` — no se llama a un setter de estado de forma
  síncrona dentro del efecto. Se sale temprano y se resuelve en el render.
- `react-hooks/exhaustive-deps` — un cálculo dentro del componente que se usa en
  un efecto va envuelto en `useMemo`.

Y la trampa de React que no es lint: **ningún hook condicional**. El patrón
correcto está en `03-movimiento.md`.

## `AGENTS.md` lo reescribe Next

`next dev` regenera el bloque de reglas en `AGENTS.md`. Quitarlo de un diff solo
lo vuelve a crear como cambio sin commitear. Se commitea junto con el trabajo y
se deja en paz.

## Flujo de git y PR

El repo despliega `main` a producción. El trabajo va en la rama asignada, y el
ciclo es siempre el mismo:

```bash
git add -A <ruta-del-proyecto>
git commit -F - <<'MSG'
Título en una línea, en español, sin punto final

Cuerpo que explica el por qué, no el qué. El diff ya dice el qué.

Co-Authored-By: ...
Claude-Session: ...
MSG

NEW=$(git rev-parse HEAD)
git fetch origin main
git checkout -B <rama> origin/main
git cherry-pick $NEW
git push -u origin <rama> --force-with-lease
```

Después: crear el PR en borrador, quitarle el borrador, y mergear con squash
poniendo `(#N)` en el título. Y **esperar el despliegue y verificar en
producción** antes de reportar.

```bash
for i in $(seq 1 30); do
  c=$(curl -s -o /dev/null -w "%{http_code}" -m 20 https://<dominio>/<algo-nuevo>)
  [ "$c" = "200" ] && { echo "desplegado"; break; }
  sleep 15
done
```

Si el push falla con «credential service temporarily unavailable» (HTTP 503), se
reintenta con espera creciente: 2 s, 4 s, 8 s, 16 s.

## Cómo se escribe un PR aquí

El cuerpo del PR es donde queda la memoria del proyecto, así que:

- Qué cambia y **por qué**, con la medición que lo motivó.
- Qué **no** cambia y por qué se dejó así.
- Lo que se **declina** a propósito, con el motivo.
- Cómo se verificó, con los comandos y los resultados de verdad.

Un PR que solo dice «mejoras varias» obliga a repetir la investigación dentro de
seis meses.

### Dónde está la memoria de dgdesignmodeling.com

Este manual resume las decisiones; el razonamiento completo, con las mediciones
que lo motivaron, está en los PR **#33 a #46** de
`designmodelingdg-droid/the-architect`. Si algo de aquí parece arbitrario, la
respuesta está ahí antes que en volver a investigarlo:

| PR | Qué resolvió |
|---|---|
| #33, #34 | Redirecciones del WordPress y el hueco del formulario |
| #35–#38 | Imágenes reales de proyectos, escaladas, y las pantallas del producto |
| #39 | El widget de chat como botón flotante |
| #40 | Movimiento: acto fijado, titulares cinéticos, cortinas, contadores |
| #41 | Auditoría de contraste, la colisión de cascada y el `DESIGN.md` |
| #42 | Markdown negociado, `llms.txt` con cuándo usarnos, 404 útil |
| #43 | URLs `.md`, frontmatter, y el cuándo usarnos en inglés |
| #44 | Los 10+ años son del equipo, no de la empresa |
| #45 | Este skill |
| #46 | La entidad de Wikidata enlazada |

## Escribir para Dayana

- Español. Frases cortas. Sin relleno.
- Tablas para comparar; prosa para explicar.
- Cuando algo no se puede hacer, se dice y se explica por qué, y se ofrece lo
  más cercano que sí se puede.
- Las decisiones de marca son suyas. Se presentan medidas, con recomendación, y
  **no se ejecutan sin su palabra**. El naranja de marca es el ejemplo: white on
  `#ca7520` da 3,46:1 y AA pide 4,5:1; la corrección sería `#aa621b` a 4,70:1, y
  se quedó como estaba porque ella lo decidió.
- Si una corrección propia salió mal, se dice en una frase y se arregla. No se
  entierra.
