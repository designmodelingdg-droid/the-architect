import type { MetadataRoute } from "next";
import { DOMINIO, NIVELES, OTROS_TIPOS } from "@/lib/site";
import { programas, docentes } from "@/lib/contenido";

/*
 * Rutas fijas más una entrada por programa público y por docente, leídas del
 * mismo contenido que pinta las páginas: no puede listar nada que no exista.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fijas: [string, number][] = [
    ["/", 1],
    ["/programas", 0.9],
    ...NIVELES.map((n): [string, number] => [`/${n.slug}`, 0.9]),
    ...OTROS_TIPOS.map((o): [string, number] => [`/${o.slug}`, 0.6]),
    ["/suscripcion", 0.5],
    ["/acreditaciones", 0.8],
    ["/docentes", 0.7],
    ["/nosotros", 0.7],
    ["/empresas", 0.6],
    ["/eventos", 0.5],
    ["/contacto", 0.8],
    ["/blog", 0.4],
    ["/terminos", 0.2],
    ["/privacidad", 0.2],
  ];
  const [progs, docs] = await Promise.all([programas(), docentes()]);
  const prioridadPrograma = (tipo: string) => (tipo === "master" || tipo === "diplomado" ? 0.8 : tipo === "guia" || tipo === "mentoria" ? 0.4 : 0.6);
  const ahora = new Date();
  return [
    ...fijas.map(([ruta, priority]) => ({ url: `${DOMINIO}${ruta === "/" ? "" : ruta}`, lastModified: ahora, changeFrequency: "weekly" as const, priority })),
    ...progs.map((p) => ({ url: `${DOMINIO}/programas/${p.slug}`, lastModified: ahora, changeFrequency: "weekly" as const, priority: prioridadPrograma(p.tipo) })),
    ...docs.map((d) => ({ url: `${DOMINIO}/docentes/${d.slug}`, lastModified: ahora, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
