import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WA, EMAIL, REDES, ACADEMIA, FAMILIAS } from "@/lib/site";

const COLS = [
  {
    title: "Consultoría",
    links: FAMILIAS.map((f) => ({ label: f.label, href: f.href ?? `/consultoria#${f.slug}` })),
  },
  {
    title: "Empresa",
    links: [
      { label: "Proyectos", href: "/proyectos" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Equipo", href: "/nosotros#equipo" },
      { label: "Acreditaciones", href: "/nosotros#acreditaciones" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contactos" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-navy px-5 pb-7 pt-14 text-azul-palido/70">
      <div className="mx-auto grid max-w-6xl gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/images/logo-dg-dark.png" alt="Design Modeling DG" width={190} height={45} className="mb-4 h-11 w-auto" />
          <p className="max-w-xs text-[13.5px] leading-relaxed">
            Consultoría BIM con inteligencia artificial para proyectos estructurales y
            arquitectónicos. Partner de Autodesk. Ecuador y Latinoamérica.
          </p>
          <a
            href={ACADEMIA}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-naranja-claro hover:text-white"
          >
            Design Modeling Academy <ArrowUpRight className="size-3" aria-hidden />
          </a>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h4 className="mb-3.5 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-naranja-claro">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13.5px] transition-colors hover:text-naranja-claro">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h4 className="mb-3.5 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-naranja-claro">Conversemos</h4>
          <ul className="space-y-2 text-[13.5px]">
            <li><a className="transition-colors hover:text-naranja-claro" href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><a className="transition-colors hover:text-naranja-claro" href={WA}>(+593) 98 4372010</a></li>
            <li><a className="transition-colors hover:text-naranja-claro" href="tel:+59325137246">(02) 513-7246</a></li>
            <li className="text-azul-palido/45">Quito, Ecuador</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {REDES.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener"
                aria-label={r.label}
                className="rounded-md border border-white/12 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-wider transition-colors hover:border-naranja/50 hover:text-naranja-claro"
              >
                {r.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-9 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5 text-[11.5px] text-azul-palido/45">
        <span>Copyright © 2026 MODELING-DG S.A.S · RUC: 1793148549001 · Todos los derechos reservados.</span>
        <span className="space-x-2">
          <Link className="hover:text-naranja-claro" href="/terminos">Términos y condiciones</Link>
          <span aria-hidden>·</span>
          <Link className="hover:text-naranja-claro" href="/privacidad">Políticas de privacidad</Link>
        </span>
      </div>
      <p className="mx-auto mt-4 max-w-6xl text-center text-sm text-azul-palido/30">
        Built with <a href="https://tododeia.com" className="underline-offset-2 hover:underline">Claude Web Builder by Tododeia</a>
      </p>
    </footer>
  );
}
