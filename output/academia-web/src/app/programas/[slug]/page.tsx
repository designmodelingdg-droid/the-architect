import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Clock, CalendarDays, Users, Gauge, MessageCircle, ArrowRight } from "lucide-react";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal, HeroReveal } from "@/components/site/reveal";
import { TextoCinetico } from "@/components/site/texto-cinetico";
import { SelloCredencial } from "@/components/site/sello-credencial";
import { FichaDocente } from "@/components/site/ficha-docente";
import { TarjetaPrograma } from "@/components/site/tarjeta-programa";
import { programas, programa, docentes as todosDocentes, credenciales as todasCredenciales, nombresDocentes, nombresCredenciales, testimonios as todosTestimonios } from "@/lib/contenido";
import { precio, cuotas, horas, fechaLarga, etiquetaTipo, pluralTipo, rutaTipo, precioBase, aTarjeta, MODALIDAD, NIVEL_EXIGENCIA } from "@/lib/formato";
import { DOMINIO, METODO, PAGOS, WA_MSG, alternos } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await programas()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await programa(slug);
  if (!p) return {};
  return {
    title: p.titulo,
    description: p.resumen,
    alternates: alternos(`/programas/${slug}.md`),
    openGraph: p.imagen ? { images: [{ url: p.imagen }] } : undefined,
  };
}

