import { programas, programa, docentes, docente, credenciales, avales, testimonios, eventos, empresasClientes, nosotros, empresas, areas, software } from "./contenido";
import type { Programa } from "./contenido";
import { precio, cuotas, horas, fechaLarga, etiquetaTipo, pluralTipo, precioBase, MODALIDAD, NIVEL_EXIGENCIA } from "./formato";
import { NIVEL_POR_SLUG } from "./niveles";
import { DOMINIO, NOMBRE, EMAIL, WA, TELEFONO_VISIBLE, CAMPUS, CONSULTORIA, METODO, PAGOS, NIVELES, RAZON_SOCIAL, RUC, DIRECCION } from "./site";
import { TERMINOS, ACTUALIZADO_LEGAL } from "./legal-terminos";
import { PRIVACIDAD } from "./legal-privacidad";
import { ARTICULOS, BLOG_URL } from "./blog";

/*
 * El sitio en markdown, para agentes. Cada documento sale del mismo contenido
 * de Keystatic que pinta la página HTML, así que no puede desactualizarse por
 * su lado. `documento(ruta)` devuelve null cuando la ruta no existe y el
 * handler responde 404 en markdown.
 */

export type Documento = { titulo: string; descripcion: string; cuerpo: string };

const PIE = `
---

${NOMBRE} · ${RAZON_SOCIAL} · RUC ${RUC}
${DIRECCION}
${EMAIL} · ${TELEFONO_VISIBLE} · ${WA}
Campus virtual: ${CAMPUS}

Todas las páginas de este sitio responden en markdown a \`Accept: text/markdown\` y con el sufijo \`.md\`.
Índice para agentes: ${DOMINIO}/llms.txt · Mapa del sitio: ${DOMINIO}/sitemap.xml
`;

const lista = (items?: readonly (string | null)[] | null) => (items ?? []).filter(Boolean).map((i) => `- ${i}`).join("\n");

function lineaPrograma(p: Programa, nomDoc: Record<string, string>) {
  const base = precioBase(p);
  const partes = [
    etiquetaTipo(p.tipo),
    p.horas ? horas(p.horas) : "",
    p.proximoInicio ? `inicio ${fechaLarga(p.proximoInicio)}` : "",
    base ? (base.monto === 0 ? "gratis" : precio(base.monto, base.moneda)) : p.tipo === "master" ? "precio con cita" : "",
    (p.docentes ?? []).map((d) => nomDoc[d ?? ""]).filter(Boolean).join(", "),
  ].filter(Boolean);
  return `- [${p.titulo}](${DOMINIO}/programas/${p.slug}) — ${partes.join(" · ")}`;
}

async function mapas() {
  const [docs, sw] = await Promise.all([docentes(), software()]);
  return {
    nomDoc: Object.fromEntries(docs.map((d) => [d.slug, d.nombre])),
    nomSoft: Object.fromEntries(sw.map((s) => [s.slug, s.nombre])),
  };
}

export async function mdInicio(): Promise<Documento> {
  const [progs, datos, { nomDoc }] = await Promise.all([programas(), nosotros(), mapas()]);
  const cifras = (datos?.cifras ?? []).map((c) => `- ${c.valor} ${c.etiqueta}${c.fuente ? ` (fuente: ${c.fuente})` : ""}`).join("\n");
  const porNivel = NIVELES.map((n) => {
    const de = progs.filter((p) => p.tipo === n.tipo);
    return `### ${n.plural} (${de.length})\n\n${n.resumen} ${n.horas} · ${n.duracion} · ${n.credencial}. ${n.paraQuien}\n\nDetalle: ${DOMINIO}/${n.slug}`;
  }).join("\n\n");
  const destacados = progs.filter((p) => p.destacado).slice(0, 6).map((p) => lineaPrograma(p, nomDoc)).join("\n");
  return {
    titulo: `${NOMBRE}: la escuela de BIM donde enseña quien construye`,
    descripcion: "Escuela online de BIM, ingeniería estructural e inteligencia artificial. Másteres, diplomados, especializaciones y cursos con docentes que ejercen y credenciales que se verifican.",
    cuerpo: `# ${NOMBRE}

La escuela de BIM donde enseña quien construye. Másteres, diplomados,
especializaciones y cursos en Revit, Robot, ETABS, SAP2000 y CYPE. Clases en
vivo que quedan grabadas, título universitario internacional, y docentes que
calculan y coordinan proyectos reales. Es la escuela del grupo Design Modeling
DG (${CONSULTORIA}), en Quito, Ecuador, para Latinoamérica, España y EE. UU.

## Cifras

${cifras}

## Elige tu nivel

${porNivel}

## Programas destacados

${destacados}

Catálogo completo: ${DOMINIO}/programas

## Cómo se estudia

${METODO.map((m) => `- **${m.titulo}**: ${m.texto}`).join("\n")}

## Siguiente paso

Cita informativa gratuita de treinta minutos: ${DOMINIO}/contacto#cita
${PIE}`,
  };
}

