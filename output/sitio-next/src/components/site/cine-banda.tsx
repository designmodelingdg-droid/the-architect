"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/*
 * Banda cinematográfica a sangre completa: video de fondo con parallax que
 * ocupa casi todo el viewport mientras el usuario navega, con titular
 * editorial encima. El video se pausa con prefers-reduced-motion.
 */
export function CineBanda({
  video,
  poster,
  eyebrow,
  titulo,
  cta,
}: {
  video: string;
  poster: string;
  eyebrow: string;
  titulo: React.ReactNode;
  cta?: { href: string; label: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const yTexto = useTransform(scrollYProgress, [0.15, 0.85], ["14%", "-14%"]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => {
      if (mq.matches) v.pause();
      else v.play().catch(() => {});
    };
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-[74vh] items-center justify-center overflow-hidden bg-navy">
      <motion.div aria-hidden style={reducido ? undefined : { y, scale: 1.22 }} className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="size-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-navy/35" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy/70 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy/70 to-transparent" />
      <motion.div
        style={reducido ? undefined : { y: yTexto }}
        className="relative mx-auto max-w-4xl px-5 py-24 text-center"
      >
        <span className="tag-tech mb-5 inline-block text-naranja-claro">{eyebrow}</span>
        <h2 className="text-[2.3rem] font-bold leading-[1.06] text-white drop-shadow-lg md:text-[3.6rem]">
          {titulo}
        </h2>
        {cta && (
          <Link
            href={cta.href}
            data-btn
            className="mt-9 inline-block rounded-lg bg-naranja px-7 py-3.5 font-heading text-[15px] font-bold text-white shadow-lg shadow-naranja/40 hover:bg-naranja-claro"
          >
            {cta.label}
          </Link>
        )}
      </motion.div>
    </section>
  );
}
