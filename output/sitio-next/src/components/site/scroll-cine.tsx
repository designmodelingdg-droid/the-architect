"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/*
 * Efecto reel «sale de la página»: un teléfono con video vertical que entra
 * inclinado hacia atrás y se endereza y crece mientras el usuario hace
 * scroll (sección alta + contenido sticky). El video vive en Vimeo en modo
 * background. Con prefers-reduced-motion el teléfono queda estático.
 */
export function ScrollCine({
  vimeoId,
  eyebrow,
  titulo,
  cta,
}: {
  vimeoId: string;
  eyebrow: string;
  titulo: React.ReactNode;
  cta?: { href: string; label: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0.05, 0.45], [26, 0]);
  const scale = useTransform(scrollYProgress, [0.05, 0.45], [0.82, 1]);
  const y = useTransform(scrollYProgress, [0.05, 0.45], [80, 0]);

  return (
    <section ref={ref} className="relative min-h-[130vh] overflow-hidden border-y border-border bg-crema">
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-start gap-8 px-5 py-16 md:py-20">
        <div className="max-w-3xl text-center">
          <span className="tag-tech mb-4 inline-block">{eyebrow}</span>
          <h2 className="text-[2rem] font-bold leading-[1.08] text-navy md:text-[2.9rem]">{titulo}</h2>
          {cta && (
            <Link
              href={cta.href}
              data-btn
              className="mt-6 inline-block rounded-lg bg-naranja px-6 py-3 font-heading text-sm font-bold text-white shadow-lg shadow-naranja/30 hover:bg-naranja-claro"
            >
              {cta.label}
            </Link>
          )}
        </div>
        <div style={{ perspective: 1300 }}>
          <motion.div
            style={reducido ? undefined : { rotateX, scale, y, transformStyle: "preserve-3d" }}
            className="rounded-[2.6rem] border border-navy/15 bg-navy p-2.5 shadow-[0_40px_90px_-20px_rgba(0,30,48,0.5)]"
          >
            <div className="relative w-[min(310px,74vw)] overflow-hidden rounded-[2.1rem] bg-navy-2" style={{ aspectRatio: "9/16" }}>
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1`}
                allow="autoplay; fullscreen"
                title="Modelado BIM en Revit — video vertical"
                tabIndex={-1}
                className="absolute inset-0 size-full border-0"
              />
              {/* Notch del teléfono */}
              <div aria-hidden className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-navy/90" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
