import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { AvalesMarquee } from "@/components/site/marquee";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";
import { FAMILIAS } from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Consultoría BIM",
  description:
    "Catálogo completo de consultoría BIM: ingeniería estructural, arquitectura y documentación, coordinación BIM, implementación y BIM + IA con DG BIM Intelligence.",
};

const DETALLE: Record<string, string> = {
  estructural:
    "Diseñamos y evaluamos estructuras sismorresistentes siguiendo códigos nacionales e internacionales. Desde la fase conceptual hasta la ingeniería de detalle, con memorias de cálculo defendibles en cualquier revisión.",
  arquitectura:
    "Documentación arquitectónica completa, lista para trámite municipal y para construir — no para volver a dibujar.",
  coordinacion:
    "Modelo federado de las tres disciplinas y detección sistemática de interferencias, con criterio estructural para decidir qué elemento cede.",
  implementacion:
    "Si tu organización quiere trabajar en BIM y no sabe por dónde empezar, acompañamos el proceso hasta que tu equipo camine solo.",
  "bim-ia":
    "El plus que ninguna otra consultora te da: cada servicio se entrega con DG BIM Intelligence, y también lo licenciamos como software independiente para empresas con equipo BIM propio.",
};

const FAQ = [
  ["¿Trabajan con proyectos que ya están en ejecución?", "Sí, y es más común de lo que parece. Hacemos levantamiento BIM de lo que ya está construido y modelamos lo que falta, para que el resto de la obra se coordine sobre información real y no sobre planos que ya cambiaron."],
  ["Ya tenemos un modelador interno. ¿Para qué los necesitamos?", "Modelar y coordinar son cosas distintas. Un modelador construye su disciplina; la coordinación consiste en cruzar todas las disciplinas y resolver los conflictos, con criterio estructural para decidir qué elemento cede."],
  ["¿Cuánto cuesta una consultoría BIM?", "Depende del alcance, la superficie y las disciplinas involucradas. Lo que sí es fijo: después del diagnóstico recibes una propuesta cerrada por escrito con alcance, plazos y precio. El diagnóstico no tiene costo."],
  ["¿Qué papel juega la IA en el servicio?", "DG BIM Intelligence trabaja como apoyo a la decisión: organiza hallazgos con evidencia, impacto y nivel de confianza. El criterio final siempre es de un ingeniero — la IA nos hace más rápidos y sistemáticos, no reemplaza el juicio profesional."],
  ["¿Trabajan fuera de Ecuador?", "Sí. Atendemos proyectos en toda Latinoamérica de forma remota, que es como se trabaja BIM de todas formas. La coordinación se hace sobre el modelo y las reuniones son por videollamada."],
  ["¿Qué necesitan de nosotros para empezar?", "Para el diagnóstico basta con lo que tengas hoy: planos en PDF o CAD, un modelo en Revit, o incluso solo la descripción del proyecto y sus plazos."],
];

const SI = [
  "Tienes un proyecto de edificación y quieres el cálculo estructural y los planos resueltos con criterio técnico.",
  "Ya trabajas con modelos BIM pero las interferencias siguen apareciendo en obra.",
  "Eres constructora o promotora y quieres implementar BIM en tu operación sin improvisar.",
  "Necesitas visibilidad real del avance de un proyecto que hoy solo ves en reuniones semanales.",
  "Tienes una edificación existente y necesitas levantamiento y evaluación sísmica.",
];
const NO = [
  "Buscas únicamente el precio más bajo del mercado, sin importar el criterio técnico detrás.",
  "Necesitas un plano firmado hoy mismo sin revisión previa del proyecto.",
  "Quieres formarte en BIM en vez de contratar el servicio — para eso está nuestra academia.",
  "Aún no tienes definido el alcance del proyecto ni quién toma las decisiones.",
];

