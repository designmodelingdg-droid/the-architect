import { FAMILIAS, VERTICALES, EQUIPO, AVALES, CLIENTES, EMAIL, WA, ACADEMIA } from "@/lib/site";

/*
 * Negociación de contenido en markdown (acceptmarkdown.com).
 *
 * Un agente que pide `Accept: text/markdown` no quiere nuestro HTML con su
 * CSS, sus videos y su JavaScript: quiere el texto. El middleware reescribe
 * esas peticiones hacia aquí y este handler devuelve la misma información en
 * markdown, con `Vary: Accept` para que ningún CDN sirva la variante
 * equivocada desde caché.
 *
 * El contenido se compone de src/lib/site.ts, que es la misma fuente que
 * alimenta las páginas, así que no puede quedarse desactualizado por su lado.
 */

const BASE = "https://dgdesignmodeling.com";

const PIE = `
---

Design Modeling DG · MODELING-DG S.A.S. · RUC 1793148549001
Juana Terrazas N71-154, Quito, Ecuador
${EMAIL} · (+593) 98 4372010 · ${WA}

Todas las páginas de este sitio responden en markdown a \`Accept: text/markdown\`.
Índice para agentes: ${BASE}/llms.txt · Mapa del sitio: ${BASE}/sitemap.xml
`;

function familias() {
  return FAMILIAS.map(
    (f) => `### ${f.num}. ${f.label}\n\n${f.resumen}\n\n${f.servicios.map((s) => `- ${s}`).join("\n")}`,
  ).join("\n\n");
}

