import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { AvalesMarquee } from "@/components/site/marquee";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";

export const metadata: Metadata = {
  title: "Acreditaciones",
  description:
    "Partner y Centro de Formación Autorizado de Autodesk, con avales de universidades e instituciones acreditadoras internacionales.",
};

function Cards({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-11 grid gap-5 md:grid-cols-3">
      {items.map(([t, d], i) => (
        <Reveal key={t} delay={i * 0.07}>
          <article className="h-full rounded-xl border border-border border-l-4 border-l-naranja bg-white p-6">
            <h3 className="text-lg font-bold text-azul">{t}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{d}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export default function Acreditaciones() {
  return (
    <>
      <PageHero
        eyebrow="Acreditaciones"
        title="Partner y Centro de Formación Autorizado de Autodesk"
        lead="Nuestro trabajo y nuestros programas están respaldados por Autodesk y por universidades e instituciones acreditadoras internacionales."
        image="/images/dm-pg-acreditaciones.jpg"
        crumb={{ label: "Acreditaciones", href: "/acreditaciones" }}
      />
      <AvalesMarquee label="Nos respaldan" />

      <Section>
        <SectionHead
          eyebrow="Autodesk"
          title="Partner y Centro de Formación Autorizado"
          lead="Ofrecemos formación especializada y certificaciones oficiales en software Autodesk. Ser centro autorizado significa que nuestros instructores están certificados y que los certificados que emitimos son verificables por Autodesk."
        />
        <Cards
          items={[
            ["Autodesk Learning Partner", "Autorizados para impartir formación oficial sobre el ecosistema Autodesk: Revit, Navisworks, Robot Structural Analysis y Dynamo, entre otros."],
            ["Authorized Training Center", "Centro de formación autorizado, con instructores certificados y contenidos alineados a los estándares oficiales del fabricante."],
            ["Certificaciones verificables", "Los certificados que emitimos incluyen código QR verificable digitalmente y se pueden publicar directamente en LinkedIn."],
          ]}
        />
      </Section>

      <Section tone="crema">
        <SectionHead
          eyebrow="Avales académicos"
          title="Universidades e instituciones acreditadoras"
          lead="Nuestros diplomados y másters cuentan con aval universitario internacional, con validez en Estados Unidos y Europa."
        />
        <Cards
          items={[
            ["Doctrina Qualitas", "Agencia Universitaria DQ y sello de Excelencia Educativa EQS, que acreditan la calidad de los programas formativos."],
            ["Círculo de Universidades Hispanoamericanas", "Alfonso III el Magno — red universitaria que respalda los diplomados universitarios internacionales."],
            ["Universidades internacionales", "Sabal University, Universidad de las Naciones, UAIII e ISTE Universidad, con títulos de validez internacional."],
          ]}
        />
      </Section>

      <Section>
        <SectionHead eyebrow="Qué significa para ti" title="Por qué importan las acreditaciones en una consultoría" />
        <div className="mx-auto mt-11 grid max-w-4xl gap-5 md:grid-cols-2">
          {[
            ["Para tu proyecto", "Que seamos centro autorizado de Autodesk implica que trabajamos con licencias oficiales, versiones vigentes y flujos alineados al estándar del fabricante. Tu modelo no queda atado a configuraciones improvisadas."],
            ["Para tu equipo", "Si contratas la implementación de BIM en tu organización, la capacitación de tu equipo se certifica oficialmente — el conocimiento queda documentado y verificable, no solo en la cabeza de una persona."],
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

      <CtaFinal title="¿Quieres trabajar con un equipo acreditado?" text="Agenda un diagnóstico sin costo y conversamos sobre tu proyecto." />
    </>
  );
}