export async function mdProgramas(): Promise<Documento> {
  const [progs, { nomDoc }, ar, sw] = await Promise.all([programas(), mapas(), areas(), software()]);
  const tipos = [...new Set(progs.map((p) => p.tipo))];
  const cuerpo = tipos.map((t) => `## ${pluralTipo(t)}\n\n${progs.filter((p) => p.tipo === t).map((p) => lineaPrograma(p, nomDoc)).join("\n")}`).join("\n\n");
  return {
    titulo: "Catálogo de programas",
    descripcion: `${progs.length} programas de formación BIM, estructural e IA: másteres, diplomados, especializaciones, cursos, rutas, mentorías y guías.`,
    cuerpo: `# Catálogo de programas

${progs.length} programas públicos. Cada uno enlaza a su página, que responde
también en markdown. Áreas: ${ar.map((a) => a.nombre).join(", ")}. Software:
${sw.map((s) => s.nombre).join(", ")}.

${cuerpo}
${PIE}`,
  };
}

export async function mdNivel(slug: string): Promise<Documento | null> {
  const n = NIVEL_POR_SLUG[slug];
  if (!n) return null;
  const [progs, { nomDoc }] = await Promise.all([programas(), mapas()]);
  const de = progs.filter((p) => n.tipos.includes(p.tipo));
  const ficha = n.horas ? `\n- Horas: ${n.horas}\n- Duración: ${n.duracion}\n- Credencial: ${n.credencial}\n- Para quién: ${n.paraQuien}\n` : "";
  return {
    titulo: n.plural,
    descripcion: n.resumen || `${n.plural} de ${NOMBRE}.`,
    cuerpo: `# ${n.plural}

${n.resumen}
${ficha}
## Programas (${de.length})

${de.map((p) => lineaPrograma(p, nomDoc)).join("\n") || "Todavía no hay programas publicados en este nivel."}
${PIE}`,
  };
}

