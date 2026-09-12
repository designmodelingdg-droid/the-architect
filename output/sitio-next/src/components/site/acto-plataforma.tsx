"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "./reveal";

/*
 * Acto fijado de DG BIM Intelligence en la home. En escritorio la banda se
 * ancla mientras se recorren ~2,4 pantallas de scroll: primero entra el
 * titular, luego los cuatro argumentos uno a uno y, al final, el Agente BIM
 * se asoma sobre el dashboard. En móvil o con movimiento reducido se muestra
 * como banda normal, sin anclaje.
 */
const PUNTOS = [
  "Sincronización directa desde Revit con el complemento DG BIM Sync",
  "Detección de interferencias clasificadas por severidad, con responsable asignado",
  "Control de calidad del modelo antes de que llegue a obra",
  "Tableros por rol: modelador, coordinador, gerencia y dueño",
];

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

export function ActoPlataforma() {
  const ref = useRef<HTMLElement>(null);
  const escritorio = useEscritorio();
  const reducido = useReducedMotion();
  const fijar = escritorio && !reducido;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const escala = useTransform(scrollYProgress, [0, 0.35], [0.9, 1]);
  const yFig = useTransform(scrollYProgress, [0, 0.35], [60, 0]);
  const xAgente = useTransform(scrollYProgress, [0.55, 0.8], [140, 0]);
  const opAgente = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const barra = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const contenido = (
    <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-14">
      <div>
        <Tramo p={scrollYProgress} activo={fijar} desde={0.02} hasta={0.14}>
          <span className="tag-tech mb-4 inline-block text-naranja-claro">Nuestro software</span>
          <h2 className="text-3xl font-bold leading-[1.1] text-white md:text-[2.6rem]">
            No es un chatbot. Es un consultor BIM que razona.
          </h2>
          <p className="mt-4 leading-relaxed text-white/70 md:text-lg">
            DG BIM Intelligence lee tu proyecto, razona paso a paso con el criterio de +10 años de
            BIM Management y te dice qué hacer y por qué — con evidencia, impacto y nivel de
            confianza en cada hallazgo. Lo usamos en nuestra consultoría y lo licenciamos a
            empresas con equipo BIM propio.
          </p>
        </Tramo>
        <ul className="mt-6 space-y-3.5">
          {PUNTOS.map((t, i) => (
            <Tramo key={t} p={scrollYProgress} activo={fijar} desde={0.18 + i * 0.09} hasta={0.28 + i * 0.09}>
              <li className="flex gap-3 text-[15px] text-white/85">
                <Check className="mt-1 size-4 shrink-0 text-naranja-claro" aria-hidden />
                {t}
              </li>
            </Tramo>
          ))}
        </ul>
        <Tramo p={scrollYProgress} activo={fijar} desde={0.58} hasta={0.7}>
          <Link href="/dg-bim-intelligence" data-btn className="mt-7 inline-block rounded-lg bg-naranja px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-naranja-claro">
            Conoce DG BIM Intelligence
          </Link>
        </Tramo>
      </div>

      <div className="relative">
        <motion.figure
          style={fijar ? { scale: escala, y: yFig } : undefined}
          className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/40"
        >
          <Image
            src="/images/dgbim/dashboard.jpg"
            alt="DG BIM Intelligence: dashboard del modelador con el BIM Model Quality Score y la calidad del modelo"
            width={2048}
            height={1133}
            sizes="(min-width:1024px) 560px, 100vw"
            className="size-full object-cover"
          />
          <figcaption className="border-t border-white/10 bg-navy-2 px-4 py-2.5 text-center font-heading text-[10.5px] font-bold uppercase tracking-[0.12em] text-azul-palido/60">
            Captura real de la plataforma — dashboard del modelador
          </figcaption>
        </motion.figure>
        <motion.div
          style={fijar ? { x: xAgente, opacity: opAgente } : undefined}
          className="absolute -bottom-6 right-3 w-[42%] max-w-[240px] overflow-hidden rounded-xl border border-white/20 bg-white shadow-2xl shadow-black/50 sm:right-6"
        >
          <Image
            src="/images/dgbim/agente.jpg"
            alt="Agente BIM: sugerencias de qué corregir primero en el modelo"
            width={1200}
            height={1520}
            sizes="240px"
            className="w-full"
          />
        </motion.div>
      </div>
    </div>
  );

  return (
    <section
      id="plataforma"
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
