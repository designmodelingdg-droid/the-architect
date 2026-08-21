import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, Eye } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";
import { AgentPanel } from "@/components/site/agent-panel";
import { DataStrip } from "@/components/site/data-strip";

export const metadata: Metadata = {
  title: "DG BIM Intelligence — el consultor BIM que razona",
  description:
    "No es un chatbot: un agente entrenado con el criterio de +10 años de BIM Management. Lee tu proyecto, razona paso a paso y entrega hallazgos con evidencia, impacto y confianza.",
};

const ROLES = [
  ["Modelador", "Entrega limpio. Ve inconsistencias accionables antes de pasar a coordinación."],
  ["Coordinador", "Llega en control. Prioriza interferencias, estados y responsables sin ruido."],
  ["Gerente", "Decide con datos. Entiende riesgo, avance y calidad sin abrir veinte reportes."],
  ["Dueño", "Protege el margen. Ve dónde el error técnico se vuelve atraso, RFI o sobrecosto."],
] as const;

const PASOS = [
  ["Carga tu proyecto", "Trabaja con la información BIM real de tu piloto, no con teoría genérica."],
  ["Razona el criterio", "Organiza hallazgos con evidencia, impacto, recomendación y nivel de confianza."],
  ["Decide y actúa", "Cada rol ve qué corregir, qué priorizar y qué escalar antes de que llegue a obra."],
] as const;

export default function Plataforma() {
  return (
    <>
      <PageHero
        num="02"
        eyebrow="DG BIM Intelligence"
        title="Un consultor BIM que razona, 24/7 dentro de tu proyecto"
        lead="No es un chatbot. Es un agente con el criterio de +10 años de BIM Management: lee tu proyecto, razona paso a paso y te dice qué hacer y por qué — con evidencia, impacto y nivel de confianza en cada hallazgo."
        crumb={{ label: "DG BIM Intelligence", href: "/dg-bim-intelligence" }}
      />

      <DataStrip
        items={[
          ["24/7", "razonando en tu proyecto"],
          ["10 años", "de criterio BIM destilado"],
          ["4 roles", "cada quien ve lo suyo"],
          ["+3.800", "profesionales formados detrás"],
        ]}
      />

      <Section tone="navy">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="tag-tech mb-4 inline-flex items-center gap-2.5 text-naranja-claro">
              <span className="text-white/50">01/</span>
              <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
              La diferencia
            </span>
            <h2 className="text-3xl font-bold leading-[1.1] text-white md:text-[2.6rem]">
              No te suelta una respuesta plana. Te guía con criterio.
            </h2>
            <p className="mt-4 leading-relaxed text-white/70 md:text-lg">
              La diferencia con un ChatGPT genérico: este agente aplica reglas condicionales de
              conocimiento profundo del dominio. No responde en abstracto — razona sobre tu modelo,
              «primero esto, después esto», como lo haría un consultor senior sentado al lado de tu
              equipo. Y cuando le falta contexto, pregunta antes de recomendar.
            </p>
            <ol className="mt-7 space-y-4">
              {PASOS.map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-0.5 font-heading text-[13px] font-bold text-naranja-claro" aria-hidden>
                    0{i + 1}/
                  </span>
                  <div>
                    <h3 className="font-heading text-[15px] font-bold text-white">{t}</h3>
                    <p className="text-sm leading-relaxed text-white/65">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.12}>
            <AgentPanel />
          </Reveal>
        </div>
      </Section>

      <Section tone="base">
        <SectionHead
          num="02"
          eyebrow="Por rol"
          title="Un mismo proyecto, cuatro formas de decidir mejor"
          lead="Nadie navega información que no le sirve. Cada perfil entra y ve exactamente lo que necesita decidir hoy."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map(([rol, d], i) => (
            <Reveal key={rol} delay={i * 0.06}>
              <article className="panel h-full p-6">
                <span className="font-heading text-[10px] font-bold uppercase tracking-[0.16em] text-tinta-suave">Rol 0{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold text-naranja">{rol}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-tinta-suave">{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="panel">
        <SectionHead
          num="03"
          eyebrow="Roadmap honesto"
          title="Lo disponible se demuestra. Lo futuro es visión."
          lead="Preferimos decirte exactamente en qué punto está la plataforma antes de que la contrates."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Reveal>
            <article className="panel h-full border-t-2 border-t-emerald-500 p-6">
              <span className="inline-flex items-center gap-1.5 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                <Check className="size-3" aria-hidden /> Disponible hoy
              </span>
              <ul className="mt-4 space-y-2.5 text-[14.5px] text-tinta">
                <li>Tablero de Modelador BIM</li>
                <li>Tablero de Gerente BIM</li>
                <li>Agente especializado 24/7</li>
                <li>Carga y control de datos del proyecto</li>
              </ul>
            </article>
          </Reveal>
          <Reveal delay={0.07}>
            <article className="panel h-full border-t-2 border-t-naranja p-6">
              <span className="inline-flex items-center gap-1.5 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-naranja">
                <Clock className="size-3" aria-hidden /> En desarrollo
              </span>
              <ul className="mt-4 space-y-2.5 text-[14.5px] text-tinta">
                <li>Tablero de Coordinador BIM</li>
                <li>Conexión directa con Revit / Cloud</li>
                <li>Mejoras de integración</li>
              </ul>
            </article>
          </Reveal>
          <Reveal delay={0.14}>
            <article className="panel h-full border-t-2 border-t-azul-medio p-6">
              <span className="inline-flex items-center gap-1.5 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-azul-medio">
                <Eye className="size-3" aria-hidden /> Visión futura
              </span>
              <ul className="mt-4 space-y-2.5 text-[14.5px] text-tinta">
                <li>Inteligencia empresarial del proyecto</li>
                <li>Automatizaciones avanzadas</li>
                <li>Auditoría integral</li>
              </ul>
            </article>
          </Reveal>
        </div>
        <Reveal className="mt-7">
          <p className="text-center font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-suave">
            Lo disponible se demuestra · lo en desarrollo se explica · lo futuro es visión, no promesa contractual
          </p>
        </Reveal>
      </Section>

      <Section>
        <SectionHead num="04" eyebrow="Cómo se contrata" title="Dos formas de usarla" />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            ["Incluida en tu consultoría", "Si nos contratas para modelar, calcular o coordinar tu proyecto, la plataforma viene incluida durante toda la ejecución. Es la forma en que te entregamos visibilidad del avance sin que tengas que pedir reportes.", "Agendar diagnóstico"],
            ["Como software independiente", "Si ya tienes tu propio equipo BIM y lo que necesitas es la herramienta, la licenciamos por separado con implementación acompañada, capacitación de tu equipo y demo en vivo sobre un proyecto real.", "Solicitar una demo"],
          ].map(([t, d, cta], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <article className="panel flex h-full flex-col border-l-2 border-l-naranja p-7">
                <h3 className="text-xl font-bold text-navy">{t}</h3>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-tinta-suave">{d}</p>
                <Link href="/contactos" className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-naranja transition-colors hover:text-azul">
                  {cta} →
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaFinal
        title="Está funcionando. Puedes verlo hoy."
        text="Te mostramos la plataforma con datos reales de ejemplo y tableros por rol, para que evalúes si el criterio ayuda a tu equipo."
        cta="Solicita una demo en vivo"
      />
    </>
  );
}
