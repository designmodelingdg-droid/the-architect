"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { Menu, ArrowUpRight, ChevronDown, GraduationCap } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV, NIVELES, OTROS_TIPOS, CAMPUS, CONSULTORIA } from "@/lib/site";
import { useState } from "react";

/* El menú de Programas despliega los niveles: es la taxonomía de la escuela. */
const MENU_NIVELES = [
  ...NIVELES.map((n) => ({ href: `/${n.slug}`, label: n.plural, resumen: n.resumen })),
  ...OTROS_TIPOS.map((o) => ({ href: `/${o.slug}`, label: o.plural, resumen: "" })),
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activo = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" aria-label="Design Modeling Academy — Inicio">
          <Logo className="h-9 w-auto md:h-10" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) =>
            item.href === "/programas" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={activo(item.href) ? "page" : undefined}
                  className={`inline-flex items-center gap-1 py-3 font-heading text-[13.5px] font-semibold transition-colors ${
                    activo(item.href) ? "text-naranja-texto" : "text-azul hover:text-naranja-texto"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden />
                </Link>
                <div className="invisible absolute left-1/2 top-full w-[600px] -translate-x-1/2 pt-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="panel grid grid-cols-2 gap-1 p-3">
                    {MENU_NIVELES.map((n) => (
                      <Link key={n.href} href={n.href} className="rounded-lg px-3.5 py-3 transition-colors hover:bg-crema">
                        <span className="font-heading text-[13.5px] font-bold text-tinta">{n.label}</span>
                        {n.resumen ? <span className="mt-0.5 block text-[12px] leading-snug text-tinta-suave">{n.resumen}</span> : null}
                      </Link>
                    ))}
                    <Link href="/programas" className="col-span-2 rounded-lg px-3.5 py-2.5 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-naranja-texto transition-colors hover:bg-crema">
                      Ver todo el catálogo →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activo(item.href) ? "page" : undefined}
                className={`py-3 font-heading text-[13.5px] font-semibold transition-colors ${
                  activo(item.href) ? "text-naranja-texto" : "text-azul hover:text-naranja-texto"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CAMPUS}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-1.5 rounded-lg border border-border px-3.5 py-2.5 font-heading text-[13px] font-bold text-azul transition-colors hover:border-azul md:inline-flex"
          >
            <GraduationCap className="size-4" aria-hidden /> Campus
          </a>
          <Link
            href="/contacto#cita"
            data-btn
            className="whitespace-nowrap rounded-lg bg-naranja px-3.5 py-2.5 font-heading text-[13px] font-bold text-white hover:bg-azul md:px-4"
          >
            Agenda tu cita
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex size-10 items-center justify-center rounded-lg text-azul lg:hidden" aria-label="Abrir menú">
              <Menu className="size-6" aria-hidden />
            </SheetTrigger>
            <SheetContent side="right" className="border-border bg-white text-tinta">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <nav aria-label="Menú móvil" className="mt-10 flex flex-col overflow-y-auto">
                {[{ label: "Inicio", href: "/" }, ...NAV].map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={activo(item.href) ? "page" : undefined}
                      className={`block border-b border-border px-2 py-3.5 font-heading text-[15px] font-semibold ${activo(item.href) ? "text-naranja-texto" : "text-tinta"}`}
                    >
                      {item.label}
                    </Link>
                    {item.href === "/programas" ? (
                      <div className="border-b border-border pb-2">
                        {MENU_NIVELES.map((n) => (
                          <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block px-4 py-2 text-[13px] text-tinta-suave">
                            {n.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                <a href={CAMPUS} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 px-2 py-3.5 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-naranja-texto">
                  <GraduationCap className="size-3.5" aria-hidden /> Campus
                </a>
                <a href={CONSULTORIA} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 px-2 py-3.5 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-suave">
                  Consultoría DG <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
