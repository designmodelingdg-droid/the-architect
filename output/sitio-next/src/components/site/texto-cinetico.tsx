"use client";

import { motion, useReducedMotion } from "motion/react";

/*
 * Titular cinético: las palabras entran una a una, con un pequeño ascenso y
 * un retraso escalonado. `partes` permite resaltar un tramo con otra clase
 * (p. ej. el cierre en naranja). Con movimiento reducido se pinta plano.
 */
const EASE = [0.23, 1, 0.32, 1] as const;

export function TextoCinetico({
  partes,
  delay = 0,
  paso = 0.045,
}: {
  partes: { texto: string; className?: string }[];
  delay?: number;
  paso?: number;
}) {
  const reducido = useReducedMotion();
  if (reducido) {
    return (
      <>
        {partes.map((p, i) => (
          <span key={i} className={p.className}>{p.texto}</span>
        ))}
      </>
    );
  }
  let indice = 0;
  return (
    <>
      {partes.map((p, i) => (
        <span key={i} className={p.className}>
          {p.texto.split(/(\s+)/).map((trozo, j) => {
            if (!trozo.trim()) return <span key={j}>{trozo}</span>;
            const k = indice++;
            return (
              <span key={j} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.7em" }}
                  animate={{ opacity: 1, y: "0em" }}
                  transition={{ duration: 0.75, ease: EASE, delay: delay + k * paso }}
                >
                  {trozo}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}
