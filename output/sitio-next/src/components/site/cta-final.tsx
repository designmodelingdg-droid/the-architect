import Link from "next/link";
import { WA_MSG } from "@/lib/site";
import { Reveal } from "./reveal";

export function CtaFinal({
  title = "Cuéntanos de tu proyecto",
  text = "Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo, sin compromiso y con una respuesta concreta sobre qué encontramos.",
  cta = "Agenda tu diagnóstico gratuito",
}: {
  title?: string;
  text?: string;
  cta?: string;
}) {
  return (
    <section className="fondo-cta border-t border-white/8 bg-navy px-5 py-20 text-center">
      <Reveal>
        <span className="tag-tech mb-4 inline-block text-naranja-claro">Listo para empezar</span>
        <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white md:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/70">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/contactos"
            data-btn
            className="rounded-lg bg-naranja px-7 py-3.5 font-heading text-[15px] font-bold text-white shadow-lg shadow-naranja/25 hover:bg-naranja-claro"
          >
            {cta}
          </Link>
          <a
            href={WA_MSG("Hola, quiero conversar sobre un proyecto de consultoría BIM")}
            target="_blank"
            rel="noopener"
            data-btn
            className="rounded-lg border border-white/25 px-7 py-3.5 font-heading text-[15px] font-bold text-white hover:border-naranja-claro hover:text-naranja-claro"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