export async function mdPrograma(slug: string): Promise<Documento | null> {
  const p = await programa(slug);
  if (!p || p.estado !== "publico") return null;
  const [todos, creds, tests, { nomDoc, nomSoft }] = await Promise.all([programas(), credenciales(), testimonios(), mapas()]);
  const base = precioBase(p);
  const porCita = p.tipo === "master" || !p.mostrarPrecio || !base;
  const precios = porCita
    ? "El precio y las opciones de pago se revisan en la cita informativa gratuita."
    : (p.precios ?? []).filter((x) => !x.pais).map((x) => `- ${cuotas(x)}${x.tachado ? ` (antes ${precio(x.tachado, x.moneda)})` : ""}`).join("\n") + `\n\nFormas de pago: ${PAGOS.join(", ")}.` + (p.excluidoDeSuscripcion ? "\nNo incluido en la suscripción Design Premium." : "");
  const modulos = (p.modulos ?? []).map((m, i) => `${i + 1}. **${m.titulo}**${m.descripcion ? ` — ${m.descripcion}` : ""}${m.sesiones?.length ? `\n${m.sesiones.map((s) => `   - ${s.titulo}${s.duracion ? ` (${s.duracion})` : ""}`).join("\n")}` : ""}`).join("\n");
  const incluidos = (p.incluye ?? []).map((s) => todos.find((x) => x.slug === s)).filter((x): x is Programa => Boolean(x));
  const misCred = creds.filter((c) => (p.credenciales ?? []).includes(c.slug)).map((c) => `- **${c.nombre}**${c.emisor ? ` (${c.emisor})` : ""}${c.registroOficial ? ` · ${c.registroOficial}` : ""}${c.queCertifica ? `: ${c.queCertifica}` : ""}`).join("\n");
  const misDoc = (p.docentes ?? []).map((d) => nomDoc[d ?? ""] ? `- [${nomDoc[d ?? ""]}](${DOMINIO}/docentes/${d})` : "").filter(Boolean).join("\n");
  const misTest = tests.filter((t) => t.programa === p.slug).map((t) => `> ${t.resultado}\n> — ${t.nombre}${t.cargo ? `, ${t.cargo}` : ""}${t.pais ? `, ${t.pais}` : ""}`).join("\n\n");
  const faq = (p.faq ?? []).map((f) => `### ${f.pregunta}\n\n${f.respuesta}`).join("\n\n");
  const ficha = [
    `- Nivel: ${etiquetaTipo(p.tipo)}`,
    p.horas ? `- Horas certificadas: ${horas(p.horas)}` : "",
    p.meses ? `- Duración: ${p.meses} ${p.meses === 1 ? "mes" : "meses"}` : "",
    p.modalidad ? `- Modalidad: ${MODALIDAD[p.modalidad]}` : "",
    p.nivel ? `- Exigencia: ${NIVEL_EXIGENCIA[p.nivel]}` : "",
    p.proximoInicio ? `- Próximo inicio: ${fechaLarga(p.proximoInicio)}` : "",
    p.software?.length ? `- Software: ${p.software.map((s) => nomSoft[s ?? ""] ?? s?.replace(/-/g, " ")).join(", ")}` : "",
    p.alumnos ? `- Alumnos matriculados: ${p.alumnos}` : "",
    p.brochure ? `- Brochure: ${p.brochure}` : "",
  ].filter(Boolean).join("\n");
  const cta = porCita ? `Agenda tu cita informativa gratuita: ${p.urlCita || `${DOMINIO}/contacto#cita`}` : `Matrícula: ${p.urlMatricula || `${DOMINIO}/contacto`}`;
  const sec = (t: string, c: string) => (c ? `\n## ${t}\n\n${c}\n` : "");
  return {
    titulo: p.titulo,
    descripcion: p.resumen,
    cuerpo: `# ${p.titulo}

${p.resumen}

${ficha}
${sec("Para quién es", lista(p.paraQuien))}${sec("Qué vas a lograr", lista(p.aprenderas))}${sec("Descripción", p.descripcion ?? "")}${sec(`Plan de estudios (${(p.modulos ?? []).length} módulos)`, modulos)}${sec("Incluye", incluidos.map((x) => lineaPrograma(x, nomDoc)).join("\n"))}${sec("Beneficios", lista(p.beneficios))}${sec("Credenciales que otorga", misCred)}${sec("Docentes", misDoc)}${sec("Precio", precios)}${sec("Resultados de alumnos", misTest)}${sec("Preguntas frecuentes", faq)}
## Siguiente paso

${cta}
WhatsApp: ${p.whatsapp || WA}
${PIE}`,
  };
}

export async function mdDocentes(): Promise<Documento> {
  const [docs, progs] = await Promise.all([docentes(), programas()]);
  const cuenta = (slug: string) => progs.filter((p) => (p.docentes ?? []).includes(slug)).length;
  const orden = [...docs].sort((a, b) => cuenta(b.slug) - cuenta(a.slug));
  return {
    titulo: "Docentes",
    descripcion: "La planta docente: ingenieros y arquitectos en activo, certificados por Autodesk.",
    cuerpo: `# Docentes

Enseña quien construye: ingenieros y arquitectos en activo, certificados por
Autodesk, que calculan, modelan y coordinan proyectos reales.

${orden.map((d) => `- [${d.nombre}](${DOMINIO}/docentes/${d.slug})${d.titulacion ? ` — ${d.titulacion}` : ""}${d.rolFuera ? `. ${d.rolFuera}` : ""} · ${cuenta(d.slug)} ${cuenta(d.slug) === 1 ? "programa" : "programas"}`).join("\n")}
${PIE}`,
  };
}

export async function mdDocente(slug: string): Promise<Documento | null> {
  const d = await docente(slug);
  if (!d) return null;
  const [progs, { nomDoc }] = await Promise.all([programas(), mapas()]);
  const dicta = progs.filter((p) => (p.docentes ?? []).includes(d.slug));
  return {
    titulo: d.nombre,
    descripcion: [d.titulacion, d.rolFuera].filter(Boolean).join(". ") || `${d.nombre}, docente de ${NOMBRE}.`,
    cuerpo: `# ${d.nombre}

${[d.titulacion, d.rolFuera].filter(Boolean).join(". ")}
${d.bio ? `\n${d.bio}\n` : ""}${d.linkedin ? `\nLinkedIn: ${d.linkedin}\n` : ""}
## Programas que dicta (${dicta.length})

${dicta.map((p) => lineaPrograma(p, nomDoc)).join("\n")}
${PIE}`,
  };
}

