import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function Section({
  children,
  tone = "base",
  id,
  className = "",
}: {
  children: ReactNode;
  tone?: "base" | "panel" | "blueprint" | "claro";
  id?: string;
  className?: string;
}) {
  const bg =
    tone === "panel" ? "bg-navy-2" :
    tone === "blueprint" ? "bg-navy blueprint" :
    tone === "claro" ? "bg-azul-palido text-[#12283a]" :
    "bg-navy";
  return (
    <section id={id} className={`scroll-mt-24 px-5 py-16 md:py-24 ${bg} ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  center = true,
  num,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  num?: string;
}) {
  return (
    <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <span className="tag-tech mb-4 inline-flex items-center gap-2.5">
        {num ? <span className="text-tinta-suave">{num}</span> : null}
        <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
        {eyebrow}
      </span>
      <h2 className="text-3xl font-bold leading-[1.1] text-white md:text-[2.6rem]">{title}</h2>
      {lead ? <p className="mt-4 text-base leading-relaxed text-tinta-suave md:text-lg">{lead}</p> : null}
    </Reveal>
  );
}
