import Link from "next/link";
import { ArrowRight, GraduationCap, Layers, BookOpen, Quote } from "lucide-react";
import { Section, SectionHead } from "@/components/site/section";
import { DataStrip } from "@/components/site/data-strip";
import { Reveal, HeroReveal } from "@/components/site/reveal";
import { TextoCinetico } from "@/components/site/texto-cinetico";
import { ZonaMouse, CapaMouse } from "@/components/site/zona-mouse";
import { EligeNivel } from "@/components/site/elige-nivel";
import { TarjetaPrograma } from "@/components/site/tarjeta-programa";
import { FichaDocente } from "@/components/site/ficha-docente";
import { SelloCredencial } from "@/components/site/sello-credencial";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { destacados, docentes, programas, credenciales, testimonios, nombresDocentes, nombresCredenciales, nosotros } from "@/lib/contenido";
import { aTarjeta, fechaLarga } from "@/lib/formato";
import { METODO, CONSULTORIA } from "@/lib/site";

/*
 * Inicio. El orden es el de una escuela, no el de un producto: qué se aprende
 * aquí y de quién (hero), la prueba en cinta, los niveles explicados (el
 * clímax fijado), los programas destacados, los docentes con su rol real, las
 * credenciales, cómo se estudia, testimonios con resultado, próximos inicios y
 * la cita. Todo lo variable sale de Keystatic.
 */

const ENTRADAS = [
  { href: "/master", icono: GraduationCap, titulo: "Quiero un máster", texto: "Doce meses para dirigir proyectos BIM, con título universitario internacional." },
  { href: "/especializaciones", icono: Layers, titulo: "Quiero especializarme", texto: "Dos a cuatro cursos encadenados sobre un software o un tipo de estructura." },
  { href: "/cursos", icono: BookOpen, titulo: "Necesito un curso", texto: "Un tema, un software, un entregable. Entre 15 y 45 horas certificadas." },
];