export async function mdAcreditaciones(): Promise<Documento> {
  const [creds, avs] = await Promise.all([credenciales(), avales()]);
  return {
    titulo: "Acreditaciones",
    descripcion: "Las credenciales que otorga la escuela y quién las respalda.",
    cuerpo: `# Acreditaciones

## ${creds.length} vías de certificación

${creds.map((c) => `- **${c.nombre}**${c.emisor ? ` (${c.emisor})` : ""}${c.registroOficial ? ` · registro: ${c.registroOficial}` : ""}${c.queCertifica ? `: ${c.queCertifica}` : ""}${c.url ? ` Verificar: ${c.url}` : ""}`).join("\n")}

## Avales

${avs.map((a) => `- **${a.nombre}**${a.tipo ? `: ${a.tipo}` : ""}${a.desde ? ` (desde ${a.desde})` : ""}${a.url ? ` · ${a.url}` : ""}`).join("\n")}

## Cómo verificar un certificado

Cada certificado lleva un código QR con la ficha del certificado. Los títulos
universitarios se verifican además en el registro del emisor (SENESCYT para el
título ISTE, Florida Department of Education para Sabal University). Un
empleador puede escribir a ${EMAIL} con el código y se confirma la emisión.
${PIE}`,
  };
}

export async function mdNosotros(): Promise<Documento> {
  const [datos, docs] = await Promise.all([nosotros(), docentes()]);
  return {
    titulo: "Nosotros",
    descripcion: `${NOMBRE} es la escuela del grupo Design Modeling DG, en Quito: enseña quien calcula, modela y coordina proyectos reales.`,
    cuerpo: `# Nosotros

${datos?.historia ?? ""}

## Cifras, con su fuente

${(datos?.cifras ?? []).map((c) => `- ${c.valor} ${c.etiqueta}${c.fuente ? ` (fuente: ${c.fuente})` : ""}`).join("\n")}

## El grupo

- Design Modeling DG, consultoría estructural y BIM: ${CONSULTORIA}
- DG BIM Intelligence, software de asistencia al proyecto: ${CONSULTORIA}/dg-bim-intelligence
- ${NOMBRE}, la escuela: ${DOMINIO}

## Cómo se estudia

${METODO.map((m) => `- **${m.titulo}**: ${m.texto}`).join("\n")}

## Docentes

${docs.map((d) => `- [${d.nombre}](${DOMINIO}/docentes/${d.slug})${d.rolFuera ? ` — ${d.rolFuera}` : ""}`).join("\n")}
${PIE}`,
  };
}

