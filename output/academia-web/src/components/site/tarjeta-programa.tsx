import Image from "next/image";
import Link from "next/link";
import { Clock, CalendarDays, Award } from "lucide-react";
import { precio, horas, fechaCorta, etiquetaTipo, precioBase, type TarjetaDatos } from "@/lib/formato";

/*
 * La tarjeta de programa es un objeto compuesto y todas son iguales (DESIGN.md):
 * chip de nivel arriba a la izquierda, imagen 414 × 237, título, docente, horas
 * y próximo inicio en una línea, credencial principal, precio a la derecha. Un
 * elemento que se repite va en el mismo sitio en cada tarjeta.
 *
 * Sin imagen todavía, el hueco lo ocupa un bloque navy con el software del
 * programa: es información real, no un degradado decorativo.
 */
export function TarjetaPrograma({
  p,
  docentes = {},
  credenciales = {},
}: {
  p: TarjetaDatos;
  docentes?: Record<string, string>;
  credenciales?: Record<string, string>;
}) {
  const base = precioBase(p);
  const doc = (p.docentes ?? []).map((d) => docentes[d ?? ""]).filter(Boolean);
  const cred = (p.credenciales ?? []).map((c) => credenciales[c ?? ""]).filter(Boolean)[0];

  return (
    <article className="alza panel group flex h-full flex-col overflow-hidden">
      <Link href={`/programas/${p.slug}`} className="relative block aspect-[414/237] w-full overflow-hidden bg-navy">
        {p.imagen ? (
          <Image src={p.imagen} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full flex-wrap content-end gap-1.5 p-4">
            {(p.software ?? []).slice(0, 4).map((s) => (
              <span key={s} className="rounded-full border border-white/15 px-2.5 py-1 font-heading text-[10.5px] font-bold uppercase tracking-[0.12em] text-azul-palido">
                {s?.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-azul-medio px-2.5 py-1 font-heading text-[10.5px] font-bold uppercase tracking-[0.14em] text-white">
          {etiquetaTipo(p.tipo)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-heading text-[17px] font-bold leading-snug text-navy">
          <Link href={`/programas/${p.slug}`} className="hover:text-naranja-texto">
            {p.titulo}
          </Link>
        </h3>
        {doc.length ? <p className="text-[13px] text-tinta-suave">{doc.join(" · ")}</p> : null}

        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-tinta">
          {p.horas ? (
            <div className="inline-flex items-center gap-1.5"><dt className="sr-only">Horas</dt><Clock className="size-3.5 text-tinta-suave" aria-hidden /><dd>{horas(p.horas)}</dd></div>
          ) : null}
          {p.proximoInicio ? (
            <div className="inline-flex items-center gap-1.5"><dt className="sr-only">Próximo inicio</dt><CalendarDays className="size-3.5 text-tinta-suave" aria-hidden /><dd>Inicio {fechaCorta(p.proximoInicio)}</dd></div>
          ) : null}
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          {cred ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] leading-snug text-tinta-suave">
              <Award className="size-3.5 shrink-0 text-naranja" aria-hidden /> {cred}
            </span>
          ) : <span />}
          {base ? (
            <span className="shrink-0 text-right">
              {base.tachado ? <s className="block text-[11.5px] text-tinta-suave">{precio(base.tachado, base.moneda)}</s> : null}
              <span className="font-heading text-[17px] font-extrabold text-navy">{base.monto === 0 ? "Gratis" : precio(base.monto, base.moneda)}</span>
            </span>
          ) : p.tipo === "master" || p.tipo === "mentoria" ? (
            <span className="shrink-0 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto">Con cita</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
