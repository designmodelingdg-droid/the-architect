import Script from "next/script";
import { Reveal } from "./reveal";
import { Section } from "./section";
import { WA, WA_MSG, EMAIL, TELEFONO_VISIBLE, FORM_CONTACTO_ID, CALENDARIO_CITA_URL } from "@/lib/site";

/*
 * Contacto de la academia, en dos puertas: la cita informativa gratuita (el
 * calendario de Sharp CRM) y el formulario de Sharp CRM embebido, sin tarjeta
 * envolvente. Mientras falte un identificador, esa puerta manda a WhatsApp en
 * vez de mostrar un hueco.
 */
const FORM_URL = FORM_CONTACTO_ID ? `https://api.leadconnectorhq.com/widget/form/${FORM_CONTACTO_ID}` : "";

export function ContactoBloque({ conDatos = true }: { conDatos?: boolean }) {
  return (
    <Section id="contacto" tone="panel">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal>
          <span className="tag-tech mb-4 inline-block">Hablemos</span>
          <h2 className="text-3xl font-bold leading-tight text-navy md:text-4xl">Cuéntanos qué quieres aprender</h2>
          <p className="mt-4 leading-relaxed text-tinta-suave md:text-lg">
            Una cita informativa de treinta minutos, sin costo, para saber qué programa te
            conviene según lo que ya sabes y adónde quieres llegar.
          </p>
          {conDatos ? (
            <dl className="mt-7 space-y-5 text-[15px] text-tinta">
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">Correo</dt>
                <dd><a className="hover:text-naranja-texto" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
              </div>
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">WhatsApp</dt>
                <dd><a className="hover:text-naranja-texto" href={WA} target="_blank" rel="noopener">{TELEFONO_VISIBLE}</a></dd>
              </div>
              <div>
                <dt className="tag-tech mb-1.5 !text-tinta-suave">Horario de atención</dt>
                <dd className="text-tinta-suave">Lunes a viernes, 9:00 a 18:00 (hora de Ecuador, UTC−5)</dd>
              </div>
            </dl>
          ) : null}
          <p className="mt-7 text-[13.5px] text-tinta-suave">
            ¿Prefieres escribir directo?{" "}
            <a
              href={WA_MSG("Hola, quiero información sobre los programas de Design Modeling Academy")}
              target="_blank"
              rel="noopener"
              className="font-bold text-navy hover:text-naranja-texto"
            >
              Abre WhatsApp
            </a>{" "}
            y un asesor te responde en menos de 24 h.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div id="cita" className="scroll-mt-28">
            <span className="tag-tech">Cita informativa</span>
            <h3 className="mt-2 text-xl font-bold text-navy">Agenda tu cita gratuita</h3>
            <p className="mt-1 mb-5 text-[13.5px] text-tinta-suave">
              Elige día y hora. Un asesor académico te llama por Zoom o WhatsApp.
            </p>
            {CALENDARIO_CITA_URL ? (
              <iframe
                src={CALENDARIO_CITA_URL}
                title="Calendario de citas informativas — Design Modeling Academy"
                loading="lazy"
                className="block w-full rounded-lg border-0"
                style={{ height: 720 }}
              />
            ) : (
              <a
                href={WA_MSG("Hola, quiero agendar una cita informativa con Design Modeling Academy")}
                target="_blank"
                rel="noopener"
                data-btn
                className="inline-flex rounded-lg bg-naranja px-6 py-3.5 font-heading text-[15px] font-bold text-white hover:bg-azul"
              >
                Agendar por WhatsApp
              </a>
            )}
          </div>

          {FORM_URL ? (
            <div id="formulario" className="mt-12 scroll-mt-28">
              <span className="tag-tech">Escríbenos</span>
              <h3 className="mt-2 text-xl font-bold text-navy">Déjanos tus datos</h3>
              <p className="mt-1 mb-5 text-[13.5px] text-tinta-suave">
                Cuéntanos qué quieres aprender y te contactamos en 24 h.
              </p>
              <iframe
                src={FORM_URL}
                id={`inline-${FORM_CONTACTO_ID}`}
                title="Formulario de contacto — Design Modeling Academy"
                loading="lazy"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-activation-type="alwaysActivated"
                data-deactivation-type="neverDeactivate"
                data-form-name="Formulario de Contacto Design Modeling Academy"
                data-height="560"
                data-layout-iframe-id={`inline-${FORM_CONTACTO_ID}`}
                data-form-id={FORM_CONTACTO_ID}
                className="block w-full border-0"
                style={{ height: 560 }}
              />
            </div>
          ) : null}
        </Reveal>
      </div>
      {FORM_URL ? <Script src="https://api.leadconnectorhq.com/js/form_embed.js" strategy="lazyOnload" /> : null}
    </Section>
  );
}
