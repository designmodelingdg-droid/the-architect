import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
 * Dos cosas, y ninguna toca el HTML que ve una persona. (En Next 16 esto se
 * llama proxy; es el middleware de siempre.)
 *
 * 1. Negociación en markdown (acceptmarkdown.com). Un agente que pide
 *    `Accept: text/markdown` recibe el texto de la página en vez de nuestro
 *    HTML con CSS y JavaScript. La petición se reescribe a /md/... y toda
 *    respuesta de página lleva `Vary: Accept`. El mismo texto tiene además
 *    una URL propia con sufijo .md (/programas/robot-acero.md, /index.md
 *    para el inicio), y cada página en HTML la anuncia con `Link ...
 *    rel="alternate"`. Aquí, a diferencia de la consultoría, las rutas salen
 *    del contenido (84 programas, 10 docentes), así que no hay lista cerrada:
 *    el handler de /md decide qué existe y responde 404 en markdown si no.
 *
 * 2. Mientras el sitio vive en *.vercel.app (staging) no debe indexarse.
 */

function pideMarkdown(accept: string | null) {
  if (!accept) return false;
  const a = accept.toLowerCase();
  if (!a.includes("text/markdown")) return false;
  if (!a.includes("text/html") && !a.includes("*/*")) return true;
  const q = (tipo: string) => {
    const m = a.match(new RegExp(tipo.replace("/", "\\/") + "\\s*(?:;\\s*q=([0-9.]+))?"));
    return m ? (m[1] ? Number(m[1]) : 1) : 0;
  };
  return q("text/markdown") >= q("text/html");
}

/* Rutas que nunca tienen gemelo en markdown: el editor, su API y los propios /md. */
const SIN_MD = /^\/(keystatic|api|md)(\/|$)/;

function staging(request: NextRequest, res: NextResponse) {
  if ((request.headers.get("host") ?? "").endsWith(".vercel.app")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Sufijo .md, en cualquier profundidad: /docentes/gabriel-pantoja.md. */
  const conSufijo = /^(\/[^?#]*?)?\/?(index)?\.md$/i.exec(pathname);
  if (conSufijo && !SIN_MD.test(pathname)) {
    const base = (conSufijo[1] ?? "").replace(/\/+$/, "");
    const destino = request.nextUrl.clone();
    destino.pathname = base ? `/md${base}` : "/md";
    const md = NextResponse.rewrite(destino);
    md.headers.set("Vary", "Accept, Accept-Encoding");
    return staging(request, md);
  }

  const esPagina = !pathname.startsWith("/_next") && !SIN_MD.test(pathname) && !/\.[a-z0-9]+$/i.test(pathname);
  const limpia = pathname.replace(/\/+$/, "") || "/";

  if (esPagina && pideMarkdown(request.headers.get("accept"))) {
    const destino = request.nextUrl.clone();
    destino.pathname = limpia === "/" ? "/md" : `/md${limpia}`;
    const md = NextResponse.rewrite(destino);
    md.headers.set("Vary", "Accept, Accept-Encoding");
    return staging(request, md);
  }

  const response = NextResponse.next();
  if (esPagina) {
    response.headers.append("Vary", "Accept");
    response.headers.append("Link", `<${limpia === "/" ? "/index" : limpia}.md>; rel="alternate"; type="text/markdown"`);
  }
  return staging(request, response);
}
