"use client";

import { useEffect, useRef, useState } from "react";
import { VimeoFondo } from "./vimeo-fondo";

/*
 * Fondo de portada en dos tiempos (Dayana, 1/11/2026): primero el video local
 * «edificio que se arma» (PR #7 de academia-web), una sola vez y sin sonido,
 * que se queda en el edificio terminado; al terminar, un fundido al video de
 * Revit que ya estaba de fondo (Vimeo, en bucle), con el mismo título y botón
 * encima. En pantallas de menos de 768 px usa el clip vertical. Mientras carga
 * se ve el primer cuadro (el terreno), para que no haya salto. Con «reducir
 * movimiento», sin JavaScript o si el navegador no puede reproducir, se
 * muestra solo el póster del edificio terminado (el fallo llega por evento,
 * nunca se cambia el estado dentro del efecto).
 */
const ESCRITORIO = { webm: "/videos/hero-edificio-1080.webm", mp4: "/videos/hero-edificio-1080.mp4", inicio: "/images/hero-edificio-inicio.jpg", poster: "/images/hero-edificio-poster.jpg" };
const MOVIL = { mp4: "/videos/hero-edificio-movil.mp4", inicio: "/images/hero-edificio-inicio-movil.jpg", poster: "/images/hero-edificio-poster-movil.jpg" };
/* Segundos antes del final en que se carga el video de Vimeo, para que el fundido no espere. */
const ANTICIPO = 4;

export type VideoDespues = { id: string; poster?: string; soloEscritorio?: boolean };

export function VideoFondo({ className = "", despues }: { className?: string; despues?: VideoDespues }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [soloPoster, setSoloPoster] = useState(false);
  const [fase, setFase] = useState<"edificio" | "preparando" | "siguiente">("edificio");

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
    /* El segundo video solo sigue donde antes se veía: en la academia, no en el celular. */
    const sigue = Boolean(despues) && !(despues?.soloEscritorio && chico);
    const avanzar = () => {
      if (v.duration && v.duration - v.currentTime <= ANTICIPO) setFase((f) => (f === "edificio" ? "preparando" : f));
    };
    const terminar = () => setFase("siguiente");
    if (sigue) {
      v.addEventListener("timeupdate", avanzar);
      v.addEventListener("ended", terminar);
    }
    return () => {
      v.removeEventListener("error", fallo);
      v.removeEventListener("timeupdate", avanzar);
      v.removeEventListener("ended", terminar);
    };
  }, [despues]);

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden bg-navy ${className}`}>
      <picture className={soloPoster ? "" : "hidden motion-reduce:block"}>
        <source media="(max-width: 767px)" srcSet={MOVIL.poster} />
        <img src={ESCRITORIO.poster} alt="" className="absolute inset-0 size-full object-cover" />
      </picture>
      {!soloPoster ? (
        <video ref={ref} muted playsInline preload="auto" poster={ESCRITORIO.inicio} tabIndex={-1} className="absolute inset-0 size-full object-cover motion-reduce:hidden" />
      ) : null}
      {despues && !soloPoster && fase !== "edificio" ? (
        <div data-fondo-siguiente={fase} className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${fase === "siguiente" ? "opacity-100" : "opacity-0"}`}>
          <VimeoFondo id={despues.id} poster={despues.poster} />
        </div>
      ) : null}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ESCRITORIO.poster} alt="" className="absolute inset-0 size-full object-cover" />
      </noscript>
    </div>
  );
}
