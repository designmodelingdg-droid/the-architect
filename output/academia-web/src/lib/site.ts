/*
 * Identidad de la academia: lo que no cambia de un mes a otro. Todo lo que sí
 * cambia (programas, docentes, credenciales, testimonios, eventos) vive en
 * `content/` y se lee por `src/lib/contenido.ts`. Nada de aquí se duplica en
 * ningún otro archivo.
 */

export const NOMBRE = "Design Modeling Academy";
export const DOMINIO = "https://designmodelingacademy.com";

/* Contacto. Mismo número y correo que la consultoría: es un solo grupo. */
export const WA = "https://wa.me/593984372010";
export const WA_MSG = (t: string) => `${WA}?text=${encodeURIComponent(t)}`;
export const EMAIL = "info@dgdesignmodeling.com";
export const TELEFONO_VISIBLE = "(+593) 98 4372010";

/* Las otras dos puertas del grupo. */
export const CAMPUS = "https://designmodelingacademy.app.clientclub.net/";
export const CONSULTORIA = "https://dgdesignmodeling.com";
export const LINKEDIN_EMPRESA = "https://www.linkedin.com/company/design-modeling-dg/";

/*
 * Integraciones con Sharp CRM (ubicación nkKbOarn5IwHeMv48uY9). Son
 * identificadores públicos de embed, no secretos. Mientras estén vacíos, el
 * componente correspondiente no monta nada o manda a WhatsApp: no se hereda
 * ningún widget ni formulario de la consultoría.
 */
export const WIDGET_CHAT_ID = "";
export const FORM_CONTACTO_ID = "";
export const CALENDARIO_CITA_URL = "";

/*
 * Los niveles son la columna vertebral de la escuela: cada uno es una cosa
 * distinta, con sus horas y su credencial, y el sitio los explica antes de
 * vender ninguno. La ruta de cada nivel es la misma que tenía la web anterior,
 * para no perder lo indexado.
 */
export const NIVELES = [
  {
    tipo: "master",
    slug: "master",
    label: "Máster",
    plural: "Másteres",
    resumen: "Doce meses para dirigir proyectos BIM de punta a punta, con título universitario internacional.",
    horas: "1.440 h",
    duracion: "12 meses",
    credencial: "Título propio ISTE con registro SENESCYT y Sabal University",
    paraQuien: "Quien va a liderar la implementación BIM de una empresa o de un proyecto grande.",
  },
  {
    tipo: "diplomado",
    slug: "diplomados",
    label: "Diplomado",
    plural: "Diplomados",
    resumen: "De 100 a 700 horas sobre una disciplina completa, con diploma universitario internacional.",
    horas: "100 – 700 h",
    duracion: "4 a 12 meses",
    credencial: "Diploma universitario internacional",
    paraQuien: "Quien quiere dominar una disciplina entera, del cálculo a la documentación.",
  },
  {
    tipo: "especializacion",
    slug: "especializaciones",
    label: "Especialización",
    plural: "Especializaciones",
    resumen: "Dos a cuatro cursos encadenados sobre un software o un tipo de estructura.",
    horas: "80 – 135 h",
    duracion: "2 a 4 meses",
    credencial: "Certificado internacional Design Modeling",
    paraQuien: "Quien ya trabaja y necesita profundidad en una herramienta concreta.",
  },
  {
    tipo: "curso",
    slug: "cursos",
    label: "Curso",
    plural: "Cursos",
    resumen: "Un tema, un software, un entregable. Entre 15 y 45 horas certificadas.",
    horas: "15 – 45 h",
    duracion: "3 a 6 semanas",
    credencial: "Certificado de finalización, Autodesk cuando aplica",
    paraQuien: "Quien necesita resolver algo concreto esta semana.",
  },
  {
    tipo: "ruta",
    slug: "rutas",
    label: "Ruta de aprendizaje",
    plural: "Rutas de aprendizaje",
    resumen: "Cursos ordenados para llegar a un rol: modelador, calculista, coordinador.",
    horas: "variable",
    duracion: "a tu ritmo",
    credencial: "Certificados de cada curso",
    paraQuien: "Quien empieza y quiere un orden, no un catálogo.",
  },
] as const;

/* Niveles que no son formación y que salen del catálogo como tarjeta. */
export const OTROS_TIPOS = [
  { tipo: "mentoria", slug: "mentorias", label: "Mentoría", plural: "Mentorías" },
  { tipo: "guia", slug: "guias", label: "Guía", plural: "Guías y e-books" },
  { tipo: "paquete", slug: "paquetes", label: "Paquete", plural: "Paquetes" },
] as const;

export type Tipo = (typeof NIVELES)[number]["tipo"] | (typeof OTROS_TIPOS)[number]["tipo"];

export const NAV = [
  { label: "Programas", href: "/programas" },
  { label: "Acreditaciones", href: "/acreditaciones" },
  { label: "Docentes", href: "/docentes" },
  { label: "Empresas", href: "/empresas" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const REDES = [
  { label: "Facebook", href: "https://www.facebook.com/designmodelingdg" },
  { label: "Instagram", href: "https://www.instagram.com/design_modeling_dg/" },
  { label: "YouTube", href: "https://youtube.com/@DesignModelingDG" },
  { label: "TikTok", href: "https://www.tiktok.com/@designmodelingdg" },
  { label: "X", href: "https://x.com/DgModeling" },
] as const;

/*
 * Cómo se estudia. Son los cuatro hechos que la web anterior enunciaba como
 * propuesta de valor, y que siguen siendo ciertos con el campus en GHL.
 */
export const METODO = [
  { titulo: "En vivo, y grabado", texto: "Las clases en vivo quedan grabadas en el campus el mismo día, para verlas cuando puedas." },
  { titulo: "Docentes que ejercen", texto: "Enseña quien calcula, modela y coordina proyectos reales, certificado por Autodesk." },
  { titulo: "Dudas resueltas en la sesión", texto: "Preguntas en vivo, y soporte por WhatsApp y Zoom entre clases." },
  { titulo: "Certificación que se verifica", texto: "Cada certificado lleva QR de verificación, y los títulos universitarios, su registro oficial." },
] as const;

/* Formas de pago que la academia acepta hoy. Se muestran junto al precio. */
export const PAGOS = ["PayPal", "Visa", "Mastercard", "American Express", "Discover", "PSE", "Efecty", "Baloto", "SafetyPay", "Pago Efectivo", "Bitcoin"] as const;

/* Datos legales. La academia certifica como MODELING-DG S.A.S. */
export const RAZON_SOCIAL = "MODELING-DG S.A.S.";
export const RUC = "1793148549001";
export const DIRECCION = "Juana Terrazas N71-154, Quito, Ecuador";

/* Cada página en HTML anuncia su gemelo en markdown. */
export function alternos(md: string) {
  return { canonical: "./", types: { "text/markdown": md } };
}
