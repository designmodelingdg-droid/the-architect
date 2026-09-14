import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
 * Dos cosas, y ninguna toca el HTML que ve una persona.
 *
 * 1. Negociación en markdown (acceptmarkdown.com). Un agente que pide
 *    `Accept: text/markdown` recibe el texto de la página en vez de nuestro
 *    HTML con CSS, videos y JavaScript. La petición se reescribe a /md/... y
 *    toda respuesta de página lleva `Vary: Accept` para que ningún CDN sirva
 *    la variante equivocada desde caché. El mismo texto tiene además una URL
 *    propia con sufijo .md (/consultoria.md, /index.md para el inicio), que es
 *    la forma en que muchos agentes lo piden, y cada página en HTML la anuncia
 *    con una cabecera `Link ... rel="alternate"`.
 *
 * 2. Mientras el sitio vive en *.vercel.app (staging) no debe indexarse, para
 *    no competir con el dominio definitivo. Esas peticiones llevan la cabecera
 *    X-Robots-Tag; las del dominio real no.
 */

/* Rutas que sirven markdown. Fuera de esta lista, /md/... responde 404 con
   cuerpo en markdown, que es justo lo que un agente necesita para recuperarse. */
const RUTAS_MD = new Set([
  "/",
  "/consultoria",
  "/dg-bim-intelligence",
  "/proyectos",
  "/nosotros",
  "/contactos",
  "/blog",
  "/terminos",
  "/privacidad",
]);

function pideMarkdown(accept: string | null) {
  if (!accept) return false;
  const a = accept.toLowerCase();
  if (!a.includes("text/markdown")) return false;
  /* Un navegador manda text/html con prioridad alta; solo se reescribe cuando
     markdown gana o cuando el agente no pidió HTML en absoluto. */
  if (!a.includes("text/html") && !a.includes("*/*")) return true;
  const q = (tipo: string) => {
    const m = a.match(new RegExp(tipo.replace("/", "\\/") + "\\s*(?:;\\s*q=([0-9.]+))?"));
    return m ? (m[1] ? Number(m[1]) : 1) : 0;
  };
  return q("text/markdown") >= q("text/html");
}

/* URL canónica del gemelo en markdown de una ruta de página. */
function gemeloMd(limpia: string) {
  return `${limpia === "/" ? "/index" : limpia}.md`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Sufijo .md: /consultoria.md y /index.md sirven el mismo markdown que la
     negociación por cabecera, en una URL que se puede compartir y citar. */
  const conSufijo = /^\/([^/]*)\.md$/i.exec(pathname);
  if (conSufijo) {
    const base = conSufijo[1].toLowerCase();
    const destino = request.nextUrl.clone();
    destino.pathname = base === "" || base === "index" ? "/md" : `/md/${base}`;
    const md = NextResponse.rewrite(destino);
    md.headers.set("Vary", "Accept, Accept-Encoding");
    if ((request.headers.get("host") ?? "").endsWith(".vercel.app")) {
      md.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return md;
  }

  const esPagina = !pathname.startsWith("/_next") && !pathname.startsWith("/md") && !/\.[a-z0-9]+$/i.test(pathname);

  if (esPagina && pideMarkdown(request.headers.get("accept"))) {
    const destino = request.nextUrl.clone();
    const limpia = pathname.replace(/\/+$/, "") || "/";
    destino.pathname = RUTAS_MD.has(limpia) ? `/md${limpia === "/" ? "" : limpia}` : `/md${pathname}`;
    const md = NextResponse.rewrite(destino);
    md.headers.set("Vary", "Accept, Accept-Encoding");
    if ((request.headers.get("host") ?? "").endsWith(".vercel.app")) {
      md.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return md;
  }

  const response = NextResponse.next();
  if (esPagina) {
    response.headers.append("Vary", "Accept");
    const limpia = pathname.replace(/\/+$/, "") || "/";
    if (RUTAS_MD.has(limpia)) {
      response.headers.append(
        "Link",
        `<${gemeloMd(limpia)}>; rel="alternate"; type="text/markdown"`,
      );
    }
  }
  const host = request.headers.get("host") ?? "";
  if (host.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
