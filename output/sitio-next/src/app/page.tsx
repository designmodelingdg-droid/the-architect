import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal, HeroReveal } from "@/components/site/reveal";
import { AvalesMarquee } from "@/components/site/marquee";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { CLIENTES } from "@/lib/site";

const SERVICIOS = [
  {
    img: "/images/dm-servicio-estructural.jpg",
    title: "Cálculo Estructural",
    desc: "Estructuras sismorresistentes para edificaciones nuevas y rehabilitación de existentes, con memoria de cálculo defendible ante cualquier revisión.",
    href: "/servicios#calculo",
  },
  {
    img: "/images/dm-servicio-arquitectura.jpg",
    title: "Arquitectura y Planos",
    desc: "Planos arquitectónicos con instalaciones eléctricas, sanitarias e hidráulicas, listos para trámite municipal y para construir.",
    href: "/servicios#arquitectura",
  },
  {
    img: "/images/dm-servicio-coordinacion.jpg",
    title: "Modelado y Coordinación BIM",
    desc: "Modelo federado de las tres disciplinas con detección sistemática de interferencias, y actualización durante la ejecución de obra.",
    href: "/servicios#coordinacion",
  },
  {
    img: "/images/dm-servicio-implementacion.jpg",
    title: "Implementación BIM en tu empresa",
    desc: "Diagnóstico, estándares, flujos y capacitación para que tu organización trabaje en BIM sin improvisar.",
    href: "/servicios#implementacion",
  },
];

const PROBLEMAS = [
  {
    title: "Retrabajo en sitio",
    desc: "Demoler, reubicar y volver a ejecutar lo que ya estaba construido. Materiales pagados dos veces y una cuadrilla parada mientras se decide qué hacer.",
  },
  {
    title: "Frentes detenidos",
    desc: "El ducto choca con la viga. La estructura dice una cosa, instalaciones otra. El frente se congela hasta que alguien cede, y el cronograma se corre solo.",
  },
  {
    title: "Adicionales que no negocias",
    desc: "Cada cambio no previsto entra como adicional. Y los adicionales, cuando la obra ya arrancó, nunca se negocian a tu favor.",
  },
];

