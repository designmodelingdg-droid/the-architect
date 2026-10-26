import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { novedadesEn } from "@/lib/novedades";

/*
 * La franja naranja sobre todo el sitio: la oferta o el evento que el equipo
 * marcó "franja" en la app de contenido. Una sola a la vez (la más reciente
 * aprobada) para que se lea de un vistazo. Sin nada vigente, no ocupa espacio.
 */
export async function FranjaNovedades() {
  const [n] = await novedadesEn("franja");
  if (!n) return null;
  const externo = n.enlace?.startsWith("https://");
  const contenido = (
    <>
      <strong className="font-heading font-bold">{n.titulo}</strong>
      {n.texto ? <span className="hidden opacity-90 sm:inline"> · {n.texto}</span> : null}
      {n.enlace ? <ArrowRight className="ml-1.5 inline size-3.5 align-[-2px]" aria-hidden /> : null}
    </>
  );
  const cls = "block bg-naranja px-5 py-2 text-center text-[13px] leading-snug text-white";
  if (!n.enlace) return <div className={cls}>{contenido}</div>;
  return externo ? (
    <a href={n.enlace} target="_blank" rel="noopener" className={`${cls} hover:bg-naranja-texto`}>{contenido}</a>
  ) : (
    <Link href={n.enlace} className={`${cls} hover:bg-naranja-texto`}>{contenido}</Link>
  );
}
