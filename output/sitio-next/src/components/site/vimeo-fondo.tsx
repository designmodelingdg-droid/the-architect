"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Fondo de video con Vimeo en modo background (política de la casa: los
 * videos viven en Vimeo, ocultos, y se embeben). Calcula el tamaño del
 * iframe para cubrir el contenedor como object-cover. Con
 * prefers-reduced-motion muestra solo el poster.
 */
export function VimeoFondo({ id, poster, aspect = 16 / 9 }: { id: string; poster?: string; aspect?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setReducido(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calcular = () => {
      const { width: cw, height: ch } = el.getBoundingClientRect();
      // cubre el contenedor manteniendo la relación de aspecto del video
      const w = Math.max(cw, ch * aspect);
      const h = Math.max(ch, cw / aspect);
      setDim({ w, h });
    };
    calcular();
    const ro = new ResizeObserver(calcular);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden bg-navy">
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      {!reducido && dim.w > 0 && (
        <iframe
          src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1`}
          allow="autoplay; fullscreen"
          title=""
          tabIndex={-1}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
          style={{ width: dim.w, height: dim.h }}
        />
      )}
    </div>
  );
}
