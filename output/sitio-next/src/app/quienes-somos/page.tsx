import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { AvalesMarquee } from "@/components/site/marquee";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";
import { CLIENTES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Consultora de ingeniería estructural y BIM dirigida por los ingenieros Dayana Calderón y Gabriel Pantoja. Diez años de proyectos en Ecuador y Latinoamérica.",
};

export default function QuienesSomos() {
  return (
    <>
      <PageHero
        eyebrow="Quiénes somos"
        title="Una consultora dirigida por ingenieros"
        lead="Diez años diseñando y modelando estructuras con metodología BIM para proyectos en Ecuador y Latinoamérica. Quien firma tu proyecto es quien lo revisa."
        image="/images/dm-pg-empresa.jpg"
        crumb={{ label: "Quiénes somos", href: "/quienes-somos" }}
      />
      <AvalesMarquee />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja">La empresa</span>
            <h2 className="text-3xl font-bold leading-tight text-azul md:text-4xl">Qué hacemos y para quién</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
              Somos una empresa dedicada al diseño y modelado de estructuras, enfocada en desarrollar
              proyectos de ingeniería con metodología BIM para diseños arquitectónicos y estructurales,
              con el compromiso de entregar soluciones inteligentes y económicas a nuestros clientes.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground md:text-lg">
              Trabajamos con constructoras, promotoras, estudios de arquitectura y propietarios que
              necesitan que su proyecto llegue a obra sin conflictos entre disciplinas.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl shadow-xl shadow-azul/15">
              <Image src="/images/dm-servicio-coordinacion.jpg" alt="Modelo BIM federado" width={900} height={663} className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="crema">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Nuestra política", "Desarrollamos eficientemente los proyectos de ingeniería y arquitectura. Nos motiva la satisfacción de nuestros clientes y colaboradores, y nos inspira servir superando sus expectativas en tiempo, costo, cantidad y calidad requerida."],
            ["Nuestra visión", "Lograr un segmento importante en el área de la construcción e ingeniería a nivel nacional e internacional, caracterizándonos por la innovación en el diseño y desarrollo de proyectos, a partir del uso de nuevas tecnologías."],
            ["Nuestra misión", "Ejecutar proyectos con metodología BIM y tecnología propia, brindando servicios de asesoría que mejoren los procesos constructivos y aporten a la sostenibilidad y al desarrollo de la economía."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.07}>
              <article className="h-full rounded-xl border border-border border-l-4 border-l-naranja bg-white p-6">
                <h3 className="text-lg font-bold text-azul">{t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Quiénes respondemos" title="Detrás de cada proyecto hay dos ingenieros con nombre y apellido" />
        <div className="mx-auto mt-11 grid max-w-4xl gap-6 md:grid-cols-2">
          {[
            {
              foto: "/images/dayana.png",
              nombre: "Ing. Dayana Calderón Brunetti",
              rol: "Fundadora y CEO · Design Modeling DG",
              bio: "Lidero la optimización administrativa y operativa de los proyectos, integrando procesos y tecnología para que cada cliente reciba resultados verificables y no solo entregables.",
            },
            {
              foto: "/images/gabriel.png",
              nombre: "Ing. Gabriel Pantoja",
              rol: "Cofundador · Director técnico BIM",
              bio: "Ingeniero Civil especializado en BIM Management y estructuras, con amplia experiencia en la integración de tecnologías Autodesk. Dirijo la parte técnica de cada proyecto que entra.",
            },
          ].map((p, i) => (
            <Reveal key={p.nombre} delay={i * 0.08}>
              <article className="h-full rounded-2xl border border-border bg-white p-7 shadow-sm">
                <div className="mb-4 size-20 overflow-hidden rounded-full border-[3px] border-naranja-palido bg-crema">
                  <Image src={p.foto} alt={p.nombre} width={160} height={160} className="size-full object-cover" />
                </div>
                <p className="text-[14.5px] leading-relaxed text-muted-foreground">{p.bio}</p>
                <p className="mt-4 font-heading text-[15px] font-bold text-azul">{p.nombre}</p>
                <p className="text-[12.5px] font-semibold text-naranja">{p.rol}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="crema">
        <SectionHead eyebrow="Confían en nosotros" title="Empresas y organizaciones que trabajan con Design Modeling" />
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CLIENTES.map((c, i) => (
            <Reveal key={c.alt} delay={i * 0.05}>
              <div className={`flex aspect-[3/2] items-center justify-center rounded-xl border p-4 ${c.dark ? "border-navy bg-navy" : "border-border bg-white"}`}>
                <Image src={c.src} alt={c.alt} width={160} height={100} className="max-h-14 w-auto object-contain" />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="palido">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja">La otra mitad</span>
            <h2 className="text-3xl font-bold leading-tight text-azul md:text-4xl">También formamos a los profesionales del sector</h2>
            <p className="mt-4 leading-relaxed text-[#37536b] md:text-lg">
              A través de <strong>Design Modeling Academy</strong> impartimos másters, diplomados
              universitarios internacionales y especializaciones en BIM, avalados por Autodesk y
              universidades internacionales, para toda Latinoamérica.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener" data-btn className="rounded-lg bg-azul px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-azul-medio">
                Ver la academia
              </a>
              <Link href="/acreditaciones" data-btn className="rounded-lg border-2 border-azul px-6 py-3.5 font-heading text-sm font-bold text-azul hover:bg-azul hover:text-white">
                Nuestras acreditaciones
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl shadow-xl shadow-azul/15">
              <Image src="/images/dm-pg-acreditaciones.jpg" alt="Certificaciones internacionales" width={1600} height={900} className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaFinal title="Conversemos de tu proyecto" text="Te damos un diagnóstico honesto de lo que encontramos, sin costo y sin compromiso." />
    </>
  );
}
