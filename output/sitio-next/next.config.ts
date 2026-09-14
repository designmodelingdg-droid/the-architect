import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * `Vary: Accept` en las respuestas de página. Sin esta cabecera, un CDN
   * puede servirle a un agente el HTML cacheado cuando pidió markdown, o al
   * contrario, según cuál variante entró primero a la caché. Se conservan los
   * valores que Next necesita para su propio router; solo se añade Accept.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Vary",
            value:
              "Accept, Accept-Encoding, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/servicios", destination: "/consultoria", permanent: true },
      { source: "/quienes-somos", destination: "/nosotros", permanent: true },
      { source: "/acreditaciones", destination: "/nosotros#acreditaciones", permanent: true },
      { source: "/bolsa-de-trabajo", destination: "https://designmodelingacademy.com/es/", permanent: false },
      { source: "/politicas-de-privacidad", destination: "/privacidad", permanent: true },
      { source: "/politicas-de-cookies", destination: "/privacidad", permanent: true },
      { source: "/terminos-y-condiciones", destination: "/terminos", permanent: true },
      { source: "/blog-no-usar", destination: "/blog", permanent: true },
      /* Rutas que un agente prueba por convención antes de leer el sitemap. */
      { source: "/privacy", destination: "/privacidad", permanent: true },
      { source: "/privacy-policy", destination: "/privacidad", permanent: true },
      { source: "/terms", destination: "/terminos", permanent: true },
      { source: "/about", destination: "/nosotros", permanent: true },
      { source: "/contact", destination: "/contactos", permanent: true },
      { source: "/services", destination: "/consultoria", permanent: true },
    ];
  },
};

export default nextConfig;
