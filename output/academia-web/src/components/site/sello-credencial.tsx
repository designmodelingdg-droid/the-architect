import Image from "next/image";
import { Award } from "lucide-react";
import type { Credencial } from "@/lib/contenido";

/*
 * Sello de credencial: el logo tal como lo entrega el emisor, qué certifica y
 * el registro oficial cuando lo hay. Para un ingeniero de Ecuador o Colombia,
 * el registro es la decisión de compra, así que va en la primera línea.
 */
export function SelloCredencial({ c, compacto = false }: { c: Credencial; compacto?: boolean }) {
  return (
    <article className="panel flex h-full gap-4 rounded-2xl p-5">
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white">
        {c.logo ? (
          <Image src={c.logo} alt={`Logo de ${c.emisor ?? c.nombre}`} width={56} height={56} className="size-full object-contain p-1.5" />
        ) : (
          <Award className="size-6 text-naranja" aria-hidden />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-heading text-[15px] font-bold leading-snug text-navy">{c.nombre}</h3>
        {c.emisor ? <p className="mt-0.5 text-[12.5px] text-tinta-suave">{c.emisor}</p> : null}
        {c.registroOficial ? (
          <p className="mt-1.5 inline-block rounded-full bg-naranja-palido px-2.5 py-0.5 font-heading text-[10.5px] font-bold uppercase tracking-[0.12em] text-naranja-texto">
            {c.registroOficial}
          </p>
        ) : null}
        {!compacto && c.queCertifica ? <p className="mt-2 text-[13.5px] leading-relaxed text-tinta">{c.queCertifica}</p> : null}
        {!compacto && c.url ? (
          <a href={c.url} target="_blank" rel="noopener" className="mt-2 inline-block font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
            Verificar en el emisor
          </a>
        ) : null}
      </div>
    </article>
  );
}
