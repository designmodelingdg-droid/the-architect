import { Reveal } from "./reveal";
import { Section } from "./section";
import { WA, WA_MSG, EMAIL } from "@/lib/site";

/*
 * TODO: cuando esté el Form ID de Sharp CRM, reemplazar el bloque de botones
 * por el iframe: https://link.apisystem.tech/widget/form/{FORM_ID}
 */
export function ContactoBloque({ conDatos = true }: { conDatos?: boolean }) {
  return (
    <Section id="contacto" tone="panel">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal>
          <span className="tag-tech mb-4 inline-block">// hablemos</span>
          <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">Cuéntanos de tu proyecto</h2>
          <p className="mt-4 leading-relaxed text-tinta-suave md:text-lg">
            Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo y
            con una respuesta concreta sobre qué encontramos.
          </p>
          {conDatos ? (
            <dl className="mt-7 space-y-5 text-[15px] text-tinta/90">
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">Correo</dt>
                <dd><a className="hover:text-naranja-claro" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
              </div>
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">Teléfonos</dt>
                <dd><a className="hover:text-naranja-claro" href={WA} target="_blank" rel="noopener">(+593) 98 4372010 · WhatsApp</a></dd>
                <dd><a className="hover:text-naranja-claro" href="tel:+59325137246">(02) 513-7246</a></dd>
              </div>
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">Oficina</dt>
                <dd className="text-tinta-suave">Tomasa Mideros y Juana Terrazas OE4-86, Quito, Ecuador</dd>
              </div>
            </dl>
          ) : null}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="panel panel-glow overflow-hidden">
            <div className="border-b border-white/8 px-6 py-5">
              <span className="tag-tech">solicitud_diagnostico.init</span>
              <h3 className="mt-2 text-xl font-bold text-white">Agenda tu diagnóstico gratuito</h3>
              <p className="mt-1 text-[13.5px] text-tinta-suave">
                Revisamos tu proyecto y te decimos qué encontramos. Un consultor te contacta en 24 h.
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-2.5">
                <a
                  href={WA_MSG("Hola, quiero agendar un diagnóstico de consultoría BIM")}
                  target="_blank"
                  rel="noopener"
                  data-btn
                  className="rounded-lg bg-[#25D366] px-5 py-3.5 text-center font-heading text-[14.5px] font-bold text-white hover:brightness-105"
                >
                  Escríbenos por WhatsApp
                </a>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent("Diagnóstico de consultoría BIM")}`}
                  data-btn
                  className="rounded-lg border border-white/20 px-5 py-3 text-center font-heading text-sm font-bold text-tinta hover:border-naranja-claro hover:text-naranja-claro"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
            <p className="border-t border-white/8 px-5 py-3 text-center font-mono-tech text-[10.5px] uppercase tracking-wider text-tinta-suave/80">
              Respuesta &lt; 24 h · Ecuador y toda Latinoamérica
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
