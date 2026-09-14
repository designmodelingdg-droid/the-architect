import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
 * Dos cosas, y ninguna toca el HTML que ve una persona.
 *
 * 1. Negociación en markdown (acceptmarkdown.com). Un agente que pide
 *    `Accept: text/markdown` recibe el texto de la página en vez de nuestro
 *    HTML con CSS, videos y JavaScript. La petición se reescribe a /md/... y
 *    toda respuesta de página lleva `Vary: Accept` para que ningún CDN sirva
 *    la variante equivocada desde caché.
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  if (esPagina) response.headers.append("Vary", "Accept");
  const host = request.headers.get("host") ?? "";
  if (host.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
