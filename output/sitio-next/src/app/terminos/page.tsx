import type { Metadata } from "next";
import { Section } from "@/components/site/section";

export const metadata: Metadata = { title: "Términos y condiciones" };

// TODO: migrar el texto legal definitivo (base: designmodelingacademy.com/es/terminos-condiciones)
export default function Terminos() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-navy">Términos y condiciones</h1>
        <p className="mt-4 leading-relaxed text-tinta-suave">
          MODELING-DG S.A.S · RUC: 1793148549001 · Quito, Ecuador. El texto legal completo está
          disponible a solicitud en info@dgdesignmodeling.com mientras completamos la migración de
          esta página.
        </p>
      </div>
    </Section>
  );
}
