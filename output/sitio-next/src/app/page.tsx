import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal, HeroReveal } from "@/components/site/reveal";
import { AvalesMarquee } from "@/components/site/marquee";
import { AgentPanel } from "@/components/site/agent-panel";
import { DataStrip } from "@/components/site/data-strip";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { ACADEMIA } from "@/lib/site";

const SERVICIOS = [
  {
    img: "/images/v2-calculo.jpg",
    title: "Cálculo Estructural",
    desc: "Estructuras sismorresistentes con memoria de cálculo defendible. Diseño nuevo, evaluación y rehabilitación de existentes.",
    href: "/consultoria#calculo",
    code: "SRV.01",
  },
  {
    img: "/images/v2-planos.jpg",
    title: "Arquitectura y Planos",
    desc: "Documentación completa con instalaciones, lista para trámite municipal y para construir — no para volver a dibujar.",
    href: "/consultoria#arquitectura",
    code: "SRV.02",
  },
  {
    img: "/images/v2-clash.jpg",
    title: "Coordinación BIM",
    desc: "Modelo federado y detección sistemática de interferencias entre disciplinas, con criterio para decidir qué elemento cede.",
    href: "/consultoria#coordinacion",
    code: "SRV.03",
  },
  {
    img: "/images/v2-implementacion.jpg",
    title: "Implementación BIM",
    desc: "Estándares, flujos y capacitación para que tu organización trabaje en BIM sin improvisar, con acompañamiento del piloto.",
    href: "/consultoria#implementacion",
    code: "SRV.04",
  },
];

const COSTOS = [
  ["5–10%", "del proyecto se va en rework", "El retrabajo por errores de coordinación consume el margen antes de que lo veas venir."],
  ["US$1.080", "cuesta cada RFI en promedio", "Cada solicitud de información que nace de un conflicto no resuelto tiene precio."],
  ["5–10×", "más caro corregir en obra", "El mismo error cuesta horas en el modelo y semanas cuando ya está construido."],
];

const PASOS = [
  { n: "01.00", t: "Diagnóstico", d: "Revisamos tu proyecto y te decimos qué encontramos: riesgos, vacíos y qué se puede optimizar. Sin costo." },
  { n: "02.00", t: "Propuesta cerrada", d: "Alcance, entregables, plazos y precio por escrito. Si algo cambia, se conversa antes." },
  { n: "03.00", t: "Ejecución", d: "Modelamos, calculamos y coordinamos. Tú sigues el avance real en DG BIM Intelligence." },
  { n: "04.00", t: "Entrega", d: "Modelo federado, planos, memorias y reportes. La plataforma puede quedar activa para tu equipo." },
];

