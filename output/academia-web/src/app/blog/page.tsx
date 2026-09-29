import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { alternos } from "@/lib/site";
import { BLOG_URL, ARTICULOS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos del equipo de Design Modeling Academy sobre análisis estructural, software BIM e inteligencia artificial aplicada a la ingeniería y la arquitectura.",
  alternates: alternos("/blog.md"),
};

/*
 * El blog sigue viviendo en el embudo de GHL (funnel.dgdesignmodeling.com), que
 * es donde el equipo publica. Esta página es la puerta desde la academia: los
 * últimos artículos con su fecha, y el enlace al índice completo. Absorber el
 * blog es una fase posterior; mientras tanto no se duplica nada.
 */
const fecha = (iso: string) => new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00`));

export default function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Estructuras, BIM e inteligencia artificial"
        lead="Artículos escritos por los docentes: comparativas de software, guías paso a paso y herramientas gratuitas para el cálculo."
        crumb={{ label: "Blog", href: "/blog" }}
      />
      <Section tone="base">
        <SectionHead eyebrow="Últimos artículos" title="Lo más reciente" center={false} />
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {ARTICULOS.map((a, i) => (
            <li key={a.url}>
              <Reveal delay={i * 0.05} className="h-full">
                <a href={a.url} target="_blank" rel="noopener" className="alza panel group flex h-full flex-col p-6">
                  <time dateTime={a.fecha} className="font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-tinta-suave">{fecha(a.fecha)}</time>
                  <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-navy group-hover:text-naranja-texto">{a.titulo}</h3>
                  {a.autor ? <p className="mt-1.5 text-[13px] text-tinta-suave">{a.autor}</p> : null}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto">
                    Leer <ArrowUpRight className="size-3.5" aria-hidden />
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-[14px] text-tinta-suave">
          <a href={BLOG_URL} target="_blank" rel="noopener" className="font-bold text-navy hover:text-naranja-texto">Ver todos los artículos</a>, incluidas las guías y calculadoras gratuitas.
        </p>
      </Section>
      <ContactoBloque conDatos={false} />
    </>
  );
}
