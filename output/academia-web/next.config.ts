import type { NextConfig } from "next";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const nextConfig: NextConfig = {
  /*
   * El logo lo entrega su dueña en el archivo original; mientras no exista en
   * public/images, la barra escribe la marca en texto. La comprobación es de
   * build, así que la bandera se inlina también en los componentes de cliente.
   */
  /* El gemelo en markdown de una ruta no prerenderizada lee content/ en el servidor. */
  outputFileTracingIncludes: { "/md/[[...slug]]": ["./content/**/*"] },
  env: {
    LOGO_ACADEMY: existsSync(join(process.cwd(), "public/images/logo-academy.png")) ? "1" : "",
  },
  /*
   * `Vary: Accept` en las respuestas de página. Sin esta cabecera, un CDN
   * puede servirle a un agente el HTML cacheado cuando pidió markdown, o al
   * contrario, según cuál variante entró primero a la caché. Se conservan los
   * valores que Next necesita para su propio router; solo se añade Accept.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Vary",
            value:
              "Accept, Accept-Encoding, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch",
          },
        ],
      },
    ];
  },
  /*
   * Redirecciones. Las del sitio anterior en LeadGods salen del contenido: cada
   * programa y cada docente guardan su ruta vieja en `slugAnterior`, así que la
   * tabla se regenera sola en build y Ester puede añadir una desde el editor.
   * El resto son las rutas fijas del sitio anterior (inventario de la
   * auditoría del 29/09/2026) y la convención en inglés que un agente prueba
   * antes de leer el sitemap. Solo tienen efecto tras el corte de dominio.
   */
  async redirects() {
    const CAMPUS = "https://designmodelingacademy.app.clientclub.net/";
    const desdeContenido = (carpeta: string, destino: string) => {
      const dir = join(process.cwd(), "content", carpeta);
      if (!existsSync(dir)) return [];
      const pares: [string, string][] = [];
      for (const archivo of readdirSync(dir)) {
        if (!archivo.endsWith(".yaml")) continue;
        const m = /^slugAnterior:\s*"?(\/[^"\n]+?)"?\s*$/m.exec(readFileSync(join(dir, archivo), "utf8"));
        if (m) pares.push([m[1].replace(/\/+$/, ""), archivo.replace(/\.yaml$/, "")]);
      }
      /* Una ruta vieja compartida por varias entradas (la página de mentorías,
         la de suscripción) no puede decidir sola: la resuelven las rutas fijas. */
      const veces = new Map<string, number>();
      for (const [vieja] of pares) veces.set(vieja, (veces.get(vieja) ?? 0) + 1);
      const lista: { source: string; destination: string; permanent: boolean }[] = [];
      for (const [vieja, slug] of pares) {
        if ((veces.get(vieja) ?? 0) > 1) continue;
        lista.push({ source: vieja, destination: `${destino}/${slug}`, permanent: true });
        if (vieja.startsWith("/docente/")) lista.push({ source: vieja.replace("/docente/", "/teacher/"), destination: `${destino}/${slug}`, permanent: true });
      }
      return lista;
    };
    return [
      ...desdeContenido("programas", "/programas"),
      ...desdeContenido("docentes", "/docentes"),
      /* Rutas fijas de la web anterior */
      { source: "/es", destination: "/", permanent: true },
      { source: "/productos", destination: "/programas", permanent: true },
      { source: "/rutas-aprendizaje", destination: "/rutas", permanent: true },
      { source: "/meetings", destination: "/mentorias", permanent: true },
      { source: "/es/meetings", destination: "/mentorias", permanent: true },
      { source: "/matriculas", destination: "/suscripcion", permanent: true },
      { source: "/contact-us", destination: "/contacto", permanent: true },
      { source: "/campaigns", destination: "/", permanent: true },
      { source: "/politicas-privacidad", destination: "/privacidad", permanent: true },
      { source: "/terminos-condiciones", destination: "/terminos", permanent: true },
      { source: "/landing/:path*", destination: "/programas", permanent: true },
      { source: "/ruta-aprendizaje/:path*", destination: "/rutas", permanent: false },
      { source: "/flogin", destination: CAMPUS, permanent: false },
      { source: "/account/:path*", destination: CAMPUS, permanent: false },
      { source: "/room/:path*", destination: CAMPUS, permanent: false },
      /* El prefijo /es/ de la web anterior, después de las rutas concretas */
      { source: "/es/:path*", destination: "/:path*", permanent: true },
      /* Convención en inglés */
      { source: "/privacy", destination: "/privacidad", permanent: true },
      { source: "/privacy-policy", destination: "/privacidad", permanent: true },
      { source: "/terms", destination: "/terminos", permanent: true },
      { source: "/about", destination: "/nosotros", permanent: true },
      { source: "/contact", destination: "/contacto", permanent: true },
      { source: "/courses", destination: "/programas", permanent: true },
      { source: "/programs", destination: "/programas", permanent: true },
      { source: "/teachers", destination: "/docentes", permanent: true },
    ];
  },
};

export default nextConfig;
