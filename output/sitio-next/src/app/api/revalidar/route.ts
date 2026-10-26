import { revalidatePath, revalidateTag } from "next/cache";
import { ETIQUETA_CACHE } from "@/lib/operaciones";

/*
 * La app de operaciones avisa aquí cuando publica algo (anuncio, oferta,
 * evento) para que la web se actualice al instante en vez de esperar los
 * cinco minutos de caché. Secreto compartido en OPERACIONES_REVALIDATE_SECRET.
 */
export async function POST(req: Request) {
  const secreto = process.env.OPERACIONES_REVALIDATE_SECRET;
  const recibido = req.headers.get("x-revalidate-secret") ?? new URL(req.url).searchParams.get("secret");
  if (!secreto || recibido !== secreto) return Response.json({ ok: false }, { status: 401 });
  revalidateTag(ETIQUETA_CACHE, "max");
  revalidatePath("/", "layout");
  return Response.json({ ok: true, en: new Date().toISOString() });
}
