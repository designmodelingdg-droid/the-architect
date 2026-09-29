import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { alternos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Agenda una cita informativa gratuita con Design Modeling Academy o escríbenos por WhatsApp. Te decimos qué programa te conviene según lo que ya sabes y adónde quieres llegar.",
  alternates: alternos("/contacto.md"),
};

export default function Contacto() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de lo que quieres aprender"
        lead="Una cita informativa de treinta minutos, sin costo. Un asesor académico revisa contigo tu punto de partida y te recomienda un programa, no una lista."
        crumb={{ label: "Contacto", href: "/contacto" }}
      />
      <ContactoBloque />
    </>
  );
}
