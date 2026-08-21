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
    <section className="blueprint-fino relative overflow-hidden border-b border-border bg-crema py-16 md:py-22">
      <div className="relative mx-auto max-w-6xl px-5">
        <HeroReveal>
          <nav aria-label="Miga de pan" className="mb-5 font-heading text-[11px] font-bold uppercase tracking-wider text-tinta-suave">
            <Link href="/" className="hover:text-naranja">Inicio</Link>
            <span className="mx-2 text-tinta-suave/50" aria-hidden>/</span>
            <Link href={crumb.href} aria-current="page" className="text-naranja">{crumb.label}</Link>
          </nav>
          <span className="tag-tech mb-3.5 inline-flex items-center gap-2.5">
            <span className="text-tinta-suave">{num}/</span>
            <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
            {eyebrow}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] text-navy md:text-[3.4rem]">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-tinta-suave md:text-lg">{lead}</p>
        </HeroReveal>
      </div>
    </section>
  );
}
