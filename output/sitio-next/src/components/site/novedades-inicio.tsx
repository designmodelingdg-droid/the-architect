import { Section, SectionHead } from "@/components/site/section";
import { TarjetaNovedad } from "@/components/site/tarjeta-novedad";
import { novedadesEn } from "@/lib/novedades";

/*
 * Ofertas y eventos marcados "inicio" en la app de contenido, justo después
 * del hero: es lo primero que la gente busca cuando hay una campaña. Sin nada
 * vigente, la sección no se pinta.
 */
export async function NovedadesInicio() {
  const lista = (await novedadesEn("inicio")).slice(0, 3);
  if (!lista.length) return null;
  return (
    <Section tone="base">
      <SectionHead eyebrow="Ahora" title="Ofertas y eventos" center={false} />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((n) => (
          <li key={n.id}>
            <TarjetaNovedad n={n} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
