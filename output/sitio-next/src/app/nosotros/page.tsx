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
            <div className="panel overflow-hidden">
              <Image src="/images/v2-nosotros.jpg" alt="Estudio de ingeniería de Design Modeling DG" width={1600} height={900} className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="equipo" tone="panel">
        <SectionHead
          num="01"
          eyebrow="El equipo"
          title="Detrás de cada proyecto hay ingenieros con nombre y apellido"
          lead="Cada perfil enlaza a su LinkedIn para que sepas exactamente con quién trabajas. El equipo completo se irá sumando aquí."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {EQUIPO.map((p) => (
            <Reveal key={p.nombre}>
              <article className="panel h-full p-7">
                <div className="mb-4 size-20 overflow-hidden rounded-full border-2 border-naranja/50 bg-crema">
                  <Image src={p.foto} alt={p.nombre} width={160} height={160} className="size-full object-cover" />
                </div>
                <p className="text-[14.5px] leading-relaxed text-tinta-suave">{p.bio}</p>
                <p className="mt-4 font-heading text-[15px] font-bold text-navy">{p.nombre}</p>
                <p className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-naranja">{p.cargo}</p>
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

      <Section id="acreditaciones" tone="navy">
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
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CLIENTES.map((c, i) => (
            <Reveal key={c.alt} delay={i * 0.05}>
              <div className={`flex aspect-[3/2] items-center justify-center rounded-xl border p-4 ${c.dark ? "border-navy bg-navy" : "border-border bg-white"}`}>
                <Image src={c.src} alt={c.alt} width={160} height={100} className="max-h-12 w-auto object-contain" />
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
