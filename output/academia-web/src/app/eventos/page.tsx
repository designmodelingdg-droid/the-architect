import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { TarjetaPrograma } from "@/components/site/tarjeta-programa";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { eventos, programas, nombresDocentes, nombresCredenciales } from "@/lib/contenido";
import { aTarjeta, fechaLarga } from "@/lib/formato";
import { alternos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Eventos y próximos inicios",
  description: "Próximos inicios de los programas de Design Modeling Academy y eventos en vivo: clases abiertas, webinars y sesiones informativas.",
  alternates: alternos("/eventos.md"),
};

/*
 * Dos listas y las dos salen del contenido: los eventos cargados en Keystatic
 * (solo los futuros) y los programas con fecha de próximo inicio. Sin fechas
 * pasadas: la web anterior tenía veinte eventos de 2023 y 2024 en portada.
 */
function fechaHora(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "America/Guayaquil" }).format(d);
}

export default async function Eventos() {
  const [evs, progs, doc, cred] = await Promise.all([eventos(), programas(), nombresDocentes(), nombresCredenciales()]);
  const hoy = new Date().toISOString().slice(0, 10);
  const inicios = progs
    .filter((p) => p.proximoInicio && p.proximoInicio >= hoy)
    .sort((a, b) => a.proximoInicio!.localeCompare(b.proximoInicio!));

  return (
    <>
      <PageHero
        eyebrow="Eventos"
        title="Próximos inicios y eventos en vivo"
        lead="Las fechas que vienen: inicios de programa, clases abiertas y sesiones informativas. Todo en vivo, y grabado para quien no pueda."
        crumb={{ label: "Eventos", href: "/eventos" }}
      />

      <Section tone="base">
        <SectionHead eyebrow="Eventos" title={evs.length ? "En agenda" : "Sin eventos programados por ahora"} lead={evs.length ? undefined : "Los próximos inicios de programa están más abajo. Si quieres que te avisemos del siguiente evento, agenda una cita o escríbenos."} center={false} />
        {evs.length ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {evs.map((e, i) => (
              <li key={e.slug}>
                <Reveal delay={i * 0.06} className="panel flex h-full flex-col p-6">
                  <p className="inline-flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto">
                    <CalendarDays className="size-4" aria-hidden /> {fechaHora(e.fecha!)} · hora de Ecuador
                  </p>
                  <h3 className="mt-2 font-heading text-lg font-bold text-navy">{e.titulo}</h3>
                  {e.modalidad ? <p className="mt-1 text-[13px] text-tinta-suave">{e.modalidad}</p> : null}
                  {e.resumen ? <p className="mt-3 text-[14px] leading-relaxed text-tinta">{e.resumen}</p> : null}
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noopener" className="mt-auto inline-flex items-center gap-1.5 pt-5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
                      Inscribirme <ArrowRight className="size-3.5" aria-hidden />
                    </a>
                  ) : null}
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section tone="panel">
        <SectionHead eyebrow="Próximos inicios" title={inicios.length ? "Programas con fecha de inicio" : "Todavía sin fechas publicadas"} lead={inicios.length ? "Ordenados por fecha. La matrícula se cierra unos días antes del inicio." : undefined} center={false} />
        {inicios.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {inicios.map((p) => (
              <div key={p.slug}>
                <p className="mb-2 font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-tinta-suave">Inicio {fechaLarga(p.proximoInicio)}</p>
                <TarjetaPrograma p={aTarjeta(p)} docentes={doc} credenciales={cred} />
              </div>
            ))}
          </div>
        ) : null}
        <p className="mt-10 text-[14px] text-tinta-suave">
          Los cursos pregrabados no tienen fecha: empiezan cuando te matriculas.{" "}
          <Link href="/programas" className="font-bold text-navy hover:text-naranja-texto">Ver el catálogo completo</Link>.
        </p>
      </Section>

      <ContactoBloque conDatos={false} />
    </>
  );
}
