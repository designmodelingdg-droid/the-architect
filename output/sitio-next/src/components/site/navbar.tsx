"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Mail, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV, WA, EMAIL } from "@/lib/site";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/90">
      <div className="hidden border-b border-white/5 bg-navy md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-6 px-5 py-1.5 text-xs text-white/60">
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-naranja-claro">
            <Mail className="size-3" aria-hidden /> {EMAIL}
          </a>
          <a href={WA} className="inline-flex items-center gap-1.5 transition-colors hover:text-naranja-claro">
            <Phone className="size-3" aria-hidden /> (+593) 98 4372010
          </a>
          <a href="tel:+59325137246" className="inline-flex items-center gap-1.5 transition-colors hover:text-naranja-claro">
            <Phone className="size-3" aria-hidden /> (02) 513-7246
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" aria-label="Design Modeling DG — Inicio">
          <Image src="/images/logo-dg.png" alt="Design Modeling DG" width={190} height={45} priority className="h-9 w-auto md:h-10" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`font-heading text-[13.5px] font-semibold transition-colors ${
                pathname === item.href ? "text-naranja-claro" : "text-white/85 hover:text-naranja-claro"
              }`}
            >
              {item.label}
            </Link>
          ))}
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
                {NAV.map((item) => (
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
