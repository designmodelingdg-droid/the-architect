import { Mail, Phone } from "lucide-react";
import { EMAIL, WA, REDES } from "@/lib/site";

export function TopBar() {
  return (
    <div className="bg-navy px-5 text-azul-palido/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-[12px]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-naranja-claro">
            <Mail className="size-3.5" aria-hidden /> {EMAIL}
          </a>
          <a href={WA} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 transition-colors hover:text-naranja-claro">
            <Phone className="size-3.5" aria-hidden /> (+593) 98 4372010
          </a>
          <a href="tel:+59325137246" className="hidden items-center gap-1.5 transition-colors hover:text-naranja-claro sm:inline-flex">
            (02) 513-7246
          </a>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {REDES.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener"
              className="font-heading text-[10.5px] font-bold uppercase tracking-[0.1em] transition-colors hover:text-naranja-claro"
            >
              {r.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
