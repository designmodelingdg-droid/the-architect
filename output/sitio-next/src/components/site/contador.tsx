"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { useMovimientoReducido } from "./use-movimiento-reducido";

/*
 * Cifra que florece al entrar en pantalla. Solo anima valores numéricos reales
 * ("10+", "+4.800", "4 roles"); cualquier otro texto ("ARQ/EST/MEP", "24/7")
 * se pinta tal cual. El HTML lleva siempre la cifra real (Google, las vistas
 * previas de WhatsApp y quien baja rápido no ven «+0»); la animación de 0 al
 * valor empieza solo cuando el número entra en pantalla.
 */
const PATRON = /^(\+?)(\d{1,3}(?:\.\d{3})+|\d+)([^\d/]*)$/;

function formatea(n: number) {
  return Math.round(n).toLocaleString("es-EC").replace(/,/g, ".");
}

export function Contador({ valor, className }: { valor: string; className?: string }) {
  const m = useMemo(() => PATRON.exec(valor.trim()), [valor]);
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-40px" });
  const reducido = useMovimientoReducido();
  const objetivo = m ? Number(m[2].replace(/\./g, "")) : 0;
  const [actual, setActual] = useState(objetivo);

  useEffect(() => {
    if (!m || !visible || reducido) return;
    const control = animate(0, objetivo, {
      duration: Math.min(1.6, 0.8 + objetivo / 4000),
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setActual(v),
    });
    return () => control.stop();
  }, [m, visible, reducido, objetivo]);

  if (!m) return <span ref={ref} className={className}>{valor}</span>;
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {m[1]}{formatea(reducido ? objetivo : actual)}{m[3]}
    </span>
  );
}
