import { Section, SectionHead } from "@/components/site/section";
import { TarjetaNovedad, deDestacado, deEvento } from "@/components/site/tarjeta-novedad";
import { novedadesWeb } from "@/lib/operaciones";

/*
 * Ofertas marcadas «inicio» y eventos publicados en la app de operaciones,
 * justo después del hero: es lo primero que la gente busca cuando hay una
 * campaña. Sin nada vigente, la sección no se pinta.
 */
export async function NovedadesInicio() {
  const nov = await novedadesWeb();
  const lista = [...(nov?.destacados ?? []).map(deDestacado), ...(nov?.eventos ?? []).map(deEvento)].slice(0, 3);
  if (!lista.length) return null;
  return (
    <Section tone="base">
      <SectionHead eyebrow="Ahora" title="Ofertas y eventos" center={false} />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((n) => (
          <li key={`${n.tipo}-${n.id}`}>
            <TarjetaNovedad n={n} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
