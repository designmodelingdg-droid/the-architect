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
    <section className="bg-gradient-to-br from-naranja to-naranja-claro px-5 py-16 text-center text-white">
      <Reveal>
        <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
        <p className="mx-auto mt-3.5 max-w-xl leading-relaxed text-white/95">{text}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/contactos"
            data-btn
            className="rounded-lg bg-white px-7 py-3.5 font-heading text-[15px] font-bold text-naranja shadow-lg shadow-black/15 hover:shadow-xl"
          >
            {cta}
          </Link>
          <a
            href={WA_MSG("Hola, quiero conversar sobre un proyecto de consultoría BIM")}
            target="_blank"
            rel="noopener"
            data-btn
            className="rounded-lg border-2 border-white/70 px-7 py-3.5 font-heading text-[15px] font-bold text-white hover:bg-white/12"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
