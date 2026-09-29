import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

/*
 * La única puerta de lectura del contenido. Las páginas, el sitemap, el
 * markdown para agentes y el JSON-LD pasan por aquí, así que no pueden
 * desactualizarse por su lado.
 */
const reader = createReader(process.cwd(), keystaticConfig);

export type Programa = NonNullable<Awaited<ReturnType<typeof reader.collections.programas.read>>> & { slug: string };
export type Docente = NonNullable<Awaited<ReturnType<typeof reader.collections.docentes.read>>> & { slug: string };
export type Credencial = NonNullable<Awaited<ReturnType<typeof reader.collections.credenciales.read>>> & { slug: string };
export type Aval = NonNullable<Awaited<ReturnType<typeof reader.collections.avales.read>>> & { slug: string };
export type Testimonio = NonNullable<Awaited<ReturnType<typeof reader.collections.testimonios.read>>> & { slug: string };
export type Evento = NonNullable<Awaited<ReturnType<typeof reader.collections.eventos.read>>> & { slug: string };

async function todos<T>(col: { all: () => Promise<{ slug: string; entry: T }[]> }) {
  const lista = await col.all();
  return lista.map((e) => ({ ...(e.entry as object), slug: e.slug })) as (T & { slug: string })[];
}

/** Programas públicos, ordenados por nivel y título. */
export async function programas(): Promise<Programa[]> {
  const lista = (await todos(reader.collections.programas)) as Programa[];
  const orden = ["master", "bloque", "diplomado", "especializacion", "paquete", "ruta", "curso", "mentoria", "guia", "suscripcion"];
  return lista
    .filter((p) => p.estado === "publico")
    .sort((a, b) => orden.indexOf(a.tipo) - orden.indexOf(b.tipo) || a.titulo.localeCompare(b.titulo, "es"));
}

export async function programa(slug: string): Promise<Programa | null> {
  const p = await reader.collections.programas.read(slug);
  return p ? ({ ...p, slug } as Programa) : null;
}

export async function programasPorTipo(tipo: Programa["tipo"]) {
  return (await programas()).filter((p) => p.tipo === tipo);
}

export async function destacados(): Promise<Programa[]> {
  const inicio = await reader.singletons.inicio.read();
  const slugs = (inicio?.destacados ?? []).filter((s): s is string => Boolean(s));
  const lista = await programas();
  const marcados = lista.filter((p) => p.destacado);
  const elegidos = slugs.map((s) => lista.find((p) => p.slug === s)).filter((p): p is Programa => Boolean(p));
  return [...elegidos, ...marcados.filter((p) => !slugs.includes(p.slug))];
}

export async function docentes(): Promise<Docente[]> {
  return (await todos(reader.collections.docentes)) as Docente[];
}
export async function docente(slug: string): Promise<Docente | null> {
  const d = await reader.collections.docentes.read(slug);
  return d ? ({ ...d, slug } as Docente) : null;
}

export async function credenciales(): Promise<Credencial[]> {
  const lista = (await todos(reader.collections.credenciales)) as Credencial[];
  return lista.sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
}
export async function avales(): Promise<Aval[]> {
  return (await todos(reader.collections.avales)) as Aval[];
}
export async function areas() {
  return todos(reader.collections.areas);
}
export async function software() {
  return todos(reader.collections.software);
}
export async function testimonios(): Promise<Testimonio[]> {
  const lista = (await todos(reader.collections.testimonios)) as Testimonio[];
  /* Un testimonio sin cargo y país verificados no se publica. */
  return lista.filter((t) => t.verificado && t.resultado);
}
export async function eventos(): Promise<Evento[]> {
  const lista = (await todos(reader.collections.eventos)) as Evento[];
  const ahora = Date.now();
  return lista
    .filter((e) => e.fecha && new Date(e.fecha).getTime() >= ahora)
    .sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime());
}
export async function empresasClientes() {
  return todos(reader.collections.empresasClientes);
}
export async function inicio() {
  return reader.singletons.inicio.read();
}
export async function nosotros() {
  return reader.singletons.nosotros.read();
}
export async function empresas() {
  return reader.singletons.empresas.read();
}

/** Mapas slug → nombre, para pintar tarjetas sin cargar cada relación. */
export async function nombresDocentes() {
  return Object.fromEntries((await docentes()).map((d) => [d.slug, d.nombre]));
}
export async function nombresCredenciales() {
  return Object.fromEntries((await credenciales()).map((c) => [c.slug, c.nombre]));
}