const PAGINAS: Record<string, () => string> = {
  "": () => `# Design Modeling DG

Consultoría en ingeniería estructural, arquitectura y metodología BIM, con
software propio de inteligencia artificial. Operamos desde Quito, Ecuador,
para toda Latinoamérica y España.

## Qué hacemos

Desarrollamos proyectos de ingeniería con metodología BIM para diseños
arquitectónicos y estructurales. Cada servicio se entrega con visibilidad
total en DG BIM Intelligence, nuestro software de IA.

## Cifras

- Más de 10 años en proyectos BIM
- Más de 3.800 profesionales formados
- Coordinación de arquitectura, estructura e instalaciones
- Agente de IA disponible 24/7

## Las cinco familias de servicios

${familias()}

## DG BIM Intelligence

Software propio: un agente que razona sobre el proyecto BIM con el criterio de
más de 10 años de BIM Management. Cada hallazgo llega con su evidencia, su
impacto y su nivel de confianza. Sincroniza directo desde Revit con el
complemento DG BIM Sync y ofrece tableros por rol.

Detalle: ${BASE}/dg-bim-intelligence

## Con quién trabajamos

${VERTICALES.map((v) => `- **${v.label}**: ${v.detalle}`).join("\n")}

## Siguiente paso

Diagnóstico inicial sin costo, 30 minutos: ${BASE}/contactos#formulario
${PIE}`,

  consultoria: () => `# Consultoría BIM

Cinco familias de servicios que cubren el proyecto de punta a punta, del
cálculo estructural a la inteligencia artificial aplicada. Diseñamos según
códigos nacionales e internacionales, y cada servicio se entrega con
visibilidad total en DG BIM Intelligence.

## Servicios

${familias()}

## Capacidad técnica

- **Materiales**: acero laminado en caliente, acero laminado en frío,
  mampostería estructural, hormigón armado, estructuras compuestas.
- **Sistemas estructurales**: pórticos de acero, pórticos arriostrados,
  sistemas duales, muros de corte, aislamiento sísmico.
- **Tipologías**: edificaciones en altura, naves industriales, silos y
  tanques, vivienda, rehabilitación de existentes.

## Somos el equipo adecuado si

- Tienes un proyecto de edificación y quieres el cálculo estructural y los
  planos resueltos con criterio técnico.
- Ya trabajas con modelos BIM pero las interferencias siguen apareciendo en obra.
- Eres constructora o promotora y quieres implementar BIM sin improvisar.
- Necesitas visibilidad real del avance del proyecto.
- Tienes una edificación existente y necesitas levantamiento y evaluación sísmica.

Probablemente no si buscas únicamente el precio más bajo del mercado, o si
necesitas un plazo sin revisión previa del proyecto.

## Siguiente paso

Diagnóstico inicial sin costo: ${BASE}/contactos#formulario
${PIE}`,

  "dg-bim-intelligence": () => `# DG BIM Intelligence

Software propio de Design Modeling DG. Lee tu modelo de Revit, razona paso a
paso con el criterio de más de 10 años de BIM Management y te dice qué
corregir primero. Cada hallazgo llega con su evidencia, su impacto y su nivel
de confianza.

## En qué se diferencia de un chatbot genérico

Aplica reglas condicionales de conocimiento profundo del dominio. No responde
en abstracto: razona sobre tu modelo y ordena las correcciones. Cuando le
falta contexto, pregunta antes de recomendar.

## Cómo razona

Cada hallazgo se entrega con cuatro piezas: el hallazgo, la evidencia en el
modelo, el impacto estimado y la acción sugerida, más un nivel de confianza.

## Tableros por rol

- **Modelador**: elementos, nivel de detalle, propiedades por completar y
  puntaje de calidad del modelo.
- **Coordinador**: interferencias clasificadas por severidad, con responsable.
- **Gerencia**: avance y riesgo por disciplina.
- **Dueño del proyecto**: estado general sin tecnicismos.

## Estado del producto

- **Disponible hoy**: sincronización directa desde Revit con el complemento
  DG BIM Sync, dashboards por rol y el agente BIM.
- **En desarrollo**: conexión con Autodesk Construction Cloud.

## Cómo se contrata

Incluida en cualquier servicio de consultoría, o licenciada a empresas con
equipo BIM propio.

## Siguiente paso

Demo de la plataforma: ${BASE}/contactos#formulario
${PIE}`,

  proyectos: () => `# Proyectos

Casos reales entre 2018 y 2026 en Ecuador, España, Guatemala, Costa Rica,
Panamá, México, Colombia y Perú, con modelos y entregables propios.

## Recientes

- **LC Constructora, Ya Está** (Guatemala, jul-sep 2026): coordinación BIM
  multidisciplinaria de gran escala con BCF y ACCA.
- **García de Celis, 30 chalets** (León, España, jul-ago 2026): BIM LOD 350
  con detección de interferencias y presupuestos BC3.
- **Complejo de piscinas** (Costa Rica, jun-jul 2026): diseño estructural de
  unos 2.660 m² con micropilotes, en Revit y SAP2000.
- **WoodLab, residencia Juan Diego** (Quito, may-jun 2026): coordinación de
  arquitectura, estructura e instalaciones.
- **Casa Juan Diego** (Quito, abr-may 2026): modelo y análisis estructural con
  Revit y Robot Structural Analysis.
- **Grupo AG, librería BIM de acero** (Guatemala, feb-mar 2026): familias
  paramétricas de perfiles, tubos, angulares, costaneras y mallas.
- **Puente vehicular Eco Terra** (Costa Rica, dic 2025-ene 2026): puente mixto
  acero-hormigón, superestructura y cimentaciones.
- **Cubipods, plataforma metálica** (Panamá, oct-nov 2025): estructura
  desmontable con documentación completa de conexiones.

## Siguiente paso

Solicita el portafolio completo: ${BASE}/contactos#formulario
${PIE}`,

  nosotros: () => `# Nosotros

Equipo de ingenieros y arquitectos que desarrolla proyectos con metodología
BIM. Trabajamos con constructoras, promotoras, estudios de arquitectura y
propietarios que necesitan que el proyecto llegue a obra sin conflictos entre
disciplinas.

## Política, visión y misión

- **Política**: superar expectativas en tiempo, costo y calidad.
- **Visión**: liderar el diseño con nuevas tecnologías.
- **Misión**: ejecutar con BIM y tecnología propia.

## Equipo

${EQUIPO.map((m) => `- **${m.nombre}** · ${m.cargo}${m.linkedin ? ` · ${m.linkedin}` : ""}`).join("\n")}

## Acreditaciones y partners

${AVALES.map((a) => `- ${a.alt}`).join("\n")}

## Clientes

${CLIENTES.map((c) => `- ${c.alt}`).join("\n")}

## Formación

Design Modeling Academy es la academia del grupo, para quien busca formación
BIM en lugar de consultoría: ${ACADEMIA}
${PIE}`,

  contactos: () => `# Contacto

Diagnóstico inicial sin costo de 30 minutos. Revisamos el proyecto y decimos
qué encontramos, sin compromiso.

## Datos

- Correo: ${EMAIL}
- WhatsApp: (+593) 98 4372010 · ${WA}
- Teléfono fijo: (02) 513-7246
- Oficina: Juana Terrazas N71-154, Quito, Ecuador
- Respuesta en menos de 24 horas
- Cobertura: Ecuador, Latinoamérica y España

## Formulario

El formulario de contacto vive en ${BASE}/contactos#formulario y pide nombre,
WhatsApp, correo, empresa y una descripción del proyecto.
${PIE}`,

  blog: () => `# Blog

Sección en preparación. Mientras tanto, las preguntas técnicas sobre un
proyecto concreto se responden en el diagnóstico inicial sin costo:
${BASE}/contactos#formulario
${PIE}`,

  terminos: () => `# Términos y condiciones

Texto legal completo en ${BASE}/terminos, revisado por asesoría legal y
actualizado en septiembre de 2026. Cubre el objeto del sitio, la propiedad
intelectual de los modelos y entregables, la confidencialidad de la
información del cliente, los límites de responsabilidad sobre el contenido
publicado, la contratación de servicios y la legislación aplicable en
Ecuador.

Responsable: MODELING-DG S.A.S., RUC 1793148549001, Juana Terrazas N71-154,
Quito.
${PIE}`,

  privacidad: () => `# Política de privacidad

Texto legal completo en ${BASE}/privacidad, conforme a la Ley Orgánica de
Protección de Datos Personales del Ecuador, revisado por asesoría legal y
actualizado en septiembre de 2026.

## Resumen

- **Responsable del tratamiento**: MODELING-DG S.A.S., RUC 1793148549001,
  Juana Terrazas N71-154, Quito, Ecuador.
- **Qué datos se recogen**: los que la persona entrega en el formulario de
  contacto o en el chat, es decir nombre, teléfono, correo, empresa y la
  descripción de su proyecto.
- **Para qué**: responder la solicitud y coordinar el diagnóstico inicial.
- **Con quién se comparten**: con el CRM que gestiona la comunicación. No se
  venden ni se ceden a terceros con fines publicitarios.
- **Derechos**: acceso, rectificación, eliminación, oposición y portabilidad,
  ejercitables escribiendo a ${EMAIL}.
- **Cookies**: el sitio no instala cookies de seguimiento propias.

Contacto para asuntos de privacidad: ${EMAIL}
${PIE}`,
};

