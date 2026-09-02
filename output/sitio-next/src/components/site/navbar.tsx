"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowUpRight, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV, ACADEMIA, FAMILIAS } from "@/lib/site";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" aria-label="Design Modeling DG — Inicio">
          <Image src="/images/logo-dg.png" alt="Design Modeling DG" width={190} height={45} priority className="h-9 w-auto md:h-10" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) =>
            item.href === "/consultoria" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`inline-flex items-center gap-1 py-3 font-heading text-[13.5px] font-semibold transition-colors ${
                    pathname === item.href ? "text-naranja" : "text-azul hover:text-naranja"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden />
                </Link>
                {/* Mega-menú del catálogo de servicios */}
                <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="panel grid grid-cols-2 gap-1 p-3">
                    {FAMILIAS.map((f) => (
                      <Link
                        key={f.slug}
                        href={f.href ?? `/consultoria#${f.slug}`}
                        className="rounded-lg px-3.5 py-3 transition-colors hover:bg-crema"
                      >
                        <span className="flex items-baseline gap-2">
                          <span className="font-heading text-[11px] font-bold text-naranja">{f.num}/</span>
                          <span className="font-heading text-[13.5px] font-bold text-tinta">{f.label}</span>
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-tinta-suave">{f.resumen}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`py-3 font-heading text-[13.5px] font-semibold transition-colors ${
                  pathname === item.href ? "text-naranja" : "text-azul hover:text-naranja"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <a
            href={ACADEMIA}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-suave transition-colors hover:text-naranja"
          >
            Academia <ArrowUpRight className="size-3" aria-hidden />
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contactos#formulario"
            data-btn
            className="rounded-lg bg-naranja px-4 py-2.5 font-heading text-[13px] font-bold text-white hover:bg-azul"
          >
            Agenda tu diagnóstico
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-lg text-azul lg:hidden"
              aria-label="Abrir menú"
            >
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
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`block border-b border-border px-2 py-3.5 font-heading text-[15px] font-semibold ${
                        pathname === item.href ? "text-naranja" : "text-tinta"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.href === "/consultoria" ? (
                      <div className="border-b border-border pb-2">
                        {FAMILIAS.map((f) => (
                          <Link
                            key={f.slug}
                            href={f.href ?? `/consultoria#${f.slug}`}
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2 text-[13px] text-tinta-suave"
                          >
                            <span className="font-heading font-bold text-naranja">{f.num}/</span> {f.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                <a href={ACADEMIA} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 px-2 py-3.5 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-suave">
                  Academia <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
