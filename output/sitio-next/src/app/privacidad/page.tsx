import type { Metadata } from "next";
import { Section } from "@/components/site/section";

export const metadata: Metadata = { title: "Políticas de privacidad" };

// TODO: migrar el texto legal completo desde WordPress (/politicas-de-privacidad/)
export default function Privacidad() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-azul">Políticas de privacidad</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          MODELING-DG S.A.S · RUC: 1793148549001 · Quito, Ecuador. El texto legal completo está
          disponible a solicitud en info@dgdesignmodeling.com mientras completamos la migración de
          esta página.
        </p>
      </div>
    </Section>
  );
}
