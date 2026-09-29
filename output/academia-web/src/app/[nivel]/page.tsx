import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { TarjetaPrograma } from "@/components/site/tarjeta-programa";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { Reveal } from "@/components/site/reveal";
import { programas, nombresDocentes, nombresCredenciales } from "@/lib/contenido";
import { alternos } from "@/lib/site";
import { NIVEL_POR_SLUG } from "@/lib/niveles";
import { aTarjeta } from "@/lib/formato";

/* Solo los niveles declarados existen; cualquier otra ruta es un 404 en build. */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(NIVEL_POR_SLUG).map((nivel) => ({ nivel }));
}

export async function generateMetadata({ params }: { params: Promise<{ nivel: string }> }): Promise<Metadata> {
  const { nivel } = await params;
  const n = NIVEL_POR_SLUG[nivel];
  if (!n) return {};
  return {
    title: n.plural,
    description: n.resumen || `${n.plural} de Design Modeling Academy.`,
    alternates: alternos(`/${nivel}.md`),
  };
}

export default async function PaginaNivel({ params }: { params: Promise<{ nivel: string }> }) {
  const { nivel } = await params;
  const n = NIVEL_POR_SLUG[nivel];
  if (!n) notFound();

  const [todos, doc, cred] = await Promise.all([programas(), nombresDocentes(), nombresCredenciales()]);
  const lista = todos.filter((p) => n.tipos.includes(p.tipo));
  const principales = lista.filter((p) => p.tipo === n.tipo);
  const bloques = lista.filter((p) => p.tipo === "bloque");

  return (
    <>
      <PageHero
        eyebrow="Nivel"
        title={n.plural}
        lead={n.resumen || `${n.plural} de Design Modeling Academy.`}
        crumb={{ label: n.plural, href: `/${nivel}` }}
      />

      {n.horas ? (
        <div className="border-b border-border bg-crema">
          <dl className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[["Horas", n.horas], ["Duración", n.duracion], ["Credencial", n.credencial]].map(([k, v]) => (
              <div key={k} className="py-5 sm:px-6 sm:first:pl-0">
                <dt className="tag-tech !text-tinta-suave">{k}</dt>
                <dd className="mt-1 font-heading text-[15px] font-bold text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <Section tone="base">
        {n.paraQuien ? (
          <Reveal className="mb-10 max-w-2xl">
            <span className="tag-tech mb-2 inline-block">Para quién</span>
            <p className="text-lg leading-relaxed text-tinta">{n.paraQuien}</p>
          </Reveal>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {principales.map((p) => (
            <TarjetaPrograma key={p.slug} p={aTarjeta(p)} docentes={doc} credenciales={cred} />
          ))}
        </div>
        {!principales.length ? (
          <p className="panel p-8 text-center text-tinta-suave">Todavía no hay programas publicados en este nivel.</p>
        ) : null}
      </Section>

      {bloques.length ? (
        <Section tone="panel" id="bloques">
          <SectionHead
            eyebrow="Por bloques"
            title="El máster también se cursa por trimestres"
            lead="Cuatro bloques, cada uno con su microcredencial y su proyecto entregable. Lo cursado suma hacia el máster completo, sin expiración y con reingreso sin costo."
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {bloques.map((p) => (
              <li key={p.slug}>
                <TarjetaPrograma p={aTarjeta(p)} docentes={doc} credenciales={cred} />
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section tone="base" className="!py-10">
        <Link href="/programas" className="inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
          Ver todo el catálogo con filtros <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </Section>

      <ContactoBloque conDatos={false} />
    </>
  );
}
