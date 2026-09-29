import { documento, rutasMd } from "@/lib/markdown";
import { DOMINIO, NIVELES } from "@/lib/site";

/*
 * Gemelo en markdown de cada página (acceptmarkdown.com). El proxy reescribe
 * aquí las peticiones con `Accept: text/markdown` y las URL con sufijo .md.
 * Todo sale de src/lib/markdown.ts, que lee el mismo contenido que las
 * páginas. Se prerenderiza en build: en producción no se toca el sistema de
 * archivos.
 */
const CABECERAS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Vary": "Accept, Accept-Encoding",
  "Cache-Control": "public, max-age=0, must-revalidate",
};

const ACTUALIZADO = new Date().toISOString().slice(0, 10);

function frontmatter(ruta: string, titulo: string, descripcion: string) {
  return [
    "---",
    `title: ${JSON.stringify(titulo)}`,
    `description: ${JSON.stringify(descripcion)}`,
    `canonical: ${DOMINIO}${ruta ? `/${ruta}` : "/"}`,
    `last-updated: ${ACTUALIZADO}`,
    "language: es",
    "---",
    "",
    "",
  ].join("\n");
}

/*
 * Las rutas conocidas se prerenderizan en build (generateStaticParams). Una
 * ruta desconocida llega en tiempo de ejecución y responde 404 en markdown;
 * si el contenido no estuviera accesible en el servidor, también 404.
 */
export const dynamic = "force-static";

export async function GET(_req: Request, ctx: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await ctx.params;
  const ruta = (slug ?? []).join("/").replace(/\.md$/, "").replace(/\/+$/, "");
  const doc = await documento(ruta).catch(() => null);
  if (!doc) {
    const cuerpo = `# 404 · Esta página no existe

La ruta \`/${ruta}\` no existe en designmodelingacademy.com.

## Dónde seguir

- Inicio: ${DOMINIO}/
- Catálogo de programas: ${DOMINIO}/programas
${NIVELES.map((n) => `- ${n.plural}: ${DOMINIO}/${n.slug}`).join("\n")}
- Docentes: ${DOMINIO}/docentes
- Acreditaciones: ${DOMINIO}/acreditaciones
- Contacto y cita informativa: ${DOMINIO}/contacto

## Índices legibles por máquina

- Guía para agentes: ${DOMINIO}/llms.txt
- Mapa del sitio: ${DOMINIO}/sitemap.xml
`;
    return new Response(cuerpo, { status: 404, headers: CABECERAS });
  }
  return new Response(frontmatter(ruta, doc.titulo, doc.descripcion) + doc.cuerpo, { status: 200, headers: CABECERAS });
}

export async function generateStaticParams() {
  return (await rutasMd()).map((r) => ({ slug: r ? r.split("/") : [] }));
}
