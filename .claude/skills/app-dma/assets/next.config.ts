import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // El service worker nunca debe cachearse: es quien controla el resto.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        // El manifest cambia poco pero debe revalidarse (iOS lo cachea fuerte).
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        // Páginas de la app: nunca servir HTML viejo. iOS guarda la pantalla
        // de las PWA instaladas de forma muy agresiva y sin esto la app se
        // queda pegada en una versión anterior tras cada deploy.
        source:
          "/:path((?!_next|icons|favicon\\.ico|offline\\.html|sw\\.js|manifest\\.webmanifest).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
