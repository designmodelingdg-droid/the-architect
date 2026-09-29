import type { Metadata } from "next";
import { Section } from "@/components/site/section";
import { alternos, RAZON_SOCIAL } from "@/lib/site";
import { PRIVACIDAD as SECCIONES, ACTUALIZADO_LEGAL } from "@/lib/legal-privacidad";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Política de protección de datos personales de Design Modeling Academy (${RAZON_SOCIAL}).`,
  alternates: alternos("/privacidad.md"),
};

export default function Privacidad() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <span className="tag-tech">Legal</span>
        <h1 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Política de privacidad</h1>
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
