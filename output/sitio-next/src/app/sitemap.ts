import type { MetadataRoute } from "next";

const BASE = "https://dgdesignmodeling.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas: [string, number][] = [
    ["/", 1],
    ["/consultoria", 0.9],
    ["/dg-bim-intelligence", 0.9],
    ["/proyectos", 0.8],
    ["/nosotros", 0.7],
    ["/contactos", 0.8],
    ["/blog", 0.4],
    ["/terminos", 0.2],
    ["/privacidad", 0.2],
  ];
  return rutas.map(([ruta, priority]) => ({
    url: `${BASE}${ruta === "/" ? "" : ruta}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
