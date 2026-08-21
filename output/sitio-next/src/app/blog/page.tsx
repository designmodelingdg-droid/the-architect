import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos técnicos sobre metodología BIM, diseño estructural y gestión de proyectos.",
};

/*
 * Cuando haya artículos: crear src/app/blog/[slug]/page.tsx por entrada
 * y reemplazar el estado vacío por el grid de tarjetas.
 */
export default function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Ingeniería, BIM y construcción"
        lead="Artículos técnicos sobre metodología BIM, diseño estructural y gestión de proyectos, escritos por el equipo que los ejecuta."
        image="/images/dm-pg-blog.jpg"
        crumb={{ label: "Blog", href: "/blog" }}
      />

      <Section>
        <Reveal className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-crema px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-azul">Estamos preparando los primeros artículos</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Muy pronto publicaremos contenido técnico sobre coordinación BIM, diseño sismorresistente
            y gestión de proyectos. Mientras tanto, escríbenos si tienes una duda concreta sobre tu
            proyecto.
          </p>
          <Link href="/contactos" data-btn className="mt-6 inline-block rounded-lg bg-naranja px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-naranja-claro">
            Hacer una consulta
          </Link>
        </Reveal>
      </Section>

      <CtaFinal title="¿Tienes una duda técnica sobre tu proyecto?" text="Agenda un diagnóstico sin costo y te damos una respuesta concreta." />
    </>
  );
}
