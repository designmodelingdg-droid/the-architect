import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Tag } from "lucide-react";
import type { Novedad } from "@/lib/novedades";

/*
 * Oferta o evento cargado en la app de contenido. Misma piel que el resto de
 * tarjetas (panel); la imagen es opcional y el botón solo aparece con enlace.
 */
function precio(monto: number, moneda: string) {
  return `${moneda} ${new Intl.NumberFormat("es-EC", { maximumFractionDigits: 2 }).format(monto)}`;
}
function fechaHora(iso: string) {
  return new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "America/Guayaquil" }).format(new Date(iso));
}
function fechaCorta(iso: string) {
  return new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "long", timeZone: "America/Guayaquil" }).format(new Date(iso));
}

export function TarjetaNovedad({ n }: { n: Novedad }) {
  const externo = n.enlace?.startsWith("https://");
  const boton = n.tipo === "evento" ? "Inscribirme" : "Ver la oferta";
  return (
    <article className="panel flex h-full flex-col overflow-hidden">
      {n.imagenUrl ? (
        <div className="relative aspect-[16/9] w-full bg-navy">
          <Image src={n.imagenUrl} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <p className="inline-flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto">
          {n.tipo === "evento" && n.eventoFecha ? (
            <><CalendarDays className="size-4" aria-hidden /> {fechaHora(n.eventoFecha)} · hora de Ecuador</>
          ) : (
            <><Tag className="size-4" aria-hidden /> Oferta{n.hasta ? ` · hasta el ${fechaCorta(n.hasta)}` : ""}</>
          )}
        </p>
        <h3 className="mt-2 font-heading text-lg font-bold text-navy">{n.titulo}</h3>
        {n.modalidad ? <p className="mt-1 text-[13px] text-tinta-suave">{n.modalidad}</p> : null}
        {n.texto ? <p className="mt-3 text-[14px] leading-relaxed text-tinta">{n.texto}</p> : null}
        {n.precio !== null ? (
          <p className="mt-3 font-heading text-[15px] font-bold text-navy">
            {n.precioAntes !== null ? <s className="mr-2 font-normal text-tinta-suave">{precio(n.precioAntes, n.moneda)}</s> : null}
            {precio(n.precio, n.moneda)}
          </p>
        ) : null}
        {n.enlace ? (
          externo ? (
            <a href={n.enlace} target="_blank" rel="noopener" className="mt-auto inline-flex items-center gap-1.5 pt-5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
              {boton} <ArrowRight className="size-3.5" aria-hidden />
            </a>
          ) : (
            <Link href={n.enlace} className="mt-auto inline-flex items-center gap-1.5 pt-5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
              {boton} <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          )
        ) : null}
      </div>
    </article>
  );
}
