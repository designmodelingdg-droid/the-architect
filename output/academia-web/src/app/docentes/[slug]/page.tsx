import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { TarjetaPrograma } from "@/components/site/tarjeta-programa";
import { IconoLinkedIn } from "@/components/site/icono-linkedin";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { docentes, docente, programas, nombresDocentes, nombresCredenciales } from "@/lib/contenido";
import { aTarjeta } from "@/lib/formato";
import { alternos } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await docentes()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await docente(slug);
  if (!d) return {};
  return { title: d.nombre, description: [d.titulacion, d.rolFuera].filter(Boolean).join(". ") || `${d.nombre}, docente de Design Modeling Academy.`, alternates: alternos(`/docentes/${slug}.md`) };
}

export default async function PaginaDocente({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await docente(slug);
  if (!d) notFound();
  const [progs, nomDoc, nomCred] = await Promise.all([programas(), nombresDocentes(), nombresCredenciales()]);
  const dicta = progs.filter((p) => (p.docentes ?? []).includes(d.slug));
  return (
    <>
      <PageHero
        eyebrow="Docente"
        title={d.nombre}
        lead={[d.titulacion, d.rolFuera].filter(Boolean).join(". ")}
        crumb={{ label: "Docentes", href: "/docentes" }}
      />
      <Section tone="base">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border border-border bg-crema">
              {d.foto ? <Image src={d.foto} alt={d.nombre} fill sizes="280px" className="object-cover" /> : null}
            </div>
            {d.linkedin ? (
              <a href={d.linkedin} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
                <IconoLinkedIn className="size-4" /> LinkedIn
              </a>
            ) : null}
          </div>
          <div>
            {d.bio ? d.bio.split(/\n\s*\n/).map((par) => <p key={par.slice(0, 40)} className="mt-4 max-w-[65ch] text-lg leading-relaxed text-tinta first:mt-0">{par}</p>) : (
              <p className="max-w-[65ch] text-lg leading-relaxed text-tinta">{d.nombre} dicta {dicta.length} {dicta.length === 1 ? "programa" : "programas"} en Design Modeling Academy.</p>
            )}
          </div>
        </div>
      </Section>
      {dicta.length ? (
        <Section tone="panel">
          <SectionHead eyebrow="Programas" title={`Lo que dicta ${d.nombre.replace(/^(Ing|Arq)\.\s*/, "")}`} center={false} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {dicta.map((p) => <TarjetaPrograma key={p.slug} p={aTarjeta(p)} docentes={nomDoc} credenciales={nomCred} />)}
          </div>
        </Section>
      ) : null}
      <ContactoBloque conDatos={false} />
    </>
  );
}
