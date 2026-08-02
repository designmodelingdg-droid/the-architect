/* Caja Familiar — Service Worker (Bloques 13 y 10)
 * Offline shell + fallback de navegación. Los handlers de Web Push
 * (push / notificationclick) se añaden en el Bloque 10.
 * Sin dependencias: JS plano registrado desde pwa-register.tsx.
 */
const VERSION = "cf-v2";
const SHELL_CACHE = `${VERSION}-shell`;
const OFFLINE_URL = "/offline.html";

const SHELL_ASSETS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Navegaciones: red primero, con fallback offline (nunca cachear HTML
  // dinámico con sesión — solo mostrar la página offline si no hay red).
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Iconos/manifest: cache primero (parte del shell).
  const url = new URL(request.url);
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/icons/") ||
      url.pathname === "/manifest.webmanifest")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

/* ---- Web Push (Bloque 10) ---- */
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "Caja Familiar", body: event.data ? event.data.text() : "" };
  }
  const title = payload.title || "Caja Familiar";
  const options = {
    body: payload.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: payload.tag || "caja",
    data: { url: payload.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            client.navigate(target);
            return client.focus();
          }
        }
        return self.clients.openWindow(target);
      })
  );
});
