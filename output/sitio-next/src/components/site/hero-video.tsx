"use client";

import { useEffect, useRef } from "react";

/*
 * Video de fondo del hero: autoplay silencioso en bucle con poster de
 * respaldo. Respeta prefers-reduced-motion pausando el video y dejando
 * visible el primer fotograma (el poster equivale al frame inicial).
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => {
      if (mq.matches) video.pause();
      else video.play().catch(() => {});
    };
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/images/hero-poster.jpg"
      aria-hidden
      className="absolute inset-0 size-full object-cover"
    >
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>
  );
}
