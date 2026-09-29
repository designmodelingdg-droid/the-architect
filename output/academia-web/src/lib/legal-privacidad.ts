import { RAZON_SOCIAL, RUC, DIRECCION, EMAIL } from "./site";

/* Texto legal de la academia: lo leen la página HTML y su gemelo en markdown. */
export const ACTUALIZADO_LEGAL = "septiembre de 2026";

export const PRIVACIDAD: [string, string[]][] = [
  ["1. Responsable del tratamiento", [
    `${RAZON_SOCIAL} («Design Modeling Academy»), RUC ${RUC}, ${DIRECCION}. Contacto para asuntos de datos personales: ${EMAIL}.`,
  ]],
  ["2. Datos que recogemos", [
    "Recogemos los datos que tú nos entregas al escribirnos, agendar una cita informativa o matricularte: nombre, correo electrónico, teléfono, país, profesión y el programa que te interesa. Al matricularte, la plataforma del campus y la pasarela de pago recogen además los datos necesarios para el cobro y la emisión del certificado. El sitio no solicita datos sensibles.",
  ]],
  ["3. Para qué los usamos", [
    "Usamos tus datos para responder tu consulta, agendar la cita informativa, gestionar tu matrícula y tu acceso al campus, emitir certificados y títulos con las instituciones aliadas que correspondan, y, si nos lo autorizas, enviarte información sobre programas, eventos y descuentos. No vendemos ni alquilamos datos personales a terceros.",
  ]],
  ["4. Base legal", [
    "Tratamos tus datos con base en tu consentimiento (al enviarnos tu información o suscribirte), en la ejecución del contrato de formación que solicitas, y en el interés legítimo de mantener la relación con nuestros alumnos, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
  ]],
  ["5. Con quién los compartimos", [
    "Solo con los proveedores que necesitamos para operar: alojamiento del sitio (Vercel), plataforma del campus, CRM y pasarela de pago, videollamadas (Zoom), mensajería (WhatsApp), reproducción de video (Vimeo y YouTube), y las instituciones que emiten los títulos y certificados de cada programa (por ejemplo Autodesk, Certiport, CYPE, Doctrinas Qualitas, ISTE o Sabal University), únicamente con los datos necesarios para emitirlos. Estos proveedores tratan los datos por cuenta nuestra y con sus propias medidas de seguridad.",
  ]],
  ["6. Conservación", [
    "Conservamos los datos de contacto mientras dure la relación con la escuela o hasta que pidas su eliminación. Los datos vinculados a matrículas, pagos y certificados emitidos se conservan durante los plazos legales aplicables y el tiempo necesario para poder verificar un certificado.",
  ]],
  ["7. Tus derechos", [
    `Puedes acceder a tus datos, rectificarlos, actualizarlos, pedir su eliminación, oponerte al tratamiento, limitarlo o solicitar su portabilidad escribiendo a ${EMAIL}. Atenderemos tu solicitud en los plazos que establece la ley ecuatoriana. También puedes reclamar ante la Autoridad de Protección de Datos Personales.`,
  ]],
  ["8. Cookies y analítica", [
    "El sitio usa únicamente las cookies técnicas necesarias para funcionar y métricas agregadas de la plataforma de alojamiento. Los formularios, el calendario de citas y el chat embebidos son servicios de nuestro CRM y pueden usar sus propias cookies técnicas. Los videos embebidos se cargan en modo de no seguimiento cuando el proveedor lo permite.",
  ]],
  ["9. Cambios a esta política", [
    "Publicaremos aquí cualquier actualización de esta política con su fecha. Si el cambio es sustancial, lo comunicaremos por los canales habituales.",
  ]],
];

