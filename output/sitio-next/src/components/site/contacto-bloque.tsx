import Script from "next/script";
import { Reveal } from "./reveal";
import { Section } from "./section";
import { WA, WA_MSG, EMAIL } from "@/lib/site";

/* Formulario de contacto de Sharp CRM (LeadConnector white-label). El script
 * form_embed.js ajusta la altura del iframe al contenido del formulario. */
const FORM_ID = "OfA7Ehcb8QSo9VXIDe6X";
const FORM_URL = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`;

export function ContactoBloque({ conDatos = true }: { conDatos?: boolean }) {
  return (
    <Section id="contacto" tone="panel">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal>
          <span className="tag-tech mb-4 inline-block">Hablemos</span>
          <h2 className="text-3xl font-bold leading-tight text-navy md:text-4xl">Cuéntanos de tu proyecto</h2>
          <p className="mt-4 leading-relaxed text-tinta-suave md:text-lg">
            Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo y
            con una respuesta concreta sobre qué encontramos.
          </p>
          {conDatos ? (
            <dl className="mt-7 space-y-5 text-[15px] text-tinta">
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">Correo</dt>
                <dd><a className="hover:text-naranja" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
              </div>
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">Teléfonos</dt>
                <dd><a className="hover:text-naranja" href={WA} target="_blank" rel="noopener">(+593) 98 4372010 · WhatsApp</a></dd>
                <dd><a className="hover:text-naranja" href="tel:+59325137246">(02) 513-7246</a></dd>
              </div>
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">Oficina</dt>
                <dd className="text-tinta-suave">Juana Terrazas N71-154, Quito, Ecuador</dd>
              </div>
            </dl>
          ) : null}
          <p className="mt-7 text-[13.5px] text-tinta-suave">
            ¿Prefieres escribir directo?{" "}
            <a
              href={WA_MSG("Hola, quiero agendar un diagnóstico de consultoría BIM")}
              target="_blank"
              rel="noopener"
              className="font-bold text-navy hover:text-naranja"
            >
              Abre WhatsApp
            </a>{" "}
            y un consultor te responde en menos de 24 h.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="panel panel-glow overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <span className="tag-tech">Diagnóstico sin costo</span>
              <h3 className="mt-2 text-xl font-bold text-navy">Agenda tu diagnóstico gratuito</h3>
              <p className="mt-1 text-[13.5px] text-tinta-suave">
                Déjanos tus datos y qué proyecto tienes entre manos. Un consultor te contacta en 24 h.
              </p>
            </div>
            <div className="bg-white px-2 pb-2 pt-3 sm:px-4">
              <iframe
                src={FORM_URL}
                id={`inline-${FORM_ID}`}
                title="Formulario de contacto — Design Modeling DG"
                loading="lazy"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-activation-type="alwaysActivated"
                data-deactivation-type="neverDeactivate"
                data-form-name="Formulario de Contacto DG Design Modeling"
                data-height="640"
                data-layout-iframe-id={`inline-${FORM_ID}`}
                data-form-id={FORM_ID}
                className="block w-full border-0"
                style={{ minHeight: 640 }}
              />
            </div>
            <p className="border-t border-border px-5 py-3 text-center font-heading text-[10.5px] font-bold uppercase tracking-wider text-tinta-suave/80">
              Respuesta &lt; 24 h · Ecuador y toda Latinoamérica
            </p>
          </div>
        </Reveal>
      </div>
      <Script src="https://api.leadconnectorhq.com/js/form_embed.js" strategy="lazyOnload" />
    </Section>
  );
}
