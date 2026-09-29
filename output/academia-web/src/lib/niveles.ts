import { NIVELES, OTROS_TIPOS } from "./site";

/*
 * Una página por nivel, con la misma URL que tenía la web anterior (/cursos,
 * /diplomados, /especializaciones, /master…): no se pierde nada de lo
 * indexado, y cada nivel tiene una página que explica qué es antes de listar.
 */
export const NIVEL_POR_SLUG = Object.fromEntries([
  ...NIVELES.map((n) => [n.slug, { ...n, tipos: [n.tipo] as string[] }]),
  ...OTROS_TIPOS.map((o) => [o.slug, { ...o, resumen: "", horas: "", duracion: "", credencial: "", paraQuien: "", tipos: [o.tipo] as string[] }]),
  ["suscripcion", { tipo: "suscripcion", slug: "suscripcion", label: "Suscripción", plural: "Suscripción Design Premium", resumen: "Acceso al catálogo de cursos por una cuota mensual o anual.", horas: "", duracion: "", credencial: "", paraQuien: "", tipos: ["suscripcion"] }],
]) as Record<string, { tipo: string; slug: string; label: string; plural: string; resumen: string; horas: string; duracion: string; credencial: string; paraQuien: string; tipos: string[] }>;

/* El máster lista además sus cuatro bloques. */
NIVEL_POR_SLUG.master.tipos = ["master", "bloque"];

