import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check } from "lucide-react";
import { IconoLinkedIn } from "@/components/site/icono-linkedin";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal, HeroReveal } from "@/components/site/reveal";
import { AvalesMarquee } from "@/components/site/marquee";
import { AgentPanel } from "@/components/site/agent-panel";
import { VimeoFondo } from "@/components/site/vimeo-fondo";
import { CineBanda } from "@/components/site/cine-banda";
import { ParallaxFondo, ParallaxImg } from "@/components/site/parallax";
import { ZonaMouse, CapaMouse } from "@/components/site/zona-mouse";
import { DataStrip } from "@/components/site/data-strip";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { ACADEMIA, FAMILIAS, VERTICALES, EQUIPO } from "@/lib/site";

const PILARES = [
  { t: "Consultoría estructural", d: "Cálculo sismorresistente, evaluación de existentes y documentación lista para construir." },
  { t: "Metodología BIM", d: "Modelo federado, coordinación de disciplinas e implementación en tu organización." },
  { t: "Inteligencia artificial", d: "DG BIM Intelligence: nuestro software propio audita el proyecto con criterio de ingeniería." },
];

const COSTOS = [
  ["5–10%", "del proyecto se va en rework", "El retrabajo por errores de coordinación consume el margen antes de que lo veas venir."],
  ["US$1.080", "cuesta cada RFI en promedio", "Cada solicitud de información que nace de un conflicto no resuelto tiene precio."],
  ["5–10×", "más caro corregir en obra", "El mismo error cuesta horas en el modelo y semanas cuando ya está construido."],
];