const PASOS = [
  { n: "01", t: "Diagnóstico", d: "Revisamos tu proyecto y te decimos qué encontramos: riesgos, vacíos de información y qué se puede optimizar. Sin costo." },
  { n: "02", t: "Propuesta cerrada", d: "Alcance, entregables, plazos y precio por escrito. Si algo cambia, se conversa antes — no aparece en la factura." },
  { n: "03", t: "Ejecución", d: "Modelamos, calculamos y coordinamos. Tú sigues el avance real en DG BIM Intelligence, sin pedir reportes." },
  { n: "04", t: "Entrega", d: "Modelo federado, planos, memorias y reportes. Y si quieres, la plataforma queda activa para tu equipo." },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
        <Image src="/images/dm-hero.jpg" alt="" fill priority sizes="100vw" className="object-cover" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/82 to-azul/72" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5">
          <HeroReveal>
            <span className="mb-4 inline-block rounded-full border border-naranja-claro/40 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[2.5px] text-naranja-claro">
              Consultoría BIM · Ecuador y Latinoamérica
            </span>
          </HeroReveal>
          <HeroReveal delay={0.08}>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] md:text-6xl">
              Ingeniería estructural y BIM para proyectos que{" "}
              <em className="not-italic text-naranja-claro">no admiten sorpresas</em>
            </h1>
          </HeroReveal>
          <HeroReveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/87 md:text-lg">
              Diseñamos, calculamos y coordinamos proyectos estructurales y arquitectónicos con
              metodología BIM. Diez años resolviendo en el modelo lo que a otros les aparece en obra.
            </p>
          </HeroReveal>
          <HeroReveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/servicios" data-btn className="rounded-lg bg-naranja px-7 py-3.5 font-heading text-[15px] font-bold text-white hover:bg-naranja-claro">
                Ver nuestros servicios
              </Link>
              <Link href="/contactos" data-btn className="rounded-lg border-2 border-white/60 px-7 py-3.5 font-heading text-[15px] font-bold text-white hover:bg-white/12">
                Agenda tu diagnóstico
              </Link>
            </div>
          </HeroReveal>
          <HeroReveal delay={0.34}>
            <dl className="mt-11 grid max-w-xl grid-cols-3 gap-3.5">
              {[
                ["10+", "Años en proyectos BIM"],
                ["Autodesk", "Partner autorizado"],
                ["ARQ/EST/MEP", "Coordinación completa"],
              ].map(([num, label]) => (
                <div key={label} className="rounded-xl border border-white/12 bg-white/5 px-3 py-4 text-center">
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-heading text-sm font-extrabold text-naranja-claro md:text-lg">{num}</dd>
                  <dd className="mt-1 text-[10.5px] uppercase tracking-wide text-white/68">{label}</dd>
                </div>
              ))}
            </dl>
          </HeroReveal>
        </div>
      </section>

      <AvalesMarquee />

      <Section>
        <SectionHead
          eyebrow="Qué hacemos"
          title="Consultoría BIM de punta a punta"
          lead="Desde el cálculo de la estructura hasta la implementación de BIM en toda tu organización. Puedes contratar una pieza o el proceso completo."
        />
        <div className="mt-11 grid gap-5 md:grid-cols-2">
          {SERVICIOS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <article className="group overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-xl hover:shadow-azul/10">
                <div className="aspect-video overflow-hidden bg-navy">
                  <Image
                    src={s.img}
                    alt={s.title}
                    width={900}
                    height={506}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-azul">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{s.desc}</p>
                  <Link href={s.href} className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-naranja transition-colors hover:text-azul">
                    Ver el servicio →
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-9 text-center">
          <Link href="/servicios" data-btn className="inline-block rounded-lg border-2 border-azul px-6 py-3 font-heading text-sm font-bold text-azul hover:bg-azul hover:text-white">
            Ver todos los servicios
          </Link>
        </Reveal>
      </Section>

      <Section tone="oscuro">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja-claro">Nuestra plataforma</span>
            <h2 className="text-3xl font-bold md:text-4xl">DG BIM Intelligence</h2>
            <p className="mt-4 leading-relaxed text-white/85 md:text-lg">
              La desarrollamos porque ninguna herramienta del mercado nos daba lo que necesitábamos.
              Hoy la usamos en nuestros proyectos y la ofrecemos a nuestros clientes.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                ["Detección de interferencias", "Conflictos entre arquitectura, estructura e instalaciones, clasificados por severidad."],
                ["Control de calidad del modelo", "Elementos sin clasificar, propiedades incompletas y warnings, antes de que el modelo llegue a obra."],
                ["Un tablero para cada rol", "El modelador ve su modelo, el coordinador los conflictos, la gerencia el avance."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-naranja-claro" aria-hidden />
                  <div>
                    <strong className="font-heading text-[15px] text-white">{t}</strong>
                    <p className="text-sm leading-relaxed text-white/78">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/dg-bim-intelligence" data-btn className="mt-7 inline-block rounded-lg bg-naranja px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-naranja-claro">
              Conocer la plataforma
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
              <Image src="/images/dm-plataforma.jpg" alt="DG BIM Intelligence — panel de control del proyecto" width={1400} height={800} className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="crema">
        <SectionHead
          eyebrow="El costo real"
          title="El error no está en el plano. Está en lo que nadie revisó a tiempo."
          lead="Los proyectos no se salen de presupuesto por una mala decisión de diseño. Se salen por conflictos entre disciplinas que nadie vio hasta que la cuadrilla ya estaba en sitio."
        />
        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {PROBLEMAS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <article className="h-full rounded-xl border border-border border-l-4 border-l-naranja bg-white p-6">
                <h3 className="text-lg font-bold text-azul">{p.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{p.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Cómo trabajamos"
          title="Cuatro pasos, sin sorpresas a mitad de camino"
          lead="Sabes desde el primer día qué recibes, cuándo lo recibes y cuánto cuesta."
        />
        <ol className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.06}>
              <li className="h-full rounded-xl border border-border bg-crema p-6">
                <span className="font-heading text-3xl font-extrabold text-naranja-palido" aria-hidden>{p.n}</span>
                <h3 className="mt-2 text-base font-bold text-azul">{p.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{p.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="crema">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="overflow-hidden rounded-2xl shadow-xl shadow-azul/15">
              <Image src="/images/dm-pg-empresa.jpg" alt="Estudio de ingeniería de Design Modeling DG" width={1600} height={900} className="size-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja">Quiénes somos</span>
            <h2 className="text-3xl font-bold leading-tight text-azul md:text-4xl">Una consultora dirigida por dos ingenieros, no por un comercial</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
              Diez años diseñando y modelando estructuras con metodología BIM. Somos Partner y Centro
              de Formación Autorizado de Autodesk, y quien firma tu proyecto es quien lo revisa.
            </p>
            <Link href="/quienes-somos" className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-naranja transition-colors hover:text-azul">
              Conocer al equipo →
            </Link>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Confían en nosotros" title="Empresas y organizaciones que trabajan con Design Modeling" />
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CLIENTES.map((c, i) => (
            <Reveal key={c.alt} delay={i * 0.05}>
              <div className={`flex aspect-[3/2] items-center justify-center rounded-xl border p-4 ${c.dark ? "border-navy bg-navy" : "border-border bg-crema"}`}>
                <Image src={c.src} alt={c.alt} width={160} height={100} className="max-h-14 w-auto object-contain" />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Link href="/acreditaciones" data-btn className="inline-block rounded-lg border-2 border-azul px-6 py-3 font-heading text-sm font-bold text-azul hover:bg-azul hover:text-white">
            Ver nuestras acreditaciones
          </Link>
        </Reveal>
      </Section>

      <Section tone="palido">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja">También formamos equipos</span>
            <h2 className="text-3xl font-bold leading-tight text-azul md:text-4xl">Design Modeling Academy</h2>
            <p className="mt-4 leading-relaxed text-[#37536b] md:text-lg">
              Además de la consultoría, formamos a los profesionales del sector: másters, diplomados
              universitarios y especializaciones en BIM, avalados por Autodesk y universidades
              internacionales. Si lo que buscas es capacitar a tu equipo, ese es el camino.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener" data-btn className="rounded-lg bg-azul px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-azul-medio">
                Ver la academia
              </a>
              <Link href="/bolsa-de-trabajo" data-btn className="rounded-lg border-2 border-azul px-6 py-3.5 font-heading text-sm font-bold text-azul hover:bg-azul hover:text-white">
                Bolsa de trabajo
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl shadow-xl shadow-azul/15">
              <Image src="/images/dm-pg-acreditaciones.jpg" alt="Certificaciones y diplomas internacionales" width={1600} height={900} className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      <ContactoBloque />
    </>
  );
}