export default async function PaginaPrograma({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await programa(slug);
  if (!p || p.estado !== "publico") notFound();

  const [todos, docs, creds, nomDoc, nomCred, tests] = await Promise.all([
    programas(), todosDocentes(), todasCredenciales(), nombresDocentes(), nombresCredenciales(), todosTestimonios(),
  ]);
  const misDocentes = docs.filter((d) => (p.docentes ?? []).includes(d.slug));
  const misCredenciales = creds.filter((c) => (p.credenciales ?? []).includes(c.slug));
  const incluidos = (p.incluye ?? []).map((s) => todos.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const misTestimonios = tests.filter((t) => t.programa === p.slug);
  const base = precioBase(p);
  const porCita = p.tipo === "master" || !p.mostrarPrecio || !base;
  const wa = p.whatsapp || WA_MSG(`Hola, quiero información sobre ${p.titulo}`);
  const ctaHref = porCita ? (p.urlCita || "/contacto#cita") : (p.urlMatricula || wa);
  const ctaTexto = porCita ? "Agenda tu cita informativa" : p.urlMatricula ? "Matricularme" : "Consultar por WhatsApp";
  const modulos = p.modulos ?? [];
  const sesiones = modulos.reduce((n, m) => n + (m.sesiones?.length ?? 0), 0);

  /* JSON-LD: Course + CourseInstance. El Máster va sin offers porque su precio se da en la cita. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${DOMINIO}/programas/${p.slug}#course`,
    name: p.titulo,
    description: p.resumen,
    url: `${DOMINIO}/programas/${p.slug}`,
    provider: { "@type": "EducationalOrganization", "@id": `${DOMINIO}/#academia`, name: "Design Modeling Academy", url: DOMINIO },
    inLanguage: "es",
    ...(p.imagen ? { image: `${DOMINIO}${p.imagen}` } : {}),
    ...(p.aprenderas?.length ? { teaches: p.aprenderas } : {}),
    ...(p.horas ? { timeRequired: `PT${p.horas}H` } : {}),
    ...(misCredenciales.length ? { educationalCredentialAwarded: misCredenciales.map((c) => c.nombre) } : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: p.modalidad === "vivo" ? "Online, en vivo" : p.modalidad === "pregrabado" ? "Online, a tu ritmo" : "Online, en vivo y grabado",
      ...(p.proximoInicio ? { startDate: p.proximoInicio } : {}),
      ...(p.horas ? { courseWorkload: `PT${p.horas}H` } : {}),
      ...(misDocentes.length ? { instructor: misDocentes.map((d) => ({ "@type": "Person", name: d.nombre })) } : {}),
    },
    ...(!porCita && base
      ? { offers: { "@type": "Offer", price: base.monto, priceCurrency: base.moneda || "USD", availability: "https://schema.org/InStock", url: `${DOMINIO}/programas/${p.slug}`, category: etiquetaTipo(p.tipo) } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Cabecera */}
      <div className="blueprint-fino border-b border-border bg-crema">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <HeroReveal>
            <nav aria-label="Miga de pan" className="mb-5 font-heading text-[11px] font-bold uppercase tracking-wider text-tinta-suave">
              <Link href="/" className="hover:text-naranja-texto">Inicio</Link>
              <span className="mx-2" aria-hidden>/</span>
              <Link href={rutaTipo(p.tipo)} className="hover:text-naranja-texto">{pluralTipo(p.tipo)}</Link>
            </nav>
            <span className="mb-4 inline-block rounded-full bg-azul-medio px-3 py-1 font-heading text-[10.5px] font-bold uppercase tracking-[0.14em] text-white">{etiquetaTipo(p.tipo)}</span>
            <h1 className="max-w-4xl text-3xl font-bold leading-[1.08] text-navy md:text-[3rem]">
              <TextoCinetico delay={0.1} partes={[{ texto: p.titulo }]} />
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-tinta-suave md:text-lg">{p.resumen}</p>
            <dl className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-tinta">
              {p.horas ? <div className="inline-flex items-center gap-1.5"><Clock className="size-4 text-naranja" aria-hidden /><dt className="sr-only">Horas certificadas</dt><dd>{horas(p.horas)} certificadas</dd></div> : null}
              {p.meses ? <div className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-naranja" aria-hidden /><dt className="sr-only">Duración</dt><dd>{p.meses} {p.meses === 1 ? "mes" : "meses"}</dd></div> : null}
              {p.modalidad ? <div className="inline-flex items-center gap-1.5"><Users className="size-4 text-naranja" aria-hidden /><dt className="sr-only">Modalidad</dt><dd>{MODALIDAD[p.modalidad]}</dd></div> : null}
              {p.nivel && p.nivel !== "todos" ? <div className="inline-flex items-center gap-1.5"><Gauge className="size-4 text-naranja" aria-hidden /><dt className="sr-only">Nivel</dt><dd>{NIVEL_EXIGENCIA[p.nivel]}</dd></div> : null}
              {p.proximoInicio ? <div className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-naranja" aria-hidden /><dt className="sr-only">Próximo inicio</dt><dd>Inicio {fechaLarga(p.proximoInicio)}</dd></div> : null}
            </dl>
          </HeroReveal>
        </div>
      </div>

      <Section tone="base">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div className="min-w-0 space-y-16">
            {p.paraQuien?.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Para quién es</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {p.paraQuien.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[15px] text-tinta"><Check className="mt-1 size-4 shrink-0 text-naranja" aria-hidden />{x}</li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {p.aprenderas?.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Qué vas a lograr</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {p.aprenderas.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[15px] text-tinta"><Check className="mt-1 size-4 shrink-0 text-naranja" aria-hidden />{x}</li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {p.descripcion ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Cómo es el programa</h2>
                {p.descripcion.split(/\n\s*\n/).map((par) => (
                  <p key={par.slice(0, 40)} className="mt-4 max-w-[65ch] leading-relaxed text-tinta">{par}</p>
                ))}
              </Reveal>
            ) : null}

            {modulos.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Plan de estudios</h2>
                <p className="mt-2 text-[14px] text-tinta-suave">
                  {modulos.length} {modulos.length === 1 ? "módulo" : "módulos"}{sesiones ? ` · ${sesiones} sesiones` : ""}
                </p>
                <ol className="mt-6 divide-y divide-border rounded-xl border border-border bg-white">
                  {modulos.map((m, i) => (
                    <li key={m.titulo + i}>
                      {m.sesiones?.length ? (
                        <details className="group">
                          <summary className="flex cursor-pointer list-none items-baseline gap-4 px-5 py-4 hover:bg-crema">
                            <span className="font-heading text-[12px] font-bold text-naranja-texto">{String(i + 1).padStart(2, "0")}</span>
                            <span className="flex-1 font-heading text-[15px] font-bold text-navy">{m.titulo}</span>
                            <span className="text-[12px] text-tinta-suave">{m.sesiones.length} sesiones</span>
                          </summary>
                          <ol className="space-y-1.5 px-5 pb-4 pl-14 text-[14px] text-tinta">
                            {m.sesiones.map((s, j) => (
                              <li key={s.titulo + j} className="flex justify-between gap-4">
                                <span>{s.titulo}</span>
                                {s.duracion ? <span className="shrink-0 text-tinta-suave">{s.duracion}</span> : null}
                              </li>
                            ))}
                          </ol>
                        </details>
                      ) : (
                        <div className="flex items-baseline gap-4 px-5 py-4">
                          <span className="font-heading text-[12px] font-bold text-naranja-texto">{String(i + 1).padStart(2, "0")}</span>
                          <span className="flex-1 font-heading text-[15px] font-bold text-navy">{m.titulo}</span>
                          {m.descripcion ? <span className="text-[12px] text-tinta-suave">{m.descripcion}</span> : null}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </Reveal>
            ) : null}

            {incluidos.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">{p.tipo === "master" ? "Los bloques y los bonos" : "Qué incluye"}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {incluidos.map((x) => (
                    <TarjetaPrograma key={x.slug} p={aTarjeta(x)} docentes={nomDoc} credenciales={nomCred} />
                  ))}
                </div>
              </Reveal>
            ) : null}

            {misCredenciales.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Credenciales que obtienes</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {misCredenciales.map((c) => <SelloCredencial key={c.slug} c={c} compacto />)}
                </div>
                <Link href="/acreditaciones" className="mt-4 inline-flex items-center gap-1.5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
                  Todas las acreditaciones <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Reveal>
            ) : null}

            {misDocentes.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Quién lo dicta</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {misDocentes.map((d) => <FichaDocente key={d.slug} d={d} />)}
                </div>
              </Reveal>
            ) : null}

            {p.beneficios?.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Qué incluye la matrícula</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {p.beneficios.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[15px] text-tinta"><Check className="mt-1 size-4 shrink-0 text-naranja" aria-hidden />{x}</li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            <Reveal>
              <h2 className="text-2xl font-bold text-navy md:text-3xl">Cómo se estudia</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {METODO.map((m) => (
                  <div key={m.titulo} className="rounded-xl bg-crema p-5">
                    <h3 className="font-heading text-[15px] font-bold text-navy">{m.titulo}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-tinta">{m.texto}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {misTestimonios.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Quienes ya lo cursaron</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {misTestimonios.map((t) => (
                    <blockquote key={t.slug} className="rounded-xl border border-border bg-white p-5">
                      <p className="text-[15px] leading-relaxed text-tinta">«{t.resultado}»</p>
                      <footer className="mt-3 text-[13px] text-tinta-suave">{t.nombre}{t.cargo ? `, ${t.cargo}` : ""}{t.pais ? ` · ${t.pais}` : ""}</footer>
                    </blockquote>
                  ))}
                </div>
              </Reveal>
            ) : null}

            {p.faq?.length ? (
              <Reveal>
                <h2 className="text-2xl font-bold text-navy md:text-3xl">Preguntas frecuentes</h2>
                <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-white">
                  {p.faq.map((f) => (
                    <details key={f.pregunta} className="group px-5 py-4">
                      <summary className="cursor-pointer list-none font-heading text-[15px] font-bold text-navy hover:text-naranja-texto">{f.pregunta}</summary>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-tinta">{f.respuesta}</p>
                    </details>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Ficha lateral fija */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="panel-glow rounded-2xl border border-border bg-white p-6">
              {porCita ? (
                <>
                  <span className="tag-tech">Admisión con cita</span>
                  <p className="mt-2 text-[15px] leading-relaxed text-tinta">
                    {p.tipo === "master"
                      ? "El precio, las opciones de pago y los bonos se revisan en una cita informativa de treinta minutos, sin costo."
                      : "Cuéntanos tu caso en una cita informativa sin costo y te decimos si este programa es para ti."}
                  </p>
                </>
              ) : (
                <>
                  <span className="tag-tech">Inversión</span>
                  <div className="mt-2 flex items-baseline gap-3">
                    {base!.tachado ? <s className="text-[14px] text-tinta-suave">{precio(base!.tachado, base!.moneda)}</s> : null}
                    <span className="font-heading text-3xl font-extrabold text-navy">{base!.monto === 0 ? "Gratis" : cuotas(base!)}</span>
                  </div>
                  {(p.precios ?? []).filter((x) => !x.pais && x !== base).length ? (
                    <ul className="mt-2 space-y-1 text-[13.5px] text-tinta-suave">
                      {(p.precios ?? []).filter((x) => !x.pais && x !== base).map((x, i) => <li key={i}>o {cuotas(x)}</li>)}
                    </ul>
                  ) : null}
                  {(p.precios ?? []).some((x) => x.pais) ? <p className="mt-2 text-[12.5px] text-tinta-suave">Precio en moneda local para México, Colombia, Chile, Argentina, Guatemala y Costa Rica al pagar.</p> : null}
                </>
              )}
              <a
                href={ctaHref}
                {...(ctaHref.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                data-btn
                className="mt-5 block rounded-lg bg-naranja px-6 py-3.5 text-center font-heading text-[15px] font-bold text-white hover:bg-azul"
              >
                {ctaTexto}
              </a>
              <a href={wa} target="_blank" rel="noopener" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 font-heading text-[13px] font-bold text-azul hover:border-azul">
                <MessageCircle className="size-4" aria-hidden /> Preguntar por WhatsApp
              </a>
              {p.brochure ? (
                <a href={p.brochure} target="_blank" rel="noopener" className="mt-3 block text-center font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
                  Descargar brochure
                </a>
              ) : null}
              {!porCita ? (
                <p className="mt-5 border-t border-border pt-4 text-[11.5px] leading-relaxed text-tinta-suave">
                  Pagos: {PAGOS.join(" · ")}.{p.excluidoDeSuscripcion ? " No incluido en la suscripción Design Premium." : ""}
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="navy">
        <SectionHead
          dark
          eyebrow="Siguiente paso"
          title={porCita ? "Agenda tu cita informativa" : "¿Dudas antes de matricularte?"}
          lead="Treinta minutos con un asesor académico para saber si este programa es para ti, qué necesitas para empezar y cómo pagarlo."
        />
        <Reveal className="mt-8 text-center">
          <Link href="/contacto#cita" data-btn className="inline-block rounded-lg bg-naranja px-7 py-3.5 font-heading text-[15px] font-bold text-white hover:bg-naranja-claro">
            Agendar cita gratuita
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
