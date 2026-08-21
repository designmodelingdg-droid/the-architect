import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos técnicos sobre metodología BIM, IA aplicada a la construcción y diseño estructural.",
};

export default function Blog() {
  return (
    <>
      <PageHero
        num="06"
        eyebrow="Blog"
        title="Ingeniería, BIM e inteligencia artificial"
        lead="Artículos técnicos sobre coordinación BIM, diseño sismorresistente e IA aplicada a la construcción, escritos por el equipo que los ejecuta."
        crumb={{ label: "Blog", href: "/blog" }}
      />
      <Section>
        <Reveal className="panel mx-auto max-w-xl px-8 py-14 text-center">
          <span className="tag-tech">En preparación</span>
          <h2 className="mt-3 text-2xl font-bold text-navy">Estamos preparando los primeros artículos</h2>
          <p className="mt-3 leading-relaxed text-tinta-suave">
            Muy pronto publicaremos contenido técnico. Mientras tanto, escríbenos si tienes una duda
            concreta sobre tu proyecto.
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
