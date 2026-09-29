import type { Metadata } from "next";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { empresas, empresasClientes } from "@/lib/contenido";
import { alternos, WA_MSG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Formación para empresas",
  description: "Capacitación BIM para equipos de ingeniería y arquitectura: programas del catálogo dictados en vivo para tu empresa, temarios a medida y consultoría de procesos más formación. Docentes certificados por Autodesk.",
  alternates: alternos("/empresas.md"),
};

/*
 * Empresas es corto a propósito: qué se ofrece, en qué tres formas, quién ya
 * lo contrató, y la puerta. La prueba (logos) solo si son clientes reales
 * cargados en Keystatic; no se rellena.
 */
const PASOS = [
  { titulo: "Diagnóstico", texto: "Una llamada para entender qué hace el equipo, con qué software y dónde se atasca." },
  { titulo: "Propuesta", texto: "Temario, calendario, docente y precio por escrito. Online en vivo por Zoom o presencial en tus oficinas." },
  { titulo: "Formación y evaluación", texto: "Clases grabadas para quien falte, evaluación antes y después, y certificación para cada participante." },
];

export default async function Empresas() {
  const [datos, clientes] = await Promise.all([empresas(), empresasClientes()]);
  const modalidades = datos?.modalidades ?? [];
  return (
    <>
      <PageHero
        eyebrow="Empresas"
        title="Formación BIM para tu equipo"
        lead={datos?.intro || "Capacitación BIM para equipos, con profesores certificados por Autodesk, temarios a medida y evaluación antes, durante y después."}
        crumb={{ label: "Empresas", href: "/empresas" }}
      />

      {modalidades.length ? (
        <Section tone="base">
          <SectionHead eyebrow="Tres formas" title="Del catálogo a la medida de tus proyectos" center={false} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {modalidades.map((m, i) => (
              <Reveal key={m.nombre} delay={i * 0.07}>
                <article className="panel flex h-full flex-col p-6">
                  <span className="font-heading text-[11px] font-bold text-naranja-texto">{String(i + 1).padStart(2, "0")}/</span>
                  <h3 className="mt-2 font-heading text-lg font-bold text-navy">{m.nombre}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-tinta-suave">{m.descripcion}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="panel">
        <SectionHead eyebrow="Cómo funciona" title="Tres pasos, sin sorpresas" center={false} />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {PASOS.map((p, i) => (
            <li key={p.titulo}>
              <Reveal delay={i * 0.07} className="h-full rounded-2xl border border-border bg-white p-6">
                <span className="font-heading text-[11px] font-bold text-naranja-texto">Paso {i + 1}</span>
                <h3 className="mt-2 font-heading text-lg font-bold text-navy">{p.titulo}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-tinta-suave">{p.texto}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {clientes.length ? (
        <Section tone="base">
          <SectionHead eyebrow="Clientes" title="Equipos que ya se formaron con nosotros" center={false} />
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {clientes.map((c) => (
              <li key={c.slug} className="flex h-24 items-center justify-center rounded-xl border border-border bg-white p-4">
                {c.logo ? (
                  <Image src={c.logo} alt={c.nombre} width={160} height={64} className="max-h-12 w-auto object-contain" />
                ) : (
                  <span className="inline-flex items-center gap-2 font-heading text-[13px] font-bold text-navy"><Building2 className="size-4 text-naranja" aria-hidden />{c.nombre}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section tone="navy">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <Reveal>
            <span className="tag-tech mb-4 inline-block text-naranja-claro">Para empezar</span>
            <h2 className="text-3xl font-bold leading-tight text-white md:text-[2.3rem]">Cuéntanos qué hace tu equipo y con qué software</h2>
            <p className="mt-4 leading-relaxed text-white/70 md:text-lg">
              Con eso preparamos una propuesta por escrito en pocos días. Sin compromiso.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:text-right">
            <a
              href={WA_MSG("Hola, quiero información sobre formación BIM para mi empresa")}
              target="_blank"
              rel="noopener"
              data-btn
              className="inline-flex rounded-lg bg-naranja px-6 py-3.5 font-heading text-[15px] font-bold text-white hover:bg-naranja-claro"
            >
              Pedir una propuesta
            </a>
          </Reveal>
        </div>
      </Section>

      <ContactoBloque conDatos={false} />
    </>
  );
}
