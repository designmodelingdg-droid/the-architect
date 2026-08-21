import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/servicios", destination: "/consultoria", permanent: true },
      { source: "/quienes-somos", destination: "/nosotros", permanent: true },
      { source: "/acreditaciones", destination: "/nosotros#acreditaciones", permanent: true },
      { source: "/bolsa-de-trabajo", destination: "https://designmodelingacademy.com/es/", permanent: false },
    ];
  },
};

export default nextConfig;
