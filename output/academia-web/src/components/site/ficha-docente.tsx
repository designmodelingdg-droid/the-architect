import Image from "next/image";
import Link from "next/link";
import { IconoLinkedIn } from "./icono-linkedin";
import type { Docente } from "@/lib/contenido";

/*
 * Ficha de docente: nombre, titulación y lo que hace fuera de la escuela. Ese
 * rol en activo es la prueba de que enseña quien construye; sin él la ficha se
 * queda en el nombre, y eso ya es más honesto que inventarlo.
 */
export function FichaDocente({ d, programas = 0 }: { d: Docente; programas?: number }) {
  return (
    <article className="flex h-full gap-4 rounded-xl bg-crema p-5">
      <Link href={`/docentes/${d.slug}`} className="relative size-16 shrink-0 overflow-hidden rounded-full border border-border bg-white">
        {d.foto ? (
          <Image src={d.foto} alt={d.nombre} fill sizes="64px" className="object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center font-heading text-lg font-bold text-azul" aria-hidden>
            {d.nombre.split(" ").filter((p) => !/^(Ing|Arq)\.?$/.test(p)).slice(0, 2).map((p) => p[0]).join("")}
          </span>
        )}
      </Link>
      <div className="min-w-0">
        <h3 className="font-heading text-[15px] font-bold leading-snug text-navy">
          <Link href={`/docentes/${d.slug}`} className="hover:text-naranja-texto">{d.nombre}</Link>
        </h3>
        {d.titulacion ? <p className="mt-0.5 text-[12.5px] text-tinta-suave">{d.titulacion}</p> : null}
        {d.rolFuera ? <p className="mt-1.5 text-[13px] leading-snug text-tinta">{d.rolFuera}</p> : null}
        <div className="mt-2 flex items-center gap-3 text-[11.5px] text-tinta-suave">
          {programas ? <span>{programas} {programas === 1 ? "programa" : "programas"}</span> : null}
          {d.linkedin ? (
            <a href={d.linkedin} target="_blank" rel="noopener" aria-label={`LinkedIn de ${d.nombre}`} className="inline-flex items-center gap-1 hover:text-naranja-texto">
              <IconoLinkedIn className="size-3.5" /> LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
