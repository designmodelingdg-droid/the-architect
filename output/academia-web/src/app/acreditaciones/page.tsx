import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { SelloCredencial } from "@/components/site/sello-credencial";
import { Reveal } from "@/components/site/reveal";
import { ContactoBloque } from "@/components/site/contacto-bloque";
import { credenciales, avales } from "@/lib/contenido";
import { alternos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Acreditaciones",
  description: "Las credenciales que otorga Design Modeling Academy y quién las respalda: Autodesk Authorized Training Center, Certiport, CYPE, título ISTE con registro SENESCYT, Sabal University y más.",
  alternates: alternos("/acreditaciones.md"),
};

/*
 * Para un ingeniero de Ecuador o Colombia, la acreditación es la decisión de
 * compra. Por eso es una sección de primer nivel y no un pie de página: cada
 * credencial dice qué certifica, quién la emite y dónde se verifica.
 */
export default async function Acreditaciones() {
  const [creds, avs] = await Promise.all([credenciales(), avales()]);
  return (
    <>
      <PageHero
        eyebrow="Acreditaciones"
        title="Credenciales que se verifican"
        lead="Cada programa dice qué credencial otorga. Aquí está quién la emite, qué certifica y su registro oficial cuando lo tiene."
        crumb={{ label: "Acreditaciones", href: "/acreditaciones" }}
      />

      <Section tone="base">
        <SectionHead
          eyebrow="Credenciales"
          title={`${creds.length} vías de certificación`}
          lead="Del certificado de finalización de Autodesk al título propio con registro en la SENESCYT. Cada programa indica cuáles otorga."
          center={false}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creds.map((c, i) => (
            <Reveal key={c.slug} delay={Math.min(i, 6) * 0.05}>
              <SelloCredencial c={c} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="panel">
        <SectionHead
          eyebrow="Avales"
          title="Quién respalda a la escuela"
          lead="Relaciones oficiales con los fabricantes del software que se enseña y con quienes emiten los títulos."
          center={false}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {avs.map((a, i) => (
            <Reveal key={a.slug} delay={Math.min(i, 6) * 0.05}>
              <article className="flex h-full items-start gap-4 rounded-2xl border border-border bg-white p-5">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
                  {a.logo ? (
                    <Image src={a.logo} alt={`Logo de ${a.nombre}`} width={56} height={56} className="size-full object-contain p-1.5" />
                  ) : (
                    <ShieldCheck className="size-6 text-naranja" aria-hidden />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-[15px] font-bold leading-snug text-navy">{a.nombre}</h3>
                  {a.tipo ? <p className="mt-1 text-[13px] leading-snug text-tinta">{a.tipo}</p> : null}
                  {a.desde ? <p className="mt-1 text-[12px] text-tinta-suave">Desde {a.desde}</p> : null}
                  {a.url ? (
                    <a href={a.url} target="_blank" rel="noopener" className="mt-2 inline-block font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-naranja-texto hover:text-navy">
                      Verificar
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <Reveal>
            <span className="tag-tech mb-4 inline-block text-naranja-claro">Cómo verificar un certificado</span>
            <h2 className="text-3xl font-bold leading-tight text-white md:text-[2.3rem]">Cada certificado lleva un código QR</h2>
            <p className="mt-4 leading-relaxed text-white/70 md:text-lg">
              El QR abre la ficha del certificado con el nombre, el programa, las horas y la fecha.
              Los títulos universitarios se verifican además en el registro del emisor: la SENESCYT
              para el título ISTE y el Florida Department of Education para Sabal University.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-naranja-claro">Si te piden validar un certificado</p>
              <p className="mt-3 text-[15px] leading-relaxed text-white/85">
                Escribe a la escuela con el código del certificado y te confirmamos su emisión por correo.
                Un empleador puede hacerlo directamente, sin pasar por el alumno.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <ContactoBloque conDatos={false} />
    </>
  );
}