const ALIAS: Record<string, string> = {
  contacto: "contactos",
  contact: "contactos",
  about: "nosotros",
  "quienes-somos": "nosotros",
  servicios: "consultoria",
  privacy: "privacidad",
  terms: "terminos",
  index: "",
  home: "",
};

const CABECERAS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept, Accept-Encoding",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;

export const dynamic = "force-static";

export async function GET(_req: Request, ctx: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await ctx.params;
  const bruto = (slug ?? []).join("/").replace(/\.md$/, "");
  const ruta = ALIAS[bruto] ?? bruto;
  const pagina = PAGINAS[ruta];

  if (!pagina) {
    const cuerpo = `# 404 · Esta página no existe

La ruta \`/${bruto}\` no existe en dgdesignmodeling.com.

## Dónde seguir

- Inicio: ${BASE}/
- Consultoría BIM: ${BASE}/consultoria
- DG BIM Intelligence: ${BASE}/dg-bim-intelligence
- Proyectos: ${BASE}/proyectos
- Nosotros: ${BASE}/nosotros
- Contacto: ${BASE}/contactos

## Índices legibles por máquina

- Guía para agentes: ${BASE}/llms.txt
- Mapa del sitio: ${BASE}/sitemap.xml
`;
    return new Response(cuerpo, { status: 404, headers: CABECERAS });
  }

  return new Response(pagina(), { status: 200, headers: CABECERAS });
}

export function generateStaticParams() {
  return [
    { slug: [] as string[] },
    ...Object.keys(PAGINAS)
      .filter(Boolean)
      .map((r) => ({ slug: [r] })),
  ];
}
