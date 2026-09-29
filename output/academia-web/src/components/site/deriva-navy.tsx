"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMovimientoReducido } from "./use-movimiento-reducido";

/*
 * El fondo de una banda navy no aparece de golpe: mientras la banda entra en
 * pantalla, su color deriva desde el crema de la página hasta el navy. Lo que
 * va encima (video, retícula, texto) no cambia.
 */
export function DerivaNavy({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reducido = useMovimientoReducido();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const fondo = useTransform(scrollYProgress, [0, 1], ["#fafaf7", "#001e30"]);
  return (
    <motion.section id={id} ref={ref} style={reducido ? { backgroundColor: "#001e30" } : { backgroundColor: fondo }} className={className}>
      {children}
    </motion.section>
  );
}
