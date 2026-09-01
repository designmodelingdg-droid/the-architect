"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/*
 * Parallax de fondo para heros: el medio (video/imagen) se desplaza más lento
 * que el contenido al hacer scroll, con un leve zoom para que nunca se vean
 * bordes. Sin efecto si el usuario prefiere movimiento reducido.
 */
export function ParallaxFondo({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div style={reducido ? undefined : { y, scale }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}

/*
 * Parallax para imágenes dentro del flujo: la imagen viaja verticalmente
 * dentro de su marco mientras la sección cruza el viewport.
 */
export function ParallaxImg({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={reducido ? undefined : { y, scale: 1.15 }} className="size-full">
        {children}
      </motion.div>
    </div>
  );
}
