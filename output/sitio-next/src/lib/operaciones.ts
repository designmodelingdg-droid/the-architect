/*
 * Conector con la app de operaciones de DG (contenido.dgdesignmodeling.com).
 * El equipo publica desde la app anuncios (franja), ofertas destacadas (inicio)
 * y eventos, y esta web los lee de un endpoint público de solo lectura: solo
 * lo aprobado y vigente para la consultoría. Se cachea cinco minutos y la app
 * fuerza la actualización con POST /api/revalidar al aprobar, editar, rechazar
 * o archivar. Sin respuesta de la app, la web sigue igual que siempre.
 * El contrato es el mismo de la academia: docs/conector-dg-operaciones.md en
 * designmodelingdg-droid/academia-web.
 */
export type Anuncio = { texto: string; enlace?: string; etiqueta?: string; desde?: string; hasta?: string };
export type Destacado = { id: string; etiqueta?: string; titulo: string; texto: string; imagen?: string; enlace: string; textoEnlace?: string; desde?: string; hasta?: string };
export type EventoApp = { id: string; titulo: string; fecha: string; resumen?: string; modalidad?: string; imagen?: string; enlace?: string; textoEnlace?: string };
export type NovedadesWeb = { anuncio: Anuncio | null; destacados: Destacado[]; eventos: EventoApp[] };

const SITIO = "consultoria";
const BASE = (process.env.OPERACIONES_API_URL || "https://contenido.dgdesignmodeling.com").replace(/\/$/, "");
export const ETIQUETA_CACHE = "operaciones";

/* Las imágenes solo pueden venir del bucket de la app (es lo que permite next.config). */
const ORIGEN_IMAGENES = "https://wykwcbohcsqfojsgkfxp.supabase.co/storage/v1/object/public/novedades/";
const imagenSegura = (u?: string) => (u && u.startsWith(ORIGEN_IMAGENES) ? u : undefined);
const enlaceSeguro = (u?: string) => (u && /^(https:\/\/|\/(?!\/))/.test(u) ? u : undefined);

const vigente = (x: { desde?: string; hasta?: string }, ahora: number) =>
  (!x.desde || Date.parse(x.desde) <= ahora) && (!x.hasta || Date.parse(x.hasta) >= ahora);

let enMemoria: { t: number; v: NovedadesWeb | null } | null = null;

export async function novedadesWeb(): Promise<NovedadesWeb | null> {
  if (enMemoria && Date.now() - enMemoria.t < 60_000) return enMemoria.v;
  let v: NovedadesWeb | null = null;
  try {
    const r = await fetch(`${BASE}/api/public/web?sitio=${SITIO}`, { next: { revalidate: 300, tags: [ETIQUETA_CACHE] }, headers: { Accept: "application/json" } });
    if (r.ok) {
      const d = (await r.json()) as Partial<NovedadesWeb>;
      const ahora = Date.now();
      v = {
        anuncio: d.anuncio && d.anuncio.texto && vigente(d.anuncio, ahora) ? { ...d.anuncio, enlace: enlaceSeguro(d.anuncio.enlace) } : null,
        destacados: (d.destacados ?? [])
          .filter((x) => x && x.titulo && enlaceSeguro(x.enlace) && vigente(x, ahora))
          .map((x) => ({ ...x, id: String(x.id), imagen: imagenSegura(x.imagen) })),
        /* Solo los eventos que no han pasado (con 6 h de margen para el día del evento). */
        eventos: (d.eventos ?? [])
          .filter((x) => x && x.titulo && x.fecha && Date.parse(x.fecha) >= ahora - 6 * 3600_000)
          .map((x) => ({ ...x, id: String(x.id), imagen: imagenSegura(x.imagen), enlace: enlaceSeguro(x.enlace) })),
      };
    }
  } catch {
    v = null;
  }
  enMemoria = { t: Date.now(), v };
  return v;
}
