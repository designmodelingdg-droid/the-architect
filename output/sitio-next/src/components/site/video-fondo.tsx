"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Fondo de portada con el video local «edificio que se arma» (PR #7 de
 * academia-web, 1/11/2026). Se reproduce una sola vez, sin sonido, y se queda
 * en el último cuadro: el edificio terminado, con el título y el botón
 * encima. En pantallas de menos de 768 px usa el clip vertical. Mientras
 * carga se ve el primer cuadro (el terreno), para que no haya salto. Con
 * «reducir movimiento», sin JavaScript o si el navegador no puede
 * reproducir, se muestra solo el póster del edificio terminado (el fallo
 * llega por evento, nunca se cambia el estado dentro del efecto).
 */
const ESCRITORIO = { webm: "/videos/hero-edificio-1080.webm", mp4: "/videos/hero-edificio-1080.mp4", inicio: "/images/hero-edificio-inicio.jpg", poster: "/images/hero-edificio-poster.jpg" };
const MOVIL = { mp4: "/videos/hero-edificio-movil.mp4", inicio: "/images/hero-edificio-inicio-movil.jpg", poster: "/images/hero-edificio-poster-movil.jpg" };

export function VideoFondo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [soloPoster, setSoloPoster] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    /* Con «reducir movimiento» el video queda oculto por CSS y no se carga. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chico = window.matchMedia("(max-width: 767px)").matches;
    const webm = v.canPlayType('video/webm; codecs="vp9"') !== "";
    v.poster = chico ? MOVIL.inicio : ESCRITORIO.inicio;
    v.src = chico ? MOVIL.mp4 : webm ? ESCRITORIO.webm : ESCRITORIO.mp4;
    v.muted = true;
    const fallo = () => setSoloPoster(true);
    v.addEventListener("error", fallo);
    v.play().catch(fallo);
    return () => v.removeEventListener("error", fallo);
  }, []);

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden bg-navy ${className}`}>
      <picture className={soloPoster ? "" : "hidden motion-reduce:block"}>
        <source media="(max-width: 767px)" srcSet={MOVIL.poster} />
        <img src={ESCRITORIO.poster} alt="" className="absolute inset-0 size-full object-cover" />
      </picture>
      {!soloPoster ? (
        <video ref={ref} muted playsInline preload="auto" poster={ESCRITORIO.inicio} tabIndex={-1} className="absolute inset-0 size-full object-cover motion-reduce:hidden" />
      ) : null}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ESCRITORIO.poster} alt="" className="absolute inset-0 size-full object-cover" />
      </noscript>
    </div>
  );
}
