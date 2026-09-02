"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/*
 * Scroll suave tipo sitio premium (Lenis). Se desactiva por completo si el
 * usuario tiene prefers-reduced-motion, y se destruye al desmontar.
 */
export function ScrollSuave() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -96 } });
    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
