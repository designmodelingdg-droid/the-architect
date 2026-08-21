import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function Section({
  children,
  tone = "base",
  id,
  className = "",
}: {
  children: ReactNode;
  tone?: "base" | "panel" | "blueprint" | "claro" | "navy";
  id?: string;
  className?: string;
}) {
  const bg =
    tone === "panel" ? "bg-crema" :
    tone === "blueprint" ? "bg-white blueprint" :
    tone === "claro" ? "bg-crema" :
    tone === "navy" ? "bg-navy blueprint-navy text-white" :
    "bg-white";
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
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  num?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <span className={`tag-tech mb-4 inline-flex items-center gap-2.5 ${dark ? "text-naranja-claro" : ""}`}>
        {num ? <span className={dark ? "text-white/50" : "text-tinta-suave"}>{num}/</span> : null}
        <span aria-hidden className="inline-block h-px w-7 bg-naranja/60" />
        {eyebrow}
      </span>
      <h2 className={`text-3xl font-bold leading-[1.12] md:text-[2.5rem] ${dark ? "text-white" : "text-navy"}`}>{title}</h2>
      {lead ? <p className={`mt-4 text-base leading-relaxed md:text-lg ${dark ? "text-white/70" : "text-tinta-suave"}`}>{lead}</p> : null}
    </Reveal>
  );
}
