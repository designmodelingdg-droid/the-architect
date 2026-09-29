import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { FichaDocente } from "@/components/site/ficha-docente";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { docentes, programas } from "@/lib/contenido";
import { alternos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Docentes",
  description: "La planta docente de Design Modeling Academy: ingenieros y arquitectos en activo, certificados por Autodesk, que calculan, modelan y coordinan proyectos reales.",
  alternates: alternos("/docentes.md"),
};

export default async function Docentes() {
  const [lista, progs] = await Promise.all([docentes(), programas()]);
  const cuenta = (slug: string) => progs.filter((p) => (p.docentes ?? []).includes(slug)).length;
  const orden = [...lista].sort((a, b) => cuenta(b.slug) - cuenta(a.slug) || a.nombre.localeCompare(b.nombre, "es"));
  return (
    <>
      <PageHero
        eyebrow="Docentes"
        title="Enseña quien construye"
        lead="Ingenieros y arquitectos en activo, certificados por Autodesk. Lo que enseñan es lo que hacen fuera de la escuela: calcular, modelar y coordinar proyectos reales."
        crumb={{ label: "Docentes", href: "/docentes" }}
      />
      <Section tone="base">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orden.map((d) => <FichaDocente key={d.slug} d={d} programas={cuenta(d.slug)} />)}
        </div>
      </Section>
      <ContactoBloque conDatos={false} />
    </>
  );
}
