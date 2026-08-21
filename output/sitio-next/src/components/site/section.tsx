import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function Section({
  children,
  tone = "white",
  id,
  className = "",
}: {
  children: ReactNode;
  tone?: "white" | "crema" | "palido" | "oscuro";
  id?: string;
  className?: string;
}) {
  const bg =
    tone === "crema" ? "bg-crema" :
    tone === "palido" ? "bg-azul-palido" :
    tone === "oscuro" ? "bg-gradient-to-br from-navy to-azul text-white" :
    "bg-white";
  return (
    <section id={id} className={`scroll-mt-24 px-5 py-16 md:py-20 ${bg} ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  center = true,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <span className={`mb-3 inline-block text-[11px] font-bold uppercase tracking-[2.2px] ${dark ? "text-naranja-claro" : "text-naranja"}`}>
        {eyebrow}
      </span>
      <h2 className={`text-3xl font-bold leading-tight md:text-4xl ${dark ? "text-white" : "text-azul"}`}>{title}</h2>
      {lead ? (
        <p className={`mt-4 text-base leading-relaxed md:text-lg ${dark ? "text-white/84" : "text-muted-foreground"}`}>{lead}</p>
      ) : null}
    </Reveal>
  );
}
