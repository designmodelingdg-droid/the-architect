import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";

export const metadata: Metadata = {
  title: "DG BIM Intelligence — plataforma de gestión BIM",
  description:
    "El software que desarrollamos para gestionar proyectos BIM: detección de interferencias, control de calidad del modelo y tableros por rol. Incluido en la consultoría o como licencia independiente.",
};

export default function Plataforma() {
  return (
    <>
      <PageHero
        eyebrow="Nuestra plataforma"
        title="DG BIM Intelligence"
        lead="El software que desarrollamos para gestionar nuestros propios proyectos BIM. Hoy lo ofrecemos a constructoras, promotoras y equipos de diseño que necesitan ver su proyecto entero en una sola pantalla."
        image="/images/dm-plataforma.jpg"
        crumb={{ label: "DG BIM Intelligence", href: "/dg-bim-intelligence" }}
      />

      <Section>
        <SectionHead
          eyebrow="Por qué existe"
          title="Ninguna herramienta del mercado nos daba lo que necesitábamos"
          lead="Los detectores de interferencias entregan listas de miles de conflictos sin priorizar. Los gestores de proyecto no entienden de modelos. Nosotros necesitábamos las dos cosas en el mismo lugar, y con la información filtrada según quién la mira."
        />
      </Section>

      <Section tone="oscuro">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja-claro">Qué hace</span>
            <h2 className="text-3xl font-bold md:text-4xl">Coordinación, calidad y avance en un solo tablero</h2>
            <ul className="mt-7 space-y-5">
              {[
                ["Detección de interferencias", "Conflictos entre arquitectura, estructura e instalaciones, clasificados por severidad — crítica, mayor o menor — con responsable asignado y estado de resolución."],
                ["Control de calidad del modelo", "Elementos sin clasificar, propiedades incompletas, warnings y nivel de detalle por disciplina, antes de que el modelo llegue a obra."],
                ["Seguimiento de cambios", "Historial de quién modificó qué y cuándo, con avance por disciplina y estado de cada issue abierto."],
                ["Vista 3D del modelo federado", "Navegación por niveles y categorías, con el desglose de elementos por tipo."],
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
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
              <Image src="/images/dm-plataforma.jpg" alt="Panel de coordinación de DG BIM Intelligence" width={1400} height={800} className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="crema">
        <SectionHead
          eyebrow="Un tablero para cada rol"
          title="Nadie navega información que no le sirve"
          lead="Tres perfiles, tres vistas distintas del mismo proyecto. Cada quien entra y ve lo que necesita decidir hoy."
        />
        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {[
            ["Modelador BIM", "Su disciplina: elementos totales, nivel de detalle promedio, elementos sin clasificar, propiedades completas, warnings y calidad del modelo."],
            ["Coordinador BIM", "El cruce entre disciplinas: interferencias totales y críticas, pruebas ejecutadas, issues activos, modelos actualizados y la próxima reunión de coordinación."],
            ["Gerencia / BIM Manager", "La lectura ejecutiva: avance global, reportes, validación general y configuración del proyecto — sin tener que abrir un modelo."],
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
        <SectionHead eyebrow="Cómo se contrata" title="Dos formas de usarla" />
        <div className="mt-11 grid gap-6 lg:grid-cols-2">
          {[
            ["Incluida en tu consultoría", "Si nos contratas para modelar, calcular o coordinar tu proyecto, la plataforma viene incluida durante toda la ejecución. Es la forma en que te entregamos visibilidad del avance sin que tengas que pedir reportes.", "Agendar diagnóstico"],
            ["Como software independiente", "Si ya tienes tu propio equipo BIM y lo que necesitas es la herramienta de gestión, la licenciamos por separado, con acompañamiento en la puesta en marcha y capacitación de tu equipo.", "Solicitar una demo"],
          ].map(([t, d, cta], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <article className="flex h-full flex-col rounded-2xl border border-border border-l-4 border-l-naranja bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold text-azul">{t}</h3>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted-foreground">{d}</p>
                <Link href="/contactos" className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-naranja transition-colors hover:text-azul">
                  {cta} →
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaFinal
        title="¿Quieres verla funcionando?"
        text="Te mostramos la plataforma sobre un proyecto real y conversamos si encaja con tu operación."
        cta="Solicita una demo"
      />
    </>
  );
}
