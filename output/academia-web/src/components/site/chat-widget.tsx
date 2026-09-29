"use client";

import Script from "next/script";
import { useEffect } from "react";
import { WIDGET_CHAT_ID } from "@/lib/site";

/*
 * Chat en vivo de Sharp CRM (LeadConnector). El loader copia la configuración
 * del widget al elemento <chat-widget>; si en Sharp está en "embedded", el chat
 * se pinta como bloque al final de la página. Aquí forzamos el modo burbuja
 * flotante ("inline") en cuanto el elemento aparece. El arreglo de verdad está
 * en Sharp: Colocación de widgets → Elemento fijo. Sin identificador, el
 * componente no monta nada: no se hereda el widget de la consultoría.
 */
function forzarBurbuja(el: Element) {
  if (el.getAttribute("widget-placement") === "inline") return;
  el.setAttribute("widget-placement", "inline");
  (el as HTMLElement & { widgetPlacement?: string }).widgetPlacement = "inline";
}

export function ChatWidget() {
  useEffect(() => {
    if (!WIDGET_CHAT_ID) return;
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

  if (!WIDGET_CHAT_ID) return null;

  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id={WIDGET_CHAT_ID}
      strategy="lazyOnload"
    />
  );
}