export default async function Inicio() {
  const [dest, docs, progs, creds, tests, nomDoc, nomCred, datos] = await Promise.all([
    destacados(), docentes(), programas(), credenciales(), testimonios(), nombresDocentes(), nombresCredenciales(), nosotros(),
  ]);
  const cuenta = (slug: string) => progs.filter((p) => (p.docentes ?? []).includes(slug)).length;
  const equipo = [...docs].sort((a, b) => cuenta(b.slug) - cuenta(a.slug)).slice(0, 6);
  const hoy = new Date().toISOString().slice(0, 10);
  const inicios = progs.filter((p) => p.proximoInicio && p.proximoInicio >= hoy).sort((a, b) => a.proximoInicio!.localeCompare(b.proximoInicio!)).slice(0, 3);
  const cifras = (datos?.cifras ?? []).slice(0, 2);
  const cinta: [string, string][] = [
    ...cifras.map((c) => [c.valor, c.etiqueta] as [string, string]),
    ["ATC", "Autodesk Authorized Training Center"],
    [String(creds.length), "vías de certificación"],
  ];

  return (
    <>
      <ZonaMouse className="blueprint-fino relative overflow-hidden border-b border-border bg-crema py-20 md:py-28">
        <div className="relative mx-auto max-w-6xl px-5">
          <CapaMouse profundidad={-6}>
            <HeroReveal>
              <span className="tag-tech mb-4 inline-flex items-center gap-2.5">
                <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
                Escuela online de BIM, estructuras e IA
              </span>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.06] text-navy md:text-[3.7rem]">
                <TextoCinetico
                  delay={0.15}
                  partes={[
                    { texto: "La escuela de BIM " },
                    { texto: "donde enseña quien construye.", className: "text-azul" },
                  ]}
                />
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-tinta-suave md:text-lg">
                Másteres, diplomados, especializaciones y cursos en Revit, Robot, ETABS, SAP2000 y
                CYPE. Clases en vivo que quedan grabadas, título universitario internacional, y
                docentes que calculan y coordinan proyectos reales.
              </p>
            </HeroReveal>
          </CapaMouse>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {ENTRADAS.map((e, i) => (
              <Reveal key={e.href} delay={0.2 + i * 0.08}>
                <Link href={e.href} className="alza panel group flex h-full flex-col gap-3 p-6">
                  <e.icono className="size-6 text-naranja" aria-hidden />
                  <span className="font-heading text-lg font-bold text-navy">{e.titulo}</span>
                  <span className="text-[14px] leading-relaxed text-tinta-suave">{e.texto}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto">
                    Ver opciones <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </ZonaMouse>

      <DataStrip items={cinta} />

      <EligeNivel />

      {dest.length ? (
        <Section id="destacados" tone="base">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Programas destacados" title="Por dónde empieza la mayoría" center={false} />
            <Link href="/programas" className="inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
              Todo el catálogo <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {dest.slice(0, 4).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06} className="h-full">
                <TarjetaPrograma p={aTarjeta(p)} docentes={nomDoc} credenciales={nomCred} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <Section id="docentes" tone="panel">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal>
            <SectionHead eyebrow="Aprende de quien construye" title="Los docentes siguen calculando, modelando y coordinando" center={false} />
            <p className="mt-5 max-w-[52ch] leading-relaxed text-tinta md:text-lg">
              No es un eslogan. Los mismos ingenieros que dictan los programas firman proyectos en la
              consultoría del grupo y desarrollan DG BIM Intelligence. Lo que enseñan hoy es lo que
              usaron ayer.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/docentes" className="inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
                Toda la planta docente <ArrowRight className="size-3.5" aria-hidden />
              </Link>
              <a href={CONSULTORIA} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-tinta-suave hover:text-navy">
                Ver la consultoría <ArrowRight className="size-3.5" aria-hidden />
              </a>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {equipo.map((d, i) => (
              <Reveal key={d.slug} delay={i * 0.05} className="h-full">
                <FichaDocente d={d} programas={cuenta(d.slug)} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {creds.length ? (
        <Section id="credenciales" tone="base">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Credenciales" title="Certificados que se verifican, títulos con registro" lead="Cada programa dice qué credencial otorga y quién la emite." center={false} />
            <Link href="/acreditaciones" className="inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
              Ver acreditaciones <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {creds.slice(0, 8).map((c, i) => (
              <Reveal key={c.slug} delay={Math.min(i, 4) * 0.05} className="h-full">
                <SelloCredencial c={c} compacto />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <Section id="metodo" tone="navy">
        <SectionHead
          dark
          eyebrow="Cómo se estudia"
          title="En vivo, grabado, y con alguien al otro lado"
          lead="Cuatro cosas que no cambian, sea un curso de quince horas o el máster de doce meses."
        />
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

      {tests.length ? (
        <Section id="testimonios" tone="base">
          <SectionHead eyebrow="Resultados" title="Lo que cambió después del programa" lead="Solo testimonios con cargo y país verificados, y con un resultado concreto." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tests.slice(0, 3).map((t, i) => (
              <Reveal key={t.slug} delay={i * 0.06}>
                <blockquote className="panel flex h-full flex-col p-6">
                  <Quote className="size-5 text-naranja" aria-hidden />
                  <p className="mt-3 text-[15px] leading-relaxed text-tinta">{t.resultado}</p>
                  <footer className="mt-auto pt-5 text-[13px] text-tinta-suave">
                    <span className="font-heading font-bold text-navy">{t.nombre}</span>
                    {t.cargo ? ` · ${t.cargo}` : ""}{t.pais ? ` · ${t.pais}` : ""}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {inicios.length ? (
        <Section id="inicios" tone="panel">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Próximos inicios" title="Las fechas que vienen" center={false} />
            <Link href="/eventos" className="inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
              Todos los inicios y eventos <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <ol className="mt-8 divide-y divide-border rounded-2xl border border-border bg-white">
            {inicios.map((p) => (
              <li key={p.slug}>
                <Link href={`/programas/${p.slug}`} className="group flex flex-wrap items-center justify-between gap-3 px-6 py-5">
                  <span>
                    <span className="block font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-naranja-texto">Inicio {fechaLarga(p.proximoInicio)}</span>
                    <span className="mt-1 block font-heading text-lg font-bold text-navy group-hover:text-naranja-texto">{p.titulo}</span>
                  </span>
                  <ArrowRight className="size-4 text-naranja transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section id="empresas" tone="base" className="!py-12">
        <Reveal className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-navy px-7 py-7 text-white">
          <div>
            <span className="tag-tech text-naranja-claro">Empresas</span>
            <p className="mt-1.5 font-heading text-xl font-bold">¿Formación BIM para tu equipo? Temario a medida, en vivo o en tus oficinas.</p>
          </div>
          <Link href="/empresas" data-btn className="inline-flex rounded-lg bg-naranja px-6 py-3 font-heading text-[14px] font-bold text-white hover:bg-naranja-claro">
            Ver formación para empresas
          </Link>
        </Reveal>
      </Section>

      <ContactoBloque />
    </>
  );
}
