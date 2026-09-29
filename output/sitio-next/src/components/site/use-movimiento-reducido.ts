"use client";

import { useEffect, useState } from "react";

/*
 * Sustituye a useReducedMotion de motion. Aquel guarda el estado en un módulo
 * compartido: el primer componente que lo llama recibe null (y pinta el
 * motion.div con opacity 0 en el servidor), pero los siguientes ya reciben
 * true en el primer render del cliente, hidratan un <div> plano contra el HTML
 * con opacity:0 y React en producción no repara el atributo. Resultado: hero
 * en blanco para quien pide movimiento reducido. Este hook empieza siempre en
 * false, igual que el servidor, y cambia en un efecto: el div se remonta limpio.
 */
export function useMovimientoReducido() {
  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setReducido(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return reducido;
}
