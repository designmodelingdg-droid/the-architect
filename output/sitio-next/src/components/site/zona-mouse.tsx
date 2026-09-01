"use client";

import { createContext, useContext } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionValue } from "motion/react";

/*
 * Parallax de cursor estilo Horyx: dentro de una ZonaMouse, cada CapaMouse
 * se desplaza con resorte según la posición del puntero. Profundidad
 * positiva = fondo (se mueve contra el cursor); negativa = primer plano
 * (acompaña al cursor). Sin efecto con teclado, táctil o reduced-motion.
 */
const Ctx = createContext<{ x: MotionValue<number>; y: MotionValue<number> } | null>(null);

export function ZonaMouse({ className, children }: { className?: string; children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 55, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 55, damping: 16, mass: 0.4 });
  const reducido = useReducedMotion();
  return (
    <section
      className={className}
      onPointerMove={(e) => {
        if (reducido || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Ctx.Provider value={{ x: sx, y: sy }}>{children}</Ctx.Provider>
    </section>
  );
}

export function CapaMouse({
  profundidad = 16,
  className,
  children,
}: {
  profundidad?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(Ctx);
  const cero = useMotionValue(0);
  const tx = useTransform(ctx?.x ?? cero, (v) => v * -profundidad);
  const ty = useTransform(ctx?.y ?? cero, (v) => v * -profundidad);
  return (
    <motion.div style={{ x: tx, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}