export default function Consultoria() {
  return (
    <>
      <PageHero
        num="01"
        eyebrow="Consultoría"
        title="Un catálogo completo de consultoría BIM"
        lead="Cinco familias de servicios que cubren el proyecto de punta a punta: del cálculo estructural a la inteligencia artificial aplicada. Diseño sismorresistente según códigos nacionales e internacionales, y cada servicio entregado con visibilidad total en DG BIM Intelligence."
        crumb={{ label: "Consultoría", href: "/consultoria" }}
      />
      <AvalesMarquee />

      {FAMILIAS.map((f, i) => (
        <Section key={f.slug} id={f.slug} tone={i % 2 ? "panel" : "base"}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal className={i % 2 ? "lg:order-2" : ""}>
              <div className="flex items-baseline gap-4">
                <span className="num-seccion" aria-hidden>{f.num}/</span>
                <span className="tag-tech">Servicio</span>
              </div>
              <h2 className="mt-2 text-3xl font-bold leading-tight text-navy md:text-4xl">{f.label}</h2>
              <p className="mt-4 leading-relaxed text-tinta-suave md:text-lg">{DETALLE[f.slug] ?? f.resumen}</p>
              <ul className="mt-6 space-y-2.5">
                {f.servicios.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] text-tinta">
                    <Check className="mt-1 size-4 shrink-0 text-naranja" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              {f.href ? (
                <Link
                  href={f.href}
                  className="mt-6 inline-flex items-center gap-1.5 font-heading text-[13px] font-bold uppercase tracking-[0.08em] text-naranja hover:text-azul"
                >
                  Conoce la plataforma <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : null}
            </Reveal>
            <Reveal delay={0.1} className={i % 2 ? "lg:order-1" : ""}>
              <div className="panel overflow-hidden">
                <Image src={f.img} alt={f.label} width={1100} height={825} className="size-full object-cover" />
              </div>
            </Reveal>
          </div>
        </Section>
      ))}

      <Section tone="navy">
        <SectionHead
          dark
          eyebrow="Capacidad técnica"
          title="Qué tipo de estructuras diseñamos"
          lead="Nuestra experiencia cubre los sistemas y materiales que se usan realmente en la construcción de la región."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            ["Materiales", "Acero laminado en caliente · Acero laminado en frío · Mampostería estructural · Hormigón armado · Estructuras compuestas"],
            ["Sistemas estructurales", "Pórticos a momento · Pórticos arriostrados · Sistemas duales · Muros de corte · Aislamiento sísmico"],
            ["Tipologías", "Edificaciones en altura · Naves industriales · Silos y tanques · Vivienda · Rehabilitación de existentes"],
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

      <Section tone="panel">
        <SectionHead
          eyebrow="Antes de agendar"
          title="¿Somos el equipo para tu proyecto?"
          lead="Preferimos decirlo claro desde el inicio en vez de descubrirlo a mitad del contrato."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="panel h-full border-l-2 border-l-naranja p-7">
              <h3 className="text-lg font-bold text-navy">Sí, si estás en esta situación</h3>
              <ul className="mt-4 space-y-3">
                {SI.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed text-tinta">
                    <Check className="mt-0.5 size-4 shrink-0 text-naranja" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="panel h-full border-l-2 border-l-border p-7">
              <h3 className="text-lg font-bold text-tinta-suave">Probablemente todavía no</h3>
              <ul className="mt-4 space-y-3">
                {NO.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed text-tinta-suave">
                    <Minus className="mt-0.5 size-4 shrink-0 text-tinta-suave/60" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Preguntas frecuentes" title="Lo que nos preguntan antes de contratar" />
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-2.5">
            {FAQ.map(([q, a], i) => (
              <AccordionItem key={q} value={`faq-${i}`} className="panel border-border px-5">
                <AccordionTrigger className="py-4 text-left font-heading text-[15px] font-semibold text-navy hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-[14.5px] leading-relaxed text-tinta-suave">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Section>

      <CtaFinal />
    </>
  );
}
