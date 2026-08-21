import { Reveal } from "./reveal";
import { Section } from "./section";
import { WA, WA_MSG, EMAIL } from "@/lib/site";

/*
 * Bloque de contacto compartido (home + /contactos).
 * TODO: cuando esté el Form ID de Sharp CRM, reemplazar el bloque de botones
 * por el iframe: https://link.apisystem.tech/widget/form/{FORM_ID}
 */
export function ContactoBloque({ conDatos = true }: { conDatos?: boolean }) {
  return (
    <Section id="contacto" tone="white">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal>
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] text-naranja">Hablemos</span>
          <h2 className="text-3xl font-bold leading-tight text-azul md:text-4xl">Cuéntanos de tu proyecto</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
            Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo y
            con una respuesta concreta sobre qué encontramos.
          </p>
          {conDatos ? (
            <dl className="mt-7 space-y-5 text-[15px]">
              <div>
                <dt className="mb-1.5 text-xs font-bold uppercase tracking-[1.6px] text-naranja">Correo</dt>
                <dd><a className="hover:text-naranja" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
              </div>
              <div>
                <dt className="mb-1.5 text-xs font-bold uppercase tracking-[1.6px] text-naranja">Teléfonos</dt>
                <dd><a className="hover:text-naranja" href={WA} target="_blank" rel="noopener">(+593) 98 4372010 · WhatsApp</a></dd>
                <dd><a className="hover:text-naranja" href="tel:+59325137246">(02) 513-7246</a></dd>
              </div>
              <div>
                <dt className="mb-1.5 text-xs font-bold uppercase tracking-[1.6px] text-naranja">Oficina</dt>
                <dd className="text-muted-foreground">Tomasa Mideros y Juana Terrazas OE4-86, Quito, Ecuador</dd>
              </div>
            </dl>
          ) : null}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-border shadow-xl shadow-azul/12">
            <div className="bg-gradient-to-br from-naranja to-naranja-claro p-6 text-white">
              <span className="mb-2 inline-block rounded bg-white/22 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px]">
                Sin costo · Sin compromiso
              </span>
              <h3 className="text-xl font-bold">Agenda tu diagnóstico gratuito</h3>
              <p className="mt-1 text-[13.5px] text-white/93">
                Revisamos tu proyecto y te decimos qué encontramos. Un consultor te contacta en 24 h.
              </p>
            </div>
            <div className="p-6">
              <div className="rounded-xl border-2 border-dashed border-border bg-crema px-6 py-9 text-center">
                <p className="font-heading text-[15px] font-bold text-azul">Escríbenos directo</p>
                <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                  Cuéntanos qué proyecto tienes entre manos y te respondemos el mismo día.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href={WA_MSG("Hola, quiero agendar un diagnóstico de consultoría BIM")}
                    target="_blank"
                    rel="noopener"
                    data-btn
                    className="rounded-lg bg-[#25D366] px-5 py-3.5 font-heading text-[14.5px] font-bold text-white hover:brightness-105"
                  >
                    Escríbenos por WhatsApp
                  </a>
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent("Diagnóstico de consultoría BIM")}`}
                    data-btn
                    className="rounded-lg border-2 border-azul px-5 py-3 font-heading text-sm font-bold text-azul hover:bg-azul hover:text-white"
                  >
                    {EMAIL}
                  </a>
                </div>
              </div>
            </div>
            <p className="border-t border-border px-5 py-3 text-center text-[11.5px] text-muted-foreground">
              Respuesta en menos de 24 h · Atendemos Ecuador y toda Latinoamérica
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
