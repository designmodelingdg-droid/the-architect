import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { novedadesWeb } from "@/lib/operaciones";

/*
 * La franja naranja sobre todo el sitio: el anuncio que el equipo marcó
 * «franja» en la app de operaciones. Uno solo a la vez, para que se lea de un
 * vistazo. Sin nada vigente, no ocupa espacio.
 */
export async function AnuncioBarra() {
  const a = (await novedadesWeb())?.anuncio;
  if (!a) return null;
  const externo = a.enlace?.startsWith("https://");
  const contenido = (
    <span className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-1.5 text-left text-[12.5px] leading-snug text-white sm:justify-center sm:gap-3 sm:px-5 sm:py-2 sm:text-center sm:text-[13px]">
      <Megaphone className="hidden size-4 shrink-0 sm:block" aria-hidden />
      {a.etiqueta ? <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[10.5px]">{a.etiqueta}</span> : null}
      {/* En celular, dos líneas como máximo para que la barra fija no coma pantalla. */}
      <span className="line-clamp-2 min-w-0 flex-1 font-semibold sm:line-clamp-none sm:flex-none">{a.texto}</span>
      {a.enlace ? <ArrowRight className="size-3.5 shrink-0" aria-hidden /> : null}
    </span>
  );
  const cls = "block bg-naranja";
  if (!a.enlace) return <div className={cls}>{contenido}</div>;
  return externo ? (
    <a href={a.enlace} target="_blank" rel="noopener" className={`${cls} hover:bg-naranja-texto`}>{contenido}</a>
  ) : (
    <Link href={a.enlace} className={`${cls} hover:bg-naranja-texto`}>{contenido}</Link>
  );
}
