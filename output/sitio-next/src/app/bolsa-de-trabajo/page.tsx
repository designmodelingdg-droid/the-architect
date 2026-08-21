import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Bolsa de trabajo",
  description:
    "Vacantes verificadas en Ingeniería Civil y Arquitectura para estudiantes y egresados de Design Modeling Academy.",
};

export default function BolsaDeTrabajo() {
  return (
    <>
      <PageHero
        eyebrow="Bolsa de trabajo"
        title="Vacantes verificadas para nuestros estudiantes y egresados"
        lead="Publicamos periódicamente ofertas laborales del sector de la construcción y el diseño, seleccionadas por su compatibilidad con el perfil de quienes se forman con nosotros."
        image="/images/dm-pg-empresa.jpg"
        crumb={{ label: "Bolsa de trabajo", href: "/bolsa-de-trabajo" }}
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Vacantes exclusivas", "Ofertas laborales dirigidas específicamente a estudiantes y egresados de nuestros programas, no listados públicos que ya vio todo el mercado."],
            ["Empresas verificadas", "Revisamos y validamos la información de cada empresa que publica, para que postules con seguridad y sepas con quién estás hablando."],
            ["Acompañamiento", "Orientación y herramientas para mejorar tu proceso de postulación: perfil profesional, portafolio de proyectos y preparación de entrevista."],
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
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja">Cómo se accede</span>
            <h2 className="text-3xl font-bold leading-tight text-azul md:text-4xl">Transforma tu aprendizaje en experiencia laboral</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
              Al inscribirte en un diplomado o curso por suscripción de Design Modeling Academy,
              obtienes acceso al grupo de Bolsa de Trabajo, donde publicamos vacantes periódicamente.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground md:text-lg">
              Estas vacantes tienen una compatibilidad elevada con el perfil de nuestros egresados, en
              base a las competencias que trabajamos dentro de los planes de estudio. Además
              verificamos la veracidad de la información de las empresas que ofertan.
            </p>
            <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener" data-btn className="mt-6 inline-block rounded-lg bg-naranja px-6 py-3.5 font-heading text-sm font-bold text-white hover:bg-naranja-claro">
              Ver los programas
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl shadow-xl shadow-azul/15">
              <Image src="/images/dm-pg-acreditaciones.jpg" alt="Egresados certificados" width={1600} height={900} className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Tu mejor oportunidad laboral"
          title="Trabajo en Ingeniería Civil o Arquitectura a tu alcance"
          lead="Encuentra oportunidades para crecer profesionalmente en el sector de la construcción y el diseño."
        />
        <div className="mx-auto mt-11 grid max-w-4xl gap-5 md:grid-cols-2">
          {[
            ["Compatibilidad con tu perfil", "Gracias a la estructura de aprendizaje de Design Modeling Academy, desarrollas las aptitudes que el mercado laboral pide hoy. En la bolsa encontrarás empleos alineados a esas competencias."],
            ["Diversidad de sectores", "Validamos la diversidad de sectores, empresas y niveles de perfil, para que cada egresado encuentre una oportunidad ajustada a su momento profesional."],
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

      <section className="bg-gradient-to-br from-naranja to-naranja-claro px-5 py-16 text-center text-white">
        <Reveal>
          <h2 className="text-3xl font-bold md:text-4xl">Abre las puertas a tu futuro profesional</h2>
          <p className="mx-auto mt-3.5 max-w-xl leading-relaxed text-white/95">
            Nuestros cursos y diplomados están diseñados para potenciar tus competencias, conectarte
            con el mercado y darte las herramientas para destacar en un entorno cada vez más competitivo.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener" data-btn className="rounded-lg bg-white px-7 py-3.5 font-heading text-[15px] font-bold text-naranja shadow-lg shadow-black/15">
              Conocer los programas
            </a>
            <Link href="/contactos" data-btn className="rounded-lg border-2 border-white/70 px-7 py-3.5 font-heading text-[15px] font-bold text-white hover:bg-white/12">
              Escríbenos
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
