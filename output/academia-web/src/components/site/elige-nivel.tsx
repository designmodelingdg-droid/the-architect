"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMovimientoReducido } from "./use-movimiento-reducido";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import { NIVELES } from "@/lib/site";

/*
 * El clímax del inicio: la sección Elige tu nivel, fijada. En escritorio la
 * banda se ancla mientras se recorren ~2,4 pantallas de scroll y los cinco
 * niveles se despliegan uno a uno, del máster al curso. Es lo que convierte un
 * catálogo en una escuela: cada nivel es una cosa distinta, con sus horas y su
 * credencial, y el sitio lo explica antes de vender ninguno.
 *
 * En móvil o con movimiento reducido es una banda normal, completa.
 */

function useEscritorio() {
  const [es, setEs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const f = () => setEs(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return es;
}

function Tramo({ p, activo, desde, hasta, children, className }: { p: MotionValue<number>; activo: boolean; desde: number; hasta: number; children: ReactNode; className?: string }) {
  const op = useTransform(p, [desde, hasta], [0, 1]);
  const y = useTransform(p, [desde, hasta], [28, 0]);
  if (!activo) return <div className={className}>{children}</div>;
  return <motion.div style={{ opacity: op, y }} className={className}>{children}</motion.div>;
}

export function EligeNivel() {
  const ref = useRef<HTMLElement>(null);
  const escritorio = useEscritorio();
  const reducido = useMovimientoReducido();
  const fijar = escritorio && !reducido;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const barra = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const contenido = (
    <div className="mx-auto w-full max-w-6xl">
      <Tramo p={scrollYProgress} activo={fijar} desde={0.02} hasta={0.12} className="max-w-3xl">
        <span className="tag-tech mb-4 inline-flex items-center gap-2.5 text-naranja-claro">
          <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
          Elige tu nivel
        </span>
        <h2 className="text-3xl font-bold leading-[1.1] text-white md:text-[2.6rem]">
          Cinco formas de aprender, y cada una es una cosa distinta
        </h2>
        <p className="mt-4 leading-relaxed text-white/70 md:text-lg">
          Antes de elegir un programa conviene saber qué es cada nivel: cuántas horas, qué
          credencial otorga y para quién está pensado.
        </p>
      </Tramo>

      <ol className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {NIVELES.map((n, i) => (
          <li key={n.tipo} className="h-full">
            <Tramo p={scrollYProgress} activo={fijar} desde={0.16 + i * 0.12} hasta={0.26 + i * 0.12} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="font-heading text-[11px] font-bold text-naranja-claro">{String(i + 1).padStart(2, "0")}/</span>
                <h3 className="mt-2 font-heading text-lg font-bold text-white">{n.label}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{n.resumen}</p>
                <dl className="mt-4 space-y-1.5 text-[12.5px] text-white/85">
                  <div className="flex gap-2"><dt className="w-[4.5rem] shrink-0 text-white/50">Horas</dt><dd className="font-semibold">{n.horas}</dd></div>
                  <div className="flex gap-2"><dt className="w-[4.5rem] shrink-0 text-white/50">Duración</dt><dd className="font-semibold">{n.duracion}</dd></div>
                  <div className="flex gap-2"><dt className="w-[4.5rem] shrink-0 text-white/50">Credencial</dt><dd className="font-semibold">{n.credencial}</dd></div>
                </dl>
                <p className="mt-4 text-[12.5px] italic text-white/60">{n.paraQuien}</p>
                <Link href={`/${n.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-5 font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-naranja-claro hover:text-white">
                  Ver {n.plural.toLowerCase()} <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </article>
            </Tramo>
          </li>
        ))}
      </ol>

      <Tramo p={scrollYProgress} activo={fijar} desde={0.8} hasta={0.92} className="mt-8 text-center">
        <Link href="/programas" data-btn className="inline-block rounded-lg bg-naranja px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-naranja-claro">
          Ver todo el catálogo
        </Link>
      </Tramo>
    </div>
  );

  return (
    <section
      id="niveles"
      ref={ref}
      className={`relative scroll-mt-24 bg-navy blueprint-navy text-white ${fijar ? "lg:h-[240vh]" : ""}`}
    >
      <div className={`px-5 ${fijar ? "lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-20" : "py-16 md:py-24"}`}>
        {fijar ? contenido : <Reveal>{contenido}</Reveal>}
        {fijar && (
          <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-[3px] bg-white/10 lg:block">
            <motion.div style={{ width: barra }} className="h-full bg-naranja" />
          </div>
        )}
      </div>
    </section>
  );
}