export default function Home() {
  return (
    <>
      <section className="blueprint-fino relative overflow-hidden bg-navy py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 size-[560px] rounded-full bg-naranja/8 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <HeroReveal>
              <span className="tag-tech mb-5 inline-flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 rounded-full bg-naranja-claro" />
                Consultoría BIM + IA · Ecuador y Latinoamérica
              </span>
            </HeroReveal>
            <HeroReveal delay={0.08}>
              <h1 className="text-[2.6rem] font-bold leading-[1.02] text-white md:text-[3.9rem]">
                El criterio de 10 años de BIM Management,{" "}
                <span className="text-naranja-claro">razonando en cada proyecto.</span>
              </h1>
            </HeroReveal>
            <HeroReveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-tinta-suave md:text-lg">
                Calculamos, coordinamos y auditamos proyectos estructurales con metodología BIM — y
                con DG BIM Intelligence, nuestro agente de IA entrenado con criterio real de
                ingeniería, los conflictos se cazan en el modelo, no en la obra.
              </p>
            </HeroReveal>
            <HeroReveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contactos" data-btn className="rounded-lg bg-naranja px-7 py-3.5 font-heading text-[15px] font-bold text-white shadow-lg shadow-naranja/25 hover:bg-naranja-claro">
                  Agenda tu diagnóstico
                </Link>
                <Link href="/dg-bim-intelligence" data-btn className="rounded-lg border border-white/25 px-7 py-3.5 font-heading text-[15px] font-bold text-white hover:border-naranja-claro hover:text-naranja-claro">
                  Conoce la plataforma
                </Link>
              </div>
            </HeroReveal>
          </div>
          <HeroReveal delay={0.35}>
            <AgentPanel />
          </HeroReveal>
        </div>
      </section>

      <DataStrip
        items={[
          ["10+", "años en proyectos BIM"],
          ["ARQ/EST/MEP", "coordinación completa"],
          ["24/7", "agente razonando"],
          ["Autodesk", "partner autorizado"],
        ]}
      />

      <Section tone="panel">
        <SectionHead
          num="§01"
          eyebrow="El costo del error"
          title="El error no está en el plano. Está en lo que nadie revisó a tiempo."
          lead="Los proyectos no se salen de presupuesto por una mala decisión de diseño. Se salen por conflictos entre disciplinas que nadie vio hasta que la cuadrilla ya estaba en sitio."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {COSTOS.map(([num, label, desc], i) => (
            <Reveal key={label} delay={i * 0.08}>
              <article className="panel h-full p-7">
                <p className="font-heading text-4xl font-extrabold text-naranja-claro md:text-5xl">{num}</p>
                <p className="font-mono-tech mt-2 text-[11px] uppercase tracking-[0.12em] text-tinta/85">{label}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-tinta-suave">{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="blueprint">
        <SectionHead
          num="§02"
          eyebrow="Consultoría"
          title="Cuatro servicios. Un mismo estándar de criterio."
          lead="Desde el cálculo de la estructura hasta la implementación de BIM en toda tu organización. Cada servicio se entrega con visibilidad total en nuestra plataforma."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {SERVICIOS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <Link href={s.href} className="group block">
                <article className="panel h-full overflow-hidden transition-shadow duration-300 group-hover:panel-glow">
                  <div className="relative aspect-[16/8.5] overflow-hidden">
                    <Image
                      src={s.img}
                      alt={s.title}
                      width={1100}
                      height={585}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="font-mono-tech absolute left-4 top-4 rounded bg-navy/80 px-2 py-1 text-[10px] tracking-[0.14em] text-naranja-claro backdrop-blur">
                      {s.code}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="flex items-center justify-between text-xl font-bold text-white">
                      {s.title}
                      <ArrowUpRight className="size-4 text-naranja-claro opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-tinta-suave">{s.desc}</p>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="panel">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="tag-tech mb-4 inline-flex items-center gap-2.5">
              <span className="text-tinta-suave">§03</span>
              <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
              Nuestra plataforma
            </span>
            <h2 className="text-3xl font-bold leading-[1.1] text-white md:text-[2.6rem]">
              No es un chatbot. Es un consultor BIM que razona.
            </h2>
            <p className="mt-4 leading-relaxed text-tinta-suave md:text-lg">
              DG BIM Intelligence lee tu proyecto, razona paso a paso con el criterio de +10 años de
              BIM Management y te dice qué hacer y por qué — con evidencia, impacto y nivel de
              confianza en cada hallazgo.
            </p>
            <ul className="mt-6 space-y-3.5">
              {[
                "Detección de interferencias clasificadas por severidad, con responsable asignado",
                "Control de calidad del modelo antes de que llegue a obra",
                "Tableros por rol: modelador, coordinador, gerencia y dueño",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[15px] text-tinta/90">
                  <Check className="mt-1 size-4 shrink-0 text-naranja-claro" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/dg-bim-intelligence" data-btn className="mt-7 inline-block rounded-lg bg-naranja px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-naranja-claro">
              Ver cómo razona
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
            <AgentPanel />
          </Reveal>
        </div>
      </Section>

      <Section tone="blueprint">
        <SectionHead
          num="§04"
          eyebrow="Cómo trabajamos"
          title="Cuatro pasos, sin sorpresas a mitad de camino"
          lead="Sabes desde el primer día qué recibes, cuándo lo recibes y cuánto cuesta."
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.06}>
              <li className="panel h-full p-6">
                <span className="font-mono-tech text-[12px] tracking-[0.14em] text-naranja-claro" aria-hidden>{p.n}</span>
                <h3 className="mt-3 text-base font-bold text-white">{p.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-tinta-suave">{p.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHead
          num="§05"
          eyebrow="Proyectos"
          title="El criterio se demuestra en obra"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { img: "/images/v2-proy-torre.jpg", t: "Edificación en altura", d: "Cálculo sismorresistente y coordinación completa" },
            { img: "/images/v2-proy-nave.jpg", t: "Naves industriales", d: "Estructura metálica y análisis de pórticos" },
            { img: "/images/v2-proy-rehab.jpg", t: "Rehabilitación", d: "Evaluación sísmica y reforzamiento de existentes" },
          ].map((p, i) => (
            <Reveal key={p.t} delay={i * 0.07}>
              <Link href="/proyectos" className="group block">
                <article className="panel overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <Image src={p.img} alt={p.t} width={1600} height={900} className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-white">{p.t}</h3>
                    <p className="mt-1 text-[13px] text-tinta-suave">{p.d}</p>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-9 text-center">
          <Link href="/proyectos" data-btn className="inline-block rounded-lg border border-white/25 px-6 py-3 font-heading text-sm font-bold text-white hover:border-naranja-claro hover:text-naranja-claro">
            Ver los proyectos
          </Link>
        </Reveal>
      </Section>

      <AvalesMarquee />

      <div className="border-b border-white/8 bg-navy-2/60 px-5 py-5">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[13.5px] text-tinta-suave">
          ¿Buscas formarte en BIM en vez de contratar consultoría?
          <a href={ACADEMIA} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-heading font-bold text-naranja-claro hover:text-white">
            Design Modeling Academy <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </p>
      </div>

      <ContactoBloque />
    </>
  );
}
