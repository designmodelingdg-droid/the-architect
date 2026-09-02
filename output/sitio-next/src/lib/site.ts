export const WA = "https://wa.me/593984372010";
export const WA_MSG = (t: string) => `${WA}?text=${encodeURIComponent(t)}`;
export const EMAIL = "info@dgdesignmodeling.com";
export const ACADEMIA = "https://designmodelingacademy.com/es/";
export const LINKEDIN_EMPRESA = "https://www.linkedin.com/company/design-modeling-dg/";

export const NAV = [
  { label: "Consultoría", href: "/consultoria" },
  { label: "DG BIM Intelligence", href: "/dg-bim-intelligence" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contactos" },
];

/* Catálogo de servicios por familias — estructura del mega-menú y de /consultoria */
export const FAMILIAS = [
  {
    num: "01",
    slug: "estructural",
    label: "Ingeniería Estructural",
    resumen: "Diseño sismorresistente costo-efectivo, desde la fase conceptual hasta la ingeniería de detalle.",
    servicios: [
      "Diseño de nuevas edificaciones",
      "Estudios de factibilidad estructural",
      "Evaluación de estructuras existentes",
      "Rehabilitación y reforzamiento sísmico",
      "Diseño y análisis de vibración",
      "Evaluación del desempeño estructural",
    ],
    img: "/images/revit-estructural.jpg",
  },
  {
    num: "02",
    slug: "arquitectura",
    label: "Arquitectura y Documentación",
    resumen: "Documentación arquitectónica completa, lista para trámite municipal y para construir.",
    servicios: [
      "Planos arquitectónicos y de detalle constructivo",
      "Instalaciones eléctricas, sanitarias e hidráulicas",
      "Planos según normativa municipal",
      "Planos estructurales",
      "Plantas amobladas para presentación y venta",
    ],
    img: "/images/revit-arquitectura.jpg",
  },
  {
    num: "03",
    slug: "coordinacion",
    label: "Modelado y Coordinación BIM",
    resumen: "Modelo federado de las tres disciplinas y detección sistemática de interferencias antes de obra.",
    servicios: [
      "Modelado y diseño BIM de edificios y estructuras",
      "Levantamiento BIM de edificaciones existentes",
      "BIM en sitio para gestión de cambios durante la obra",
      "Detección y resolución de interferencias",
      "Asesoría y dirección técnica del proceso",
    ],
    img: "/images/revit-coordinacion.jpg",
  },
  {
    num: "04",
    slug: "implementacion",
    label: "Implementación BIM",
    resumen: "Acompañamos a tu organización hasta que el equipo camine solo con estándares y flujos propios.",
    servicios: [
      "Diagnóstico de madurez BIM",
      "Definición de estándares y flujos de trabajo",
      "Capacitación del equipo técnico",
      "Acompañamiento del primer proyecto piloto",
      "Implantación de DG BIM Intelligence como herramienta de gestión",
    ],
    img: "/images/revit-implementacion.jpg",
  },
  {
    num: "05",
    slug: "bim-ia",
    label: "BIM + Inteligencia Artificial",
    resumen: "Nuestro plus: cada servicio se entrega con DG BIM Intelligence, el agente que razona sobre tu proyecto.",
    servicios: [
      "Auditoría del modelo con agente de IA",
      "Detección de interferencias clasificadas por severidad",
      "Control de calidad de datos del modelo",
      "Tableros por rol: modelador, coordinador, gerencia y dueño",
      "Agente especializado disponible 24/7",
    ],
    img: "/images/sw-dashboard.jpg",
    href: "/dg-bim-intelligence",
  },
];

/* Con quiénes trabajamos */
export const VERTICALES = [
  { label: "Constructoras", detalle: "Coordinación entre disciplinas, control de cambios en obra y visibilidad real del avance." },
  { label: "Promotoras e inmobiliarias", detalle: "Factibilidad, presupuestos que se sostienen y plantas de venta listas para comercializar." },
  { label: "Estudios de arquitectura", detalle: "Ingeniería estructural y documentación técnica que respeta el diseño." },
  { label: "Oficinas de ingeniería", detalle: "Capacidad BIM adicional para picos de trabajo y proyectos multidisciplinarios." },
  { label: "Propietarios de edificaciones", detalle: "Evaluación de existentes, reforzamiento y levantamiento BIM de lo construido." },
  { label: "Equipos BIM internos", detalle: "Implementación, estándares y DG BIM Intelligence como software independiente." },
];

/* Equipo — datos y fotos del documento oficial del equipo */
export const EQUIPO = [
  {
    nombre: "Dayana Calderón Brunetti",
    cargo: "Fundadora y CEO",
    foto: "/images/equipo/dayana.jpg",
    linkedin: "https://www.linkedin.com/in/dayana-calderon-brunetti-409771142/",
    bio: "Ingeniera Química. Lidera la estrategia, gestión y crecimiento de la organización, integrando innovación, tecnología y educación para el sector AEC.",
  },
  {
    nombre: "Gabriel Pantoja Linares",
    cargo: "CEO y Cofundador · Dirección Técnica BIM",
    foto: "/images/equipo/gabriel.jpg",
    linkedin: "https://www.linkedin.com/in/gabriel-pantoja-b9202a115/",
    bio: "Ingeniero Civil, especialista en estructuras y BIM Management. Dirige el rumbo técnico de cada proyecto — y su criterio de +10 años es el que entrena a DG BIM Intelligence.",
  },
  {
    nombre: "Mijail Mayorga",
    cargo: "Director de Proyectos",
    foto: "/images/equipo/mijail.jpg",
    linkedin: "https://www.linkedin.com/in/mijailmayorga/",
    bio: "Ingeniero Civil especializado en metodología BIM. Planifica, coordina y supervisa la ejecución de los proyectos, cuidando plazos, calidad y coordinación entre disciplinas.",
  },
  {
    nombre: "Ester Celeste Álvarez",
    cargo: "Arquitecta · Asistencia General",
    foto: "/images/equipo/ester.jpg",
    linkedin: "https://www.linkedin.com/in/estercalvarezt/",
    bio: "Arquitecta Urbanista (UTE). Desarrollo arquitectónico en Revit y visualización con Lumion, V-Ray y Twinmotion; soporte administrativo y de plataformas.",
  },
  {
    nombre: "Aylin Tapia Urzúa",
    cargo: "Asistencia General",
    foto: "/images/equipo/aylin.jpg",
    linkedin: "https://www.linkedin.com/in/aylin-i-tapia-4920a429b/",
    bio: "Gestiona la organización de cursos, los accesos de la comunidad y los procesos de certificación que sostienen la operación diaria.",
  },
  {
    nombre: "Camila Pinto",
    cargo: "Community Manager",
    foto: "/images/equipo/camila.jpg",
    linkedin: "https://www.linkedin.com/in/mar%C3%ADa-camila-p-2825aa243/",
    bio: "Comunicación y gestión de comunidad: la primera experiencia cercana de cada cliente con Design Modeling.",
  },
  {
    nombre: "Pilar Dávalos",
    cargo: "Asistencia de Gerencia y Posventa",
    foto: "/images/equipo/pilar.jpg",
    linkedin: "https://www.linkedin.com/in/pilar-davalos-copywriter/",
    bio: "Publicidad, gestión comercial y copywriting. Acompaña al cliente después de cada entrega para que la relación no termine con el proyecto.",
  },
];

export const REDES = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/design-modeling-dg/posts/" },
  { label: "Instagram", href: "https://www.instagram.com/design_modeling_dg/" },
  { label: "TikTok", href: "https://www.tiktok.com/@designmodelingdg" },
  { label: "Facebook", href: "https://www.facebook.com/designmodelingdg" },
  { label: "X", href: "https://x.com/DgModeling" },
];

