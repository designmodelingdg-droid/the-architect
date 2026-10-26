/*
 * Ofertas, eventos y cambios de precio que el equipo carga en la app de
 * contenido (contenido.dgdesignmodeling.com → Ofertas y eventos) y Dayana
 * aprueba. Llegan ya filtrados: solo lo aprobado y vigente para la consultoría.
 *
 * La web se regenera sola cada pocos minutos (revalidate), así que un cambio
 * aprobado aparece sin desplegar. Si la app no responde, la web sigue igual
 * que siempre: sin franja y sin ofertas.
 */
const URL_NOVEDADES =
  process.env.NOVEDADES_URL ?? "https://contenido.dgdesignmodeling.com/api/publico/novedades?sitio=consultoria";

/** Cada cuánto se vuelve a preguntar a la app, en segundos. */
export const REVALIDAR = 300;

/* Las imágenes solo pueden venir del bucket de la app (es lo que permite next.config). */
const ORIGEN_IMAGENES = "https://wykwcbohcsqfojsgkfxp.supabase.co/storage/v1/object/public/novedades/";

export type Lugar = "franja" | "inicio" | "eventos";

export type Novedad = {
  id: number;
  tipo: "oferta" | "evento" | "precio";
  titulo: string;
  texto: string;
  imagenUrl: string | null;
  enlace: string | null;
  eventoFecha: string | null;
  modalidad: string | null;
  programaSlug: string | null;
  precio: number | null;
  precioAntes: number | null;
  moneda: string;
  lugares: Lugar[];
  hasta: string | null;
};

const esTexto = (v: unknown): v is string => typeof v === "string";
const textoONulo = (v: unknown) => (esTexto(v) && v ? v : null);
const numeroONulo = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/* Lo que viene de afuera se revisa campo por campo: un dato raro se descarta, no rompe la página. */
function leer(v: unknown): Novedad | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.id !== "number" || !esTexto(o.titulo) || !["oferta", "evento", "precio"].includes(String(o.tipo))) return null;
  const enlace = textoONulo(o.enlace);
  return {
    id: o.id,
    tipo: o.tipo as Novedad["tipo"],
    titulo: o.titulo,
    texto: esTexto(o.texto) ? o.texto : "",
    imagenUrl: textoONulo(o.imagenUrl)?.startsWith(ORIGEN_IMAGENES) ? (o.imagenUrl as string) : null,
    enlace: enlace && /^(https:\/\/|\/(?!\/))/.test(enlace) ? enlace : null,
    eventoFecha: textoONulo(o.eventoFecha),
    modalidad: textoONulo(o.modalidad),
    programaSlug: textoONulo(o.programaSlug),
    precio: numeroONulo(o.precio),
    precioAntes: numeroONulo(o.precioAntes),
    // Código de moneda de tres letras (USD, EUR…): termina dentro del JSON-LD de la ficha.
    moneda: esTexto(o.moneda) && /^[A-Z]{3}$/.test(o.moneda) ? o.moneda : "USD",
    lugares: Array.isArray(o.lugares) ? (o.lugares.filter((l) => l === "franja" || l === "inicio" || l === "eventos") as Lugar[]) : [],
    hasta: textoONulo(o.hasta),
  };
}

export async function novedades(): Promise<Novedad[]> {
  try {
    const res = await fetch(URL_NOVEDADES, { next: { revalidate: REVALIDAR, tags: ["novedades"] } });
    if (!res.ok) return [];
    const data = (await res.json()) as { novedades?: unknown };
    if (!Array.isArray(data.novedades)) return [];
    return data.novedades.map(leer).filter((n): n is Novedad => n !== null);
  } catch {
    return [];
  }
}

/** Ofertas y eventos que van en un lugar de la página. */
export async function novedadesEn(lugar: Lugar): Promise<Novedad[]> {
  return (await novedades()).filter((n) => n.tipo !== "precio" && n.lugares.includes(lugar));
}
