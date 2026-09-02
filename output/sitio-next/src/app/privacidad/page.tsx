import type { Metadata } from "next";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de protección de datos personales de MODELING-DG S.A.S.",
};

const SECCIONES: [string, string[]][] = [
  [
    "1. Responsable del tratamiento",
    [
      "MODELING-DG S.A.S. («Design Modeling DG»), RUC 1793148549001, Juana Terrazas N71-154, Quito, Ecuador. Contacto para asuntos de datos personales: info@dgdesignmodeling.com.",
    ],
  ],
  [
    "2. Datos que recogemos",
    [
      "Recogemos los datos que tú nos entregas al escribirnos o agendar un diagnóstico: nombre, empresa, correo electrónico, teléfono y la información del proyecto que decidas compartir (por formulario, correo o WhatsApp). El sitio no solicita datos sensibles.",
    ],
  ],
  [
    "3. Para qué los usamos",
    [
      "Usamos tus datos para responder tu consulta, agendar y prestar el diagnóstico, preparar propuestas, ejecutar los servicios contratados y, si nos lo autorizas, enviarte información sobre nuestros servicios. No vendemos ni alquilamos datos personales a terceros.",
    ],
  ],
  [
    "4. Base legal",
    [
      "Tratamos tus datos con base en tu consentimiento (al enviarnos tu información), en la ejecución de medidas precontractuales o contractuales que solicitas, y en el interés legítimo de mantener la relación comercial, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
    ],
  ],
  [
    "5. Con quién los compartimos",
    [
      "Solo con proveedores que necesitamos para operar: alojamiento del sitio (Vercel), reproducción de video (Vimeo), mensajería (WhatsApp) y nuestro CRM de gestión de contactos. Estos proveedores tratan los datos por cuenta nuestra y con sus propias medidas de seguridad. No se realizan transferencias distintas a las necesarias para estos servicios.",
    ],
  ],
  [
    "6. Información de proyectos",
    [
      "Los archivos técnicos que compartes para un diagnóstico o servicio (planos, modelos BIM, presupuestos) se tratan como información confidencial del proyecto, se usan solo para el fin acordado y se eliminan o devuelven cuando lo solicitas al cierre del trabajo.",
    ],
  ],
  [
    "7. Conservación",
    [
      "Conservamos los datos de contacto mientras dure la relación comercial o hasta que pidas su eliminación, y los datos vinculados a contratos durante los plazos legales aplicables.",
    ],
  ],
  [
    "8. Tus derechos",
    [
      "Puedes acceder a tus datos, rectificarlos, actualizarlos, pedir su eliminación, oponerte al tratamiento, limitarlo o solicitar su portabilidad escribiendo a info@dgdesignmodeling.com. Atenderemos tu solicitud en los plazos que establece la ley ecuatoriana. También puedes reclamar ante la Autoridad de Protección de Datos Personales.",
    ],
  ],
  [
    "9. Cookies y analítica",
    [
      "El sitio usa únicamente las cookies técnicas necesarias para funcionar y métricas agregadas de la plataforma de alojamiento. Los videos embebidos de Vimeo se cargan en modo de no seguimiento (Do Not Track).",
    ],
  ],
  [
    "10. Cambios a esta política",
    [
      "Publicaremos aquí cualquier actualización de esta política con su fecha. Si el cambio es sustancial, lo comunicaremos por los canales habituales.",
    ],
  ],
];

export default function Privacidad() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <span className="tag-tech">Legal</span>
        <h1 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Política de privacidad</h1>
        <p className="mt-3 text-[14px] text-tinta-suave">Última actualización: septiembre de 2026</p>
        <div className="mt-8 space-y-7">
          {SECCIONES.map(([t, ps]) => (
            <section key={t}>
              <h2 className="text-lg font-bold text-navy">{t}</h2>
              {ps.map((p) => (
                <p key={p.slice(0, 40)} className="mt-2 leading-relaxed text-tinta-suave">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
