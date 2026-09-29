import type { Metadata } from "next";
import { Section } from "@/components/site/section";
import { alternos, RAZON_SOCIAL } from "@/lib/site";
import { TERMINOS as SECCIONES, ACTUALIZADO_LEGAL } from "@/lib/legal-terminos";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: `Términos y condiciones de uso del sitio y de los programas de formación de Design Modeling Academy, operada por ${RAZON_SOCIAL}.`,
  alternates: alternos("/terminos.md"),
};

/*
 * Términos de la academia. Lo que no está aquí a propósito: la política de
 * reembolsos y cancelaciones, que redacta el abogado (la web anterior no la
 * tenía y no se hereda una inventada). Mientras llega, la sección 6 dice lo
 * único cierto: se acuerda por escrito antes de matricular.
 */
export default function Terminos() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <span className="tag-tech">Legal</span>
        <h1 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Términos y condiciones</h1>
        <p className="mt-3 text-[14px] text-tinta-suave">Última actualización: {ACTUALIZADO_LEGAL}</p>
        <div className="mt-8 space-y-7">
          {SECCIONES.map(([t, ps]) => (
            <section key={t}>
              <h2 className="text-lg font-bold text-navy">{t}</h2>
              {ps.map((p) => (
                <p key={p.slice(0, 40)} className="mt-2 leading-relaxed text-tinta-suave">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
