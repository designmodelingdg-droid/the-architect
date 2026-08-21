import Image from "next/image";
import Link from "next/link";
import { HeroReveal } from "./reveal";

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  crumb,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  crumb: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden bg-navy py-16 text-white md:py-20">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-100" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/88 to-azul/80" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5">
        <HeroReveal>
          <nav aria-label="Miga de pan" className="mb-4 font-heading text-xs text-white/55">
            <Link href="/" className="hover:text-naranja-claro">Inicio</Link>
            <span className="mx-2 text-white/35" aria-hidden>›</span>
            <Link href={crumb.href} aria-current="page" className="hover:text-naranja-claro">{crumb.label}</Link>
          </nav>
          <span className="mb-3.5 inline-block rounded-full border border-naranja-claro/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[2.5px] text-naranja-claro">
            {eyebrow}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">{lead}</p>
        </HeroReveal>
      </div>
    </section>
  );
}
