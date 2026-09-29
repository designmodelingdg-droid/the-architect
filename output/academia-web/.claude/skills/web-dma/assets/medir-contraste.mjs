/**
 * Medidor de contraste WCAG. Se mide contra el build de producción servido en
 * local, antes de publicar:
 *
 *   npm run build && npm run start -- -p 3100
 *   node medir-contraste.mjs http://localhost:3100 / /consultoria /nosotros
 *
 * Contra un host remoto también funciona, pero en el entorno remoto de Claude
 * el navegador no confía en la CA del proxy de salida y devuelve
 * ERR_CERT_AUTHORITY_INVALID. No se desactiva la verificación TLS para
 * saltarlo: se mide en local, que además es donde hay que medir.
 *
 * Por qué existe: las extensiones de navegador y los auditores genéricos
 * producen falsos positivos en este stack por tres razones, y las tres están
 * resueltas aquí.
 *
 *   1. Tailwind 4 devuelve los colores calculados en `oklab(...)`, no en rgb.
 *      Un medidor que lee la cadena como rgb mide cualquier cosa. Aquí se
 *      convierte oklab -> sRGB de verdad.
 *   2. Un color con alfa no es el color que se ve. Hay que componerlo contra
 *      el primer ancestro con fondo opaco. Aquí se compone hacia arriba.
 *   3. El texto decorativo con `color: transparent` y `-webkit-text-stroke`
 *      (los numerales de sección) no tiene color que medir. Se excluye.
 *
 * Requisitos: playwright disponible. En el entorno remoto está en
 * /opt/node22/lib/node_modules/playwright y el navegador en /opt/pw-browsers.
 */

const [base, ...rutasArg] = process.argv.slice(2);
if (!base) {
  console.error("uso: node medir-contraste.mjs <base-url> [ruta...]");
  process.exit(1);
}
const rutas = rutasArg.length ? rutasArg : ["/"];

/*
 * playwright puede estar instalado en el proyecto, global, o en la ruta del
 * entorno remoto. Se prueban en orden en vez de asumir una.
 */
async function cargaChromium() {
  const candidatos = [
    "playwright",
    "playwright-core",
    "/opt/node22/lib/node_modules/playwright/index.mjs",
    "/usr/lib/node_modules/playwright/index.mjs",
  ];
  for (const c of candidatos) {
    try {
      const m = await import(c);
      if (m.chromium) return m.chromium;
    } catch {
      /* siguiente candidato */
    }
  }
  console.error(
    "No se encontró playwright. Instálalo con `npm i -D playwright` " +
      "y `npx playwright install chromium`.",
  );
  process.exit(1);
}
const chromium = await cargaChromium();

/*
 * El ejecutable del navegador: en el entorno remoto viene preinstalado y
 * playwright no siempre lo localiza solo.
 */
const { existsSync } = await import("node:fs");
const EJECUTABLES = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/opt/pw-browsers/chromium/chrome-linux/chrome",
];
const ejecutable = EJECUTABLES.find((r) => existsSync(r));

/* ---------- color ---------- */

/** oklab -> sRGB lineal -> sRGB, según la especificación de CSS Color 4. */
function oklabARgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const lin = [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((v) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.abs(v) ** (1 / 2.4) - 0.055;
    return Math.min(255, Math.max(0, Math.round(c * 255)));
  });
}

/** Devuelve [r,g,b,a] de cualquier color calculado que devuelva el navegador. */
function parsea(css) {
  if (!css) return null;
  const s = css.trim().toLowerCase();
  if (s === "transparent") return [0, 0, 0, 0];

  let m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
  }

  m = s.match(/^(oklab|oklch)\(([^)]+)\)$/);
  if (m) {
    const bruto = m[2].split("/");
    const p = bruto[0].trim().split(/\s+/);
    const alfa = bruto[1] === undefined ? 1 : num(bruto[1], 1);
    const L = num(p[0], 1);
    if (m[1] === "oklab") return [...oklabARgb(L, num(p[1], 1), num(p[2], 1)), alfa];
    const C = num(p[1], 1);
    const h = (num(p[2], 1) * Math.PI) / 180;
    return [...oklabARgb(L, C * Math.cos(h), C * Math.sin(h)), alfa];
  }

  m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  return null;
}

