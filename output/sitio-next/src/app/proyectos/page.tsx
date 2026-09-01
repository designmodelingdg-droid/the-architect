import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHead } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CtaFinal } from "@/components/site/cta-final";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos reales de consultoría BIM y cálculo estructural en Ecuador, México, Colombia, Panamá, Perú y Costa Rica: edificaciones, silos industriales, naves y librerías BIM.",
};

const RECIENTES = [
  {
    img: "/images/proy-piscina.jpg",
    imgAlt: "Detalle constructivo real del vaso de la piscina: losa, muros, cabezales y micropilotes",
    titulo: "Prediseño estructural — Piscina principal P-01",
    cliente: "Castillo del Sol Wellness · Costa Rica · 2026",
    desc: "Prediseño de una piscina de borde infinito de 88,4 m² junto a un talud con condición sísmica importante. La solución: vaso monolítico de concreto reforzado sobre cimentación profunda de micropilotes al estrato rígido, con estrategia de impermeabilización multibarrera.",
    datos: [
      ["88,4 m²", "de superficie del vaso"],
      ["133 t", "de agua contenida"],
      ["12", "micropilotes al estrato rígido"],
      ["60 m³", "de concreto estructural"],
    ],
    alcance: ["Informe de prediseño con cantidades presupuestables", "Losa de 30 cm y muros de 25 cm con acero en ambas caras", "Borde infinito integrado con viga perimetral", "230 m² de impermeabilización + 45 ml de waterstop"],
  },
];

const HISTORIAL = [
  {
    img: "/images/proy-kayuko.jpg",
    titulo: "Edificio Kayuko",
    lugar: "Oaxaca, México · 2021",
    desc: "Edificio de 5 niveles más subsuelo en hormigón armado. Análisis modal espectral y detallado de elementos en Robot Structural Analysis; modelo BIM en Revit.",
  },
  {
    img: "/images/proy-soraya.jpg",
    titulo: "Residencias Soraya",
    lugar: "Quito, Ecuador · 2021",
    cliente: "Proding & Construcciones S.A.",
    desc: "600 m² de estructura de acero incluyendo cimentaciones y muros de contención, con su documentación completa de planos estructurales.",
  },
  {
    img: "/images/proy-ventanas.jpg",
    titulo: "Nave industrial Cantón Ventanas",
    lugar: "Los Ríos, Ecuador · 2021",
    cliente: "Galileo Diseño & Construcción Co. Ltda.",
    desc: "Modelado estructural de 3.600 m² de nave industrial con perfiles tubulares, calculada en SAP2000.",
  },
  {
    img: "/images/proy-tanque.jpg",
    titulo: "Tanque elevado y cisterna",
    lugar: "Cantón Ventanas, Ecuador · 2021",
    cliente: "Galileo Diseño & Construcción Co. Ltda.",
    desc: "Estudios de ingeniería para tanque elevado de 100 m³ y cisterna baja de 1.500 m³ en SAP2000, con especificaciones técnicas, presupuesto y APU.",
  },
  {
    img: "/images/proy-petapa.jpg",
    titulo: "Conjunto Residencial San Miguel Petapa",
    lugar: "Guatemala · 2021",
    cliente: "ARCONSA S.A.",
    desc: "Diseño y modelado de estructuras de acero tipo en Robot Structural Analysis para un conjunto residencial de 1.500 m² de construcción.",
  },
  {
    img: "/images/proy-susana.jpg",
    titulo: "Conjunto Residencial La Susana",
    lugar: "Bocas del Toro, Panamá · 2021",
    cliente: "Ing. Elías Quiel Castillo",
    desc: "Estructura mixta acero-madera de 650 m², incluyendo el diseño de piscina y muros de sótano.",
  },
  {
    img: "/images/proy-fusagasuga.jpg",
    titulo: "Multifamiliar Residencia Fusagasugá",
    lugar: "Bogotá, Colombia · 2020",
    desc: "Edificio de 6 niveles más subsuelo. Análisis modal espectral y análisis pushover con detallado de hormigón armado; modelado BIM en Revit.",
  },
  {
    img: "/images/proy-silos.jpg",
    titulo: "Silos Packaging & Process Building",
    lugar: "Quito, Ecuador — Brasil · 2020",
    desc: "Ocho silos de almacenamiento de carbonato de calcio, 120 toneladas en total. Planos estructurales, ingeniería de detalle y diseño de conexiones en Revit.",
  },
  {
    img: "/images/proy-camara.jpg",
    titulo: "Cámara de Carga",
    lugar: "Perú · 2020",
    desc: "Barra de contención en estructura de acero con modelado BIM, cálculo estructural e ingeniería de detalle de conexiones.",
  },
  {
    img: "/images/proy-campamentos.jpg",
    titulo: "Naves industriales y campamentos",
    lugar: "Ambato, Ecuador · 2019",
    desc: "Cuatro campamentos en estructura metálica tubular unida con placas y pernos de alta resistencia, montados sobre contenedores industriales y cubiertos con membrana.",
  },
  {
    img: "/images/proy-vicala.jpg",
    titulo: "Proyecto Vicala",
    lugar: "Panamá · 2020",
    desc: "Galpón industrial diseñado con las condiciones críticas del suelo y códigos internacionales; cálculo en ETABS.",
  },
  {
    img: "/images/proy-comboy.jpg",
    titulo: "Proyecto Comboy",
    lugar: "Fusagasugá, Colombia · 2020",
    desc: "Vivienda unifamiliar de 3 niveles. Análisis y cálculo estructural en ETABS, modelado BIM y planos estructurales en Revit.",
  },
  {
    img: "/images/proy-paucar.jpg",
    titulo: "Residencia Paucar",
    lugar: "Quito, Ecuador · 2019",
    desc: "Diseño y cálculo estructural de edificación mixta en estructura de acero y hormigón.",
  },
  {
    img: "/images/proy-caracol.jpg",
    titulo: "Ampliación C.C. Caracol",
    lugar: "Quito, Ecuador · 2018",
    cliente: "Ramalta Estructura y Construcción Cía. Ltda.",
    desc: "Modelado estructural, validación de cargas existentes y ampliación de 2.000 m² de locales comerciales en estructuras de acero.",
  },
  {
    img: "/images/proy-rossel.jpg",
    titulo: "Proyecto Vicente Rossel",
    lugar: "Guayaquil, Ecuador · 2020",
    desc: "Diseño de módulos de naves industriales en serie con un área total de 1.080 m².",
  },
];

