import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Tag } from "lucide-react";
import type { Destacado, EventoApp } from "@/lib/operaciones";

/*
 * Oferta o evento publicado desde la app de operaciones. Misma piel que el
 * resto de tarjetas (panel); la imagen (4:3, 1080 × 810 desde el bucket de la
 * app) es opcional y el botón solo aparece con enlace.
 */
function fechaHora(iso: string) {
  return new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "America/Guayaquil" }).format(new Date(iso));
}
function fechaCorta(iso: string) {
  return new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "long", timeZone: "America/Guayaquil" }).format(new Date(iso));
}

export type Novedad =
  | { tipo: "oferta"; id: string; titulo: string; texto?: string; imagen?: string; enlace?: string; textoEnlace?: string; etiqueta?: string; hasta?: string }
  | { tipo: "evento"; id: string; titulo: string; texto?: string; imagen?: string; enlace?: string; textoEnlace?: string; fecha: string; modalidad?: string };

export const deDestacado = (d: Destacado): Novedad => ({ tipo: "oferta", id: d.id, titulo: d.titulo, texto: d.texto, imagen: d.imagen, enlace: d.enlace, textoEnlace: d.textoEnlace, etiqueta: d.etiqueta, hasta: d.hasta });
export const deEvento = (e: EventoApp): Novedad => ({ tipo: "evento", id: e.id, titulo: e.titulo, texto: e.resumen, imagen: e.imagen, enlace: e.enlace, textoEnlace: e.textoEnlace, fecha: e.fecha, modalidad: e.modalidad });

export function TarjetaNovedad({ n }: { n: Novedad }) {
  const externo = n.enlace?.startsWith("https://");
  const boton = n.textoEnlace || (n.tipo === "evento" ? "Inscribirme" : "Ver más");
  const clase = "mt-auto inline-flex items-center gap-1.5 pt-5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy";
  return (
    <article className="panel flex h-full flex-col overflow-hidden">
      {n.imagen ? (
        <div className="relative aspect-[4/3] w-full bg-navy">
          <Image src={n.imagen} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <p className="inline-flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto">
          {n.tipo === "evento" ? (
            <><CalendarDays className="size-4" aria-hidden /> {fechaHora(n.fecha)} · hora de Ecuador</>
          ) : (
            <><Tag className="size-4" aria-hidden /> {n.etiqueta || "Oferta"}{n.hasta ? ` · hasta el ${fechaCorta(n.hasta)}` : ""}</>
          )}
        </p>
        <h3 className="mt-2 font-heading text-lg font-bold text-navy">{n.titulo}</h3>
        {n.tipo === "evento" && n.modalidad ? <p className="mt-1 text-[13px] text-tinta-suave">{n.modalidad}</p> : null}
        {n.texto ? <p className="mt-3 text-[14px] leading-relaxed text-tinta">{n.texto}</p> : null}
        {n.enlace ? (
          externo ? (
            <a href={n.enlace} target="_blank" rel="noopener" className={clase}>{boton} <ArrowRight className="size-3.5" aria-hidden /></a>
          ) : (
            <Link href={n.enlace} className={clase}>{boton} <ArrowRight className="size-3.5" aria-hidden /></Link>
          )
        ) : null}
      </div>
    </article>
  );
}
