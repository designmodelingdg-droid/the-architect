"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMovimientoReducido } from "./use-movimiento-reducido";

/*
 * Parallax de fondo para heros: el medio (video/imagen) se desplaza más lento
 * que el contenido al hacer scroll, con un leve zoom para que nunca se vean
 * bordes. Sin efecto si el usuario prefiere movimiento reducido.
 */
export function ParallaxFondo({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useMovimientoReducido();
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

/* Solo en pantallas de escritorio; en móvil la cortina de entrada nunca llegaba
   a abrirse y las imágenes de servicios quedaban en blanco (auditoría 26/10). */
function useEscritorio() {
  const [es, setEs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const f = () => setEs(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return es;
}

/*
 * Parallax para imágenes dentro del flujo: la imagen viaja verticalmente
 * dentro de su marco mientras la sección cruza el viewport. En móvil se
 * muestra tal cual, sin cortina ni desplazamiento.
 */
export function ParallaxImg({ children, className, revelar = false }: { children: React.ReactNode; className?: string; revelar?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const escritorio = useEscritorio();
  const reducido = useMovimientoReducido() || !escritorio;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const cortina = revelar && !reducido;
  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className ?? ""}`}
      initial={cortina ? { clipPath: "inset(0 0 100% 0)" } : undefined}
      whileInView={cortina ? { clipPath: "inset(0 0 0% 0)" } : undefined}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div style={reducido ? undefined : { y, scale: 1.15 }} className="size-full">
        {children}
      </motion.div>
    </motion.div>
  );
}
