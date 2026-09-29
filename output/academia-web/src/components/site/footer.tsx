import Link from "next/link";
import { Logo } from "./logo";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { WA, EMAIL, TELEFONO_VISIBLE, REDES, CAMPUS, CONSULTORIA, NIVELES, OTROS_TIPOS, RAZON_SOCIAL, RUC } from "@/lib/site";

const COLS = [
  {
    title: "Programas",
    links: [
      ...NIVELES.map((n) => ({ label: n.plural, href: `/${n.slug}` })),
      ...OTROS_TIPOS.map((o) => ({ label: o.plural, href: `/${o.slug}` })),
    ],
  },
  {
    title: "Escuela",
    links: [
      { label: "Acreditaciones", href: "/acreditaciones" },
      { label: "Docentes", href: "/docentes" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Empresas", href: "/empresas" },
      { label: "Eventos", href: "/eventos" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-navy px-5 pb-7 pt-14 text-azul-palido/70">
      <div className="mx-auto grid max-w-6xl gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4"><Logo oscuro className="h-14 w-auto" /></div>
          <p className="max-w-xs text-[13.5px] leading-relaxed">
            Escuela online de BIM, ingeniería estructural e inteligencia artificial
            aplicada. Autodesk Authorized Training Center. Latinoamérica, España y Estados Unidos.
          </p>
          <a
            href={CAMPUS}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-naranja-claro hover:text-white"
          >
            <GraduationCap className="size-3.5" aria-hidden /> Entrar al campus
          </a>
          <a
            href={CONSULTORIA}
            target="_blank"
            rel="noopener"
            className="mt-2 block font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-azul-palido/70 hover:text-white"
          >
            Design Modeling DG · Consultoría <ArrowUpRight className="inline size-3" aria-hidden />
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
            <li><a className="transition-colors hover:text-naranja-claro" href={WA} target="_blank" rel="noopener">{TELEFONO_VISIBLE}</a></li>
            <li className="text-azul-palido/55">Quito, Ecuador</li>
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
      <div className="mx-auto mt-9 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5 text-[11.5px] text-azul-palido/55">
        <span>Copyright © {new Date().getFullYear()} {RAZON_SOCIAL} · RUC: {RUC} · Todos los derechos reservados.</span>
        <span className="space-x-2">
          <Link className="hover:text-naranja-claro" href="/terminos">Términos y condiciones</Link>
          <span aria-hidden>·</span>
          <Link className="hover:text-naranja-claro" href="/privacidad">Política de privacidad</Link>
        </span>
      </div>
    </footer>
  );
}