/** Un número CSS que puede venir en porcentaje. */
function num(t, escala) {
  const v = String(t).trim();
  return v.endsWith("%") ? (parseFloat(v) / 100) * escala : parseFloat(v);
}

/** Compone src (con alfa) sobre dst (opaco). */
function compone(src, dst) {
  const a = src[3];
  return [0, 1, 2].map((i) => Math.round(src[i] * a + dst[i] * (1 - a)));
}

function luminancia([r, g, b]) {
  const c = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function ratio(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}


/* ---------- recolección, por tramos de scroll ---------- */

/*
 * Aquí está la lección que costó encontrar. No se puede medir la página
 * entera desde arriba.
 *
 * En este stack las bandas navy derivan su color de fondo mientras entran en
 * pantalla, y los bloques entran con una animación desde opacidad 0. Una
 * banda que todavía no ha entrado está pintada en crema, así que su texto
 * blanco mide 1,05:1 y aparece como un fallo gravísimo que no existe: cuando
 * el lector llega, la banda ya es navy y el texto se lee perfecto.
 *
 * Emular `prefers-reduced-motion` no basta para asentarlo. La única forma
 * correcta es recorrer la página por tramos, y medir cada nodo cuando está de
 * verdad en pantalla. Eso es lo que hace esto.
 */

/** Marca los nodos con texto propio y devuelve cuántos hay. */
function MARCAR() {
  let n = 0;
  for (const el of document.querySelectorAll('body *')) {
    const propio = [...el.childNodes]
      .filter((x) => x.nodeType === 3)
      .map((x) => x.textContent.trim())
      .join(' ')
      .trim();
    if (!propio) continue;
    el.setAttribute('data-mc', String(n++));
  }
  return n;
}

/** Mide los nodos marcados que están en pantalla y aún no se han medido. */
function MEDIR_VISIBLES(laxo) {
  const out = [];
  const alto = window.innerHeight;
  const alFinal =
    window.scrollY + alto >= document.documentElement.scrollHeight - 2;
  for (const el of document.querySelectorAll('[data-mc]:not([data-mc-hecho])')) {
    const caja = el.getBoundingClientRect();
    /*
     * Franja central. La deriva del fondo y la entrada del bloque van ligadas
     * a la posición de scroll, no al tiempo: esperar no las asienta. Un nodo
     * medido en el primer tercio ya pasó por las dos.
     *
     * `laxo` levanta la restricción para lo que nunca puede entrar en la
     * franja — barras fijas, bloques más altos que la pantalla. Ahí la que
     * decide es la prueba del empujón.
     */
    if (!laxo && !alFinal) {
      const centro = caja.top + caja.height / 2;
      if (centro < alto * 0.1 || centro > alto * 0.62) continue;
    }
    if ((laxo || alFinal) && (caja.bottom < 10 || caja.top > alto - 10)) continue;
    if (caja.width < 2 || caja.height < 2) continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    // Todavía entrando: se deja para una parada posterior.
    if (parseFloat(cs.opacity) < 0.95) continue;
    // Texto decorativo sin color de relleno: contorno tipográfico.
    if (cs.webkitTextStrokeWidth && cs.webkitTextStrokeWidth !== '0px') continue;

    el.setAttribute('data-mc-hecho', '1');

    const texto = [...el.childNodes]
      .filter((x) => x.nodeType === 3)
      .map((x) => x.textContent.trim())
      .join(' ')
      .trim();
    if (!texto) continue;

    const fondos = [];
    for (let q = el; q && q !== document.documentElement; q = q.parentElement) {
      const qcs = getComputedStyle(q);
      fondos.push(qcs.backgroundColor);
      if (qcs.backgroundImage && qcs.backgroundImage !== 'none') { fondos.push('IMAGEN'); break; }
    }
    fondos.push(getComputedStyle(document.documentElement).backgroundColor, 'rgb(255,255,255)');

    out.push({
      idx: el.getAttribute('data-mc'),
      etiqueta: el.tagName.toLowerCase(),
      clases: typeof el.className === 'string' ? el.className.slice(0, 90) : '',
      texto: texto.slice(0, 60),
      color: cs.color,
      fondos,
      px: parseFloat(cs.fontSize),
      peso: parseInt(cs.fontWeight, 10) || 400,
    });
  }
  return out;
}


/*
 * Prueba de asentamiento. La deriva del fondo va ligada a la posición de
 * scroll, no al tiempo, así que esperar no la asienta: lo que la delata es
 * moverse un poco. Se releen los fondos 70 px más abajo y se descarta el nodo
 * cuyo fondo haya cambiado, porque se midió a media transición y reportarlo
 * sería un falso positivo.
 */
function RELEER(indices) {
  const out = {};
  for (const i of indices) {
    const el = document.querySelector('[data-mc="' + i + '"]');
    if (!el) continue;
    const fondos = [];
    for (let q = el; q && q !== document.documentElement; q = q.parentElement) {
      const qcs = getComputedStyle(q);
      fondos.push(qcs.backgroundColor);
      if (qcs.backgroundImage && qcs.backgroundImage !== 'none') { fondos.push('IMAGEN'); break; }
    }
    fondos.push(getComputedStyle(document.documentElement).backgroundColor, 'rgb(255,255,255)');
    out[i] = fondos;
  }
  return out;
}

/* ---------- ejecución ---------- */

/** WCAG AA: 3:1 si el texto es grande (>=24px, o >=18.66px en negrita), si no 4.5:1. */
function exigido(px, peso) {
  const grande = px >= 24 || (px >= 18.66 && peso >= 700);
  return { minimo: grande ? 3 : 4.5, grande };
}

/*
 * Fondo efectivo de una cadena de capas. La lista viene del nodo hacia arriba,
 * así que se recogen las capas hasta la primera opaca y se componen desde ella
 * hacia abajo. Sin esto, una tarjeta con `bg-navy/90` sobre blanco se mide
 * como blanco y su texto blanco aparece como un fallo de 1,00:1 que no existe.
 */
function fondoEfectivo(fondos) {
  const capas = [];
  let base = null;
  for (const f of fondos) {
    if (f === "IMAGEN") return null; // sobre imagen o video no se puede medir
    const c = parsea(f);
    if (!c || c[3] === 0) continue;
    if (c[3] === 1) { base = [c[0], c[1], c[2]]; break; }
    capas.push(c);
  }
  if (!base) return null;
  // De la capa más cercana a la base hacia la más cercana al texto.
  for (let i = capas.length - 1; i >= 0; i--) base = compone(capas[i], base);
  return base;
}

/** Resuelve el color efectivo del texto sobre su fondo real, o null. */
function resuelve(n) {
  const color = parsea(n.color);
  if (!color || color[3] === 0) return null;
  const fondo = fondoEfectivo(n.fondos);
  if (!fondo) return null;
  const efectivo = color[3] < 1 ? compone(color, fondo) : [color[0], color[1], color[2]];
  return { efectivo, fondo, ratio: ratio(efectivo, fondo) };
}

const navegador = await chromium.launch({
  args: ["--no-sandbox"],
  ...(ejecutable ? { executablePath: ejecutable } : {}),
});

const fallos = [];
let medidos = 0;
let inestables = 0;

for (const ruta of rutas) {
  const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
  const url = base.replace(/\/$/, "") + ruta;
  try {
    await pagina.goto(url, { waitUntil: "load", timeout: 60000 });
  } catch (e) {
    console.error(`  no se pudo abrir ${url}: ${e.message}`);
    await pagina.close();
    continue;
  }
  // Las fuentes cambian el tamaño calculado; sin esperarlas se mide otra cosa.
  await pagina.evaluate(() => document.fonts.ready.then(() => true)).catch(() => {});
  await pagina.waitForTimeout(600);

  const total = await pagina.evaluate(MARCAR);

  /*
   * Se avanza centrando el siguiente nodo sin medir, y en cada parada se mide
   * todo lo que haya quedado en la franja central. Así ningún nodo se mide a
   * medio entrar, y no hace falta una parada por nodo.
   */
  for (let vuelta = 0; vuelta < total + 20; vuelta++) {
    const quedan = await pagina.evaluate(() => {
      const el = document.querySelector("[data-mc]:not([data-mc-hecho])");
      if (!el) return null;
      const caja = el.getBoundingClientRect();
      /*
       * Se sitúa el nodo en el primer cuarto de la pantalla, no en el centro.
       * La deriva de una banda se completa cuando su borde superior pasa el
       * 35% de la altura: un nodo en la parte alta de la banda, centrado al
       * 50%, deja la banda a medio derivar. Al 25% ya no.
       */
      const y = window.scrollY + caja.top + caja.height / 2 - window.innerHeight * 0.25;
      window.scrollTo(0, Math.max(0, y));
      return true;
    });
    if (!quedan) break;

    await pagina.waitForTimeout(450);
    let lote = await pagina.evaluate(MEDIR_VISIBLES, false);
    /*
     * Si nada cayó en la franja, el nodo que motivó la parada no puede entrar
     * en ella. Se mide donde está: el empujón de más abajo es lo que descarta
     * un fondo en transición; la franja solo era el camino corto.
     */
    if (!lote.length) lote = await pagina.evaluate(MEDIR_VISIBLES, true);

    // Relectura 70 px más abajo para descartar fondos a media transición.
    let relectura = {};
    if (lote.length) {
      const antes = await pagina.evaluate(() => window.scrollY);
      await pagina.evaluate((v) => window.scrollTo(0, v), antes + 70);
      await pagina.waitForTimeout(220);
      relectura = await pagina.evaluate(RELEER, lote.map((n) => n.idx));
      await pagina.evaluate((v) => window.scrollTo(0, v), antes);
    }

    for (const n of lote) {
      const r = resuelve(n);
      if (!r) continue;
      const otra = relectura[n.idx] ? fondoEfectivo(relectura[n.idx]) : null;
      if (!otra || otra.join() !== r.fondo.join()) { inestables++; continue; }
      medidos++;
      const { minimo, grande } = exigido(n.px, n.peso);
      if (r.ratio + 0.005 < minimo) fallos.push({ ruta, ...n, ...r, minimo, grande });
    }

    // Ni con la pasada laxa: se marca para no dar vueltas sobre él.
    if (!lote.length) {
      await pagina.evaluate(() => {
        const el = document.querySelector("[data-mc]:not([data-mc-hecho])");
        if (el) el.setAttribute("data-mc-hecho", "fuera");
      });
    }
  }

  const fuera = await pagina.evaluate(
    () => document.querySelectorAll('[data-mc-hecho="fuera"]').length,
  );
  console.log(`  ${ruta}: ${total} nodo(s) con texto, ${fuera} no medible(s)`);
  await pagina.close();
}

await navegador.close();

/* ---------- informe ---------- */

const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");

console.log(
  `\nMedidos ${medidos} nodos de texto en ${rutas.length} ruta(s).` +
    (inestables ? ` ${inestables} descartado(s) por fondo en transición.` : ""),
);
if (!fallos.length) {
  console.log("Sin fallos de contraste AA.\n");
  process.exit(0);
}

// Agrupados por par de colores: un mismo par suele fallar en muchos nodos.
const grupos = new Map();
for (const f of fallos) {
  const k = `${hex(f.efectivo)}|${hex(f.fondo)}|${f.minimo}`;
  if (!grupos.has(k)) grupos.set(k, []);
  grupos.get(k).push(f);
}

console.log(`${fallos.length} nodo(s) por debajo de AA, en ${grupos.size} par(es) de color:\n`);
for (const [, g] of [...grupos].sort((a, b) => b[1].length - a[1].length)) {
  const f = g[0];
  console.log(`  ${hex(f.efectivo)} sobre ${hex(f.fondo)} — ${f.ratio.toFixed(2)}:1, exige ${f.minimo}:1`);
  console.log(`    ${g.length} nodo(s) · ${f.px}px peso ${f.peso}${f.grande ? " (texto grande)" : ""}`);
  console.log(`    ej. <${f.etiqueta} class="${f.clases}">${f.texto}`);
  console.log(`    en ${[...new Set(g.map((x) => x.ruta))].join(", ")}\n`);
}
process.exit(1);