export default function Home() {
  return (
    <>
      {/* Hero cinematográfico: video del edificio + panel del agente */}
      <ZonaMouse className="relative overflow-hidden border-b border-navy bg-navy py-20 md:py-28">
        <CapaMouse profundidad={22} className="absolute inset-0">
          <ParallaxFondo>
            <VimeoFondo id="1223019533" poster="/images/hero-poster.jpg" />
          </ParallaxFondo>
        </CapaMouse>
        {/* Degradados para legibilidad: navy desde la izquierda y desde abajo */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-navy/15" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy/80 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <CapaMouse profundidad={-7}>
            <HeroReveal>
              <span className="tag-tech mb-5 inline-block text-naranja-claro">
                Consultoría BIM + IA · Ecuador y Latinoamérica
              </span>
            </HeroReveal>
            <HeroReveal delay={0.08}>
              <h1 className="text-[2.6rem] font-bold leading-[1.04] text-white md:text-[3.7rem]">
                Aceleramos la transformación digital{" "}
                <span className="text-naranja-claro">de tus proyectos de construcción.</span>
              </h1>
            </HeroReveal>
            <HeroReveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                Consultoría BIM estructural y arquitectónica en todo el ciclo del proyecto — con un
                plus que ninguna otra consultora te da: DG BIM Intelligence, nuestro software de IA
                que razona sobre tu modelo con criterio real de ingeniería.
              </p>
            </HeroReveal>
            <HeroReveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contactos" data-btn className="rounded-lg bg-naranja px-7 py-3.5 font-heading text-[15px] font-bold text-white shadow-lg shadow-naranja/40 hover:bg-naranja-claro">
                  Agenda tu diagnóstico
                </Link>
                <Link href="/consultoria" data-btn className="rounded-lg border border-white/40 px-7 py-3.5 font-heading text-[15px] font-bold text-white hover:border-naranja-claro hover:text-naranja-claro">
                  Ver servicios
                </Link>
              </div>
            </HeroReveal>
          </CapaMouse>
          <HeroReveal delay={0.35}>
            <CapaMouse profundidad={-14}>
              <AgentPanel />
            </CapaMouse>
          </HeroReveal>
        </div>
      </ZonaMouse>

      <DataStrip
        items={[
          ["10+", "años en proyectos BIM"],
          ["+3.800", "profesionales formados"],
          ["ARQ/EST/MEP", "coordinación completa"],
          ["24/7", "agente de IA razonando"],
        ]}
      />

      {/* Tres pilares — banda navy */}
      <Section tone="navy">
        <SectionHead
          dark
          eyebrow="Consultoría — BIM — IA"
          title="Metodología BIM con un plus: software propio de IA"
          lead="Hacemos lo que hace una consultora BIM seria. Y además construimos la herramienta que interpreta tu proyecto y ayuda a tu equipo a decidir."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PILARES.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                <span className="font-heading text-[13px] font-bold text-naranja-claro" aria-hidden>{String(i + 1).padStart(2, "0")}/</span>
                <h3 className="mt-2 text-xl font-bold text-white">{p.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/70">{p.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Catálogo de servicios numerado estilo 01/–05/ */}
      <Section tone="base" id="servicios">
        <SectionHead
          eyebrow="Servicios"
          title="Un catálogo completo de consultoría BIM"
          lead="Cinco familias de servicios que cubren el proyecto de punta a punta — del cálculo estructural a la inteligencia artificial aplicada."
        />
        <div className="mt-14 space-y-14">
          {FAMILIAS.map((f, i) => (
            <Reveal key={f.slug}>
              <article className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="num-seccion" aria-hidden>{f.num}/</span>
                    <h3 className="text-2xl font-bold text-navy md:text-[1.7rem]">{f.label}</h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-tinta-suave md:text-lg">{f.resumen}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {f.servicios.map((s) => (
                      <li key={s} className="rounded-full border border-border bg-crema px-3.5 py-1.5 text-[12.5px] font-semibold text-tinta">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={f.href ?? `/consultoria#${f.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 font-heading text-[13px] font-bold uppercase tracking-[0.08em] text-naranja hover:text-azul"
                  >
                    Conocer más <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
                <ParallaxImg className="alza rounded-2xl border border-border shadow-lg shadow-navy/5">
                  <div className="relative aspect-[16/9.5]">
                    <Image src={f.img} alt={f.label} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                  </div>
                </ParallaxImg>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Banda cinematográfica: el video vertical de IA + clash a sangre completa */}
      <CineBanda
        vimeoId="1223019570"
        vimeoAspect={9 / 16}
        eyebrow="Modelado BIM + IA · Revit"
        titulo={
          <>
            Tu proyecto se modela <span className="text-naranja-claro">con inteligencia artificial.</span>
          </>
        }
        cta={{ href: "/dg-bim-intelligence", label: "Mira cómo lo hacemos" }}
      />

      {/* DG BIM Intelligence — banda navy estrella */}
      <Section tone="navy" id="plataforma">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <Reveal>
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
            <ul className="mt-6 space-y-3.5">
              {[
                "Detección de interferencias clasificadas por severidad, con responsable asignado",
                "Control de calidad del modelo antes de que llegue a obra",
                "Tableros por rol: modelador, coordinador, gerencia y dueño",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[15px] text-white/85">
                  <Check className="mt-1 size-4 shrink-0 text-naranja-claro" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/dg-bim-intelligence" data-btn className="mt-7 inline-block rounded-lg bg-naranja px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-naranja-claro">
              Conoce DG BIM Intelligence
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
            <figure className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/40">
              <Image
                src="/images/sw-agente.jpg"
                alt="DG BIM Intelligence: el Agente BIM respondiendo sobre un proyecto real, con hallazgo y evidencia"
                width={1600}
                height={954}
                className="size-full object-cover"
              />
              <figcaption className="border-t border-white/10 bg-navy-2 px-4 py-2.5 text-center font-heading text-[10.5px] font-bold uppercase tracking-[0.12em] text-azul-palido/60">
                Captura real de la plataforma — Agente BIM en un proyecto
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* El costo del error */}
      <Section tone="panel">
        <SectionHead
          eyebrow="Por qué importa"
          title="El error no está en el plano. Está en lo que nadie revisó a tiempo."
          lead="Los proyectos no se salen de presupuesto por una mala decisión de diseño. Se salen por conflictos entre disciplinas que nadie vio hasta que la cuadrilla ya estaba en sitio."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {COSTOS.map(([num, label, desc], i) => (
            <Reveal key={label} delay={i * 0.08}>
              <article className="panel h-full p-7">
                <p className="font-heading text-4xl font-extrabold text-naranja md:text-5xl">{num}</p>
                <p className="mt-2 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-tinta">{label}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-tinta-suave">{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Con quiénes trabajamos */}
      <Section tone="base">
        <SectionHead
          eyebrow="Con quiénes trabajamos"
          title="Soluciones para cada actor del proyecto"
          lead="Constructoras, promotoras, estudios y propietarios: cada uno recibe lo que necesita para que el proyecto llegue a obra sin conflictos entre disciplinas."
        />
        <div className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALES.map((v, i) => (
            <Reveal key={v.label} delay={i * 0.05}>
              <article className="border-t-2 border-border pt-5 transition-colors hover:border-naranja">
                <span className="font-heading text-[12px] font-bold text-naranja" aria-hidden>{i + 1}/</span>
                <h3 className="mt-1.5 text-lg font-bold text-navy">{v.label}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-tinta-suave">{v.detalle}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Proyectos destacados */}
      <Section tone="panel">
        <SectionHead
          eyebrow="Proyectos"
          title="El criterio se demuestra en obra"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { img: "/images/proy-piscina.jpg", t: "Piscina P-01 · Castillo del Sol", d: "Costa Rica · 2026 — vaso monolítico sobre 12 micropilotes, detalle constructivo real" },
            { img: "/images/proy-silos.jpg", t: "Silos Packaging & Process", d: "Quito–Brasil · 2020 — 8 silos de 120 t con ingeniería de detalle en Revit" },
            { img: "/images/proy-kayuko.jpg", t: "Edificio Kayuko", d: "Oaxaca, México · 2021 — 5 niveles en hormigón armado, Robot + Revit" },
          ].map((p, i) => (
            <Reveal key={p.t} delay={i * 0.07}>
              <Link href="/proyectos" className="group block">
                <article className="panel alza overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={p.img} alt={p.t} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="border-t border-border p-5">
                    <h3 className="text-base font-bold text-navy">{p.t}</h3>
                    <p className="mt-1 text-[13px] text-tinta-suave">{p.d}</p>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-9 text-center">
          <Link href="/proyectos" data-btn className="inline-block rounded-lg border border-azul/30 px-6 py-3 font-heading text-sm font-bold text-azul hover:border-naranja hover:text-naranja">
            Ver los proyectos
          </Link>
        </Reveal>
      </Section>

      {/* Equipo */}
      <Section tone="base">
        <SectionHead
          eyebrow="El equipo"
          title="Ingenieros con nombre, apellido y LinkedIn"
          lead="Quien firma tu proyecto es quien lo revisa. Conoce a las personas detrás de cada entrega."
        />
        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {EQUIPO.map((m, i) => (
            <Reveal key={m.nombre} delay={i * 0.08}>
              <article className="panel alza h-full p-7 text-center">
                <Image src={m.foto} alt={m.nombre} width={320} height={320} className="mx-auto size-36 rounded-full border-2 border-naranja/40 object-cover md:size-40" />
                <h3 className="mt-4 text-lg font-bold text-navy">{m.nombre}</h3>
                <p className="tag-tech mt-1">{m.cargo}</p>
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener"
                  aria-label={`LinkedIn de ${m.nombre}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[12px] font-semibold text-azul transition-colors hover:border-naranja hover:text-naranja"
                >
                  <IconoLinkedIn /> LinkedIn
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-9 text-center">
          <Link href="/nosotros#equipo" className="inline-flex items-center gap-1.5 font-heading text-[13px] font-bold uppercase tracking-[0.08em] text-naranja hover:text-azul">
            Conoce a todo el equipo <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </Section>

      <AvalesMarquee />

      <div className="border-b border-border bg-crema px-5 py-5">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[13.5px] text-tinta-suave">
          ¿Buscas formarte en BIM en vez de contratar consultoría?
          <a href={ACADEMIA} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-heading font-bold text-naranja hover:text-azul">
            Design Modeling Academy <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </p>
      </div>

      <ContactoBloque />
    </>
  );
}
