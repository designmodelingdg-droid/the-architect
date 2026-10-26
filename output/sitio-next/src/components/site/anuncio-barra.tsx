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
    <span className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2 text-center text-[13px] leading-snug text-white">
      <Megaphone className="size-4 shrink-0" aria-hidden />
      {a.etiqueta ? <span className="rounded-full bg-white/20 px-2 py-0.5 font-heading text-[10.5px] font-bold uppercase tracking-[0.14em]">{a.etiqueta}</span> : null}
      <span className="font-semibold">{a.texto}</span>
      {a.enlace ? <ArrowRight className="size-3.5" aria-hidden /> : null}
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
