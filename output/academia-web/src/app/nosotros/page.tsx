import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { FichaDocente } from "@/components/site/ficha-docente";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { nosotros, docentes, programas, avales } from "@/lib/contenido";
import { alternos, CONSULTORIA, METODO, RAZON_SOCIAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Design Modeling Academy es la escuela del grupo Design Modeling DG, en Quito: enseña quien calcula, modela y coordina proyectos reales. Cifras con su fuente, el método y la planta docente.",
  alternates: alternos("/nosotros.md"),
};

/*
 * Tres puertas de un mismo grupo: la consultoría que calcula, el software que
 * asiste al proyecto y la escuela que enseña. Es lo que hace verificable el
 * «enseña quien construye»: los docentes son los mismos que firman proyectos.
 */
const GRUPO = [
  { nombre: "Design Modeling DG", que: "Consultoría estructural y BIM", texto: "Cálculo, modelado y coordinación BIM de proyectos reales desde Quito para Ecuador y la región.", href: CONSULTORIA, externo: true },
  { nombre: "DG BIM Intelligence", que: "Software de asistencia al proyecto", texto: "La plataforma propia que usan los equipos de la consultoría, y que los alumnos conocen en clase.", href: `${CONSULTORIA}/dg-bim-intelligence`, externo: true },
  { nombre: "Design Modeling Academy", que: "La escuela", texto: "Másteres, diplomados, especializaciones y cursos con docentes que ejercen y credenciales que se verifican.", href: "/programas", externo: false },
];

export default async function Nosotros() {
  const [datos, lista, progs, avs] = await Promise.all([nosotros(), docentes(), programas(), avales()]);
  const cuenta = (slug: string) => progs.filter((p) => (p.docentes ?? []).includes(slug)).length;
  const equipo = [...lista].sort((a, b) => cuenta(b.slug) - cuenta(a.slug)).slice(0, 6);
  const cifras = datos?.cifras ?? [];
  const historia = (datos?.historia ?? "").split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="Una escuela hecha por quien construye"
        lead={`Design Modeling Academy es la escuela del grupo Design Modeling DG (${RAZON_SOCIAL}), en Quito. Los docentes calculan, modelan y coordinan proyectos reales, y eso es lo que enseñan.`}
        crumb={{ label: "Nosotros", href: "/nosotros" }}
      />

      {cifras.length ? (
        <Section tone="panel">
          <SectionHead eyebrow="Cifras" title="Lo que hay detrás de cada número" lead="Cada cifra dice de dónde sale. Si no se puede verificar, no se publica." center={false} />
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cifras.map((c, i) => (
              <Reveal key={c.etiqueta} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-white p-6">
                  <dd className="font-heading text-3xl font-extrabold text-naranja md:text-4xl">{c.valor}</dd>
                  <dt className="mt-1 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-tinta-suave">{c.etiqueta}</dt>
                  {c.fuente ? <dd className="mt-3 text-[12.5px] leading-snug text-tinta-suave">Fuente: {c.fuente}</dd> : null}
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>
      ) : null}

      <Section tone="base">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHead eyebrow="Historia" title="De la oficina de cálculo al aula" center={false} />
            <div className="mt-6 space-y-4">
              {historia.length ? historia.map((par) => (
                <p key={par.slice(0, 40)} className="max-w-[62ch] leading-relaxed text-tinta md:text-lg">{par}</p>
              )) : (
                <p className="max-w-[62ch] leading-relaxed text-tinta md:text-lg">
                  La escuela nació dentro de una oficina de ingeniería estructural en Quito, cuando los
                  cursos que se daban a los equipos de proyecto empezaron a pedirse desde fuera.
                </p>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="tag-tech mb-4 inline-block">El grupo</span>
            <ul className="space-y-3">
              {GRUPO.map((g) => (
                <li key={g.nombre}>
                  <a
                    href={g.href}
                    target={g.externo ? "_blank" : undefined}
                    rel={g.externo ? "noopener" : undefined}
                    className="alza panel group flex items-start justify-between gap-4 p-5"
                  >
                    <span>
                      <span className="block font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-naranja-texto">{g.que}</span>
                      <span className="mt-1 block font-heading text-lg font-bold text-navy">{g.nombre}</span>
                      <span className="mt-1.5 block text-[14px] leading-relaxed text-tinta-suave">{g.texto}</span>
                    </span>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-naranja transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="navy">
        <SectionHead dark eyebrow="Cómo se estudia" title="Lo que no cambia, sea un curso o el máster" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {METODO.map((m, i) => (
            <Reveal key={m.titulo} delay={i * 0.06}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="font-heading text-lg font-bold text-white">{m.titulo}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/70">{m.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="base">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead eyebrow="Docentes" title="Enseña quien construye" lead="Ingenieros y arquitectos en activo, certificados por Autodesk." center={false} />
          <Link href="/docentes" className="inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
            Toda la planta docente <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipo.map((d) => <FichaDocente key={d.slug} d={d} programas={cuenta(d.slug)} />)}
        </div>
      </Section>

      {avs.length ? (
        <Section tone="panel">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Avales" title="Quién respalda a la escuela" center={false} />
            <Link href="/acreditaciones" className="inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
              Ver acreditaciones <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {avs.map((a) => (
              <li key={a.slug} className="rounded-full border border-border bg-white px-4 py-2 font-heading text-[12px] font-bold text-navy">{a.nombre}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <ContactoBloque conDatos={false} />
    </>
  );
}
