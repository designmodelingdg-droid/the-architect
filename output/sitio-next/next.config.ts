import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
