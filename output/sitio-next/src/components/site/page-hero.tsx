import Link from "next/link";
import { HeroReveal } from "./reveal";
import { ParallaxFondo } from "./parallax";
import { ZonaMouse, CapaMouse } from "./zona-mouse";

/*
 * Hero de página interna. Con `fondo` se vuelve cinematográfico: imagen a
 * sangre completa con parallax, degradados navy y texto en blanco. Sin
 * `fondo` mantiene la variante clara con retícula blueprint.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumb,
  num,
  fondo,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  crumb: { label: string; href: string };
  num: string;
  fondo?: string;
}) {
  const oscuro = Boolean(fondo);
  return (
    <ZonaMouse
      className={
        oscuro
          ? "relative overflow-hidden border-b border-navy bg-navy py-20 md:py-28"
          : "blueprint-fino relative overflow-hidden border-b border-border bg-crema py-16 md:py-22"
      }
    >
      {oscuro && (
        <>
          <CapaMouse profundidad={20} className="absolute inset-0">
            <ParallaxFondo>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fondo} alt="" className="size-full object-cover" />
            </ParallaxFondo>
          </CapaMouse>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-navy/20" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy/80 to-transparent" />
        </>
      )}
      <div className="relative mx-auto max-w-6xl px-5">
        <CapaMouse profundidad={-6}>
        <HeroReveal>
          <nav
            aria-label="Miga de pan"
            className={`mb-5 font-heading text-[11px] font-bold uppercase tracking-wider ${oscuro ? "text-white/60" : "text-tinta-suave"}`}
          >
            <Link href="/" className="hover:text-naranja">Inicio</Link>
            <span className={`mx-2 ${oscuro ? "text-white/35" : "text-tinta-suave/50"}`} aria-hidden>/</span>
            <Link href={crumb.href} aria-current="page" className={oscuro ? "text-naranja-claro" : "text-naranja"}>{crumb.label}</Link>
          </nav>
          <span className={`tag-tech mb-3.5 inline-flex items-center gap-2.5 ${oscuro ? "text-naranja-claro" : ""}`}>
            <span className={oscuro ? "text-white/50" : "text-tinta-suave"}>{num}/</span>
            <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
            {eyebrow}
          </span>
          <h1 className={`max-w-3xl text-4xl font-bold leading-[1.06] md:text-[3.4rem] ${oscuro ? "text-white" : "text-navy"}`}>{title}</h1>
          <p className={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${oscuro ? "text-white/80" : "text-tinta-suave"}`}>{lead}</p>
        </HeroReveal>
        </CapaMouse>
      </div>
    </ZonaMouse>
  );
}