export const AVALES = [
  { src: "/images/av1.png", alt: "Autodesk Partner" },
  { src: "/images/av2.png", alt: "Autodesk Authorized Training Center" },
  { src: "/images/av3.png", alt: "Doctrina Qualitas" },
  { src: "/images/av4.png", alt: "Sabal University" },
  { src: "/images/av5.png", alt: "Universidad de las Naciones" },
  { src: "/images/av6.png", alt: "UAIII" },
  { src: "/images/av7.png", alt: "Sello de excelencia educativa" },
  { src: "/images/av8-cype.png", alt: "CYPE Authorized Partner" },
  { src: "/images/av9-naces.png", alt: "NACES" },
  { src: "/images/av10-dq1.png", alt: "Doctrina Qualitas — Certificación" },
  { src: "/images/av11-dq2.png", alt: "Doctrina Qualitas — Acreditación" },
];

export const CLIENTES = [
  { src: "/images/cli-spi.png", alt: "SPI", dark: false },
  { src: "/images/cli-vymsa.png", alt: "VYMSA", dark: true },
  { src: "/images/cli-arconsa.png", alt: "ARCONSA — Estructuras de Acero", dark: false },
  { src: "/images/cli-sharp.png", alt: "Sharp CRM", dark: false },
  { src: "/images/cli-inflect.png", alt: "Inflect Consultoría", dark: false },
];
