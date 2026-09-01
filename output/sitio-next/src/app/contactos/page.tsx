import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { REDES, WA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Agenda un diagnóstico gratuito de tu proyecto. MODELING-DG S.A.S, Quito, Ecuador. Atendemos toda Latinoamérica.",
};

export default function Contactos() {
  return (
    <>
      <PageHero
        vimeo={{ id: "1223019560", aspect: 9 / 16, poster: "/images/posters/esc2.jpg" }}
        num="05"
        eyebrow="Contacto"
        title="Cuéntanos de tu proyecto"
        lead="Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo, sin compromiso y con una respuesta concreta sobre qué encontramos."
        crumb={{ label: "Contacto", href: "/contactos" }}
      />

      <ContactoBloque />

      <Section tone="blueprint">
        <SectionHead
          num="01"
          eyebrow="También por aquí"
          title="Síguenos en nuestras redes"
          lead="Publicamos herramientas, avances de DG BIM Intelligence y contenido técnico para profesionales del sector."
        />
        <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={WA} target="_blank" rel="noopener" data-btn className="rounded-lg bg-[#25D366] px-6 py-3 font-heading text-sm font-bold text-white hover:brightness-105">
            WhatsApp
          </a>
          {REDES.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener"
              data-btn
              className="rounded-lg border border-input px-6 py-3 font-heading text-sm font-bold text-azul hover:border-naranja hover:text-naranja"
            >
              {r.label}
            </a>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
