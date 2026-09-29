import { NIVELES, OTROS_TIPOS } from "./site";
import type { Programa } from "./contenido";

/* Formatos de presentación. Español de Ecuador: coma decimal, punto de miles. */

const num = new Intl.NumberFormat("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const entero = new Intl.NumberFormat("es-EC", { maximumFractionDigits: 0 });

export function precio(monto: number, moneda = "USD") {
  const limpio = Number.isInteger(monto) ? entero.format(monto) : num.format(monto);
  return `${moneda} ${limpio}`;
}

export function horas(h?: number | null) {
  if (!h) return "";
  return `${entero.format(h)} h`;
}

export function fechaLarga(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function fechaCorta(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short" }).format(d).replace(".", "");
}

const ETIQUETAS: Record<string, { label: string; plural: string; slug: string }> = Object.fromEntries([
  ...NIVELES.map((n) => [n.tipo, { label: n.label, plural: n.plural, slug: n.slug }]),
  ...OTROS_TIPOS.map((o) => [o.tipo, { label: o.label, plural: o.plural, slug: o.slug }]),
  ["bloque", { label: "Bloque del Máster", plural: "Bloques del Máster", slug: "master" }],
  ["suscripcion", { label: "Suscripción", plural: "Suscripción Design Premium", slug: "suscripcion" }],
]);

export function etiquetaTipo(tipo: Programa["tipo"]) {
  return ETIQUETAS[tipo]?.label ?? tipo;
}
export function pluralTipo(tipo: Programa["tipo"]) {
  return ETIQUETAS[tipo]?.plural ?? tipo;
}
export function rutaTipo(tipo: Programa["tipo"]) {
  return `/${ETIQUETAS[tipo]?.slug ?? "programas"}`;
}

export const MODALIDAD: Record<string, string> = {
  vivo: "En vivo",
  pregrabado: "Pregrabado, a tu ritmo",
  mixto: "En vivo y grabado",
};

export const NIVEL_EXIGENCIA: Record<string, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  todos: "Todos los niveles",
};

/** Lo mínimo que una tarjeta necesita de un programa; sirve también en cliente. */
export type TarjetaDatos = Pick<
  Programa,
  "slug" | "titulo" | "tipo" | "horas" | "proximoInicio" | "precios" | "mostrarPrecio" | "docentes" | "credenciales" | "imagen" | "software" | "area" | "nivel" | "resumen"
>;

/** El precio que se muestra en una tarjeta: el único, o el primero sin país. */
export function precioBase(p: Pick<Programa, "precios" | "mostrarPrecio">) {
  if (!p.mostrarPrecio) return null;
  const sinPais = (p.precios ?? []).filter((x) => !x.pais);
  const unico = sinPais.find((x) => x.opcion === "unico" || x.opcion === "mensual" || x.opcion === "anual") ?? sinPais[0];
  return unico ?? null;
}

/** Reduce un programa a lo que la tarjeta necesita, para no mandar 84 fichas completas al cliente. */
export function aTarjeta(p: Programa): TarjetaDatos {
  return {
    slug: p.slug, titulo: p.titulo, tipo: p.tipo, horas: p.horas, proximoInicio: p.proximoInicio,
    precios: p.precios, mostrarPrecio: p.mostrarPrecio, docentes: p.docentes, credenciales: p.credenciales,
    imagen: p.imagen, software: p.software, area: p.area, nivel: p.nivel, resumen: p.resumen,
  };
}

/** Texto de la opción de precio en cuotas: "2 cuotas de USD 100". */
export function cuotas(p: { monto: number; moneda: string; cuotas?: number | null; opcion: string }) {
  if (p.opcion === "cuotas" && p.cuotas) return `${p.cuotas} cuotas de ${precio(p.monto, p.moneda)}`;
  if (p.opcion === "mensual") return `${precio(p.monto, p.moneda)} al mes`;
  if (p.opcion === "anual") return `${precio(p.monto, p.moneda)} al año`;
  if (p.opcion === "preventa") return `Preventa: ${precio(p.monto, p.moneda)}`;
  return precio(p.monto, p.moneda);
}
