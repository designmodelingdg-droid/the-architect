import Image from "next/image";
import Link from "next/link";
import { WA, EMAIL } from "@/lib/site";

const COLS = [
  {
    title: "Servicios",
    links: [
      { label: "Cálculo estructural", href: "/servicios#calculo" },
      { label: "Arquitectura y planos", href: "/servicios#arquitectura" },
      { label: "Coordinación BIM", href: "/servicios#coordinacion" },
      { label: "Implementación BIM", href: "/servicios#implementacion" },
      { label: "DG BIM Intelligence", href: "/dg-bim-intelligence" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Quiénes somos", href: "/quienes-somos" },
      { label: "Acreditaciones", href: "/acreditaciones" },
      { label: "Bolsa de trabajo", href: "/bolsa-de-trabajo" },
      { label: "Blog", href: "/blog" },
      { label: "Design Modeling Academy", href: "https://designmodelingacademy.com/es/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy px-5 pb-7 pt-14 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/images/logo-dg.png" alt="Design Modeling DG" width={190} height={45} className="mb-4 h-11 w-auto" />
          <p className="max-w-xs text-[13.5px] leading-relaxed text-white/60">
            Consultoría BIM para proyectos estructurales y arquitectónicos. Partner y Centro de
            Formación Autorizado de Autodesk. Ecuador y Latinoamérica.
          </p>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h4 className="mb-3.5 text-xs font-bold uppercase tracking-[1.8px] text-naranja-claro">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13.5px] text-white/72 transition-colors hover:text-naranja-claro">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h4 className="mb-3.5 text-xs font-bold uppercase tracking-[1.8px] text-naranja-claro">Conversemos</h4>
          <ul className="space-y-2 text-[13.5px]">
            <li><a className="transition-colors hover:text-naranja-claro" href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><a className="transition-colors hover:text-naranja-claro" href={WA}>(+593) 98 4372010</a></li>
            <li><a className="transition-colors hover:text-naranja-claro" href="tel:+59325137246">(02) 513-7246</a></li>
            <li className="text-white/55">Tomasa Mideros y Juana Terrazas OE4-86</li>
            <li className="text-white/55">Quito, Ecuador</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-9 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[11.5px] text-white/45">
        <span>Copyright © 2026 MODELING-DG S.A.S · RUC: 1793148549001 · Todos los derechos reservados.</span>
        <span className="space-x-2">
          <Link className="text-white/60 hover:text-naranja-claro" href="/terminos">Términos y condiciones</Link>
          <span aria-hidden>·</span>
          <Link className="text-white/60 hover:text-naranja-claro" href="/privacidad">Políticas de privacidad</Link>
        </span>
      </div>
      <p className="mx-auto mt-4 max-w-6xl text-center text-sm text-white/35">
        Built with <a href="https://tododeia.com" className="underline-offset-2 hover:underline">Claude Web Builder by Tododeia</a>
      </p>
    </footer>
  );
}
