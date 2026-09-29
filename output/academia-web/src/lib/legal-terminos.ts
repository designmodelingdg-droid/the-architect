import { RAZON_SOCIAL, RUC, DIRECCION, EMAIL, TELEFONO_VISIBLE, CAMPUS } from "./site";

/* Texto legal de la academia: lo leen la página HTML y su gemelo en markdown. */
export const ACTUALIZADO_LEGAL = "septiembre de 2026";

export const TERMINOS: [string, string[]][] = [
  ["1. Identificación", [
    `Este sitio web es operado por ${RAZON_SOCIAL} (en adelante, «Design Modeling Academy» o «la escuela»), RUC ${RUC}, con domicilio en ${DIRECCION}. Contacto: ${EMAIL} · ${TELEFONO_VISIBLE}.`,
  ]],
  ["2. Objeto", [
    "Design Modeling Academy ofrece programas de formación en línea en metodología BIM, ingeniería estructural, arquitectura, software de diseño y cálculo e inteligencia artificial aplicada: másteres, diplomados, especializaciones, cursos, rutas de aprendizaje, mentorías y guías. Este sitio describe los programas, sus credenciales y precios, y permite iniciar la matrícula o agendar una cita informativa.",
  ]],
  ["3. Uso del sitio", [
    "El usuario se compromete a utilizar el sitio de forma lícita, sin vulnerar derechos de terceros ni afectar su funcionamiento. Queda prohibida la reproducción total o parcial de los contenidos con fines comerciales sin autorización escrita de la escuela.",
  ]],
  ["4. Matrícula y acceso al campus", [
    `La matrícula se formaliza en la plataforma de pago y campus virtual de la escuela, enlazada desde cada programa. Al completarla, el alumno recibe acceso al campus (${CAMPUS}) con las clases en vivo, las grabaciones y el material del programa, por el tiempo que indique cada ficha.`,
    "El acceso es personal e intransferible. Compartir credenciales o redistribuir grabaciones y material del campus es causa de suspensión del acceso sin derecho a devolución.",
  ]],
  ["5. Precios y formas de pago", [
    "Los precios se publican en dólares de los Estados Unidos (USD) salvo indicación expresa de otra moneda o país, e incluyen la certificación del programa cuando la ficha lo indica. Las opciones de cuotas o preventa se detallan en cada programa. La suscripción Design Premium da acceso a los cursos incluidos en ella y excluye los programas que su ficha indica.",
    "La cita informativa es gratuita y no genera obligación de matricularse.",
  ]],
  ["6. Cancelaciones y devoluciones", [
    "Las condiciones de cancelación, cambio de programa y devolución se entregan por escrito antes de la matrícula y forman parte del acuerdo con cada alumno. Si tienes dudas sobre ellas, escríbenos antes de matricularte.",
  ]],
  ["7. Certificados y títulos", [
    "Cada programa indica qué credencial otorga y quién la emite. Los certificados de la escuela llevan código de verificación. Los títulos y diplomas emitidos por instituciones aliadas (universidades, Autodesk, CYPE u otras) se rigen por los requisitos de cada emisor, que pueden incluir asistencia mínima, evaluaciones aprobadas o tasas de emisión indicadas en la ficha del programa.",
  ]],
  ["8. Propiedad intelectual", [
    "Las clases, grabaciones, materiales, marcas, logotipos, textos e imágenes de este sitio y del campus pertenecen a la escuela o se usan con autorización de sus titulares. El alumno puede usarlos para su formación personal; cualquier otro uso requiere autorización escrita.",
  ]],
  ["9. Limitación de responsabilidad", [
    "La formación tiene fines educativos. La escuela no responde por decisiones profesionales tomadas por el alumno en sus propios proyectos con base en el contenido de los programas, ni por interrupciones de servicios de terceros (plataforma del campus, videollamadas, pasarelas de pago) ajenas a su control razonable.",
  ]],
  ["10. Enlaces a terceros", [
    "El sitio enlaza a servicios de terceros (plataforma del campus y pagos, WhatsApp, LinkedIn, YouTube, Vimeo y el sitio de Design Modeling DG). La escuela no controla esos sitios ni responde por sus contenidos o políticas.",
  ]],
  ["11. Modificaciones", [
    "La escuela puede actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página, con su fecha de actualización.",
  ]],
  ["12. Ley aplicable", [
    "Estos términos se rigen por las leyes de la República del Ecuador. Cualquier controversia se someterá a los jueces competentes de Quito.",
  ]],
];

