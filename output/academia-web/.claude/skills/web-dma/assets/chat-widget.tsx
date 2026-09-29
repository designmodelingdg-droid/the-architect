"use client";

import Script from "next/script";
import { useEffect } from "react";

/*
 * Chat en vivo de Sharp CRM (LeadConnector). El loader copia la configuración
 * del widget al elemento <chat-widget>; si en Sharp está en "embedded", el chat
 * se pinta como bloque al final de la página. Aquí forzamos el modo burbuja
 * flotante ("inline") en cuanto el elemento aparece, antes de que el componente
 * termine de cargar. Si Sharp ya está en modo burbuja, no hace nada.
 */
const WIDGET_ID = "6a99fc15ba70a028e7c03484";

function forzarBurbuja(el: Element) {
  if (el.getAttribute("widget-placement") === "inline") return;
  el.setAttribute("widget-placement", "inline");
  (el as HTMLElement & { widgetPlacement?: string }).widgetPlacement = "inline";
}

export function ChatWidget() {
  useEffect(() => {
    document.querySelectorAll("chat-widget").forEach(forzarBurbuja);
    const observador = new MutationObserver((cambios) => {
      for (const cambio of cambios) {
        cambio.addedNodes.forEach((nodo) => {
          if (nodo instanceof Element && nodo.tagName === "CHAT-WIDGET") forzarBurbuja(nodo);
        });
      }
    });
    observador.observe(document.body, { childList: true });
    return () => observador.disconnect();
  }, []);

  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id={WIDGET_ID}
      strategy="lazyOnload"
    />
  );
}
