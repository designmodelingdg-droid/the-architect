import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Casos de consultoría BIM: edificaciones en altura, naves industriales y rehabilitación estructural en Ecuador y Latinoamérica.",
};

/*
 * TODO(brochure): reemplazar estos casos tipo por los proyectos reales del
 * brochure (nombre, ubicación, superficie, disciplinas, resultado y fotos).
 */
const PROYECTOS = [
  {
    img: "/images/v2-proy-torre.jpg",
    num: "01",
    tipo: "Edificación en altura",
    disciplinas: "Estructural · Arquitectura · MEP",
    desc: "Cálculo sismorresistente, modelado federado y coordinación completa de disciplinas para torres residenciales y de oficinas — del prediseño a los planos de construcción.",
    alcance: ["Diseño estructural en hormigón armado", "Detección de interferencias por nivel", "Planos aprobados a trámite municipal"],
  },
  {
    img: "/images/v2-proy-nave.jpg",
    num: "02",
    tipo: "Naves industriales",
    disciplinas: "Estructural · Arquitectura",
    desc: "Estructura metálica de luces mayores: pórticos, arriostramientos y conexiones optimizadas para fabricación y montaje, con ingeniería de detalle lista para taller.",
    alcance: ["Análisis de pórticos y arriostramientos", "Optimización de peso de acero", "Planos de fabricación y montaje"],
  },
  {
    img: "/images/v2-proy-rehab.jpg",
    num: "03",
    tipo: "Rehabilitación estructural",
    disciplinas: "Estructural · Evaluación sísmica",
    desc: "Evaluación del estado actual, levantamiento BIM de lo construido y diseño de reforzamiento para edificaciones existentes que necesitan seguir en servicio con seguridad.",
    alcance: ["Levantamiento BIM de lo existente", "Evaluación de desempeño sísmico", "Diseño de reforzamiento"],
  },
];

export default function Proyectos() {
  return (
    <>
      <PageHero
        num="03"
        eyebrow="Proyectos"
        title="El criterio se demuestra en obra"
        lead="Tipologías en las que trabajamos y qué entregamos en cada una. Cada proyecto sale con modelo federado, memorias defendibles y visibilidad total del avance en DG BIM Intelligence."
        crumb={{ label: "Proyectos", href: "/proyectos" }}
      />

      <Section>
        <div className="space-y-6">
          {PROYECTOS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.05}>
              <article className="panel grid overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative aspect-video overflow-hidden lg:aspect-auto">
                  <Image src={p.img} alt={p.tipo} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                  <span className="absolute left-4 top-4 rounded bg-white/90 px-2 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-naranja backdrop-blur">
                    {p.num}/
                  </span>
                </div>
                <div className="p-7 md:p-9">
                  <span className="font-heading text-[10.5px] font-bold uppercase tracking-[0.15em] text-tinta-suave">{p.disciplinas}</span>
                  <h2 className="mt-2 text-2xl font-bold text-navy md:text-3xl">{p.tipo}</h2>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-tinta-suave">{p.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {p.alcance.map((a) => (
                      <li key={a} className="flex gap-2.5 text-[13.5px] text-tinta">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-naranja" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-xl">
          <p className="panel px-6 py-4 text-center font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-suave">
            Dossier completo de proyectos disponible a solicitud →{" "}
            <a href="/contactos" className="text-naranja hover:text-azul">pídelo aquí</a>
          </p>
        </Reveal>
      </Section>

      <CtaFinal title="¿Tu proyecto encaja en una de estas tipologías?" text="Agenda un diagnóstico sin costo y te decimos qué encontramos, con evidencia." />
    </>
  );
}
