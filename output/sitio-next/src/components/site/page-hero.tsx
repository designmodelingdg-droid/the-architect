import Link from "next/link";
import { HeroReveal } from "./reveal";

export function PageHero({
  eyebrow,
  title,
  lead,
  crumb,
  num,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  crumb: { label: string; href: string };
  num: string;
}) {
  return (
    <section className="blueprint-fino relative overflow-hidden border-b border-white/8 bg-navy py-16 md:py-22">
      <div className="relative mx-auto max-w-6xl px-5">
        <HeroReveal>
          <nav aria-label="Miga de pan" className="mb-5 font-mono-tech text-[11px] tracking-wider text-tinta-suave">
            <Link href="/" className="hover:text-naranja-claro">INICIO</Link>
            <span className="mx-2 text-tinta-suave/50" aria-hidden>/</span>
            <Link href={crumb.href} aria-current="page" className="text-naranja-claro">{crumb.label.toUpperCase()}</Link>
          </nav>
          <span className="tag-tech mb-3.5 inline-flex items-center gap-2.5">
            <span className="text-tinta-suave">{num}</span>
            <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
            {eyebrow}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] text-white md:text-[3.4rem]">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-tinta-suave md:text-lg">{lead}</p>
        </HeroReveal>
      </div>
    </section>
  );
}
