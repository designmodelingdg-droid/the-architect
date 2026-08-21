import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { WA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Agenda un diagnóstico gratuito de tu proyecto. MODELING-DG S.A.S, Quito, Ecuador. Atendemos toda Latinoamérica.",
};

export default function Contactos() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Cuéntanos de tu proyecto"
        lead="Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo, sin compromiso y con una respuesta concreta sobre qué encontramos."
        image="/images/dm-hero.jpg"
        crumb={{ label: "Contacto", href: "/contactos" }}
      />

      <ContactoBloque />

      <Section tone="crema">
        <SectionHead
          eyebrow="También por aquí"
          title="Accede a material exclusivo en nuestras redes"
          lead="Publicamos herramientas, tutoriales y novedades pensadas para profesionales que quieren transformar la manera de diseñar y construir."
        />
        <Reveal className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={WA} target="_blank" rel="noopener" data-btn className="rounded-lg bg-[#25D366] px-6 py-3 font-heading text-sm font-bold text-white hover:brightness-105">WhatsApp</a>
          {["Instagram", "LinkedIn", "YouTube"].map((red) => (
            <a
              key={red}
              href="#"
              data-btn
              title="TODO: URL real de la red"
              className="rounded-lg border-2 border-azul px-6 py-3 font-heading text-sm font-bold text-azul hover:bg-azul hover:text-white"
            >
              {red}
            </a>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
