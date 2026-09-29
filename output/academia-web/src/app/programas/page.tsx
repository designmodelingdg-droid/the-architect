import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { FiltrosCatalogo } from "@/components/site/filtros-catalogo";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { programas, areas, software, nombresDocentes, nombresCredenciales } from "@/lib/contenido";
import { alternos } from "@/lib/site";
import { aTarjeta } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Programas",
  description:
    "Todo el catálogo de Design Modeling Academy: máster, diplomados, especializaciones, cursos y rutas en Revit, Robot, ETABS, SAP2000 y CYPE. Filtra por nivel, software y área.",
  alternates: alternos("/programas.md"),
};

export default async function Programas() {
  const [lista, ar, sw, doc, cred] = await Promise.all([programas(), areas(), software(), nombresDocentes(), nombresCredenciales()]);
  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        title="Todos los programas"
        lead="Filtra por nivel, por el software que quieres dominar o por área. Cada programa dice cuántas horas certifica, qué credencial otorga y quién lo dicta."
        crumb={{ label: "Programas", href: "/programas" }}
      />
      <Section tone="base">
        <FiltrosCatalogo
          programas={lista.map(aTarjeta)}
          areas={ar.map((a) => ({ slug: a.slug, nombre: a.nombre }))}
          software={sw.map((s) => ({ slug: s.slug, nombre: s.nombre }))}
          docentes={doc}
          credenciales={cred}
        />
      </Section>
      <ContactoBloque conDatos={false} />
    </>
  );
}
