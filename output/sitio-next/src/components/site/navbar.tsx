"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV, ACADEMIA } from "@/lib/site";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-navy/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" aria-label="Design Modeling DG — Inicio">
          <Image src="/images/logo-dg-dark.png" alt="Design Modeling DG" width={190} height={45} priority className="h-9 w-auto md:h-10" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`font-heading text-[13.5px] font-semibold transition-colors ${
                pathname === item.href ? "text-naranja-claro" : "text-tinta/85 hover:text-naranja-claro"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={ACADEMIA}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 font-mono-tech text-[11px] uppercase tracking-[0.12em] text-tinta-suave transition-colors hover:text-naranja-claro"
          >
            Academia <ArrowUpRight className="size-3" aria-hidden />
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contactos"
            data-btn
            className="rounded-lg bg-naranja px-4 py-2.5 font-heading text-[13px] font-bold text-white hover:bg-naranja-claro"
          >
            Agenda tu diagnóstico
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-lg text-white lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-6" aria-hidden />
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-navy text-white">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <nav aria-label="Menú móvil" className="mt-10 flex flex-col">
                {[{ label: "Inicio", href: "/" }, ...NAV].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`border-b border-white/8 px-2 py-3.5 font-heading text-[15px] font-semibold ${
                      pathname === item.href ? "text-naranja-claro" : "text-white/88"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <a href={ACADEMIA} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 px-2 py-3.5 font-mono-tech text-[12px] uppercase tracking-wider text-tinta-suave">
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
