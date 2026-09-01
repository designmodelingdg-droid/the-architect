import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { IconoLinkedIn } from "@/components/site/icono-linkedin";
import { PageHero } from "@/components/site/page-hero";
import { AvalesMarquee } from "@/components/site/marquee";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";
import { CLIENTES, ACADEMIA, EQUIPO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Consultora de ingeniería estructural y BIM dirigida por los ingenieros Dayana Calderón y Gabriel Pantoja. Partner de Autodesk con avales universitarios internacionales.",
};

export default function Nosotros() {
  return (
    <>
      <PageHero
        num="04"
        eyebrow="Nosotros"
        title="Una consultora dirigida por ingenieros, no por un comercial"
        lead="Diez años diseñando y modelando estructuras con metodología BIM para Ecuador y Latinoamérica. Quien firma tu proyecto es quien lo revisa — y el criterio que aplicamos a mano es el mismo que hoy entrenamos en nuestra propia IA."
        crumb={{ label: "Nosotros", href: "/nosotros" }}
        vimeo={{ id: "1223019533", poster: "/images/hero-poster.jpg" }}
      />
      <AvalesMarquee />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="tag-tech mb-4 inline-block">La empresa</span>
            <h2 className="text-3xl font-bold leading-tight text-navy md:text-4xl">Qué hacemos y para quién</h2>
            <p className="mt-4 leading-relaxed text-tinta-suave md:text-lg">
              Desarrollamos proyectos de ingeniería con metodología BIM para diseños arquitectónicos
              y estructurales, con el compromiso de entregar soluciones inteligentes y económicas.
            </p>
            <p className="mt-3 leading-relaxed text-tinta-suave md:text-lg">
              Trabajamos con constructoras, promotoras, estudios de arquitectura y propietarios que
              necesitan que su proyecto llegue a obra sin conflictos entre disciplinas.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[["Política", "Superar expectativas en tiempo, costo y calidad"], ["Visión", "Liderar el diseño con nuevas tecnologías"], ["Misión", "Ejecutar con BIM y tecnología propia"]].map(([t, d]) => (
                <div key={t} className="panel p-4">
                  <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.15em] text-naranja">{t}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-tinta-suave">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="panel alza overflow-hidden">
              <Image
                src="/images/nosotros-estudio.jpg"
                alt="Estructura de hormigón arriostrada en obra al atardecer, con luces de trabajo"
                width={1920}
                height={1072}
                className="size-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="equipo" tone="panel">
        <SectionHead
          num="01"
          eyebrow="El equipo"
          title="Detrás de cada proyecto hay ingenieros con nombre y apellido"
          lead="Cada perfil enlaza a su LinkedIn para que sepas exactamente con quién trabajas."
        />
        <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPO.map((p, i) => (
            <Reveal key={p.nombre} delay={(i % 3) * 0.06}>
              <article className="panel alza h-full p-7 text-center">
                <div className="mx-auto mb-5 size-36 overflow-hidden rounded-full border-2 border-naranja/50 bg-crema md:size-44">
                  <Image src={p.foto} alt={p.nombre} width={360} height={360} className="size-full object-cover" />
                </div>
                <p className="font-heading text-[17px] font-bold text-navy">{p.nombre}</p>
                <p className="mt-0.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-naranja">{p.cargo}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-tinta-suave">{p.bio}</p>
                <a
                  href={p.linkedin}
                  target="_blank"
                  rel="noopener"
                  aria-label={`LinkedIn de ${p.nombre}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[12px] font-semibold text-azul transition-colors hover:border-naranja hover:text-naranja"
                >
                  <IconoLinkedIn /> LinkedIn
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="acreditaciones" tone="navy" fondoVimeo={{ id: "1223019550", aspect: 9 / 16, poster: "/images/posters/esc1.jpg" }}>
        <SectionHead
          dark
          num="02"
          eyebrow="Acreditaciones"
          title="Partner y Centro de Formación Autorizado de Autodesk"
          lead="Trabajamos con licencias oficiales, versiones vigentes y flujos alineados al estándar del fabricante. Los certificados que emitimos son verificables digitalmente."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            ["Autodesk Learning Partner", "Formación oficial sobre el ecosistema Autodesk: Revit, Navisworks, Robot y Dynamo."],
            ["Authorized Training Center", "Instructores certificados y contenidos alineados a los estándares del fabricante."],
            ["Avales universitarios", "Doctrina Qualitas, Círculo de Universidades Hispanoamericanas, Sabal University, UAIII y más — con validez en EE.UU. y Europa."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.07}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <span className="font-heading text-[13px] font-bold text-naranja-claro" aria-hidden>{String(i + 1).padStart(2, "0")}/</span>
                <h3 className="mt-2 text-lg font-bold text-white">{t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/70">{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead num="03" eyebrow="Confían en nosotros" title="Empresas que trabajan con Design Modeling" />
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {CLIENTES.map((c, i) => (
            <Reveal key={c.alt} delay={i * 0.05}>
              <div className={`alza flex aspect-square items-center justify-center rounded-2xl border p-6 sm:aspect-[4/3] ${c.dark ? "border-navy bg-navy" : "border-border bg-white"}`}>
                <Image src={c.src} alt={c.alt} width={320} height={200} className="max-h-24 w-auto max-w-full object-contain" />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <p className="text-[14px] text-tinta-suave">
            ¿Buscas formación en BIM para ti o tu equipo?{" "}
            <a href={ACADEMIA} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-heading font-bold text-naranja hover:text-azul">
              Design Modeling Academy <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </p>
        </Reveal>
      </Section>

      <CtaFinal title="Conversemos de tu proyecto" text="Te damos un diagnóstico honesto de lo que encontramos, sin costo y sin compromiso." />
    </>
  );
}