export default function Proyectos() {
  return (
    <>
      <PageHero
        num="03"
        eyebrow="Proyectos"
        title="El criterio se demuestra en obra"
        lead="Proyectos reales en Ecuador, México, Colombia, Panamá, Perú y Costa Rica. Lo que ves aquí son nuestros propios modelos de cálculo, detalles constructivos y entregables — no fotos de banco de imágenes."
        crumb={{ label: "Proyectos", href: "/proyectos" }}
        fondo="/images/ing/historia-16-grua-torre.jpg"
      />

      {/* Proyectos recientes */}
      <Section>
        <SectionHead
          num="01"
          eyebrow="Recientes"
          title="Lo último que hemos entregado"
        />
        <div className="mt-12 space-y-8">
          {RECIENTES.map((p) => (
            <Reveal key={p.titulo}>
              <article className="panel overflow-hidden">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                    <Image src={p.img} alt={p.imgAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-7 md:p-9">
                    <span className="font-heading text-[10.5px] font-bold uppercase tracking-[0.15em] text-tinta-suave">{p.cliente}</span>
                    <h3 className="mt-2 text-2xl font-bold text-navy md:text-3xl">{p.titulo}</h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-tinta-suave">{p.desc}</p>
                    <ul className="mt-4 space-y-2">
                      {p.alcance.map((a) => (
                        <li key={a} className="flex gap-2.5 text-[13.5px] text-tinta">
                          <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-naranja" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <dl className="grid grid-cols-2 border-t border-border md:grid-cols-4">
                  {p.datos.map(([n, l]) => (
                    <div key={l} className="border-r border-border px-4 py-4 text-center last:border-r-0">
                      <dt className="sr-only">{l}</dt>
                      <dd className="font-heading text-xl font-extrabold text-naranja">{n}</dd>
                      <dd className="mt-0.5 font-heading text-[10px] font-bold uppercase tracking-[0.1em] text-tinta-suave">{l}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <article className="panel grid gap-6 border-l-2 border-l-naranja p-7 md:p-9 lg:grid-cols-[1fr_1fr]">
              <div>
                <span className="font-heading text-[10.5px] font-bold uppercase tracking-[0.15em] text-tinta-suave">
                  Tradycsa Services S.A. · Panamá · 2026
                </span>
                <h3 className="mt-2 text-2xl font-bold text-navy md:text-3xl">Biblioteca BIM paramétrica de torres eléctricas</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-tinta-suave">
                  Convertimos los componentes recurrentes de torres eléctricas — torres, crucetas, soportes y
                  accesorios — en familias paramétricas de Revit reutilizables y estandarizadas: el conocimiento
                  técnico de la empresa transformado en un activo digital.
                </p>
              </div>
              <ul className="space-y-2 self-center">
                {[
                  "Familias .RFA configurables por parámetros (dimensiones, materiales, códigos)",
                  "Nomenclatura, clasificación y estándar corporativo de la librería",
                  "Una familia + tipos en lugar de diez modelos independientes",
                  "Metodología escalable a fabricantes y catálogos industriales",
                ].map((a) => (
                  <li key={a} className="flex gap-2.5 text-[13.5px] text-tinta">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-naranja" />
                    {a}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </Section>

      {/* Historial */}
      <Section tone="panel">
        <SectionHead
          num="02"
          eyebrow="Historial 2018–2021"
          title="Una década de estructuras en Latinoamérica"
          lead="Las imágenes son nuestros modelos reales de análisis y BIM de cada proyecto."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HISTORIAL.map((p, i) => (
            <Reveal key={p.titulo} delay={(i % 3) * 0.06}>
              <article className="panel h-full overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <Image src={p.img} alt={`Modelo estructural de ${p.titulo}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="border-t border-border p-5">
                  <span className="font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-naranja">{p.lugar}</span>
                  <h3 className="mt-1 text-base font-bold text-navy">{p.titulo}</h3>
                  {"cliente" in p && p.cliente ? (
                    <p className="mt-0.5 text-[11.5px] font-semibold text-tinta-suave">Cliente: {p.cliente}</p>
                  ) : null}
                  <p className="mt-1.5 text-[13px] leading-relaxed text-tinta-suave">{p.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-xl">
          <p className="panel px-6 py-4 text-center font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-suave">
            Dossier completo de proyectos disponible a solicitud →{" "}
            <a href="/contactos" className="text-naranja hover:text-azul">pídelo aquí</a>
          </p>
        </Reveal>
      </Section>

      <CtaFinal title="¿Tu proyecto es el siguiente de esta lista?" text="Agenda un diagnóstico sin costo y te decimos qué encontramos, con evidencia." />
    </>
  );
}
