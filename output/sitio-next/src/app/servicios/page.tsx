import type { Metadata } from "next";
import Image from "next/image";
import { Check, Minus } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { AvalesMarquee } from "@/components/site/marquee";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Servicios de consultoría BIM",
  description:
    "Cálculo estructural sismorresistente, arquitectura y planos, modelado y coordinación BIM e implementación BIM en empresas. Ecuador y Latinoamérica.",
};

const SERVICIOS = [
  {
    id: "calculo",
    img: "/images/dm-servicio-estructural.jpg",
    n: "Servicio 01",
    title: "Cálculo Estructural",
    lead: "Diseñamos y evaluamos estructuras sismorresistentes siguiendo códigos nacionales e internacionales. El servicio abarca desde la fase conceptual hasta la ingeniería de detalle.",
    items: [
      "Diseño de nuevas edificaciones",
      "Estudios de factibilidad",
      "Evaluación del estado actual de estructuras existentes",
      "Rehabilitación y evaluación sísmica",
      "Diseño y análisis de vibración",
      "Evaluación del desempeño estructural",
    ],
  },
  {
    id: "arquitectura",
    img: "/images/dm-servicio-arquitectura.jpg",
    n: "Servicio 02",
    title: "Arquitectura y Planos",
    lead: "Documentación arquitectónica completa, lista para trámite municipal y para construir — no para volver a dibujar.",
    items: [
      "Planos arquitectónicos y de detalle constructivo",
      "Instalaciones eléctricas, sanitarias e hidráulicas",
      "Planos según normativa municipal",
      "Planos estructurales",
      "Plantas amobladas para presentación y venta de departamentos",
    ],
  },
  {
    id: "coordinacion",
    img: "/images/dm-servicio-coordinacion.jpg",
    n: "Servicio 03",
    title: "Modelado y Coordinación BIM",
    lead: "Modelo federado de las tres disciplinas y detección sistemática de interferencias, con criterio estructural para decidir qué elemento cede.",
    items: [
      "Modelado y diseño BIM de edificios y estructuras",
      "Levantamiento BIM de edificaciones y sus instalaciones",
      "BIM «in situ» para gestión de cambios durante la obra",
      "BIM aplicado al diseño y cálculo estructural",
      "Asesoría y dirección técnica del proceso",
    ],
  },
  {
    id: "implementacion",
    img: "/images/dm-servicio-implementacion.jpg",
    n: "Servicio 04",
    title: "Implementación BIM en tu empresa",
    lead: "Si tu organización quiere trabajar en BIM y no sabe por dónde empezar, acompañamos el proceso hasta que tu equipo camine solo.",
    items: [
      "Diagnóstico de madurez BIM de la organización",
      "Definición de estándares y flujos de trabajo",
      "Capacitación del equipo técnico",
      "Acompañamiento del primer proyecto piloto",
      "Implantación de DG BIM Intelligence como herramienta de gestión",
    ],
  },
];

const FAQ = [
  ["¿Trabajan con proyectos que ya están en ejecución?", "Sí, y es más común de lo que parece. Hacemos levantamiento BIM de lo que ya está construido y modelamos lo que falta, para que el resto de la obra se coordine sobre información real y no sobre planos que ya cambiaron."],
  ["Ya tenemos un modelador interno. ¿Para qué los necesitamos?", "Modelar y coordinar son cosas distintas. Un modelador construye su disciplina; la coordinación consiste en cruzar todas las disciplinas y resolver los conflictos, con criterio estructural para decidir qué elemento cede. Eso suele convivir bien con un equipo interno."],
  ["¿Cuánto cuesta una consultoría BIM?", "Depende del alcance, la superficie y las disciplinas involucradas. Lo que sí es fijo: después del diagnóstico recibes una propuesta cerrada por escrito con alcance, plazos y precio. El diagnóstico no tiene costo."],
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

export default function Servicios() {
  return (
    <>
      <PageHero
        eyebrow="Servicios"
        title="Soluciones de ingeniería y construcción con metodología BIM"
        lead="Desde la fase conceptual hasta la ingeniería de detalle. Buscamos soluciones costo-efectivas para estructuras y edificaciones, nuevas o existentes, con diseño sismorresistente según códigos nacionales e internacionales."
        image="/images/dm-servicio-coordinacion.jpg"
        crumb={{ label: "Servicios", href: "/servicios" }}
      />
      <AvalesMarquee />

      {SERVICIOS.map((s, i) => (
        <Section key={s.id} id={s.id} tone={i % 2 ? "crema" : "white"}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal className={i % 2 ? "lg:order-2" : ""}>
              <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja">{s.n}</span>
              <h2 className="text-3xl font-bold leading-tight text-azul md:text-4xl">{s.title}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">{s.lead}</p>
              <ul className="mt-6 space-y-2.5">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px]">
                    <Check className="mt-1 size-4 shrink-0 text-naranja" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className={i % 2 ? "lg:order-1" : ""}>
              <div className="overflow-hidden rounded-2xl shadow-xl shadow-azul/15">
                <Image src={s.img} alt={s.title} width={900} height={663} className="size-full object-cover" />
              </div>
            </Reveal>
          </div>
        </Section>
      ))}

      <Section>
        <SectionHead
          eyebrow="Capacidad técnica"
          title="Qué tipo de estructuras diseñamos"
          lead="Nuestra experiencia cubre los sistemas y materiales que se usan realmente en la construcción de la región."
        />
        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {[
            ["Materiales", "Acero laminado en caliente · Acero laminado en frío · Mampostería estructural · Hormigón armado · Estructuras compuestas"],
            ["Sistemas estructurales", "Pórticos ordinarios y especiales a momento · Pórticos arriostrados excéntrica y concéntricamente · Sistemas duales · Muros de corte · Aislamiento sísmico"],
            ["Tipologías", "Edificaciones en altura · Naves industriales · Silos y tanques · Vivienda unifamiliar · Rehabilitación de estructuras existentes"],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.07}>
              <article className="h-full rounded-xl border border-border border-l-4 border-l-naranja bg-crema p-6">
                <h3 className="text-lg font-bold text-azul">{t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="crema">
        <SectionHead
          eyebrow="Antes de agendar"
          title="¿Somos el equipo para tu proyecto?"
          lead="Preferimos decirlo claro desde el inicio en vez de descubrirlo a mitad del contrato."
        />
        <div className="mt-11 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border border-l-4 border-l-naranja bg-white p-7">
              <h3 className="text-lg font-bold text-azul">Sí, si estás en esta situación</h3>
              <ul className="mt-4 space-y-3">
                {SI.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-naranja" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-border border-l-4 border-l-gray-400 bg-[#f4f4f2] p-7">
              <h3 className="text-lg font-bold text-gray-500">Probablemente todavía no</h3>
              <ul className="mt-4 space-y-3">
                {NO.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed text-muted-foreground">
                    <Minus className="mt-0.5 size-4 shrink-0 text-gray-400" aria-hidden />
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
        <Reveal className="mx-auto mt-9 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-2.5">
            {FAQ.map(([q, a], i) => (
              <AccordionItem key={q} value={`faq-${i}`} className="rounded-xl border border-border bg-crema px-5">
                <AccordionTrigger className="py-4 text-left font-heading text-[15px] font-semibold text-azul hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-[14.5px] leading-relaxed text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Section>

      <CtaFinal />
    </>
  );
}