export async function mdEmpresas(): Promise<Documento> {
  const [datos, clientes] = await Promise.all([empresas(), empresasClientes()]);
  return {
    titulo: "Formación para empresas",
    descripcion: "Capacitación BIM para equipos: catálogo en vivo para tu empresa, temarios a medida y consultoría más formación.",
    cuerpo: `# Formación para empresas

${datos?.intro ?? ""}

## Tres formas

${(datos?.modalidades ?? []).map((m) => `- **${m.nombre}**: ${m.descripcion}`).join("\n")}

## Cómo funciona

1. Diagnóstico: una llamada para entender qué hace el equipo, con qué software y dónde se atasca.
2. Propuesta: temario, calendario, docente y precio por escrito. Online en vivo por Zoom o presencial.
3. Formación y evaluación: clases grabadas, evaluación antes y después, certificación para cada participante.
${clientes.length ? `\n## Clientes\n\n${clientes.map((c) => `- ${c.nombre}`).join("\n")}\n` : ""}
## Siguiente paso

Pedir una propuesta: ${WA} · ${EMAIL}
${PIE}`,
  };
}

export async function mdEventos(): Promise<Documento> {
  const [evs, progs] = await Promise.all([eventos(), programas()]);
  const hoy = new Date().toISOString().slice(0, 10);
  const inicios = progs.filter((p) => p.proximoInicio && p.proximoInicio >= hoy).sort((a, b) => a.proximoInicio!.localeCompare(b.proximoInicio!));
  return {
    titulo: "Eventos y próximos inicios",
    descripcion: "Próximos inicios de programa y eventos en vivo.",
    cuerpo: `# Eventos y próximos inicios

## Eventos

${evs.length ? evs.map((e) => `- ${e.fecha!.slice(0, 16).replace("T", " ")} (hora de Ecuador) · **${e.titulo}**${e.modalidad ? ` · ${e.modalidad}` : ""}${e.resumen ? `: ${e.resumen}` : ""}${e.url ? ` · Inscripción: ${e.url}` : ""}`).join("\n") : "Sin eventos programados por ahora."}

## Próximos inicios

${inicios.length ? inicios.map((p) => `- ${fechaLarga(p.proximoInicio)} · [${p.titulo}](${DOMINIO}/programas/${p.slug})`).join("\n") : "Todavía sin fechas publicadas."}

Los cursos pregrabados no tienen fecha: empiezan con la matrícula.
${PIE}`,
  };
}

export function mdContacto(): Documento {
  return {
    titulo: "Contacto",
    descripcion: "Cita informativa gratuita, WhatsApp y correo de la escuela.",
    cuerpo: `# Contacto

- Cita informativa gratuita de treinta minutos: ${DOMINIO}/contacto#cita
- WhatsApp: ${WA} (${TELEFONO_VISIBLE})
- Correo: ${EMAIL}
- Horario de atención: lunes a viernes, 9:00 a 18:00, hora de Ecuador (UTC−5)
- Campus virtual para alumnos: ${CAMPUS}

Respondemos en menos de 24 horas.
${PIE}`,
  };
}

export function mdBlog(): Documento {
  return {
    titulo: "Blog",
    descripcion: "Artículos de los docentes sobre análisis estructural, software BIM e inteligencia artificial.",
    cuerpo: `# Blog

Los artículos se publican en ${BLOG_URL}. Los más recientes:

${ARTICULOS.map((a) => `- ${a.fecha} · [${a.titulo}](${a.url})${a.autor ? ` · ${a.autor}` : ""}`).join("\n")}
${PIE}`,
  };
}

function legal(titulo: string, secciones: [string, string[]][]): Documento {
  return {
    titulo,
    descripcion: `${titulo} de ${NOMBRE} (${RAZON_SOCIAL}).`,
    cuerpo: `# ${titulo}

Última actualización: ${ACTUALIZADO_LEGAL}

${secciones.map(([t, ps]) => `## ${t}\n\n${ps.join("\n\n")}`).join("\n\n")}
${PIE}`,
  };
}

/** Resuelve una ruta limpia ("" para el inicio) a su documento, o null. */
export async function documento(ruta: string): Promise<Documento | null> {
  if (ruta === "") return mdInicio();
  if (ruta === "programas") return mdProgramas();
  if (ruta === "docentes") return mdDocentes();
  if (ruta === "acreditaciones") return mdAcreditaciones();
  if (ruta === "nosotros") return mdNosotros();
  if (ruta === "empresas") return mdEmpresas();
  if (ruta === "eventos") return mdEventos();
  if (ruta === "contacto") return mdContacto();
  if (ruta === "blog") return mdBlog();
  if (ruta === "terminos") return legal("Términos y condiciones", TERMINOS);
  if (ruta === "privacidad") return legal("Política de privacidad", PRIVACIDAD);
  const m = /^(programas|docentes)\/([a-z0-9-]+)$/.exec(ruta);
  if (m) return m[1] === "programas" ? mdPrograma(m[2]) : mdDocente(m[2]);
  if (/^[a-z-]+$/.test(ruta) && NIVEL_POR_SLUG[ruta]) return mdNivel(ruta);
  return null;
}

/** Todas las rutas con gemelo en markdown, para prerenderizarlas en build. */
export async function rutasMd(): Promise<string[]> {
  const [progs, docs] = await Promise.all([programas(), docentes()]);
  return [
    "", "programas", "docentes", "acreditaciones", "nosotros", "empresas", "eventos", "contacto", "blog", "terminos", "privacidad",
    ...Object.keys(NIVEL_POR_SLUG),
    ...progs.map((p) => `programas/${p.slug}`),
    ...docs.map((d) => `docentes/${d.slug}`),
  ];
}
